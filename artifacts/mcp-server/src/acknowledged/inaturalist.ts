import * as zod from "zod";
import { buildAcknowledgedEnvelope } from "./envelope.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  GetInatPlacesAutocompleteResponse,
  GetInatObservationsHistogramResponse,
  GetInatObservationsPopularFieldValuesResponse,
  GetInatObservationsResponse,
  GetInatObservationsSpeciesCountsResponse,
  GetInatControlledTermsResponse,
  GetInatControlledTermsForTaxonResponse,
  GetInatTaxaAutocompleteResponse,
  GetInatTaxaByIdResponse,
  GetInatPlacesByIdResponse,
  GetInatObservationsTaxonSummaryResponse,
  GetInatIdentificationsSimilarSpeciesResponse,
  GetInatIdentificationsSpeciesCountsResponse,
  GetInatIdentificationsRecentTaxaResponse,
  GetInatIdentificationsResponse,
  GetInatIdentificationsByIdResponse,
  GetInatPlacesNearbyResponse,
} from "@workspace/api-zod";

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

export interface ToolDef {
  tool: Tool;
  handler: ToolHandler;
}

const INAT_SOURCE_ID = "inaturalist";
const INAT_API_BASE = "https://api.inaturalist.org/v1";
const INAT_USER_AGENT = "FERNS/1.0";
const INAT_REQUEST_TIMEOUT_MS = 30000;
const INAT_LICENSE = "https://creativecommons.org/licenses/by-nc/4.0/";
const INAT_RIGHTS =
  "iNaturalist observations are individually licensed by contributors (CC0, CC BY, or CC BY-NC). " +
  "The license_code field on individual observation records is authoritative for each record. " +
  "This source-level value is the most-restrictive summary across commonly used licenses for research-grade observations.";

const PLACE_TYPE_NAMES: Record<number, string> = {
  1: "Building",
  2: "Street Segment",
  4: "ZIP Code",
  5: "Intersection",
  6: "Street",
  7: "Town",
  8: "State",
  9: "County",
  10: "Local Government Area",
  11: "Municipality",
  12: "Country",
  13: "Farm",
  100: "Open Space",
  101: "Territory",
  102: "Subdivision",
  103: "Park",
  104: "Point of Interest",
  105: "Nation",
  106: "Region",
  108: "Province",
  109: "District",
  110: "County",
  111: "Parish",
  112: "Borough",
  113: "Unincorporated Area",
};

async function inatFetch(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": INAT_USER_AGENT,
    },
    signal: AbortSignal.timeout(INAT_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `iNaturalist API error: ${response.status} ${response.statusText} — ${url}`,
    );
  }
  return response.json();
}

// ── Per-endpoint raw iNat API response validators ─────────────────────────
// Each schema validates the upstream JSON before it is wrapped in the FERNS
// acknowledged-source envelope. The shape of each schema is derived from the
// `data` field of the corresponding generated FERNS REST response schema
// (GetInat*Response from @workspace/api-zod), keeping this file's validation
// contract in sync with the OpenAPI spec.

// Base passthrough for endpoints where the spec declares data: unknown (verbatim
// upstream passthrough). Each endpoint gets its own const so contract links are
// explicit and future spec changes can be narrowed independently.
function _passthroughRaw() {
  return zod.object({
    total_results: zod.number().optional(),
    results: zod.array(zod.unknown()).optional(),
  }).passthrough();
}

// places/autocomplete — GetInatPlacesAutocompleteResponse specifies a concrete results shape.
// Matches the spec's data field exactly: results array of { id, display_name, place_type, place_type_name }.
// No total_results or passthrough needed — the handler only reads results items.
const InatPlacesAutocompleteRaw = zod.object({
  results: zod.array(
    zod.object({
      id: zod.number(),
      display_name: zod.string(),
      place_type: zod.number(),
      place_type_name: zod.string(),
    })
  ).optional(),
}) satisfies zod.ZodType<zod.infer<typeof GetInatPlacesAutocompleteResponse>["data"]>;

// observations/histogram — GetInatObservationsHistogramResponse (data: unknown)
const InatObservationsHistogramRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatObservationsHistogramResponse>["data"]>;

// observations/popular_field_values — GetInatObservationsPopularFieldValuesResponse (data: unknown)
const InatObservationsFieldValuesRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatObservationsPopularFieldValuesResponse>["data"]>;

// observations — GetInatObservationsResponse (data: unknown)
const InatObservationsRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatObservationsResponse>["data"]>;

// observations/species_counts — GetInatObservationsSpeciesCountsResponse (data: unknown)
const InatObsSpeciesCountsRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatObservationsSpeciesCountsResponse>["data"]>;

// controlled_terms — GetInatControlledTermsResponse (data: unknown)
const InatControlledTermsRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatControlledTermsResponse>["data"]>;

