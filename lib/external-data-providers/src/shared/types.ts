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
  url: string | null;                        // The source page URL; null when species is not in the list
  sections: Record<string, string> | null;   // Heading → prose text
  fullText: string | null;                   // Full concatenated text
  fetchError: string | null;                 // null on success; error string on failure
                                             // NOT placed in data — for REST Adapter use only
}

/**
 * URL lookup result from the FERNS internal botanical species lists table,
 * for sources where a single URL exists per species.
 * No HTTP status — this is a database read, not a live HTTP check.
 */
export interface BotanicalSpeciesListResult {
  found: boolean;
  scientificName: string | null;   // null when not found
  url: string | null;              // null when not found
  section: string;                 // empty string when not applicable
  importedAt: Date | null;         // null when not found
}

/**
 * URL lookup result from the FERNS internal botanical species lists table
 * for Illinois Wildflowers, where a single species can appear in multiple
 * habitat sections (prairie, savanna, woodland, wetland, etc.).
 */
export interface IllinoisWildflowersUrlResult {
  found: boolean;
  results: Array<{
    scientificName: string;
    url: string;
    section: string;
    importedAt: Date;
  }>;
}
