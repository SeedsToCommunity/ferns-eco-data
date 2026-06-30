import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { apiGet } from "./client.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

interface ToolDef {
  tool: Tool;
  handler: ToolHandler;
}

const PV_PROP = {
  provenance_verbosity: {
    type: "string",
    enum: ["full", "summary", "none"],
    description: "Controls how much provenance text is returned. full (default) returns both general_summary and technical_details; summary returns general_summary only; none omits both.",
  },
} as const;

function pv(args: Record<string, unknown>): string | undefined {
  return args["provenance_verbosity"] !== undefined ? String(args["provenance_verbosity"]) : undefined;
}

const tools: ToolDef[] = [

  // ── bonap-napa ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "bonap_napa__map",
      description:
        "Returns county-level distribution data for a vascular plant from the BONAP North American Plant Atlas, based on nearly four million verified herbarium specimens. Shows native, exotic, absent, and rare status for every county across North America. " +
        "data.genus and data.species report the actual values used to query BONAP; data.species may differ from the requested species if a subspecies qualifier was stripped (BONAP does not publish subspecies-level maps). " +
        "A 503 response means BONAP was unreachable; the query was not cached. " +
        "Response follows the FERNS Response Envelope Contract v1; provenance contains cache_status, queried_at, and source_url.",
      inputSchema: {
        type: "object" as const,
        properties: {
          genus:      { type: "string", description: "Genus name (e.g. Trillium)" },
          species:    { type: "string", description: "Species base epithet, single word (e.g. grandiflorum). Do not include subspecies, variety, or other infraspecific qualifiers — BONAP does not publish subspecies-level maps and the API returns 400 for such inputs." },
          map_type:   { type: "string", enum: ["county_species", "state_species"], description: "Map resolution (default: county_species)" },
          refresh:    { type: "boolean", description: "Bypass cache and re-fetch from BONAP" },
          ...PV_PROP,
        },
        required: ["genus", "species"],
      },
    },
    handler: async (args) =>
      apiGet("/bonap/map", {
        genus:    String(args["genus"]),
        species:  String(args["species"]),
        map_type: args["map_type"] !== undefined ? String(args["map_type"]) : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── gbif ────────────────────────────────────────────────────────────────
  {
    tool: {
      name: "gbif__species",
      description:
        "Returns the verbatim GBIF species record for a known usageKey. Use this to resolve an acceptedUsageKey from a SYNONYM match result — when gbif__match returns status=SYNONYM, call gbif__species with acceptedUsageKey to get the accepted canonical name and full classification. Cached 30 days per usageKey.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF backbone usage key (integer)" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet(`/gbif/species/${Number(args["usageKey"])}`, {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },
  {
    tool: {
      name: "gbif__species_synonyms",
      description:
        "Returns all taxonomic synonyms for a GBIF taxon identified by its usage key. Response is verbatim GBIF upstream: offset, limit, endOfRecords, count, results array. Use gbif__match first to resolve a scientific name to a usageKey. For SYNONYM matches, use the acceptedUsageKey (not the synonym usageKey) to get the correct synonym list.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF usage key (integer)" },
          limit:    { type: "number", description: "Number of results to return (1–1000, default 100)" },
          offset:   { type: "number", description: "Zero-based offset for pagination (default 0)" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet(`/gbif/species/${Number(args["usageKey"])}/synonyms`, {
        limit:   args["limit"]   !== undefined ? String(args["limit"])   : undefined,
        offset:  args["offset"]  !== undefined ? String(args["offset"])  : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },
  {
    tool: {
      name: "gbif__species_vernacular_names",
      description:
        "Returns all vernacular (common) names for a GBIF taxon identified by its usage key, across all languages and countries in the GBIF backbone. Response is verbatim GBIF upstream: offset, limit, endOfRecords, count, results array. Use gbif__match first to resolve a scientific name to a usageKey.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF usage key (integer)" },
          limit:    { type: "number", description: "Number of results to return (1–1000, default 100)" },
          offset:   { type: "number", description: "Zero-based offset for pagination (default 0)" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet(`/gbif/species/${Number(args["usageKey"])}/vernacularNames`, {
        limit:   args["limit"]   !== undefined ? String(args["limit"])   : undefined,
        offset:  args["offset"]  !== undefined ? String(args["offset"])  : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },
  {
    tool: {
      name: "gbif__species_match",
      description:
        "Upstream: GET /v1/species/match. Matches a scientific name string to the GBIF taxonomic backbone, returning usageKey, rank, confidence, and taxonomic status. When status=SYNONYM, response includes acceptedUsageKey — use gbif__species with that key to resolve the accepted canonical name. Use this first to get a usageKey before calling gbif__occurrence_search or other taxon-keyed endpoints.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name to match (e.g. Quercus alba)" },
          rank:    { type: "string", description: "Restrict match to a specific rank (e.g. SPECIES, GENUS)" },
          strict:  { type: "boolean", description: "Strict matching only — no fuzzy or higher rank matches" },
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/species/match", {
        name:    String(args["name"]),
        rank:    args["rank"]    !== undefined ? String(args["rank"])    : undefined,
        strict:  args["strict"]  !== undefined ? String(args["strict"])  : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },
  {
    tool: {
      name: "gbif__occurrence_search",
      description:
        "Upstream: GET /v1/occurrence/search. Search GBIF occurrence records using GBIF native parameters (passthrough). Returns verbatim GBIF paginated response: count, offset, limit, endOfRecords, results array. Use taxonKey (the usageKey from gbif__species_match) to filter by taxon. Supports country (ISO 2-letter, single value), continent, hasCoordinate, basisOfRecord, year, and limit/offset pagination. Cached 7 days per parameter combination. NOTE: the old usageKey parameter is gone — use taxonKey instead.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxonKey:           { type: "number",  description: "GBIF backbone taxon key (from gbif__match usageKey). Required for taxon-specific queries." },
          country:            { type: "string",  description: "ISO 3166-1 alpha-2 country code (e.g. US, CA, GB). Single value." },
          continent:          { type: "string",  enum: ["AFRICA","ANTARCTICA","ASIA","EUROPE","NORTH_AMERICA","OCEANIA","SOUTH_AMERICA"], description: "Continent filter" },
          hasCoordinate:      { type: "boolean", description: "Only return records with coordinates (recommended: true)" },
          hasGeospatialIssue: { type: "boolean", description: "Exclude records with geospatial issues (recommended: false)" },
          basisOfRecord:      { type: "string",  description: "Filter by basis of record (e.g. HUMAN_OBSERVATION, PRESERVED_SPECIMEN, MATERIAL_CITATION)" },
          year:               { type: "string",  description: "Year or range (e.g. 2020 or 2010,2020)" },
          limit:              { type: "number",  description: "Number of results to return (default 20, max 300)" },
          offset:             { type: "number",  description: "Zero-based offset for pagination (default 0)" },
          refresh:            { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/occurrence/search", {
        taxonKey:           args["taxonKey"]           !== undefined ? Number(args["taxonKey"])           : undefined,
        country:            args["country"]            !== undefined ? String(args["country"])            : undefined,
        continent:          args["continent"]          !== undefined ? String(args["continent"])          : undefined,
        hasCoordinate:      args["hasCoordinate"]      !== undefined ? String(args["hasCoordinate"])      : undefined,
        hasGeospatialIssue: args["hasGeospatialIssue"] !== undefined ? String(args["hasGeospatialIssue"]) : undefined,
        basisOfRecord:      args["basisOfRecord"]      !== undefined ? String(args["basisOfRecord"])      : undefined,
        year:               args["year"]               !== undefined ? String(args["year"])               : undefined,
        limit:              args["limit"]              !== undefined ? Number(args["limit"])              : undefined,
        offset:             args["offset"]             !== undefined ? Number(args["offset"])             : undefined,
        refresh:            args["refresh"]            !== undefined ? String(args["refresh"])            : undefined,
      }),
  },
  {
    tool: {
      name: "gbif__species_search",
      description:
        "Upstream: GET /v1/species/search. Searches GBIF species by vernacular (common) name. Returns verbatim GBIF paginated species/search response: count, offset, limit, endOfRecords, results array. Each result includes usageKey, canonicalName, scientificName, rank, status, family, and the matched vernacularName. Results are cached 7 days per query.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q:       { type: "string",  description: "Common name search query (e.g. butterfly milkweed)" },
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/species/search", {
        q:       String(args["q"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },

  // ── inaturalist ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "inaturalist__places_autocomplete",
      description:
        "Searches iNaturalist's place index by name and returns matching place records with place IDs. Place IDs are required by other iNaturalist tools to filter results geographically.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q:       { type: "string", description: "Place name to search (e.g. Washtenaw County)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/places/autocomplete", {
        q:       String(args["q"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__observations_histogram",
      description:
        "Returns a monthly phenology histogram of iNaturalist observation counts for a taxon, optionally filtered by place and phenological stage. Use term_id=12 to restrict to Flowers and Fruits annotations only (stage-filtered histogram), producing a curve that reflects flowering/fruiting activity rather than all observations. Useful for understanding seasonal bloom, fruiting, or leaf-out patterns.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:      { type: "number",  description: "iNaturalist taxon ID (integer)" },
          place_id:      { type: "string",  description: "Comma-separated iNaturalist place IDs to filter by" },
          term_id:       { type: "number",  description: "Controlled annotation term ID (e.g. 12 for Flowers and Fruits, 36 for Leaves)" },
          term_value_id: { type: "number",  description: "Controlled annotation value ID. Requires term_id." },
          refresh:       { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/observations/histogram", {
        taxon_id:      Number(args["taxon_id"]),
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])      : undefined,
        term_id:       args["term_id"]       !== undefined ? Number(args["term_id"])       : undefined,
        term_value_id: args["term_value_id"] !== undefined ? Number(args["term_value_id"]) : undefined,
        refresh:       args["refresh"]       !== undefined ? String(args["refresh"])       : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__observations_popular_field_values",
      description:
        "Returns observer-submitted field values (e.g., habitat, plant height) for a taxon from iNaturalist, optionally filtered by place and verification status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:   { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id:   { type: "string", description: "Comma-separated iNaturalist place IDs to filter by" },
          verifiable: { type: "boolean", description: "Only include verifiable observations (default: true)" },
          refresh:    { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/observations/popular_field_values", {
        taxon_id:   Number(args["taxon_id"]),
        place_id:   args["place_id"] !== undefined ? String(args["place_id"]) : undefined,
        verifiable: args["verifiable"] !== undefined ? String(args["verifiable"]) : undefined,
        refresh:    args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__observations",
      description:
        "Returns one page of iNaturalist observation records as a curated field subset (id, uri, observed_on, quality_grade, taxon_name, common_name, place_guess, location, observer, photo_url, photo_attribution). This is NOT the full iNat record — follow the uri field for the complete observation. Supports pagination via page and per_page. The iNat API enforces a hard ceiling of 10,000 accessible results (page × per_page ≤ 10,000). No caching — every call is live.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:     { type: "number",  description: "iNaturalist taxon ID (integer)" },
          place_id:     { type: "string",  description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade:{ type: "string",  description: "research | needs_id | casual" },
          d1:           { type: "string",  description: "Earliest date (YYYY-MM-DD). Filters by observed_on." },
          d2:           { type: "string",  description: "Latest date (YYYY-MM-DD). Filters by observed_on." },
          per_page:     { type: "number",  description: "Results per page (default 30, max 200)" },
          page:         { type: "number",  description: "Page number, 1-indexed (default 1)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/observations", {
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])   : undefined,
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])   : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        d1:            args["d1"]            !== undefined ? String(args["d1"])          : undefined,
        d2:            args["d2"]            !== undefined ? String(args["d2"])          : undefined,
        per_page:      args["per_page"]      !== undefined ? Number(args["per_page"])   : undefined,
        page:          args["page"]          !== undefined ? Number(args["page"])        : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  {
    tool: {
      name: "inaturalist__observations_species_counts",
      description:
        "Returns species ranked by observation count from iNaturalist. Useful for identifying which species are most frequently observed in a given place or under specific filters. Supports filtering by place, quality grade, iconic taxon group (e.g. Plantae), nativity (native/introduced), phenology annotations (term_id/term_value_id), month window, and geographic constraints (lat/lng radius or bounding box). No caching — every call is live.",
      inputSchema: {
        type: "object" as const,
        properties: {
          place_id:          { type: "string",  description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade:     { type: "string",  description: "research | needs_id | casual" },
          iconic_taxon_name: { type: "string",  description: "Iconic taxon group: Plantae, Aves, Fungi, Mammalia, Reptilia, Amphibia, Actinopterygii, Mollusca, Arachnida, Insecta, Animalia" },
          native:            { type: "boolean", description: "Only native taxa" },
          introduced:        { type: "boolean", description: "Only introduced taxa" },
          term_id:           { type: "number",  description: "Controlled annotation term ID (e.g. 12 for Flowers and Fruits)" },
          term_value_id:     { type: "number",  description: "Controlled annotation value ID. Requires term_id." },
          month:             { type: "string",  description: "Comma-separated month numbers (e.g. 4,5,6 for Apr–Jun)" },
          d1:               { type: "string",  description: "Earliest date (YYYY-MM-DD). Filters by observed_on." },
          d2:               { type: "string",  description: "Latest date (YYYY-MM-DD). Filters by observed_on." },
          per_page:          { type: "number",  description: "Results to return (default 500, max 500)" },
          page:              { type: "number",  description: "Page number, 1-indexed" },
          lat:               { type: "number",  description: "Center latitude for radius filter" },
          lng:               { type: "number",  description: "Center longitude for radius filter" },
          radius:            { type: "number",  description: "Radius in km" },
          nelat:             { type: "number",  description: "Bounding box NE latitude" },
          nelng:             { type: "number",  description: "Bounding box NE longitude" },
          swlat:             { type: "number",  description: "Bounding box SW latitude" },
          swlng:             { type: "number",  description: "Bounding box SW longitude" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/observations/species_counts", {
        place_id:          args["place_id"]          !== undefined ? String(args["place_id"])          : undefined,
        quality_grade:     args["quality_grade"]     !== undefined ? String(args["quality_grade"])     : undefined,
        iconic_taxon_name: args["iconic_taxon_name"] !== undefined ? String(args["iconic_taxon_name"]) : undefined,
        native:            args["native"]            !== undefined ? String(args["native"])            : undefined,
        introduced:        args["introduced"]        !== undefined ? String(args["introduced"])        : undefined,
        term_id:           args["term_id"]           !== undefined ? Number(args["term_id"])           : undefined,
        term_value_id:     args["term_value_id"]     !== undefined ? Number(args["term_value_id"])     : undefined,
        month:             args["month"]             !== undefined ? String(args["month"])             : undefined,
        d1:                args["d1"]                !== undefined ? String(args["d1"])                : undefined,
        d2:                args["d2"]                !== undefined ? String(args["d2"])                : undefined,
        per_page:          args["per_page"]          !== undefined ? Number(args["per_page"])          : undefined,
        page:              args["page"]              !== undefined ? Number(args["page"])              : undefined,
        lat:               args["lat"]               !== undefined ? Number(args["lat"])               : undefined,
        lng:               args["lng"]               !== undefined ? Number(args["lng"])               : undefined,
        radius:            args["radius"]            !== undefined ? Number(args["radius"])            : undefined,
        nelat:             args["nelat"]             !== undefined ? Number(args["nelat"])             : undefined,
        nelng:             args["nelng"]             !== undefined ? Number(args["nelng"])             : undefined,
        swlat:             args["swlat"]             !== undefined ? Number(args["swlat"])             : undefined,
        swlng:             args["swlng"]             !== undefined ? Number(args["swlng"])             : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  {
    tool: {
      name: "inaturalist__controlled_terms",
      description:
        "Returns the full list of iNaturalist controlled annotation terms and their possible values. Use this to look up term_id and term_value_id pairs (e.g. term_id=12 for Flowers and Fruits, with values Flowering, Fruiting, etc). The list is essentially static — cached permanently. Use refresh=true to force a re-fetch.",
      inputSchema: {
        type: "object" as const,
        properties: {
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from iNaturalist" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/controlled_terms", {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
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
          refresh:  { type: "boolean", description: "Bypass cache" },
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/controlled_terms/for_taxon", {
        taxon_id: Number(args["taxon_id"]),
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__taxa_autocomplete",
      description:
        "Fast partial-name taxon search on iNaturalist with photo thumbnails and observation counts. Designed for type-ahead search. Returns up to 10 results. No cache — every call is live. Use this to find taxon IDs for use in other iNaturalist tools.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q:                  { type: "string",  description: "Partial or full scientific or common name" },
          per_page:           { type: "number",  description: "Results to return (max 10, default 10)" },
          is_active:          { type: "boolean", description: "Filter to active taxa only (default true)" },
          rank:               { type: "string",  description: "Taxonomic rank filter (e.g. species, genus, family)" },
          locale:             { type: "string",  description: "Locale code for common names (e.g. en, es)" },
          all_names:          { type: "boolean", description: "Include all name variants in search" },
          preferred_place_id: { type: "number",  description: "Place ID to prioritize common names for that place" },
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/taxa/autocomplete", {
        q:                  String(args["q"]),
        per_page:           args["per_page"]           !== undefined ? Number(args["per_page"])           : undefined,
        is_active:          args["is_active"]          !== undefined ? String(args["is_active"])          : undefined,
        rank:               args["rank"]               !== undefined ? String(args["rank"])               : undefined,
        locale:             args["locale"]             !== undefined ? String(args["locale"])             : undefined,
        all_names:          args["all_names"]          !== undefined ? String(args["all_names"])          : undefined,
        preferred_place_id: args["preferred_place_id"] !== undefined ? Number(args["preferred_place_id"]) : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__taxa_by_id",
      description:
        "Returns the full iNaturalist taxon record for a known taxon ID, including Wikipedia summary, listed_taxa (nativity per place — the canonical source of native/introduced/endemic status), children, conservation_status, and default_photo. DB-cached for 30 days. Use refresh=true to force a re-fetch.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "number",  description: "iNaturalist taxon ID (integer)" },
          refresh: { type: "boolean", description: "Bypass cache" },
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/taxa/${Number(args["id"])}`, {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__places_by_id",
      description:
        "Returns the full iNaturalist place record for a known place ID, including display name, place type, centroid, bounding box, and admin hierarchy. DB-cached permanently (place IDs are stable). Use refresh=true to force a re-fetch.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:          { type: "number",  description: "iNaturalist place ID (integer)" },
          admin_level: { type: "number",  description: "Admin level filter (0=country, 1=state, 2=county)" },
          refresh:     { type: "boolean", description: "Bypass cache" },
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/places/${Number(args["id"])}`, {
        admin_level: args["admin_level"] !== undefined ? Number(args["admin_level"]) : undefined,
        refresh:     args["refresh"]     !== undefined ? String(args["refresh"])     : undefined,
      }),
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
    handler: async (args) =>
      apiGet(`/inat/observations/${Number(args["observation_id"])}/taxon_summary`, {
      }),
  },

  {
    tool: {
      name: "inaturalist__identifications_similar_species",
      description:
        "Returns species commonly confused with a given taxon from iNaturalist's identification history, ranked by co-confusion count. Useful for disambiguation and quality identification work. Optionally filtered by place and geography. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:      { type: "number",  description: "iNaturalist taxon ID to find similar species for (integer)" },
          place_id:      { type: "string",  description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string",  description: "research | needs_id | casual" },
          lat:           { type: "number",  description: "Center latitude for radius filter" },
          lng:           { type: "number",  description: "Center longitude for radius filter" },
          radius:        { type: "number",  description: "Radius in km" },
          nelat:         { type: "number",  description: "Bounding box NE latitude" },
          nelng:         { type: "number",  description: "Bounding box NE longitude" },
          swlat:         { type: "number",  description: "Bounding box SW latitude" },
          swlng:         { type: "number",  description: "Bounding box SW longitude" },
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/similar_species", {
        taxon_id:      Number(args["taxon_id"]),
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        lat:           args["lat"]           !== undefined ? Number(args["lat"])           : undefined,
        lng:           args["lng"]           !== undefined ? Number(args["lng"])           : undefined,
        radius:        args["radius"]        !== undefined ? Number(args["radius"])        : undefined,
        nelat:         args["nelat"]         !== undefined ? Number(args["nelat"])         : undefined,
        nelng:         args["nelng"]         !== undefined ? Number(args["nelng"])         : undefined,
        swlat:         args["swlat"]         !== undefined ? Number(args["swlat"])         : undefined,
        swlng:         args["swlng"]         !== undefined ? Number(args["swlng"])         : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__identifications_species_counts",
      description:
        "Returns species ranked by identification activity on iNaturalist — a community engagement signal distinct from raw observation count. Use taxon_of=identification (default) to rank by the identified taxon, or taxon_of=community to rank by the community-agreed taxon. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:      { type: "number",  description: "iNaturalist taxon ID to filter by" },
          place_id:      { type: "string",  description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string",  description: "research | needs_id | casual" },
          per_page:      { type: "number",  description: "Results per page (max 500)" },
          page:          { type: "number",  description: "Page number, 1-indexed" },
          d1:            { type: "string",  description: "Start date filter (YYYY-MM-DD)" },
          d2:            { type: "string",  description: "End date filter (YYYY-MM-DD)" },
          month:         { type: "string",  description: "Comma-separated month numbers (e.g. 4,5,6)" },
          native:        { type: "boolean", description: "Only native taxa" },
          introduced:    { type: "boolean", description: "Only introduced taxa" },
          lat:           { type: "number",  description: "Center latitude for radius filter" },
          lng:           { type: "number",  description: "Center longitude for radius filter" },
          radius:        { type: "number",  description: "Radius in km" },
          nelat:         { type: "number",  description: "Bounding box NE latitude" },
          nelng:         { type: "number",  description: "Bounding box NE longitude" },
          swlat:         { type: "number",  description: "Bounding box SW latitude" },
          swlng:         { type: "number",  description: "Bounding box SW longitude" },
          order:         { type: "string",  description: "asc or desc (default desc)" },
          order_by:      { type: "string",  description: "count or id" },
          taxon_of:      { type: "string",  description: "identification (default) or community" },
          iconic_taxa:   { type: "string",  description: "Comma-separated iconic taxon names (e.g. Plantae,Fungi)" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/species_counts", {
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        per_page:      args["per_page"]      !== undefined ? Number(args["per_page"])      : undefined,
        page:          args["page"]          !== undefined ? Number(args["page"])          : undefined,
        d1:            args["d1"]            !== undefined ? String(args["d1"])            : undefined,
        d2:            args["d2"]            !== undefined ? String(args["d2"])            : undefined,
        month:         args["month"]         !== undefined ? String(args["month"])         : undefined,
        native:        args["native"]        !== undefined ? String(args["native"])        : undefined,
        introduced:    args["introduced"]    !== undefined ? String(args["introduced"])    : undefined,
        lat:           args["lat"]           !== undefined ? Number(args["lat"])           : undefined,
        lng:           args["lng"]           !== undefined ? Number(args["lng"])           : undefined,
        radius:        args["radius"]        !== undefined ? Number(args["radius"])        : undefined,
        nelat:         args["nelat"]         !== undefined ? Number(args["nelat"])         : undefined,
        nelng:         args["nelng"]         !== undefined ? Number(args["nelng"])         : undefined,
        swlat:         args["swlat"]         !== undefined ? Number(args["swlat"])         : undefined,
        swlng:         args["swlng"]         !== undefined ? Number(args["swlng"])         : undefined,
        order:         args["order"]         !== undefined ? String(args["order"])         : undefined,
        order_by:      args["order_by"]      !== undefined ? String(args["order_by"])      : undefined,
        taxon_of:      args["taxon_of"]      !== undefined ? String(args["taxon_of"])      : undefined,
        iconic_taxa:   args["iconic_taxa"]   !== undefined ? String(args["iconic_taxa"])   : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__identifications_recent_taxa",
      description:
        "Returns taxa recently identified in a given iNaturalist place — 'what's being documented right now'. Useful for real-time biodiversity monitoring queries. Optionally filtered by taxon, quality grade, and date range. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          place_id:      { type: "string", description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          taxon_id:      { type: "number", description: "Filter to a specific taxon and its children" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          per_page:      { type: "number", description: "Results per page" },
          page:          { type: "number", description: "Page number, 1-indexed" },
          d1:            { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          d2:            { type: "string", description: "End date filter (YYYY-MM-DD)" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/recent_taxa", {
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])      : undefined,
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        per_page:      args["per_page"]      !== undefined ? Number(args["per_page"])      : undefined,
        page:          args["page"]          !== undefined ? Number(args["page"])          : undefined,
        d1:            args["d1"]            !== undefined ? String(args["d1"])            : undefined,
        d2:            args["d2"]            !== undefined ? String(args["d2"])            : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__identifications",
      description:
        "Returns a paged list of individual iNaturalist identification records — who identified what taxon on which observation. Distinct from observations: one observation can have many identifications. Useful for understanding the community identification process for a taxon. Live call, no cache. Supports pagination via page and per_page.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id:      { type: "number",  description: "iNaturalist taxon ID" },
          place_id:      { type: "string",  description: "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)" },
          quality_grade: { type: "string",  description: "research | needs_id | casual" },
          per_page:      { type: "number",  description: "Results per page (max 200)" },
          page:          { type: "number",  description: "Page number, 1-indexed" },
          d1:            { type: "string",  description: "Start date filter (YYYY-MM-DD)" },
          d2:            { type: "string",  description: "End date filter (YYYY-MM-DD)" },
          month:         { type: "string",  description: "Comma-separated month numbers" },
          native:        { type: "boolean", description: "Only native taxa" },
          introduced:    { type: "boolean", description: "Only introduced taxa" },
          lat:           { type: "number",  description: "Center latitude for radius filter" },
          lng:           { type: "number",  description: "Center longitude for radius filter" },
          radius:        { type: "number",  description: "Radius in km" },
          nelat:         { type: "number",  description: "Bounding box NE latitude" },
          nelng:         { type: "number",  description: "Bounding box NE longitude" },
          swlat:         { type: "number",  description: "Bounding box SW latitude" },
          swlng:         { type: "number",  description: "Bounding box SW longitude" },
          locale:        { type: "string",  description: "Locale for common names (e.g. en, es)" },
          user_id:       { type: "number",  description: "Filter by identifier user ID" },
          user_login:    { type: "string",  description: "Filter by identifier user login" },
          iconic_taxa:   { type: "string",  description: "Comma-separated iconic taxon names" },
          term_id:       { type: "number",  description: "Controlled annotation term ID" },
          term_value_id: { type: "number",  description: "Controlled annotation value ID" },
          verifiable:    { type: "boolean", description: "Only verifiable observations" },
          order:         { type: "string",  description: "asc or desc" },
          order_by:      { type: "string",  description: "created_at or id" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications", {
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        place_id:      args["place_id"]      !== undefined ? String(args["place_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        per_page:      args["per_page"]      !== undefined ? Number(args["per_page"])      : undefined,
        page:          args["page"]          !== undefined ? Number(args["page"])          : undefined,
        d1:            args["d1"]            !== undefined ? String(args["d1"])            : undefined,
        d2:            args["d2"]            !== undefined ? String(args["d2"])            : undefined,
        month:         args["month"]         !== undefined ? String(args["month"])         : undefined,
        native:        args["native"]        !== undefined ? String(args["native"])        : undefined,
        introduced:    args["introduced"]    !== undefined ? String(args["introduced"])    : undefined,
        lat:           args["lat"]           !== undefined ? Number(args["lat"])           : undefined,
        lng:           args["lng"]           !== undefined ? Number(args["lng"])           : undefined,
        radius:        args["radius"]        !== undefined ? Number(args["radius"])        : undefined,
        nelat:         args["nelat"]         !== undefined ? Number(args["nelat"])         : undefined,
        nelng:         args["nelng"]         !== undefined ? Number(args["nelng"])         : undefined,
        swlat:         args["swlat"]         !== undefined ? Number(args["swlat"])         : undefined,
        swlng:         args["swlng"]         !== undefined ? Number(args["swlng"])         : undefined,
        locale:        args["locale"]        !== undefined ? String(args["locale"])        : undefined,
        user_id:       args["user_id"]       !== undefined ? Number(args["user_id"])       : undefined,
        user_login:    args["user_login"]    !== undefined ? String(args["user_login"])    : undefined,
        iconic_taxa:   args["iconic_taxa"]   !== undefined ? String(args["iconic_taxa"])   : undefined,
        term_id:       args["term_id"]       !== undefined ? Number(args["term_id"])       : undefined,
        term_value_id: args["term_value_id"] !== undefined ? Number(args["term_value_id"]) : undefined,
        verifiable:    args["verifiable"]    !== undefined ? String(args["verifiable"])    : undefined,
        order:         args["order"]         !== undefined ? String(args["order"])         : undefined,
        order_by:      args["order_by"]      !== undefined ? String(args["order_by"])      : undefined,
      }),
  },

  {
    tool: {
      name: "inaturalist__identifications_by_id",
      description:
        "Returns the full iNaturalist identification record for a known identification ID. An identification is a community taxon determination on an observation. Live call, no cache.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:  { type: "number", description: "iNaturalist identification ID (integer)" },
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/identifications/${Number(args["id"])}`, {
      }),
  },

  {
    tool: {
      name: "inaturalist__places_nearby",
      description:
        "Returns standard (admin) and community places within a bounding box from iNaturalist. Useful for discovering what iNaturalist place IDs cover a given geographic area. No cache — live call. Provide all four bounding box corners: nelat, nelng (NE corner) and swlat, swlng (SW corner).",
      inputSchema: {
        type: "object" as const,
        properties: {
          nelat:    { type: "number", description: "Northeast corner latitude" },
          nelng:    { type: "number", description: "Northeast corner longitude" },
          swlat:    { type: "number", description: "Southwest corner latitude" },
          swlng:    { type: "number", description: "Southwest corner longitude" },
          name:     { type: "string", description: "Optional name filter to narrow results" },
          per_page: { type: "number", description: "Results per page" },
        },
        required: ["nelat", "nelng", "swlat", "swlng"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/places/nearby", {
        nelat:    Number(args["nelat"]),
        nelng:    Number(args["nelng"]),
        swlat:    Number(args["swlat"]),
        swlng:    Number(args["swlng"]),
        name:     args["name"]     !== undefined ? String(args["name"])     : undefined,
        per_page: args["per_page"] !== undefined ? Number(args["per_page"]) : undefined,
      }),
  },

  // ── michigan-flora ──────────────────────────────────────────────────────
  {
    tool: {
      name: "michigan_flora__locs_sp",
      description:
        "Returns county-level occurrence records for a Michigan Flora species by plant_id. " +
        "data.locations is the county list. Use michigan_flora__flora_search_sp first to resolve a scientific name to a plant_id. " +
        "Mirrors the Michigan Flora locs_sp?id={plant_id} endpoint verbatim.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "integer", description: "Michigan Flora plant_id (positive integer, from flora_search_sp)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/locs_sp", {
        id:      Number(args["id"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__allimage_info",
      description:
        "Returns all image records for a Michigan Flora species by plant_id. " +
        "data is the array of image records (image_id, image_name, caption, photographer, image_url, thumbnail_url). " +
        "Use michigan_flora__flora_search_sp first to resolve a scientific name to a plant_id. " +
        "Mirrors the Michigan Flora allimage_info?id={plant_id} endpoint verbatim.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "integer", description: "Michigan Flora plant_id (positive integer, from flora_search_sp)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/allimage_info", {
        id:      Number(args["id"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__flora_search_sp",
      description:
        "Searches Michigan Flora for species matching a scientific name. " +
        "data is an array of species records (not a wrapped object) — each record includes plant_id, scientific_name, family_name, native status (na: N=native, A=adventive), C-value, wetland indicator code (OBL/FACW/FAC/FACU/UPL), physiognomy, and common names. " +
        "The plant_id from the matching record is required by michigan_flora__spec_text, michigan_flora__synonyms, michigan_flora__allimage_info, michigan_flora__locs_sp, and michigan_flora__pimage_info. " +
        "Mirrors the Michigan Flora flora_search_sp?scientific_name={name} endpoint verbatim.",
      inputSchema: {
        type: "object" as const,
        properties: {
          scientific_name: { type: "string", description: "Scientific name to search (e.g. Quercus rubra)" },
          refresh:         { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["scientific_name"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/flora_search_sp", {
        scientific_name: String(args["scientific_name"]),
        refresh:         args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__spec_text",
      description:
        "Returns botanical description HTML text for a Michigan Flora species by plant_id. " +
        "data.text is the description text (or null if unavailable). " +
        "Note: permission_granted is always false — the text is fetched for reference but is not licensed for reproduction. " +
        "Use michigan_flora__flora_search_sp first to resolve a scientific name to a plant_id.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "integer", description: "Michigan Flora plant_id (positive integer, from flora_search_sp)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/spec_text", {
        id:      Number(args["id"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__synonyms",
      description:
        "Returns taxonomic synonyms for a Michigan Flora species by plant_id. " +
        "data is the bare array of synonym records ({ synonym: string, author: string | null }) — empty array if none exist. " +
        "Use michigan_flora__flora_search_sp first to resolve a scientific name to a plant_id.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "integer", description: "Michigan Flora plant_id (positive integer, from flora_search_sp)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/synonyms", {
        id:      Number(args["id"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__pimage_info",
      description:
        "Returns the primary (featured) image record for a Michigan Flora species by plant_id. " +
        "data is the flat image record ({ image_id, image_name, caption, photographer, image_url, thumbnail_url }) or null if no primary image exists. " +
        "Use michigan_flora__flora_search_sp first to resolve a scientific name to a plant_id.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id:      { type: "integer", description: "Michigan Flora plant_id (positive integer, from flora_search_sp)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/pimage_info", {
        id:      Number(args["id"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── coefficient-of-conservatism ─────────────────────────────────────────
  {
    tool: {
      name: "coefficient_of_conservatism__lookup",
      description:
        "Returns the Coefficient of Conservatism record for a given C-value (0–10), including its label and description of what that value represents ecologically.",
      inputSchema: {
        type: "object" as const,
        properties: {
          value: { type: "string", description: "C-value to look up (e.g. 0, 5, or 10)" },
          ...PV_PROP,
        },
        required: ["value"],
      },
    },
    handler: async (args) =>
      apiGet("/coefficient-of-conservatism", {
        value: String(args["value"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "coefficient_of_conservatism__list",
      description:
        "Returns all defined C-value records (0–10) with their labels and descriptions. The complete reference table for the coefficient of conservatism scale.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/coefficient-of-conservatism/list", {
        provenance_verbosity: pv(args),
      }),
  },

  // ── wetland-indicator-status ────────────────────────────────────────────
  {
    tool: {
      name: "wetland_indicator_status__by_code",
      description:
        "Returns the Wetland Indicator Status record for a USDA NRCS code (OBL, FACW, FAC, FACU, or UPL), including its full name, description, and numeric W-value equivalent.",
      inputSchema: {
        type: "object" as const,
        properties: {
          code: { type: "string", enum: ["OBL", "FACW", "FAC", "FACU", "UPL"], description: "Wetland indicator code" },
          ...PV_PROP,
        },
        required: ["code"],
      },
    },
    handler: async (args) =>
      apiGet("/wetland-indicator-status", {
        code: String(args["code"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wetland_indicator_status__by_w",
      description:
        "Returns the Wetland Indicator Status record for a numeric W-value, which is the numeric analogue of the five-category USDA NRCS code system.",
      inputSchema: {
        type: "object" as const,
        properties: {
          value: { type: "string", description: "W-value to look up (-5, -3, 0, 3, or 5)" },
          ...PV_PROP,
        },
        required: ["value"],
      },
    },
    handler: async (args) =>
      apiGet("/wetland-indicator-status/w", {
        value: String(args["value"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wetland_indicator_status__list",
      description:
        "Returns all five Wetland Indicator Status codes with their descriptions and corresponding W numeric values. The complete USDA NRCS wetland indicator reference table.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/wetland-indicator-status/list", {
        provenance_verbosity: pv(args),
      }),
  },

  // ── wucols-water-use ────────────────────────────────────────────────────
  {
    tool: {
      name: "wucols_water_use__lookup",
      description:
        "Returns the WUCOLS water-use classification record for a given code (H, M, L, or VL), including its label and description of expected irrigation need.",
      inputSchema: {
        type: "object" as const,
        properties: {
          code: { type: "string", enum: ["H", "M", "L", "VL"], description: "WUCOLS water-use code" },
          ...PV_PROP,
        },
        required: ["code"],
      },
    },
    handler: async (args) =>
      apiGet("/wucols-water-use", {
        code: String(args["code"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wucols_water_use__list",
      description:
        "Returns all WUCOLS water-use classification codes with descriptions, covering High, Medium, Low, and Very Low categories.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/wucols-water-use/list", {
        provenance_verbosity: pv(args),
      }),
  },

  // ── seeds-to-community-washtenaw ────────────────────────────────────────
  {
    tool: {
      name: "seeds_to_community_washtenaw__seed_availability",
      description:
        "Returns the list of plant species available in the Seeds to Community Washtenaw seed catalog for a given year. Call seeds_to_community_washtenaw__years first to get valid year values.",
      inputSchema: {
        type: "object" as const,
        properties: {
          year: { type: "number", description: "Catalog year (integer)" },
          ...PV_PROP,
        },
        required: ["year"],
      },
    },
    handler: async (args) =>
      apiGet("/seeds-to-community-washtenaw/seed-availability", {
        year: Number(args["year"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "seeds_to_community_washtenaw__years",
      description:
        "Returns the list of years for which Seeds to Community Washtenaw seed availability data is available.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/seeds-to-community-washtenaw/years", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "seeds_to_community_washtenaw__species_information",
      description:
        "Returns detailed species information for a single plant in the Seeds to Community Washtenaw dataset, looked up by botanical name. Includes availability across catalog years, seed collection notes, and any associated ecological data recorded by Seeds to Community Washtenaw.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Botanical (scientific) name of the species (e.g. Aquilegia canadensis)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/seeds-to-community-washtenaw/species-information", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },

  // ── lcscg ───────────────────────────────────────────────────────────────
  {
    tool: {
      name: "lcscg__guides",
      description:
        "Returns all 12 illustrated seed collection guides published by the Lake County Forest Preserve District Volunteer Stewardship Network, covering native plants of Lake County, Illinois organized by season and habitat. Includes guide IDs and titles.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/lcscg/guides", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "lcscg__guide",
      description:
        "Returns the full species list and details for one of the 12 Lake County Seed Collection Guides by guide ID. Requires a guide ID from lcscg__guides.",
      inputSchema: {
        type: "object" as const,
        properties: {
          guideId: { type: "number", description: "Guide ID (integer, e.g. 1271–1282)" },
          ...PV_PROP,
        },
        required: ["guideId"],
      },
    },
    handler: async (args) =>
      apiGet(`/lcscg/guide/${Number(args["guideId"])}`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "lcscg__species",
      description:
        "Searches the Lake County Seed Collection Guides for a plant by scientific name and returns matching records including harvest instructions, seed dispersal category, photo date, and Cloudinary image URLs.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Scientific or common name to search (partial match supported)" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/lcscg/species", {
        name: String(args["name"]),
        provenance_verbosity: pv(args),
      }),
  },

  // ── universal-fqa ───────────────────────────────────────────────────────
  {
    tool: {
      name: "universal_fqa__get_database_list",
      description:
        "Upstream: GET /get/database/. Returns the verbatim upstream response { status, data: unknown[][] } listing all regional FQA databases registered on universalfqa.org. See GET /universal-fqa/metadata (technical_details) for the row-position mapping.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/universal-fqa/get/database", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "universal_fqa__get_database",
      description:
        "Upstream: GET /get/database/{id}. Returns the verbatim upstream response { status, data: unknown[][] } for one FQA database by ID. See GET /universal-fqa/metadata (technical_details) for the row-position mapping.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "FQA database ID (integer)" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/universal-fqa/get/database/${Number(args["id"])}`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "universal_fqa__get_database_inventory",
      description:
        "Upstream: GET /get/database/{id}/inventory. Returns the verbatim upstream response { status, data: unknown[][] } listing all public site assessments for the specified FQA database. See GET /universal-fqa/metadata (technical_details) for the row-position mapping.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "FQA database ID (integer)" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/universal-fqa/get/database/${Number(args["id"])}/inventory`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "universal_fqa__get_inventory",
      description:
        "Upstream: GET /get/inventory/{id}. Returns the verbatim upstream response { status, data: unknown[][] } for one FQA site assessment by ID. See GET /universal-fqa/metadata (technical_details) for the row-position mapping.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "number", description: "FQA assessment ID (integer)" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/universal-fqa/get/inventory/${Number(args["id"])}`, {
        provenance_verbosity: pv(args),
      }),
  },

  // ── gobotany ────────────────────────────────────────────────────────────
  {
    tool: {
      name: "gobotany__url",
      description:
        "Returns the verified Go Botany species page URL for a plant by scientific name. Go Botany covers the vascular flora of New England with detailed identification keys, photos, and habitat information. Returns data.url when found.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/gobotany/url", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gobotany__species_information",
      description:
        "Fetches and returns the full scraped text from the Go Botany species page for a plant, organized into named sections (Facts, Habitat, Characteristics) in data.sections and concatenated in data.full_text. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Scrape status is reported in provenance.cache_status (hit=cached, miss=live scrape).",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/gobotany/species-information", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── google-images ────────────────────────────────────────────────────────
  {
    tool: {
      name: "google_images__search",
      description:
        "Returns a Google Images search result page URL for a plant species. Useful for quickly retrieving a visual reference or confirming plant identification through image search.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/google-images/search", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },

  // ── illinois-wildflowers ─────────────────────────────────────────────────
  {
    tool: {
      name: "illinois_wildflowers__url",
      description:
        "Returns the Illinois Wildflowers species page URL for a plant, linking to detailed descriptions, photos, and ecological notes focused on the Illinois flora. Returns data.results with url and section fields for each matching entry.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/illinois-wildflowers/url", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "illinois_wildflowers__species_information",
      description:
        "Fetches and returns the full scraped text from the Illinois Wildflowers species page for a plant, organized into named sections (Description, Faunal Associations, Photographic Location, etc.) in data.sections and concatenated in data.full_text. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Scrape status is reported in provenance.cache_status (hit=cached, miss=live scrape, bypass=species not in imported list).",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/illinois-wildflowers/species-information", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── lady-bird-johnson ────────────────────────────────────────────────────
  {
    tool: {
      name: "lady_bird_johnson__url",
      description:
        "Verifies whether a Lady Bird Johnson Wildflower Center species profile exists for a given USDA Plants symbol, and returns the direct verified profile URL when found. " +
        "The center maintains one of the most comprehensive databases of native plants of North America. " +
        "Input must be a USDA Plants symbol (e.g. TRGI for Trillium grandiflorum) — obtain the symbol via usda_plants__species first. " +
        "Verification uses HTTP GET with redirect:manual (200=found, 3xx=not_found). Results are cached for 90 days (found) or 30 days (not found). " +
        "Returns data.profile_url when found. Response follows the FERNS Response Envelope Contract v1.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usda_symbol: { type: "string", description: "USDA Plants symbol (e.g. TRGI for Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["usda_symbol"],
      },
    },
    handler: async (args) =>
      apiGet("/lady-bird-johnson/url", {
        usda_symbol: String(args["usda_symbol"]),
        provenance_verbosity: pv(args),
      }),
  },

  {
    tool: {
      name: "lady_bird_johnson__species_information",
      description:
        "Fetches and caches botanical prose text from the Lady Bird Johnson Wildflower Center species profile page identified by a USDA Plants symbol. " +
        "Returns data.sections (named prose blocks: Habit, Bloom Information, Uses, Propagation, etc.) and data.full_text (concatenated). " +
        "\"Find Seeds or Plants\" and \"Mr. Smarty Plants says\" sections are excluded. " +
        "First call fetches live; subsequent calls return cached text (permanent cache). " +
        "Use refresh=true to force a re-scrape. Returns found=false when the symbol is not found on the Wildflower Center site.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usda_symbol: { type: "string", description: "USDA Plants symbol (e.g. TRGI for Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "If true, bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["usda_symbol"],
      },
    },
    handler: async (args) =>
      apiGet("/lady-bird-johnson/species-information", {
        usda_symbol: String(args["usda_symbol"]),
        ...(args["refresh"] !== undefined ? { refresh: String(args["refresh"]) } : {}),
        provenance_verbosity: pv(args),
      }),
  },

  // ── minnesota-wildflowers ────────────────────────────────────────────────
  {
    tool: {
      name: "minnesota_wildflowers__url",
      description:
        "Returns the Minnesota Wildflowers species page URL for a plant, providing photos, bloom times, habitat information, and distribution within Minnesota. Returns data.url when found.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/minnesota-wildflowers/url", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "minnesota_wildflowers__species_information",
      description:
        "Fetches and returns the full scraped text from the Minnesota Wildflowers species page for a plant, including quick-facts table entries and prose sections, returned in data.sections and concatenated in data.full_text. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Scrape status is reported in provenance.cache_status (hit=cached, miss=live scrape, bypass=species not in imported list).",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/minnesota-wildflowers/species-information", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── missouri-plants ──────────────────────────────────────────────────────
  {
    tool: {
      name: "missouri_plants__url",
      description:
        "Returns the Missouri Plants species page URL for a plant, covering the flora of Missouri with photographs, descriptions, and habitat notes. Returns data.url when found.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/missouri-plants/url", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "missouri_plants__species_information",
      description:
        "Fetches and returns the full scraped text from the Missouri Plants species page for a plant, including description paragraphs and the stats block (Coefficient of Conservatism, Wetland Indicator, Missouri county occurrence count), returned in data.sections and concatenated in data.full_text. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Scrape status is reported in provenance.cache_status (hit=cached, miss=live scrape, bypass=species not in imported list).",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/missouri-plants/species-information", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── mnfi ─────────────────────────────────────────────────────────────────
  {
    tool: {
      name: "mnfi__communities_list",
      description:
        "Returns all 77 Michigan Natural Features Inventory (MNFI) natural community types, optionally filtered by ecological class, group, rank, or name. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          class: { type: "string", description: "Filter by community class (substring match, e.g. Terrestrial, Palustrine)" },
          group: { type: "string", description: "Filter by community group (substring match, e.g. Forest, Fen)" },
          rank:  { type: "string", description: "Filter by global or state rank (exact match, e.g. G2, S3)" },
          name:  { type: "string", description: "Filter by community name (substring match, e.g. oak savanna)" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/mnfi/communities", {
        class: args["class"] !== undefined ? String(args["class"]) : undefined,
        group: args["group"] !== undefined ? String(args["group"]) : undefined,
        rank:  args["rank"]  !== undefined ? String(args["rank"])  : undefined,
        name:  args["name"]  !== undefined ? String(args["name"])  : undefined,
      }),
  },
  {
    tool: {
      name: "mnfi__communities",
      description:
        "Returns the full MNFI natural community profile for a single community identified by its URL slug (e.g. prairie-fen). Includes ecological sections, characteristic plants, rare species, similar communities, and map links. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          slug: { type: "string", description: "URL slug of the MNFI community (e.g. prairie-fen, oak-openings)" },
        },
        required: ["slug"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/communities/${encodeURIComponent(String(args["slug"]))}`, {}),
  },
  {
    tool: {
      name: "mnfi__species_list",
      description:
        "Returns a paginated list of MNFI tracked rare species, optionally filtered by name, kind, status, rank, or category. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:     { type: "string", description: "Filter by scientific or common name (substring match)" },
          kind:     { type: "string", enum: ["plant", "animal"], description: "Filter by kind: plant or animal" },
          status:   { type: "string", description: "Filter by federal or state status code (exact match, e.g. LE, E, T)" },
          rank:     { type: "string", description: "Filter by global or state rank (exact match, e.g. G1, S2)" },
          category: { type: "string", description: "Filter by species category (substring match, e.g. Flowering Plants)" },
          limit:    { type: "number", description: "Page size (default 50, max 200)" },
          offset:   { type: "number", description: "Page offset (default 0)" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/mnfi/species", {
        name:     args["name"]     !== undefined ? String(args["name"])     : undefined,
        kind:     args["kind"]     !== undefined ? String(args["kind"])     : undefined,
        status:   args["status"]   !== undefined ? String(args["status"])   : undefined,
        rank:     args["rank"]     !== undefined ? String(args["rank"])     : undefined,
        category: args["category"] !== undefined ? String(args["category"]) : undefined,
        limit:    args["limit"]    !== undefined ? Number(args["limit"])    : undefined,
        offset:   args["offset"]   !== undefined ? Number(args["offset"])   : undefined,
      }),
  },
  {
    tool: {
      name: "mnfi__species",
      description:
        "Returns the rare species record for a single species by URL-encoded scientific name from the Michigan Natural Features Inventory. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Scientific name of the rare species (e.g. Cirsium pitcheri)" },
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/species/${encodeURIComponent(String(args["name"]))}`, {}),
  },
  {
    tool: {
      name: "mnfi__species_communities",
      description:
        "Returns the MNFI natural community stubs for all communities whose rare-species list includes the given species (by scientific name). See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Scientific name of the rare species (e.g. Cirsium pitcheri)" },
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/species/${encodeURIComponent(String(args["name"]))}/communities`, {}),
  },
  {
    tool: {
      name: "mnfi__species_counties",
      description:
        "Returns the Michigan county names where the given rare species has been recorded in the MNFI county element data. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: { type: "string", description: "Scientific name of the rare species (e.g. Cirsium pitcheri)" },
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/species/${encodeURIComponent(String(args["name"]))}/counties`, {}),
  },
  {
    tool: {
      name: "mnfi__counties_list",
      description:
        "Returns the canonical authoritative list of all 83 Michigan counties from the Michigan Natural Features Inventory. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async (_args) =>
      apiGet("/mnfi/counties", {}),
  },
  {
    tool: {
      name: "mnfi__counties",
      description:
        "Returns all tracked rare species and natural community occurrences for a given Michigan county from the Michigan Natural Features Inventory, optionally filtered by kind, status, or category. See GET /api/mnfi/metadata for field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          county:   { type: "string", description: "Michigan county name (e.g. Washtenaw). Case-insensitive." },
          kind:     { type: "string", enum: ["plant", "animal"], description: "Filter species by kind: plant or animal" },
          status:   { type: "string", description: "Filter by conservation status code (exact match, e.g. LE, E, T)" },
          category: { type: "string", description: "Filter by species category (substring match, e.g. Flowering Plants)" },
        },
        required: ["county"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/counties/${encodeURIComponent(String(args["county"]))}`, {
        kind:     args["kind"]     !== undefined ? String(args["kind"])     : undefined,
        status:   args["status"]   !== undefined ? String(args["status"])   : undefined,
        category: args["category"] !== undefined ? String(args["category"]) : undefined,
      }),
  },

  // ── natureserve ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "natureserve__search",
      description:
        "Searches NatureServe Explorer using the general POST /api/data/search endpoint. " +
        "Accepts a recordType parameter to control what kind of records are returned. " +
        "recordType values: ECOSYSTEM (NatureServe ecological systems and community types — global rank, concept description, NatureServe Explorer link); " +
        "SPECIES (animal and plant species — use natureserve__species for richer per-species detail); " +
        "COMMUNITY (plant communities); GROUP (element groups); ASSOCIATION (plant associations). " +
        "Returns system/species name, global rank, US national rank, description, and NatureServe Explorer URL for each result.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q:          { type: "string", description: "Search text (e.g. 'oak savanna', 'tallgrass prairie', 'oak woodland')" },
          recordType: {
            type: "string",
            enum: ["ECOSYSTEM", "SPECIES", "COMMUNITY", "GROUP", "ASSOCIATION"],
            description: "Type of records to return (default: ECOSYSTEM). ECOSYSTEM returns ecological systems and community types with global/national ranks and concept descriptions.",
          },
          limit:   { type: "number", description: "Results per page (1–50, default 10)" },
          page:    { type: "number", description: "Zero-indexed page number (default 0)" },
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from NatureServe Explorer" },
          ...PV_PROP,
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/natureserve/search", {
        q:          String(args["q"]),
        recordType: args["recordType"] !== undefined ? String(args["recordType"]) : undefined,
        limit:      args["limit"]   !== undefined ? String(args["limit"])   : undefined,
        page:       args["page"]    !== undefined ? String(args["page"])    : undefined,
        refresh:    args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "natureserve__species_search",
      description:
        "Upstream: POST /api/data/speciesSearch. Returns the verbatim NatureServe Explorer speciesSearch response " +
        "({ resultsSummary: { totalResults, page, recordsPerPage }, results: [...] }) for a scientific name query. " +
        "Each result in results[] is a full NatureServe element record including uniqueId (e.g. ELEMENT_GLOBAL.2.12345), " +
        "scientific name, common name, global rank, national ranks, IUCN category, and federal status. " +
        "Use the uniqueId from results[] with natureserve__taxon to retrieve the full taxon detail record. " +
        "See GET /natureserve/metadata (technical_details) for complete field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name (e.g. Lobelia cardinalis)" },
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from NatureServe Explorer" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/natureserve/speciesSearch", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "natureserve__taxon",
      description:
        "Upstream: GET /api/data/taxon/{uniqueId}. Returns the full verbatim NatureServe Explorer taxon record " +
        "for a known uniqueId (e.g. ELEMENT_GLOBAL.2.12345). The taxon object includes scientificName, commonName, " +
        "elementGlobalId, globalStatus (grank, roundedGrank), elementNationals (nrank by nation and srank by subnation), " +
        "iucnStatus, usEsaListingStatus, citesAppendixStatus, cosewicStatus, and full taxonomic classification. " +
        "Obtain the uniqueId from the results[] array returned by natureserve__species_search. " +
        "See GET /natureserve/metadata (technical_details) for complete field semantics.",
      inputSchema: {
        type: "object" as const,
        properties: {
          uniqueId: { type: "string", description: "Full NatureServe uniqueId, e.g. ELEMENT_GLOBAL.2.12345 — obtain from results of natureserve__species_search" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from NatureServe Explorer" },
        },
        required: ["uniqueId"],
      },
    },
    handler: async (args) =>
      apiGet(`/natureserve/taxon/${String(args["uniqueId"])}`, {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
      }),
  },
  // ── prairie-moon ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "prairie_moon__url",
      description:
        "Returns the Prairie Moon Nursery product page URL for a species. Prairie Moon is a leading native plant nursery specializing in prairie and woodland species. Returns data.url when found.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/prairie-moon/url", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "prairie_moon__species_information",
      description:
        "Fetches and returns the full scraped ecological text from the Prairie Moon Nursery species page for a plant, including the product description and growing attributes (Sun, Soil, Moisture, Bloom Color, Bloom Time, Height, Plant Spacing, etc.), returned in data.sections and concatenated in data.full_text. Commerce fields (price, SKU, availability) are filtered out. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Scrape status is reported in provenance.cache_status (hit=cached, miss=live scrape, bypass=species not in imported list).",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache and re-scrape the live page" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/prairie-moon/species-information", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── usda-plants ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "usda_plants__PlantSearch",
      description:
        "USDA PLANTS autocomplete — resolves a scientific name to a PLANTS symbol and returns the verbatim upstream array of { Text, Plant } objects. " +
        "`searchText` is the upstream's verbatim parameter name. " +
        "Each Plant object includes Symbol, ScientificName, CommonName, Rank, and other fields. " +
        "Use the Symbol from a matched result to call usda_plants__PlantProfile. " +
        "Results are not cached — each call hits the USDA PLANTS API directly.",
      inputSchema: {
        type: "object" as const,
        properties: {
          searchText: { type: "string", description: "Scientific name autocomplete text (e.g. Asclepias tuberosa). Verbatim upstream parameter name." },
          refresh: { type: "boolean", description: "Bypass cache and fetch fresh (default false)" },
          ...PV_PROP,
        },
        required: ["searchText"],
      },
    },
    handler: async (args) =>
      apiGet(`/usda-plants/PlantSearch?searchText=${encodeURIComponent(String(args["searchText"]))}`, {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "usda_plants__PlantProfile",
      description:
        "Returns the full USDA PLANTS profile for a known USDA symbol (e.g. ASTU for Asclepias tuberosa). " +
        "data is the verbatim upstream profile object with Id, Symbol, NativeStatuses, WetlandData, Synonyms, Ancestors, Characteristics, etc. as top-level keys — not nested under a profile key. " +
        "Use usda_plants__PlantSearch to resolve a scientific name to a symbol if the symbol is not already known. Profiles are cached 30 days.",
      inputSchema: {
        type: "object" as const,
        properties: {
          symbol: { type: "string", description: "USDA PLANTS symbol (e.g. ASTU)" },
          refresh: { type: "boolean", description: "Bypass cache and fetch fresh (default false)" },
          ...PV_PROP,
        },
        required: ["symbol"],
      },
    },
    handler: async (args) =>
      apiGet("/usda-plants/PlantProfile", {
        symbol: String(args["symbol"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "usda_plants__plants_search_results",
      description:
        "Paginated USDA PLANTS search. FERNS exposes this as GET; the upstream is POST /plants-search-results. " +
        "Parameter names `Text`, `Field`, and `pageNumber` match the upstream POST body field names. " +
        "data is the verbatim upstream response: PlantResults array, TotalResults integer, FilterOptions object.",
      inputSchema: {
        type: "object" as const,
        properties: {
          Text: { type: "string", description: "Search text (upstream POST body field name)" },
          Field: {
            type: "string",
            enum: ["Scientific Name", "Common Name", "Symbol", "Family"],
            description: "Field to search (upstream POST body field name)",
          },
          pageNumber: { type: "integer", minimum: 1, description: "1-based page number (upstream POST body field name)" },
          ...PV_PROP,
        },
        required: ["Text", "Field"],
      },
    },
    handler: async (args) =>
      apiGet("/usda-plants/plants-search-results", {
        Text: String(args["Text"]),
        Field: String(args["Field"]),
        pageNumber: args["pageNumber"] !== undefined ? String(Number(args["pageNumber"] ?? 1)) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── registry (meta) ──────────────────────────────────────────────────────
  {
    tool: {
      name: "registry__list_sources",
      description:
        "Returns the full registry of all Ecological Commons data sources with each source's ID, display name, description, capabilities, and current status. Use this to discover what sources are available.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => apiGet("/v1/sources"),
  },
  {
    tool: {
      name: "registry__source_relationships",
      description:
        "Returns the relationship graph between Ecological Commons data sources, optionally filtered to a specific source. Shows how sources overlap, complement, or supersede each other.",
      inputSchema: {
        type: "object" as const,
        properties: {
          source_id: { type: "string", description: "Filter relationships to a specific source ID (e.g. gbif)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/v1/source-relationships", {
        source_id: args["source_id"] !== undefined ? String(args["source_id"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── trust groups ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "registry__trust_groups",
      description:
        "Returns all FERNS trust groups. Each trust group is a curated collection of data sources organized into named, ordered tiers (e.g. Primary, Secondary, Tertiary). Trust groups let consumers define which sources they consider authoritative and in what priority order. Use registry__trust_group_sources to retrieve the full tiered source list for a specific group.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => apiGet("/v1/trust-groups"),
  },
  {
    tool: {
      name: "registry__trust_group_sources",
      description:
        "Returns the complete tiered source list for a specific trust group, identified by its slug. Each tier contains an ordered array of FERNS source entries identical in shape to those returned by registry__list_sources. Tiers are ordered by position (lowest = highest trust). Use this to resolve which sources to query — and in what priority — for a given trust context.",
      inputSchema: {
        type: "object" as const,
        properties: {
          slug: { type: "string", description: "Trust group slug (e.g. default, research-partners)" },
        },
        required: ["slug"],
      },
    },
    handler: async (args) =>
      apiGet(`/v1/trust-groups/${String(args["slug"])}/sources`),
  },

  // ── ann-arbor-npn ────────────────────────────────────────────────────────
  {
    tool: {
      name: "ann_arbor_npn__species",
      description:
        "Looks up a single species from the Ann Arbor Native Plant Nursery (nativeplant.com) database, " +
        "operated by Greg Vaclavek. Accepts any name flavor — acronym (e.g. ANDCAN), Latin name, " +
        "Latin synonym, or any common name — and resolves via an in-memory alias index. " +
        "Returns ecological attributes (light, moisture, height, flowering time, habitat), " +
        "Michigan range, nursery pricing/sizes, and Cloudinary image URLs with captions and kind (photograph/drawing). " +
        "Data is a static snapshot captured 2026-06-01; sourceKind is in-memory. " +
        "Response follows the FERNS Response Envelope Contract v1.",
      inputSchema: {
        type: "object" as const,
        properties: {
          key: {
            type: "string",
            description:
              "Any name form: acronym (e.g. ANDCAN), Latin name (e.g. Andropogon canadensis), " +
              "Latin synonym, or common name (e.g. Big Bluestem). Case-insensitive.",
          },
          ...PV_PROP,
        },
        required: ["key"],
      },
    },
    handler: async (args) =>
      apiGet(`/ann-arbor-npn/species/${encodeURIComponent(String(args["key"]))}`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "ann_arbor_npn__species_list",
      description:
        "Returns the complete list of all 130 Michigan native plant species in the Ann Arbor Native Plant Nursery " +
        "(nativeplant.com) database. Each record includes acronym, Latin name, common name, ecological attributes, " +
        "Michigan range, nursery pricing, and Cloudinary image URLs. " +
        "Data is a static in-memory snapshot captured 2026-06-01. " +
        "Use this for bulk queries, browsing, or cross-source reconciliation. " +
        "Response follows the FERNS Response Envelope Contract v1.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
      },
    },
    handler: async (args) =>
      apiGet("/ann-arbor-npn/species-list", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "ann_arbor_npn__species_source_url",
      description:
        "Returns the per-species nativeplant.com URL for a species identified by any name flavor " +
        "(acronym, Latin name, synonym, or common name). Returns 404 when the key is not found. " +
        "Data is a static in-memory snapshot. Response follows the FERNS Response Envelope Contract v1.",
      inputSchema: {
        type: "object" as const,
        properties: {
          key: {
            type: "string",
            description:
              "Any name form: acronym, Latin name, Latin synonym, or common name. Case-insensitive.",
          },
          ...PV_PROP,
        },
        required: ["key"],
      },
    },
    handler: async (args) =>
      apiGet(`/ann-arbor-npn/species/${encodeURIComponent(String(args["key"]))}/source-url`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "ann_arbor_npn__name_groups",
      description:
        "Returns all 130 NPN species as name groups, each with an all_accepted_keys array listing " +
        "every lowercase alias that resolves to that species (acronym, Latin name, synonym, common names). " +
        "Use for cross-source name reconciliation or to discover all aliases for a species. " +
        "Data is a static in-memory snapshot captured 2026-06-01. " +
        "Response follows the FERNS Response Envelope Contract v1.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
      },
    },
    handler: async (args) =>
      apiGet("/ann-arbor-npn/name-groups", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "ann_arbor_npn__documentation",
      description:
        "Returns the full source documentation for the Ann Arbor NPN dataset as Markdown in data.markdown. " +
        "Covers Greg Vaclavek's background, dataset contents, field descriptions, Michigan range vocabulary " +
        "(SE/SW/NL/UP), alias index construction, Cloudinary image storage, and the migration from " +
        "DB-backed scrape to static in-memory snapshot. Always returns found=true.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
      },
    },
    handler: async (args) =>
      apiGet("/ann-arbor-npn/documentation", {
        provenance_verbosity: pv(args),
      }),
  },
];

  const toolMap = new Map<string, ToolHandler>(tools.map((t) => [t.tool.name, t.handler]));

  export function createMcpServer(): Server {
    const server = new Server(
      { name: "ecological-commons", version: "1.0.0" },
      { capabilities: { tools: {} } },
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: tools.map((t) => t.tool),
    }));

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args = {} } = request.params;
      const handler = toolMap.get(name);
      if (!handler) {
        return {
          content: [{ type: "text" as const, text: `Unknown tool: ${name}` }],
          isError: true,
        };
      }
      try {
        const result = await handler(args as Record<string, unknown>);
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          content: [{ type: "text" as const, text: `Error: ${message}` }],
          isError: true,
        };
      }
    });

    return server;
  }
