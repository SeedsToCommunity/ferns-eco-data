import {
  db,
  inatPlacesTable,
  inatSpeciesTable,
  inatHistogramTable,
  inatFieldValuesTable,
  type InatPlace,
  type InatSpecies,
  type InatHistogram,
  type InatFieldValues,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { InatPlaceLookupResult, InatSpeciesResult, InatHistogramResult, InatFieldValuesResult } from "./connector.js";
import { INAT_SOURCE_ID, INAT_GENERAL_SUMMARY, INAT_TECHNICAL_DETAILS } from "./metadata.js";

const SPECIES_HIT_TTL_DAYS = 30;
const SPECIES_NOMATCH_TTL_DAYS = 7;
const HISTOGRAM_TTL_DAYS = 7;
const FIELD_VALUES_TTL_DAYS = 7;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function lookupPlace(cacheKey: string): Promise<InatPlace | null> {
  const rows = await db
    .select()
    .from(inatPlacesTable)
    .where(eq(inatPlacesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(inatPlacesTable).where(eq(inatPlacesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storePlace(
  cacheKey: string,
  result: InatPlaceLookupResult,
): Promise<InatPlace> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    query: result.query,
    results: result.results,
    found: result.found,
    expires_at: null as Date | null,
    source_id: INAT_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: INAT_GENERAL_SUMMARY,
    technical_details: INAT_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(inatPlacesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: inatPlacesTable.cache_key,
      set: {
        query: insert.query,
        results: insert.results,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSpecies(cacheKey: string): Promise<InatSpecies | null> {
  const rows = await db
    .select()
    .from(inatSpeciesTable)
    .where(eq(inatSpeciesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(inatSpeciesTable).where(eq(inatSpeciesTable.cache_key, cacheKey));
    return null;
  }
  if (row.raw_response == null) {
    await db.delete(inatSpeciesTable).where(eq(inatSpeciesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSpecies(
  cacheKey: string,
  result: InatSpeciesResult,
): Promise<InatSpecies> {
  const now = new Date();
  const ttlDays = result.found ? SPECIES_HIT_TTL_DAYS : SPECIES_NOMATCH_TTL_DAYS;

  const insert = {
    cache_key: cacheKey,
    inat_taxon_id: result.inat_taxon_id,
    inat_name: result.inat_name,
    match_type: result.match_type,
    preferred_common_name: result.preferred_common_name,
    common_names: result.common_names,
    wikipedia_summary: result.wikipedia_summary,
    wikipedia_url: result.wikipedia_url,
    default_photo_url: result.default_photo_url,
    conservation_status: result.conservation_status,
    native_status: result.native_status,
    observations_count: result.observations_count,
    source_url: result.source_url,
    raw_response: result.raw_taxon_record,
    found: result.found,
    expires_at: daysFromNow(ttlDays),
    source_id: INAT_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.search_upstream_url,
    general_summary: INAT_GENERAL_SUMMARY,
    technical_details: INAT_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(inatSpeciesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: inatSpeciesTable.cache_key,
      set: {
        inat_taxon_id: insert.inat_taxon_id,
        inat_name: insert.inat_name,
        match_type: insert.match_type,
        preferred_common_name: insert.preferred_common_name,
        common_names: insert.common_names,
        wikipedia_summary: insert.wikipedia_summary,
        wikipedia_url: insert.wikipedia_url,
        default_photo_url: insert.default_photo_url,
        conservation_status: insert.conservation_status,
        native_status: insert.native_status,
        observations_count: insert.observations_count,
        source_url: insert.source_url,
        raw_response: insert.raw_response,
        found: insert.found,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupHistogram(cacheKey: string): Promise<InatHistogram | null> {
  const rows = await db
    .select()
    .from(inatHistogramTable)
    .where(eq(inatHistogramTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(inatHistogramTable).where(eq(inatHistogramTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeHistogram(
  cacheKey: string,
  result: InatHistogramResult,
): Promise<InatHistogram> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    taxon_id: result.taxon_id,
    place_ids: result.place_ids,
    raw_response: result.raw_response,
    source_url: result.source_url,
    found: true,
    expires_at: daysFromNow(HISTOGRAM_TTL_DAYS),
    source_id: INAT_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: INAT_GENERAL_SUMMARY,
    technical_details: INAT_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(inatHistogramTable)
    .values(insert)
    .onConflictDoUpdate({
      target: inatHistogramTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        source_url: insert.source_url,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupFieldValues(cacheKey: string): Promise<InatFieldValues | null> {
  const rows = await db
    .select()
    .from(inatFieldValuesTable)
    .where(eq(inatFieldValuesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(inatFieldValuesTable).where(eq(inatFieldValuesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeFieldValues(
  cacheKey: string,
  result: InatFieldValuesResult,
): Promise<InatFieldValues> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    taxon_id: result.taxon_id,
    place_ids: result.place_ids,
    verifiable: result.verifiable,
    raw_response: result.raw_response,
    source_url: result.source_url,
    found: true,
    expires_at: daysFromNow(FIELD_VALUES_TTL_DAYS),
    source_id: INAT_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: INAT_GENERAL_SUMMARY,
    technical_details: INAT_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(inatFieldValuesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: inatFieldValuesTable.cache_key,
      set: {
        raw_response: insert.raw_response,
        source_url: insert.source_url,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
