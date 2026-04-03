export const PRAIRIE_MOON_SOURCE_ID = "prairie-moon";

export const PRAIRIE_MOON_PERMISSION_GRANTED = true;

export const PRAIRIE_MOON_PERMISSION_STATUS =
  "OPEN — prairiemoon.com is a public e-commerce and reference site for native plants. " +
  "FERNS indexes plant URLs from the publicly accessible sitemap.xml " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const PRAIRIE_MOON_GENERAL_SUMMARY =
  "Native plant species reference and commercial availability data from Prairie Moon Nursery " +
  "(prairiemoon.com), a Winona, Minnesota nursery specializing in native prairie and wetland plants " +
  "for the Upper Midwest and Great Plains. " +
  "Data type: catalog of ~970 native plant product pages, each with growing information, ecological notes, " +
  "and seed/plant availability. " +
  "Geographic scope: primarily Upper Midwest and Great Plains natives; taxonomic scope: vascular plants " +
  "commercially available through the nursery catalog at time of last import. " +
  "FERNS indexes plant URLs from Prairie Moon's sitemap.xml and stores species-to-URL mappings in its " +
  "local database; no live scraping occurs at query time. " +
  "A query returns the direct product page URL or found: false if the species is not in the catalog; " +
  "scientific names are inferred from URL slug structure (genus-species-common-name-slug pattern). " +
  "The index reflects the catalog at the time of the last admin-triggered import; " +
  "catalog additions and removals are not reflected until a new import is run. " +
  "URL slugs may use site-specific spelling or older taxonomy — the inferred scientific name may not " +
  "match current accepted names in GBIF, BONAP, or USDA PLANTS. " +
  "Prairie Moon overlaps in geographic scope with Illinois Wildflowers and Minnesota Wildflowers in FERNS, " +
  "but Prairie Moon's primary value is commercial availability data, not botanical documentation — " +
  "use regional wildflower references for identification, and Prairie Moon for sourcing.";

export const PRAIRIE_MOON_TECHNICAL_DETAILS =
  "Primary source: https://www.prairiemoon.com/sitemap.xml. " +
  "Operated by Prairie Moon Nursery, Winona, MN. " +
  "Import method: Parse sitemap.xml, filter for plant URLs " +
  "(root-level paths matching {genus}-{species}-..., excluding category, cart, and info pages). " +
  "Scientific name inference from URL slug: " +
  "  Binomial: Genus species (first two parts capitalized/lowercased). " +
  "  Trinomial: Genus species subsp. epithet or Genus species var. epithet " +
  "  (when parts[2] is 'subsp' or 'var', parts[3] is the infraspecific epithet). " +
  "URL count: ~970 plant URLs at time of last import. " +
  "Lookup method: ILIKE match on inferred scientific_name. " +
  "Known limitation: URL slugs may contain site-specific spelling variants or older taxonomy — " +
  "the inferred scientific name may not match current accepted names exactly. " +
  "Method: sitemap_scrape with DB lookup.";

export const PRAIRIE_MOON_REGISTRY_ENTRY = {
  source_id: PRAIRIE_MOON_SOURCE_ID,
  name: "Prairie Moon Nursery — Native Plant Reference and Nursery Catalog",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Native plant catalog and growing reference for prairie, wetland, and woodland species, " +
    "specializing in Upper Midwest natives. Carries ~970 species with product pages including growing " +
    "information and ecological notes. FERNS indexes the catalog and returns direct product page URLs.",
  input_summary: "Scientific name (binomial or trinomial with subsp./var.)",
  output_summary:
    "Direct URL to the Prairie Moon Nursery plant page, or found: false if not in the Prairie Moon catalog",
  dependencies: [] as string[],
  update_frequency:
    "Manual re-import via admin endpoint. Sitemap re-parsed and database updated when triggered.",
  known_limitations:
    "Coverage limited to species carried by Prairie Moon Nursery (primarily Midwest natives). " +
    "Scientific names are inferred from URL slugs, which may reflect site-specific spelling or older taxonomy. " +
    "Species not in the nursery catalog return found: false.",
  metadata_url: "/api/prairie-moon/metadata",
  explorer_url: "/source/prairie-moon",
  permission_granted: PRAIRIE_MOON_PERMISSION_GRANTED,
  permission_status: PRAIRIE_MOON_PERMISSION_STATUS,
  general_summary: PRAIRIE_MOON_GENERAL_SUMMARY,
  technical_details: PRAIRIE_MOON_TECHNICAL_DETAILS,
};
