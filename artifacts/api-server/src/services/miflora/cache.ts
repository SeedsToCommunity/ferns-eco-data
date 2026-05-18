import {
  db,
  mifloraCountiesCacheTable,
  mifloraImagesCacheTable,
  mifloraSpeciesCacheTable,
  type MifloraCounties,
  type MifloraImages,
  type MifloraSpecies,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type {
  MifloraCountiesResult,
  MifloraImagesResult,
  MifloraFloraSearchResult,
  MifloraSpecTextResult,
  MifloraSynonymsResult,
  MifloraPImageResult,
} from "./connector.js";
import { MIFLORA_SOURCE_ID, MIFLORA_GENERAL_SUMMARY, MIFLORA_TECHNICAL_DETAILS } from "./metadata.js";

export async function lookupCounties(cacheKey: string): Promise<MifloraCounties | null> {
  const rows = await db
    .select()
    .from(mifloraCountiesCacheTable)
    .where(eq(mifloraCountiesCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  return rows[0];
}

export async function storeCounties(
  cacheKey: string,
  queriedName: string,
  result: MifloraCountiesResult,
): Promise<MifloraCounties> {
  const now = new Date();

  const insert = {
    cache_key: cacheKey,
    queried_name: queriedName,
    raw_response: result.raw_response as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(mifloraCountiesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraCountiesCacheTable.cache_key,
      set: {
        queried_name: insert.queried_name,
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
        expires_at: null,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupFloraSearch(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeFloraSearch(
  cacheKey: string,
  name: string,
  result: MifloraFloraSearchResult,
): Promise<MifloraSpecies> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: name,
    plant_id: result.plant_id,
    raw_response: { records: result.records } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };
  const rows = await db
    .insert(mifloraSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSpeciesCacheTable.cache_key,
      set: {
        plant_id: insert.plant_id,
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSpecText(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeSpecText(
  cacheKey: string,
  plantId: number,
  result: MifloraSpecTextResult,
): Promise<MifloraSpecies> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: String(plantId),
    plant_id: plantId,
    raw_response: { text: result.text } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };
  const rows = await db
    .insert(mifloraSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSpeciesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSynonyms(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storeSynonyms(
  cacheKey: string,
  plantId: number,
  result: MifloraSynonymsResult,
): Promise<MifloraSpecies> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: String(plantId),
    plant_id: plantId,
    raw_response: { synonyms: result.synonyms } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };
  const rows = await db
    .insert(mifloraSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSpeciesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupPImage(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  return rows.length ? rows[0] : null;
}

export async function storePImage(
  cacheKey: string,
  plantId: number,
  result: MifloraPImageResult,
): Promise<MifloraSpecies> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    queried_name: String(plantId),
    plant_id: plantId,
    raw_response: { image: result.image } as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };
  const rows = await db
    .insert(mifloraSpeciesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraSpeciesCacheTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupImages(cacheKey: string): Promise<MifloraImages | null> {
  const rows = await db
    .select()
    .from(mifloraImagesCacheTable)
    .where(eq(mifloraImagesCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  return rows[0];
}

export async function storeImages(
  cacheKey: string,
  queriedName: string,
  result: MifloraImagesResult,
): Promise<MifloraImages> {
  const now = new Date();

  const insert = {
    cache_key: cacheKey,
    queried_name: queriedName,
    plant_id: result.plant_id,
    raw_response: result.images as unknown as Record<string, unknown>,
    found: result.found,
    expires_at: null,
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(mifloraImagesCacheTable)
    .values(insert)
    .onConflictDoUpdate({
      target: mifloraImagesCacheTable.cache_key,
      set: {
        plant_id: insert.plant_id,
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        source_url: insert.source_url,
        expires_at: null,
      },
    })
    .returning();
  return rows[0];
}
