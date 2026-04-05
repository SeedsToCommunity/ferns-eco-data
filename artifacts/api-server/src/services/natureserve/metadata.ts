export const NATURESERVE_SOURCE_ID = "natureserve";

export const NATURESERVE_API_BASE = "https://explorer.natureserve.org/api/data";
export const NATURESERVE_EXPLORER_BASE = "https://explorer.natureserve.org";

export const NATURESERVE_PERMISSION_GRANTED = true;

export const NATURESERVE_PERMISSION_STATUS =
  "OPEN — Free public API. Attribution required per NatureServe Terms of Use.";

export const NATURESERVE_ATTRIBUTION = {
  source_name: "NatureServe Explorer",
  website: "https://explorer.natureserve.org",
  license: "Attribution required",
  citation:
    "NatureServe. [Year]. NatureServe Explorer [web application]. NatureServe, Arlington, Virginia. " +
    "Available: https://explorer.natureserve.org. (Accessed: [Date]).",
  terms_of_use: "https://www.natureserve.org/terms-and-conditions",
  api_base_url: NATURESERVE_API_BASE,
};

export const NATURESERVE_GENERAL_SUMMARY =
  "Conservation status and ecological systems data from NatureServe Explorer, the authoritative " +
  "conservation status database for species and ecosystems across the Americas, maintained by " +
  "NatureServe and its 80+ member programs including state Natural Heritage Programs. " +
  "FERNS exposes two data types from NatureServe: species conservation status (global rank G1–G5, " +
  "US national rank N1–N5, and state rank S1–S5, where 1 = critically imperiled and 5 = secure; " +
  "plus IUCN Red List category, US federal Endangered Species Act listing status, " +
  "CITES trade restriction status, and COSEWIC status for Canadian populations); " +
  "and ecological systems (natural community types with global and national ranks and a concept description). " +
  "Geographic scope: Americas-wide for global ranks; US for national ranks; configurable US state " +
  "(default Michigan) for state ranks. " +
  "Data accessed via NatureServe Explorer's public REST API; results are cached between requests. " +
  "A species query returns scientific name, common name, all rank codes, IUCN category, federal listing " +
  "status, and a direct link to the NatureServe Explorer species record. " +
  "Conservation ranks are reviewed on species-specific cycles (typically 1–10 years); NatureServe's " +
  "Element Occurrence data (precise locality records showing exactly where a species has been documented) " +
  "is restricted to member programs and is not available through this integration. " +
  "NatureServe national conservation ranks complement MNFI's Michigan-specific field data — MNFI provides " +
  "detailed community descriptions and county distribution maps for Michigan, while NatureServe provides " +
  "broader Americas-scale conservation context; both services may be combined for a complete picture.";

export const NATURESERVE_TECHNICAL_DETAILS =
  "Source: NatureServe Explorer API (https://explorer.natureserve.org/api/data). " +
  "Species search uses POST /api/data/speciesSearch with criteriaType:species and quickSearch text " +
  "criteria (page 0-indexed). Ecosystem search uses POST /api/data/search with criteriaType:combined " +
  "and quickSearch text criteria, filtering for ECOSYSTEM recordType results. Full taxon detail " +
  "retrieved via GET /api/data/taxon/ELEMENT_GLOBAL.2.{elementGlobalId}. " +
  "Global rank (grank): G1=Critically Imperiled, G2=Imperiled, G3=Vulnerable, G4=Apparently Secure, " +
  "G5=Secure; GH=Possibly Extinct; GX=Presumed Extinct; GNR=Not Ranked; GU=Unrankable. " +
  "National rank (nrank): N1–N5 follow same scale for US. State rank (srank): S1–S5 for queried state. " +
  "IUCN categories: EX/EW/CR/EN/VU/NT/LC/DD/NE. " +
  "Federal status (usesa): E=Endangered, T=Threatened, SC=Species of Concern. " +
  "COSEWIC (Canada): E=Endangered, T=Threatened, SC=Special Concern, NAR=Not at Risk. " +
  "State rank is extracted from elementNationals[nation=US].elementSubnationals[subnation={stateCode}].srank. " +
  "Ecosystems: ecosystemGlobal.conceptSentence provides the ecosystem description. " +
  "Method: api_fetch. Results are cached between requests.";

export const NATURESERVE_REGISTRY_ENTRY = {
  source_id: NATURESERVE_SOURCE_ID,
  name: "NatureServe Explorer — Species Conservation Status and Ecological Systems",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Conservation status ratings and ecological descriptions for plant and animal species across the Americas — " +
    "how imperiled each species is globally, within the U.S., and within a specific state, " +
    "plus federal and international protection statuses. " +
    "From NatureServe, a nonprofit that coordinates conservation assessments across 80+ natural heritage programs throughout the Americas.",
  input_summary:
    "Scientific or common name string for species search; common name or ecosystem name for ecological systems search; optional US state code (default MI) for state rank",
  output_summary:
    "Species: scientific name, common name, global rank, US national rank, state rank, IUCN category, federal ESA status, CITES, COSEWIC, NatureServe Explorer URL. " +
    "Ecosystems: system name, global rank, US national rank, concept description, NatureServe Explorer URL.",
  dependencies: [] as string[],
  update_frequency:
    "Live API. Conservation ranks reviewed on conservation status review cycles (varies by taxon, typically every 1–10 years).",
  known_limitations:
    "State rank is only returned for the queried state (default MI). NatureServe quickSearch may return the most prominent matching taxon rather than an exact scientific name match — verify returned scientific name against query. " +
    "Ecosystem conceptSentence may be null for some ecosystems with incomplete records. " +
    "GNR (Not Ranked) and SNR (State Not Ranked) are common for ecosystem associations where status assessment is pending. " +
    "NatureServe's Element Occurrence spatial data (precise localities) is restricted to member programs and is not available through this integration.",
  metadata_url: "/api/natureserve/metadata",
  explorer_url: "/source/natureserve",
  permission_granted: NATURESERVE_PERMISSION_GRANTED,
  permission_status: NATURESERVE_PERMISSION_STATUS,
  general_summary: NATURESERVE_GENERAL_SUMMARY,
  technical_details: NATURESERVE_TECHNICAL_DETAILS,
};
