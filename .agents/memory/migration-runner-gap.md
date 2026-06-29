---
name: Migration runner gap risk
description: Custom migrate.ts only runs migrations that are explicitly wired in — new SQL files in drizzle/ are silently ignored until added.
---

# Migration runner gap

The project uses a **custom** migration runner in `lib/db/src/migrate.ts` rather than Drizzle's built-in `drizzle-kit migrate`. Only migrations explicitly referenced in `runMigrations()` are ever applied. A migration SQL file placed in `lib/db/drizzle/` is **silently skipped** if it isn't wired into that function — no error at startup.

**Why discovered:** Migration `0015_gbif_cache_rearch` was committed to the drizzle folder but never added to `runMigrations()`. Every GBIF route returned 502 because the DB still held the old `raw_response` column rather than `upstream_response`, and the `gbif_species` / `gbif_species_searches` tables didn't exist. The server started cleanly and the error only surfaced when hitting GBIF endpoints.

**How to apply:**
- After adding a new migration SQL file, **always** add the corresponding `runSqlMigration(...)` call to `runMigrations()` in `lib/db/src/migrate.ts`.
- Use `const entryN = journal.entries[N]` to pull the timestamp from the journal, guarded with `if (entryN)`.
- Use `failFast: false` for migrations whose destructive steps have `IF EXISTS` guards (DDL cleanup/alter); use `failFast: true` for schema-creation migrations where partial application should force a retry on next startup.
- Restart the server after wiring and confirm `[migrate] NNNN (...) complete — X succeeded, 0 skipped.` appears in logs.

**Known still-unwired migrations (as of task #299):** 0011, 0012, 0014, 0017, 0018, 0019, 0020 — see follow-up task #308.
