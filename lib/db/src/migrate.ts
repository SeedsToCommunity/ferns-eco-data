import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { db, pool } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolder = path.join(__dirname, "drizzle");

// ─── helpers ──────────────────────────────────────────────────────────────────

function readJournal(): { entries: Array<{ when: number; tag: string }> } {
  return JSON.parse(
    readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf-8")
  );
}

function hashMigration(tag: string): string {
  const content = readFileSync(
    path.join(migrationsFolder, `${tag}.sql`),
    "utf-8"
  );
  return createHash("sha256").update(content).digest("hex");
}

async function ensureMigrationsTable(): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);
}

async function isMigrationApplied(tag: string): Promise<boolean> {
  const hash = hashMigration(tag);
  const result = await db.execute(
    sql`SELECT 1 FROM "__drizzle_migrations" WHERE hash = ${hash} LIMIT 1`
  );
  return result.rows.length > 0;
}

async function markMigrationApplied(
  tag: string,
  when: number
): Promise<void> {
  const hash = hashMigration(tag);
  await db.execute(sql`
    INSERT INTO "__drizzle_migrations" (hash, created_at)
    SELECT ${hash}, ${when}
    WHERE NOT EXISTS (
      SELECT 1 FROM "__drizzle_migrations" WHERE hash = ${hash}
    )
  `);
}

