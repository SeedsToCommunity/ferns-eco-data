export const USDA_PLANTS_SOURCE_ID = "usda-plants";

export const USDA_PLANTS_PERMISSION_GRANTED = true;

export const USDA_PLANTS_PERMISSION_STATUS =
  "OPEN — USDA PLANTS Database (plants.usda.gov) is a public-domain government resource maintained by the " +
  "USDA Natural Resources Conservation Service (NRCS). " +
  "No authentication or API key is required. " +
  "FERNS constructs a search URL from the scientific name; no USDA data is stored locally.";

export const USDA_PLANTS_GENERAL_SUMMARY =
  "Authoritative federal plant taxonomy and occurrence database, maintained by the USDA Natural Resources " +
  "Conservation Service (NRCS) at plants.usda.gov. " +
  "Data type: species profile pages with taxonomy, synonyms, state-level occurrence data, Wetland Indicator " +
  "Status, legal status, and related resources; covers vascular plants, mosses, liverworts, hornworts, " +
  "and lichens in the United States and its territories. " +
  "Geographic scope: US and territories; taxonomic scope: all land plants. " +
  "FERNS constructs a search URL from the scientific name — " +
  "plants.usda.gov/home/basicSearchResults?nameSearch={name} — no data is stored locally " +
  "and no HTTP validation is performed; USDA PLANTS accepts any query. " +
  "A query returns a search results URL; profile URLs require knowing the USDA symbol code " +
  "(e.g., ACRU for Acer rubrum), which cannot be derived from the scientific name without a lookup. " +
  "The search results page is JavaScript-rendered (React SPA) and requires a browser to display results. " +
  "Live — URLs are constructed at query time; the USDA PLANTS database is updated continuously by NRCS. " +
  "USDA PLANTS is the federal nomenclatural authority and overlaps in name coverage with GBIF and BONAP; " +
  "GBIF and BONAP both draw on USDA PLANTS-derived taxonomy, so name agreement across those FERNS services " +
  "is not independent corroboration — USDA PLANTS is the authoritative US government source.";

export const USDA_PLANTS_TECHNICAL_DETAILS =
  "Source: https://plants.usda.gov. Operated by USDA Natural Resources Conservation Service (NRCS). " +
  "URL construction: https://plants.usda.gov/home/basicSearchResults?nameSearch={URL-encoded scientific name} " +
  "where the scientific name is the exact binomial as provided. " +
  "Note: USDA PLANTS uses symbol-based profile URLs (e.g., ?symbol=ACRU for Acer rubrum); " +
  "the symbol cannot be derived from the scientific name without a lookup. " +
  "FERNS therefore returns a search results URL rather than a direct profile URL. " +
  "Method: direct_construction (no HTTP validation — search URL always valid). " +
  "The search results page is JavaScript-rendered (React SPA); " +
  "the returned URL requires a browser to display results.";

export const USDA_PLANTS_REGISTRY_ENTRY = {
  source_id: USDA_PLANTS_SOURCE_ID,
  name: "USDA PLANTS Database — Federal Plant Taxonomy and Occurrence Reference",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Authoritative federal plant taxonomy and occurrence reference covering vascular plants, mosses, " +
    "liverworts, and lichens in the United States and territories, with state-level occurrence data, " +
    "Wetland Indicator Status, and legal status. FERNS constructs a search URL from the scientific name — " +
    "always valid, returns a search results page rather than a direct species profile.",
  input_summary: "Scientific name (binomial or trinomial)",
  output_summary:
    "USDA PLANTS search results URL for the queried scientific name",
  dependencies: [] as string[],
  update_frequency:
    "Live — URLs are constructed at query time. The USDA PLANTS database is updated continuously by NRCS.",
  known_limitations:
    "Returns a search results page URL, not a direct species profile URL (profile URLs require the USDA symbol). " +
    "The search results page is JavaScript-rendered; requires a browser. " +
    "Synonyms may produce multiple search results; accepted name preferred for best results.",
  metadata_url: "/api/usda-plants/metadata",
  explorer_url: "/source/usda-plants",
  permission_granted: USDA_PLANTS_PERMISSION_GRANTED,
  permission_status: USDA_PLANTS_PERMISSION_STATUS,
  general_summary: USDA_PLANTS_GENERAL_SUMMARY,
  technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
};
