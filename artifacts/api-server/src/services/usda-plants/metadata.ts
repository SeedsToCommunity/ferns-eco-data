export const USDA_PLANTS_SOURCE_ID = "usda-plants";
export const USDA_PLANTS_API_BASE = "https://plantsservices.sc.egov.usda.gov/api";

export const USDA_PLANTS_PERMISSION_GRANTED = true;

export const USDA_PLANTS_PERMISSION_STATUS =
  "OPEN — USDA PLANTS Database (plants.sc.egov.usda.gov) is a public-domain government resource maintained by the " +
  "USDA Natural Resources Conservation Service (NRCS). " +
  "No authentication or API key is required. " +
  "FERNS queries the USDA PLANTS REST API and caches results locally in two database tables.";

export const USDA_PLANTS_GENERAL_SUMMARY =
  "The USDA PLANTS Database is operated by the USDA Natural Resources Conservation Service (NRCS) and is the official " +
  "federal nomenclatural authority for plant taxonomy in the United States. " +
  "It covers all vascular plants, mosses, liverworts, hornworts, and lichens documented in the US and territories — " +
  "approximately 50,000 accepted names. " +
  "FERNS queries the USDA PLANTS API to resolve a scientific name to a USDA symbol (a short alphanumeric code uniquely " +
  "identifying each taxon) and retrieve the full plant profile; results are cached locally and reused for subsequent queries. " +
  "A name lookup returns the USDA symbol, canonical name, primary common name, taxonomic rank, full hierarchical classification " +
  "from Kingdom to species, nativity status per US region (Native or Introduced for the contiguous US, Alaska, Hawaii, Puerto " +
  "Rico, Canada, and other territories), synonym list, wetland indicator data, legal status, and links to fact sheets and " +
  "plant guides. " +
  "A search query returns paginated records matching by scientific name, common name, symbol, or family. " +
  "Known limitations: the USDA PLANTS API is undocumented; profile symbols may change when NRCS revises taxonomy; " +
  "not all synonym names will match via autocomplete lookup; ScientificName fields returned by the API contain HTML italic tags.";

export const USDA_PLANTS_TECHNICAL_DETAILS =
  "Source: https://plants.sc.egov.usda.gov. Operated by USDA Natural Resources Conservation Service (NRCS); " +
  "public domain, no license restrictions. No formal citation — government database. " +
  "Access method: api_fetch. " +
  "Undocumented REST API at https://plantsservices.sc.egov.usda.gov/api/, reverse-engineered from Angular SPA bundle; " +
  "full discovery process and endpoint reference documented in docs/usda-plants-api.md. " +
  "Name lookup flow: GET /PlantSearch?searchText={URL-encoded name} returns autocomplete candidates as [{Text, Plant}]; " +
  "exact match is attempted on ScientificNameWithoutAuthor (case-insensitive); " +
  "if ScientificNameWithoutAuthor is null (as in PlantSearch autocomplete responses), falls back to extracting the first N words " +
  "(N = word count of the query) from the HTML-stripped ScientificName and comparing case-insensitively; if no match, found=false. " +
  "Profile fetch: GET /PlantProfile?symbol={symbol}. " +
  "Search: POST /plants-search-results with JSON body {Text, Field, SortBy, Offset, FilterOptions, UnfilteredPlantIds, " +
  "Type, TaxonSearchCriteria, MasterId, pageNumber, allData}; Type='Basic' for scientific-name or common-name text search. " +
  "DB tables: usda_plants_name_matches (columns: id serial PK, cache_key text unique, input_name text, found boolean, " +
  "symbol text, canonical_name text, common_name text, rank text, usda_id integer, expires_at timestamptz); " +
  "usda_plants_profiles (columns: id serial PK, cache_key text unique, symbol text unique, profile jsonb, expires_at timestamptz). " +
  "Caching: name matches cached 30 days for hits, 7 days for misses; profiles cached 30 days; " +
  "?refresh=true forces re-fetch of both the name match and the profile for a given species query; search results are not cached. " +
  "Response normalization: all PlantProfile fields are passed through as-is; a profile_url field is constructed as " +
  "https://plants.sc.egov.usda.gov/?symbol={symbol} (not returned by the API itself); " +
  "ScientificName fields from the upstream API contain HTML italic tags (e.g. <i>Trillium grandiflorum</i> (Michx.) Salisb.); " +
  "FERNS strips HTML only for the canonical_name field (extracted from PlantSearch); " +
  "search result scientific_name fields are passed through with HTML tags intact per the upstream format. " +
  "Coded/enumerated values — NativeStatuses.Status: N=Native, I=Introduced. " +
  "NativeStatuses.Region: L48=contiguous 48 states, AK=Alaska, HI=Hawaii, PR=Puerto Rico, VI=US Virgin Islands, " +
  "CAN=Canada, GU=Guam, MP=Northern Mariana Islands, SPM=Saint-Pierre and Miquelon, UM=US Minor Outlying Islands. " +
  "Rank values: Kingdom, Subkingdom, Superdivision, Division, Class, Subclass, Order, Family, Genus, Species, Subspecies, Variety.";

export const USDA_PLANTS_REGISTRY_ENTRY = {
  source_id: USDA_PLANTS_SOURCE_ID,
  name: "USDA PLANTS Database — Federal Plant Taxonomy and Occurrence Reference",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Plant taxonomy, synonyms, nativity status, state-level occurrence data, wetland indicator status, legal status, " +
    "morphological characteristics, and document references for all vascular plants, mosses, liverworts, hornworts, and " +
    "lichens in the United States and territories. From the USDA PLANTS Database, maintained by the Natural Resources " +
    "Conservation Service (NRCS), the federal nomenclatural authority for US plant taxonomy.",
  input_summary: "Scientific name (binomial or trinomial)",
  output_summary:
    "USDA symbol, canonical name, common name, rank, taxonomy hierarchy, nativity status by region, synonyms, " +
    "wetland indicator data, legal status, fact sheets, and full plant profile",
  dependencies: [] as string[],
  update_frequency:
    "Cached locally 30 days per symbol; the USDA PLANTS database is updated continuously by NRCS. Use ?refresh=true to bypass cache.",
  known_limitations:
    "The USDA PLANTS API is undocumented and may change without notice. " +
    "Profile symbols may change when NRCS revises taxonomy. " +
    "Not all synonym names will match via the autocomplete lookup — accepted names yield the most reliable results. " +
    "ScientificName fields returned by the API contain HTML italic tags.",
  metadata_url: "/api/usda-plants/metadata",
  explorer_url: "/source/usda-plants",
  permission_granted: USDA_PLANTS_PERMISSION_GRANTED,
  permission_status: USDA_PLANTS_PERMISSION_STATUS,
  general_summary: USDA_PLANTS_GENERAL_SUMMARY,
  technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
};
