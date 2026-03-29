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

export const MIFLORA_DERIVATION_SUMMARY =
  "Vascular plant flora data for the state of Michigan from the University of Michigan Herbarium. " +
  "Covers all vascular plant species documented in Michigan including natives, adventives (non-natives), " +
  "and historical records. Data includes taxonomic details, county-level occurrence records, plant images, " +
  "and descriptive text by Reznicek, Voss, and Walters (Michigan Flora Online, 2011). " +
  "County presence is scored with occurrence codes. " +
  "All data accessed via the Michigan Flora REST API and cached to reduce redundant requests. " +
  "Attribution required: 'Reznicek, A.A., E.G. Voss, & B.S. Walters. Michigan Flora Online. University of Michigan. https://michiganflora.net.' " +
  "KEY CODED FIELDS — " +
  "c (Coefficient of Conservatism, C-value): string '0'–'10' for native species, or '*' for non-native/adventive species. " +
  "C-value is an ecological fidelity score assigned to native Michigan plants by Swink & Wilhelm (1994). " +
  "0 = cosmopolitan or highly disturbance-tolerant species; 10 = species restricted to pristine, high-quality habitats. " +
  "Non-natives are assigned '*' and do not receive a numeric C-value. " +
  "Do NOT parse c as an integer. " +
  "This is NOT the Coefficient of Wetness (w field), which is a separate metric on a -5 to +5 scale. " +
  "w (Coefficient of Wetness, W-value): numeric string or number, -5 to +5. " +
  "Expresses a species' statistical affinity for wetland conditions. " +
  "-5 = obligate wetland species (almost always in wetlands); +5 = obligate upland species (almost never in wetlands). " +
  "This is the numeric companion to the Wetland Indicator Status code (wet field). " +
  "This is NOT the Coefficient of Conservatism (c field) and is NOT a WUCOLS irrigation rating. " +
  "wet (Wetland Indicator Status, WIS code): string. Assigned by USDA NRCS National Wetland Plant List. " +
  "OBL = Obligate Wetland (>99% of occurrences in wetlands); " +
  "FACW = Facultative Wetland (67–99%); " +
  "FAC = Facultative (34–66%); " +
  "FACU = Facultative Upland (1–33%); " +
  "UPL = Upland (<1%). " +
  "Some species have compound codes (e.g., 'FACU/UPL') indicating regional variation in the source data. " +
  "This is NOT a WUCOLS (Water Use Classifications of Landscape Species) rating, which uses VL/L/M/H codes for nursery irrigation planning. " +
  "st (Status): string. 'native' = indigenous to Michigan; 'adventive' = introduced non-native; " +
  "literal string 'NULL' (not JSON null) = species absent from Michigan or status unknown (source API quirk). " +
  "phys (Physiognomy): plant life form. Typical values from source: 'Tree', 'Shrub', 'Shrub-tree', 'Vine', " +
  "'Forb/Herb', 'Graminoid', 'Fern/Fern ally', 'Aquatic'. May vary; pass through as-is. " +
  "na (Native/Adventive flag): string or boolean from source; use st field for primary native/adventive determination.";

export const MIFLORA_DERIVATION_SCIENTIFIC =
  "Source: Michigan Flora REST API v1.0 (https://michiganflora.net/api/v1.0). " +
  "Species lookup: GET /flora_search_sp?scientific_name={name} returns array of matching records; " +
  "first record gives plant_id; then parallel fetches: GET /spec_text?id={id} (taxonomic details and description text), " +
  "GET /synonyms?id={id} (synonym records), GET /pimage_info?id={id} (primary image). " +
  "County presence (name-based, two-step): GET /flora_search_sp?scientific_name={name} to resolve plant_id, " +
  "then GET /locs_sp?id={id} returns {locations:[...county names...]} for confirmed counties. " +
  "Cache keys for both endpoints are normalized lowercase scientific name. " +
  "FIELD DEFINITIONS — " +
  "c: Coefficient of Conservatism (C-value, Swink & Wilhelm 1994). Always a string. " +
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
    "Vascular plant flora data for Michigan from the University of Michigan Herbarium, covering all " +
    "documented native and adventive (non-native) vascular plant species in the state. This service " +
    "provides: species taxonomic details including family, common name, descriptive text, and native " +
    "status; representative plant images; synonyms; and county-level occurrence records for all 83 " +
    "Michigan counties. Based on Michigan Flora Online by Reznicek, Voss, and Walters (2011).",
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
  explorer_url: "/miflora-explorer/",
};
