import {
  INAT_API_BASE,
  INAT_USER_AGENT,
  INAT_REQUEST_TIMEOUT_MS,
  INAT_SOURCE_ID,
  INAT_DERIVATION_SUMMARY,
  INAT_DERIVATION_SCIENTIFIC,
} from "./metadata.js";

export interface InatPlaceResult {
  id: number;
  display_name: string;
  place_type: number;
  place_type_name: string;
}

export interface InatPlaceLookupResult {
  query: string;
  results: InatPlaceResult[];
  found: boolean;
  source_url: string | null;
  upstream_url: string;
}

export interface InatConservationStatus {
  authority: string;
  status: string;
  status_name: string;
}

export interface InatNativeStatusEntry {
  status: string;
  place_name: string;
}

export interface InatCommonName {
  name: string;
  locale: string;
}

export interface InatSpeciesResult {
  found: boolean;
  inat_taxon_id: number | null;
  inat_name: string | null;
  match_type: "exact" | "fallback" | null;
  preferred_common_name: string | null;
  common_names: InatCommonName[];
  wikipedia_summary: string | null;
  wikipedia_url: string | null;
  default_photo_url: string | null;
  conservation_status: InatConservationStatus | null;
  native_status: InatNativeStatusEntry[];
  observations_count: number | null;
  source_url: string | null;
  search_upstream_url: string;
  record_upstream_url: string | null;
}

export interface InatPhenologyResult {
  taxon_id: number;
  place_ids: number[];
  observations_by_month: Record<string, number>;
  phenology_by_month: Record<string, Record<string, number>>;
  phenology_stages_available: string[];
  peak_observation_month: number | null;
  annotations_available: boolean;
  source_url: string;
  histogram_upstream_url: string;
  pfv_upstream_url: string;
}

export function buildPlaceCacheKey(query: string): string {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ":");
  return `inat:place:${normalized}`;
}

export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ":");
  return `inat:species:${normalized}`;
}

export function buildPhenologyCacheKey(taxonId: number, placeIds: number[]): string {
  const sortedIds = [...placeIds].sort((a, b) => a - b).join(",");
  return `inat:phenology:${taxonId}:${sortedIds}`;
}

export function sortPlaceIds(placeIds: number[]): number[] {
  return [...placeIds].sort((a, b) => a - b);
}

async function inatFetch(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": INAT_USER_AGENT,
    },
    signal: AbortSignal.timeout(INAT_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`iNaturalist API error: ${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

const INAT_PLACE_TYPE_NAMES: Record<number, string> = {
  1: "Building",
  2: "Street Segment",
  4: "ZIP Code",
  5: "Intersection",
  6: "Street",
  7: "Town",
  8: "State",
  9: "County",
  10: "Local Government Area",
  11: "Municipality",
  12: "Country",
  13: "Farm",
  100: "Open Space",
  101: "Territory",
  102: "Subdivision",
  103: "Park",
  104: "Point of Interest",
  105: "Nation",
  106: "Region",
  108: "Province",
  109: "District",
  110: "County",
  111: "Parish",
  112: "Borough",
  113: "Unincorporated Area",
};

export async function fetchPlaces(query: string): Promise<InatPlaceLookupResult> {
  const encoded = encodeURIComponent(query.trim());
  const url = `${INAT_API_BASE}/places/autocomplete?q=${encoded}&per_page=5`;

  const raw = (await inatFetch(url)) as Record<string, unknown>;
  const rawResults = (raw.results as Record<string, unknown>[]) || [];

  const results: InatPlaceResult[] = rawResults.map((r) => {
    const placeType = (r.place_type as number) ?? 0;
    return {
      id: r.id as number,
      display_name: (r.display_name as string) || "",
      place_type: placeType,
      place_type_name: INAT_PLACE_TYPE_NAMES[placeType] || `Type ${placeType}`,
    };
  });

  const found = results.length > 0;
  const source_url = found ? `https://www.inaturalist.org/places/${results[0].id}` : null;

  return {
    query: query.trim(),
    results,
    found,
    source_url,
    upstream_url: url,
  };
}

