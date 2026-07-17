import {
  db,
  mifloraCountiesCacheTable,
  mifloraImagesCacheTable,
  mifloraFloraSearchCacheTable,
  mifloraSpecTextCacheTable,
  mifloraSynonymsCacheTable,
  mifloraPImageCacheTable,
  type MifloraCounties,
  type MifloraImages,
  type MifloraFloraSearch,
  type MifloraSpecText,
  type MifloraSynonyms,
  type MifloraPImage,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { MIFLORA_SOURCE_ID } from "./metadata.js";
import type {
  MifloraLocsSpResult,
  MifloraAllimageInfoResult,
  MifloraFloraSearchSpResult,
  MifloraSpecTextResult,
  MifloraSynonymsResult,
  MifloraPimageInfoResult,
} from "@workspace/external-data-providers/miflora";

// ── locs_sp (counties) ────────────────────────────────────────────────────────

export async function lookupLocsSp(cacheKey: string): Promise<MifloraCounties | null> {
  const rows = await db
    .select()
    .from(mifloraCountiesCacheTable)
    .where(eq(mifloraCountiesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeLocsSp(
  cacheKey: string,
  plantId: number,
  result: MifloraLocsSpResult,
): Promise<MifloraCounties> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: String(plantId),
    plant_id: plantId,
    raw_response: { locations: result.locations } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstreamUrl,
    source_url: null as string | null,
  };
  const rows = await db
    .insert(mifloraCountiesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraCountiesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: null,
      },
    })
    .returning();
  return rows[0];
}

// ── allimage_info (images) ────────────────────────────────────────────────────

export async function lookupAllimageInfo(cacheKey: string): Promise<MifloraImages | null> {
  const rows = await db
    .select()
    .from(mifloraImagesCacheTable)
    .where(eq(mifloraImagesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeAllimageInfo(
  cacheKey: string,
  plantId: number,
  result: MifloraAllimageInfoResult,
): Promise<MifloraImages> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: String(plantId),
    plant_id: plantId,
    raw_response: result.images as unknown as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstreamUrl,
    source_url: null as string | null,
  };
  const rows = await db
    .insert(mifloraImagesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraImagesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: null,
      },
    })
    .returning();
  return rows[0];
}

// ── flora_search_sp ───────────────────────────────────────────────────────────

export async function lookupFloraSearch(cacheKey: string): Promise<MifloraFloraSearch | null> {
  const rows = await db
    .select()
    .from(mifloraFloraSearchCacheTable)
    .where(eq(mifloraFloraSearchCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeFloraSearch(
  cacheKey: string,
  result: MifloraFloraSearchSpResult,
): Promise<MifloraFloraSearch> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    raw_response: result.records as unknown as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    upstream_url: result.upstreamUrl,
  };
  const rows = await db
    .insert(mifloraFloraSearchCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraFloraSearchCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
      },
    })
    .returning();
  return rows[0];
}

// ── spec_text ─────────────────────────────────────────────────────────────────

export async function lookupSpecText(cacheKey: string): Promise<MifloraSpecText | null> {
  const rows = await db
    .select()
    .from(mifloraSpecTextCacheTable)
    .where(eq(mifloraSpecTextCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeSpecText(
  cacheKey: string,
  result: MifloraSpecTextResult,
): Promise<MifloraSpecText> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    raw_response: { text: result.text } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    upstream_url: result.upstreamUrl,
  };
  const rows = await db
    .insert(mifloraSpecTextCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSpecTextCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
      },
    })
    .returning();
  return rows[0];
}

// ── synonyms ──────────────────────────────────────────────────────────────────

export async function lookupSynonyms(cacheKey: string): Promise<MifloraSynonyms | null> {
  const rows = await db
    .select()
    .from(mifloraSynonymsCacheTable)
    .where(eq(mifloraSynonymsCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeSynonyms(
  cacheKey: string,
  result: MifloraSynonymsResult,
): Promise<MifloraSynonyms> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    raw_response: result.synonyms as unknown as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    upstream_url: result.upstreamUrl,
  };
  const rows = await db
    .insert(mifloraSynonymsCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSynonymsCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
      },
    })
    .returning();
  return rows[0];
}

// ── pimage_info ───────────────────────────────────────────────────────────────

export async function lookupPImage(cacheKey: string): Promise<MifloraPImage | null> {
  const rows = await db
    .select()
    .from(mifloraPImageCacheTable)
    .where(eq(mifloraPImageCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storePImage(
  cacheKey: string,
  result: MifloraPimageInfoResult,
): Promise<MifloraPImage> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    raw_response: (result.image ?? null) as unknown as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    upstream_url: result.upstreamUrl,
  };
  const rows = await db
    .insert(mifloraPImageCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraPImageCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
      },
    })
    .returning();
  return rows[0];
}
