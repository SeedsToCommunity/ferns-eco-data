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
      apiGet("/gbif/match", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "gbif__reconcile",
      description:
        "Returns the full GBIF taxonomic record for a known usageKey, including vernacular names, higher taxonomy, and usage status.",
      inputSchema: {
        type: "object" as const,
        properties: {
          usageKey: { type: "number", description: "GBIF usage key (integer)" },
          ...PV_PROP,
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      apiGet("/gbif/reconcile", {
        usageKey: Number(args["usageKey"]),
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
      apiGet("/gbif/occurrences", {
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
      apiGet("/gbif/search", {
        q: String(args["q"]),
        provenance_verbosity: pv(args),
      }),
  },

  // ── inaturalist ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "inaturalist__place",
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
      apiGet("/inat/place", {
        q:       String(args["q"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__species",
      description:
        "Returns the iNaturalist taxon record for a scientific name, including the taxon ID, common name, default photo, and observation count. Taxon IDs are required by the histogram and field-values tools.",
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
      apiGet("/inat/species", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__histogram",
      description:
        "Returns a monthly phenology histogram of iNaturalist observation counts for a taxon, optionally filtered by place. Useful for understanding seasonal bloom or activity patterns.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id: { type: "string", description: "Comma-separated iNaturalist place IDs to filter by" },
          refresh:  { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      apiGet("/inat/histogram", {
        taxon_id: Number(args["taxon_id"]),
        place_id: args["place_id"] !== undefined ? String(args["place_id"]) : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "inaturalist__field_values",
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
      apiGet("/inat/field-values", {
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
        "Returns a list of recent iNaturalist observations for a taxon and/or place, including observer, date, coordinates, and photos.",
      inputSchema: {
        type: "object" as const,
        properties: {
          taxon_id: { type: "number", description: "iNaturalist taxon ID (integer)" },
          place_id: { type: "number", description: "iNaturalist place ID (integer)" },
          ...PV_PROP,
        },
        required: [],
      },
    },
    handler: async (args) =>
      apiGet("/inat/observations", {
        taxon_id: args["taxon_id"] !== undefined ? Number(args["taxon_id"]) : undefined,
        place_id: args["place_id"] !== undefined ? Number(args["place_id"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },

  // ── michigan-flora ──────────────────────────────────────────────────────
  {
    tool: {
      name: "michigan_flora__species",
      description:
        "Returns the full Michigan Flora species profile for a vascular plant, including family, nativity, habitat notes, and a link to the species page.",
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
      apiGet("/miflora/species", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
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
      apiGet("/miflora/counties", {
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
      apiGet("/miflora/images", {
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
      apiGet("/universal-fqa/databases", {
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
      apiGet(`/universal-fqa/databases/${Number(args["id"])}`, {
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "universal_fqa__species",
      description:
        "Returns the C-value and FQA attributes for a species within a specific regional FQA database.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:        { type: "string", description: "Scientific name to look up" },
          database_id: { type: "number", description: "FQA database ID (integer)" },
          ...PV_PROP,
        },
        required: ["name", "database_id"],
      },
    },
    handler: async (args) =>
      apiGet("/universal-fqa/species", {
        name:        String(args["name"]),
        database_id: Number(args["database_id"]),
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
      apiGet("/universal-fqa/assessments", {
        database_id: Number(args["database_id"]),
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
      apiGet(`/universal-fqa/assessment/${Number(args["id"])}`, {
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
      apiGet("/natureserve/species", {
        name:    String(args["name"]),
        state:   args["state"]   !== undefined ? String(args["state"])   : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
        provenance_verbosity: pv(args),
      }),
  },
  {
    tool: {
      name: "natureserve__ecosystems",
      description:
        "Returns NatureServe ecological system records matching a name query, including classification codes, descriptions, and associated species assemblages.",
      inputSchema: {
        type: "object" as const,
        properties: {
          name:    { type: "string", description: "Ecosystem name query" },
          refresh: { type: "boolean", description: "Bypass cache" },
          ...PV_PROP,
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      apiGet("/natureserve/ecosystems", {
        name:    String(args["name"]),
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
      apiGet("/usda-plants", {
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
      apiGet("/usda-plants/profile", {
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
      apiGet("/usda-plants/search", {
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
