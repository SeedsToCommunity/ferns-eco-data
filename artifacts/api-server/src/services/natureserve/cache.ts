import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable, natureserveTaxonCacheTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { NatureserveResult } from "@workspace/external-data-providers/natureserve";
import { NATURESERVE_SOURCE_ID, NATURESERVE_GENERAL_SUMMARY, NATURESERVE_TECHNICAL_DETAILS } from "./metadata.js";

const SPECIES_TTL_DAYS = 30;
const ECOSYSTEMS_TTL_DAYS = 7;
const TAXON_TTL_DAYS = 30;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function lookupSpeciesCache(
  cacheKey: string,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date } | null> {
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
  if (row.upstream_response === null || row.upstream_response === undefined) {
    return null;
  }
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}

export async function storeSpeciesCache(
  cacheKey: string,
  result: NatureserveResult,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date }> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw as Record<string, unknown>,
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
        upstream_response: insert.upstream_response,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  const row = rows[0];
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}

export async function lookupEcosystemsCache(
  cacheKey: string,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date } | null> {
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
  if (row.upstream_response === null || row.upstream_response === undefined) {
    return null;
  }
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}

export async function storeEcosystemsCache(
  cacheKey: string,
  result: NatureserveResult,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date }> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw as Record<string, unknown>,
    expires_at: daysFromNow(ECOSYSTEMS_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: NATURESERVE_GENERAL_SUMMARY,
    technical_details: NATURESERVE_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(natureserveEcosystemsCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: natureserveEcosystemsCacheTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  const row = rows[0];
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}

export async function lookupTaxonCache(
  cacheKey: string,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date } | null> {
  const rows = await db
    .select()
    .from(natureserveTaxonCacheTable)
    .where(eq(natureserveTaxonCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(natureserveTaxonCacheTable).where(eq(natureserveTaxonCacheTable.cache_key, cacheKey));
    return null;
  }
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}

export async function storeTaxonCache(
  cacheKey: string,
  result: NatureserveResult,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date }> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw as Record<string, unknown>,
    upstream_url: result.upstream_url,
    fetched_at: now,
    expires_at: daysFromNow(TAXON_TTL_DAYS),
    source_id: NATURESERVE_SOURCE_ID,
  };

  const rows = await db
    .insert(natureserveTaxonCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: natureserveTaxonCacheTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        upstream_url: insert.upstream_url,
        fetched_at: insert.fetched_at,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  const row = rows[0];
  return { raw: row.upstream_response, upstream_url: row.upstream_url, fetched_at: row.fetched_at };
}
