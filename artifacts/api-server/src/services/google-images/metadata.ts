export const GOOGLE_IMAGES_SOURCE_ID = "google-images";

export const GOOGLE_IMAGES_PERMISSION_GRANTED = true;

export const GOOGLE_IMAGES_PERMISSION_STATUS =
  "OPEN — Google Images search URLs are publicly accessible without authentication. " +
  "FERNS constructs a search URL from the scientific name; no Google API key is required. " +
  "This source returns a search results page URL, not a direct image URL.";

export const GOOGLE_IMAGES_GENERAL_SUMMARY =
  "Web image search URL generator for any scientific name, using Google Images " +
  "(images.google.com), a service operated by Google LLC. " +
  "Data type: a constructed search URL that opens Google Images filtered to the queried scientific name; " +
  "no structured species data, provenance, or metadata is returned. " +
  "Geographic and taxonomic scope: unlimited — Google Images indexes the public web globally. " +
  "FERNS constructs an image search link from the plant scientific name at query time; no HTTP validation is performed and no data is stored locally. " +
  "A query returns only the image search URL; the URL is always valid. " +
  "Live — URLs are constructed at query time; Google's index is continuously updated. " +
  "No authentication, no rate limiting server-side; client browsers handle normal Google rate limits. " +
  "Google Images provides no structured ecological data and should not be used as a data source — " +
  "it complements FERNS sources such as iNaturalist (inaturalist — species photos with provenance and location), " +
  "Michigan Flora (miflora — botanical illustrations), and LCSCG (lcscg — guide photographs organized by season and habitat) " +
  "by offering a quick, unfiltered visual overview when those sources return no image or when an unfamiliar taxon needs rapid visual confirmation. " +
  "Google Images is the only FERNS source for broad aggregated web image search with no geographic or institutional restriction.";

export const GOOGLE_IMAGES_TECHNICAL_DETAILS =
  "Source: google.com/images. Operated by Google LLC. " +
  "URL construction: https://www.google.com/search?tbm=isch&q={URL-encoded scientific name} " +
  "where {scientific name} is the exact binomial as provided. " +
  "Method: direct_construction (no HTTP validation — always valid). " +
  "No rate limiting is applied server-side; client browsers handle rate limiting through normal browser usage. " +
  "This source provides no species data, provenance, or structured metadata — only an image search URL. " +
  "No DB table — URL is constructed at query time (direct_construction); no data is persisted. " +
  "Coverage: unlimited — Google Images indexes the global public web. " +
  "Overlap with other FERNS sources: For scientific species photographs with provenance and geographic metadata, use iNaturalist (inaturalist). " +
  "For botanical illustration photographs from Michigan herbarium records, use Michigan Flora (miflora). " +
  "For illustrated seed harvest guide photographs organized by season and habitat, use LCSCG (lcscg). " +
  "Google Images is the only FERNS source for broad aggregated web image search with no geographic or institutional restriction.";

export const GOOGLE_IMAGES_REGISTRY_ENTRY = {
  source_id: GOOGLE_IMAGES_SOURCE_ID,
  name: "Google Images — Web Image Search for Plant Identification",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Image search results for any plant scientific name, drawing from Google's global index of publicly available photographs — useful for rapid visual identification of unfamiliar species. " +
    "From Google Images, a service operated by Google LLC.",
  input_summary: "Scientific name (binomial or full trinomial)",
  output_summary: "Google Images search URL for the queried scientific name",
  dependencies: [] as string[],
  update_frequency:
    "Live — URLs are constructed at query time. Google's index is continuously updated.",
  known_limitations:
    "Returns a search results page URL, not a species-specific image or structured data. " +
    "Search results may include images of similar species, cultivars, or unrelated content. " +
    "Google may change its URL format; this source should be periodically verified.",
  metadata_url: "/api/google-images/metadata",
  explorer_url: "/source/google-images",
  permission_granted: GOOGLE_IMAGES_PERMISSION_GRANTED,
  permission_status: GOOGLE_IMAGES_PERMISSION_STATUS,
  general_summary: GOOGLE_IMAGES_GENERAL_SUMMARY,
  technical_details: GOOGLE_IMAGES_TECHNICAL_DETAILS,
};
