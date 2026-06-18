import {
  db,
  usdaPlantsNameMatchesTable,
  usdaPlantsProfilesTable,
  type UsdaPlantsNameMatch,
  type UsdaPlantsProfile,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { USDA_PLANTS_SOURCE_ID, USDA_PLANTS_GENERAL_SUMMARY, USDA_PLANTS_TECHNICAL_DETAILS } from "./metadata.js";
import type { UsdaNameLookupResult } from "./connector.js";

const NAME_MATCH_HIT_TTL_DAYS = 30;
const NAME_MATCH_MISS_TTL_DAYS = 7;
const PROFILE_TTL_DAYS = 30;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function buildNameMatchCacheKey(name: string): string {
  return `usda-plants:name:${name.trim().toLowerCase().replace(/\s+/g, ":")}`;
}

export function buildProfileCacheKey(symbol: string): string {
  return `usda-plants:profile:${symbol.toUpperCase()}`;
}

export async function lookupNameMatch(cacheKey: string): Promise<UsdaPlantsNameMatch | null> {
  const rows = await db
    .select()
    .from(usdaPlantsNameMatchesTable)
    .where(eq(usdaPlantsNameMatchesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(usdaPlantsNameMatchesTable).where(eq(usdaPlantsNameMatchesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeNameMatch(cacheKey: string, result: UsdaNameLookupResult): Promise<UsdaPlantsNameMatch> {
  const ttlDays = result.found ? NAME_MATCH_HIT_TTL_DAYS : NAME_MATCH_MISS_TTL_DAYS;
  const insert = {
    cache_key: cacheKey,
    input_name: result.matched_input,
    found: result.found,
    symbol: result.symbol,
    canonical_name: result.canonical_name,
    common_name: result.common_name,
    rank: result.rank,
    usda_id: result.usda_id,
    expires_at: daysFromNow(ttlDays),
    source_id: USDA_PLANTS_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: USDA_PLANTS_GENERAL_SUMMARY,
    technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(usdaPlantsNameMatchesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: usdaPlantsNameMatchesTable.cache_key,
      set: {
        found: insert.found,
        symbol: insert.symbol,
        canonical_name: insert.canonical_name,
        common_name: insert.common_name,
        rank: insert.rank,
        usda_id: insert.usda_id,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupProfile(cacheKey: string): Promise<UsdaPlantsProfile | null> {
  const rows = await db
    .select()
    .from(usdaPlantsProfilesTable)
    .where(eq(usdaPlantsProfilesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(usdaPlantsProfilesTable).where(eq(usdaPlantsProfilesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeProfile(
  cacheKey: string,
  symbol: string,
  profile: Record<string, unknown>,
  upstreamUrl: string,
): Promise<UsdaPlantsProfile> {
  const insert = {
    cache_key: cacheKey,
    symbol: symbol.toUpperCase(),
    profile: profile as unknown as Record<string, unknown>,
    expires_at: daysFromNow(PROFILE_TTL_DAYS),
    source_id: USDA_PLANTS_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    general_summary: USDA_PLANTS_GENERAL_SUMMARY,
    technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(usdaPlantsProfilesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: usdaPlantsProfilesTable.cache_key,
      set: {
        profile: insert.profile,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
