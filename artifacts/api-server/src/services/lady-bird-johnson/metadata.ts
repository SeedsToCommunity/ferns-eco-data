export const LADY_BIRD_JOHNSON_SOURCE_ID = "lady-bird-johnson";

export const LADY_BIRD_JOHNSON_PERMISSION_GRANTED = true;

export const LADY_BIRD_JOHNSON_PERMISSION_STATUS =
  "OPEN — The Lady Bird Johnson Wildflower Center plant database (wildflower.org/plants) is a public reference " +
  "maintained by the Lady Bird Johnson Wildflower Center at The University of Texas at Austin. " +
  "No authentication or API key is required. " +
  "FERNS constructs a plant search URL from the scientific name; no data is stored locally.";

export const LADY_BIRD_JOHNSON_DERIVATION_SUMMARY =
  "The Lady Bird Johnson Wildflower Center Plant Database (wildflower.org/plants) is a comprehensive " +
  "reference for native plants of North America, maintained by the Lady Bird Johnson Wildflower Center " +
  "at The University of Texas at Austin. " +
  "It covers thousands of native species with information on habitat, bloom time, growing conditions, " +
  "regional suitability, wildlife value, and photographs. " +
  "FERNS constructs a plant search URL from the genus and species epithet: " +
  "wildflower.org/plants/search.php?search_field=genus&genus={Genus}&species={species}. " +
  "For single-word queries (genus only), a genus-only search is returned. " +
  "The URL is always valid but requires a browser and returns search results rather than a direct profile.";

export const LADY_BIRD_JOHNSON_DERIVATION_SCIENTIFIC =
  "Source: https://www.wildflower.org/plants/. " +
  "Operated by Lady Bird Johnson Wildflower Center, The University of Texas at Austin. " +
  "URL construction: " +
  "  Binomial: https://www.wildflower.org/plants/search.php?search_field=genus&genus={Genus}&species={species} " +
  "  Genus only: https://www.wildflower.org/plants/search.php?search_field=genus&genus={Genus} " +
  "Method: direct_construction (no HTTP validation — search URL always valid). " +
  "Note: The Wildflower Center uses its own plant ID codes for direct profile URLs (e.g., result.php?id_plant=ACRU2); " +
  "these codes cannot be derived from the scientific name without a lookup, so search URLs are returned instead. " +
  "Geographic scope: North American native plants (emphasis on US, including non-native naturalized species).";

export const LADY_BIRD_JOHNSON_REGISTRY_ENTRY = {
  source_id: LADY_BIRD_JOHNSON_SOURCE_ID,
  name: "Lady Bird Johnson Wildflower Center — Native Plants of North America",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Comprehensive native plant reference for North America, maintained by the Lady Bird Johnson Wildflower Center " +
    "at The University of Texas at Austin (wildflower.org/plants). " +
    "Covers habitat, bloom time, growing conditions, wildlife value, and regional suitability. " +
    "FERNS constructs a plant search URL from the scientific name — always valid, returns search results page.",
  input_summary: "Scientific name (genus + optional species epithet)",
  output_summary:
    "Lady Bird Johnson Wildflower Center plant search URL for the queried scientific name",
  dependencies: [] as string[],
  update_frequency:
    "Live — URLs are constructed at query time. The Wildflower Center database is updated by staff periodically.",
  known_limitations:
    "Returns a search results URL, not a direct species profile URL (profile URLs require an internal plant ID code). " +
    "Emphasis on North American natives; non-native species may not be indexed. " +
    "The search page may return multiple results for ambiguous queries.",
  metadata_url: "/api/lady-bird-johnson/metadata",
  explorer_url: "/source/lady-bird-johnson",
};
