export const ILLINOIS_WILDFLOWERS_SOURCE_ID = "illinois-wildflowers";

export const ILLINOIS_WILDFLOWERS_PERMISSION_GRANTED = true;

export const ILLINOIS_WILDFLOWERS_PERMISSION_STATUS =
  "OPEN — illinoiswildflowers.info is a public botanical reference site maintained by John Hilty. " +
  "FERNS indexes species lists from eight publicly accessible habitat section index pages " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const ILLINOIS_WILDFLOWERS_GENERAL_SUMMARY =
  "Photographic reference for wild plants of Illinois, maintained by John Hilty " +
  "(illinoiswildflowers.info), a privately operated botanical website. " +
  "Data type: species profile pages organized by habitat type across eight sections: " +
  "prairie, savanna, woodland, wetland, weeds, grasses, trees, and mosses. " +
  "Geographic scope: Illinois; taxonomic scope: wild vascular plants and mosses present in Illinois. " +
  "FERNS imports all eight section index pages, aggregating them into a unified lookup table; " +
  "no live scraping occurs at query time for URL lookup. " +
  "A query returns the direct species profile URL(s) — a species appearing in multiple habitat sections " +
  "returns multiple records, one per section; link text format is 'Scientific Name (Common Name)'. " +
  "The index reflects the site at the time of the last admin-triggered import. " +
  "Nomenclature follows the site's own taxonomy, which may differ from current accepted names. " +
  "FERNS also provides a species-text endpoint that fetches and parses the full Illinois Wildflowers species page HTML, " +
  "extracting named prose sections (Description, Habitat & Light, Origin, Faunal Associations, Photographic Location, and more) " +
  "and caching the result for 7 days in the local database; the cache can be bypassed with refresh=true.";

export const ILLINOIS_WILDFLOWERS_TECHNICAL_DETAILS =
  "Primary sources: eight habitat section indexes at https://www.illinoiswildflowers.info/{section}/{index}: " +
  "prairie/plant_index.htm, savanna/savanna_index.htm, woodland/woodland_index.htm, wetland/wetland_index.htm, " +
  "weeds/weed_index.htm, grasses/grass_index.htm, trees/tree_index.htm, mosses/moss_index.html. " +
  "Maintained by John Hilty (illinoiswildflowers.info). " +
  "Import method: HTML parse of each section index — extracts all relative <a href='...'>Scientific Name (Common Name)</a> links. " +
  "Scientific name is parsed from link text by stripping the parenthesized common name. " +
  "Absolute URLs are constructed by combining the section base URL with the relative href. " +
  "A species appearing in multiple sections is stored as multiple rows (one per section). " +
  "Lookup method: ILIKE match on scientific_name; may return multiple rows for different habitat sections. " +
  "Method: species_list_scrape (multi-section) with DB lookup. " +
  "DB table: botanical_species_lists (columns: id serial PK, site_id text, scientific_name text, url text, section text, imported_at; " +
  "unique on (site_id, scientific_name, section)). Coverage: ~1,459 entries across 8 habitat sections; " +
  "many species appear in multiple sections, yielding more DB rows than unique species. " +
  "Illinois Wildflowers does not provide distribution data, conservation ranks, C-values, or nursery availability. " +
  "Species-text endpoint: GET /api/illinois-wildflowers/species-text?species={binomial}&refresh={bool}. " +
  "Uses the first stored URL for the species to fetch the page HTML; extracts prose sections from the Illinois Wildflowers page layout. " +
  "Cache: DB table species_page_text_cache (site_id, species_name, sections JSONB, full_text text, scraped_at, expires_at); " +
  "TTL 7 days; refresh=true bypasses cache and re-scrapes. " +
  "Returns: found, cache_status (hit|fresh|miss|error), scraped_at, expires_at, sections (array of {heading, text}).";

export const ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY = {
  source_id: ILLINOIS_WILDFLOWERS_SOURCE_ID,
  name: "Illinois Wildflowers — Photographic Reference for Illinois Wild Plants",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Photographic species profiles for wild plants of Illinois, organized by habitat type across eight sections: prairie, savanna, woodland, wetland, weeds, grasses, trees, and mosses. " +
    "From Illinois Wildflowers, a photographic botanical reference maintained by John Hilty.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL(s) to Illinois Wildflowers species page(s), one per habitat section in which the species appears (base endpoint); " +
    "or parsed prose sections from the species page (species-text endpoint: found, cache_status, scraped_at, expires_at, sections[])",
  dependencies: [] as string[],
  update_frequency:
    "Manual re-import via admin endpoint. All eight section indexes are re-scraped when triggered.",
  known_limitations:
    "Coverage is limited to Illinois flora. " +
    "A species not found in the indexes returns found: false even if present in Illinois. " +
    "Species may appear in multiple sections (multiple URLs returned). " +
    "Nomenclature follows the site's taxonomy, which may differ from current accepted names.",
  metadata_url: "/api/illinois-wildflowers/metadata",
  explorer_url: "/source/illinois-wildflowers",
  permission_granted: ILLINOIS_WILDFLOWERS_PERMISSION_GRANTED,
  permission_status: ILLINOIS_WILDFLOWERS_PERMISSION_STATUS,
  general_summary: ILLINOIS_WILDFLOWERS_GENERAL_SUMMARY,
  technical_details: ILLINOIS_WILDFLOWERS_TECHNICAL_DETAILS,
};
