export const PRAIRIE_MOON_SOURCE_ID = "prairie-moon";

export const PRAIRIE_MOON_PERMISSION_GRANTED = true;

export const PRAIRIE_MOON_PERMISSION_STATUS =
  "OPEN — prairiemoon.com is a public e-commerce and reference site for native plants. " +
  "FERNS indexes plant URLs from the publicly accessible sitemap.xml " +
  "and stores species-to-URL mappings in its local database. " +
  "No authentication or API key is required.";

export const PRAIRIE_MOON_GENERAL_SUMMARY =
  "Prairie Moon Nursery (Winona, Minnesota) is a leading native plant supplier for the Upper Midwest and Great Plains. " +
  "Their website lists roughly 970 native species — wildflowers, grasses, sedges, ferns, and woody plants — " +
  "with growing notes, ecological context, and nursery availability. " +
  "FERNS imports Prairie Moon's full plant catalog periodically and stores it locally; " +
  "when you query by plant scientific name, FERNS looks it up in that local index and returns a direct link " +
  "to the Prairie Moon plant page if a match exists. " +
  "The data reflects the time of the last import, not live nursery stock. " +
  "Prairie Moon covers nursery availability and growing information only — it is not a scientific taxonomic source " +
  "and does not include distribution data, nativity status, or conservation rankings. " +
  "For plant scientific name verification and synonym resolution, use GBIF (gbif). " +
  "For regional distribution in Michigan, use Michigan Flora (miflora). " +
  "For North American distribution and nativity status, use BONAP (bonap-napa). " +
  "For C-values and ecological quality assessment, use Universal FQA (universal-fqa). " +
  "Prairie Moon overlaps in geographic scope with Illinois Wildflowers (illinois-wildflowers) and " +
  "Minnesota Wildflowers (minnesota-wildflowers), but Prairie Moon's value is nursery availability — " +
  "use regional wildflower references for identification, and Prairie Moon for sourcing.";

export const PRAIRIE_MOON_TECHNICAL_DETAILS =
  "Primary source: https://www.prairiemoon.com/sitemap.xml. Operator: Prairie Moon Nursery, Winona, MN (prairiemoon.com). " +
  "Access method: sitemap_scrape. Sitemap parsed at import time; plant URLs filtered from root-level paths matching " +
  "{genus}-{species}-{common-name-slug}, excluding /category/, /cart/, and /info/ paths (~970 plant URLs at last import). " +
  "Scientific name inference from URL slug: genus = parts[0] capitalized; species = parts[1] lowercase; " +
  "trinomial recognized when parts[2] is 'subsp' or 'var' (infraspecific epithet = parts[3]). " +
  "DB table: botanical_species_lists (columns: id serial PK, site_id text, scientific_name text, url text, section text, imported_at; " +
  "unique on (site_id, scientific_name, section)). " +
  "Caching: full import on demand via POST /api/prairie-moon/import (admin-protected); no TTL; data is permanent until re-imported. " +
  "Auto-import on startup when the botanical_species_lists table has no Prairie Moon rows. " +
  "FERNS returns: found (bool), species (inferred scientific name string), url (direct plant page URL string), " +
  "validation_method = 'species_list_lookup', imported_at (timestamp). " +
  "Lookup method: ILIKE match on scientific_name column — case-insensitive, no fuzzy matching, exact binomial required. " +
  "Coverage: ~970 plant URLs across vascular plants (wildflowers, grasses, sedges, ferns, and woody plants) commercially " +
  "available from Prairie Moon Nursery at time of last import. Geographic focus: Upper Midwest and Great Plains. " +
  "Known limitation: URL slug spelling may not match current accepted taxonomy — synonyms and older names not yet updated " +
  "on the Prairie Moon site will not match. " +
  "Prairie Moon is a nursery catalog, not a scientific taxonomic authority. It does not provide distribution data, " +
  "nativity status, conservation status, or C-values. " +
  "Overlap with other FERNS sources: For taxonomy verification, use GBIF (gbif). " +
  "For Michigan county-level distribution, use Michigan Flora (miflora). " +
  "For North American distribution and nativity status, use BONAP (bonap-napa). " +
  "For C-values and ecological quality assessment, use Universal FQA (universal-fqa). " +
  "For floristic plant references in Illinois, use Illinois Wildflowers (illinois-wildflowers). " +
  "For Minnesota plant references, use Minnesota Wildflowers (minnesota-wildflowers). " +
  "Prairie Moon is the only FERNS source for nursery commercial availability confirmation and direct plant page " +
  "URLs for Midwest and Great Plains native species.";

export const PRAIRIE_MOON_REGISTRY_ENTRY = {
  source_id: PRAIRIE_MOON_SOURCE_ID,
  name: "Prairie Moon Nursery — Native Plant Reference and Nursery Catalog",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Growing notes, ecological information, and nursery availability for roughly 970 native wildflowers, grasses, and sedges of the Midwest and Great Plains. " +
    "From Prairie Moon Nursery, a leading native plant nursery and field reference resource for the region.",
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