export async function fetchSpecies(name: string): Promise<InatSpeciesResult> {
  const encoded = encodeURIComponent(name.trim());
  const searchUrl = `${INAT_API_BASE}/taxa?q=${encoded}&rank=species`;

  const searchRaw = (await inatFetch(searchUrl)) as Record<string, unknown>;
  const searchResults = (searchRaw.results as Record<string, unknown>[]) || [];

  if (searchResults.length === 0) {
    return {
      found: false,
      inat_taxon_id: null,
      inat_name: null,
      match_type: null,
      preferred_common_name: null,
      common_names: [],
      wikipedia_summary: null,
      wikipedia_url: null,
      default_photo_url: null,
      conservation_status: null,
      native_status: [],
      observations_count: null,
      source_url: null,
      search_upstream_url: searchUrl,
      record_upstream_url: null,
    };
  }

  const lowerName = name.trim().toLowerCase();
  const exactMatch = searchResults.find(
    (r) => typeof r.name === "string" && r.name.toLowerCase() === lowerName && r.rank === "species",
  );
  const chosen = exactMatch ?? searchResults[0];
  const matchType: "exact" | "fallback" = exactMatch ? "exact" : "fallback";
  const taxonId = chosen.id as number;

  const recordUrl = `${INAT_API_BASE}/taxa/${taxonId}`;
  const recordRaw = (await inatFetch(recordUrl)) as Record<string, unknown>;
  const fullRecord = ((recordRaw.results as Record<string, unknown>[])?.[0] ?? recordRaw) as Record<string, unknown>;

  const preferred_common_name = (fullRecord.preferred_common_name as string) || null;

  const rawTaxonNames = (fullRecord.taxon_names as Record<string, unknown>[]) || [];
  const common_names: InatCommonName[] = rawTaxonNames
    .filter((n) => n.is_valid !== false)
    .map((n) => ({
      name: (n.name as string) || "",
      locale: (n.locale as string) || "",
    }));

  const defaultPhoto = fullRecord.default_photo as Record<string, unknown> | null;
  const default_photo_url =
    (defaultPhoto?.medium_url as string) ||
    (defaultPhoto?.url as string) ||
    null;

  const wikipedia_summary = (fullRecord.wikipedia_summary as string) || null;
  const rawWikiUrl = (fullRecord.wikipedia_url as string) || null;
  const wikipedia_url = rawWikiUrl;

  const rawConservation = fullRecord.conservation_status as Record<string, unknown> | null;
  const conservation_status: InatConservationStatus | null = rawConservation
    ? {
        authority: (rawConservation.authority as string) || "",
        status: (rawConservation.status as string) || "",
        status_name: (rawConservation.status_name as string) || "",
      }
    : null;

  const rawEstablishment = (fullRecord.establishment_means as Record<string, unknown>[]) || [];
  const native_status: InatNativeStatusEntry[] = rawEstablishment.map((e) => {
    const place = e.place as Record<string, unknown> | null;
    return {
      status: (e.establishment_means as string) || "",
      place_name: (place?.display_name as string) || (place?.name as string) || "",
    };
  });

  const observations_count = typeof fullRecord.observations_count === "number"
    ? fullRecord.observations_count
    : null;

  const inat_name = (fullRecord.name as string) || (chosen.name as string) || null;
  const source_url = `https://www.inaturalist.org/taxa/${taxonId}`;

  return {
    found: true,
    inat_taxon_id: taxonId,
    inat_name,
    match_type: matchType,
    preferred_common_name,
    common_names,
    wikipedia_summary,
    wikipedia_url,
    default_photo_url,
    conservation_status,
    native_status,
    observations_count,
    source_url,
    search_upstream_url: searchUrl,
    record_upstream_url: recordUrl,
  };
}

export async function fetchPhenology(taxonId: number, placeIds: number[]): Promise<InatPhenologyResult> {
  const sorted = sortPlaceIds(placeIds);
  const placeIdStr = sorted.join(",");
  const placeParam = placeIdStr ? `&place_id=${placeIdStr}` : "";

  const histUrl =
    `${INAT_API_BASE}/observations/histogram?taxon_id=${taxonId}${placeParam}&interval=month_of_year`;
  const pfvUrl =
    `${INAT_API_BASE}/observations/popular_field_values?taxon_id=${taxonId}${placeParam}&verifiable=true`;

  const [histRaw, pfvRaw] = await Promise.all([
    inatFetch(histUrl) as Promise<Record<string, unknown>>,
    inatFetch(pfvUrl) as Promise<Record<string, unknown>>,
  ]);

  const histResults = histRaw.results as Record<string, unknown> | null;
  const rawObsByMonth = (histResults?.month_of_year as Record<string, number>) || {};
  const observations_by_month: Record<string, number> = {};
  for (const [k, v] of Object.entries(rawObsByMonth)) {
    if (typeof v === "number" && v > 0) {
      observations_by_month[k] = v;
    }
  }

  const pfvResults = (pfvRaw.results as Record<string, unknown>[]) || [];
  const phenology_by_month: Record<string, Record<string, number>> = {};
  const stagesSet = new Set<string>();

  for (const result of pfvResults) {
    const controlledValue = result.controlled_value as Record<string, unknown> | null;
    if (!controlledValue) continue;
    const stage = (controlledValue.label as string) || "";
    if (!stage) continue;
    stagesSet.add(stage);

    const monthOfYear = result.month_of_year as Record<string, number> | null;
    if (!monthOfYear) continue;

    for (const [monthStr, count] of Object.entries(monthOfYear)) {
      if (typeof count !== "number" || count === 0) continue;
      if (!phenology_by_month[monthStr]) {
        phenology_by_month[monthStr] = {};
      }
      phenology_by_month[monthStr][stage] = (phenology_by_month[monthStr][stage] ?? 0) + count;
    }
  }

  const phenology_stages_available = Array.from(stagesSet);
  const annotations_available = stagesSet.size > 0;

  let peak_observation_month: number | null = null;
  let peakCount = -1;
  for (const [monthStr, count] of Object.entries(observations_by_month)) {
    if (count > peakCount) {
      peakCount = count;
      peak_observation_month = parseInt(monthStr, 10);
    }
  }

  const source_url = placeIdStr
    ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeIdStr}`
    : `https://www.inaturalist.org/observations?taxon_id=${taxonId}`;

  return {
    taxon_id: taxonId,
    place_ids: sorted,
    observations_by_month,
    phenology_by_month,
    phenology_stages_available,
    peak_observation_month,
    annotations_available,
    source_url,
    histogram_upstream_url: histUrl,
    pfv_upstream_url: pfvUrl,
  };
}

export function buildProvenance(upstreamUrl: string, method: "api_fetch" | "url_construction" = "api_fetch") {
  return {
    source_id: INAT_SOURCE_ID,
    fetched_at: new Date(),
    method,
    upstream_url: upstreamUrl,
    derivation_summary: INAT_DERIVATION_SUMMARY,
    derivation_scientific: INAT_DERIVATION_SCIENTIFIC,
  };
}
