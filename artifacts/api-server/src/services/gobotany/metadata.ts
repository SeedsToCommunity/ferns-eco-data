export const GOBOTANY_SOURCE_ID = "gobotany";

export const GOBOTANY_LICENSE = "cc-by";

export const GOBOTANY_RIGHTS =
  "Content from gobotany.nativeplanttrust.org is published by the Native Plant Trust (formerly New England Wild Flower Society) under Creative Commons Attribution (CC BY). Attribution to the Native Plant Trust is required on any republication.";

export const GOBOTANY_WEBSITE_URL_PATTERNS = {
  species_page: "https://gobotany.nativeplanttrust.org/species/{genus}/{species}/",
};

export const GOBOTANY_LICENSES = ["cc-by"];

export const GOBOTANY_LICENSE_NOTES =
  "OPEN — Go Botany is a free public botanical reference maintained by the Native Plant Trust (formerly New England Wild Flower Society). " +
  "No authentication required. URLs are constructed directly from scientific names without scraping.";

export const GOBOTANY_GENERAL_SUMMARY =
  "Interactive botanical key and species reference for New England plants, maintained by the " +
  "Native Plant Trust (nativeplanttrust.org), a conservation organization based in Framingham, MA. " +
  "Data type: species profile pages with botanical description, distribution maps, photos, key " +
  "characteristics, and links to related taxa; covers vascular plants native and naturalized in New England. " +
  "Geographic scope: New England (CT, MA, ME, NH, RI, VT) only; taxonomic scope: vascular plants " +
  "(mosses, lichens, and algae are not included; only binomials supported, not subspecies or varieties). " +
  "FERNS constructs a URL from the plant scientific name and checks whether it exists on the Go Botany website; no data is stored locally for URL lookup. " +
  "A query returns the direct species profile URL and found/not-found status; " +
  "a 200 HTTP response confirms the species is in the Go Botany database. " +
  "URLs are validated at query time; the Go Botany database is updated periodically by Native Plant Trust staff. " +
  "Taxonomic synonyms not recognized by Go Botany will return 404 even if the species occurs in New England. " +
  "FERNS also provides a species-text endpoint that fetches and parses the full Go Botany species page HTML, " +
  "extracting named prose sections (Facts, Native New England Distribution, Growing Conditions, Similar Plants, and more) " +
  "and caching the result permanently in the local database; the cache can be bypassed with refresh=true.";

export const GOBOTANY_TECHNICAL_DETAILS =
  "Source: gobotany.nativeplanttrust.org. Maintained by Native Plant Trust, Framingham, MA. " +
  "URL construction: https://gobotany.nativeplanttrust.org/species/{genus}/{species}/ " +
  "where {genus} and {species} are lowercase. " +
  "Validation method: HTTP GET — 200 = species exists in Go Botany; 404 = not indexed. " +
  "Geographic scope: New England (CT, MA, ME, NH, RI, VT). " +
  "Covers vascular plants (native and naturalized); mosses, lichens, and algae are out of scope. " +
  "Subspecies and varieties are not individually keyed — only binomials are supported. " +
  "No DB table for URL lookup — URL is constructed at query time and validated via HTTP GET; no data is persisted for the base endpoint. " +
  "Coverage: New England vascular plants (native and naturalized) across the six states; Go Botany does not publish a fixed species count. " +
  "Method: direct_construction with HTTP validation. " +
  "Species-text endpoint: GET /api/gobotany/species-text?species={binomial}&refresh={bool}. " +
  "Fetches the Go Botany species page HTML and extracts prose sections using CSS selectors. " +
  "Cache: permanent (no TTL); refresh=true bypasses cache and re-scrapes. " +
  "Envelope: FERNS Envelope Contract v1; permission_granted=false for species-text (scraped_text endpoint).";

export const GOBOTANY_REGISTRY_ENTRY = {
  source_id: GOBOTANY_SOURCE_ID,
  name: "Go Botany — Native Plant Trust New England Flora Reference",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Identification guide and species profiles for native and naturalized vascular plants of New England (CT, MA, ME, NH, RI, VT), " +
    "with identification keys, photos, and distribution maps. " +
    "From Go Botany, a plant identification resource maintained by the Native Plant Trust in Framingham, Massachusetts.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL to the Go Botany species profile page and found/not-found status (base endpoint); " +
    "or parsed prose sections from the species page via provenance envelope (species-text endpoint)",
  dependencies: [] as string[],
  update_frequency:
    "Live — URLs are validated at query time via HTTP. The Go Botany database is updated periodically by Native Plant Trust staff.",
  known_limitations:
    "Coverage is limited to New England (CT, MA, ME, NH, RI, VT). " +
    "Subspecies, varieties, and hybrids are not individually profiled. " +
    "Taxa present in southern or midwestern US but not New England return found: false. " +
    "Taxonomic synonyms not recognized by Go Botany will return 404 even if the species occurs in New England.",
  metadata_url: "/api/gobotany/metadata",
  licenses: GOBOTANY_LICENSES,
  license_notes: GOBOTANY_LICENSE_NOTES,
  license: GOBOTANY_LICENSE,
  rights: GOBOTANY_RIGHTS,
  website_url_patterns: GOBOTANY_WEBSITE_URL_PATTERNS,
  general_summary: GOBOTANY_GENERAL_SUMMARY,
  technical_details: GOBOTANY_TECHNICAL_DETAILS,
  non_passthrough_endpoints: [
    { endpoint: "/api/gobotany/metadata", kind: "metadata" },
    { endpoint: "/api/gobotany/species-text", kind: "scraped_text" },
  ],
  permission_granted: true,
};
