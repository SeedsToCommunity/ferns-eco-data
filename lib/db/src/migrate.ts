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
  await migrate(db, { migrationsFolder });
}
