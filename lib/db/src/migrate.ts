import { migrate } from "drizzle-orm/node-postgres/migrator";
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
 *
 * For the standalone baseline-dev script (lib/db/scripts/):
 *   __dirname = .../lib/db/src/, but that script calls pg directly and
 *   does not use this function.
 */
const migrationsFolder = path.join(__dirname, "drizzle");

export async function runMigrations(): Promise<void> {
  try {
    await migrate(db, { migrationsFolder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("already exists")) {
      // Production bootstrapping case: the database schema is already in
      // place (from a previous deployment) but the Drizzle migrations
      // tracking table was cleared or never populated. The tables are
      // correct — log a warning and continue startup normally.
      console.warn(
        "[migrate] Schema already current (tables exist in DB). " +
          "Skipping initial migration and continuing startup."
      );
      return;
    }
    throw err;
  }
}
