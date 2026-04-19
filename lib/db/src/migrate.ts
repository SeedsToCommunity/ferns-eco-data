import { migrate } from "drizzle-orm/node-postgres/migrator";
import { sql } from "drizzle-orm";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { db } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Migrations folder is expected to be co-located with the running file.
 *
 * In development (built to artifacts/api-server/dist/):
 *   The build step copies lib/db/drizzle/ → artifacts/api-server/dist/drizzle/
 *   At runtime, __dirname = .../dist/, so migrationsFolder = .../dist/drizzle/
 */
const migrationsFolder = path.join(__dirname, "drizzle");

/**
 * Bootstrap Drizzle's migration tracking table and mark migration 0000 as
 * applied. Used when the base schema already exists (e.g. carried over from a
 * previous deployment) but the tracking table is missing or empty, which would
 * cause the migrator to re-attempt creating tables that already exist.
 */
async function bootstrapMigration0000(): Promise<void> {
  const sqlContent = readFileSync(
    path.join(migrationsFolder, "0000_acoustic_mauler.sql"),
    "utf-8"
  );
  const hash = createHash("sha256").update(sqlContent).digest("hex");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  await db.execute(sql`
    INSERT INTO "__drizzle_migrations" (hash, created_at)
    SELECT ${hash}, ${Date.now()}
    WHERE NOT EXISTS (
      SELECT 1 FROM "__drizzle_migrations" WHERE hash = ${hash}
    )
  `);

  console.info(
    "[migrate] Bootstrapped migration tracking — marked 0000 as applied."
  );
}

export async function runMigrations(): Promise<void> {
  try {
    await migrate(db, { migrationsFolder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    if (message.includes("already exists")) {
      // The base schema is already in place from a previous deployment, but
      // Drizzle's tracking table is missing or empty. Bootstrap it so that
      // migration 0000 is recorded as applied, then re-run: the migrator will
      // skip 0000 and apply any pending migrations (0001+) normally.
      console.warn(
        "[migrate] Base schema present without migration tracking. " +
          "Bootstrapping and re-running to apply pending migrations..."
      );
      await bootstrapMigration0000();
      await migrate(db, { migrationsFolder });
      return;
    }

    throw err;
  }
}
