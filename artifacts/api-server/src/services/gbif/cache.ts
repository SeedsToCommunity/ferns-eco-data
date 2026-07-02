import {
  db,
  gbifNameMatchesTable,
  gbifOccurrencesTable,
  gbifSynonymsTable,
  gbifVernacularNamesTable,
  gbifSpeciesTable,
  gbifSpeciesSearchesTable,
  type GbifNameMatch,
  type GbifOccurrences,
  type GbifSynonyms,
  type GbifVernacularNames,
  type GbifSpecies,
  type GbifSpeciesSearches,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { GBIF_SOURCE_ID } from "./metadata.js";

const MATCH_HIT_TTL_DAYS = 30;
const MATCH_NOMATCH_TTL_DAYS = 7;
const OCCURRENCES_TTL_DAYS = 7;
const SYNONYMS_TTL_DAYS = 30;
const VERNACULAR_TTL_DAYS = 30;
const SPECIES_TTL_DAYS = 30;
const SPECIES_SEARCH_TTL_DAYS = 7;

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
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
  name: string,
  result: { raw: unknown; upstream_url: string },
): Promise<GbifNameMatch> {
  const raw = result.raw as Record<string, unknown>;
  const matchType = (raw.matchType as string) || "NONE";
  const isNoMatch = matchType === "NONE" || !("usageKey" in raw);
  const expiresAt = daysFromNow(isNoMatch ? MATCH_NOMATCH_TTL_DAYS : MATCH_HIT_TTL_DAYS);

  const insert = {
    cache_key: cacheKey,
    canonical_name: (raw.canonicalName as string) ?? null,
    scientific_name: (raw.scientificName as string) ?? null,
    usage_key: typeof raw.usageKey === "number" ? raw.usageKey : null,
    accepted_usage_key: typeof raw.acceptedUsageKey === "number" ? raw.acceptedUsageKey : null,
    accepted_canonical_name: (raw.acceptedCanonicalName as string) ?? null,
    rank: (raw.rank as string) ?? null,
    status: (raw.status as string) ?? null,
    confidence: typeof raw.confidence === "number" ? raw.confidence : null,
    match_type: matchType,
    kingdom: (raw.kingdom as string) ?? null,
    phylum: (raw.phylum as string) ?? null,
    class_: (raw.class as string) ?? null,
    order_: (raw.order as string) ?? null,
    family: (raw.family as string) ?? null,
    genus: (raw.genus as string) ?? null,
    species: (raw.species as string) ?? null,
    kingdom_key: typeof raw.kingdomKey === "number" ? raw.kingdomKey : null,
    phylum_key: typeof raw.phylumKey === "number" ? raw.phylumKey : null,
    class_key: typeof raw.classKey === "number" ? raw.classKey : null,
    order_key: typeof raw.orderKey === "number" ? raw.orderKey : null,
    family_key: typeof raw.familyKey === "number" ? raw.familyKey : null,
    genus_key: typeof raw.genusKey === "number" ? raw.genusKey : null,
    species_key: typeof raw.speciesKey === "number" ? raw.speciesKey : null,
    matched_input: name.trim(),
    upstream_response: raw,
    expires_at: expiresAt,
    source_id: GBIF_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.upstream_url,
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
        matched_input: insert.matched_input,
        upstream_response: insert.upstream_response,
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
  result: { raw: unknown; upstream_url: string },
): Promise<GbifOccurrences> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw,
    upstream_url: result.upstream_url,
    fetched_at: now,
    expires_at: daysFromNow(OCCURRENCES_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    method: "api_fetch",
  };

  const rows = await db
    .insert(gbifOccurrencesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifOccurrencesTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        upstream_url: insert.upstream_url,
        fetched_at: insert.fetched_at,
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
  result: { raw: unknown; upstream_url: string },
): Promise<GbifSynonyms> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    usage_key: usageKey,
    upstream_response: result.raw,
    expires_at: daysFromNow(SYNONYMS_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
  };

  const rows = await db
    .insert(gbifSynonymsTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifSynonymsTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupVernacularNames(cacheKey: string): Promise<GbifVernacularNames | null> {
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

export async function storeVernacularNames(
  cacheKey: string,
  usageKey: number,
  result: { raw: unknown; upstream_url: string },
): Promise<GbifVernacularNames> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    usage_key: usageKey,
    upstream_response: result.raw,
    expires_at: daysFromNow(VERNACULAR_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    fetched_at: now,
    method: "api_fetch",
    upstream_url: result.upstream_url,
  };

  const rows = await db
    .insert(gbifVernacularNamesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifVernacularNamesTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSpecies(cacheKey: string): Promise<GbifSpecies | null> {
  const rows = await db
    .select()
    .from(gbifSpeciesTable)
    .where(eq(gbifSpeciesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifSpeciesTable).where(eq(gbifSpeciesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSpecies(
  cacheKey: string,
  result: { raw: unknown; upstream_url: string },
): Promise<GbifSpecies> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw,
    upstream_url: result.upstream_url,
    fetched_at: now,
    expires_at: daysFromNow(SPECIES_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    method: "api_fetch",
  };

  const rows = await db
    .insert(gbifSpeciesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifSpeciesTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        upstream_url: insert.upstream_url,
        fetched_at: insert.fetched_at,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}

export async function lookupSpeciesSearch(cacheKey: string): Promise<GbifSpeciesSearches | null> {
  const rows = await db
    .select()
    .from(gbifSpeciesSearchesTable)
    .where(eq(gbifSpeciesSearchesTable.cache_key, cacheKey))
    .limit(1);
  if (!rows.length) return null;
  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(gbifSpeciesSearchesTable).where(eq(gbifSpeciesSearchesTable.cache_key, cacheKey));
    return null;
  }
  return row;
}

export async function storeSpeciesSearch(
  cacheKey: string,
  result: { raw: unknown; upstream_url: string },
): Promise<GbifSpeciesSearches> {
  const now = new Date();
  const insert = {
    cache_key: cacheKey,
    upstream_response: result.raw,
    upstream_url: result.upstream_url,
    fetched_at: now,
    expires_at: daysFromNow(SPECIES_SEARCH_TTL_DAYS),
    source_id: GBIF_SOURCE_ID,
    method: "api_fetch",
  };

  const rows = await db
    .insert(gbifSpeciesSearchesTable)
    .values(insert)
    .onConflictDoUpdate({
      target: gbifSpeciesSearchesTable.cache_key,
      set: {
        upstream_response: insert.upstream_response,
        upstream_url: insert.upstream_url,
        fetched_at: insert.fetched_at,
        expires_at: insert.expires_at,
      },
    })
    .returning();
  return rows[0];
}
