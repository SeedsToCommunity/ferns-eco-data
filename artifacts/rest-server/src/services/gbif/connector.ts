import { GBIF_API_BASE } from "./metadata.js";
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

async function gbifFetch(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`GBIF API error: ${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

export async function fetchNameMatch(name: string): Promise<{ raw: unknown; upstream_url: string }> {
  const encoded = encodeURIComponent(name.trim());
  const url = `${GBIF_API_BASE}/species/match?name=${encoded}&kingdom=Plantae`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}

export async function fetchSpecies(usageKey: number): Promise<{ raw: unknown; upstream_url: string }> {
  const url = `${GBIF_API_BASE}/species/${usageKey}`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}

export async function fetchSynonyms(usageKey: number, limit = 100, offset = 0): Promise<{ raw: unknown; upstream_url: string }> {
  const url = `${GBIF_API_BASE}/species/${usageKey}/synonyms?limit=${limit}&offset=${offset}`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}

export async function fetchVernacularNames(usageKey: number, limit = 100, offset = 0): Promise<{ raw: unknown; upstream_url: string }> {
  const url = `${GBIF_API_BASE}/species/${usageKey}/vernacularNames?limit=${limit}&offset=${offset}`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}

export async function fetchVernacularSearch(q: string): Promise<{ raw: unknown; upstream_url: string }> {
  const encoded = encodeURIComponent(q.trim());
  const url = `${GBIF_API_BASE}/species/search?q=${encoded}&qField=VERNACULAR&rank=SPECIES&kingdom=Plantae&limit=20`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}

export async function fetchOccurrenceSearch(queryParams: Record<string, string | string[]>): Promise<{ raw: unknown; upstream_url: string }> {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(queryParams)) {
    if (Array.isArray(v)) {
      for (const val of v) {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`);
      }
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }
  const url = `${GBIF_API_BASE}/occurrence/search${parts.length ? "?" + parts.join("&") : ""}`;
  const raw = await gbifFetch(url);
  return { raw, upstream_url: url };
}
