import { Router, type IRouter } from "express";
import {
  buildPlaceCacheKey,
  buildHistogramCacheKey,
  buildFieldValuesCacheKey,
  buildControlledTermsCacheKey,
  buildControlledTermsForTaxonCacheKey,
  buildTaxonByIdCacheKey,
  buildPlaceByIdCacheKey,
  sortPlaceIds,
  fetchPlaces,
  fetchHistogram,
  fetchFieldValues,
  fetchObservationSummary,
  fetchSpeciesCounts,
  fetchControlledTerms,
  fetchControlledTermsForTaxon,
  fetchTaxaAutocomplete,
  fetchTaxonById,
  fetchPlaceById,
  fetchPlacesNearby,
  fetchTaxonSummary,
  fetchSimilarSpecies,
  fetchIdentSpeciesCounts,
  fetchRecentTaxa,
  fetchIdentifications,
  fetchIdentificationById,
  buildProvenance,
} from "../services/inat/connector.js";
import {
  lookupPlace,
  storePlace,
  lookupHistogram,
  storeHistogram,
  lookupFieldValues,
  storeFieldValues,
  lookupControlledTerms,
  storeControlledTerms,
  lookupTaxonById,
  storeTaxonById,
  lookupPlaceById,
  storePlaceById,
} from "../services/inat/cache.js";
import {
  INAT_SOURCE_ID,
  INAT_ATTRIBUTION,
  INAT_LICENSES,
  INAT_LICENSE_NOTES,
  INAT_GENERAL_SUMMARY,
  INAT_TECHNICAL_DETAILS,
  INAT_REGISTRY_ENTRY,
} from "../services/inat/metadata.js";
import { ensureInatRegistryEntry } from "../services/inat/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  GetInatPlacesAutocompleteQueryParams,
  GetInatPlacesAutocompleteResponse,
  GetInatObservationsHistogramQueryParams,
  GetInatObservationsHistogramResponse,
  GetInatObservationsPopularFieldValuesQueryParams,
  GetInatObservationsPopularFieldValuesResponse,
  GetInatObservationsQueryParams,
  GetInatObservationsResponse,
  GetInatObservationsSpeciesCountsQueryParams,
  GetInatObservationsSpeciesCountsResponse,
  GetInatControlledTermsQueryParams,
  GetInatControlledTermsResponse,
  GetInatControlledTermsForTaxonQueryParams,
  GetInatControlledTermsForTaxonResponse,
  GetInatTaxaAutocompleteQueryParams,
  GetInatTaxaAutocompleteResponse,
  GetInatTaxaByIdParams,
  GetInatTaxaByIdQueryParams,
  GetInatTaxaByIdResponse,
  GetInatPlacesByIdParams,
  GetInatPlacesByIdQueryParams,
  GetInatPlacesByIdResponse,
  GetInatPlacesNearbyQueryParams,
  GetInatPlacesNearbyResponse,
  GetInatObservationsTaxonSummaryParams,
  GetInatObservationsTaxonSummaryQueryParams,
  GetInatObservationsTaxonSummaryResponse,
  GetInatIdentificationsSimilarSpeciesQueryParams,
  GetInatIdentificationsSimilarSpeciesResponse,
  GetInatIdentificationsSpeciesCountsQueryParams,
  GetInatIdentificationsSpeciesCountsResponse,
  GetInatIdentificationsRecentTaxaQueryParams,
  GetInatIdentificationsRecentTaxaResponse,
  GetInatIdentificationsQueryParams,
  GetInatIdentificationsResponse,
  GetInatIdentificationsByIdParams,
  GetInatIdentificationsByIdQueryParams,
  GetInatIdentificationsByIdResponse,
  GetInatMetadataResponse,
} from "@workspace/api-zod";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

