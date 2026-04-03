export const GOOGLE_IMAGES_SOURCE_ID = "google-images";

export const GOOGLE_IMAGES_PERMISSION_GRANTED = true;

export const GOOGLE_IMAGES_PERMISSION_STATUS =
  "OPEN — Google Images search URLs are publicly accessible without authentication. " +
  "FERNS constructs a search URL from the scientific name; no Google API key is required. " +
  "This source returns a search results page URL, not a direct image URL.";

export const GOOGLE_IMAGES_GENERAL_SUMMARY =
  "Google Images is the image search component of Google Search (images.google.com). " +
  "FERNS constructs a Google Images search URL for any scientific name using the standard query string format: " +
  "https://www.google.com/search?tbm=isch&q={scientific+name}. " +
  "The URL is always valid — Google Images accepts any query string. " +
  "No HTTP validation is performed because the URL is guaranteed to return results (even if no photos exist for the species). " +
  "This source is useful for quick visual identification of unfamiliar taxa using Google's aggregated image index.";

export const GOOGLE_IMAGES_TECHNICAL_DETAILS =
  "Source: google.com/images. Operated by Google LLC. " +
  "URL construction: https://www.google.com/search?tbm=isch&q={URL-encoded scientific name} " +
  "where {scientific name} is the exact binomial as provided. " +
  "Method: direct_construction (no HTTP validation — always valid). " +
  "No rate limiting is applied server-side; client browsers handle rate limiting through normal browser usage. " +
  "This source provides no species data, provenance, or structured metadata — only an image search URL.";

export const GOOGLE_IMAGES_REGISTRY_ENTRY = {
  source_id: GOOGLE_IMAGES_SOURCE_ID,
  name: "Google Images — Web Image Search for Plant Identification",
  knowledge_type: "web_reference",
  status: "live",
  description:
    "Google Images search URL for any scientific name. " +
    "Constructed directly from the queried scientific name — always valid, no lookup required. " +
    "Useful for rapid visual identification using Google's aggregated image index. " +
    "Returns a search results URL, not individual image URLs or structured species data.",
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
};
