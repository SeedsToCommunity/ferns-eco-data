export const INAT_SOURCE_ID = "inat";

export const INAT_API_BASE = "https://api.inaturalist.org/v1";

export const INAT_USER_AGENT = "FERNS/1.0";

export const INAT_REQUEST_TIMEOUT_MS = 30000;

export const INAT_LICENSES = ["cc0", "cc-by", "cc-by-nc"];

export const INAT_LICENSE_NOTES = "OPEN — No authentication required for read operations. Attribution required.";

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
  "iNaturalist provides three categories of data relevant to ecological work: place ID lookup for geographic filtering; " +
  "species appearance data (representative photos, Wikipedia summaries, common names, conservation status, and native/introduced status); " +
  "and month-by-month phenology derived from community-added annotations showing what stage a species is typically in (flowering, budding, or fruiting). " +
  "Geographic scope: global; taxonomic scope: all organisms (used in EC for vascular plants). " +
  "iNaturalist maintains its own taxonomic backbone — name divergence across external sources is expected. " +
  "Data is accessed directly from the iNaturalist v1 REST API at api.inaturalist.org; there is no EC-side cache. " +
  "A species query returns photos, Wikipedia description, common names, conservation status, native status, " +
  "global observation count, and month-by-month phenological stage breakdowns. " +
  "Phenological annotation coverage is uneven — many species have sparse or no stage annotations.";

export const INAT_TECHNICAL_DETAILS =
  "Source: iNaturalist REST API v1 (https://api.inaturalist.org/v1). " +
  "No authentication required for read operations. Rate limiting applies; see iNaturalist API documentation. " +
  "Place lookup: GET /places/autocomplete — returns iNaturalist place IDs from US Census TIGER and similar administrative boundaries. " +
  "Species appearance: two-step fetch via GET /taxa?q={name}&rank=species to resolve the taxon ID, then GET /taxa/{id} for the full record including photos, Wikipedia summary, common names, conservation status, and native/introduced status. " +
  "iNaturalist maintains its own taxonomic backbone. " +
  "Name divergence across external sources is expected and should not be treated as error. " +
  "Phenology: GET /observations/histogram (interval=month_of_year) for total counts by month, " +
  "and GET /observations/popular_field_values (verifiable=true) for stage-stratified counts. " +
  "Stage labels from popular_field_values: Flowers, Flower Buds, Fruits or Seeds, No Flowers or Fruits " +
  "(for plants); Green Leaves, Colored Leaves, No Live Leaves, Breaking Leaf Buds (leaf phenology). " +
  "Phenological annotations added voluntarily — coverage is uneven, often sparse or absent. " +
  "This is an acknowledged source: EC curates the source metadata and provides MCP tooling but does not own or proxy the iNaturalist REST interface. " +
  "There is no EC-side REST route and no EC-side cache. MCP tools call the iNaturalist API directly and build the response envelope themselves. " +
  "Deliberate scope exclusions: user/account endpoints, social/community features, project management endpoints, and observation creation/edit endpoints are out of scope — EC covers read-only ecological data only.";

export const INAT_REGISTRY_ENTRY = {
  source_id: INAT_SOURCE_ID,
  name: "iNaturalist — Observations, Phenology, and Species Appearance",
  knowledge_type: "acknowledged_source",
  status: "live",
  description:
    "Species photos, Wikipedia summaries, common names, native or introduced status, conservation status, " +
    "monthly sighting counts, and phenological stage annotations (flowering, budding, fruiting) for any searchable species worldwide; " +
    "and paged observation summary records with date, taxon, observer, location, quality grade, and first photo. " +
    "From iNaturalist, a global citizen science platform operated by the California Academy of Sciences and National Geographic Society " +
    "with over 200 million user observations.",
  input_summary:
    "Place name (for place ID resolution); species name (for appearance and phenology); place IDs (for phenology filtering)",
  output_summary:
    "iNaturalist place ID and display name; species photo, Wikipedia description, common names, conservation status, " +
    "native status, global observation count; monthly observation counts and phenological stage breakdown " +
    "(flowering, fruiting, budding) by month; paged observation summary records (date, taxon, observer, location, quality grade, photo) — live fetch, no cache",
  dependencies: [] as string[],
  update_frequency:
    "Live — iNaturalist data is continuously updated by the global community.",
  known_limitations:
    "Two API calls are always required for species appearance (search then full record). " +
    "Phenological annotation coverage is uneven — many species have sparse or no annotations. " +
    "iNaturalist maintains its own taxonomic backbone; names may differ from GBIF, BONAP, or Michigan Flora. " +
    "Research Grade iNaturalist observations appear in GBIF — do not double-count when using both FERNS services. " +
    "Observation timing data reflects observer effort and seasonal accessibility as much as actual species biology.",
  metadata_url: INAT_API_BASE,
  licenses: INAT_LICENSES,
  license_notes: INAT_LICENSE_NOTES,
  general_summary: INAT_GENERAL_SUMMARY,
  technical_details: INAT_TECHNICAL_DETAILS,
  non_passthrough_endpoints: [] as { endpoint: string; kind: string }[],
  permission_granted: true,
  license: "https://creativecommons.org/licenses/by-nc/4.0/",
  rights:
    "iNaturalist observations are individually licensed by contributors (CC0, CC BY, or CC BY-NC). " +
    "The license_code field on individual observation records is authoritative for each record. " +
    "This source-level value is the most-restrictive summary across commonly used licenses for research-grade observations.",
  website_url_patterns: {
    taxon: "https://www.inaturalist.org/taxa/{id}",
    place: "https://www.inaturalist.org/places/{id}",
    observation: "https://www.inaturalist.org/observations/{id}",
  },
};
