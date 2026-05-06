export const LADY_BIRD_JOHNSON_SOURCE_ID = "lady-bird-johnson";

export const LADY_BIRD_JOHNSON_PERMISSION_GRANTED = true;

export const LADY_BIRD_JOHNSON_PERMISSION_STATUS =
  "OPEN — The Lady Bird Johnson Wildflower Center plant database (wildflower.org/plants) is a public reference " +
  "maintained by the Lady Bird Johnson Wildflower Center at The University of Texas at Austin. " +
  "No authentication or API key is required. " +
  "FERNS accepts a USDA Plants symbol, constructs a direct species profile URL, verifies it via HTTP, " +
  "and optionally scrapes the page text — all using a browser-like User-Agent to access the publicly available species pages.";

export const LADY_BIRD_JOHNSON_GENERAL_SUMMARY =
  "Comprehensive native plant database for North America, maintained by the Lady Bird Johnson Wildflower " +
  "Center at The University of Texas at Austin (wildflower.org/plants). " +
  "Data type: species profile pages for thousands of native North American species with habitat, bloom " +
  "time, growing conditions, regional suitability, wildlife value, and photographs. " +
  "Geographic scope: North America (emphasis on US natives; some naturalized non-natives included); " +
  "taxonomic scope: vascular plants. " +
  "FERNS accepts a USDA Plants symbol (e.g. TRGI) and constructs a direct species profile URL at " +
  "https://www.wildflower.org/plants/result.php?id_plant={SYMBOL}. " +
  "Presence is verified via HTTP (200 = found; redirect = not found); results are cached (90-day TTL for found, 30-day for not found). " +
  "Species page text is scraped and permanently cached on first request; use the species-text endpoint to retrieve it. " +
  "Live — verification and scraping are performed at query time; the Wildflower Center database is updated by staff periodically. " +
  "Lady Bird Johnson Wildflower Center covers all North American natives at broad geographic scope; " +
  "it does not provide conservation ranks, C-values, or nursery availability.";

export const LADY_BIRD_JOHNSON_TECHNICAL_DETAILS =
  "Source: https://www.wildflower.org/plants/. " +
  "Operated by Lady Bird Johnson Wildflower Center, The University of Texas at Austin. " +
  "Input: USDA Plants symbol (e.g. TRGI for Trillium grandiflorum). " +
  "URL construction: https://www.wildflower.org/plants/result.php?id_plant={SYMBOL} (symbol uppercased). " +
  "Verification: HTTP GET with redirect:manual and browser-like User-Agent (Chrome/124). " +
  "  HTTP 200 → found (cached 90 days in lbj_url_cache, cache_key = 'lbj:{SYMBOL}'). " +
  "  HTTP 3xx redirect → not_found (cached 30 days). " +
  "  HTTP 4xx → not_found (cached 30 days). " +
  "  HTTP 5xx or network error → unverified (not cached, retry on next call). " +
  "Species page text: scraped via /lady-bird-johnson/species-text?usda_symbol={SYMBOL}, " +
  "stored in species_page_text_cache (site_id='lady-bird-johnson', scientific_name=SYMBOL_UPPER). " +
  "Permanent text cache (no TTL); use ?refresh=true to re-scrape. " +
  "Scraping uses a browser-like User-Agent (required — site returns 403 to generic UAs). " +
  "Sections extracted: all h3-delimited prose sections; " +
  "excluded: 'Find Seeds or Plants', 'Mr. Smarty Plants says'. " +
  "Geographic scope: North American native plants (emphasis on US, including non-native naturalized species). " +
  "Coverage: thousands of North American native and naturalized species; exact count not published; " +
  "database is continuously updated by Wildflower Center staff. " +
  "Lady Bird Johnson Wildflower Center does not provide conservation ranks, distribution maps, C-values, or nursery availability. " +
  "Relationship to USDA PLANTS: USDA Symbol is the primary key for LBJ profile lookup " +
  "(id_plant parameter = USDA Symbol); LBJ profile retrieval depends on USDA PLANTS symbol resolution.";

export const LADY_BIRD_JOHNSON_REGISTRY_ENTRY = {
  source_id: LADY_BIRD_JOHNSON_SOURCE_ID,
  name: "Lady Bird Johnson Wildflower Center — Native Plants of North America",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Native plant species profiles for North America, with habitat preferences, bloom time, growing conditions, regional suitability, wildlife value, and photographs, covering thousands of native species. " +
    "From the Lady Bird Johnson Wildflower Center at The University of Texas at Austin. " +
    "Accepts a USDA Plants symbol (e.g. TRGI) and returns a verified direct species profile URL with optional scraped page text.",
  input_summary: "USDA Plants symbol (e.g. TRGI for Trillium grandiflorum)",
  output_summary:
    "Direct species profile URL (HTTP-verified), found/not_found/unverified status, and optionally scraped page text sections",
  dependencies: [] as string[],
  update_frequency:
    "Live — profile URL verified via HTTP at query time (90-day cache for found, 30-day for not found). Page text cached permanently; use refresh=true to re-scrape.",
  known_limitations:
    "Requires a valid USDA Plants symbol — species must be looked up in USDA PLANTS first to obtain the symbol. " +
    "Emphasis on North American natives; non-native species may not be indexed. " +
    "Site blocks non-browser User-Agents (403); FERNS uses a browser-like UA.",
  metadata_url: "/api/lady-bird-johnson/metadata",
  explorer_url: "/source/lady-bird-johnson",
  permission_granted: LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
  permission_status: LADY_BIRD_JOHNSON_PERMISSION_STATUS,
  general_summary: LADY_BIRD_JOHNSON_GENERAL_SUMMARY,
  technical_details: LADY_BIRD_JOHNSON_TECHNICAL_DETAILS,
};
