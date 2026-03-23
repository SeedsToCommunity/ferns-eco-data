import { Router, type IRouter } from "express";
import {
  buildMatchCacheKey,
  buildSynonymsCacheKey,
  buildVernacularCacheKey,
  buildOccurrencesCacheKey,
  fetchNameMatch,
  fetchReconcile,
  fetchOccurrences,
  fetchVernacularSearch,
  parseGeography,
  buildProvenance,
  resolveToAcceptedUsageKey,
} from "../services/gbif/connector.js";
import {
  lookupNameMatch,
  storeNameMatch,
  lookupSynonyms,
  storeSynonyms,
  lookupVernacular,
  storeVernacular,
  lookupOccurrences,
  storeOccurrences,
} from "../services/gbif/cache.js";
import {
  GBIF_SOURCE_ID,
  GBIF_ATTRIBUTION,
  GBIF_PERMISSION_GRANTED,
  GBIF_PERMISSION_STATUS,
  GBIF_VOCABULARIES,
  GBIF_DERIVATION_SUMMARY,
  GBIF_DERIVATION_SCIENTIFIC,
  GBIF_REGISTRY_ENTRY,
} from "../services/gbif/metadata.js";
import { ensureGbifRegistryEntry } from "../services/gbif/seed.js";

const router: IRouter = Router();