router.get("/inat/places/autocomplete", async (req, res) => {
  const parsed = GetInatPlacesAutocompleteQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const q = parsed.data.q;
  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildPlaceCacheKey(q);

  if (!refresh) {
    const cached = await lookupPlace(cacheKey);
    if (cached) {
      res.json(GetInatPlacesAutocompleteResponse.parse(buildPlaceResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchPlaces(q);
    const stored = await storePlace(cacheKey, result);
    res.json(GetInatPlacesAutocompleteResponse.parse(buildPlaceResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
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
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
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

router.get("/inat/observations/histogram", async (req, res) => {
  const parsed = GetInatObservationsHistogramQueryParams.safeParse(req.query);
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
  const termId = parsed.data.term_id ?? undefined;
  const termValueId = parsed.data.term_value_id ?? undefined;
  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildHistogramCacheKey(taxonId, sortedPlaceIds, termId, termValueId);

  if (!refresh) {
    const cached = await lookupHistogram(cacheKey);
    if (cached) {
      res.json(GetInatObservationsHistogramResponse.parse(buildPassthroughResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchHistogram(taxonId, sortedPlaceIds, termId, termValueId);
    const stored = await storeHistogram(cacheKey, result);
    res.json(GetInatObservationsHistogramResponse.parse(buildPassthroughResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "iNat histogram fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/observations/popular_field_values", async (req, res) => {
  const rawVerifiable = req.query.verifiable;
  const preprocessed = {
    ...req.query,
    verifiable: rawVerifiable === "false" ? false : rawVerifiable === "true" ? true : rawVerifiable,
  };
  const parsed = GetInatObservationsPopularFieldValuesQueryParams.safeParse(preprocessed);
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
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildFieldValuesCacheKey(taxonId, sortedPlaceIds, verifiable);

  if (!refresh) {
    const cached = await lookupFieldValues(cacheKey);
    if (cached) {
      res.json(GetInatObservationsPopularFieldValuesResponse.parse(buildPassthroughResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchFieldValues(taxonId, sortedPlaceIds, verifiable);
    const stored = await storeFieldValues(cacheKey, result);
    res.json(GetInatObservationsPopularFieldValuesResponse.parse(buildPassthroughResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
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
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  return {
    source_url: row.source_url,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response,
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

router.get("/inat/observations", async (req, res) => {
  const parsed = GetInatObservationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id ?? null;
  const placeId = parsed.data.place_id ?? null;
  const qualityGrade = parsed.data.quality_grade ?? null;
  const perPage = parsed.data.per_page ?? 30;
  const page = parsed.data.page ?? 1;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchObservationSummary(taxonId, placeId, qualityGrade, perPage, page, {
      lat:   parsed.data.lat ?? null,
      lng:   parsed.data.lng ?? null,
      radius: parsed.data.radius ?? null,
      nelat: parsed.data.nelat ?? null,
      nelng: parsed.data.nelng ?? null,
      swlat: parsed.data.swlat ?? null,
      swlng: parsed.data.swlng ?? null,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");

    res.json(GetInatObservationsResponse.parse({
      source_url: result.source_url,
      found: result.total_results > 0,
      data: {
        total_results: result.total_results,
        page: result.page,
        per_page: result.per_page,
        total_pages: result.total_pages,
        results: result.results,
      },
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat observations fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/observations/species_counts", async (req, res) => {
  const parsed = GetInatObservationsSpeciesCountsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchSpeciesCounts({
      place_id:          parsed.data.place_id ?? undefined,
      quality_grade:     parsed.data.quality_grade ?? undefined,
      iconic_taxon_name: parsed.data.iconic_taxon_name ?? undefined,
      native:            parsed.data.native ?? undefined,
      introduced:        parsed.data.introduced ?? undefined,
      term_id:           parsed.data.term_id ?? undefined,
      term_value_id:     parsed.data.term_value_id ?? undefined,
      month:             parsed.data.month ?? undefined,
      per_page:          parsed.data.per_page ?? undefined,
      page:              parsed.data.page ?? undefined,
      lat:               parsed.data.lat ?? undefined,
      lng:               parsed.data.lng ?? undefined,
      radius:            parsed.data.radius ?? undefined,
      nelat:             parsed.data.nelat ?? undefined,
      nelng:             parsed.data.nelng ?? undefined,
      swlat:             parsed.data.swlat ?? undefined,
      swlng:             parsed.data.swlng ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    res.json(GetInatObservationsSpeciesCountsResponse.parse({
      source_url: result.source_url,
      found: total > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat observations/species_counts fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/observations/:id/taxon_summary", async (req, res) => {
  const pathParsed = GetInatObservationsTaxonSummaryParams.safeParse(req.params);
  if (!pathParsed.success) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer" });
    return;
  }

  const queryParsed = GetInatObservationsTaxonSummaryQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: "invalid_input", message: queryParsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchTaxonSummary(pathParsed.data.id);
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const found = !!(raw["wikipedia_summary"] || raw["listed_taxon"] || raw["conservation_status"]);

    res.json(GetInatObservationsTaxonSummaryResponse.parse({
      source_url: result.source_url,
      found,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat observations/:id/taxon_summary fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/identifications/similar_species", async (req, res) => {
  const parsed = GetInatIdentificationsSimilarSpeciesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchSimilarSpecies({
      taxon_id:      parsed.data.taxon_id,
      place_id:      parsed.data.place_id ?? undefined,
      quality_grade: parsed.data.quality_grade ?? undefined,
      lat:           parsed.data.lat ?? undefined,
      lng:           parsed.data.lng ?? undefined,
      radius:        parsed.data.radius ?? undefined,
      nelat:         parsed.data.nelat ?? undefined,
      nelng:         parsed.data.nelng ?? undefined,
      swlat:         parsed.data.swlat ?? undefined,
      swlng:         parsed.data.swlng ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;
    const results = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    res.json(GetInatIdentificationsSimilarSpeciesResponse.parse({
      source_url: result.source_url,
      found: total > 0 || results > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat identifications/similar_species fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/identifications/species_counts", async (req, res) => {
  const parsed = GetInatIdentificationsSpeciesCountsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchIdentSpeciesCounts({
      taxon_id:      parsed.data.taxon_id ?? undefined,
      place_id:      parsed.data.place_id ?? undefined,
      quality_grade: parsed.data.quality_grade ?? undefined,
      per_page:      parsed.data.per_page ?? undefined,
      page:          parsed.data.page ?? undefined,
      d1:            parsed.data.d1 ?? undefined,
      d2:            parsed.data.d2 ?? undefined,
      month:         parsed.data.month ?? undefined,
      native:        parsed.data.native ?? undefined,
      introduced:    parsed.data.introduced ?? undefined,
      lat:           parsed.data.lat ?? undefined,
      lng:           parsed.data.lng ?? undefined,
      radius:        parsed.data.radius ?? undefined,
      nelat:         parsed.data.nelat ?? undefined,
      nelng:         parsed.data.nelng ?? undefined,
      swlat:         parsed.data.swlat ?? undefined,
      swlng:         parsed.data.swlng ?? undefined,
      order:         parsed.data.order ?? undefined,
      order_by:      parsed.data.order_by ?? undefined,
      taxon_of:      parsed.data.taxon_of ?? undefined,
      iconic_taxa:   parsed.data.iconic_taxa ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    res.json(GetInatIdentificationsSpeciesCountsResponse.parse({
      source_url: result.source_url,
      found: total > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat identifications/species_counts fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/identifications/recent_taxa", async (req, res) => {
  const parsed = GetInatIdentificationsRecentTaxaQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchRecentTaxa({
      place_id:      parsed.data.place_id ?? undefined,
      taxon_id:      parsed.data.taxon_id ?? undefined,
      quality_grade: parsed.data.quality_grade ?? undefined,
      per_page:      parsed.data.per_page ?? undefined,
      page:          parsed.data.page ?? undefined,
      d1:            parsed.data.d1 ?? undefined,
      d2:            parsed.data.d2 ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const results = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    res.json(GetInatIdentificationsRecentTaxaResponse.parse({
      source_url: result.source_url,
      found: results > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat identifications/recent_taxa fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/identifications", async (req, res) => {
  const parsed = GetInatIdentificationsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchIdentifications({
      taxon_id:      parsed.data.taxon_id ?? undefined,
      place_id:      parsed.data.place_id ?? undefined,
      quality_grade: parsed.data.quality_grade ?? undefined,
      per_page:      parsed.data.per_page ?? undefined,
      page:          parsed.data.page ?? undefined,
      d1:            parsed.data.d1 ?? undefined,
      d2:            parsed.data.d2 ?? undefined,
      month:         parsed.data.month ?? undefined,
      native:        parsed.data.native ?? undefined,
      introduced:    parsed.data.introduced ?? undefined,
      lat:           parsed.data.lat ?? undefined,
      lng:           parsed.data.lng ?? undefined,
      radius:        parsed.data.radius ?? undefined,
      nelat:         parsed.data.nelat ?? undefined,
      nelng:         parsed.data.nelng ?? undefined,
      swlat:         parsed.data.swlat ?? undefined,
      swlng:         parsed.data.swlng ?? undefined,
      locale:        parsed.data.locale ?? undefined,
      user_id:       parsed.data.user_id ?? undefined,
      user_login:    parsed.data.user_login ?? undefined,
      iconic_taxa:   parsed.data.iconic_taxa ?? undefined,
      term_id:       parsed.data.term_id ?? undefined,
      term_value_id: parsed.data.term_value_id ?? undefined,
      verifiable:    parsed.data.verifiable ?? undefined,
      order:         parsed.data.order ?? undefined,
      order_by:      parsed.data.order_by ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    res.json(GetInatIdentificationsResponse.parse({
      source_url: result.source_url,
      found: total > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat identifications fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/identifications/:id", async (req, res) => {
  const pathParsed = GetInatIdentificationsByIdParams.safeParse(req.params);
  if (!pathParsed.success) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer" });
    return;
  }

  const queryParsed = GetInatIdentificationsByIdQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: "invalid_input", message: queryParsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchIdentificationById(pathParsed.data.id);
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const results = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    res.json(GetInatIdentificationsByIdResponse.parse({
      source_url: result.source_url,
      found: results > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat identifications/:id fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/controlled_terms", async (req, res) => {
  const parsed = GetInatControlledTermsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildControlledTermsCacheKey();

  if (!refresh) {
    const cached = await lookupControlledTerms(cacheKey);
    if (cached) {
      res.json(GetInatControlledTermsResponse.parse(buildCachedPassthroughResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchControlledTerms();
    const stored = await storeControlledTerms(cacheKey, result);
    res.json(GetInatControlledTermsResponse.parse(buildCachedPassthroughResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "iNat controlled_terms fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/controlled_terms/for_taxon", async (req, res) => {
  const parsed = GetInatControlledTermsForTaxonQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = parsed.data.taxon_id;
  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildControlledTermsForTaxonCacheKey(taxonId);

  if (!refresh) {
    const cached = await lookupControlledTerms(cacheKey);
    if (cached) {
      res.json(GetInatControlledTermsForTaxonResponse.parse(buildCachedPassthroughResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchControlledTermsForTaxon(taxonId);
    const stored = await storeControlledTerms(cacheKey, result);
    res.json(GetInatControlledTermsForTaxonResponse.parse(buildCachedPassthroughResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "iNat controlled_terms/for_taxon fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/taxa/autocomplete", async (req, res) => {
  const parsed = GetInatTaxaAutocompleteQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchTaxaAutocomplete({
      q:                  parsed.data.q,
      per_page:           parsed.data.per_page ?? undefined,
      is_active:          parsed.data.is_active ?? undefined,
      rank:               parsed.data.rank ?? undefined,
      locale:             parsed.data.locale ?? undefined,
      all_names:          parsed.data.all_names ?? undefined,
      preferred_place_id: parsed.data.preferred_place_id ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    res.json(GetInatTaxaAutocompleteResponse.parse({
      source_url: result.source_url,
      found: total > 0,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat taxa/autocomplete fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/taxa/:id", async (req, res) => {
  const pathParsed = GetInatTaxaByIdParams.safeParse(req.params);
  if (!pathParsed.success) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer" });
    return;
  }

  const queryParsed = GetInatTaxaByIdQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: "invalid_input", message: queryParsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const taxonId = pathParsed.data.id;
  const refresh = queryParsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildTaxonByIdCacheKey(taxonId);

  if (!refresh) {
    const cached = await lookupTaxonById(cacheKey);
    if (cached) {
      res.json(GetInatTaxaByIdResponse.parse(buildTaxonByIdResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchTaxonById(taxonId);
    const stored = await storeTaxonById(cacheKey, taxonId, result);
    res.json(GetInatTaxaByIdResponse.parse(buildTaxonByIdResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "iNat taxa/{id} fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildTaxonByIdResponse(
  row: {
    raw_response: unknown;
    source_url: string;
    found: boolean;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  return {
    source_url: row.source_url,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response,
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

router.get("/inat/places/nearby", async (req, res) => {
  const parsed = GetInatPlacesNearbyQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  try {
    const result = await fetchPlacesNearby({
      nelat:    parsed.data.nelat,
      nelng:    parsed.data.nelng,
      swlat:    parsed.data.swlat,
      swlng:    parsed.data.swlng,
      name:     parsed.data.name ?? undefined,
      per_page: parsed.data.per_page ?? undefined,
    });
    const prov = buildProvenance(result.upstream_url, "api_fetch");
    const raw = result.raw_response;
    const results = (raw["results"] as Record<string, unknown> | undefined) ?? {};
    const standardArr = Array.isArray(results["standard"]) ? results["standard"] as unknown[] : [];
    const communityArr = Array.isArray(results["community"]) ? results["community"] as unknown[] : [];
    const foundAny = standardArr.length > 0 || communityArr.length > 0;

    res.json(GetInatPlacesNearbyResponse.parse({
      source_url: result.source_url,
      found: foundAny,
      data: raw,
      provenance: filterProvenance({
        source_id: prov.source_id,
        fetched_at: prov.fetched_at,
        method: prov.method,
        upstream_url: prov.upstream_url,
        general_summary: prov.general_summary,
        technical_details: prov.technical_details,
      }, verbosity),
    }));
  } catch (err) {
    req.log.error({ err }, "iNat places/nearby fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/places/:id", async (req, res) => {
  const pathParsed = GetInatPlacesByIdParams.safeParse(req.params);
  if (!pathParsed.success) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer" });
    return;
  }

  const queryParsed = GetInatPlacesByIdQueryParams.safeParse(req.query);
  if (!queryParsed.success) {
    res.status(400).json({ error: "invalid_input", message: queryParsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const placeId = pathParsed.data.id;
  const refresh = queryParsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildPlaceByIdCacheKey(placeId);

  if (!refresh) {
    const cached = await lookupPlaceById(cacheKey);
    if (cached) {
      res.json(GetInatPlacesByIdResponse.parse(buildPlaceByIdResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchPlaceById(placeId, {
      admin_level: queryParsed.data.admin_level ?? undefined,
    });
    const stored = await storePlaceById(cacheKey, placeId, result);
    res.json(GetInatPlacesByIdResponse.parse(buildPlaceByIdResponse(stored, refresh ? "bypassed" : "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "iNat places/{id} fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

function buildPlaceByIdResponse(
  row: {
    query: string;
    results: unknown;
    upstream_url: string;
    found: boolean;
    fetched_at: Date;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  return {
    source_url: `https://www.inaturalist.org/places/${row.query}`,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.results,
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

function buildCachedPassthroughResponse(
  row: {
    raw_response: unknown;
    source_url: string;
    found: boolean;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  return {
    source_url: row.source_url,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response,
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

router.get("/inat/metadata", async (req, res) => {
  await ensureInatRegistryEntry();
  const queriedAt = new Date();

  res.json(GetInatMetadataResponse.parse({
    service_id: INAT_SOURCE_ID,
    service_name: "iNaturalist — Observations, Phenology, and Species Appearance",
    licenses: INAT_LICENSES,
    license_notes: INAT_LICENSE_NOTES,
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
      general_summary: INAT_GENERAL_SUMMARY,
      technical_details: INAT_TECHNICAL_DETAILS,
    },
  }));
});

export default router;
