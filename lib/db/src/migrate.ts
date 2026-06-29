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

export async function runMigrations(): Promise<void> {
  await ensureMigrationsTable();

  const journal = readJournal();
  const entry0 = journal.entries[0];
  const entry1 = journal.entries[1];
  const entry7 = journal.entries[7];
  const entry8 = journal.entries[8];
  const entry9 = journal.entries[9];
  const entry10 = journal.entries[10];
  const entry13 = journal.entries[13];
  const entry15 = journal.entries[15];
  const entry16 = journal.entries[16];
  const entry21 = journal.entries[21];
  const entry22 = journal.entries[22];
  const entry23 = journal.entries[23];

  await applyMigration0000(entry0.when);
  await applyMigration0001(entry1.when);

  // Migration 0007: trust layer tables (trust_groups, trust_tiers, trust_tier_members).
  // Migrations 0002–0006 were applied to existing databases via drizzle-kit migrate
  // before this custom runner was extended. The CREATE TABLE IF NOT EXISTS guards
  // in 0007 make it safe to re-run against any state.
  if (entry7) {
    await runSqlMigration("0007_trust_layer", entry7.when, "0007 (trust layer)", true);
  }

  // Migration 0008: NPN (The Native Plant Nursery) tables (npn_species, npn_name_aliases).
  // CREATE TABLE IF NOT EXISTS guards make it safe to run against a DB where the
  // tables were already created via direct SQL before this migration was added.
  if (entry8) {
    await runSqlMigration("0008_npn", entry8.when, "0008 (npn)", true);
  }

  // Migration 0009: change npn_species.range_michigan from jsonb to text[].
  // Safe to run: the table was empty when this migration was authored (import
  // requires live network access to nativeplant.com).
  if (entry9) {
    await runSqlMigration("0009_npn_range_text_array", entry9.when, "0009 (npn range text[])", false);
  }

  // Migration 0010: add flower_color and physiography columns to npn_species.
  // These fields come from the Zope/MySQL report endpoint (not individual pages).
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (entry10) {
    await runSqlMigration("0010_npn_flower_color_physiography", entry10.when, "0010 (npn flower_color + physiography)", false);
  }

  // Migration 0013: Envelope Contract v1 columns on ferns_sources.
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (entry13) {
    await runSqlMigration("0013_envelope_v1_columns", entry13.when, "0013 (envelope v1 columns)", false);
  }

  // Migration 0015: GBIF cache re-architecture (EDP rewire).
  // TRUNCATEs all four legacy GBIF cache tables (rows cannot migrate to the new
  // upstream_response schema), drops old decomposed columns, adds upstream_response
  // (jsonb NOT NULL) to gbif_name_matches/synonyms/vernacular_names/occurrences,
  // and creates two new tables: gbif_species and gbif_species_searches.
  // DROP COLUMN IF EXISTS guards make it safe to re-run; the TRUNCATE and ADD COLUMN
  // are idempotent once the migration has been applied.
  if (entry15) {
    await runSqlMigration("0015_gbif_cache_rearch", entry15.when, "0015 (gbif cache rearch)", false);
  }

  // Migration 0016: Add individual data columns to natureserve_species_cache.
  // The table was originally created with raw_response (jsonb); this migration
  // adds the individual extracted fields. ADD COLUMN IF NOT EXISTS guards make
  // it safe to re-run.
  if (entry16) {
    await runSqlMigration("0016_natureserve_species_cache_columns", entry16.when, "0016 (natureserve species cache columns)", false);
  }

  // Migration 0021: Michigan Flora EDP refactor.
  // Drops general_summary/technical_details from three existing miflora cache tables.
  // Creates four new tables: miflora_flora_search_cache, miflora_spec_text_cache,
  // miflora_synonyms_cache, miflora_pimage_cache.
  // IF NOT EXISTS and DROP COLUMN IF EXISTS guards make it safe to re-run.
  if (entry21) {
    await runSqlMigration("0021_miflora_edp_refactor", entry21.when, "0021 (miflora EDP refactor)", false);
  }

  // Migration 0022: USDA Plants EDP refactor.
  // Drops usda_plants_name_matches table (orphaned by removal of composite route).
  // Drops general_summary/technical_details from usda_plants_profiles.
  // DROP TABLE IF EXISTS and DROP COLUMN IF EXISTS guards make it safe to re-run.
  if (entry22) {
    await runSqlMigration("0022_usda_plants_edp_refactor", entry22.when, "0022 (USDA Plants EDP refactor)", false);
  }

  // Migration 0023: Universal FQA EDP refactor.
  // Adds upstream_response (jsonb), upstream_url (text), fetched_at (timestamptz)
  // to universal_fqa_databases to support verbatim JSON cache storage.
  // ADD COLUMN IF NOT EXISTS guards make it safe to re-run.
  if (entry23) {
    await runSqlMigration("0023_universal_fqa_edp_refactor", entry23.when, "0023 (Universal FQA EDP refactor)", false);
  }

  console.info("[migrate] All migrations complete.");
}
