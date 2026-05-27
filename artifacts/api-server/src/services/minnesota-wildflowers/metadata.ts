export const MINNESOTA_WILDFLOWERS_SOURCE_ID = "minnesota-wildflowers";

export const MINNESOTA_WILDFLOWERS_LICENSE = "all-rights-reserved";

export const MINNESOTA_WILDFLOWERS_RIGHTS =
  "Content from minnesotawildflowers.info is © Sue Dingwell. All rights reserved. No explicit license is published; FERNS access is read-only for non-commercial research purposes.";

export const MINNESOTA_WILDFLOWERS_WEBSITE_URL_PATTERNS = {
  species_page: "https://www.minnesotawildflowers.info/{category}/{common-name-slug}",
};

export const MINNESOTA_WILDFLOWERS_LICENSES: string[] = [];

export const MINNESOTA_WILDFLOWERS_LICENSE_NOTES =
  "OPEN — minnesotawildflowers.info is a public botanical reference site maintained by Sue Dingwell. " +
  "FERNS indexes the species list from the publicly accessible /page/plants-by-name page " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const MINNESOTA_WILDFLOWERS_GENERAL_SUMMARY =
  "Photographic field guide for native and naturalized plants of Minnesota, maintained by Sue Dingwell " +
  "(minnesotawildflowers.info), a privately operated botanical website. " +
  "Data type: species profile pages with photos, descriptions, identification notes, and bloom time " +
  "information; covers ~1,861 taxa organized by plant type (flower, tree, grass-sedge-rush, fern, shrub, " +
  "vine, aquatic) with URLs using common-name slugs under category paths. " +
  "Geographic scope: Minnesota; taxonomic scope: native and naturalized vascular plants of Minnesota. " +
  "FERNS imports the authoritative species list from the site's plants-by-name index and stores " +
  "species-to-URL mappings in its local database; no live scraping occurs at query time for URL lookup. " +
  "A query returns the direct species profile URL or found: false; " +
  "URLs use common-name slugs not derivable from scientific names — the species list index is authoritative. " +
  "The index reflects the site at the time of the last admin-triggered import. " +
  "Exact binomial match required (case-insensitive); subspecies and varieties follow site taxonomy. " +
  "FERNS also provides a species-text endpoint that fetches and parses the full Minnesota Wildflowers species page HTML, " +
  "extracting named prose sections (Description, Habitat, Leaves, Flowers, Fruit, Notes, and more) " +
  "and caching the result permanently in the local database; the cache can be bypassed with refresh=true.";

export const MINNESOTA_WILDFLOWERS_TECHNICAL_DETAILS =
  "Primary source: https://www.minnesotawildflowers.info/page/plants-by-name. " +
  "Maintained by Sue Dingwell (minnesotawildflowers.info). " +
  "Import method: HTML parse — extracts all <a href='/category/slug'>Scientific Name</a> links " +
  "where the link text is the scientific name and the href is a category-qualified common-name slug. " +
  "Species count: ~1,861 at time of last import. " +
  "URL pattern: https://www.minnesotawildflowers.info/{category}/{common-name-slug} " +
  "where category is flower, tree, grass-sedge-rush, fern, shrub, vine, or aquatic. " +
  "Lookup method: ILIKE match on stored scientific_name (case-insensitive). " +
  "Method: species_list_scrape with DB lookup. No HTTP validation at query time. " +
  "DB table: botanical_species_lists (columns: id serial PK, site_id text, scientific_name text, url text, section text, imported_at; " +
  "unique on (site_id, scientific_name, section)). Coverage: ~1,861 taxa at last import. " +
  "Species-text endpoint: GET /api/minnesota-wildflowers/species-text?species={binomial}&refresh={bool}. " +
  "Cache: permanent (no TTL); refresh=true bypasses cache and re-scrapes. " +
  "Envelope: FERNS Envelope Contract v1; permission_granted=false for species-text (scraped_text endpoint).";

export const MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY = {
  source_id: MINNESOTA_WILDFLOWERS_SOURCE_ID,
  name: "Minnesota Wildflowers — Photographic Field Guide for Minnesota Plants",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Photographic field guide and species profiles for native and naturalized plants of Minnesota, covering roughly 1,861 taxa with photos, descriptions, and identification notes. " +
    "From Minnesota Wildflowers, a photographic botanical reference maintained by Sue Dingwell.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL to the Minnesota Wildflowers species page, or found: false if not indexed (base endpoint); " +
    "or parsed prose sections from the species page via provenance envelope (species-text endpoint)",
  dependencies: [] as string[],
  update_frequency:
    "Manual re-import via admin endpoint. Species list re-scraped from the site when triggered.",
  known_limitations:
    "Coverage is limited to Minnesota flora (native and naturalized). " +
    "URLs use common-name slugs not derivable from scientific names — the species list index is authoritative. " +
    "Exact binomial match required (case-insensitive); subspecies and varieties follow site taxonomy.",
  metadata_url: "/api/minnesota-wildflowers/metadata",
  explorer_url: "/source/minnesota-wildflowers",
  licenses: MINNESOTA_WILDFLOWERS_LICENSES,
  license_notes: MINNESOTA_WILDFLOWERS_LICENSE_NOTES,
  license: MINNESOTA_WILDFLOWERS_LICENSE,
  rights: MINNESOTA_WILDFLOWERS_RIGHTS,
  website_url_patterns: MINNESOTA_WILDFLOWERS_WEBSITE_URL_PATTERNS,
  general_summary: MINNESOTA_WILDFLOWERS_GENERAL_SUMMARY,
  technical_details: MINNESOTA_WILDFLOWERS_TECHNICAL_DETAILS,
  non_passthrough_endpoints: [
    { endpoint: "/api/minnesota-wildflowers/metadata", kind: "metadata" },
    { endpoint: "/api/minnesota-wildflowers/species-text", kind: "scraped_text" },
  ],
  permission_granted: true,
};