// controlled_terms/for_taxon — GetInatControlledTermsForTaxonResponse (data: unknown)
const InatControlledTermsForTaxonRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatControlledTermsForTaxonResponse>["data"]>;

// taxa/autocomplete — GetInatTaxaAutocompleteResponse (data: unknown)
const InatTaxaAutocompleteRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatTaxaAutocompleteResponse>["data"]>;

// taxa/{id} — GetInatTaxaByIdResponse (data: unknown)
const InatTaxaByIdRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatTaxaByIdResponse>["data"]>;

// places/{id} — GetInatPlacesByIdResponse (data: unknown)
const InatPlacesByIdRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatPlacesByIdResponse>["data"]>;

// observations/{id}/taxon_summary — GetInatObservationsTaxonSummaryResponse (data: unknown)
// The taxon_summary endpoint returns { wikipedia_summary, listed_taxon, conservation_status }
// with no results array — a passthrough object accepts any structure.
const InatTaxonSummaryRaw = zod.object({}).passthrough() satisfies zod.ZodType<zod.infer<typeof GetInatObservationsTaxonSummaryResponse>["data"]>;

// identifications/similar_species — GetInatIdentificationsSimilarSpeciesResponse (data: unknown)
const InatSimilarSpeciesRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatIdentificationsSimilarSpeciesResponse>["data"]>;

// identifications/species_counts — GetInatIdentificationsSpeciesCountsResponse (data: unknown)
const InatIdentSpeciesCountsRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatIdentificationsSpeciesCountsResponse>["data"]>;

// identifications/recent_taxa — GetInatIdentificationsRecentTaxaResponse (data: unknown)
const InatIdentRecentTaxaRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatIdentificationsRecentTaxaResponse>["data"]>;

// identifications — GetInatIdentificationsResponse (data: unknown)
const InatIdentificationsRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatIdentificationsResponse>["data"]>;

// identifications/{id} — GetInatIdentificationsByIdResponse (data: unknown)
const InatIdentificationsByIdRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatIdentificationsByIdResponse>["data"]>;

// places/nearby — GetInatPlacesNearbyResponse (data: unknown)
const InatPlacesNearbyRaw = _passthroughRaw() satisfies zod.ZodType<zod.infer<typeof GetInatPlacesNearbyResponse>["data"]>;

const PV_PROP = {
  provenance_verbosity: {
    type: "string",
    enum: ["full", "summary", "none"],
    description:
      "Controls how much provenance text is returned. full (default) returns both general_summary and technical_details; summary returns general_summary only; none omits both.",
  },
} as const;

