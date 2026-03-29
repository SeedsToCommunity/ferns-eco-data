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

export const INAT_DERIVATION_SUMMARY =
  "Observation and species data from iNaturalist (inaturalist.org), a citizen science platform " +
  "operated jointly by the California Academy of Sciences and the National Geographic Society. " +
  "Over 200 million observations contributed by millions of users worldwide. " +
  "Phenological stage data (flowering, budding, fruiting) from community-added annotations. " +
  "Species descriptions from Wikipedia via iNaturalist API. " +
  "All data accessed through the iNaturalist v1 REST API and cached to reduce redundant requests. " +
  "Attribution required: 'Observations from iNaturalist (inaturalist.org). Species descriptions from Wikipedia.'";

export const INAT_DERIVATION_SCIENTIFIC =
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
    "Observation and species data from iNaturalist, a citizen science platform with over 200 million " +
    "nature sightings contributed by millions of users worldwide. This service provides: place ID lookup " +
    "for geographic filtering; species appearance data including representative photos, Wikipedia summaries, " +
    "common names, conservation status, and native/introduced status; month-by-month phenology " +
    "(when a species is observed and what stage — flowering, budding, fruiting) from community annotations; " +
    "and direct URLs for querying live observation records. Individual observation records are not cached — " +
    "FERNS provides URLs to query iNaturalist directly.",
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
  explorer_url: "/registry-explorer/source/inaturalist",
};
