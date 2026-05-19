import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { NatureserveSpeciesSearchResult, NatureserveSearchItem } from "./connector.js";
import { NATURESERVE_SOURCE_ID, NATURESERVE_GENERAL_SUMMARY, NATURESERVE_TECHNICAL_DETAILS } from "./metadata.js";

const SPECIES_TTL_DAYS = 30;
const ECOSYSTEMS_TTL_DAYS = 7;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function lookupSpeciesCache(cacheKey: string): Promise<typeof natureserveSpeciesCacheTable.$inferSelect | null> {
  const rows = await db
    .select()
    .from(natureserveSpeciesCacheTable)
    .where(eq(natureserveSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(natureserveSpeciesCacheTable).where(eq(natureserveSpeciesCacheTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSpeciesCache(
  cacheKey: string,
  result: NatureserveSpeciesSearchResult,
): Promise<typeof natureserveSpeciesCacheTable.$inferSelect> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    raw_response: result.raw_response,
    expires_at: daysFromNow(SPECIES_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: NATURESERVE_GENERAL_SUMMARY,
    technical_details: NATURESERVE_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(natureserveSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: natureserveSpeciesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupEcosystemsCache(cacheKey: string): Promise<typeof natureserveEcosystemsCacheTable.$inferSelect | null> {
  const rows = await db
    .select()
    .from(natureserveEcosystemsCacheTable)
    .where(eq(natureserveEcosystemsCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(natureserveEcosystemsCacheTable).where(eq(natureserveEcosystemsCacheTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeEcosystemsCache(
  cacheKey: string,
  items: NatureserveSearchItem[],
  totalResults: number,
  upstreamUrl: string,
): Promise<typeof natureserveEcosystemsCacheTable.$inferSelect> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    results: items as unknown as Record<string, unknown>[],
    result_count: String(totalResults),
    expires_at: daysFromNow(ECOSYSTEMS_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: upstreamUrl,
    general_summary: NATURESERVE_GENERAL_SUMMARY,
    technical_details: NATURESERVE_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(natureserveEcosystemsCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: natureserveEcosystemsCacheTable.cache_key,
      set: {
        results: insert.results,
        result_count: insert.result_count,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
