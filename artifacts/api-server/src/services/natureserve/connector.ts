import { NATURESERVE_API_BASE, NATURESERVE_EXPLORER_BASE, NATURESERVE_SOURCE_ID, NATURESERVE_GENERAL_SUMMARY, NATURESERVE_TECHNICAL_DETAILS } from "./metadata.js";

export const NATURESERVE_SEARCH_SPECIES_URL = `${NATURESERVE_API_BASE}/speciesSearch`;
export const NATURESERVE_SEARCH_URL = `${NATURESERVE_API_BASE}/search`;
export const NATURESERVE_TAXON_URL = (id: string) => `${NATURESERVE_API_BASE}/taxon/${id}`;

export interface NatureserveSpeciesResult {
  scientific_name: string | null;
  common_name: string | null;
  global_rank: string | null;
  rounded_global_rank: string | null;
  national_rank: string | null;
  rounded_national_rank: string | null;
  state_code: string;
  state_rank: string | null;
  rounded_state_rank: string | null;
  iucn_category: string | null;
  iucn_description: string | null;
  federal_status: string | null;
  federal_status_description: string | null;
  state_status: string | null;
  cites_description: string | null;
  cosewic_code: string | null;
  cosewic_description: string | null;
  natureserve_url: string | null;
  element_global_id: string | null;
  search_upstream_url: string;
  detail_upstream_url: string | null;
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

function extractStateRank(
  elementNationals: Record<string, unknown>[] | undefined,
  stateCode: string,
): { srank: string | null; roundedSRank: string | null } {
  if (!elementNationals) return { srank: null, roundedSRank: null };
  const usNational = elementNationals.find(
    (n) => (n.nation as Record<string, unknown>)?.isoCode === "US",
  );
  if (!usNational) return { srank: null, roundedSRank: null };
  const subnationals = usNational.elementSubnationals as Record<string, unknown>[] | undefined;
  if (!subnationals) return { srank: null, roundedSRank: null };
  const stateRecord = subnationals.find(
    (s) => (s.subnation as Record<string, unknown>)?.subnationCode === stateCode.toUpperCase(),
  );
  if (!stateRecord) return { srank: null, roundedSRank: null };
  return {
    srank: (stateRecord.srank as string) ?? null,
    roundedSRank: (stateRecord.roundedSRank as string) ?? null,
  };
}

function extractUsNationalRank(
  elementNationals: Record<string, unknown>[] | undefined,
): { nrank: string | null; roundedNRank: string | null } {
  if (!elementNationals) return { nrank: null, roundedNRank: null };
  const usNational = elementNationals.find(
    (n) => (n.nation as Record<string, unknown>)?.isoCode === "US",
  );
  if (!usNational) return { nrank: null, roundedNRank: null };
  return {
    nrank: (usNational.nrank as string) ?? null,
    roundedNRank: (usNational.roundedNRank as string) ?? null,
  };
}

function deriveStateStatus(srank: string | null): string | null {
  if (!srank) return null;
  const rank = srank.toUpperCase();
  if (rank.startsWith("S1") || rank === "SX" || rank === "SH") return "State Endangered or Extirpated";
  if (rank.startsWith("S2")) return "State Threatened";
  if (rank.startsWith("S3")) return "State Special Concern";
  return null;
}

export async function searchSpecies(name: string, stateCode: string = "MI"): Promise<NatureserveSpeciesResult> {
  const searchUrl = NATURESERVE_SEARCH_SPECIES_URL;
  const searchBody = {
    criteriaType: "species",
    textCriteria: [{ paramType: "quickSearch", searchToken: name.trim() }],
    pagingOptions: { recordsPerPage: 5, page: 0 },
  };

  const searchRaw = (await natureserveFetch(searchUrl, {
    method: "POST",
    body: JSON.stringify(searchBody),
  })) as Record<string, unknown>;

  const results = searchRaw.results as Record<string, unknown>[] | undefined;

  if (!results || results.length === 0) {
    return {
      scientific_name: null,
      common_name: null,
      global_rank: null,
      rounded_global_rank: null,
      national_rank: null,
      rounded_national_rank: null,
      state_code: stateCode.toUpperCase(),
      state_rank: null,
      rounded_state_rank: null,
      iucn_category: null,
      iucn_description: null,
      federal_status: null,
      federal_status_description: null,
      state_status: null,
      cites_description: null,
      cosewic_code: null,
      cosewic_description: null,
      natureserve_url: null,
      element_global_id: null,
      search_upstream_url: searchUrl,
      detail_upstream_url: null,
    };
  }

  const first = results[0];
  const elementGlobalId = first.elementGlobalId as number | undefined;
  if (!elementGlobalId) {
    const gRank = (first.gRank as string) ?? null;
    return {
      scientific_name: (first.scientificName as string) ?? null,
      common_name: (first.primaryCommonName as string) ?? null,
      global_rank: gRank,
      rounded_global_rank: (first.roundedGRank as string) ?? null,
      national_rank: null,
      rounded_national_rank: null,
      state_code: stateCode.toUpperCase(),
      state_rank: null,
      rounded_state_rank: null,
      iucn_category: null,
      iucn_description: null,
      federal_status: null,
      federal_status_description: null,
      state_status: null,
      cites_description: null,
      cosewic_code: null,
      cosewic_description: null,
      natureserve_url: buildNsxUrl(first.nsxUrl as string),
      element_global_id: null,
      search_upstream_url: searchUrl,
      detail_upstream_url: null,
    };
  }

  const uniqueId = `ELEMENT_GLOBAL.2.${elementGlobalId}`;
  const detailUrl = NATURESERVE_TAXON_URL(uniqueId);
  const detail = (await natureserveFetch(detailUrl)) as Record<string, unknown>;

  const iucn = detail.iucn as Record<string, unknown> | null | undefined;
  const speciesGlobal = detail.speciesGlobal as Record<string, unknown> | null | undefined;
  const usesa = speciesGlobal?.usesa as Record<string, unknown> | null | undefined;
  const cites = speciesGlobal?.cites as Record<string, unknown> | null | undefined;
  const cosewic = speciesGlobal?.cosewic as Record<string, unknown> | null | undefined;
  const elementNationals = detail.elementNationals as Record<string, unknown>[] | undefined;
  const { nrank, roundedNRank } = extractUsNationalRank(elementNationals);
  const { srank, roundedSRank } = extractStateRank(elementNationals, stateCode);
  const stateStatus = deriveStateStatus(srank);

  return {
    scientific_name: (detail.scientificName as string) ?? null,
    common_name: (detail.primaryCommonName as string) ?? null,
    global_rank: (detail.grank as string) ?? null,
    rounded_global_rank: (detail.roundedGRank as string) ?? null,
    national_rank: nrank,
    rounded_national_rank: roundedNRank,
    state_code: stateCode.toUpperCase(),
    state_rank: srank,
    rounded_state_rank: roundedSRank,
    iucn_category: (iucn?.iucnCode as string) ?? null,
    iucn_description: (iucn?.iucnDescEn as string) ?? null,
    federal_status: (usesa?.usesaCode as string) ?? null,
    federal_status_description: (usesa?.usesaDescEn as string) ?? null,
    state_status: stateStatus,
    cites_description: (cites?.citesDescEn as string) ?? null,
    cosewic_code: (cosewic?.cosewicCode as string) ?? null,
    cosewic_description: (cosewic?.cosewicDescEn as string) ?? null,
    natureserve_url: buildNsxUrl(detail.nsxUrl as string),
    element_global_id: uniqueId,
    search_upstream_url: searchUrl,
    detail_upstream_url: detailUrl,
  };
}

export function buildSpeciesCacheKey(name: string, stateCode: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  const state = stateCode.toUpperCase();
  return `natureserve:species:${normalized}:${state}`;
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
    // The search endpoint only provides roundedNRank (not a separate nrank).
    // We surface it as us_national_rank so the UI can display it.
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
