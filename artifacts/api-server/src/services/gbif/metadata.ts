export const GBIF_SOURCE_ID = "gbif";

export const GBIF_API_BASE = "https://api.gbif.org/v1";

export const GBIF_PERMISSION_GRANTED = true;

export const GBIF_PERMISSION_STATUS = "OPEN — CC BY 4.0. Attribution required. No permission letter needed.";

export const GBIF_ATTRIBUTION = {
  source_name: "Global Biodiversity Information Facility (GBIF)",
  website: "https://www.gbif.org",
  license: "CC BY 4.0",
  citation:
    "GBIF.org. Data licensed CC BY 4.0. For reproducible scientific citation, use the GBIF download API to obtain a citable Darwin Core Archive with a DOI. API query results are not citable as stable data sources.",
  api_base_url: GBIF_API_BASE,
};

export const GBIF_GENERAL_SUMMARY =
  "Plant scientific name lookup, synonym resolution, common names, and occurrence records from the " +
  "Global Biodiversity Information Facility (GBIF), an intergovernmental organization aggregating " +
  "biodiversity records from nearly 2,000 institutions including museums, universities, and citizen " +
  "science platforms worldwide. " +
  "GBIF's Backbone Taxonomy (a master reference classification of all known organisms) covers all kingdoms; " +
  "FERNS uses it here for vascular plants — specifically to verify whether a scientific name is currently " +
  "accepted or has been replaced by a synonym, to find common names, and to retrieve location-tagged " +
  "sighting records across North America. " +
  "Geographic scope for occurrence queries is configurable by country, continent, or GBIF taxon key. " +
  "All data is accessed through GBIF's public REST API; query results are cached locally and reused for subsequent queries. " +
  "A name-match query returns the GBIF backbone key, match confidence, and whether the name is accepted " +
  "or a synonym; occurrence queries return count and location-tagged records with coordinates, basis of " +
  "record, and collection date. " +
  "Backbone updated approximately annually; occurrence index updated continuously. " +
  "Consumers must inspect match_type in every response: HIGHERRANK means the name resolved only to genus " +
  "or family level and must not be treated as a species-level confirmation; DOUBTFUL status means the name " +
  "exists in the backbone but its standing is uncertain.";

export const GBIF_TECHNICAL_DETAILS =
  "Source: GBIF.org. Data licensed CC BY 4.0. " +
  "Name matching uses the GBIF Backbone Taxonomy (DOI: https://doi.org/10.15468/39omei), a synthetic " +
  "management classification assembled algorithmically from 105 source checklists in priority order, " +
  "with the Catalogue of Life as the foundation layer. For vascular plants, the World Checklist of " +
  "Vascular Plants (WCVP, 131,891 names) is the primary source through the Catalogue of Life. " +
  "Backbone is rebuilt approximately annually; usageKeys may change across rebuilds. " +
  "Name matching endpoint: GET /v1/species/match?name={name}&kingdom=Plantae. " +
  "No-match is signaled by absence of usageKey field in response (HTTP 200 for all match calls). " +
  "DOUBTFUL status means name exists but taxonomic standing is uncertain — treat as unusable. " +
  "Synonym resolution uses a 3-call chain: /match → /species/{acceptedUsageKey} → " +
  "/species/{acceptedUsageKey}/synonyms. " +
  "Occurrence records filtered with hasCoordinate=true and hasGeospatialIssue=false. " +
  "hasGeospatialIssue=false excludes: ZERO_COORDINATE, COORDINATE_OUT_OF_RANGE, " +
  "COORDINATE_INVALID, COUNTRY_COORDINATE_MISMATCH. Does NOT exclude: high coordinate " +
  "uncertainty, gridded datasets, centroid records (identifiable by coordinateUncertaintyInMeters " +
  "values 301, 3036, 999, 9999). " +
  "Method: api_fetch. Results are cached between requests. " +
  "DB tables: gbif_name_matches (columns: cache_key unique, canonical_name, usage_key, accepted_usage_key, accepted_canonical_name, rank, status, confidence, match_type, kingdom through species hierarchy + corresponding keys, matched_input, expires_at); " +
  "gbif_synonyms (columns: cache_key unique, usage_key, synonyms jsonb, synonym_count); " +
  "gbif_vernacular_names (columns: cache_key unique, usage_key, vernacular_names jsonb, vernacular_name_primary, vernacular_name_count); " +
  "gbif_occurrences (columns: cache_key unique, usage_key, geography_mode, geography_params, occurrence_count, occurrence_count_us, recent_occurrences jsonb, occurrence_last_fetched).";

