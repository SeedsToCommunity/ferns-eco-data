export const USDA_PLANTS_SOURCE_ID = "usda-plants";

export const USDA_PLANTS_PERMISSION_GRANTED = true;

export const USDA_PLANTS_PERMISSION_STATUS =
  "OPEN — USDA PLANTS Database (plants.usda.gov) is a public-domain government resource maintained by the " +
  "USDA Natural Resources Conservation Service (NRCS). " +
  "No authentication or API key is required. " +
  "FERNS constructs a search URL from the scientific name; no USDA data is stored locally.";

export const USDA_PLANTS_GENERAL_SUMMARY =
  "The USDA PLANTS Database (plants.usda.gov) is the authoritative federal reference for plant taxonomy, " +
  "nomenclature, and occurrence in the United States and its territories. " +
  "Maintained by the USDA Natural Resources Conservation Service (NRCS), it covers vascular plants, " +
  "mosses, liverworts, hornworts, and lichens. " +
  "Each species has a profile page (identified by a short USDA symbol code) with taxonomy, synonyms, " +
  "state-level occurrence data, Wetland Indicator Status, legal status, and related resources. " +
  "FERNS constructs a search URL for any scientific name: " +
  "plants.usda.gov/home/basicSearchResults?nameSearch={species name}. " +
  "This URL is always valid — USDA PLANTS accepts any query — but requires JavaScript to render results. " +
  "The URL is returned without HTTP validation.";

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
    "Authoritative federal reference for plant taxonomy, nomenclature, and state-level occurrence data, " +
    "maintained by the USDA Natural Resources Conservation Service (plants.usda.gov). " +
    "Covers vascular plants, mosses, liverworts, and lichens in the United States and territories. " +
    "FERNS constructs a search URL from the scientific name — always valid but returns a search results page " +
    "rather than a direct species profile (profile URLs require knowing the USDA symbol code).",
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
};
