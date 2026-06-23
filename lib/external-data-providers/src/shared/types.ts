/**
 * The URL for a species page on an external botanical site, plus whether
 * it was found to exist.
 * No provenance/cache fields — those are determined by the REST Adapter.
 */
export interface BotanicalUrlResult {
  found: boolean;
  url: string;           // The species page URL (always set, even when !found)
  httpStatus: number | null; // Upstream HTTP status; null on network failure
}

/**
 * Species information retrieved from an external botanical site.
 * Named for what is returned (species information), not how it is obtained.
 * No provenance/cache fields — those are determined by the REST Adapter.
 */
export interface BotanicalSpeciesInformation {
  found: boolean;
  url: string;                               // The source page URL
  sections: Record<string, string> | null;   // Heading → prose text
  fullText: string | null;                   // Full concatenated text
  fetchError: string | null;                 // null on success; error string on failure
                                             // NOT placed in data — for REST Adapter use only
}