async function tableExists(tableName: string): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = ${tableName}
    LIMIT 1
  `);
  return result.rows.length > 0;
}

// ─── generic SQL migration runner ─────────────────────────────────────────────

/**
 * Run a SQL migration file statement-by-statement (split on double-newline
 * between CREATE/ALTER statements). Each statement runs in its own transaction
 * with a lock_timeout so it fails fast rather than hanging startup.
 *
 * @param failFast - When true (default for schema-creating migrations), any
 *   statement failure throws immediately and the migration is NOT marked as
 *   applied, so the next startup will retry. When false (for cleanup/alter
 *   migrations), failures are logged as warnings and the migration is still
 *   marked applied so it is not retried.
 */
async function runSqlMigration(
  tag: string,
  when: number,
  label: string,
  failFast = false
): Promise<void> {
  const alreadyApplied = await isMigrationApplied(tag);
  if (alreadyApplied) {
    console.info(`[migrate] ${label} already tracked — skipping.`);
    return;
  }

  console.info(`[migrate] Running migration ${label}...`);

  const content = readFileSync(
    path.join(migrationsFolder, `${tag}.sql`),
    "utf-8"
  );

  // Split on statement-breakpoint markers OR on blank lines between statements.
  const statements = content
    .split(/-->[ \t]*statement-breakpoint|\n{2,}(?=\s*(?:CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|GRANT|REVOKE))/i)
    .map((s) => s.trim())
    .filter(Boolean);

  let succeeded = 0;
  let skipped = 0;

  for (const statement of statements) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SET LOCAL lock_timeout = '8s'");
      await client.query("SET LOCAL statement_timeout = '15s'");
      await client.query(statement);
      await client.query("COMMIT");
      succeeded++;
    } catch (err: unknown) {
      await client.query("ROLLBACK").catch(() => {});
      const msg = err instanceof Error ? err.message : String(err);
      if (failFast) {
        // Do NOT mark the migration applied — allow retry on next startup.
        throw new Error(`[migrate] ${label} failed (statement: ${msg.slice(0, 200)})`);
      }
      console.warn(
        `[migrate] ${label} statement skipped (non-fatal): ${msg.slice(0, 120)}`
      );
      skipped++;
    } finally {
      client.release();
    }
  }

  console.info(
    `[migrate] ${label} complete — ${succeeded} succeeded, ${skipped} skipped.`
  );
  await markMigrationApplied(tag, when);
}

// ─── migration 0000 ───────────────────────────────────────────────────────────

async function applyMigration0000(when: number): Promise<void> {
  const alreadyApplied = await isMigrationApplied("0000_acoustic_mauler");
  if (alreadyApplied) {
    console.info("[migrate] 0000 already tracked — skipping.");
    return;
  }

  const baseExists = await tableExists("bonap_maps");
  if (baseExists) {
    // Tables are already in the DB (created by a previous deployment without
    // migration tracking). Just mark 0000 as applied.
    console.info(
      "[migrate] Base schema already exists — marking 0000 as applied."
    );
    await markMigrationApplied("0000_acoustic_mauler", when);
    return;
  }

  // Fresh database — let Drizzle create everything.
  console.info("[migrate] Running migration 0000...");
  await migrate(db, { migrationsFolder });
  console.info("[migrate] Migration 0000 complete.");
}

// ─── migration 0001 ───────────────────────────────────────────────────────────

/**
 * Run each SQL statement in migration 0001 individually so that a single
 * blocked DDL statement (e.g. waiting for a stale lock) cannot hang the
 * entire startup. Each statement runs in its own transaction with a
 * lock_timeout so it fails fast rather than waiting indefinitely.
 */
async function applyMigration0001(when: number): Promise<void> {
  const alreadyApplied = await isMigrationApplied("0001_cleanup_old_schema");
  if (alreadyApplied) {
    console.info("[migrate] 0001 already tracked — skipping.");
    return;
  }

  console.info("[migrate] Running migration 0001 statements...");

  const content = readFileSync(
    path.join(migrationsFolder, "0001_cleanup_old_schema.sql"),
    "utf-8"
  );

  const statements = content
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  let succeeded = 0;
  let skipped = 0;

  for (const statement of statements) {
    // Acquire a raw client so we can set per-statement timeouts outside of
    // Drizzle's transaction wrapper.
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      // Fail fast if we can't get the lock — stale locks from previous crashed
      // deployments should not block startup forever.
      await client.query("SET LOCAL lock_timeout = '8s'");
      await client.query("SET LOCAL statement_timeout = '15s'");
      await client.query(statement);
      await client.query("COMMIT");
      succeeded++;
    } catch (err: unknown) {
      await client.query("ROLLBACK").catch(() => {});
      const msg = err instanceof Error ? err.message : String(err);
      // Log a warning but keep going — most 0001 steps are cleanup that the
      // app can tolerate not having run.
      console.warn(
        `[migrate] 0001 statement skipped (non-fatal): ${msg.slice(0, 120)}`
      );
      skipped++;
    } finally {
      client.release();
    }
  }

  console.info(
    `[migrate] 0001 complete — ${succeeded} succeeded, ${skipped} skipped.`
  );
  await markMigrationApplied("0001_cleanup_old_schema", when);
}

// ─── public entry point ───────────────────────────────────────────────────────

/**
 * The complete ordered set of migration tags wired into this runner.
 * Any tag present in _journal.json but absent from this set will trigger a
 * startup warning so newly authored migrations cannot silently go unapplied.
 *
 * When adding a new migration:
 *   1. Add the tag to WIRED_TAGS (in journal order).
 *   2. Add the corresponding runSqlMigration() call inside runMigrations().
 */
const WIRED_TAGS = new Set([
  "0000_acoustic_mauler",
  "0001_cleanup_old_schema",
  // 0002–0006 were applied via drizzle-kit before this custom runner existed.
  // They are not wired here because applyMigration0000 invokes drizzle's built-in
  // migrate() on a fresh DB (which runs all SQL files including 0002–0006), and on
  // existing DBs the tables those migrations create already exist.
  "0007_trust_layer",
  "0008_npn",
  "0009_npn_range_text_array",
  "0010_npn_flower_color_physiography",
  "0011_inat_reference_tables",
  "0012_licenses_field_rename",
  "0013_envelope_v1_columns",
  "0014_permission_granted",
  "0015_gbif_cache_rearch",
  "0016_natureserve_species_cache_columns",
  "0017_remove_deprecated_registry_column",
  "0018_npn_column_corrections",
  "0019_drop-npn-tables",
  "0020_drop-bonap-provenance-text-columns",
  "0021_miflora_edp_refactor",
  "0022_usda_plants_edp_refactor",
  "0023_universal_fqa_edp_refactor",
  "0024_natureserve_edp_refactor",
  "0025_natureserve_drop_stale_columns",
]);

/** Tags intentionally excluded from the runner (applied by the drizzle-kit
 * built-in migrator on fresh databases via applyMigration0000). */
const DRIZZLE_KIT_ONLY_TAGS = new Set([
  "0002_species_page_text_cache",
  "0003_usda_plants",
  "0004_lbj_url_cache",
  "0005_lbj_usda_symbol",
  "0006_lbj_provenance",
]);

export async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const journal = readJournal();

  // Index journal entries by position for easy lookup.
  const byIdx = (i: number) => journal.entries[i];

  await applyMigration0000(byIdx(0).when);
  await applyMigration0001(byIdx(1).when);

  // Migration 0007: trust layer tables (trust_groups, trust_tiers, trust_tier_members).
  // Migrations 0002–0006 were applied to existing databases via drizzle-kit migrate
  // before this custom runner was extended. The CREATE TABLE IF NOT EXISTS guards
  // in 0007 make it safe to re-run against any state.
  if (byIdx(7)) {
    await runSqlMigration("0007_trust_layer", byIdx(7).when, "0007 (trust layer)", true);
  }

  // Migration 0008: NPN (The Native Plant Nursery) tables (npn_species, npn_name_aliases).
  // CREATE TABLE IF NOT EXISTS guards make it safe to run against a DB where the
  // tables were already created via direct SQL before this migration was added.
  if (byIdx(8)) {
    await runSqlMigration("0008_npn", byIdx(8).when, "0008 (npn)", true);
  }

  // Migration 0009: change npn_species.range_michigan from jsonb to text[].
  // Safe to run: the table was empty when this migration was authored (import
  // requires live network access to nativeplant.com).
  if (byIdx(9)) {
    await runSqlMigration("0009_npn_range_text_array", byIdx(9).when, "0009 (npn range text[])", false);
  }

  // Migration 0010: add flower_color and physiography columns to npn_species.
  // These fields come from the Zope/MySQL report endpoint (not individual pages).
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (byIdx(10)) {
    await runSqlMigration("0010_npn_flower_color_physiography", byIdx(10).when, "0010 (npn flower_color + physiography)", false);
  }

  // Migration 0011: iNaturalist reference tables.
  // Creates inat_controlled_terms (permanently cached annotation term IDs) and
  // inat_taxon_by_id (30-day cached full taxon records by numeric ID).
  // CREATE TABLE IF NOT EXISTS guards make it safe to re-run.
  if (byIdx(11)) {
    await runSqlMigration("0011_inat_reference_tables", byIdx(11).when, "0011 (inat reference tables)", true);
  }

  // Migration 0012: ferns_sources license column rename.
  // Drops permission_granted (boolean) and permission_status (text), adds
  // licenses (text[]) and license_notes (text). DROP/ADD IF EXISTS guards make
  // it safe to re-run.
  if (byIdx(12)) {
    await runSqlMigration("0012_licenses_field_rename", byIdx(12).when, "0012 (licenses field rename)", false);
  }

  // Migration 0013: Envelope Contract v1 columns on ferns_sources.
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (byIdx(13)) {
    await runSqlMigration("0013_envelope_v1_columns", byIdx(13).when, "0013 (envelope v1 columns)", false);
  }

  // Migration 0014: per-source permission_granted boolean on ferns_sources.
  // Re-adds the permission_granted column (boolean NOT NULL) with a backfill
  // of true so seeds can overwrite with the correct per-source value.
  // ADD COLUMN IF NOT EXISTS guard makes it safe to re-run.
  if (byIdx(14)) {
    await runSqlMigration("0014_permission_granted", byIdx(14).when, "0014 (permission_granted)", false);
  }

  // Migration 0015: GBIF cache re-architecture (EDP rewire).
  // TRUNCATEs all four legacy GBIF cache tables (rows cannot migrate to the new
  // upstream_response schema), drops old decomposed columns, adds upstream_response
  // (jsonb NOT NULL) to gbif_name_matches/synonyms/vernacular_names/occurrences,
  // and creates two new tables: gbif_species and gbif_species_searches.
  // DROP COLUMN IF EXISTS guards make it safe to re-run; the TRUNCATE and ADD COLUMN
  // are idempotent once the migration has been applied.
  if (byIdx(15)) {
    await runSqlMigration("0015_gbif_cache_rearch", byIdx(15).when, "0015 (gbif cache rearch)", false);
  }

  // Migration 0016: Add individual data columns to natureserve_species_cache.
  // The table was originally created with raw_response (jsonb); this migration
  // adds the individual extracted fields. ADD COLUMN IF NOT EXISTS guards make
  // it safe to re-run.
  if (byIdx(16)) {
    await runSqlMigration("0016_natureserve_species_cache_columns", byIdx(16).when, "0016 (natureserve species cache columns)", false);
  }

  // Migration 0017: drop deprecated explorer_url column from ferns_sources.
  // The registry explorer UI was removed; this field is no longer meaningful.
  // DROP COLUMN IF EXISTS guard makes it safe to re-run.
  if (byIdx(17)) {
    await runSqlMigration("0017_remove_deprecated_registry_column", byIdx(17).when, "0017 (remove deprecated registry column)", false);
  }

  // Migration 0018: NPN column corrections.
  // Drops the unused habitat column, renames physiography → growth_form, and
  // adds conservatism_coefficient, wetness_coefficient, shade_coefficient.
  // IF EXISTS / IF NOT EXISTS guards make it safe to re-run.
  // Note: 0019 drops the npn_species table entirely, so on a DB that already
  // has 0019 applied these statements will fail non-fatally and be skipped.
  if (byIdx(18)) {
    await runSqlMigration("0018_npn_column_corrections", byIdx(18).when, "0018 (npn column corrections)", false);
  }

  // Migration 0019: drop NPN tables entirely (npn_name_aliases, npn_species).
  // The NPN data source has been removed from the app. DROP TABLE IF EXISTS
  // guards make it safe to re-run.
  if (byIdx(19)) {
    await runSqlMigration("0019_drop-npn-tables", byIdx(19).when, "0019 (drop npn tables)", false);
  }

  // Migration 0020: drop stale provenance text columns from bonap_maps.
  // Drops general_summary and technical_details (flat-struct violation).
  // The SQL has no IF EXISTS guard, so on a DB where those columns are already
  // gone the statements will fail non-fatally and be skipped.
  if (byIdx(20)) {
    await runSqlMigration("0020_drop-bonap-provenance-text-columns", byIdx(20).when, "0020 (drop bonap provenance text columns)", false);
  }

  // Migration 0021: Michigan Flora EDP refactor.
  // Drops general_summary/technical_details from three existing miflora cache tables.
  // Creates four new tables: miflora_flora_search_cache, miflora_spec_text_cache,
  // miflora_synonyms_cache, miflora_pimage_cache.
  // IF NOT EXISTS and DROP COLUMN IF EXISTS guards make it safe to re-run.
  if (byIdx(21)) {
    await runSqlMigration("0021_miflora_edp_refactor", byIdx(21).when, "0021 (miflora EDP refactor)", false);
  }

  // Migration 0022: USDA Plants EDP refactor.
  // Drops usda_plants_name_matches table (orphaned by removal of composite route).
  // Drops general_summary/technical_details from usda_plants_profiles.
  // DROP TABLE IF EXISTS and DROP COLUMN IF EXISTS guards make it safe to re-run.
  if (byIdx(22)) {
    await runSqlMigration("0022_usda_plants_edp_refactor", byIdx(22).when, "0022 (USDA Plants EDP refactor)", false);
  }

  // Migration 0023: Universal FQA EDP refactor.
  // Adds upstream_response (jsonb), upstream_url (text), fetched_at (timestamptz)
  // to universal_fqa_databases to support verbatim JSON cache storage.
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (byIdx(23)) {
    await runSqlMigration("0023_universal_fqa_edp_refactor", byIdx(23).when, "0023 (Universal FQA EDP refactor)", false);
  }

  // Migration 0024: NatureServe EDP refactor.
  // Adds upstream_response (jsonb, nullable) to natureserve_species_cache and
  // natureserve_ecosystems_cache. Creates new natureserve_taxon_cache table.
  // ADD COLUMN IF NOT EXISTS and CREATE TABLE IF NOT EXISTS guards make it safe to re-run.
  if (byIdx(24)) {
    await runSqlMigration("0024_natureserve_edp_refactor", byIdx(24).when, "0024 (NatureServe EDP refactor)", false);
  }

  // Migration 0025: Drop stale flat-struct columns from NatureServe cache tables.
  // natureserve_species_cache: drops 20 columns added in 0016 (scientific_name,
  // common_name, global_rank, rounded_global_rank, national_rank,
  // rounded_national_rank, state_code, state_rank, rounded_state_rank,
  // iucn_category, iucn_description, federal_status, federal_status_description,
  // state_status, cites_description, cosewic_code, cosewic_description,
  // natureserve_url, element_global_id, raw_summary). These were never written
  // after Task B switched the route handlers to verbatim upstream_response storage.
  // natureserve_ecosystems_cache: drops results and result_count (same reason).
  // DROP COLUMN IF EXISTS guards make every statement idempotent.
  if (byIdx(25)) {
    await runSqlMigration("0025_natureserve_drop_stale_columns", byIdx(25).when, "0025 (NatureServe drop stale columns)", false);
  }

  console.info("[migrate] All migrations complete.");

  // ─── startup guard: warn on unwired journal entries ───────────────────────
  // Any migration tag that appears in the journal but is not in WIRED_TAGS (and
  // is not in the intentional drizzle-kit-only exclusion list) means a newly
  // authored migration was never wired into this runner.  Log a prominent
  // warning so it is caught before it silently breaks dependent routes.
  const unwired: string[] = [];
  for (const entry of journal.entries) {
    if (!WIRED_TAGS.has(entry.tag) && !DRIZZLE_KIT_ONLY_TAGS.has(entry.tag)) {
      unwired.push(entry.tag);
    }
  }
  if (unwired.length > 0) {
    console.warn(
      "[migrate] ⚠️  UNWIRED MIGRATIONS DETECTED — the following journal " +
      "entries are not wired into runMigrations() and will NEVER be applied. " +
      "Add them to WIRED_TAGS and call runSqlMigration() in the correct " +
      "position before deploying:\n" +
      unwired.map((t) => `  - ${t}`).join("\n")
    );
  }
}
