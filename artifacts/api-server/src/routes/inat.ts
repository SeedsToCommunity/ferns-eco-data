import { Router, type IRouter } from "express";
import {
  buildPlaceCacheKey,
  buildSpeciesCacheKey,
  buildPhenologyCacheKey,
  sortPlaceIds,
  fetchPlaces,
  fetchSpecies,
  fetchPhenology,
  buildProvenance,
} from "../services/inat/connector.js";
import {
  lookupPlace,
  storePlace,
  lookupSpecies,
  storeSpecies,
  lookupPhenology,
  storePhenology,
} from "../services/inat/cache.js";
import {
  INAT_SOURCE_ID,
  INAT_ATTRIBUTION,
  INAT_PERMISSION_STATUS,
  INAT_DERIVATION_SUMMARY,
  INAT_DERIVATION_SCIENTIFIC,
  INAT_REGISTRY_ENTRY,
} from "../services/inat/metadata.js";
import { ensureInatRegistryEntry } from "../services/inat/seed.js";
import {
  GetInatPlaceQueryParams,
  GetInatPlaceResponse,
  GetInatSpeciesQueryParams,
  GetInatSpeciesResponse,
  GetInatPhenologyQueryParams,
  GetInatPhenologyResponse,
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

  const source_url = results.length > 0
    ? `https://www.inaturalist.org/places/${results[0].id}`
    : null;

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
    inat_taxon_id: number | null;
    inat_name: string | null;
    match_type: string | null;
    preferred_common_name: string | null;
    common_names: unknown;
    wikipedia_summary: string | null;
    wikipedia_url: string | null;
    default_photo_url: string | null;
    conservation_status: unknown;
    native_status: unknown;
    observations_count: number | null;
    source_url: string | null;
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
    data: {
      inat_taxon_id: row.inat_taxon_id ?? null,
      inat_name: row.inat_name ?? null,
      match_type: row.match_type ?? null,
      preferred_common_name: row.preferred_common_name ?? null,
      common_names: row.common_names ?? [],
      wikipedia_summary: row.wikipedia_summary ?? null,
      wikipedia_url: row.wikipedia_url ?? null,
      default_photo_url: row.default_photo_url ?? null,
      conservation_status: row.conservation_status ?? null,
      native_status: row.native_status ?? [],
      observations_count: row.observations_count ?? null,
      source_url: row.source_url ?? null,
      fetched_at: row.fetched_at,
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

router.get("/inat/phenology", async (req, res) => {
  const parsed = GetInatPhenologyQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id;
  const rawPlaceId = parsed.data.place_id;
  const placeIdParts = rawPlaceId.split(",").map((s) => s.trim()).filter(Boolean);
  const placeIds = placeIdParts.map(Number);
  if (placeIds.some((n) => isNaN(n) || n <= 0)) {
    res.status(400).json({ error: "invalid_input", message: "place_id must be comma-separated positive integers" });
    return;
  }

  const sortedPlaceIds = sortPlaceIds(placeIds);
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildPhenologyCacheKey(taxonId, sortedPlaceIds);

  if (!refresh) {
    const cached = await lookupPhenology(cacheKey);
    if (cached) {
      res.json(GetInatPhenologyResponse.parse(buildPhenologyResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchPhenology(taxonId, sortedPlaceIds);
    const stored = await storePhenology(cacheKey, result);
    res.json(GetInatPhenologyResponse.parse(buildPhenologyResponse(stored, refresh ? "bypassed" : "miss")));
  } catch (err) {
    req.log.error({ err }, "iNat phenology fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildPhenologyResponse(
  row: {
    taxon_id: number;
    place_ids: number[] | null;
    observations_by_month: unknown;
    phenology_by_month: unknown;
    phenology_stages_available: string[] | null;
    peak_observation_month: number | null;
    annotations_available: boolean;
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
    data: {
      taxon_id: row.taxon_id,
      place_ids: row.place_ids ?? [],
      observations_by_month: row.observations_by_month ?? {},
      phenology_by_month: row.phenology_by_month ?? {},
      phenology_stages_available: row.phenology_stages_available ?? [],
      peak_observation_month: row.peak_observation_month ?? null,
      annotations_available: row.annotations_available,
      fetched_at: row.fetched_at,
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

  res.json(GetInatObservationsResponse.parse({
    source_url: taxonId && placeId
      ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeId}`
      : observations_by_species_url,
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

router.get("/inat/metadata", async (_req, res) => {
  await ensureInatRegistryEntry();
  const queriedAt = new Date();

  res.json(GetInatMetadataResponse.parse({
    service_id: INAT_SOURCE_ID,
    service_name: "iNaturalist — Observations, Phenology, and Species Appearance",
    permission_status: INAT_PERMISSION_STATUS,
    attribution: INAT_ATTRIBUTION,
    registry_entry: {
      ...INAT_REGISTRY_ENTRY,
    },
    queried_at: queriedAt,
    provenance: {
      source_id: INAT_SOURCE_ID,
      fetched_at: queriedAt,
      method: "static_metadata",
      upstream_url: "/api/inat/metadata",
      derivation_summary: INAT_DERIVATION_SUMMARY,
      derivation_scientific: INAT_DERIVATION_SCIENTIFIC,
    },
  }));
});

export default router;
