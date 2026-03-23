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

export const GBIF_DERIVATION_SUMMARY =
  "Name and taxonomy data from the Global Biodiversity Information Facility (GBIF). " +
  "GBIF is a free international database run by governments worldwide, bringing together biodiversity " +
  "records from nearly 2,000 organizations including museums, universities, and citizen science " +
  "platforms. GBIF is used here for name matching (checking whether a plant name is current or an " +
  "old synonym), finding common names, and retrieving sighting records across North America. " +
  "All data is accessed through GBIF's public API and cached to reduce redundant requests. " +
  "Data is licensed CC BY 4.0. Retrieved date is recorded with every result.";

export const GBIF_DERIVATION_SCIENTIFIC =
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
  "GBIF backbone and BONAP both draw on overlapping North American plant taxonomic sources — " +
  "name agreement between GBIF and BONAP is NOT independent corroboration. " +
  "iNaturalist publishes its observations to GBIF; GBIF occurrence counts include iNaturalist records. " +
  "If combining with a separate iNaturalist source, account for double-counting at the application layer. " +
  "Method: api_fetch. FERNS caches results per species with TTLs: name match 30d, " +
  "occurrence records 7d, synonyms 30d, vernacular names 90d, no-match 7d.";

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
  service_id: GBIF_SOURCE_ID,
  service_name: "GBIF — Taxonomic Backbone, Name Reconciliation, and Occurrence Records",
  knowledge_type: "Source wrapper — direct access to an external authoritative dataset (aggregated primary data)",
  input_summary:
    "Scientific name (for matching and reconciliation) or GBIF usageKey (for synonyms, vernacular names, and occurrences) or common name string (for vernacular lookup)",
  output_summary:
    "Taxonomic name match with GBIF backbone key and classification; synonym list; vernacular (common) names; occurrence count and recent georeferenced records with configurable geography",
  data_lineage:
    "Aggregator. Primary data originates from ~2,000 contributing institutions. Backbone taxonomy is GBIF's synthetic standard, partially derived from BONAP lineage sources for North American plants — name agreement between GBIF and BONAP is NOT independent corroboration. iNaturalist observations appear in both GBIF and the FERNS iNaturalist service — do not count both as independent.",
  update_frequency:
    "Live API. Backbone updated approximately annually. Occurrence index updated continuously. FERNS cache TTLs: name match 30 days, synonyms 30 days, vernacular names 90 days, occurrence data 7 days, no-match 7 days.",
  geographic_scope:
    "Global. FERNS occurrence queries use configurable geography: countries (multi-select), continent, or bounding box. Name matching is global.",
  taxonomic_scope:
    "All organisms. FERNS queries with kingdom=Plantae filter for name matching to reduce ambiguity.",
  permission_status: GBIF_PERMISSION_STATUS,
  known_limitations:
    "Backbone may diverge from BONAP taxonomy for contested North American plant names. Vernacular names are uncontrolled and of variable quality. iNaturalist double-counting risk when used alongside FERNS iNaturalist service. Occurrence counts change continuously — always display cached timestamp. usageKeys may change across annual backbone rebuilds.",
};
