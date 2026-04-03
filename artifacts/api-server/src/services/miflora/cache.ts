import {
  db,
  mifloraSpeciesCacheTable,
  mifloraCountiesCacheTable,
  mifloraImagesCacheTable,
  type MifloraSpecies,
  type MifloraCounties,
  type MifloraImages,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { MifloraSpeciesResult, MifloraCountiesResult, MifloraImagesResult } from "./connector.js";
import { MIFLORA_SOURCE_ID, MIFLORA_GENERAL_SUMMARY, MIFLORA_TECHNICAL_DETAILS } from "./metadata.js";

export async function lookupSpecies(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.raw_response == null && row.found) {
    await db.delete(mifloraSpeciesCacheTable).where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSpecies(
  cacheKey: string,
  queriedName: string,
  result: MifloraSpeciesResult,
): Promise<MifloraSpecies> {
  const now = new Date();

  const insert = {
    cache_key: cacheKey,
    queried_name: queriedName,
    plant_id: result.plant_id,
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
        expires_at: null,
      },
    })
    .returning();
  return rows[0];
}

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
