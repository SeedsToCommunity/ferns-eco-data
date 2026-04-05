export const MIFLORA_SOURCE_ID = "michigan-flora";

export const MIFLORA_API_BASE = "https://michiganflora.net/api/v1.0";

export const MIFLORA_USER_AGENT = "FERNS/1.0";

export const MIFLORA_REQUEST_TIMEOUT_MS = 30000;

export const MIFLORA_PERMISSION_GRANTED = true;

export const MIFLORA_PERMISSION_STATUS =
  "OPEN — No authentication required for read operations. Attribution required.";

export const MIFLORA_ATTRIBUTION = {
  source_name: "Michigan Flora",
  website: "https://michiganflora.net",
  license: "Data and images © University of Michigan Herbarium. For non-commercial educational and research use with attribution.",
  citation:
    "Reznicek, A.A., E.G. Voss, & B.S. Walters. February 2011. Michigan Flora Online. University of Michigan. Web. https://michiganflora.net. Accessed via Michigan Flora REST API.",
  api_base_url: MIFLORA_API_BASE,
};

export const MIFLORA_GENERAL_SUMMARY =
  "Michigan Flora Online is published by the University of Michigan Herbarium and authored by Reznicek, Voss, and Walters (2011). " +
  "It covers all documented native and introduced non-native (adventive) vascular plant species in Michigan across all 83 counties. " +
  "FERNS queries this source via its public REST API and caches results per species (30 days for found species, 7 days for not-found). " +
  "A species query returns family, common name, native or adventive status, botanical description text, a primary plant image, synonyms, and county-level occurrence records. " +
  "Each species record also carries three ecological metrics: a Coefficient of Conservatism (C-value, 0–10 for native species, '*' for adventive species), " +
  "a Coefficient of Wetness (W-value, −5 to +5), and a Wetland Indicator Status code (OBL/FACW/FAC/FACU/UPL). " +
  "The C-values come from the Reznicek et al. 2014 Michigan Floristic Quality Assessment Database — the same dataset available as Universal FQA (universalfqa.org) database ID 50 — " +
  "so querying Michigan Flora and Universal FQA ID 50 for the same species will return consistent C-values for Michigan flora. " +
  "The content is static (published 2011, no update mechanism in the API); county coverage is comprehensive for all 83 Michigan counties. " +
  "Notable source quirks: adventive species names are returned ALL-CAPS by the API, and the native/adventive status field uses the literal string 'NULL' (not a JSON null) for unknown or absent status.";

