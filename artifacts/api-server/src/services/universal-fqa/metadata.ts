export const UNIVERSAL_FQA_SOURCE_ID = "universal-fqa";

export const UNIVERSAL_FQA_API_BASE = "http://universalfqa.org/get";

export const UNIVERSAL_FQA_PERMISSION_GRANTED = true;

export const UNIVERSAL_FQA_PERMISSION_STATUS =
  "OPEN — No authentication required. All endpoints are publicly accessible without registration. Attribution required.";

export const UNIVERSAL_FQA_ATTRIBUTION = {
  source_name: "Universal FQA Calculator",
  website: "https://universalfqa.org",
  license:
    "Public data contributed by botanists, ecologists, and institutions. No formal license stated. Attribution required per academic norms. Do not redistribute without crediting original database authors per each database citation string.",
  citation:
    "universalfqa.org. Universal FQA Calculator. Accessed via universalfqa.org public REST API.",
  api_base_url: UNIVERSAL_FQA_API_BASE,
};

export const UNIVERSAL_FQA_DERIVATION_SUMMARY =
  "Universal FQA (universalfqa.org) is a public platform developed at the University of Michigan for standardizing Floristic Quality Assessment (FQA) calculations. " +
  "FQA is an ecological method, developed by Floyd Swink and Gerould Wilhelm (Plants of the Chicago Region, 1979; 4th ed. 1994), for measuring the ecological quality of a plant community. " +
  "It works by assigning every plant species a Coefficient of Conservatism (C-value) — an integer from 0 to 10 reflecting how tolerant that species is of habitat disturbance. " +
  "A C-value of 0 means the species grows almost anywhere regardless of habitat quality; a C-value of 10 means it is restricted to pristine, undisturbed habitats. " +
  "These C-values are assigned by regional botanists for a specific geographic area, so universalfqa.org hosts many independent regional databases rather than one global list. " +
  "As of 2025 the platform has 93 databases spanning 1993–2025, covering US states, EPA ecoregions, and Canadian provinces. " +
  "The Floristic Quality Index (FQI) for a site is computed from the C-values of all species observed there: the higher the FQI, the higher quality the plant community. " +
  "This source is NOT a watering guide, NOT a wetland delineation tool, and NOT related to WUCOLS water-use classifications. " +
  "The C-value measures ecological fidelity to intact habitat, which is a different concept from wetland affinity (Coefficient of Wetness, W-value) or irrigation need (WUCOLS). " +
  "FERNS serves two data types from this source: " +
  "(1) Regional databases — per-species lists of C-values, W-values, and traits for each region. " +
  "(2) Public site assessments — field inventories of named natural areas contributed by ecologists, botanists, students, and land managers, each with a full species list and computed FQI metrics. " +
  "SELECTING A DATABASE: Read the region and citation fields together. They describe the geographic scope, institutional source, methodology, and publication year. " +
  "Michigan databases: ID 50 (Reznicek et al. 2014, University of Michigan Herbarium, 2872 species) and ID 267 (Merjent Inc. 2024, 2873 species). " +
  "Both cover the same Michigan vascular flora; ID 267 is more recent. " +
  "ID 50 uses the same C-value assignments as Michigan Flora (michiganflora.net).";

