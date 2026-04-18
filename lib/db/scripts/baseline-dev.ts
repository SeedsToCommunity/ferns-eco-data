/**
 * Marks the baseline migration as applied on the current DATABASE_URL
 * without running the SQL. Use this when the database already has the
 * tables created by push mode and you are switching to migration mode.
 *
 * Run once on dev after generating the baseline migration:
 *   pnpm --filter @workspace/db run baseline-dev
 *
 * Do NOT run this on a fresh (empty) database — use `migrate` instead.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "path";
import pg from "pg";
import { fileURLToPath } from "url";

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const migrationsFolder = path.join(__dirname, "../drizzle");
const journalPath = path.join(migrationsFolder, "meta/_journal.json");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const journal = JSON.parse(fs.readFileSync(journalPath, "utf8"));

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  await client.query(`CREATE SCHEMA IF NOT EXISTS "drizzle"`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);

  const { rows: existing } = await client.query(
    `SELECT hash FROM "drizzle"."__drizzle_migrations"`,
  );
  const appliedHashes = new Set(existing.map((r: { hash: string }) => r.hash));

  let inserted = 0;
  for (const entry of journal.entries) {
    const sqlPath = path.join(migrationsFolder, `${entry.tag}.sql`);
    const sqlContent = fs.readFileSync(sqlPath, "utf8");
    const hash = crypto.createHash("sha256").update(sqlContent).digest("hex");

    if (appliedHashes.has(hash)) {
      console.log(`  already recorded: ${entry.tag}`);
      continue;
    }

    await client.query(
      `INSERT INTO "drizzle"."__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
      [hash, entry.when],
    );
    console.log(`  recorded as applied: ${entry.tag} (hash: ${hash.slice(0, 12)}...)`);
    inserted++;
  }

  if (inserted === 0) {
    console.log("All migrations already recorded. Nothing to do.");
  } else {
    console.log(`Done. Recorded ${inserted} migration(s) as applied.`);
  }
} finally {
  await client.end();
}
