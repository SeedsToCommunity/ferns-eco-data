/**
 * Production pre-build migration runner.
 *
 * Runs as part of the api-server production build step, BEFORE Replit's own
 * database sync runs. By applying all Drizzle migrations at build time, the
 * production database is already in the correct state when Replit's DB sync
 * compares schemas — so it finds nothing to do and shows no prompts.
 *
 * Usage:  node lib/db/scripts/run-prod-migrations.mjs
 * Env:    DATABASE_URL  (required — must point to the production database)
 */

import pg from "pg";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.log("[migrate] No DATABASE_URL — skipping pre-build migrations.");
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When run from the workspace root or from artifacts/api-server/, resolve
// the drizzle folder relative to this script's own location.
const migrationsFolder = path.resolve(__dirname, "../drizzle");

const pool = new Pool({ connectionString: DATABASE_URL });

async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();
  }
}

async function ensureMigrationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      id SERIAL PRIMARY KEY,
      hash text NOT NULL,
      created_at bigint
    )
  `);
}

async function getAppliedHashes() {
  const res = await query(`SELECT hash FROM "__drizzle_migrations"`);
  return new Set(res.rows.map((r) => r.hash));
}

async function markApplied(hash) {
  await query(
    `INSERT INTO "__drizzle_migrations" (hash, created_at)
     SELECT $1, $2
     WHERE NOT EXISTS (SELECT 1 FROM "__drizzle_migrations" WHERE hash = $1)`,
    [hash, Date.now()]
  );
}

function hashFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  return {
    hash: createHash("sha256").update(content).digest("hex"),
    content,
  };
}

function splitStatements(sql) {
  return sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function applyMigration(tag, content) {
  const statements = splitStatements(content);
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const stmt of statements) {
      await client.query(stmt);
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  const journalPath = path.join(migrationsFolder, "meta/_journal.json");
  if (!existsSync(journalPath)) {
    console.log("[migrate] No migration journal found — skipping.");
    await pool.end();
    return;
  }

  const journal = JSON.parse(readFileSync(journalPath, "utf-8"));

  try {
    await ensureMigrationsTable();
    const applied = await getAppliedHashes();

    for (const entry of journal.entries) {
      const filePath = path.join(migrationsFolder, `${entry.tag}.sql`);
      const { hash, content } = hashFile(filePath);

      if (applied.has(hash)) {
        console.log(`[migrate] ${entry.tag} — already applied, skipping.`);
        continue;
      }

      console.log(`[migrate] Applying ${entry.tag}...`);
      try {
        await applyMigration(entry.tag, content);
        await markApplied(hash);
        console.log(`[migrate] ${entry.tag} — done.`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("already exists") && entry.idx === 0) {
          // Migration 0000 creates tables that already exist in production
          // (carried over from a prior deployment). Mark it as applied and
          // continue — later migrations will clean up the schema.
          console.warn(
            `[migrate] ${entry.tag} — tables already exist, marking as applied and continuing.`
          );
          await markApplied(hash);
        } else {
          throw err;
        }
      }
    }

    console.log("[migrate] All migrations up to date.");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[migrate] Fatal error:", err.message);
  process.exit(1);
});
