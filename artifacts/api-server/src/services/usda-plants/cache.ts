import {
  db,
  usdaPlantsProfilesTable,
  type UsdaPlantsProfile,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { USDA_PLANTS_SOURCE_ID } from "./metadata.js";

const PROFILE_TTL_DAYS = 30;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export function buildProfileCacheKey(symbol: string): string {
  return `usda-plants:profile:${symbol.toUpperCase()}`;
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