export const GBIF_VOCABULARIES = {
  basisOfRecord: [
    {
      code: "PRESERVED_SPECIMEN",
      label: "Preserved Specimen",
      description: "Physical specimen in a collection (herbarium sheet, pinned insect, etc.).",
    },
    {
      code: "HUMAN_OBSERVATION",
      label: "Human Observation",
      description: "Observation recorded by a person (iNaturalist, eBird, field survey).",
    },
    {
      code: "MACHINE_OBSERVATION",
      label: "Machine Observation",
      description: "Observation recorded by a sensor or automated system.",
    },
    {
      code: "MATERIAL_CITATION",
      label: "Material Citation",
      description: "Reference to a specimen or occurrence in published literature.",
    },
    {
      code: "LIVING_SPECIMEN",
      label: "Living Specimen",
      description: "Observation of a living specimen in cultivation (botanic garden, zoo).",
    },
    {
      code: "FOSSIL_SPECIMEN",
      label: "Fossil Specimen",
      description: "Fossil specimen.",
    },
    {
      code: "OCCURRENCE",
      label: "Occurrence",
      description: "Unspecified occurrence type.",
    },
  ],
  matchType: [
    {
      code: "EXACT",
      label: "Exact Match",
      description: "Canonical name matched precisely.",
    },
    {
      code: "FUZZY",
      label: "Fuzzy Match",
      description: "Name matched after normalization (minor spelling variation, author differences).",
    },
    {
      code: "HIGHERRANK",
      label: "Higher Rank Match",
      description: "Only genus or family matched; species-level match not found.",
    },
    {
      code: "NONE",
      label: "No Match",
      description: "No match found at any rank.",
    },
  ],
  taxonomicStatus: [
    {
      code: "ACCEPTED",
      label: "Accepted Name",
      description: "This is the currently accepted name in the GBIF backbone.",
    },
    {
      code: "SYNONYM",
      label: "Synonym",
      description: "This name is a synonym; acceptedUsageKey points to the accepted name.",
    },
    {
      code: "DOUBTFUL",
      label: "Doubtful",
      description:
        "Name exists in the backbone but its taxonomic status is uncertain. Treat as unusable for confirmed identity.",
    },
    {
      code: "HETEROTYPIC_SYNONYM",
      label: "Heterotypic Synonym",
      description: "Synonym based on a different type specimen.",
    },
    {
      code: "HOMOTYPIC_SYNONYM",
      label: "Homotypic Synonym",
      description: "Synonym based on the same type specimen (differing only in combination or rank).",
    },
    {
      code: "PROPARTE_SYNONYM",
      label: "Pro Parte Synonym",
      description: "Partial synonym — the old name was applied to more than one taxon.",
    },
    {
      code: "MISAPPLIED",
      label: "Misapplied",
      description: "Name has been incorrectly applied to this taxon in the literature.",
    },
  ],
  occurrenceStatus: [
    {
      code: "PRESENT",
      label: "Present",
      description: "Species confirmed present at this location. The vast majority of GBIF records.",
    },
    {
      code: "ABSENT",
      label: "Absent",
      description: "Species confirmed absent (rare in GBIF — most absence data is not recorded).",
    },
  ],
};

export const GBIF_REGISTRY_ENTRY = {
  source_id: GBIF_SOURCE_ID,
  name: "GBIF — Taxonomic Backbone, Name Reconciliation, and Occurrence Records",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Plant scientific name lookup and verification — checks whether a name is currently accepted or has been replaced by a newer one — plus synonym lists, common names, and location-tagged sighting records across North America. " +
    "From the Global Biodiversity Information Facility (GBIF), an intergovernmental organization aggregating biodiversity records from nearly 2,000 institutions worldwide.",
  input_summary:
    "Scientific name (for matching and reconciliation), GBIF usageKey (for synonyms, vernacular names, and occurrences), or common name string (for vernacular search)",
  output_summary:
    "Taxonomic name match with GBIF backbone key and classification; synonym list; vernacular (common) names; occurrence count and recent georeferenced records with configurable geography",
  dependencies: [] as string[],
  update_frequency:
    "Live API. Backbone updated approximately annually. Occurrence index updated continuously.",
  known_limitations:
    "found: true means the name resolved to something in the GBIF backbone, but applications must check match_type to determine whether that match is at the species level or fell back to a higher rank (HIGHERRANK). A HIGHERRANK result should not be treated as a confirmed species identification. Vernacular names are uncontrolled and of variable quality. iNaturalist records are included in GBIF occurrence counts. usageKeys may change across annual backbone rebuilds.",
  metadata_url: "/api/gbif/metadata",
  explorer_url: "/source/gbif",
  permission_granted: GBIF_PERMISSION_GRANTED,
  permission_status: GBIF_PERMISSION_STATUS,
  general_summary: GBIF_GENERAL_SUMMARY,
  technical_details: GBIF_TECHNICAL_DETAILS,
};
