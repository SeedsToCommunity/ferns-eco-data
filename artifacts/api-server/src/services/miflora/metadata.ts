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
  "County presence is scored with occurrence codes (see county endpoint). " +
  "All data accessed via the Michigan Flora REST API and cached to reduce redundant requests. " +
  "Attribution required: 'Reznicek, A.A., E.G. Voss, & B.S. Walters. Michigan Flora Online. " +
  "University of Michigan. https://michiganflora.net.'";

export const MIFLORA_DERIVATION_SCIENTIFIC =
  "Source: Michigan Flora REST API v1.0 (https://michiganflora.net/api/v1.0). " +
  "Species lookup: GET /flora_search_sp?scientific_name={name} returns array of matching records; " +
  "first record gives plant_id; then parallel fetches: GET /spec_text?id={id} (taxonomic details and description text), " +
  "GET /synonyms?id={id} (synonym records), GET /pimage_info?id={id} (primary image). " +
  "County presence (name-based, two-step): GET /flora_search_sp?scientific_name={name} to resolve plant_id, " +
  "then GET /locs_sp?id={id} returns {locations:[...county names...]} for confirmed counties. " +
  "Cache keys for both endpoints are normalized lowercase scientific name. " +
  "Field quirks: st field uses literal string 'NULL' (not JSON null) for species absent from Michigan or with unknown status. " +
  "c field is always a string; '*' indicates non-native (adventive) species — do not parseInt. " +
  "Scientific names are inconsistently cased: adventive species names are returned ALL-CAPS by the API. " +
  "synonyms endpoint returns {synonyms:[...]} when synonyms exist, or {message:'No synonyms found'} when none — both shapes are passed through. " +
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
