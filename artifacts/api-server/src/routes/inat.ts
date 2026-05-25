// All routes use buildEnvelope(). data = verbatim upstream iNat JSON (FERNS-injected fields removed).
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
  GetInatObservationsHistogramQueryParams,
  GetInatObservationsPopularFieldValuesQueryParams,
  GetInatObservationsQueryParams,
  GetInatObservationsSpeciesCountsQueryParams,
  GetInatControlledTermsQueryParams,
  GetInatControlledTermsForTaxonQueryParams,
  GetInatTaxaAutocompleteQueryParams,
  GetInatTaxaByIdParams,
  GetInatTaxaByIdQueryParams,
  GetInatPlacesByIdParams,
  GetInatPlacesByIdQueryParams,
  GetInatPlacesNearbyQueryParams,
  GetInatObservationsTaxonSummaryParams,
  GetInatObservationsTaxonSummaryQueryParams,
  GetInatIdentificationsSimilarSpeciesQueryParams,
  GetInatIdentificationsSpeciesCountsQueryParams,
  GetInatIdentificationsRecentTaxaQueryParams,
  GetInatIdentificationsQueryParams,
  GetInatIdentificationsByIdParams,
  GetInatIdentificationsByIdQueryParams,
} from "@workspace/api-zod";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/inat/places/autocomplete", async (req, res) => {
  const parsed = GetInatPlacesAutocompleteQueryParams.safeParse(req.query);
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
      const results = (cached.results as Array<{ id: number; display_name: string; place_type: number; place_type_name: string }>) || [];
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: { results },
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchPlaces(q);
    const stored = await storePlace(cacheKey, result);
    const results = (stored.results as Array<{ id: number; display_name: string; place_type: number; place_type_name: string }>) || [];
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: { results },
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "iNat place lookup failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

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
  const cacheKey = buildHistogramCacheKey(taxonId, sortedPlaceIds, termId, termValueId);

  if (!refresh) {
    const cached = await lookupHistogram(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.raw_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchHistogram(taxonId, sortedPlaceIds, termId, termValueId);
    const stored = await storeHistogram(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.raw_response,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
  const cacheKey = buildFieldValuesCacheKey(taxonId, sortedPlaceIds, verifiable);

  if (!refresh) {
    const cached = await lookupFieldValues(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.raw_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchFieldValues(taxonId, sortedPlaceIds, verifiable);
    const stored = await storeFieldValues(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.raw_response,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "iNat field values fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

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

  try {
    const result = await fetchObservationSummary(taxonId, placeId, qualityGrade, perPage, page, {
      lat:   parsed.data.lat ?? null,
      lng:   parsed.data.lng ?? null,
      radius: parsed.data.radius ?? null,
      nelat: parsed.data.nelat ?? null,
      nelng: parsed.data.nelng ?? null,
      swlat: parsed.data.swlat ?? null,
      swlng: parsed.data.swlng ?? null,
    }, {
      d1: parsed.data.d1 ?? undefined,
      d2: parsed.data.d2 ?? undefined,
    });

    const results = result.results as Array<{ license_code?: string | null }>;
    const permissionGranted = results.length === 0 || results.every((r) => r.license_code != null);

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: result.total_results > 0,
        data: {
          total_results: result.total_results,
          page: result.page,
          per_page: result.per_page,
          total_pages: result.total_pages,
          results: result.results,
        },
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
        permissionGranted,
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
      d1:                parsed.data.d1 ?? undefined,
      d2:                parsed.data.d2 ?? undefined,
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
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: total > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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

  try {
    const result = await fetchTaxonSummary(pathParsed.data.id);
    const raw = result.raw_response;
    const found = !!(raw["wikipedia_summary"] || raw["listed_taxon"] || raw["conservation_status"]);

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;
    const resultCount = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: total > 0 || resultCount > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: total > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
    const raw = result.raw_response;
    const resultCount = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: resultCount > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: total > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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

  try {
    const result = await fetchIdentificationById(pathParsed.data.id);
    const raw = result.raw_response;
    const resultCount = Array.isArray(raw["results"]) ? raw["results"].length : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: resultCount > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
  const cacheKey = buildControlledTermsCacheKey();

  if (!refresh) {
    const cached = await lookupControlledTerms(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.raw_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchControlledTerms();
    const stored = await storeControlledTerms(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.raw_response,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
  const cacheKey = buildControlledTermsForTaxonCacheKey(taxonId);

  if (!refresh) {
    const cached = await lookupControlledTerms(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.raw_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchControlledTermsForTaxon(taxonId);
    const stored = await storeControlledTerms(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.raw_response,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
    const raw = result.raw_response;
    const total = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: total > 0,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
  const cacheKey = buildTaxonByIdCacheKey(taxonId);

  if (!refresh) {
    const cached = await lookupTaxonById(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.raw_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchTaxonById(taxonId);
    const stored = await storeTaxonById(cacheKey, taxonId, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.raw_response,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "iNat taxa/{id} fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/places/nearby", async (req, res) => {
  const parsed = GetInatPlacesNearbyQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  try {
    const result = await fetchPlacesNearby({
      nelat:    parsed.data.nelat,
      nelng:    parsed.data.nelng,
      swlat:    parsed.data.swlat,
      swlng:    parsed.data.swlng,
      name:     parsed.data.name ?? undefined,
      per_page: parsed.data.per_page ?? undefined,
    });
    const raw = result.raw_response;
    const results = (raw["results"] as Record<string, unknown> | undefined) ?? {};
    const standardArr = Array.isArray(results["standard"]) ? results["standard"] as unknown[] : [];
    const communityArr = Array.isArray(results["community"]) ? results["community"] as unknown[] : [];
    const foundAny = standardArr.length > 0 || communityArr.length > 0;

    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: foundAny,
        data: raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
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
  const cacheKey = buildPlaceByIdCacheKey(placeId);

  if (!refresh) {
    const cached = await lookupPlaceById(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: INAT_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.found,
          data: cached.results,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await fetchPlaceById(placeId, {
      admin_level: queryParsed.data.admin_level ?? undefined,
    });
    const stored = await storePlaceById(cacheKey, placeId, result);
    const envelope = await buildEnvelope(
      {
        sourceId: INAT_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.found,
        data: stored.results,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "iNat places/{id} fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from iNaturalist API" });
  }
});

router.get("/inat/metadata", async (req, res) => {
  await ensureInatRegistryEntry();
  const envelope = await buildEnvelope(
    {
      sourceId: INAT_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: INAT_SOURCE_ID,
        name: INAT_REGISTRY_ENTRY.name,
        knowledge_type: INAT_REGISTRY_ENTRY.knowledge_type,
        status: INAT_REGISTRY_ENTRY.status,
        description: INAT_REGISTRY_ENTRY.description,
        input_summary: INAT_REGISTRY_ENTRY.input_summary,
        output_summary: INAT_REGISTRY_ENTRY.output_summary,
        dependencies: INAT_REGISTRY_ENTRY.dependencies,
        update_frequency: INAT_REGISTRY_ENTRY.update_frequency,
        known_limitations: INAT_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, INAT_REGISTRY_ENTRY.metadata_url),
        explorer_url: resolveUrl(req, INAT_REGISTRY_ENTRY.explorer_url),
        licenses: INAT_LICENSES,
        license_notes: INAT_LICENSE_NOTES,
        general_summary: INAT_GENERAL_SUMMARY,
        technical_details: INAT_TECHNICAL_DETAILS,
        license: INAT_REGISTRY_ENTRY.license,
        rights: INAT_REGISTRY_ENTRY.rights,
        website_url_patterns: INAT_REGISTRY_ENTRY.website_url_patterns,
      },
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