export const MIFLORA_TECHNICAL_DETAILS =
  "Source: Michigan Flora REST API v1.0 (https://michiganflora.net/api/v1.0). " +
  "Species lookup: GET /flora_search_sp?scientific_name={name} returns array of matching records; " +
  "first record gives plant_id; then parallel fetches: GET /spec_text?id={id} (taxonomic details and description text), " +
  "GET /synonyms?id={id} (synonym records), GET /pimage_info?id={id} (primary image). " +
  "County presence (name-based, two-step): GET /flora_search_sp?scientific_name={name} to resolve plant_id, " +
  "then GET /locs_sp?id={id} returns {locations:[...county names...]} for confirmed counties. " +
  "Cache keys for both endpoints are normalized lowercase scientific name. " +
  "FIELD DEFINITIONS — " +
  "c: Coefficient of Conservatism (C-value, Swink & Wilhelm 1994 methodology). Always a string. " +
  "Per-species Michigan C-values sourced from: Reznicek, A.A., M.R. Penskar, B.S. Walters, and B.S. Slaughter. 2014. " +
  "Michigan Floristic Quality Assessment Database. University of Michigan Herbarium and Michigan Natural Features Inventory. " +
  "Same dataset as Universal FQA (universalfqa.org) database ID 50. " +
  "Values: '0' (cosmopolitan, weedy, highly tolerant of disturbance) through '10' (restricted to pristine habitats). " +
  "'*' = non-native/adventive; no C-value assigned. Never parseInt. " +
  "Distinct from: w (Coefficient of Wetness, -5 to +5 scale), wet (WIS categorical code), WUCOLS (VL/L/M/H irrigation scale). " +
  "w: Coefficient of Wetness (Swink & Wilhelm FQA). Numeric, -5 to +5. " +
  "Fixed W values by WIS category: OBL = -5; FACW = -3; FAC = 0; FACU = +3; UPL = +5. " +
  "Distinct from: c (Coefficient of Conservatism, 0–10 fidelity scale), wet (categorical WIS string), WUCOLS (irrigation). " +
  "wet: Wetland Indicator Status (WIS). String. Authority: USDA NRCS National Wetland Plant List (NWPL). " +
  "OBL (Obligate Wetland, W=-5): >99% occurrence in wetlands; " +
  "FACW (Facultative Wetland, W=-3): 67–99%; " +
  "FAC (Facultative, W=0): 34–66%; " +
  "FACU (Facultative Upland, W=+3): 1–33%; " +
  "UPL (Upland, W=+5): <1%. " +
  "Source may return compound values like 'FACU/UPL' for regionally variable species; pass through as-is. " +
  "Distinct from WUCOLS (VL/L/M/H scale for managed landscape irrigation, UC Cooperative Extension). " +
  "st: Status string. 'native' = indigenous to Michigan per Michigan Flora. 'adventive' = introduced non-native. " +
  "Literal string 'NULL' (not JSON null) = absent from Michigan or status unknown; source API quirk, not a JSON null value. " +
  "phys: Physiognomy (plant life form). Free-text string from source. Typical values: 'Tree', 'Shrub', 'Shrub-tree', " +
  "'Vine', 'Forb/Herb', 'Graminoid', 'Fern/Fern ally', 'Aquatic'. Pass through as-is; not a closed vocabulary. " +
  "na: Native/adventive flag from source; string or boolean depending on record. Use st for authoritative native status. " +
  "acronym: Source-assigned abbreviated code for the species. No fixed format; pass through as-is. " +
  "Other quirks: scientific names are inconsistently cased — adventive species names returned ALL-CAPS by the API. " +
  "synonyms endpoint returns {synonyms:[...]} when synonyms exist, or {message:'No synonyms found'} when none — both shapes passed through. " +
  "flora_search_sp may return multiple records (subspecies, varieties) for one query — all records included in search_records. " +
  "Method: api_fetch. FERNS cache TTLs: species 30 days (hit), 7 days (no-match); counties 30 days.";

export const MIFLORA_REGISTRY_ENTRY = {
  source_id: MIFLORA_SOURCE_ID,
  name: "Michigan Flora — Species Records, Botanical Descriptions, and County Occurrences",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Botanical descriptions, photographs, synonym lists, native or non-native status, and county-by-county occurrence records for every documented vascular plant species in Michigan, covering all 83 counties. " +
    "From Michigan Flora Online, a published flora reference from the University of Michigan Herbarium (Reznicek, Voss, and Walters, 2011); content is static and reflects the state of knowledge at that time.",
  input_summary:
    "Scientific name (for both species lookup and county occurrence lookup)",
  output_summary:
    "Taxonomic details (genus, species, family, common name, native status, adventive indicator); " +
    "descriptive text; plant images; synonyms; county-level occurrence records for all 83 Michigan counties",
  dependencies: [] as string[],
  update_frequency:
    "Static. Michigan Flora Online (2011) is a published reference work. Content does not change. FERNS cache TTLs: species 30 days; county records 30 days.",
  known_limitations:
    "Coverage limited to Michigan only. Scientific name casing is inconsistent in the source API " +
    "(adventive species names are ALL-CAPS). The st field uses the literal string 'NULL' for unknown " +
    "or absent status — this is a source API quirk, not a JSON null. County occurrence codes require " +
    "interpretation (see county endpoint). flora_search_sp may return multiple records (subspecies/varieties) " +
    "for one query. Two API calls minimum for any species query; four for full species data.",
  metadata_url: "/api/miflora/metadata",
  explorer_url: "/source/michigan-flora",
  permission_granted: MIFLORA_PERMISSION_GRANTED,
  permission_status: MIFLORA_PERMISSION_STATUS,
  general_summary: MIFLORA_GENERAL_SUMMARY,
  technical_details: MIFLORA_TECHNICAL_DETAILS,
};
