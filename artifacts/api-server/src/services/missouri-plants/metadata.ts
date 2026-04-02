export const MISSOURI_PLANTS_SOURCE_ID = "missouri-plants";

export const MISSOURI_PLANTS_PERMISSION_GRANTED = true;

export const MISSOURI_PLANTS_PERMISSION_STATUS =
  "OPEN — missouriplants.com is a public botanical reference site. " +
  "FERNS indexes the species list from the publicly accessible All_Species_list.html page " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const MISSOURI_PLANTS_DERIVATION_SUMMARY =
  "Missouri Plants (missouriplants.com) is a comprehensive photographic reference for plants of Missouri, " +
  "maintained by Paul Wycoff. " +
  "The site covers over 1,400 species with detailed species pages including photographs, descriptions, " +
  "taxonomy, ecology, and distribution. " +
  "FERNS imports the authoritative species list from missouriplants.com/All_Species_list.html, " +
  "which provides the direct URL for each species (using whatever genus name appears in the filename, " +
  "which may reflect historical synonyms). " +
  "URL filenames are not derivable from scientific names alone — the species list is the authoritative source. " +
  "Lookups are served from FERNS's local database; no live scraping occurs at query time.";

export const MISSOURI_PLANTS_DERIVATION_SCIENTIFIC =
  "Primary source: missouriplants.com/All_Species_list.html. Maintained by Paul Wycoff. " +
  "Import method: HTML parse of All_Species_list.html — " +
  "extracts all <a href='...'> links with scientific name as link text. " +
  "URL construction: absolute URLs constructed from the href in the species list page. " +
  "Important: URL filenames may use taxonomic synonyms (e.g., former genus names) — " +
  "the list page href is authoritative and is stored verbatim. " +
  "Species count: ~1,464 at time of last import. " +
  "Lookup method: ILIKE match on stored scientific_name (case-insensitive exact match preferred). " +
  "Method: species_list_scrape with DB lookup. No HTTP validation at query time.";

export const MISSOURI_PLANTS_REGISTRY_ENTRY = {
  source_id: MISSOURI_PLANTS_SOURCE_ID,
  name: "Missouri Plants — Photographic Reference for Missouri Flora",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Comprehensive photographic reference for plants of Missouri, maintained by Paul Wycoff (missouriplants.com). " +
    "Covers ~1,464 species with photographs, descriptions, taxonomy, and ecology. " +
    "FERNS indexes the species list and returns direct species page URLs. " +
    "Lookups served from FERNS's local database populated from the site's All_Species_list.html.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL to the Missouri Plants species page, or found: false if the species is not in the Missouri Plants database",
  dependencies: [] as string[],
  update_frequency:
    "Manual re-import via admin endpoint. The species list is re-scraped and the database updated when triggered.",
  known_limitations:
    "Coverage is limited to Missouri flora. " +
    "URL filenames may use historical synonym genera — lookup is by scientific_name as stored in the list, " +
    "which may differ from current accepted taxonomy. " +
    "Exact name match required (genus + species, case-insensitive); subspecies and varieties not individually listed.",
  metadata_url: "/api/missouri-plants/metadata",
  explorer_url: "/source/missouri-plants",
};
