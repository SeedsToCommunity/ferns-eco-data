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
        "Returns county-level distribution data for a vascular plant from the BONAP North American Plant Atlas, based on nearly four million verified herbarium specimens. Shows native, exotic, absent, and rare status for every county across North America.",
      inputSchema: {
        type: "object" as const,
        properties: {
          genus:      { type: "string", description: "Genus name (e.g. Trillium)" },
          species:    { type: "string", description: "Specific epithet (e.g. grandiflorum)" },
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
      name: "gbif__species_synonyms",
      description:
        "Returns all taxonomic synonyms for a GBIF taxon identified by its usage key. A synonym is a name that was once considered valid but is now superseded by the accepted name. Response mirrors the GBIF upstream envelope: offset, limit, endOfRecords, count, results. Use gbif__match first to resolve a scientific name to a usageKey.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF usage key (integer)" },
          limit:    { type: "number", description: "Number of results to return (1–1000, default 100)" },
          offset:   { type: "number", description: "Zero-based offset for pagination (default 0)" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
          ...PV_PROP,
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet(`/gbif/species/${Number(args["usageKey"])}/synonyms`, {
        limit:    args["limit"]   !== undefined ? String(args["limit"])   : undefined,
        offset:   args["offset"]  !== undefined ? String(args["offset"])  : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gbif__species_vernacular_names",
      description:
        "Returns all vernacular (common) names for a GBIF taxon identified by its usage key, across all languages and countries in the GBIF backbone. Response mirrors the GBIF upstream envelope: offset, limit, endOfRecords, count, results. vernacular_name_primary is a FERNS convenience field with the first English name. Use gbif__match first to resolve a scientific name to a usageKey.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF usage key (integer)" },
          limit:    { type: "number", description: "Number of results to return (1–1000, default 100)" },
          offset:   { type: "number", description: "Zero-based offset for pagination (default 0)" },
          refresh:  { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
          ...PV_PROP,
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet(`/gbif/species/${Number(args["usageKey"])}/vernacularNames`, {
        limit:    args["limit"]   !== undefined ? String(args["limit"])   : undefined,
        offset:   args["offset"]  !== undefined ? String(args["offset"])  : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gbif__match",
      description:
        "Matches a scientific name string to the GBIF taxonomic backbone, returning the accepted usage key, rank, confidence score, and synonym chain. Use this first to resolve a name before calling occurrence or reconcile endpoints.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name to match (e.g. Quercus alba)" },
          refresh: { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/species/match", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gbif__occurrences",
      description:
        "Returns aggregated occurrence counts for a GBIF taxon broken down by country, continent, or bounding box. Useful for understanding where a species has been documented globally.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey:  { type: "number", description: "GBIF usage key (integer)" },
          countries: { type: "string", description: "Comma-separated ISO 3166-1 alpha-2 country codes (e.g. US,CA)" },
          continent: { type: "string", enum: ["AFRICA","ANTARCTICA","ASIA","EUROPE","NORTH_AMERICA","OCEANIA","SOUTH_AMERICA"], description: "Continent filter (mutually exclusive with countries and bbox)" },
          bbox:      { type: "string", description: "Bounding box as minLat,minLon,maxLat,maxLon (mutually exclusive with countries and continent)" },
          refresh:   { type: "boolean", description: "Bypass cache and re-fetch from GBIF" },
          ...PV_PROP,
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/occurrence/search", {
        usageKey:  Number(args["usageKey"]),
        countries: args["countries"] !== undefined ? String(args["countries"]) : undefined,
        continent: args["continent"] !== undefined ? String(args["continent"]) : undefined,
        bbox:      args["bbox"] !== undefined ? String(args["bbox"]) : undefined,
        refresh:   args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gbif__search",
      description:
        "Full-text search across the GBIF species index. Returns matching taxa with usage keys that can be passed to gbif__occurrences or gbif__reconcile.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q: { type: "string", description: "Search query (scientific or common name)" },
          ...PV_PROP,
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/species/search", {
        q: String(args["q"]),
        provenance_verbosity: pv(args),
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
          place_id:     { type: "number",  description: "iNaturalist place ID (integer)" },
          quality_grade:{ type: "string",  description: "research | needs_id | casual" },
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
        place_id:      args["place_id"]      !== undefined ? Number(args["place_id"])   : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
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
          place_id:          { type: "number",  description: "iNaturalist place ID to filter by" },
          quality_grade:     { type: "string",  description: "research | needs_id | casual" },
          iconic_taxon_name: { type: "string",  description: "Iconic taxon group: Plantae, Aves, Fungi, Mammalia, Reptilia, Amphibia, Actinopterygii, Mollusca, Arachnida, Insecta, Animalia" },
          native:            { type: "boolean", description: "Only native taxa" },
          introduced:        { type: "boolean", description: "Only introduced taxa" },
          term_id:           { type: "number",  description: "Controlled annotation term ID (e.g. 12 for Flowers and Fruits)" },
          term_value_id:     { type: "number",  description: "Controlled annotation value ID. Requires term_id." },
          month:             { type: "string",  description: "Comma-separated month numbers (e.g. 4,5,6 for Apr–Jun)" },
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
        place_id:          args["place_id"]          !== undefined ? Number(args["place_id"])          : undefined,
        quality_grade:     args["quality_grade"]     !== undefined ? String(args["quality_grade"])     : undefined,
        iconic_taxon_name: args["iconic_taxon_name"] !== undefined ? String(args["iconic_taxon_name"]) : undefined,
        native:            args["native"]            !== undefined ? String(args["native"])            : undefined,
        introduced:        args["introduced"]        !== undefined ? String(args["introduced"])        : undefined,
        term_id:           args["term_id"]           !== undefined ? Number(args["term_id"])           : undefined,
        term_value_id:     args["term_value_id"]     !== undefined ? Number(args["term_value_id"])     : undefined,
        month:             args["month"]             !== undefined ? String(args["month"])             : undefined,
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
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/controlled_terms/for_taxon", {
        taxon_id: Number(args["taxon_id"]),
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
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
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/taxa/${Number(args["id"])}`, {
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/places/${Number(args["id"])}`, {
        admin_level: args["admin_level"] !== undefined ? Number(args["admin_level"]) : undefined,
        refresh:     args["refresh"]     !== undefined ? String(args["refresh"])     : undefined,
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
        },
        required: ["observation_id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/observations/${Number(args["observation_id"])}/taxon_summary`, {
        provenance_verbosity: pv(args),
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
          place_id:      { type: "number",  description: "iNaturalist place ID to filter by" },
          quality_grade: { type: "string",  description: "research | needs_id | casual" },
          lat:           { type: "number",  description: "Center latitude for radius filter" },
          lng:           { type: "number",  description: "Center longitude for radius filter" },
          radius:        { type: "number",  description: "Radius in km" },
          nelat:         { type: "number",  description: "Bounding box NE latitude" },
          nelng:         { type: "number",  description: "Bounding box NE longitude" },
          swlat:         { type: "number",  description: "Bounding box SW latitude" },
          swlng:         { type: "number",  description: "Bounding box SW longitude" },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/similar_species", {
        taxon_id:      Number(args["taxon_id"]),
        place_id:      args["place_id"]      !== undefined ? Number(args["place_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        lat:           args["lat"]           !== undefined ? Number(args["lat"])           : undefined,
        lng:           args["lng"]           !== undefined ? Number(args["lng"])           : undefined,
        radius:        args["radius"]        !== undefined ? Number(args["radius"])        : undefined,
        nelat:         args["nelat"]         !== undefined ? Number(args["nelat"])         : undefined,
        nelng:         args["nelng"]         !== undefined ? Number(args["nelng"])         : undefined,
        swlat:         args["swlat"]         !== undefined ? Number(args["swlat"])         : undefined,
        swlng:         args["swlng"]         !== undefined ? Number(args["swlng"])         : undefined,
        provenance_verbosity: pv(args),
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
          place_id:      { type: "number",  description: "iNaturalist place ID to filter by" },
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
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/species_counts", {
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        place_id:      args["place_id"]      !== undefined ? Number(args["place_id"])      : undefined,
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
        provenance_verbosity: pv(args),
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
          place_id:      { type: "number", description: "iNaturalist place ID" },
          taxon_id:      { type: "number", description: "Filter to a specific taxon and its children" },
          quality_grade: { type: "string", description: "research | needs_id | casual" },
          per_page:      { type: "number", description: "Results per page" },
          page:          { type: "number", description: "Page number, 1-indexed" },
          d1:            { type: "string", description: "Start date filter (YYYY-MM-DD)" },
          d2:            { type: "string", description: "End date filter (YYYY-MM-DD)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications/recent_taxa", {
        place_id:      args["place_id"]      !== undefined ? Number(args["place_id"])      : undefined,
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        quality_grade: args["quality_grade"] !== undefined ? String(args["quality_grade"]) : undefined,
        per_page:      args["per_page"]      !== undefined ? Number(args["per_page"])      : undefined,
        page:          args["page"]          !== undefined ? Number(args["page"])          : undefined,
        d1:            args["d1"]            !== undefined ? String(args["d1"])            : undefined,
        d2:            args["d2"]            !== undefined ? String(args["d2"])            : undefined,
        provenance_verbosity: pv(args),
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
          place_id:      { type: "number",  description: "iNaturalist place ID" },
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
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/identifications", {
        taxon_id:      args["taxon_id"]      !== undefined ? Number(args["taxon_id"])      : undefined,
        place_id:      args["place_id"]      !== undefined ? Number(args["place_id"])      : undefined,
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
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/inat/identifications/${Number(args["id"])}`, {
        provenance_verbosity: pv(args),
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
          ...PV_PROP,
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
        provenance_verbosity: pv(args),
      }),
  },

  // ── michigan-flora ──────────────────────────────────────────────────────
  {
    tool: {
      name: "michigan_flora__counties",
      description:
        "Returns county-level occurrence records for a species within Michigan from the Michigan Flora database.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/locs_sp", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "michigan_flora__images",
      description:
        "Returns image URLs and metadata for a species from the Michigan Flora image collection.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/miflora/allimage_info", {
        name:    String(args["name"]),
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
      name: "coefficient_of_conservatism__all",
      description:
        "Returns all defined C-value records (0–10) with their labels and descriptions. The complete reference table for the coefficient of conservatism scale.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/coefficient-of-conservatism/all", {
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
      apiGet("/wetland-indicator", {
        code: String(args["code"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wetland_indicator_status__by_w_value",
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
      apiGet("/wetland-indicator/w", {
        value: String(args["value"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wetland_indicator_status__all",
      description:
        "Returns all five Wetland Indicator Status codes with their descriptions and corresponding W numeric values. The complete USDA NRCS wetland indicator reference table.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/wetland-indicator/all", {
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
      apiGet("/wucols", {
        code: String(args["code"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "wucols_water_use__all",
      description:
        "Returns all WUCOLS water-use classification codes with descriptions, covering High, Medium, Low, and Very Low categories.",
      inputSchema: {
        type: "object" as const,
        properties: { ...PV_PROP },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/wucols/all", {
        provenance_verbosity: pv(args),
      }),
  },

  // ── seeds-to-community-washtenaw ────────────────────────────────────────
  {
    tool: {
      name: "seeds_to_community_washtenaw__species",
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
      apiGet("/s2c", {
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
      apiGet("/s2c/years", {
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
      name: "universal_fqa__databases",
      description:
        "Returns all FQA databases registered in the Universal FQA Tool, each representing a regional C-value list.",
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
      name: "universal_fqa__database",
      description:
        "Returns the full details of a specific FQA database by ID, including metadata and the number of species it contains.",
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
      name: "universal_fqa__assessments",
      description:
        "Returns all FQA site assessments stored in a given FQA database.",
      inputSchema: {
        type: "object" as const,
        properties: {
          database_id: { type: "number", description: "FQA database ID (integer)" },
          ...PV_PROP,
        },
        required: ["database_id"],
      },
    },
    handler: async (args) =>
      apiGet(`/universal-fqa/get/database/${Number(args["database_id"])}/inventory`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "universal_fqa__assessment",
      description:
        "Returns the full details of a specific FQA assessment, including species list, FQI score, mean C-value, and site information.",
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
      name: "gobotany__species",
      description:
        "Returns the Go Botany species page URL and basic profile for a plant by scientific name. Go Botany covers the vascular flora of New England with detailed identification keys, photos, and habitat information.",
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
      apiGet("/gobotany", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gobotany__species_text",
      description:
        "Fetches and returns the full scraped text from the Go Botany species page for a plant, organized into named sections (Facts, Habitat, Characteristics). Results are cached after the first fetch; use refresh=true to force a live re-scrape. Returns cache_status (hit/miss/not_in_species_list) and scraped_at timestamp alongside the text content.",
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
      apiGet("/gobotany/species-text", {
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
      apiGet("/google-images", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },

  // ── illinois-wildflowers ─────────────────────────────────────────────────
  {
    tool: {
      name: "illinois_wildflowers__species",
      description:
        "Returns the Illinois Wildflowers species page URL for a plant, linking to detailed descriptions, photos, and ecological notes focused on the Illinois flora.",
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
      apiGet("/illinois-wildflowers", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "illinois_wildflowers__species_text",
      description:
        "Fetches and returns the full scraped text from the Illinois Wildflowers species page for a plant, organized into named sections (Description, Faunal Associations, Photographic Location, etc.). Results are cached after the first fetch; use refresh=true to force a live re-scrape. Returns cache_status (hit/miss/not_in_species_list) and scraped_at timestamp alongside the text content.",
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
      apiGet("/illinois-wildflowers/species-text", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── lady-bird-johnson ────────────────────────────────────────────────────
  {
    tool: {
      name: "lady_bird_johnson__symbol",
      description:
        "Verifies whether a Lady Bird Johnson Wildflower Center species profile exists for a given USDA Plants symbol, and returns the direct verified profile URL when found. " +
        "The center maintains one of the most comprehensive databases of native plants of North America. " +
        "Input must be a USDA Plants symbol (e.g. TRGI for Trillium grandiflorum) — obtain the symbol via usda_plants__name_match first. " +
        "Verification uses HTTP GET with redirect:manual (200=found, 3xx=not_found). Results are cached for 90 days (found) or 30 days (not found). " +
        "Response includes verified_at timestamp and cache_hit flag.",
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
      apiGet("/lady-bird-johnson", {
        usda_symbol: String(args["usda_symbol"]),
        provenance_verbosity: pv(args),
      }),
  },

  {
    tool: {
      name: "lady_bird_johnson__species_text",
      description:
        "Fetches and caches botanical prose text from the Lady Bird Johnson Wildflower Center species profile page identified by a USDA Plants symbol. " +
        "Sections extracted include all h3-delimited prose blocks (Habit, Bloom Information, Uses, Propagation, etc.); " +
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
      apiGet("/lady-bird-johnson/species-text", {
        usda_symbol: String(args["usda_symbol"]),
        ...(args["refresh"] !== undefined ? { refresh: String(args["refresh"]) } : {}),
        provenance_verbosity: pv(args),
      }),
  },

  // ── minnesota-wildflowers ────────────────────────────────────────────────
  {
    tool: {
      name: "minnesota_wildflowers__species",
      description:
        "Returns the Minnesota Wildflowers species page URL for a plant, providing photos, bloom times, habitat information, and distribution within Minnesota.",
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
      apiGet("/minnesota-wildflowers", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "minnesota_wildflowers__species_text",
      description:
        "Fetches and returns the full scraped text from the Minnesota Wildflowers species page for a plant, including quick-facts table entries and prose sections. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Returns cache_status (hit/miss/not_in_species_list) and scraped_at timestamp alongside the text content.",
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
      apiGet("/minnesota-wildflowers/species-text", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── missouri-plants ──────────────────────────────────────────────────────
  {
    tool: {
      name: "missouri_plants__species",
      description:
        "Returns the Missouri Plants species page URL for a plant, covering the flora of Missouri with photographs, descriptions, and habitat notes.",
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
      apiGet("/missouri-plants", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "missouri_plants__species_text",
      description:
        "Fetches and returns the full scraped text from the Missouri Plants species page for a plant, including description paragraphs and the stats block (Coefficient of Conservatism, Wetland Indicator, Missouri county occurrence count). Results are cached after the first fetch; use refresh=true to force a live re-scrape. Returns cache_status (hit/miss/not_in_species_list) and scraped_at timestamp alongside the text content.",
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
      apiGet("/missouri-plants/species-text", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── mnfi ─────────────────────────────────────────────────────────────────
  {
    tool: {
      name: "mnfi__communities",
      description:
        "Returns Michigan natural community types from the MNFI classification system, optionally filtered by ecological class, group, or name. Use this to discover natural community IDs for the other mnfi tools.",
      inputSchema: {
        type: "object" as const,
        properties: {
          class: { type: "string", description: "Ecological class filter (e.g. Upland)" },
          group: { type: "string", description: "Ecological group filter (e.g. Oak Openings)" },
          name:  { type: "string", description: "Community name filter (partial match)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/mnfi/communities", {
        class: args["class"] !== undefined ? String(args["class"]) : undefined,
        group: args["group"] !== undefined ? String(args["group"]) : undefined,
        name:  args["name"]  !== undefined ? String(args["name"])  : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "mnfi__community",
      description:
        "Returns the full MNFI natural community profile for a specific community by ID, including description, associated species, and disturbance regime.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "string", description: "MNFI community ID (e.g. A1)" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/communities/${encodeURIComponent(String(args["id"]))}`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "mnfi__community_plants",
      description:
        "Returns the list of plant species associated with a specific MNFI natural community, useful for understanding community composition.",
      inputSchema: {
        type: "object" as const,
        properties: {
          id: { type: "string", description: "MNFI community ID (e.g. A1)" },
          ...PV_PROP,
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      apiGet(`/mnfi/communities/${encodeURIComponent(String(args["id"]))}/plants`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "mnfi__county_elements",
      description:
        "Returns rare species and natural community element occurrences tracked by MNFI for a Michigan county, optionally filtered by element type.",
      inputSchema: {
        type: "object" as const,
        properties: {
          county: { type: "string", description: "Michigan county name (e.g. Washtenaw)" },
          type:   { type: "string", description: "Element type filter (e.g. plant, community)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/mnfi/county-elements", {
        county: args["county"] !== undefined ? String(args["county"]) : undefined,
        type:   args["type"]   !== undefined ? String(args["type"])   : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── natureserve ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "natureserve__species",
      description:
        "Returns NatureServe global (G-rank) and state (S-rank) conservation status for a species, optionally filtered to a specific US state. Ranks reflect the relative rarity and vulnerability of the species.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
          state:   { type: "string", description: "Two-letter US state code (e.g. MI)" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/natureserve/speciesSearch", {
        name:    String(args["name"]),
        state:   args["state"]   !== undefined ? String(args["state"])   : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  // ── prairie-moon ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "prairie_moon__species",
      description:
        "Returns the Prairie Moon Nursery catalog entry for a species, including availability status and a link to the product page. Prairie Moon is a leading native plant nursery specializing in prairie and woodland species.",
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
      apiGet("/prairie-moon", {
        species: String(args["species"]),
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "prairie_moon__species_text",
      description:
        "Fetches and returns the full scraped ecological text from the Prairie Moon Nursery species page for a plant, including the product description and growing attributes (Sun, Soil, Moisture, Bloom Color, Bloom Time, Height, Plant Spacing, etc.). Commerce fields (price, SKU, availability) are filtered out. Results are cached after the first fetch; use refresh=true to force a live re-scrape. Returns cache_status (hit/miss/not_in_species_list) and scraped_at timestamp alongside the text content.",
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
      apiGet("/prairie-moon/species-text", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── usda-plants ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "usda_plants__species",
      description:
        "Resolves a scientific name to a USDA symbol via the USDA PLANTS API and returns the full plant profile: symbol, canonical name, common name, rank, nativity status per US region (L48, AK, HI, PR, VI, CAN, etc.), taxonomy hierarchy, synonyms, wetland indicator data, legal statuses, and links to fact sheets and plant guides. Results are cached 30 days. Covers the complete vascular flora of the United States and territories.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Asclepias tuberosa)" },
          refresh: { type: "boolean", description: "Bypass cache and fetch fresh (default false)" },
          ...PV_PROP,
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      apiGet("/usda-plants/PlantSearch", {
        species: String(args["species"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "usda_plants__profile",
      description:
        "Returns the full USDA PLANTS profile for a known USDA symbol (e.g. ASTU for Asclepias tuberosa). Use this when the symbol is already known; use usda_plants__species to resolve a scientific name to a symbol first. Profiles are cached 30 days.",
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
      name: "usda_plants__search",
      description:
        "Searches the USDA PLANTS database with a text query. Supports searching by Scientific Name, Common Name, Symbol, or Family. Returns paginated results with symbol, scientific name, common name, family, and wetland/legal data. Search results are not cached.",
      inputSchema: {
        type: "object" as const,
        properties: {
          q: { type: "string", description: "Search text (e.g. Trillium, butterfly milkweed)" },
          field: {
            type: "string",
            description: "Field to search: Scientific Name (default), Common Name, Symbol, or Family",
          },
          page: { type: "number", description: "Page number (1-based, default 1)" },
          ...PV_PROP,
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      apiGet("/usda-plants/plants-search-results", {
        q: String(args["q"]),
        field: args["field"] !== undefined ? String(args["field"]) : undefined,
        page: args["page"] !== undefined ? String(args["page"]) : undefined,
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
        "Latin synonym, or any common name — and resolves via an internal alias index. " +
        "Returns ecological attributes (light, moisture, height, flowering time, habitat), " +
        "Michigan range, nursery pricing/sizes, and Cloudinary image URLs with captions and kind (photograph/drawing).",
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
        "Returns the complete list of all ~130 Michigan native plant species in the Ann Arbor Native Plant Nursery " +
        "(nativeplant.com) database. Each record includes acronym, Latin name, common name, ecological attributes, " +
        "Michigan range, nursery pricing, and Cloudinary image URLs. " +
        "Use this for bulk queries, browsing, or cross-source reconciliation.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
      },
    },
    handler: async (args) =>
      apiGet("/ann-arbor-npn/species", {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "ann_arbor_npn__names",
      description:
        "Returns all NPN species organized into name groups, each with an all_accepted_keys array listing " +
        "every name form that resolves to that species (acronym, Latin name, synonym, common names). " +
        "Use for cross-source name reconciliation or to discover all aliases for a species.",
      inputSchema: {
        type: "object" as const,
        properties: {
          ...PV_PROP,
        },
      },
    },
    handler: async (args) =>
      apiGet("/ann-arbor-npn/names", {
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
