import {
  db,
  mifloraSpeciesCacheTable,
  mifloraCountiesCacheTable,
  type MifloraSpecies,
  type MifloraCounties,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { MifloraSpeciesResult, MifloraCountiesResult } from "./connector.js";
import { MIFLORA_SOURCE_ID, MIFLORA_DERIVATION_SUMMARY, MIFLORA_DERIVATION_SCIENTIFIC } from "./metadata.js";

const SPECIES_HIT_TTL_DAYS = 30;
const SPECIES_NOMATCH_TTL_DAYS = 7;
const COUNTIES_TTL_DAYS = 30;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function lookupSpecies(cacheKey: string): Promise<MifloraSpecies | null> {
  const rows = await db
    .select()
    .from(mifloraSpeciesCacheTable)
    .where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(mifloraSpeciesCacheTable).where(eq(mifloraSpeciesCacheTable.cache_key, cacheKey));
    return null;
  }
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
  const ttlDays = result.found ? SPECIES_HIT_TTL_DAYS : SPECIES_NOMATCH_TTL_DAYS;

  const insert = {
    cache_key: cacheKey,
    queried_name: queriedName,
    plant_id: result.plant_id,
    raw_response: result.raw_response as Record<string, unknown>,
    found: result.found,
    expires_at: daysFromNow(ttlDays),
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    derivation_summary: MIFLORA_DERIVATION_SUMMARY,
    derivation_scientific: MIFLORA_DERIVATION_SCIENTIFIC,
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
        expires_at: insert.expires_at,
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
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(mifloraCountiesCacheTable).where(eq(mifloraCountiesCacheTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeCounties(
  cacheKey: string,
  result: MifloraCountiesResult,
): Promise<MifloraCounties> {
  const now = new Date();

  const insert = {
    cache_key: cacheKey,
    plant_id: result.plant_id,
    raw_response: result.raw_response as Record<string, unknown>,
    found: result.found,
    expires_at: daysFromNow(COUNTIES_TTL_DAYS),
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    source_url: result.source_url,
    derivation_summary: MIFLORA_DERIVATION_SUMMARY,
    derivation_scientific: MIFLORA_DERIVATION_SCIENTIFIC,
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
        source_url: insert.source_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
