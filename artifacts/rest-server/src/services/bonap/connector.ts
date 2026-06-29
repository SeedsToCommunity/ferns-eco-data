export type MapType = "county_species" | "state_species";

/**
 * Builds the FERNS cache key for a BONAP map lookup.
 * Uses lowercase genus and species for key stability.
 */
export function buildCacheKey(genus: string, species: string, mapType: MapType): string {
  const g = genus.toLowerCase();
  const s = species.toLowerCase();
  if (mapType === "state_species") return `bonap:state:${g}:${s}`;
  return `bonap:county:${g}:${s}`;
}
