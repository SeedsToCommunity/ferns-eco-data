import { Router, type IRouter } from "express";
import {
  buildMatchCacheKey,
  buildOccurrencesCacheKey,
  buildSynonymsCacheKey,
  buildVernacularNamesCacheKey,
  fetchNameMatch,
  fetchOccurrences,
  fetchVernacularSearch,
  fetchSynonyms,
  fetchVernacularNames,
  parseGeography,
  buildProvenance,
} from "../services/gbif/connector.js";
import {
  lookupNameMatch,
  storeNameMatch,
  lookupOccurrences,
  storeOccurrences,
  lookupSynonyms,
  storeSynonyms,
  lookupVernacularNames,
  storeVernacularNames,
} from "../services/gbif/cache.js";
import {
  GBIF_SOURCE_ID,
  GBIF_ATTRIBUTION,
  GBIF_LICENSES,
  GBIF_LICENSE_NOTES,
  GBIF_VOCABULARIES,
  GBIF_GENERAL_SUMMARY,
  GBIF_TECHNICAL_DETAILS,
  GBIF_REGISTRY_ENTRY,
} from "../services/gbif/metadata.js";
import { ensureGbifRegistryEntry } from "../services/gbif/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

router.get("/gbif/species/match", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  const cacheKey = buildMatchCacheKey(name);

  if (!refresh) {
    const cached = await lookupNameMatch(cacheKey);
    if (cached) {
      res.json(buildMatchResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchNameMatch(name);
    const stored = await storeNameMatch(cacheKey, result);
    res.json(buildMatchResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "GBIF match fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildMatchResponse(
  row: {
    raw_response: unknown;
    usage_key: number | null;
    canonical_name: string | null;
    scientific_name: string | null;
    rank: string | null;
    status: string | null;
    accepted_usage_key: number | null;
    confidence: number | null;
    match_type: string;
    kingdom: string | null;
    phylum: string | null;
    class_: string | null;
    order_: string | null;
    family: string | null;
    genus: string | null;
    species: string | null;
    kingdom_key: number | null;
    phylum_key: number | null;
    class_key: number | null;
    order_key: number | null;
    family_key: number | null;
    genus_key: number | null;
    species_key: number | null;
    source_url: string | null;
    matched_input: string;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
  },
  _cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  const data = (row.raw_response as Record<string, unknown> | null) ?? {
    usageKey: row.usage_key ?? null,
    canonicalName: row.canonical_name ?? null,
    scientificName: row.scientific_name ?? null,
    rank: row.rank ?? null,
    status: row.status ?? null,
    ...(row.accepted_usage_key != null ? { acceptedUsageKey: row.accepted_usage_key } : {}),
    confidence: row.confidence ?? null,
    matchType: row.match_type,
    kingdom: row.kingdom ?? null,
    phylum: row.phylum ?? null,
    "class": row.class_ ?? null,
    "order": row.order_ ?? null,
    family: row.family ?? null,
    genus: row.genus ?? null,
    species: row.species ?? null,
    kingdomKey: row.kingdom_key ?? null,
    phylumKey: row.phylum_key ?? null,
    classKey: row.class_key ?? null,
    orderKey: row.order_key ?? null,
    familyKey: row.family_key ?? null,
    genusKey: row.genus_key ?? null,
    speciesKey: row.species_key ?? null,
  };
  return {
    source_url: row.source_url ?? null,
    found: row.match_type !== "NONE",
    data,
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      matched_input: row.matched_input,
    }, verbosity),
  };
}

const VALID_CONTINENTS = new Set(["AFRICA","ANTARCTICA","ASIA","EUROPE","NORTH_AMERICA","OCEANIA","SOUTH_AMERICA"]);

router.get("/gbif/occurrence/search", async (req, res) => {
  const rawKey = req.query.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey is required and must be a positive integer" });
    return;
  }

  const rawCountries = typeof req.query.countries === "string" ? req.query.countries : undefined;
  const rawContinent = typeof req.query.continent === "string" ? req.query.continent : undefined;
  const rawBbox = typeof req.query.bbox === "string" ? req.query.bbox : undefined;

  const geoModesProvided = [rawCountries, rawContinent, rawBbox].filter(Boolean).length;
  if (geoModesProvided > 1) {
    res.status(400).json({ error: "invalid_input", message: "countries, continent, and bbox are mutually exclusive — provide at most one" });
    return;
  }

  if (rawContinent && !VALID_CONTINENTS.has(rawContinent)) {
    res.status(400).json({ error: "invalid_input", message: `continent must be one of: ${[...VALID_CONTINENTS].join(", ")}` });
    return;
  }

  if (rawBbox) {
    const parts = rawBbox.split(",").map(Number);
    if (parts.length !== 4 || parts.some((n) => isNaN(n))) {
      res.status(400).json({ error: "invalid_input", message: "bbox must be comma-separated minLat,minLon,maxLat,maxLon (4 decimal numbers)" });
      return;
    }
    const [minLat, minLon, maxLat, maxLon] = parts;
    if (minLat < -90 || maxLat > 90 || minLon < -180 || maxLon > 180 || minLat >= maxLat || minLon >= maxLon) {
      res.status(400).json({ error: "invalid_input", message: "bbox values out of range or inverted: minLat,minLon must be less than maxLat,maxLon; lat in [-90,90], lon in [-180,180]" });
      return;
    }
  }

  const geo = parseGeography({
    countries: rawCountries,
    continent: rawContinent,
    bbox: rawBbox,
  });

  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildOccurrencesCacheKey(usageKey, geo);

  if (!refresh) {
    const cached = await lookupOccurrences(cacheKey);
    if (cached) {
      res.json(buildOccurrencesResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchOccurrences(usageKey, geo);
    const stored = await storeOccurrences(cacheKey, usageKey, geo, result);
    res.json(buildOccurrencesResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "GBIF occurrences fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildOccurrencesResponse(
  row: {
    usage_key: number;
    geography_mode: string;
    geography_params: string;
    occurrence_count: number;
    occurrence_count_us: number | null;
    recent_occurrences: unknown;
    source_url: string | null;
    occurrence_last_fetched: Date;
    source_id: string;
    fetched_at: Date;
    method: string;
    upstream_url: string;
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  return {
    source_url: row.source_url ?? null,
    found: true,
    data: {
      usageKey: row.usage_key,
      geography_mode: row.geography_mode,
      geography_params: row.geography_params,
      occurrence_count: row.occurrence_count,
      occurrence_count_us: row.occurrence_count_us ?? null,
      recent_occurrences: row.recent_occurrences,
      occurrence_last_fetched: row.occurrence_last_fetched,
      source_url: row.source_url ?? null,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/gbif/species/search", async (req, res) => {
  const rawQ = req.query.q;
  if (!rawQ || typeof rawQ !== "string" || rawQ.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "q is required and must be a non-empty string" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchVernacularSearch(rawQ.trim());
    const provenance = buildProvenance(result.upstream_url);

    res.json({
      source_url: `https://www.gbif.org/species/search?q=${encodeURIComponent(rawQ.trim())}&qField=VERNACULAR`,
      found: result.candidates.length > 0,
      data: {
        query: rawQ.trim(),
        candidates: result.candidates,
        count: result.count,
      },
      provenance: filterProvenance({
        source_id: provenance.source_id,
        fetched_at: provenance.fetched_at,
        method: provenance.method,
        upstream_url: provenance.upstream_url,
        general_summary: provenance.general_summary,
        technical_details: provenance.technical_details,
      }, verbosity),
    });
  } catch (err) {
    req.log.error({ err }, "GBIF vernacular search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/species/:usageKey/synonyms", async (req, res) => {
  const rawKey = req.params.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey must be a positive integer" });
    return;
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildSynonymsCacheKey(usageKey, limit, offset);

  if (!refresh) {
    const cached = await lookupSynonyms(cacheKey);
    if (cached) {
      res.json(buildSynonymsResponse(cached, limit, offset, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchSynonyms(usageKey, limit, offset);
    const stored = await storeSynonyms(cacheKey, usageKey, result);
    res.json(buildSynonymsResponse(stored, result.limit, result.offset, refresh ? "bypassed" : "miss", verbosity, result.endOfRecords));
  } catch (err) {
    req.log.error({ err }, "GBIF synonyms fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildSynonymsResponse(
  row: {
    usage_key: number;
    synonyms: unknown;
    synonym_count: number;
    source_id: string;
    fetched_at: Date;
    method: string;
    upstream_url: string;
    general_summary: string;
    technical_details: string;
  },
  limit: number,
  offset: number,
  _cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
  endOfRecords?: boolean,
) {
  const results = Array.isArray(row.synonyms) ? (row.synonyms as Record<string, unknown>[]) : [];
  const computedEndOfRecords = endOfRecords ?? (offset + results.length >= row.synonym_count);
  return {
    source_url: `https://www.gbif.org/species/${row.usage_key}`,
    found: true,
    data: {
      offset,
      limit,
      endOfRecords: computedEndOfRecords,
      count: row.synonym_count,
      results,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/gbif/species/:usageKey/vernacularNames", async (req, res) => {
  const rawKey = req.params.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey must be a positive integer" });
    return;
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildVernacularNamesCacheKey(usageKey, limit, offset);

  if (!refresh) {
    const cached = await lookupVernacularNames(cacheKey);
    if (cached) {
      res.json(buildVernacularNamesResponse(cached, limit, offset, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchVernacularNames(usageKey, limit, offset);
    const stored = await storeVernacularNames(cacheKey, usageKey, result);
    res.json(buildVernacularNamesResponse(stored, result.limit, result.offset, refresh ? "bypassed" : "miss", verbosity, result.endOfRecords));
  } catch (err) {
    req.log.error({ err }, "GBIF vernacular names fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildVernacularNamesResponse(
  row: {
    usage_key: number;
    vernacular_names: unknown;
    vernacular_name_count: number;
    source_id: string;
    fetched_at: Date;
    method: string;
    upstream_url: string;
    general_summary: string;
    technical_details: string;
  },
  limit: number,
  offset: number,
  _cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
  endOfRecords?: boolean,
) {
  const results = Array.isArray(row.vernacular_names) ? (row.vernacular_names as Record<string, unknown>[]) : [];
  const computedEndOfRecords = endOfRecords ?? (offset + results.length >= row.vernacular_name_count);
  return {
    source_url: `https://www.gbif.org/species/${row.usage_key}`,
    found: true,
    data: {
      offset,
      limit,
      endOfRecords: computedEndOfRecords,
      count: row.vernacular_name_count,
      results,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/gbif/metadata", async (req, res) => {
  await ensureGbifRegistryEntry();
  const queriedAt = new Date();

  res.json({
    service_id: GBIF_SOURCE_ID,
    service_name: "GBIF — Taxonomic Backbone, Name Reconciliation, and Occurrence Records",
    licenses: GBIF_LICENSES,
    license_notes: GBIF_LICENSE_NOTES,
    attribution: GBIF_ATTRIBUTION,
    vocabularies: GBIF_VOCABULARIES,
    registry_entry: {
      ...GBIF_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, GBIF_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, GBIF_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      source_id: GBIF_SOURCE_ID,
      fetched_at: queriedAt,
      method: "static_metadata",
      upstream_url: resolveUrl(req, "/api/gbif/metadata"),
      general_summary: GBIF_GENERAL_SUMMARY,
      technical_details: GBIF_TECHNICAL_DETAILS,
    },
  });
});

export default router;
