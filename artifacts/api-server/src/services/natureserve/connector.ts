export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  return `natureserve:species:${normalized}`;
}

export function buildSearchCacheKey(q: string, recordType: string, limit: number, page: number): string {
  const normalized = q.trim().toLowerCase().replace(/\s+/g, "_");
  return `natureserve:search:${recordType.toLowerCase()}:${normalized}:${limit}:${page}`;
}
