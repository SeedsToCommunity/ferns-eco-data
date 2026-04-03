export const INAT_SOURCE_ID = "inaturalist";

export const INAT_API_BASE = "https://api.inaturalist.org/v1";

export const INAT_USER_AGENT = "FERNS/1.0";

export const INAT_REQUEST_TIMEOUT_MS = 30000;

export const INAT_PERMISSION_GRANTED = true;

export const INAT_PERMISSION_STATUS = "OPEN — No authentication required for read operations. Attribution required.";

export const INAT_ATTRIBUTION = {
  source_name: "iNaturalist",
  website: "https://www.inaturalist.org",
  license: "Varies by observation. Most research-grade observations: CC BY-NC or CC BY. See individual records for per-observation licensing.",
  citation:
    "iNaturalist contributors, iNaturalist (https://www.inaturalist.org). Accessed via iNaturalist API v1. Species descriptions from Wikipedia, retrieved through iNaturalist.",
  api_base_url: INAT_API_BASE,
};

export const INAT_GENERAL_SUMMARY =
  "Observation and species data from iNaturalist (inaturalist.org), a citizen science platform " +
  "operated jointly by the California Academy of Sciences and the National Geographic Society, " +
  "with over 200 million observations contributed by millions of users worldwide. " +
  "Data types: place ID lookup for geographic filtering; species appearance data including " +
  "representative photos, Wikipedia summaries, common names, conservation status, and native/introduced status; " +
  "and month-by-month phenology (what stage — flowering, budding, fruiting — a species is typically in) " +
  "derived from community-added annotations. " +
  "Geographic scope: global; taxonomic scope: all organisms (FERNS uses it for vascular plants). " +
  "iNaturalist maintains its own taxonomic backbone independently of GBIF, BONAP, and Michigan Flora — " +
  "name divergence across FERNS sources is expected. " +
  "All data accessed through the iNaturalist v1 REST API and cached per species; " +
  "place IDs are cached permanently, species appearance for 30 days, phenology for 7 days. " +
  "A species query returns photos, Wikipedia description, common names, conservation status, native status, " +
  "global observation count, and month-by-month phenological stage breakdowns. " +
  "Phenological annotation coverage is uneven — many species have sparse or no stage annotations. " +
  "iNaturalist research-grade observations are published to GBIF — occurrence counts from FERNS's iNaturalist " +
  "and GBIF services therefore overlap; treat them as complementary views, not independent datasets.";

export const INAT_TECHNICAL_DETAILS =
  "Source: iNaturalist (https://api.inaturalist.org/v1). " +
  "Place lookup: GET /places/autocomplete — returns iNaturalist place IDs from US Census TIGER and similar boundaries. " +
  "Species appearance: two-step fetch via GET /taxa?q={name}&rank=species then GET /taxa/{id}. " +
  "iNaturalist maintains its own taxonomic backbone independently of GBIF, BONAP, and Michigan Flora. " +
  "Name divergence across sources is expected and should not be treated as error. " +
  "Phenology: GET /observations/histogram (interval=month_of_year) for total counts by month, " +
  "and GET /observations/popular_field_values (verifiable=true) for stage-stratified counts. " +
  "Stage labels from popular_field_values: Flowers, Flower Buds, Fruits or Seeds, No Flowers or Fruits " +
  "(for plants); Green Leaves, Colored Leaves, No Live Leaves, Breaking Leaf Buds (leaf phenology). " +
  "Phenological annotations added voluntarily — coverage is uneven, often sparse or absent. " +
  "Research Grade observations (community-confirmed, open license) are published to GBIF; " +
  "overlap with FERNS GBIF service is expected and is an application-layer concern. " +
  "Method: api_fetch. FERNS cache TTLs: place IDs permanent, species appearance 30 days, phenology 7 days, " +
  "no-match species 7 days, no-annotation phenology 7 days.";

export const INAT_REGISTRY_ENTRY = {
  source_id: INAT_SOURCE_ID,
  name: "iNaturalist — Observations, Phenology, and Species Appearance",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Observation and species data from a global citizen science platform with over 200 million nature sightings. " +
    "Provides place ID lookup, species photos and descriptions, native/introduced status, conservation status, " +
    "and month-by-month phenology (when a species is flowering, budding, or fruiting) from community annotations. " +
    "FERNS provides URLs to query live observation records directly.",
  input_summary:
    "Place name (for place ID resolution); species name (for appearance and phenology); place IDs (for phenology filtering)",
  output_summary:
    "iNaturalist place ID and display name; species photo, Wikipedia description, common names, conservation status, " +
    "native status, global observation count; monthly observation counts and phenological stage breakdown " +
    "(flowering, fruiting, budding) by month; direct URLs for querying live iNaturalist observation records",
  dependencies: [] as string[],
  update_frequency:
    "Live. iNaturalist data changes continuously. FERNS cache TTLs: place IDs permanent; species appearance 30 days; phenology 7 days.",
  known_limitations:
    "Two API calls are always required for species appearance (search then full record). " +
    "Phenological annotation coverage is uneven — many species have sparse or no annotations. " +
    "iNaturalist maintains its own taxonomic backbone; names may differ from GBIF, BONAP, or Michigan Flora. " +
    "Research Grade iNaturalist observations appear in GBIF — do not double-count when using both FERNS services. " +
    "Observation timing data reflects observer effort and seasonal accessibility as much as actual species biology.",
  metadata_url: "/api/inat/metadata",
  explorer_url: "/source/inaturalist",
  permission_granted: INAT_PERMISSION_GRANTED,
  permission_status: INAT_PERMISSION_STATUS,
  general_summary: INAT_GENERAL_SUMMARY,
  technical_details: INAT_TECHNICAL_DETAILS,
};