export const inatToolDefs: ToolDef[] = [
  {
    tool: {
      name: "inaturalist__places_autocomplete",
      description:
        "Searches iNaturalist's place index by name and returns matching place records with place IDs. Place IDs are required by other iNaturalist tools to filter results geographically.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q: { type: "string", description: "Place name to search (e.g. Washtenaw County)" },
          ...PV_PROP,
        },
        required: ["q"],
      },
    },
    handler: async (args) => {
      const q = String(args["q"]);
      const encoded = encodeURIComponent(q.trim());
      const url = `${INAT_API_BASE}/places/autocomplete?q=${encoded}&per_page=5`;

      const raw = InatPlacesAutocompleteRaw.parse(await inatFetch(url));
      const rawResults = (raw.results as Record<string, unknown>[]) ?? [];
      const results = rawResults.map((r) => {
        const placeType = (r["place_type"] as number) ?? 0;
        return {
          id: r["id"] as number,
          display_name: (r["display_name"] as string) || "",
          place_type: placeType,
          place_type_name: PLACE_TYPE_NAMES[placeType] ?? `Type ${placeType}`,
        };
      });
      const found = results.length > 0;
      const sourceUrl = found
        ? `https://www.inaturalist.org/places/${results[0]!.id}`
        : "https://www.inaturalist.org";

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found,
        data: { results },
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__observations_histogram",
      description:
        "Returns a monthly phenology histogram of iNaturalist observation counts for a taxon, optionally filtered by place and phenological stage. Use term_id=12 to restrict to Flowers and Fruits annotations only (stage-filtered histogram), producing a curve that reflects flowering/fruiting activity rather than all observations. Useful for understanding seasonal bloom, fruiting, or leaf-out patterns.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs to filter by" },
          term_id: { type: "number", description: "Controlled annotation term ID (e.g. 12 for Flowers and Fruits, 36 for Leaves)" },
          term_value_id: { type: "number", description: "Controlled annotation value ID. Requires term_id." },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) => {
      const taxonId = Number(args["taxon_id"]);
      const placeId = args["place_id"] !== undefined ? String(args["place_id"]) : undefined;
      const termId = args["term_id"] !== undefined ? Number(args["term_id"]) : undefined;
      const termValueId = args["term_value_id"] !== undefined ? Number(args["term_value_id"]) : undefined;

      const params = new URLSearchParams();
      params.set("taxon_id", String(taxonId));
      if (placeId) params.set("place_id", placeId);
      params.set("interval", "month_of_year");
      if (termId !== undefined) params.set("term_id", String(termId));
      if (termValueId !== undefined) params.set("term_value_id", String(termValueId));

      const url = `${INAT_API_BASE}/observations/histogram?${params.toString()}`;
      const raw = InatObservationsHistogramRaw.parse(await inatFetch(url));

      const sourceUrl = placeId
        ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeId}`
        : `https://www.inaturalist.org/observations?taxon_id=${taxonId}`;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__observations_popular_field_values",
      description:
        "Returns observer-submitted field values (e.g., habitat, plant height) for a taxon from iNaturalist, optionally filtered by place and verification status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs to filter by" },
          verifiable: { type: "boolean", description: "Only include verifiable observations (default: true)" },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) => {
      const taxonId = Number(args["taxon_id"]);
      const placeId = args["place_id"] !== undefined ? String(args["place_id"]) : undefined;
      const verifiable = args["verifiable"] !== undefined ? Boolean(args["verifiable"]) : true;

      const params = new URLSearchParams();
      params.set("taxon_id", String(taxonId));
      if (placeId) params.set("place_id", placeId);
      params.set("verifiable", String(verifiable));

      const url = `${INAT_API_BASE}/observations/popular_field_values?${params.toString()}`;
      const raw = InatObservationsFieldValuesRaw.parse(await inatFetch(url));

      const sourceUrl = placeId
        ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeId}`
        : `https://www.inaturalist.org/observations?taxon_id=${taxonId}`;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__observations",
      description:
        "Returns one page of iNaturalist observation records as a curated field subset (id, uri, observed_on, quality_grade, taxon_name, common_name, place_guess, location, observer, photo_url, photo_attribution). This is NOT the full iNat record — follow the uri field for the complete observation. Supports pagination via page and per_page. The iNat API enforces a hard ceiling of 10,000 accessible results (page × per_page ≤ 10,000). No caching — every call is live.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          d1: { type: "string", description: "Earliest date (YYYY-MM-DD). Filters by observed_on." },
          d2: { type: "string", description: "Latest date (YYYY-MM-DD). Filters by observed_on." },
          per_page: { type: "number", description: "Results per page (default 30, max 200)" },
          page: { type: "number", description: "Page number, 1-indexed (default 1)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) => {
      const taxonId = args["taxon_id"] !== undefined ? Number(args["taxon_id"]) : null;
      const placeId = args["place_id"] !== undefined ? String(args["place_id"]) : null;
      const qualityGrade = args["quality_grade"] !== undefined ? String(args["quality_grade"]) : null;
      const d1 = args["d1"] !== undefined ? String(args["d1"]) : undefined;
      const d2 = args["d2"] !== undefined ? String(args["d2"]) : undefined;
      const perPage = args["per_page"] !== undefined ? Number(args["per_page"]) : 30;
      const page = args["page"] !== undefined ? Number(args["page"]) : 1;

      const params = new URLSearchParams();
      if (taxonId !== null) params.set("taxon_id", String(taxonId));
      if (placeId !== null) params.set("place_id", String(placeId));
      if (qualityGrade) params.set("quality_grade", qualityGrade);
      params.set("per_page", String(perPage));
      params.set("page", String(page));
      params.set("order", "desc");
      params.set("order_by", "created_at");
      if (d1) params.set("d1", d1);
      if (d2) params.set("d2", d2);

      const url = `${INAT_API_BASE}/observations?${params.toString()}`;
      const raw = InatObservationsRaw.parse(await inatFetch(url)) as Record<string, unknown>;

      const totalResults = typeof raw["total_results"] === "number" ? raw["total_results"] : 0;
      const rawResults = (raw["results"] as Record<string, unknown>[]) ?? [];

      const results = rawResults.map((r) => {
        const taxon = r["taxon"] as Record<string, unknown> | null;
        const user = r["user"] as Record<string, unknown> | null;
        const photos = (r["photos"] as Record<string, unknown>[]) ?? [];
        const firstPhoto = photos[0] ?? null;
        const rawPhotoUrl = (firstPhoto?.["url"] as string) ?? null;
        const photoUrl = rawPhotoUrl ? rawPhotoUrl.replace("/square.", "/medium.") : null;

        return {
          id: r["id"] as number,
          uri: (r["uri"] as string) ?? `https://www.inaturalist.org/observations/${r["id"]}`,
          observed_on: (r["observed_on"] as string) ?? null,
          quality_grade: (r["quality_grade"] as string) ?? null,
          taxon_name: (taxon?.["name"] as string) ?? null,
          common_name: (taxon?.["preferred_common_name"] as string) ?? null,
          place_guess: (r["place_guess"] as string) ?? null,
          location: (r["location"] as string) ?? null,
          observer: (user?.["login"] as string) ?? null,
          photo_url: photoUrl,
          photo_attribution: (firstPhoto?.["attribution"] as string) ?? null,
        };
      });

      const sourceUrlParts: string[] = [];
      if (taxonId !== null) sourceUrlParts.push(`taxon_id=${taxonId}`);
      if (placeId !== null) sourceUrlParts.push(`place_id=${placeId}`);
      if (qualityGrade) sourceUrlParts.push(`quality_grade=${qualityGrade}`);
      if (d1) sourceUrlParts.push(`d1=${d1}`);
      if (d2) sourceUrlParts.push(`d2=${d2}`);
      const sourceUrl = `https://www.inaturalist.org/observations${sourceUrlParts.length ? `?${sourceUrlParts.join("&")}` : ""}`;

      const totalPages = totalResults > 0 ? Math.ceil(Math.min(totalResults, 10000) / perPage) : 0;
      const hasMore = page < totalPages;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: results.length > 0,
        data: { total_results: totalResults, page, per_page: perPage, results },
        pagination: { has_more: hasMore, next: null, total: totalResults },
      });
    },
  },

  {
    tool: {
      name: "inaturalist__observations_species_counts",
      description:
        "Returns species ranked by observation count from iNaturalist. Useful for identifying which species are most frequently observed in a given place or under specific filters. Supports filtering by place, quality grade, iconic taxon group (e.g. Plantae), nativity (native/introduced), phenology annotations (term_id/term_value_id), month window, and geographic constraints (lat/lng radius or bounding box). No caching — every call is live.",
      inputSchema: {
        type: "object" as const,
        properties: {
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          iconic_taxon_name: { type: "string", description: "Iconic taxon group: Plantae, Aves, Fungi, Mammalia, Reptilia, Amphibia, Actinopterygii, Mollusca, Arachnida, Insecta, Animalia" },
          native: { type: "boolean", description: "Only native taxa" },
          introduced: { type: "boolean", description: "Only introduced taxa" },
          term_id: { type: "number", description: "Controlled annotation term ID (e.g. 12 for Flowers and Fruits)" },
          term_value_id: { type: "number", description: "Controlled annotation value ID. Requires term_id." },
          month: { type: "string", description: "Comma-separated month numbers (e.g. 4,5,6 for Apr–Jun)" },
          d1: { type: "string", description: "Earliest date (YYYY-MM-DD). Filters by observed_on." },
          d2: { type: "string", description: "Latest date (YYYY-MM-DD). Filters by observed_on." },
          per_page: { type: "number", description: "Results to return (default 500, max 500)" },
          page: { type: "number", description: "Page number, 1-indexed" },
          lat: { type: "number", description: "Center latitude for radius filter" },
          lng: { type: "number", description: "Center longitude for radius filter" },
          radius: { type: "number", description: "Radius in km" },
          nelat: { type: "number", description: "Bounding box NE latitude" },
          nelng: { type: "number", description: "Bounding box NE longitude" },
          swlat: { type: "number", description: "Bounding box SW latitude" },
          swlng: { type: "number", description: "Bounding box SW longitude" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) => {
      const q = new URLSearchParams();
      if (args["place_id"] !== undefined) q.set("place_id", String(args["place_id"]));
      if (args["quality_grade"] !== undefined) q.set("quality_grade", String(args["quality_grade"]));
      if (args["iconic_taxon_name"] !== undefined) q.set("iconic_taxon_name", String(args["iconic_taxon_name"]));
      if (args["native"] !== undefined) q.set("native", String(args["native"]));
      if (args["introduced"] !== undefined) q.set("introduced", String(args["introduced"]));
      if (args["term_id"] !== undefined) q.set("term_id", String(args["term_id"]));
      if (args["term_value_id"] !== undefined) q.set("term_value_id", String(args["term_value_id"]));
      if (args["month"] !== undefined) q.set("month", String(args["month"]));
      if (args["d1"] !== undefined) q.set("d1", String(args["d1"]));
      if (args["d2"] !== undefined) q.set("d2", String(args["d2"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));
      if (args["page"] !== undefined) q.set("page", String(args["page"]));
      if (args["lat"] !== undefined) q.set("lat", String(args["lat"]));
      if (args["lng"] !== undefined) q.set("lng", String(args["lng"]));
      if (args["radius"] !== undefined) q.set("radius", String(args["radius"]));
      if (args["nelat"] !== undefined) q.set("nelat", String(args["nelat"]));
      if (args["nelng"] !== undefined) q.set("nelng", String(args["nelng"]));
      if (args["swlat"] !== undefined) q.set("swlat", String(args["swlat"]));
      if (args["swlng"] !== undefined) q.set("swlng", String(args["swlng"]));

      const url = `${INAT_API_BASE}/observations/species_counts?${q.toString()}`;
      const raw = InatObsSpeciesCountsRaw.parse(await inatFetch(url));

      const sourceParts: string[] = [];
      if (args["place_id"] !== undefined) sourceParts.push(`place_id=${args["place_id"]}`);
      if (args["quality_grade"] !== undefined) sourceParts.push(`quality_grade=${args["quality_grade"]}`);
      if (args["iconic_taxon_name"] !== undefined) sourceParts.push(`iconic_taxon_name=${encodeURIComponent(String(args["iconic_taxon_name"]))}`);
      if (args["d1"] !== undefined) sourceParts.push(`d1=${args["d1"]}`);
      if (args["d2"] !== undefined) sourceParts.push(`d2=${args["d2"]}`);
      const sourceUrl = `https://www.inaturalist.org/observations${sourceParts.length ? `?${sourceParts.join("&")}` : ""}`;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__controlled_terms",
      description:
        "Returns the full list of iNaturalist controlled annotation terms and their possible values. Use this to look up term_id and term_value_id pairs (e.g. term_id=12 for Flowers and Fruits, with values Flowering, Fruiting, etc). The list is essentially static and rarely changes. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (_args) => {
      const url = `${INAT_API_BASE}/controlled_terms`;
      const raw = InatControlledTermsRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: "https://www.inaturalist.org/controlled_terms",
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__controlled_terms_for_taxon",
      description:
        "Returns the controlled annotation terms applicable to a specific iNaturalist taxon (e.g. Flowers and Fruits applies to plants, not birds). Cached permanently by taxon_id. Use this to know which term_id values are valid for a given taxon before filtering histograms or species counts.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) => {
      const taxonId = Number(args["taxon_id"]);
      const url = `${INAT_API_BASE}/controlled_terms/for_taxon?taxon_id=${taxonId}`;
      const raw = InatControlledTermsForTaxonRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/taxa/${taxonId}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__taxa_autocomplete",
      description:
        "Fast partial-name taxon search on iNaturalist with photo thumbnails and observation counts. Designed for type-ahead search. Returns up to 10 results. No cache — every call is live. Use this to find taxon IDs for use in other iNaturalist tools.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q: { type: "string", description: "Partial or full scientific or common name" },
          per_page: { type: "number", description: "Results to return (max 10, default 10)" },
          is_active: { type: "boolean", description: "Filter to active taxa only (default true)" },
          rank: { type: "string", description: "Taxonomic rank filter (e.g. species, genus, family)" },
          locale: { type: "string", description: "Locale code for common names (e.g. en, es)" },
          all_names: { type: "boolean", description: "Include all name variants in search" },
          preferred_place_id: { type: "number", description: "Place ID to prioritize common names for that place" },
        },
        required: ["q"],
      },
    },
    handler: async (args) => {
      const q = new URLSearchParams();
      q.set("q", String(args["q"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));
      if (args["is_active"] !== undefined) q.set("is_active", String(args["is_active"]));
      if (args["rank"] !== undefined) q.set("rank", String(args["rank"]));
      if (args["locale"] !== undefined) q.set("locale", String(args["locale"]));
      if (args["all_names"] !== undefined) q.set("all_names", String(args["all_names"]));
      if (args["preferred_place_id"] !== undefined) q.set("preferred_place_id", String(args["preferred_place_id"]));

      const url = `${INAT_API_BASE}/taxa/autocomplete?${q.toString()}`;
      const raw = InatTaxaAutocompleteRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/taxa?q=${encodeURIComponent(String(args["q"]))}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__taxa_by_id",
      description:
        "Returns the full iNaturalist taxon record for a known taxon ID, including Wikipedia summary, listed_taxa (nativity per place — the canonical source of native/introduced/endemic status), children, conservation_status, and default_photo. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "iNaturalist taxon ID (integer)" },
        },
        required: ["id"],
      },
    },
    handler: async (args) => {
      const taxonId = Number(args["id"]);
      const url = `${INAT_API_BASE}/taxa/${taxonId}`;
      const raw = InatTaxaByIdRaw.parse(await inatFetch(url));
      const results = raw["results"] as unknown[];
      const found = Array.isArray(results) ? results.length > 0 : true;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/taxa/${taxonId}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__places_by_id",
      description:
        "Returns the full iNaturalist place record for a known place ID, including display name, place type, centroid, bounding box, and admin hierarchy. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "iNaturalist place ID (integer)" },
          admin_level: { type: "number", description: "Admin level filter (0=country, 1=state, 2=county)" },
        },
        required: ["id"],
      },
    },
    handler: async (args) => {
      const placeId = Number(args["id"]);
      const q = new URLSearchParams();
      if (args["admin_level"] !== undefined) q.set("admin_level", String(args["admin_level"]));
      const qs = q.toString();
      const url = `${INAT_API_BASE}/places/${placeId}${qs ? `?${qs}` : ""}`;
      const raw = InatPlacesByIdRaw.parse(await inatFetch(url));
      const results = raw["results"] as unknown[];
      const found = Array.isArray(results) ? results.length > 0 : true;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/places/${placeId}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__observations_taxon_summary",
      description:
        "Returns the Wikipedia summary, place-specific nativity (establishment_means), and conservation status for the taxon associated with a specific iNaturalist observation. The observation_id determines which location context is used for nativity data. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          observation_id: { type: "number", description: "iNaturalist observation ID (integer)" },
        },
        required: ["observation_id"],
      },
    },
    handler: async (args) => {
      const observationId = Number(args["observation_id"]);
      const url = `${INAT_API_BASE}/observations/${observationId}/taxon_summary`;
      const raw = InatTaxonSummaryRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/observations/${observationId}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__identifications_similar_species",
      description:
        "Returns species commonly confused with a given taxon from iNaturalist's identification history, ranked by co-confusion count. Useful for disambiguation and quality identification work. Optionally filtered by place and geography. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID to find similar species for (integer)" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          lat: { type: "number", description: "Center latitude for radius filter" },
          lng: { type: "number", description: "Center longitude for radius filter" },
          radius: { type: "number", description: "Radius in km" },
          nelat: { type: "number", description: "Bounding box NE latitude" },
          nelng: { type: "number", description: "Bounding box NE longitude" },
          swlat: { type: "number", description: "Bounding box SW latitude" },
          swlng: { type: "number", description: "Bounding box SW longitude" },
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) => {
      const taxonId = Number(args["taxon_id"]);
      const q = new URLSearchParams();
      q.set("taxon_id", String(taxonId));
      if (args["place_id"] !== undefined) q.set("place_id", String(args["place_id"]));
      if (args["quality_grade"] !== undefined) q.set("quality_grade", String(args["quality_grade"]));
      if (args["lat"] !== undefined) q.set("lat", String(args["lat"]));
      if (args["lng"] !== undefined) q.set("lng", String(args["lng"]));
      if (args["radius"] !== undefined) q.set("radius", String(args["radius"]));
      if (args["nelat"] !== undefined) q.set("nelat", String(args["nelat"]));
      if (args["nelng"] !== undefined) q.set("nelng", String(args["nelng"]));
      if (args["swlat"] !== undefined) q.set("swlat", String(args["swlat"]));
      if (args["swlng"] !== undefined) q.set("swlng", String(args["swlng"]));

      const url = `${INAT_API_BASE}/identifications/similar_species?${q.toString()}`;
      const raw = InatSimilarSpeciesRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/taxa/${taxonId}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__identifications_species_counts",
      description:
        "Returns species ranked by identification activity on iNaturalist — a community engagement signal distinct from raw observation count. Use taxon_of=identification (default) to rank by the identified taxon, or taxon_of=community to rank by the community-agreed taxon. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID to filter by" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          per_page: { type: "number", description: "Results per page (max 500)" },
          page: { type: "number", description: "Page number, 1-indexed" },
          d1: { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          d2: { type: "string", description: "End date filter (YYYY-MM-DD)" },
          month: { type: "string", description: "Comma-separated month numbers (e.g. 4,5,6)" },
          native: { type: "boolean", description: "Only native taxa" },
          introduced: { type: "boolean", description: "Only introduced taxa" },
          lat: { type: "number", description: "Center latitude for radius filter" },
          lng: { type: "number", description: "Center longitude for radius filter" },
          radius: { type: "number", description: "Radius in km" },
          nelat: { type: "number", description: "Bounding box NE latitude" },
          nelng: { type: "number", description: "Bounding box NE longitude" },
          swlat: { type: "number", description: "Bounding box SW latitude" },
          swlng: { type: "number", description: "Bounding box SW longitude" },
          order: { type: "string", description: "asc or desc (default desc)" },
          order_by: { type: "string", description: "count or id" },
          taxon_of: { type: "string", description: "identification (default) or community" },
          iconic_taxa: { type: "string", description: "Comma-separated iconic taxon names (e.g. Plantae,Fungi)" },
        },
        required: [],
      },
    },
    handler: async (args) => {
      const q = new URLSearchParams();
      if (args["taxon_id"] !== undefined) q.set("taxon_id", String(args["taxon_id"]));
      if (args["place_id"] !== undefined) q.set("place_id", String(args["place_id"]));
      if (args["quality_grade"] !== undefined) q.set("quality_grade", String(args["quality_grade"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));
      if (args["page"] !== undefined) q.set("page", String(args["page"]));
      if (args["d1"] !== undefined) q.set("d1", String(args["d1"]));
      if (args["d2"] !== undefined) q.set("d2", String(args["d2"]));
      if (args["month"] !== undefined) q.set("month", String(args["month"]));
      if (args["native"] !== undefined) q.set("native", String(args["native"]));
      if (args["introduced"] !== undefined) q.set("introduced", String(args["introduced"]));
      if (args["lat"] !== undefined) q.set("lat", String(args["lat"]));
      if (args["lng"] !== undefined) q.set("lng", String(args["lng"]));
      if (args["radius"] !== undefined) q.set("radius", String(args["radius"]));
      if (args["nelat"] !== undefined) q.set("nelat", String(args["nelat"]));
      if (args["nelng"] !== undefined) q.set("nelng", String(args["nelng"]));
      if (args["swlat"] !== undefined) q.set("swlat", String(args["swlat"]));
      if (args["swlng"] !== undefined) q.set("swlng", String(args["swlng"]));
      if (args["order"] !== undefined) q.set("order", String(args["order"]));
      if (args["order_by"] !== undefined) q.set("order_by", String(args["order_by"]));
      if (args["taxon_of"] !== undefined) q.set("taxon_of", String(args["taxon_of"]));
      if (args["iconic_taxa"] !== undefined) q.set("iconic_taxa", String(args["iconic_taxa"]));

      const url = `${INAT_API_BASE}/identifications/species_counts?${q.toString()}`;
      const raw = InatIdentSpeciesCountsRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: "https://www.inaturalist.org/identifications",
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__identifications_recent_taxa",
      description:
        "Returns taxa recently identified in a given iNaturalist place — 'what's being documented right now'. Useful for real-time biodiversity monitoring queries. Optionally filtered by taxon, quality grade, and date range. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          taxon_id: { type: "number", description: "Filter to a specific taxon and its children" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          per_page: { type: "number", description: "Results per page" },
          page: { type: "number", description: "Page number, 1-indexed" },
          d1: { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          d2: { type: "string", description: "End date filter (YYYY-MM-DD)" },
        },
        required: [],
      },
    },
    handler: async (args) => {
      const q = new URLSearchParams();
      if (args["place_id"] !== undefined) q.set("place_id", String(args["place_id"]));
      if (args["taxon_id"] !== undefined) q.set("taxon_id", String(args["taxon_id"]));
      if (args["quality_grade"] !== undefined) q.set("quality_grade", String(args["quality_grade"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));
      if (args["page"] !== undefined) q.set("page", String(args["page"]));
      if (args["d1"] !== undefined) q.set("d1", String(args["d1"]));
      if (args["d2"] !== undefined) q.set("d2", String(args["d2"]));

      const url = `${INAT_API_BASE}/identifications/recent_taxa?${q.toString()}`;
      const raw = InatIdentRecentTaxaRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: "https://www.inaturalist.org/identifications",
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__identifications",
      description:
        "Returns a paged list of individual iNaturalist identification records — who identified what taxon on which observation. Distinct from observations: one observation can have many identifications. Useful for understanding the community identification process for a taxon. Live call, no cache. Supports pagination via page and per_page.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          per_page: { type: "number", description: "Results per page (max 200)" },
          page: { type: "number", description: "Page number, 1-indexed" },
          d1: { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          d2: { type: "string", description: "End date filter (YYYY-MM-DD)" },
          month: { type: "string", description: "Comma-separated month numbers" },
          native: { type: "boolean", description: "Only native taxa" },
          introduced: { type: "boolean", description: "Only introduced taxa" },
          lat: { type: "number", description: "Center latitude for radius filter" },
          lng: { type: "number", description: "Center longitude for radius filter" },
          radius: { type: "number", description: "Radius in km" },
          nelat: { type: "number", description: "Bounding box NE latitude" },
          nelng: { type: "number", description: "Bounding box NE longitude" },
          swlat: { type: "number", description: "Bounding box SW latitude" },
          swlng: { type: "number", description: "Bounding box SW longitude" },
          locale: { type: "string", description: "Locale for common names (e.g. en, es)" },
          user_id: { type: "number", description: "Filter by identifier user ID" },
          user_login: { type: "string", description: "Filter by identifier user login" },
          iconic_taxa: { type: "string", description: "Comma-separated iconic taxon names" },
          term_id: { type: "number", description: "Controlled annotation term ID" },
          term_value_id: { type: "number", description: "Controlled annotation value ID" },
          verifiable: { type: "boolean", description: "Only verifiable observations" },
          order: { type: "string", description: "asc or desc" },
          order_by: { type: "string", description: "created_at or id" },
        },
        required: [],
      },
    },
    handler: async (args) => {
      const q = new URLSearchParams();
      if (args["taxon_id"] !== undefined) q.set("taxon_id", String(args["taxon_id"]));
      if (args["place_id"] !== undefined) q.set("place_id", String(args["place_id"]));
      if (args["quality_grade"] !== undefined) q.set("quality_grade", String(args["quality_grade"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));
      if (args["page"] !== undefined) q.set("page", String(args["page"]));
      if (args["d1"] !== undefined) q.set("d1", String(args["d1"]));
      if (args["d2"] !== undefined) q.set("d2", String(args["d2"]));
      if (args["month"] !== undefined) q.set("month", String(args["month"]));
      if (args["native"] !== undefined) q.set("native", String(args["native"]));
      if (args["introduced"] !== undefined) q.set("introduced", String(args["introduced"]));
      if (args["lat"] !== undefined) q.set("lat", String(args["lat"]));
      if (args["lng"] !== undefined) q.set("lng", String(args["lng"]));
      if (args["radius"] !== undefined) q.set("radius", String(args["radius"]));
      if (args["nelat"] !== undefined) q.set("nelat", String(args["nelat"]));
      if (args["nelng"] !== undefined) q.set("nelng", String(args["nelng"]));
      if (args["swlat"] !== undefined) q.set("swlat", String(args["swlat"]));
      if (args["swlng"] !== undefined) q.set("swlng", String(args["swlng"]));
      if (args["locale"] !== undefined) q.set("locale", String(args["locale"]));
      if (args["user_id"] !== undefined) q.set("user_id", String(args["user_id"]));
      if (args["user_login"] !== undefined) q.set("user_login", String(args["user_login"]));
      if (args["iconic_taxa"] !== undefined) q.set("iconic_taxa", String(args["iconic_taxa"]));
      if (args["term_id"] !== undefined) q.set("term_id", String(args["term_id"]));
      if (args["term_value_id"] !== undefined) q.set("term_value_id", String(args["term_value_id"]));
      if (args["verifiable"] !== undefined) q.set("verifiable", String(args["verifiable"]));
      if (args["order"] !== undefined) q.set("order", String(args["order"]));
      if (args["order_by"] !== undefined) q.set("order_by", String(args["order_by"]));

      const url = `${INAT_API_BASE}/identifications?${q.toString()}`;
      const raw = InatIdentificationsRaw.parse(await inatFetch(url));

      const taxonId = args["taxon_id"] !== undefined ? args["taxon_id"] : undefined;
      const placeId = args["place_id"] !== undefined ? args["place_id"] : undefined;
      const sourceParts: string[] = [];
      if (taxonId !== undefined) sourceParts.push(`taxon_id=${taxonId}`);
      if (placeId !== undefined) sourceParts.push(`place_id=${placeId}`);
      const sourceUrl = `https://www.inaturalist.org/identifications${sourceParts.length ? `?${sourceParts.join("&")}` : ""}`;

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__identifications_by_id",
      description:
        "Returns the full iNaturalist identification record for a known identification ID. An identification is a community taxon determination on an observation. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "iNaturalist identification ID (integer)" },
        },
        required: ["id"],
      },
    },
    handler: async (args) => {
      const id = Number(args["id"]);
      const url = `${INAT_API_BASE}/identifications/${id}`;
      const raw = InatIdentificationsByIdRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/identifications/${id}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },

  {
    tool: {
      name: "inaturalist__places_nearby",
      description:
        "Returns standard (admin) and community places within a bounding box from iNaturalist. Useful for discovering what iNaturalist place IDs cover a given geographic area. No cache — live call. Provide all four bounding box corners: nelat, nelng (NE corner) and swlat, swlng (SW corner).",
      inputSchema: {
        type: "object" as const,
        properties: {
          nelat: { type: "number", description: "Northeast corner latitude" },
          nelng: { type: "number", description: "Northeast corner longitude" },
          swlat: { type: "number", description: "Southwest corner latitude" },
          swlng: { type: "number", description: "Southwest corner longitude" },
          name: { type: "string", description: "Optional name filter to narrow results" },
          per_page: { type: "number", description: "Results per page" },
        },
        required: ["nelat", "nelng", "swlat", "swlng"],
      },
    },
    handler: async (args) => {
      const nelat = Number(args["nelat"]);
      const nelng = Number(args["nelng"]);
      const swlat = Number(args["swlat"]);
      const swlng = Number(args["swlng"]);

      const q = new URLSearchParams();
      q.set("nelat", String(nelat));
      q.set("nelng", String(nelng));
      q.set("swlat", String(swlat));
      q.set("swlng", String(swlng));
      if (args["name"] !== undefined) q.set("name", String(args["name"]));
      if (args["per_page"] !== undefined) q.set("per_page", String(args["per_page"]));

      const url = `${INAT_API_BASE}/places/nearby?${q.toString()}`;
      const raw = InatPlacesNearbyRaw.parse(await inatFetch(url));

      return buildAcknowledgedEnvelope({
        sourceId: INAT_SOURCE_ID,
        sourceUrl: `https://www.inaturalist.org/places?nelat=${nelat}&nelng=${nelng}&swlat=${swlat}&swlng=${swlng}`,
        license: INAT_LICENSE,
        rights: INAT_RIGHTS,
        found: true,
        data: raw,
        pagination: null,
      });
    },
  },
];
