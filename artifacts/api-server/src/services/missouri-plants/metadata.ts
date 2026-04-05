export const MISSOURI_PLANTS_SOURCE_ID = "missouri-plants";

export const MISSOURI_PLANTS_PERMISSION_GRANTED = true;

export const MISSOURI_PLANTS_PERMISSION_STATUS =
  "OPEN — missouriplants.com is a public botanical reference site. " +
  "FERNS indexes the species list from the publicly accessible All_Species_list.html page " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const MISSOURI_PLANTS_GENERAL_SUMMARY =
  "Comprehensive photographic reference for plants of Missouri, maintained by Paul Wycoff " +
  "(missouriplants.com), a privately operated botanical website. " +
  "Data type: species profile pages with photographs, descriptions, taxonomy, ecology, and distribution; " +
  "covers over 1,400 species of Missouri flora. " +
  "Geographic scope: Missouri; taxonomic scope: vascular plants present in Missouri (native and non-native). " +
  "FERNS imports the authoritative species list from the site's All_Species_list.html and stores " +
  "species-to-URL mappings in its local database; no live scraping occurs at query time. " +
  "A query returns the direct species profile URL or found: false; URL filenames may use historical " +
  "synonym genera and are not derivable from scientific names alone — the species list is authoritative. " +
  "The index reflects the site at the time of the last admin-triggered import; ~1,464 species at last import. " +
  "Exact genus + species match required (case-insensitive); subspecies and varieties not individually listed. " +
  "Missouri Plants covers Missouri only — for Illinois coverage, Illinois Wildflowers in FERNS provides " +
  "a comparable resource; for Minnesota, Minnesota Wildflowers; for New England, Go Botany; " +
  "for North America-wide references, use Lady Bird Johnson Wildflower Center or USDA PLANTS.";

export const MISSOURI_PLANTS_TECHNICAL_DETAILS =
  "Primary source: missouriplants.com/All_Species_list.html. Maintained by Paul Wycoff. " +
  "Import method: HTML parse of All_Species_list.html — " +
  "extracts all <a href='...'> links with scientific name as link text. " +
  "URL construction: absolute URLs constructed from the href in the species list page. " +
  "Important: URL filenames may use taxonomic synonyms (e.g., former genus names) — " +
  "the list page href is authoritative and is stored verbatim. " +
  "Species count: ~1,464 at time of last import. " +
  "Lookup method: ILIKE match on stored scientific_name (case-insensitive exact match preferred). " +
  "Method: species_list_scrape with DB lookup. No HTTP validation at query time. " +
  "DB table: botanical_species_lists (columns: id serial PK, site_id text, scientific_name text, url text, section text, imported_at; " +
  "unique on (site_id, scientific_name, section)). Coverage: ~1,464 species at last import. " +
  "Overlap with other FERNS sources: For comparable regional references, use Illinois Wildflowers (illinois-wildflowers) for Illinois, " +
  "Minnesota Wildflowers (minnesota-wildflowers) for Minnesota, Go Botany (gobotany) for New England. " +
  "For North America-wide plant reference, use Lady Bird Johnson Wildflower Center (lady-bird-johnson) or USDA PLANTS (usda-plants). " +
  "For plant scientific name verification, use GBIF (gbif). For county-level distribution, use BONAP (bonap-napa). " +
  "For nursery availability of Midwest species, use Prairie Moon (prairie-moon). " +
  "Missouri Plants is the only FERNS source for Missouri species-specific botanical profile URLs.";

export const MISSOURI_PLANTS_REGISTRY_ENTRY = {
  source_id: MISSOURI_PLANTS_SOURCE_ID,
  name: "Missouri Plants — Photographic Reference for Missouri Flora",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Photographic species profiles and ecological information for plants of Missouri, covering roughly 1,464 species including native and non-native taxa, with photographs, descriptions, taxonomy, and distribution. " +
    "From Missouri Plants, a botanical reference maintained by Paul Wycoff.",
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
  permission_granted: MISSOURI_PLANTS_PERMISSION_GRANTED,
  permission_status: MISSOURI_PLANTS_PERMISSION_STATUS,
  general_summary: MISSOURI_PLANTS_GENERAL_SUMMARY,
  technical_details: MISSOURI_PLANTS_TECHNICAL_DETAILS,
};
