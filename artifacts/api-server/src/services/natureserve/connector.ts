import { NATURESERVE_API_BASE, NATURESERVE_EXPLORER_BASE, NATURESERVE_SOURCE_ID, NATURESERVE_DERIVATION_SUMMARY, NATURESERVE_DERIVATION_SCIENTIFIC } from "./metadata.js";

export const NATURESERVE_SEARCH_SPECIES_URL = `${NATURESERVE_API_BASE}/speciesSearch`;
export const NATURESERVE_SEARCH_ALL_URL = `${NATURESERVE_API_BASE}/search`;
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

export interface CharacteristicSpecies {
  scientific_name: string;
  stratum: string | null;
  constancy_percent: number | null;
  cover_class_percent: number | null;
}

export interface NatureserveEcosystemItem {
  system_name: string;
  global_rank: string | null;
  rounded_global_rank: string | null;
  us_national_rank: string | null;
  rounded_us_national_rank: string | null;
  description_excerpt: string | null;
  national_distribution: string | null;
  characteristic_species: CharacteristicSpecies[];
  natureserve_url: string | null;
  element_global_id: string;
  record_type: string;
}

export interface NatureserveEcosystemsResult {
  items: NatureserveEcosystemItem[];
  total_results: number;
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

function extractCharacteristicSpecies(compositions: Record<string, unknown>[]): CharacteristicSpecies[] {
  if (!Array.isArray(compositions) || compositions.length === 0) return [];
  return compositions
    .slice(0, 20)
    .map((c) => ({
      scientific_name: (c.scientificName as string) ?? "",
      stratum: ((c.stratum as Record<string, unknown>)?.stratumDescEn as string) ?? null,
      constancy_percent: typeof c.constancyPercent === "number" ? c.constancyPercent : null,
      cover_class_percent: typeof c.coverClassPercent === "number" ? c.coverClassPercent : null,
    }))
    .filter((c) => c.scientific_name);
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

export async function searchEcosystems(name: string): Promise<NatureserveEcosystemsResult> {
  const searchUrl = NATURESERVE_SEARCH_ALL_URL;
  const searchBody = {
    criteriaType: "combined",
    textCriteria: [{ paramType: "quickSearch", searchToken: name.trim() }],
    pagingOptions: { recordsPerPage: 10, page: 0 },
  };

  const searchRaw = (await natureserveFetch(searchUrl, {
    method: "POST",
    body: JSON.stringify(searchBody),
  })) as Record<string, unknown>;

  const results = (searchRaw.results as Record<string, unknown>[]) ?? [];
  const totalResults = ((searchRaw.resultsSummary as Record<string, unknown>)?.totalResults as number) ?? 0;

  const ecosystemResults = results.filter((r) => r.recordType === "ECOSYSTEM");

  const items: NatureserveEcosystemItem[] = await Promise.all(
    ecosystemResults.map(async (r) => {
      const elementGlobalId = r.elementGlobalId as number;
      const uniqueId = `ELEMENT_GLOBAL.2.${elementGlobalId}`;
      const gRank = (r.gRank as string) ?? null;
      const roundedGRank = (r.roundedGRank as string) ?? null;
      const nsxUrl = buildNsxUrl(r.nsxUrl as string);

      let descriptionExcerpt: string | null = null;
      let nationalDistribution: string | null = null;
      let characteristicSpecies: CharacteristicSpecies[] = [];
      let usNationalRank: string | null = null;
      let roundedUsNationalRank: string | null = null;

      try {
        const detailUrl = NATURESERVE_TAXON_URL(uniqueId);
        const detail = (await natureserveFetch(detailUrl)) as Record<string, unknown>;
        const ecosystemGlobal = detail.ecosystemGlobal as Record<string, unknown> | null | undefined;
        descriptionExcerpt = (ecosystemGlobal?.summary as string) ?? (ecosystemGlobal?.conceptSentence as string) ?? null;
        nationalDistribution = (ecosystemGlobal?.distributionSummary as string) ?? null;
        const compositions = detail.communityCompositions as Record<string, unknown>[] | undefined;
        characteristicSpecies = extractCharacteristicSpecies(compositions ?? []);
        const { nrank, roundedNRank } = extractUsNationalRank(detail.elementNationals as Record<string, unknown>[] | undefined);
        usNationalRank = nrank;
        roundedUsNationalRank = roundedNRank;
      } catch {
        const nations = r.nations as Record<string, unknown>[] | undefined;
        const usNation = nations?.find((n) => n.nationCode === "US");
        usNationalRank = (usNation?.roundedNRank as string) ?? null;
      }

      return {
        system_name: (r.scientificName as string) ?? "",
        global_rank: gRank,
        rounded_global_rank: roundedGRank,
        us_national_rank: usNationalRank,
        rounded_us_national_rank: roundedUsNationalRank,
        description_excerpt: descriptionExcerpt ? descriptionExcerpt.slice(0, 800) : null,
        national_distribution: nationalDistribution ? nationalDistribution.slice(0, 600) : null,
        characteristic_species: characteristicSpecies,
        natureserve_url: nsxUrl,
        element_global_id: uniqueId,
        record_type: "ECOSYSTEM",
      };
    }),
  );

  return {
    items,
    total_results: totalResults,
    upstream_url: searchUrl,
  };
}

export function buildSpeciesCacheKey(name: string, stateCode: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  const state = stateCode.toUpperCase();
  return `natureserve:species:${normalized}:${state}`;
}

export function buildEcosystemsCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, "_");
  return `natureserve:ecosystems:${normalized}`;
}

export function buildProvenance(upstreamUrl: string) {
  return {
    source_id: NATURESERVE_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    derivation_summary: NATURESERVE_DERIVATION_SUMMARY,
    derivation_scientific: NATURESERVE_DERIVATION_SCIENTIFIC,
  };
}
