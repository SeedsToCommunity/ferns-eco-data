import { NATURESERVE_API_BASE, NATURESERVE_EXPLORER_BASE, NATURESERVE_SOURCE_ID, NATURESERVE_GENERAL_SUMMARY, NATURESERVE_TECHNICAL_DETAILS } from "./metadata.js";

export const NATURESERVE_SEARCH_SPECIES_URL = `${NATURESERVE_API_BASE}/speciesSearch`;
export const NATURESERVE_SEARCH_URL = `${NATURESERVE_API_BASE}/search`;

export interface NatureserveSpeciesSearchResult {
  raw_response: Record<string, unknown>;
  found: boolean;
  upstream_url: string;
}

async function natureserveFetch(url: string, options?: RequestInit): Promise<unknown> {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(options?.headers as Record<string, string> | undefined),
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) {
    throw new Error(`NatureServe API error: ${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

function buildNsxUrl(nsxPath: string | null | undefined): string | null {
  if (!nsxPath) return null;
  return `${NATURESERVE_EXPLORER_BASE}${nsxPath}`;
}

export async function searchSpecies(name: string): Promise<NatureserveSpeciesSearchResult> {
  const url = NATURESERVE_SEARCH_SPECIES_URL;
  const body = {
    criteriaType: "species",
    textCriteria: [{ paramType: "quickSearch", searchToken: name.trim() }],
    pagingOptions: { recordsPerPage: 5, page: 0 },
  };

  const raw = (await natureserveFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })) as Record<string, unknown>;

  const results = raw.results as unknown[] | undefined;
  const found = !!(results && results.length > 0);

  return {
    raw_response: raw,
    found,
    upstream_url: url,
  };
}

export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  return `natureserve:species:${normalized}`;
}

export function buildProvenance(upstreamUrl: string) {
  return {
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    general_summary: NATURESERVE_GENERAL_SUMMARY,
    technical_details: NATURESERVE_TECHNICAL_DETAILS,
  };
}

export interface NatureserveSearchItem {
  system_name: string;
  global_rank: string | null;
  rounded_global_rank: string | null;
  us_national_rank: string | null;
  rounded_us_national_rank: string | null;
  description_excerpt: string | null;
  national_distribution: string | null;
  characteristic_species: Array<{
    scientific_name: string;
    stratum: string | null;
    constancy_percent: number | null;
    cover_class_percent: number | null;
  }>;
  natureserve_url: string | null;
  element_global_id: string;
  record_type: string;
}

export interface NatureserveSearchResult {
  items: NatureserveSearchItem[];
  result_count: number;
  total_results: number;
  search_upstream_url: string;
}

export async function searchByRecordType(
  q: string,
  recordType: string = "ECOSYSTEM",
  limit: number = 10,
  page: number = 0,
): Promise<NatureserveSearchResult> {
  const searchUrl = NATURESERVE_SEARCH_URL;
  const searchBody = {
    criteriaType: "combined",
    recordTypeCriteria: [{ paramType: "recordType", recordType }],
    textCriteria: [{ paramType: "quickSearch", searchToken: q.trim() }],
    pagingOptions: { recordsPerPage: limit, page },
  };

  const raw = (await natureserveFetch(searchUrl, {
    method: "POST",
    body: JSON.stringify(searchBody),
  })) as Record<string, unknown>;

  const results = (raw.results as Record<string, unknown>[]) ?? [];
  const summary = raw.resultsSummary as Record<string, unknown> | undefined;
  const totalResults = (summary?.totalResults as number) ?? results.length;

  const items: NatureserveSearchItem[] = results.map((r) => {
    const ecosystemGlobal = r.ecosystemGlobal as Record<string, unknown> | null | undefined;
    const nations = r.nations as Record<string, unknown>[] | undefined;
    const usNation = nations?.find((n) => (n.nationCode as string) === "US");
    const usNationalRank = (usNation?.roundedNRank as string) ?? null;

    return {
      system_name: (r.scientificName as string) ?? "",
      global_rank: (r.gRank as string) ?? null,
      rounded_global_rank: (r.roundedGRank as string) ?? null,
      us_national_rank: usNationalRank,
      rounded_us_national_rank: usNationalRank,
      description_excerpt: (ecosystemGlobal?.conceptSentence as string) ?? null,
      national_distribution: null,
      characteristic_species: [],
      natureserve_url: buildNsxUrl(r.nsxUrl as string),
      element_global_id: (r.uniqueId as string) ?? "",
      record_type: (r.recordType as string) ?? recordType,
    };
  });

  return {
    items,
    result_count: items.length,
    total_results: totalResults,
    search_upstream_url: searchUrl,
  };
}

export function buildSearchCacheKey(q: string, recordType: string, limit: number, page: number): string {
  const normalized = q.trim().toLowerCase().replace(/\s+/g, "_");
  return `natureserve:search:${recordType.toLowerCase()}:${normalized}:${limit}:${page}`;
}