export const UNIVERSAL_FQA_DERIVATION_SCIENTIFIC =
  "Source: universalfqa.org public REST API. Developed and maintained by the University of Michigan. " +
  "No authentication required. Base URL: http://universalfqa.org/get (HTTP; server redirects to HTTPS). " +
  "All responses are JSON with envelope {status: 'success'|'error', data: unknown[][]}. " +
  "FIELD DEFINITIONS — SPECIES RECORDS (returned by both database and assessment endpoints): " +
  "scientific_name: Full scientific name as assigned in the regional database. String. Pass through as-is. " +
  "family: Plant family. String. " +
  "acronym: Source-assigned abbreviation, typically derived from genus and species initials (e.g., 'LOBCAR' for Lobelia cardinalis). String. No fixed length or format; pass through as-is. " +
  "native: Nativity designation. String. Two observed values: 'native' (indigenous to the region per the database authority) or 'non-native' (introduced/adventive). Pass through as-is. " +
  "c: Coefficient of Conservatism (C-value). String representation of an integer 0–10. " +
  "0 = cosmopolitan or highly tolerant of disturbance; 10 = restricted to high-quality, undisturbed habitats, per Swink & Wilhelm methodology. " +
  "Assigned by regional botanists for each database; the same species may have different C-values in different regional databases. " +
  "Some databases assign '*' (string) to non-native species instead of an integer. Never parse as integer without handling '*'. " +
  "Distinct from: w (Coefficient of Wetness, a separate metric on a −5 to +5 numeric scale); WUCOLS water-use classification (VL/L/M/H, for managed landscape irrigation). " +
  "w: Coefficient of Wetness (W-value). String representation of a numeric value, following Swink & Wilhelm fixed assignments by Wetland Indicator Status category: " +
  "OBL (Obligate Wetland) = −5; FACW (Facultative Wetland) = −3; FAC (Facultative) = 0; FACU (Facultative Upland) = +3; UPL (Upland) = +5. " +
  "Expresses wetland affinity numerically. Distinct from: c (Coefficient of Conservatism, a habitat-fidelity metric on a 0–10 scale); WUCOLS (irrigation guide). " +
  "physiognomy: Plant life form. Lowercase string. Observed values: 'tree', 'shrub', 'vine', 'forb', 'grass', 'sedge', 'rush', 'fern', 'bryophyte'. Pass through as-is; vocabulary may vary by database. " +
  "duration: Life cycle. Lowercase string. Observed values: 'annual', 'biennial', 'perennial'. Pass through as-is. " +
  "common_name: Common name as listed in the regional database. String. " +
  "FIELD DEFINITIONS — ASSESSMENT METRICS (assessment detail endpoint only): " +
  "The Floristic Quality Index (FQI) is computed as the square root of species count multiplied by mean C-value. " +
  "total_mean_c: Mean C-value across all recorded species (native and non-native). Numeric. " +
  "native_mean_c: Mean C-value across native species only. Numeric. " +
  "total_fqi: Total FQI = √(total species count) × total mean C. Numeric. " +
  "native_fqi: Native FQI = √(native species count) × native mean C. Numeric. " +
  "adjusted_fqi: Adjusted FQI = √(total species count) × native mean C. Uses total richness but native mean C, penalizing sites with high non-native presence while rewarding overall species richness. Numeric. " +
  "pct_c0, pct_c1_3, pct_c4_6, pct_c7_10: Percentage of species in C-value bands 0, 1–3, 4–6, and 7–10. Numeric (0–100). " +
  "native_tree_mean_c, native_shrub_mean_c, native_herbaceous_mean_c: Mean C-value by growth form, native species only. Numeric. " +
  "total_species, native_species, non_native_species: Species richness counts. Numeric. " +
  "native_species_pct, non_native_species_pct: Percentage of total species that are native or non-native. Numeric (0–100). " +
  "mean_wetness, native_mean_wetness: Mean W-value across all species and native species respectively. Numeric. " +
  "Physiognomy breakdown: {type}_count and {type}_pct for each of: tree, shrub, vine, forb, grass, sedge, rush, fern, bryophyte. Numeric. " +
  "Duration breakdown: {type}_count and {type}_pct for each of: annual, perennial, biennial. Numeric. " +
  "Native duration breakdown: native_{type}_count and native_{type}_pct for each of: annual, perennial, biennial. Numeric. " +
  "ASSESSMENT LOCATION FIELDS: site_name, date (string, format varies), city, county, state, country, latitude (string or null), longitude (string or null), " +
  "practitioner, weather_notes, duration_notes, community_type, other_notes, visibility (public/private status string from source). All string or null. " +
  "API ENDPOINTS: " +
  "GET /get/database/ — database list. Row-array; each row: [id (integer), region (string), year (string), citation (string)]. " +
  "GET /get/database/{id} — full species list for one database. Row-indexed: rows 0–9 are header metadata (region, year, citation, summary counts); " +
  "row 10 is column header ['Scientific Name','Family','Acronym','Native?','C','W','Physiognomy','Duration','Common Name']; rows 11+ are species data. " +
  "Some database IDs return malformed or empty responses — treat species_count 0 as a known upstream limitation, not a FERNS error. " +
  "GET /get/database/{id}/inventory — assessment list for one database. Row-array, no header row. Each row: [id, name, date, site, practitioner]. " +
  "GET /get/inventory/{id} — full assessment detail. Row-indexed: rows 0–18 are site metadata; rows 21–41 are FQI metrics; " +
  "rows 44–60 are physiognomy and duration breakdowns; rows 62+ are species rows in the same column order as the database species endpoint. " +
  "CACHING: Full species databases are cached in server memory (JavaScript Map, keyed by database_id) on first request. " +
  "Assessments are fetched live on each request with no cache. Database list is fetched live. " +
  "No PostgreSQL persistence — a server restart clears all cached species databases. " +
  "KNOWN LIMITATIONS: Assessment list endpoint has no county or state fields — location is only available in individual assessment detail. " +
  "Latitude and longitude fields are frequently blank. " +
  "C-values must not be compared across regional databases without confirming that both databases use the same authority and geographic scope.";

export const UNIVERSAL_FQA_REGISTRY_ENTRY = {
  source_id: UNIVERSAL_FQA_SOURCE_ID,
  name: "Universal FQA — Regional C-Value Databases and Site Assessment Inventories",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Universal FQA (universalfqa.org) hosts 93 regional Floristic Quality Assessment databases from the US, Canada, " +
    "and other regions, each providing per-species C-values and W-values for that region's flora. " +
    "It also hosts thousands of publicly shared site assessments — real field inventories at named natural areas, " +
    "each with observed species lists and computed FQI metrics (Total/Native FQI, Adjusted FQI, Mean C, Mean Wetness, " +
    "species richness by nativity, physiognomy and duration breakdowns). " +
    "Databases span 1993–2025 and include state databases (Michigan, Arkansas, Colorado, etc.), " +
    "EPA ecoregion databases, and site-specific databases. No authentication required.",
  input_summary:
    "Database selection: read region + citation fields to determine relevance. " +
    "Species lookup: scientific name + database_id. " +
    "Assessments: database_id (list) or assessment_id (detail).",
  output_summary:
    "Per-database: scientific name, family, acronym, nativity, C-value, W-value, physiognomy, duration, common name. " +
    "Per-assessment: site name, date, location (city/county/state/country), practitioner, all FQI metrics, full species list with per-species values.",
  dependencies: [] as string[],
  update_frequency:
    "Databases: static per publication year; new databases added periodically by contributing institutions. " +
    "Assessments: live — new public assessments contributed by users continuously. Michigan 2014 (ID 50) has 4800+ assessments; Michigan 2024 (ID 267) has 400+.",
  known_limitations:
    "Some database IDs in the list return malformed/empty responses from the per-database endpoint. " +
    "The assessment list endpoint returns no county field — county is only in the individual assessment detail. " +
    "Assessment latitude/longitude fields are often blank. " +
    "The API uses HTTP base URL with redirect to HTTPS. " +
    "C-values are calibrated per database — the same species may have different C-values in different regional databases.",
  metadata_url: "/api/universal-fqa/metadata",
  explorer_url: "/source/universal-fqa",
};
