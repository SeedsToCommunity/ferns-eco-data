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
  "Universal FQA is a public platform hosting Floristic Quality Assessment (FQA) databases and tools. " +
  "It serves two distinct types of data: " +
  "(1) Regional FQA databases — collections of per-species C-values and W-values assembled by botanists for a given geographic region or ecoregion. " +
  "As of 2025 the platform hosts 93 databases spanning 1993–2025, covering US states, EPA ecoregions, and Canadian provinces. " +
  "Each database provides: scientific name, family, acronym, nativity (native/non-native), C-value (0–10), W-value (-5 to +5), physiognomy, duration, and common name. " +
  "FERNS caches entire databases in memory per database_id on first request and serves subsequent species lookups from that cache. " +
  "(2) Public site assessments — field inventories of named natural areas contributed by practitioners (ecologists, botanists, students, land managers). " +
  "Each assessment records which species were observed at a site on a given date, plus computed FQI metrics: " +
  "Total FQI, Native FQI, Adjusted FQI, Total/Native Mean C, Mean Wetness, species richness, physiognomy breakdown, and duration breakdown. " +
  "Assessments are tied to a specific regional database. " +
  "SELECTING A DATABASE: The region and citation fields together describe the geographic scope, ecoregion coverage, institutional source, and year for each database. " +
  "Read both fields in full — they contain all information needed to determine relevance for a given place or project. " +
  "Michigan databases: ID 50 (Reznicek et al. 2014, 2872 species) and ID 267 (Merjent 2024, 2873 species). " +
  "Both represent the same Michigan vascular flora; ID 267 is the more current publication. " +
  "ID 50 is identical to the C-value data used by Michigan Flora (michiganflora.net).";

export const UNIVERSAL_FQA_DERIVATION_SCIENTIFIC =
  "Source: universalfqa.org public REST API. No auth required. Base URL: http://universalfqa.org/get (HTTP; redirects to HTTPS). " +
  "ENDPOINTS — " +
  "Database list: GET /get/database/ — returns JSON {status, data} where data is an array of rows [id, region, year, citation]. " +
  "Per-database species: GET /get/database/{id} — first row: region; second: year; third: full citation; fourth: empty; " +
  "fifth: ['Total Species:', N]; sixth: ['Native Species:', N]; seventh: ['Non-native Species:', N]; " +
  "eighth: ['Total Mean C:', N]; ninth: ['Native Mean C:', N]; tenth: empty; " +
  "eleventh: header row ['Scientific Name','Family','Acronym','Native?','C','W','Physiognomy','Duration','Common Name']; " +
  "twelfth onward: species rows matching the header. Some databases return malformed/empty responses — check species_count > 0 before relying on data. " +
  "Assessment list: GET /get/database/{id}/inventory — returns data as rows [id, name, date, site, practitioner] for all public assessments. No column header row; first row is first assessment. " +
  "Single assessment: GET /get/inventory/{assessment_id} — row-indexed structure: " +
  "0: site name; 1: date; 2: city; 3: city (dup); 4: county; 5: state; 6: country; " +
  "7: ['FQA DB Region:', region]; 8: ['FQA DB Publication Year:', year]; 9: ['FQA DB Description:', citation]; " +
  "10: empty; 11: ['Practitioner:', name]; 12: ['Latitude:', val]; 13: ['Longitude:', val]; " +
  "14: ['Weather Notes:', val]; 15: ['Duration Notes:', val]; 16: ['Community Type Notes:', val]; 17: ['Other Notes:', val]; " +
  "18: ['Private/Public:', val]; " +
  "20: ['Conservatism-Based Metrics:']; 21: ['Total Mean C:', N]; 22: ['Native Mean C:', N]; " +
  "23: ['Total FQI:', N]; 24: ['Native FQI:', N]; 25: ['Adjusted FQI:', N]; " +
  "26: ['% C value 0:', N]; 27: ['% C value 1-3:', N]; 28: ['% C value 4-6:', N]; 29: ['% C value 7-10:', N]; " +
  "30: ['Native Tree Mean C:', N]; 31: ['Native Shrub Mean C:', N]; 32: ['Native Herbaceous Mean C:', N]; " +
  "34: ['Species Richness:']; 35: ['Total Species:', N]; 36: ['Native Species:', N, pct]; 37: ['Non-native Species:', N, pct]; " +
  "39: ['Species Wetness:']; 40: ['Mean Wetness:', N]; 41: ['Native Mean Wetness:', N]; " +
  "43: ['Physiognomy Metrics:']; 44-52: physiognomy rows [type, count, pct%]; " +
  "54: ['Duration Metrics:']; 55-60: duration rows [type, count, pct%]; " +
  "62: ['Species:']; 63: header row; 64+: species rows matching header. " +
  "CACHING: Species databases cached in-memory per database_id (Map). Assessments fetched live (no cache). Database list fetched live. " +
  "Method: api_fetch. No FERNS database cache for Universal FQA data — memory only.";

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
