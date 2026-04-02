export const ILLINOIS_WILDFLOWERS_SOURCE_ID = "illinois-wildflowers";

export const ILLINOIS_WILDFLOWERS_PERMISSION_GRANTED = true;

export const ILLINOIS_WILDFLOWERS_PERMISSION_STATUS =
  "OPEN — illinoiswildflowers.info is a public botanical reference site maintained by John Hilty. " +
  "FERNS indexes species lists from eight publicly accessible habitat section index pages " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const ILLINOIS_WILDFLOWERS_DERIVATION_SUMMARY =
  "Illinois Wildflowers (illinoiswildflowers.info) is a photographic reference for wild plants of Illinois, " +
  "maintained by John Hilty. " +
  "The site is organized by habitat type into eight sections: " +
  "prairie, savanna, woodland, wetland, weeds, grasses, trees, and mosses. " +
  "Each section has its own index page listing all species with links to their profile pages. " +
  "A single species may appear in multiple habitat sections (e.g., a species of both prairie and woodland). " +
  "FERNS imports all eight section indexes, aggregating them into a unified lookup table. " +
  "Link text format is 'Scientific Name (Common Name)'; FERNS extracts the scientific name from this format. " +
  "Lookups may return multiple records for the same species (one per habitat section in which it appears).";

export const ILLINOIS_WILDFLOWERS_DERIVATION_SCIENTIFIC =
  "Primary sources: eight habitat section indexes at https://www.illinoiswildflowers.info/{section}/{index}: " +
  "prairie/plant_index.htm, savanna/savanna_index.htm, woodland/woodland_index.htm, wetland/wetland_index.htm, " +
  "weeds/weed_index.htm, grasses/grass_index.htm, trees/tree_index.htm, mosses/moss_index.html. " +
  "Maintained by John Hilty (illinoiswildflowers.info). " +
  "Import method: HTML parse of each section index — extracts all relative <a href='...'>Scientific Name (Common Name)</a> links. " +
  "Scientific name is parsed from link text by stripping the parenthesized common name. " +
  "Absolute URLs are constructed by combining the section base URL with the relative href. " +
  "A species appearing in multiple sections is stored as multiple rows (one per section). " +
  "Lookup method: ILIKE match on scientific_name; may return multiple rows for different habitat sections. " +
  "Method: species_list_scrape (multi-section) with DB lookup.";

export const ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY = {
  source_id: ILLINOIS_WILDFLOWERS_SOURCE_ID,
  name: "Illinois Wildflowers — Photographic Reference for Illinois Wild Plants",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Photographic reference for wild plants of Illinois, maintained by John Hilty (illinoiswildflowers.info). " +
    "Organized by habitat type across eight sections: prairie, savanna, woodland, wetland, weeds, grasses, trees, mosses. " +
    "FERNS indexes all eight sections and returns species page URLs. " +
    "A species may appear in multiple habitat sections, returning multiple URLs.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL(s) to Illinois Wildflowers species page(s), one per habitat section in which the species appears",
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
};
