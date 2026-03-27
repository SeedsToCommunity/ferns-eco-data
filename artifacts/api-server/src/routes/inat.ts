import { Router, type IRouter } from "express";
import {
  buildPlaceCacheKey,
  buildSpeciesCacheKey,
  buildHistogramCacheKey,
  buildFieldValuesCacheKey,
  sortPlaceIds,
  fetchPlaces,
  fetchSpecies,
  fetchHistogram,
  fetchFieldValues,
  buildProvenance,
} from "../services/inat/connector.js";
import {
  lookupPlace,
  storePlace,
  lookupSpecies,
  storeSpecies,
  lookupHistogram,
  storeHistogram,
  lookupFieldValues,
  storeFieldValues,
} from "../services/inat/cache.js";
import {
  INAT_SOURCE_ID,
  INAT_ATTRIBUTION,
  INAT_PERMISSION_GRANTED,
  INAT_PERMISSION_STATUS,
  INAT_DERIVATION_SUMMARY,
  INAT_DERIVATION_SCIENTIFIC,
  INAT_REGISTRY_ENTRY,
} from "../services/inat/metadata.js";
import { ensureInatRegistryEntry } from "../services/inat/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  GetInatPlaceQueryParams,
  GetInatPlaceResponse,
  GetInatSpeciesQueryParams,
  GetInatSpeciesResponse,
  GetInatHistogramQueryParams,
  GetInatHistogramResponse,
  GetInatFieldValuesQueryParams,
  GetInatFieldValuesResponse,
  GetInatObservationsQueryParams,
  GetInatObservationsResponse,
  GetInatMetadataResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/inat/place", async (req, res) => {
  const parsed = GetInatPlaceQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const q = parsed.data.q;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildPlaceCacheKey(q);

  if (!refresh) {
    const cached = await lookupPlace(cacheKey);
    if (cached) {
      res.json(GetInatPlaceResponse.parse(buildPlaceResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchPlaces(q);
    const stored = await storePlace(cacheKey, result);
    res.json(GetInatPlaceResponse.parse(buildPlaceResponse(stored, refresh ? "bypassed" : "miss")));
  } catch (err) {
    req.log.error({ err }, "iNat place lookup failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildPlaceResponse(
  row: {
    query: string;
    results: unknown;
    found: boolean;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    derivation_summary: string;
    derivation_scientific: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
) {
  const results = (row.results as Array<{
    id: number;
    display_name: string;
    place_type: number;
    place_type_name: string;
  }>) || [];

  const source_url = row.upstream_url ?? null;

  const resultsWithUrl = results.map((r) => ({
    ...r,
    inat_url: `https://www.inaturalist.org/places/${r.id}`,
  }));

  return {
    source_url,
    found: row.found,
    data: {
      query: row.query,
      results: resultsWithUrl,
      resolved_at: row.fetched_at,
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

router.get("/inat/species", async (req, res) => {
  const parsed = GetInatSpeciesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildSpeciesCacheKey(name);

  if (!refresh) {
    const cached = await lookupSpecies(cacheKey);
    if (cached) {
      res.json(GetInatSpeciesResponse.parse(buildSpeciesResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchSpecies(name);
    const stored = await storeSpecies(cacheKey, result);
    res.json(GetInatSpeciesResponse.parse(buildSpeciesResponse(stored, refresh ? "bypassed" : "miss")));
  } catch (err) {
    req.log.error({ err }, "iNat species lookup failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildSpeciesResponse(
  row: {
    found: boolean;
    match_type: string | null;
    source_url: string | null;
    raw_response: unknown;
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
    found: row.found,
    match_type: row.match_type ?? null,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response ?? null,
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

router.get("/inat/histogram", async (req, res) => {
  const parsed = GetInatHistogramQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id;
  const rawPlaceId = parsed.data.place_id ?? "";
  const placeIdParts = rawPlaceId.split(",").map((s) => s.trim()).filter(Boolean);
  const placeIds = placeIdParts.map(Number);
  if (placeIds.some((n) => isNaN(n) || n <= 0)) {
    res.status(400).json({ error: "invalid_input", message: "place_id must be comma-separated positive integers" });
    return;
  }

  const sortedPlaceIds = sortPlaceIds(placeIds);
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildHistogramCacheKey(taxonId, sortedPlaceIds);

  if (!refresh) {
    const cached = await lookupHistogram(cacheKey);
    if (cached) {
      res.json(GetInatHistogramResponse.parse(buildPassthroughResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchHistogram(taxonId, sortedPlaceIds);
    const stored = await storeHistogram(cacheKey, result);
    res.json(GetInatHistogramResponse.parse(buildPassthroughResponse(stored, refresh ? "bypassed" : "miss")));
  } catch (err) {
    req.log.error({ err }, "iNat histogram fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/field-values", async (req, res) => {
  const rawVerifiable = req.query.verifiable;
  const preprocessed = {
    ...req.query,
    verifiable: rawVerifiable === "false" ? false : rawVerifiable === "true" ? true : rawVerifiable,
  };
  const parsed = GetInatFieldValuesQueryParams.safeParse(preprocessed);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id;
  const rawPlaceId = parsed.data.place_id ?? "";
  const placeIdParts = rawPlaceId.split(",").map((s) => s.trim()).filter(Boolean);
  const placeIds = placeIdParts.map(Number);
  if (placeIds.some((n) => isNaN(n) || n <= 0)) {
    res.status(400).json({ error: "invalid_input", message: "place_id must be comma-separated positive integers" });
    return;
  }

  const sortedPlaceIds = sortPlaceIds(placeIds);
  const verifiable = parsed.data.verifiable ?? true;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildFieldValuesCacheKey(taxonId, sortedPlaceIds, verifiable);

  if (!refresh) {
    const cached = await lookupFieldValues(cacheKey);
    if (cached) {
      res.json(GetInatFieldValuesResponse.parse(buildPassthroughResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchFieldValues(taxonId, sortedPlaceIds, verifiable);
    const stored = await storeFieldValues(cacheKey, result);
    res.json(GetInatFieldValuesResponse.parse(buildPassthroughResponse(stored, refresh ? "bypassed" : "miss")));
  } catch (err) {
    req.log.error({ err }, "iNat field values fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildPassthroughResponse(
  row: {
    raw_response: unknown;
    source_url: string;
    found: boolean;
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
    source_url: row.source_url,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response,
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

router.get("/inat/observations", (req, res) => {
  const parsed = GetInatObservationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id ?? null;
  const placeId = parsed.data.place_id ?? null;

  const observations_by_species_url = taxonId
    ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}`
    : `https://www.inaturalist.org/observations`;

  const observations_by_place_url = placeId
    ? `https://www.inaturalist.org/observations?place_id=${placeId}`
    : `https://www.inaturalist.org/observations`;

  const api_observations_endpoint = "https://api.inaturalist.org/v1/observations";

  const queriedAt = new Date();
  const prov = buildProvenance("/api/inat/observations", "url_construction");

  const combined_url = taxonId && placeId
    ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeId}`
    : null;
  const source_url = combined_url ?? (placeId ? observations_by_place_url : observations_by_species_url);

  res.json(GetInatObservationsResponse.parse({
    source_url,
    found: true,
    data: {
      taxon_id: taxonId,
      place_id: placeId,
      observations_by_species_url,
      observations_by_place_url,
      api_observations_endpoint,
      queried_at: queriedAt,
    },
    provenance: {
      source_id: prov.source_id,
      fetched_at: prov.fetched_at,
      method: prov.method,
      upstream_url: prov.upstream_url,
      derivation_summary: prov.derivation_summary,
      derivation_scientific: prov.derivation_scientific,
    },
  }));
});

router.get("/inat/metadata", async (req, res) => {
  await ensureInatRegistryEntry();
  const queriedAt = new Date();

  res.json(GetInatMetadataResponse.parse({
    service_id: INAT_SOURCE_ID,
    service_name: "iNaturalist — Observations, Phenology, and Species Appearance",
    permission_granted: INAT_PERMISSION_GRANTED,
    permission_status: INAT_PERMISSION_STATUS,
    attribution: INAT_ATTRIBUTION,
    registry_entry: {
      ...INAT_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, INAT_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, INAT_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      source_id: INAT_SOURCE_ID,
      fetched_at: queriedAt,
      method: "static_metadata",
      upstream_url: resolveUrl(req, "/api/inat/metadata"),
      derivation_summary: INAT_DERIVATION_SUMMARY,
      derivation_scientific: INAT_DERIVATION_SCIENTIFIC,
    },
  }));
});

export default router;
