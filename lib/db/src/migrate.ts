import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { db } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolder = path.join(__dirname, "drizzle");

/**
 * Check whether Drizzle's migration tracking table exists and already has
 * migration 0000 recorded. Returns true if 0000 is tracked.
 */
async function isMigration0000Tracked(): Promise<boolean> {
  try {
    // If the tracking table doesn't exist yet this will throw.
    const result = await db.execute(sql`
      SELECT COUNT(*) AS count
      FROM "__drizzle_migrations"
    `);
    const count = Number((result.rows[0] as Record<string, unknown>).count);
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Check whether the base schema tables already exist in the database (i.e. a
 * previous deployment applied them without creating the tracking table).
 */
async function baseSchemaExists(): Promise<boolean> {
  const result = await db.execute(sql`
    SELECT COUNT(*) AS count
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'bonap_maps'
  `);
  return Number((result.rows[0] as Record<string, unknown>).count) > 0;
}

/**
 * Insert migration 0000 into Drizzle's tracking table so that the migrator
 * skips it on the next run. Safe to call when the table already has an entry.
 */
async function markMigration0000Applied(): Promise<void> {
  const sqlContent = readFileSync(
    path.join(migrationsFolder, "0000_acoustic_mauler.sql"),
    "utf-8"
  );
  const hash = createHash("sha256").update(sqlContent).digest("hex");

  // Read the journal to get 0000's exact "when" timestamp. Drizzle decides
  // which migrations to run by comparing created_at to each migration's
  // folderMillis (= journal.when). Inserting 0000's exact timestamp means:
  //   0000.when < 0000.when  → false → skip 0000 ✓
  //   0000.when < 0001.when  → true  → run  0001 ✓
  const journal = JSON.parse(
    readFileSync(path.join(migrationsFolder, "meta/_journal.json"), "utf-8")
  ) as { entries: Array<{ when: number }> };
  const migration0000When = journal.entries[0].when;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  await db.execute(sql`
    INSERT INTO "__drizzle_migrations" (hash, created_at)
    SELECT ${hash}, ${migration0000When}
    WHERE NOT EXISTS (
      SELECT 1 FROM "__drizzle_migrations"
    )
  `);

  console.info("[migrate] Migration 0000 marked as applied in tracking table.");
}

export async function runMigrations(): Promise<void> {
  const tracked = await isMigration0000Tracked();

  if (!tracked && (await baseSchemaExists())) {
    // The database already has the base schema from a prior deployment but
    // Drizzle's tracking table is missing or empty. Mark 0000 as applied so
    // that migrate() skips it and only runs newer (pending) migrations.
    console.info(
      "[migrate] Base schema found without migration tracking. " +
        "Marking migration 0000 as applied before running pending migrations."
    );
    await markMigration0000Applied();
  }

  await migrate(db, { migrationsFolder });
}
