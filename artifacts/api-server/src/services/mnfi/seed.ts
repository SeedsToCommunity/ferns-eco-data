import { db, fernsSourcesTable, mnfiCommunitiesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { MNFI_REGISTRY_ENTRY } from "./metadata.js";
import { MNFI_COMMUNITIES } from "./communities-data.js";
import { logger } from "../../lib/logger.js";

// ---------------------------------------------------------------------------
// Background auto-import — called once at server startup.
// If MNFI descriptions/plants/county-elements are empty AND ADMIN_SECRET is
// set, this calls the existing admin endpoints against localhost to populate
// the database non-blocking.  Safe to run multiple times (idempotent).
// ---------------------------------------------------------------------------
export async function autoImportMnfiIfEmpty(port: number): Promise<void> {
  const secret = process.env["ADMIN_SECRET"];
  if (!secret) {
    logger.info("MNFI auto-import skipped: ADMIN_SECRET not set");
    return;
  }

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(mnfiCommunitiesTable)
    .where(sql`description_fetched_at is not null`);

  if (Number(row?.count ?? 0) > 0) {
    logger.info({ fetched: row?.count }, "MNFI data already imported, skipping auto-import");
    return;
  }

  logger.info("MNFI descriptions empty — starting background auto-import (non-blocking)");

  const base = `http://localhost:${port}`;
  const headers = { Authorization: `Bearer ${secret}` };
  const TIMEOUT_MS = 600_000; // 10 minutes per endpoint

  const endpoints = [
    "/api/mnfi/import-descriptions",
    "/api/mnfi/import-plant-lists",
    "/api/mnfi/import-county-elements",
  ] as const;

  for (const endpoint of endpoints) {
    try {
      logger.info({ endpoint }, "MNFI auto-import: starting endpoint");
      const res = await fetch(`${base}${endpoint}`, {
        method: "POST",
        headers,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const data = (await res.json()) as { success?: boolean; data?: { message?: string } };
      logger.info({ endpoint, success: data.success, message: data.data?.message }, "MNFI auto-import: endpoint complete");
    } catch (err) {
      logger.error({ err, endpoint }, "MNFI auto-import: endpoint failed");
    }
  }

  logger.info("MNFI auto-import: all endpoints complete");
}

let registrySeeded = false;
let communitiesSeeded = false;

export async function ensureMnfiRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(MNFI_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MNFI_REGISTRY_ENTRY.name,
          status: MNFI_REGISTRY_ENTRY.status,
          description: MNFI_REGISTRY_ENTRY.description,
          input_summary: MNFI_REGISTRY_ENTRY.input_summary,
          output_summary: MNFI_REGISTRY_ENTRY.output_summary,
          update_frequency: MNFI_REGISTRY_ENTRY.update_frequency,
          known_limitations: MNFI_REGISTRY_ENTRY.known_limitations,
          metadata_url: MNFI_REGISTRY_ENTRY.metadata_url,
          explorer_url: MNFI_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    registrySeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed MNFI registry entry");
  }
}

export async function ensureMnfiCommunities(): Promise<{ inserted: number; skipped: number }> {
  if (communitiesSeeded) {
    return { inserted: 0, skipped: MNFI_COMMUNITIES.length };
  }

  try {
    await db
      .insert(mnfiCommunitiesTable)
      .values(MNFI_COMMUNITIES)
      .onConflictDoUpdate({
        target: mnfiCommunitiesTable.community_id,
        set: {
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          community_class: sql`excluded.community_class`,
          community_group: sql`excluded.community_group`,
          global_rank: sql`excluded.global_rank`,
          state_rank: sql`excluded.state_rank`,
          mnfi_url: sql`excluded.mnfi_url`,
          county_map_url: sql`excluded.county_map_url`,
        },
      });

    communitiesSeeded = true;
    logger.info({ count: MNFI_COMMUNITIES.length }, "MNFI communities seeded");
    return { inserted: MNFI_COMMUNITIES.length, skipped: 0 };
  } catch (err) {
    logger.error({ err }, "Failed to seed MNFI communities");
    throw err;
  }
}