router.get("/gbif/match", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";

  const cacheKey = buildMatchCacheKey(name);

  if (!refresh) {
    const cached = await lookupNameMatch(cacheKey);
    if (cached) {
      res.json(buildMatchResponse(cached, "hit"));
      return;
    }
  }

  try {
    const result = await fetchNameMatch(name);
    const stored = await storeNameMatch(cacheKey, result);
    res.json(buildMatchResponse(stored, refresh ? "bypassed" : "miss"));
  } catch (err) {
    req.log.error({ err }, "GBIF match fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildMatchResponse(
  row: {
    usage_key: number | null;
    canonical_name: string | null;
    scientific_name: string | null;
    rank: string | null;
    status: string | null;
    accepted_usage_key: number | null;
    accepted_canonical_name: string | null;
    confidence: number | null;
    match_type: string;
    kingdom: string | null;
    phylum: string | null;
    class_: string | null;
    order_: string | null;
    family: string | null;
    genus: string | null;
    species: string | null;
    source_url: string | null;
    matched_input: string;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    derivation_summary: string;
    derivation_scientific: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
) {
  return {
    source_url: row.source_url ?? null,
    found: row.match_type !== "NONE",
    data: {
      usage_key: row.usage_key ?? null,
      canonical_name: row.canonical_name ?? null,
      scientific_name: row.scientific_name ?? null,
      rank: row.rank ?? null,
      status: row.status ?? null,
      accepted_usage_key: row.accepted_usage_key ?? null,
      accepted_canonical_name: row.accepted_canonical_name ?? null,
      confidence: row.confidence ?? null,
      match_type: row.match_type,
      kingdom: row.kingdom ?? null,
      phylum: row.phylum ?? null,
      class_: row.class_ ?? null,
      order_: row.order_ ?? null,
      family: row.family ?? null,
      genus: row.genus ?? null,
      species: row.species ?? null,
      source_url: row.source_url ?? null,
      matched_input: row.matched_input,
      matched_at: row.fetched_at,
      cache_status,
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/gbif/reconcile", async (req, res) => {
  const rawKey = req.query.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey is required and must be a positive integer" });
    return;
  }

  const refresh = req.query.refresh === "true" || req.query.refresh === "1";

  try {
    // Auto-resolve: if caller passed a synonym usageKey, resolve to accepted key first
    const { resolvedKey, wasSynonym } = await resolveToAcceptedUsageKey(usageKey);

    const synKey = buildSynonymsCacheKey(resolvedKey);
    const vernKey = buildVernacularCacheKey(resolvedKey);

    if (!refresh) {
      const [cachedSyn, cachedVern] = await Promise.all([
        lookupSynonyms(synKey),
        lookupVernacular(vernKey),
      ]);

      if (cachedSyn && cachedVern) {
        res.json(buildReconcileResponse(resolvedKey, cachedSyn, cachedVern, wasSynonym ? usageKey : null));
        return;
      }
    }

    const result = await fetchReconcile(resolvedKey);

    const [storedSyn, storedVern] = await Promise.all([
      storeSynonyms(synKey, resolvedKey, result),
      storeVernacular(vernKey, resolvedKey, result),
    ]);

    res.json(buildReconcileResponse(resolvedKey, storedSyn, storedVern, wasSynonym ? usageKey : null));
  } catch (err) {
    req.log.error({ err }, "GBIF reconcile fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

function buildReconcileResponse(
  usageKey: number,
  syn: {
    synonyms: unknown;
    synonym_count: number;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    derivation_summary: string;
    derivation_scientific: string;
  },
  vern: {
    vernacular_names: unknown;
    vernacular_name_primary: string | null;
    vernacular_name_count: number;
    fetched_at: Date;
    upstream_url: string;
  },
  resolvedFromSynonymKey: number | null = null,
) {
  return {
    source_url: `https://www.gbif.org/species/${usageKey}`,
    found: true,
    data: {
      usage_key: usageKey,
      resolved_from_synonym_key: resolvedFromSynonymKey ?? null,
      synonyms: syn.synonyms,
      synonym_count: syn.synonym_count,
      vernacular_names: vern.vernacular_names,
      vernacular_name_primary: vern.vernacular_name_primary ?? null,
      vernacular_name_count: vern.vernacular_name_count,
      synonyms_fetched_at: syn.fetched_at,
      vernacular_fetched_at: vern.fetched_at,
    },
    provenance: {
      source_id: syn.source_id,
      fetched_at: syn.fetched_at,
      method: syn.method,
      upstream_url: syn.upstream_url,
      derivation_summary: syn.derivation_summary,
      derivation_scientific: syn.derivation_scientific,
    },
  };
}

const VALID_CONTINENTS = new Set(["AFRICA","ANTARCTICA","ASIA","EUROPE","NORTH_AMERICA","OCEANIA","SOUTH_AMERICA"]);

router.get("/gbif/occurrences", async (req, res) => {
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
  const cacheKey = buildOccurrencesCacheKey(usageKey, geo);

  if (!refresh) {
    const cached = await lookupOccurrences(cacheKey);
    if (cached) {
      res.json(buildOccurrencesResponse(cached, "hit"));
      return;
    }
  }

  try {
    const result = await fetchOccurrences(usageKey, geo);
    const stored = await storeOccurrences(cacheKey, usageKey, geo, result);
    res.json(buildOccurrencesResponse(stored, refresh ? "bypassed" : "miss"));
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
    derivation_summary: string;
    derivation_scientific: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
) {
  return {
    source_url: row.source_url ?? null,
    found: true,
    data: {
      usage_key: row.usage_key,
      geography_mode: row.geography_mode,
      geography_params: row.geography_params,
      occurrence_count: row.occurrence_count,
      occurrence_count_us: row.occurrence_count_us ?? null,
      recent_occurrences: row.recent_occurrences,
      occurrence_last_fetched: row.occurrence_last_fetched,
      source_url: row.source_url ?? null,
      cache_status,
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/gbif/search", async (req, res) => {
  const rawQ = req.query.q;
  if (!rawQ || typeof rawQ !== "string" || rawQ.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "q is required and must be a non-empty string" });
    return;
  }

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
      provenance: {
        source_id: provenance.source_id,
        fetched_at: provenance.fetched_at,
        method: provenance.method,
        upstream_url: provenance.upstream_url,
        derivation_summary: provenance.derivation_summary,
        derivation_scientific: provenance.derivation_scientific,
      },
    });
  } catch (err) {
    req.log.error({ err }, "GBIF vernacular search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/metadata", async (_req, res) => {
  await ensureGbifRegistryEntry();

  res.json({
    service_id: GBIF_SOURCE_ID,
    service_name: "GBIF — Taxonomic Backbone, Name Reconciliation, and Occurrence Records",
    permission_granted: GBIF_PERMISSION_GRANTED,
    permission_status: GBIF_PERMISSION_STATUS,
    attribution: GBIF_ATTRIBUTION,
    vocabularies: GBIF_VOCABULARIES,
    registry_entry: {
      ...GBIF_REGISTRY_ENTRY,
    },
    queried_at: new Date(),
  });
});

export default router;
