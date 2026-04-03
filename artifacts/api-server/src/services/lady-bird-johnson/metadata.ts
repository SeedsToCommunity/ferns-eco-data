export const LADY_BIRD_JOHNSON_SOURCE_ID = "lady-bird-johnson";

export const LADY_BIRD_JOHNSON_PERMISSION_GRANTED = true;

export const LADY_BIRD_JOHNSON_PERMISSION_STATUS =
  "OPEN — The Lady Bird Johnson Wildflower Center plant database (wildflower.org/plants) is a public reference " +
  "maintained by the Lady Bird Johnson Wildflower Center at The University of Texas at Austin. " +
  "No authentication or API key is required. " +
  "FERNS constructs a plant search URL from the scientific name; no data is stored locally.";

export const LADY_BIRD_JOHNSON_GENERAL_SUMMARY =
  "Comprehensive native plant database for North America, maintained by the Lady Bird Johnson Wildflower " +
  "Center at The University of Texas at Austin (wildflower.org/plants). " +
  "Data type: species profile pages for thousands of native North American species with habitat, bloom " +
  "time, growing conditions, regional suitability, wildlife value, and photographs. " +
  "Geographic scope: North America (emphasis on US natives; some naturalized non-natives included); " +
  "taxonomic scope: vascular plants. " +
  "FERNS constructs a plant search URL from genus and species — " +
  "wildflower.org/plants/search.php?search_field=genus&genus={Genus}&species={species} — " +
  "no data is stored locally and no HTTP validation is performed. " +
  "A query returns a search results URL, not a direct species profile URL; " +
  "profile URLs require knowing the Wildflower Center's internal plant ID code, which cannot be derived " +
  "from the scientific name without a lookup. The search URL is always valid. " +
  "Live — URLs are constructed at query time; the Wildflower Center database is updated by staff periodically. " +
  "Lady Bird Johnson Wildflower Center covers all North American natives at broad scope; " +
  "for regional-specialist references within FERNS, Go Botany (New England), Illinois Wildflowers " +
  "(Illinois), Minnesota Wildflowers (Minnesota), and Missouri Plants (Missouri) provide more locally " +
  "detailed coverage; USDA PLANTS provides the authoritative federal taxonomy across all US species.";

export const LADY_BIRD_JOHNSON_TECHNICAL_DETAILS =
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
    "Comprehensive native plant database for North America, covering thousands of species with habitat, " +
    "bloom time, growing conditions, regional suitability, and wildlife value. " +
    "FERNS constructs a plant search URL from the scientific name — always valid, returns a search results page " +
    "rather than a direct species profile.",
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
  permission_granted: LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
  permission_status: LADY_BIRD_JOHNSON_PERMISSION_STATUS,
  general_summary: LADY_BIRD_JOHNSON_GENERAL_SUMMARY,
  technical_details: LADY_BIRD_JOHNSON_TECHNICAL_DETAILS,
};
