export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:species:${normalized}`;
}

export function buildCountiesCacheKey(plantId: number): string {
  return `miflora:locs_sp:${plantId}`;
}

export function buildImagesCacheKey(plantId: number): string {
  return `miflora:allimage_info:${plantId}`;
}

export function buildFloraSearchCacheKey(scientificName: string): string {
  const normalized = scientificName.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:flora_search_sp:${normalized}`;
}

export function buildSpecTextCacheKey(plantId: number): string {
  return `miflora:spec_text:${plantId}`;
}

export function buildSynonymsCacheKey(plantId: number): string {
  return `miflora:synonyms:${plantId}`;
}

export function buildPImageCacheKey(plantId: number): string {
  return `miflora:pimage:${plantId}`;
}
