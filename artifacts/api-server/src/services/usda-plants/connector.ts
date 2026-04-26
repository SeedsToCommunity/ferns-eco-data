import { USDA_PLANTS_API_BASE, USDA_PLANTS_SOURCE_ID, USDA_PLANTS_GENERAL_SUMMARY, USDA_PLANTS_TECHNICAL_DETAILS } from "./metadata.js";

export interface UsdaNameLookupResult {
  found: boolean;
  symbol: string | null;
  canonical_name: string | null;
  common_name: string | null;
  rank: string | null;
  usda_id: number | null;
  matched_input: string;
  upstream_url: string;
}

export interface UsdaSearchOutput {
  results: UsdaSearchPlantResult[];
  total: number;
  upstream_url: string;
}

export interface UsdaSearchPlantResult {
  id: number;
  symbol: string;
  accepted_symbol: string | null;
  is_synonym: boolean;
  scientific_name: string;
  scientific_name_without_author: string | null;
  common_name: string | null;
  family_name: string | null;
  rank_id: number | null;
  num_images: number;
  profile_image_filename: string | null;
  fact_sheet_urls: string[];
  plant_guide_urls: string[];
  legal_statuses: unknown[];
  wetland_data: unknown[];
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function extractNameWithoutAuthor(strippedSciName: string, wordCount: number): string {
  return strippedSciName.split(/\s+/).slice(0, wordCount).join(" ");
}

async function usdaFetch(url: string, options?: RequestInit): Promise<unknown> {
  const resp = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "FERNS/1.0",
      ...(options?.headers ?? {}),
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) {
    throw new Error(`USDA PLANTS API error: ${resp.status} ${resp.statusText} — ${url}`);
  }
  return resp.json();
}

export async function lookupByName(name: string): Promise<UsdaNameLookupResult> {
  const trimmed = name.trim();
  const encoded = encodeURIComponent(trimmed);
  const url = `${USDA_PLANTS_API_BASE}/PlantSearch?searchText=${encoded}`;

  const raw = (await usdaFetch(url)) as Array<{ Text: string; Plant: Record<string, unknown> }>;

  if (!Array.isArray(raw) || raw.length === 0) {
    return {
      found: false,
      symbol: null,
      canonical_name: null,
      common_name: null,
      rank: null,
      usda_id: null,
      matched_input: trimmed,
      upstream_url: url,
    };
  }

  const inputLower = trimmed.toLowerCase();
  const inputWordCount = trimmed.split(/\s+/).length;

  const match = raw.find((item) => {
    const sciName = item.Plant["ScientificName"] as string | null;
    if (!sciName) return false;
    const nameWithoutAuthor = extractNameWithoutAuthor(stripHtml(sciName), inputWordCount);
    return nameWithoutAuthor.toLowerCase() === inputLower;
  });

  if (!match) {
    return {
      found: false,
      symbol: null,
      canonical_name: null,
      common_name: null,
      rank: null,
      usda_id: null,
      matched_input: trimmed,
      upstream_url: url,
    };
  }

  const plant = match.Plant;
  const rawSciName = (plant["ScientificName"] as string) || "";

  return {
    found: true,
    symbol: (plant["Symbol"] as string) || null,
    canonical_name: stripHtml(rawSciName),
    common_name: (plant["CommonName"] as string) || null,
    rank: (plant["Rank"] as string) || null,
    usda_id: typeof plant["Id"] === "number" ? (plant["Id"] as number) : null,
    matched_input: trimmed,
    upstream_url: url,
  };
}

export async function fetchProfile(symbol: string): Promise<Record<string, unknown>> {
  const url = `${USDA_PLANTS_API_BASE}/PlantProfile?symbol=${encodeURIComponent(symbol)}`;
  const raw = (await usdaFetch(url)) as Record<string, unknown>;
  return raw;
}

export async function searchPlants(
  query: string,
  field: string = "Scientific Name",
  page: number = 1,
): Promise<UsdaSearchOutput> {
  const url = `${USDA_PLANTS_API_BASE}/plants-search-results`;

  const validFields = ["Scientific Name", "Common Name", "Symbol", "Family"];
  const normalizedField = validFields.includes(field) ? field : "Scientific Name";

  const body = {
    Text: query,
    Field: normalizedField,
    SortBy: "sortSciName",
    Offset: -1,
    FilterOptions: null,
    UnfilteredPlantIds: null,
    Type: "Basic",
    TaxonSearchCriteria: null,
    MasterId: -1,
    pageNumber: Math.max(1, page),
    allData: 0,
  };

  const raw = (await usdaFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  })) as Record<string, unknown>;

  const rawResults = (raw["PlantResults"] as Array<Record<string, unknown>>) ?? [];

  const results: UsdaSearchPlantResult[] = rawResults.map((r) => ({
    id: (r["Id"] as number) ?? 0,
    symbol: (r["Symbol"] as string) ?? "",
    accepted_symbol: (r["AcceptedSymbol"] as string) || null,
    is_synonym: (r["IsSynonym"] as boolean) ?? false,
    scientific_name: (r["ScientificName"] as string) ?? "",
    scientific_name_without_author: (r["ScientificNameWithoutAuthor"] as string) || null,
    common_name: (r["CommonName"] as string) || null,
    family_name: (r["FamilyName"] as string) || null,
    rank_id: typeof r["RankId"] === "number" ? (r["RankId"] as number) : null,
    num_images: (r["NumImages"] as number) ?? 0,
    profile_image_filename: (r["ProfileImageFilename"] as string) || null,
    fact_sheet_urls: (r["FactSheetUrls"] as string[]) || [],
    plant_guide_urls: (r["PlantGuideUrls"] as string[]) || [],
    legal_statuses: (r["LegalStatuses"] as unknown[]) || [],
    wetland_data: (r["WetlandData"] as unknown[]) || [],
  }));

  return {
    results,
    total: (raw["TotalResults"] as number) ?? 0,
    upstream_url: url,
  };
}

export function buildProvenance(upstreamUrl: string) {
  return {
    source_id: USDA_PLANTS_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    general_summary: USDA_PLANTS_GENERAL_SUMMARY,
    technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
  };
}
