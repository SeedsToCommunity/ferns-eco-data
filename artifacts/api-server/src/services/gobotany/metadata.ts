export const GOBOTANY_SOURCE_ID = "gobotany";

export const GOBOTANY_PERMISSION_GRANTED = true;

export const GOBOTANY_PERMISSION_STATUS =
  "OPEN — Go Botany is a free public botanical reference maintained by the Native Plant Trust (formerly New England Wild Flower Society). " +
  "No authentication required. URLs are constructed directly from scientific names without scraping.";

export const GOBOTANY_GENERAL_SUMMARY =
  "Interactive botanical key and species reference for New England plants, maintained by the " +
  "Native Plant Trust (nativeplanttrust.org), a conservation organization based in Framingham, MA. " +
  "Data type: species profile pages with botanical description, distribution maps, photos, key " +
  "characteristics, and links to related taxa; covers vascular plants native and naturalized in New England. " +
  "Geographic scope: New England (CT, MA, ME, NH, RI, VT) only; taxonomic scope: vascular plants " +
  "(mosses, lichens, and algae are not included; only binomials supported, not subspecies or varieties). " +
  "FERNS constructs a URL from the plant scientific name and checks whether it exists on the Go Botany website; no data is stored locally. " +
  "A query returns the direct species profile URL and found/not-found status; " +
  "a 200 HTTP response confirms the species is in the Go Botany database. " +
  "URLs are validated at query time; the Go Botany database is updated periodically by Native Plant Trust staff. " +
  "Taxonomic synonyms not recognized by Go Botany will return 404 even if the species occurs in New England. " +
  "Go Botany covers New England only — for comparable regional references within FERNS, " +
  "use Illinois Wildflowers (illinois-wildflowers) for Illinois, Minnesota Wildflowers (minnesota-wildflowers) for Minnesota, " +
  "Missouri Plants (missouri-plants) for Missouri, or Prairie Moon (prairie-moon) for Midwest nursery availability. " +
  "For North America-wide plant reference, use Lady Bird Johnson Wildflower Center (lady-bird-johnson) or USDA PLANTS (usda-plants).";

export const GOBOTANY_TECHNICAL_DETAILS =
  "Source: gobotany.nativeplanttrust.org. Maintained by Native Plant Trust, Framingham, MA. " +
  "URL construction: https://gobotany.nativeplanttrust.org/species/{genus}/{species}/ " +
  "where {genus} and {species} are lowercase. " +
  "Validation method: HTTP GET — 200 = species exists in Go Botany; 404 = not indexed. " +
  "Geographic scope: New England (CT, MA, ME, NH, RI, VT). " +
  "Covers vascular plants (native and naturalized); mosses, lichens, and algae are out of scope. " +
  "Subspecies and varieties are not individually keyed — only binomials are supported. " +
  "No DB table — URL is constructed at query time and validated via HTTP GET; no data is persisted. " +
  "Coverage: New England vascular plants (native and naturalized) across the six states; Go Botany does not publish a fixed species count. " +
  "Overlap with other FERNS sources: For comparable regional references, use Illinois Wildflowers (illinois-wildflowers) for Illinois, " +
  "Minnesota Wildflowers (minnesota-wildflowers) for Minnesota, Missouri Plants (missouri-plants) for Missouri, " +
  "Prairie Moon (prairie-moon) for Midwest nursery catalog coverage. " +
  "For North America-wide plant reference, use Lady Bird Johnson Wildflower Center (lady-bird-johnson) or USDA PLANTS (usda-plants). " +
  "For plant scientific name verification, use GBIF (gbif). For conservation status, use NatureServe (natureserve). " +
  "Go Botany does not provide distribution data, conservation ranks, C-values, or phenology — use dedicated FERNS sources for those. " +
  "Method: direct_construction with HTTP validation.";

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
  permission_granted: GOBOTANY_PERMISSION_GRANTED,
  permission_status: GOBOTANY_PERMISSION_STATUS,
  general_summary: GOBOTANY_GENERAL_SUMMARY,
  technical_details: GOBOTANY_TECHNICAL_DETAILS,
};
