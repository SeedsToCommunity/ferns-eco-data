export const GOBOTANY_SOURCE_ID = "gobotany";

export const GOBOTANY_PERMISSION_GRANTED = true;

export const GOBOTANY_PERMISSION_STATUS =
  "OPEN — Go Botany is a free public botanical reference maintained by the Native Plant Trust (formerly New England Wild Flower Society). " +
  "No authentication required. URLs are constructed directly from scientific names without scraping.";

export const GOBOTANY_GENERAL_SUMMARY =
  "Go Botany is an interactive botanical key and species reference for New England plants, " +
  "maintained by the Native Plant Trust (nativeplanttrust.org). " +
  "The database covers vascular plants native and naturalized in New England (CT, MA, ME, NH, RI, VT). " +
  "Each species has a profile page with botanical description, distribution maps, photos, key characteristics, " +
  "and links to related taxa. URLs follow a deterministic pattern: " +
  "gobotany.nativeplanttrust.org/species/{genus}/{species}/ — constructed directly from the scientific name. " +
  "FERNS validates the URL via HTTP GET before returning it. A 200 response confirms the species is in the Go Botany database; " +
  "a non-200 response means the species is not indexed (e.g., not native or naturalized in New England).";

export const GOBOTANY_TECHNICAL_DETAILS =
  "Source: gobotany.nativeplanttrust.org. Maintained by Native Plant Trust, Framingham, MA. " +
  "URL construction: https://gobotany.nativeplanttrust.org/species/{genus}/{species}/ " +
  "where {genus} and {species} are lowercase. " +
  "Validation method: HTTP GET — 200 = species exists in Go Botany; 404 = not indexed. " +
  "Geographic scope: New England (CT, MA, ME, NH, RI, VT). " +
  "Covers vascular plants (native and naturalized); mosses, lichens, and algae are out of scope. " +
  "Subspecies and varieties are not individually keyed — only binomials are supported. " +
  "Method: direct_construction with HTTP validation.";

export const GOBOTANY_REGISTRY_ENTRY = {
  source_id: GOBOTANY_SOURCE_ID,
  name: "Go Botany — Native Plant Trust New England Flora Reference",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Interactive botanical key and species reference for vascular plants native and naturalized in New England, " +
    "maintained by the Native Plant Trust. " +
    "Provides species profile URLs constructed directly from scientific names, validated via HTTP. " +
    "Covers CT, MA, ME, NH, RI, and VT. Returns a direct species page URL or indicates the species is not in the New England flora.",
  input_summary: "Scientific name (binomial: genus + species epithet)",
  output_summary:
    "Direct URL to the Go Botany species profile page, validation method, and found/not-found status",
  dependencies: [] as string[],
  update_frequency:
    "Live — URLs are validated at query time via HTTP. The Go Botany database is updated periodically by Native Plant Trust staff.",
  known_limitations:
    "Coverage is limited to New England (CT, MA, ME, NH, RI, VT). " +
    "Subspecies, varieties, and hybrids are not individually profiled. " +
    "Taxa present in southern or midwestern US but not New England return found: false. " +
    "Taxonomic synonyms not recognized by Go Botany will return 404 even if the species occurs in New England.",
  metadata_url: "/api/gobotany/metadata",
  explorer_url: "/source/gobotany",
};
