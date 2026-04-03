import {
  db,
  gbifNameMatchesTable,
  gbifSynonymsTable,
  gbifVernacularNamesTable,
  gbifOccurrencesTable,
  type GbifNameMatch,
  type GbifSynonyms,
  type GbifVernacularNames,
  type GbifOccurrences,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { GbifMatchResult, GbifReconcileResult, GbifOccurrencesResult, GeographyParams } from "./connector.js";
import { serializeGeography } from "./connector.js";
import { GBIF_SOURCE_ID, GBIF_GENERAL_SUMMARY, GBIF_TECHNICAL_DETAILS } from "./metadata.js";

const MATCH_HIT_TTL_DAYS = 30;
const MATCH_NOMATCH_TTL_DAYS = 7;
const SYNONYMS_TTL_DAYS = 30;
const VERNACULAR_TTL_DAYS = 90;
const OCCURRENCES_TTL_DAYS = 7;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function deleteExpired<T extends { expires_at: Date | null }>(
  table: { cache_key: unknown },
  row: T & { cache_key: string },
  deleteFrom: (cacheKey: string) => Promise<void>,
): Promise<boolean> {
  if (row.expires_at && row.expires_at < new Date()) {
    await deleteFrom(row.cache_key);
    return true;
  }
  return false;
}

export async function lookupNameMatch(cacheKey: string): Promise<GbifNameMatch | null> {
  const rows = await db
    .select()
    .from(gbifNameMatchesTable)
    .where(eq(gbifNameMatchesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifNameMatchesTable).where(eq(gbifNameMatchesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeNameMatch(
  cacheKey: string,
  result: GbifMatchResult,
): Promise<GbifNameMatch> {
  const isNoMatch = result.match_type === "NONE";
  const expiresAt = daysFromNow(isNoMatch ? MATCH_NOMATCH_TTL_DAYS : MATCH_HIT_TTL_DAYS);

  const insert = {
    cache_key: cacheKey,
    canonical_name: result.canonical_name,
    scientific_name: result.scientific_name,
    usage_key: result.usage_key,
    accepted_usage_key: result.accepted_usage_key,
    accepted_canonical_name: result.accepted_canonical_name,
    rank: result.rank,
    status: result.status,
    confidence: result.confidence,
    match_type: result.match_type,
    kingdom: result.kingdom,
    phylum: result.phylum,
    class_: result.class_,
    order_: result.order_,
    family: result.family,
    genus: result.genus,
    species: result.species,
    kingdom_key: result.kingdom_key,
    phylum_key: result.phylum_key,
    class_key: result.class_key,
    order_key: result.order_key,
    family_key: result.family_key,
    genus_key: result.genus_key,
    species_key: result.species_key,
    source_url: result.source_url,
    matched_input: result.matched_input,
    expires_at: expiresAt,
    source_id: GBIF_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: GBIF_GENERAL_SUMMARY,
    technical_details: GBIF_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(gbifNameMatchesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifNameMatchesTable.cache_key,
      set: {
        canonical_name: insert.canonical_name,
        scientific_name: insert.scientific_name,
        usage_key: insert.usage_key,
        accepted_usage_key: insert.accepted_usage_key,
        accepted_canonical_name: insert.accepted_canonical_name,
        rank: insert.rank,
        status: insert.status,
        confidence: insert.confidence,
        match_type: insert.match_type,
        kingdom: insert.kingdom,
        phylum: insert.phylum,
        class_: insert.class_,
        order_: insert.order_,
        family: insert.family,
        genus: insert.genus,
        species: insert.species,
        kingdom_key: insert.kingdom_key,
        phylum_key: insert.phylum_key,
        class_key: insert.class_key,
        order_key: insert.order_key,
        family_key: insert.family_key,
        genus_key: insert.genus_key,
        species_key: insert.species_key,
        source_url: insert.source_url,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSynonyms(cacheKey: string): Promise<GbifSynonyms | null> {
  const rows = await db
    .select()
    .from(gbifSynonymsTable)
    .where(eq(gbifSynonymsTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifSynonymsTable).where(eq(gbifSynonymsTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSynonyms(
  cacheKey: string,
  usageKey: number,
  result: GbifReconcileResult,
): Promise<GbifSynonyms> {
  const insert = {
    cache_key: cacheKey,
    usage_key: usageKey,
    synonyms: result.synonyms,
    synonym_count: result.synonym_count,
    expires_at: daysFromNow(SYNONYMS_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.synonyms_upstream_url,
    general_summary: GBIF_GENERAL_SUMMARY,
    technical_details: GBIF_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(gbifSynonymsTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifSynonymsTable.cache_key,
      set: {
        synonyms: insert.synonyms,
        synonym_count: insert.synonym_count,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupVernacular(cacheKey: string): Promise<GbifVernacularNames | null> {
  const rows = await db
    .select()
    .from(gbifVernacularNamesTable)
    .where(eq(gbifVernacularNamesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifVernacularNamesTable).where(eq(gbifVernacularNamesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeVernacular(
  cacheKey: string,
  usageKey: number,
  result: GbifReconcileResult,
): Promise<GbifVernacularNames> {
  const insert = {
    cache_key: cacheKey,
    usage_key: usageKey,
    vernacular_names: result.vernacular_names,
    vernacular_name_primary: result.vernacular_name_primary,
    vernacular_name_count: result.vernacular_name_count,
    expires_at: daysFromNow(VERNACULAR_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.vernacular_upstream_url,
    general_summary: GBIF_GENERAL_SUMMARY,
    technical_details: GBIF_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(gbifVernacularNamesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifVernacularNamesTable.cache_key,
      set: {
        vernacular_names: insert.vernacular_names,
        vernacular_name_primary: insert.vernacular_name_primary,
        vernacular_name_count: insert.vernacular_name_count,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupOccurrences(cacheKey: string): Promise<GbifOccurrences | null> {
  const rows = await db
    .select()
    .from(gbifOccurrencesTable)
    .where(eq(gbifOccurrencesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifOccurrencesTable).where(eq(gbifOccurrencesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeOccurrences(
  cacheKey: string,
  usageKey: number,
  geo: GeographyParams,
  result: GbifOccurrencesResult,
): Promise<GbifOccurrences> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    usage_key: usageKey,
    geography_mode: geo.mode,
    geography_params: serializeGeography(geo),
    occurrence_count: result.occurrence_count,
    occurrence_count_us: result.occurrence_count_us,
    recent_occurrences: result.recent_occurrences,
    source_url: result.source_url,
    occurrence_last_fetched: now,
    expires_at: daysFromNow(OCCURRENCES_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
    general_summary: GBIF_GENERAL_SUMMARY,
    technical_details: GBIF_TECHNICAL_DETAILS,
  };

  const rows = await db
    .insert(gbifOccurrencesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifOccurrencesTable.cache_key,
      set: {
        occurrence_count: insert.occurrence_count,
        occurrence_count_us: insert.occurrence_count_us,
        recent_occurrences: insert.recent_occurrences,
        source_url: insert.source_url,
        occurrence_last_fetched: insert.occurrence_last_fetched,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
