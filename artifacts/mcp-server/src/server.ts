import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { fernsGet } from "./client.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

interface ToolDef {
  tool: Tool;
  handler: ToolHandler;
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
        },
        required: ["genus", "species"],
      },
    },
    handler: async (args) =>
      fernsGet("/bonap/map", {
        genus:    String(args["genus"]),
        species:  String(args["species"]),
        map_type: args["map_type"] !== undefined ? String(args["map_type"]) : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/gbif/match", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      fernsGet("/gbif/reconcile", { usageKey: Number(args["usageKey"]) }),
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
        },
        required: ["usageKey"],
      },
    },
    handler: async (args) =>
      fernsGet("/gbif/occurrences", {
        usageKey:  Number(args["usageKey"]),
        countries: args["countries"] !== undefined ? String(args["countries"]) : undefined,
        continent: args["continent"] !== undefined ? String(args["continent"]) : undefined,
        bbox:      args["bbox"] !== undefined ? String(args["bbox"]) : undefined,
        refresh:   args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      fernsGet("/gbif/search", { q: String(args["q"]) }),
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
        },
        required: ["q"],
      },
    },
    handler: async (args) =>
      fernsGet("/inat/place", {
        q:       String(args["q"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/inat/species", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      fernsGet("/inat/histogram", {
        taxon_id: Number(args["taxon_id"]),
        place_id: args["place_id"] !== undefined ? String(args["place_id"]) : undefined,
        refresh:  args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["taxon_id"],
      },
    },
    handler: async (args) =>
      fernsGet("/inat/field-values", {
        taxon_id:   Number(args["taxon_id"]),
        place_id:   args["place_id"] !== undefined ? String(args["place_id"]) : undefined,
        verifiable: args["verifiable"] !== undefined ? String(args["verifiable"]) : undefined,
        refresh:    args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: [],
      },
    },
    handler: async (args) =>
      fernsGet("/inat/observations", {
        taxon_id: args["taxon_id"] !== undefined ? Number(args["taxon_id"]) : undefined,
        place_id: args["place_id"] !== undefined ? Number(args["place_id"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/miflora/species", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/miflora/counties", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/miflora/images", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["value"],
      },
    },
    handler: async (args) =>
      fernsGet("/coefficient-of-conservatism", { value: String(args["value"]) }),
  },
  {
    tool: {
      name: "coefficient_of_conservatism__all",
      description:
        "Returns all defined C-value records (0–10) with their labels and descriptions. The complete reference table for the coefficient of conservatism scale.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/coefficient-of-conservatism/all"),
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
        },
        required: ["code"],
      },
    },
    handler: async (args) =>
      fernsGet("/wetland-indicator", { code: String(args["code"]) }),
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
        },
        required: ["value"],
      },
    },
    handler: async (args) =>
      fernsGet("/wetland-indicator/w", { value: String(args["value"]) }),
  },
  {
    tool: {
      name: "wetland_indicator_status__all",
      description:
        "Returns all five Wetland Indicator Status codes with their descriptions and corresponding W numeric values. The complete USDA NRCS wetland indicator reference table.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/wetland-indicator/all"),
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
        },
        required: ["code"],
      },
    },
    handler: async (args) =>
      fernsGet("/wucols", { code: String(args["code"]) }),
  },
  {
    tool: {
      name: "wucols_water_use__all",
      description:
        "Returns all WUCOLS water-use classification codes with descriptions, covering High, Medium, Low, and Very Low categories.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/wucols/all"),
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
        },
        required: ["year"],
      },
    },
    handler: async (args) =>
      fernsGet("/s2c", { year: Number(args["year"]) }),
  },
  {
    tool: {
      name: "seeds_to_community_washtenaw__years",
      description:
        "Returns the list of years for which Seeds to Community Washtenaw seed availability data is available.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/s2c/years"),
  },

  // ── lcscg ───────────────────────────────────────────────────────────────
  {
    tool: {
      name: "lcscg__guides",
      description:
        "Returns all 12 illustrated seed collection guides published by the Lake County Forest Preserve District Volunteer Stewardship Network, covering native plants of Lake County, Illinois organized by season and habitat. Includes guide IDs and titles.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/lcscg/guides"),
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
        },
        required: ["guideId"],
      },
    },
    handler: async (args) =>
      fernsGet(`/lcscg/guide/${Number(args["guideId"])}`),
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/lcscg/species", { name: String(args["name"]) }),
  },

  // ── universal-fqa ───────────────────────────────────────────────────────
  {
    tool: {
      name: "universal_fqa__databases",
      description:
        "Returns all FQA databases registered in the Universal FQA Tool, each representing a regional C-value list.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/universal-fqa/databases"),
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
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      fernsGet(`/universal-fqa/databases/${Number(args["id"])}`),
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
        },
        required: ["name", "database_id"],
      },
    },
    handler: async (args) =>
      fernsGet("/universal-fqa/species", {
        name:        String(args["name"]),
        database_id: Number(args["database_id"]),
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
        },
        required: ["database_id"],
      },
    },
    handler: async (args) =>
      fernsGet("/universal-fqa/assessments", { database_id: Number(args["database_id"]) }),
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
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      fernsGet(`/universal-fqa/assessment/${Number(args["id"])}`),
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/gobotany", { species: String(args["species"]) }),
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/google-images", { species: String(args["species"]) }),
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/illinois-wildflowers", { species: String(args["species"]) }),
  },

  // ── lady-bird-johnson ────────────────────────────────────────────────────
  {
    tool: {
      name: "lady_bird_johnson__species",
      description:
        "Returns the Lady Bird Johnson Wildflower Center species search URL for a plant. The center maintains one of the most comprehensive databases of native plants of North America.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/lady-bird-johnson", { species: String(args["species"]) }),
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/minnesota-wildflowers", { species: String(args["species"]) }),
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/missouri-plants", { species: String(args["species"]) }),
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
        },
        required: [],
      },
    },
    handler: async (args) =>
      fernsGet("/mnfi/communities", {
        class: args["class"] !== undefined ? String(args["class"]) : undefined,
        group: args["group"] !== undefined ? String(args["group"]) : undefined,
        name:  args["name"]  !== undefined ? String(args["name"])  : undefined,
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
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      fernsGet(`/mnfi/communities/${encodeURIComponent(String(args["id"]))}`),
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
        },
        required: ["id"],
      },
    },
    handler: async (args) =>
      fernsGet(`/mnfi/communities/${encodeURIComponent(String(args["id"]))}/plants`),
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
        },
        required: [],
      },
    },
    handler: async (args) =>
      fernsGet("/mnfi/county-elements", {
        county: args["county"] !== undefined ? String(args["county"]) : undefined,
        type:   args["type"]   !== undefined ? String(args["type"])   : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/natureserve/species", {
        name:    String(args["name"]),
        state:   args["state"]   !== undefined ? String(args["state"])   : undefined,
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["name"],
      },
    },
    handler: async (args) =>
      fernsGet("/natureserve/ecosystems", {
        name:    String(args["name"]),
        refresh: args["refresh"] !== undefined ? String(args["refresh"]) : undefined,
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
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/prairie-moon", { species: String(args["species"]) }),
  },

  // ── usda-plants ──────────────────────────────────────────────────────────
  {
    tool: {
      name: "usda_plants__species",
      description:
        "Returns the USDA Plants Database record for a species, including the USDA symbol, accepted name, nativity status, and a link to the full USDA Plants profile. Covers the complete vascular flora of the United States.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/usda-plants", { species: String(args["species"]) }),
  },

  // ── botanical-refs ───────────────────────────────────────────────────────
  {
    tool: {
      name: "botanical_refs__lookup",
      description:
        "Queries Go Botany, Google Images, Missouri Plants, Minnesota Wildflowers, Illinois Wildflowers, Prairie Moon, USDA Plants, and Lady Bird Johnson simultaneously for a species and returns each source's found status and URL in one response. A convenience shortcut when you want cross-site presence for a species without calling each source individually.",
      inputSchema: {
        type: "object" as const,
        properties: {
          species: { type: "string", description: "Scientific name (e.g. Trillium grandiflorum)" },
        },
        required: ["species"],
      },
    },
    handler: async (args) =>
      fernsGet("/botanical-refs", { species: String(args["species"]) }),
  },
  {
    tool: {
      name: "botanical_refs__sites",
      description:
        "Returns the list of botanical reference websites covered by the botanical-refs endpoint, with each site's ID, name, and strategy used to resolve species URLs.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/botanical-refs/sites"),
  },

  // ── ferns (meta) ─────────────────────────────────────────────────────────
  {
    tool: {
      name: "ferns__list_sources",
      description:
        "Returns the full registry of all FERNS data sources with each source's ID, display name, description, capabilities, and current status. Use this to discover what sources are available.",
      inputSchema: {
        type: "object" as const,
        properties: {},
        required: [],
      },
    },
    handler: async () => fernsGet("/v1/sources"),
  },
  {
    tool: {
      name: "ferns__source_relationships",
      description:
        "Returns the relationship graph between FERNS data sources, optionally filtered to a specific source. Shows how sources overlap, complement, or supersede each other.",
      inputSchema: {
        type: "object" as const,
        properties: {
          source_id: { type: "string", description: "Filter relationships to a specific source ID (e.g. gbif)" },
        },
        required: [],
      },
    },
    handler: async (args) =>
      fernsGet("/v1/source-relationships", {
        source_id: args["source_id"] !== undefined ? String(args["source_id"]) : undefined,
      }),
  },
];

  const toolMap = new Map<string, ToolHandler>(tools.map((t) => [t.tool.name, t.handler]));

  export function createMcpServer(): Server {
    const server = new Server(
      { name: "ferns-mcp", version: "1.0.0" },
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
  