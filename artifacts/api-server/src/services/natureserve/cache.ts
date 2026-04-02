import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { NatureserveSpeciesResult, NatureserveEcosystemsResult } from "./connector.js";
import { NATURESERVE_SOURCE_ID, NATURESERVE_DERIVATION_SUMMARY, NATURESERVE_DERIVATION_SCIENTIFIC } from "./metadata.js";

const SPECIES_TTL_DAYS = 30;
const ECOSYSTEMS_TTL_DAYS = 30;

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
  result: NatureserveSpeciesResult,
  upstreamUrl: string,
): Promise<typeof natureserveSpeciesCacheTable.$inferSelect> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    scientific_name: result.scientific_name,
    common_name: result.common_name,
    global_rank: result.global_rank,
    rounded_global_rank: result.rounded_global_rank,
    national_rank: result.national_rank,
    rounded_national_rank: result.rounded_national_rank,
    state_code: result.state_code,
    state_rank: result.state_rank,
    rounded_state_rank: result.rounded_state_rank,
    iucn_code: result.iucn_code,
    iucn_description: result.iucn_description,
    federal_status_code: result.federal_status_code,
    federal_status_description: result.federal_status_description,
    natureserve_url: result.natureserve_url,
    element_global_id: result.element_global_id,
    raw_summary: {
      cites_description: result.cites_description,
      cosewic_code: result.cosewic_code,
      cosewic_description: result.cosewic_description,
      detail_upstream_url: result.detail_upstream_url,
    },
    expires_at: daysFromNow(SPECIES_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: upstreamUrl,
    derivation_summary: NATURESERVE_DERIVATION_SUMMARY,
    derivation_scientific: NATURESERVE_DERIVATION_SCIENTIFIC,
  };

  const rows = await db
    .insert(natureserveSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: natureserveSpeciesCacheTable.cache_key,
      set: {
        scientific_name: insert.scientific_name,
        common_name: insert.common_name,
        global_rank: insert.global_rank,
        rounded_global_rank: insert.rounded_global_rank,
        national_rank: insert.national_rank,
        rounded_national_rank: insert.rounded_national_rank,
        state_code: insert.state_code,
        state_rank: insert.state_rank,
        rounded_state_rank: insert.rounded_state_rank,
        iucn_code: insert.iucn_code,
        iucn_description: insert.iucn_description,
        federal_status_code: insert.federal_status_code,
        federal_status_description: insert.federal_status_description,
        natureserve_url: insert.natureserve_url,
        element_global_id: insert.element_global_id,
        raw_summary: insert.raw_summary,
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
  result: NatureserveEcosystemsResult,
): Promise<typeof natureserveEcosystemsCacheTable.$inferSelect> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    results: result.items as unknown as Record<string, unknown>[],
    result_count: String(result.total_results),
    expires_at: daysFromNow(ECOSYSTEMS_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    derivation_summary: NATURESERVE_DERIVATION_SUMMARY,
    derivation_scientific: NATURESERVE_DERIVATION_SCIENTIFIC,
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
