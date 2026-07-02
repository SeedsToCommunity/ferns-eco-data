import { createHash } from "crypto";

export function buildMatchCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ":");
  return `gbif:match:${normalized}:plantae`;
}

export function buildSynonymsCacheKey(usageKey: number, limit: number, offset: number): string {
  return `gbif:synonyms:${usageKey}:${limit}:${offset}`;
}

export function buildVernacularNamesCacheKey(usageKey: number, limit: number, offset: number): string {
  return `gbif:vernacular:${usageKey}:${limit}:${offset}`;
}

export function buildSpeciesCacheKey(usageKey: number): string {
  return `gbif:species:${usageKey}`;
}

export function buildSpeciesSearchCacheKey(q: string): string {
  const normalized = q.trim().toLowerCase();
  return `gbif:species-search:${normalized}`;
}

export function buildOccurrenceParamsCacheKey(params: Record<string, string | string[]>): string {
  const sorted = Object.keys(params)
    .sort()
    .map((k) => {
      const v = params[k];
      const vals = Array.isArray(v) ? [...v].sort() : [v];
      return vals.map((val) => `${k}=${String(val).trim()}`).join("&");
    })
    .join("&");
  const hash = createHash("md5").update(sorted).digest("hex").slice(0, 12);
  return `gbif:occurrences:${hash}`;
}
