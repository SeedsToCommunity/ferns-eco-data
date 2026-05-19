import {
  INAT_API_BASE,
  INAT_USER_AGENT,
  INAT_REQUEST_TIMEOUT_MS,
  INAT_SOURCE_ID,
  INAT_GENERAL_SUMMARY,
  INAT_TECHNICAL_DETAILS,
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


export interface InatHistogramResult {
  taxon_id: number;
  place_ids: number[];
  raw_response: Record<string, unknown>;
  source_url: string;
  upstream_url: string;
}

export interface InatFieldValuesResult {
  taxon_id: number;
  place_ids: number[];
  verifiable: boolean;
  raw_response: Record<string, unknown>;
  source_url: string;
  upstream_url: string;
}

export interface InatPassthroughResult {
  raw_response: Record<string, unknown>;
  source_url: string;
  upstream_url: string;
}

export function buildPlaceCacheKey(query: string): string {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ":");
  return `inat:place:${normalized}`;
}


export function buildHistogramCacheKey(taxonId: number, placeIds: number[], termId?: number, termValueId?: number): string {
  const sortedIds = [...placeIds].sort((a, b) => a - b).join(",");
  let key = `inat:histogram:${taxonId}:${sortedIds}`;
  if (termId !== undefined) key += `:t${termId}`;
  if (termValueId !== undefined) key += `-v${termValueId}`;
  return key;
}

export function buildFieldValuesCacheKey(taxonId: number, placeIds: number[], verifiable: boolean): string {
  const sortedIds = [...placeIds].sort((a, b) => a - b).join(",");
  return `inat:fv:${taxonId}:${sortedIds}:${verifiable ? "v" : "nv"}`;
}

export function buildControlledTermsCacheKey(): string {
  return "inat:ct:all";
}

export function buildControlledTermsForTaxonCacheKey(taxonId: number): string {
  return `inat:ct:taxon:${taxonId}`;
}

export function buildTaxonByIdCacheKey(taxonId: number): string {
  return `inat:taxon:${taxonId}`;
}

export function buildPlaceByIdCacheKey(placeId: number): string {
  return `inat:place-by-id:${placeId}`;
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


export async function fetchHistogram(
  taxonId: number,
  placeIds: number[],
  termId?: number,
  termValueId?: number,
): Promise<InatHistogramResult> {
  const sorted = sortPlaceIds(placeIds);
  const placeIdStr = sorted.join(",");
  const params = new URLSearchParams();
  params.set("taxon_id", String(taxonId));
  if (placeIdStr) params.set("place_id", placeIdStr);
  params.set("interval", "month_of_year");
  if (termId !== undefined) params.set("term_id", String(termId));
  if (termValueId !== undefined) params.set("term_value_id", String(termValueId));

  const url = `${INAT_API_BASE}/observations/histogram?${params.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;

  const source_url = placeIdStr
    ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeIdStr}`
    : `https://www.inaturalist.org/observations?taxon_id=${taxonId}`;

  return {
    taxon_id: taxonId,
    place_ids: sorted,
    raw_response: raw,
    source_url,
    upstream_url: url,
  };
}

export interface InatSpeciesCountsParams {
  place_id?: string;
  quality_grade?: string;
  iconic_taxon_name?: string;
  native?: boolean;
  introduced?: boolean;
  term_id?: number;
  term_value_id?: number;
  month?: string;
  d1?: string;
  d2?: string;
  per_page?: number;
  page?: number;
  lat?: number;
  lng?: number;
  radius?: number;
  nelat?: number;
  nelng?: number;
  swlat?: number;
  swlng?: number;
}

export interface InatSpeciesCountsResult {
  raw_response: Record<string, unknown>;
  source_url: string;
  upstream_url: string;
}

export async function fetchSpeciesCounts(params: InatSpeciesCountsParams): Promise<InatSpeciesCountsResult> {
  const q = new URLSearchParams();
  if (params.place_id !== undefined) q.set("place_id", String(params.place_id));
  if (params.quality_grade) q.set("quality_grade", params.quality_grade);
  if (params.iconic_taxon_name) q.set("iconic_taxon_name", params.iconic_taxon_name);
  if (params.native !== undefined) q.set("native", String(params.native));
  if (params.introduced !== undefined) q.set("introduced", String(params.introduced));
  if (params.term_id !== undefined) q.set("term_id", String(params.term_id));
  if (params.term_value_id !== undefined) q.set("term_value_id", String(params.term_value_id));
  if (params.month) q.set("month", params.month);
  if (params.d1) q.set("d1", params.d1);
  if (params.d2) q.set("d2", params.d2);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.lat !== undefined) q.set("lat", String(params.lat));
  if (params.lng !== undefined) q.set("lng", String(params.lng));
  if (params.radius !== undefined) q.set("radius", String(params.radius));
  if (params.nelat !== undefined) q.set("nelat", String(params.nelat));
  if (params.nelng !== undefined) q.set("nelng", String(params.nelng));
  if (params.swlat !== undefined) q.set("swlat", String(params.swlat));
  if (params.swlng !== undefined) q.set("swlng", String(params.swlng));

  const url = `${INAT_API_BASE}/observations/species_counts?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;

  const sourceParts: string[] = [];
  if (params.place_id !== undefined) sourceParts.push(`place_id=${params.place_id}`);
  if (params.quality_grade) sourceParts.push(`quality_grade=${params.quality_grade}`);
  if (params.iconic_taxon_name) sourceParts.push(`iconic_taxon_name=${encodeURIComponent(params.iconic_taxon_name)}`);
  if (params.d1) sourceParts.push(`d1=${params.d1}`);
  if (params.d2) sourceParts.push(`d2=${params.d2}`);
  const source_url = `https://www.inaturalist.org/observations${sourceParts.length ? `?${sourceParts.join("&")}` : ""}`;

  return { raw_response: raw, source_url, upstream_url: url };
}

export async function fetchFieldValues(taxonId: number, placeIds: number[], verifiable: boolean): Promise<InatFieldValuesResult> {
  const sorted = sortPlaceIds(placeIds);
  const placeIdStr = sorted.join(",");
  const placeParam = placeIdStr ? `&place_id=${placeIdStr}` : "";
  const verifiableParam = `&verifiable=${verifiable}`;

  const url = `${INAT_API_BASE}/observations/popular_field_values?taxon_id=${taxonId}${placeParam}${verifiableParam}`;
  const raw = await inatFetch(url) as Record<string, unknown>;

  const source_url = placeIdStr
    ? `https://www.inaturalist.org/observations?taxon_id=${taxonId}&place_id=${placeIdStr}`
    : `https://www.inaturalist.org/observations?taxon_id=${taxonId}`;

  return {
    taxon_id: taxonId,
    place_ids: sorted,
    verifiable,
    raw_response: raw,
    source_url,
    upstream_url: url,
  };
}

export async function fetchControlledTerms(): Promise<InatPassthroughResult> {
  const url = `${INAT_API_BASE}/controlled_terms`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: "https://www.inaturalist.org/controlled_terms",
    upstream_url: url,
  };
}

export async function fetchControlledTermsForTaxon(taxonId: number): Promise<InatPassthroughResult> {
  const url = `${INAT_API_BASE}/controlled_terms/for_taxon?taxon_id=${taxonId}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/taxa/${taxonId}`,
    upstream_url: url,
  };
}

export interface InatTaxaAutocompleteParams {
  q: string;
  per_page?: number;
  is_active?: boolean;
  rank?: string;
  locale?: string;
  all_names?: boolean;
  preferred_place_id?: number;
}

export async function fetchTaxaAutocomplete(params: InatTaxaAutocompleteParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  q.set("q", params.q);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));
  if (params.is_active !== undefined) q.set("is_active", String(params.is_active));
  if (params.rank) q.set("rank", params.rank);
  if (params.locale) q.set("locale", params.locale);
  if (params.all_names !== undefined) q.set("all_names", String(params.all_names));
  if (params.preferred_place_id !== undefined) q.set("preferred_place_id", String(params.preferred_place_id));

  const url = `${INAT_API_BASE}/taxa/autocomplete?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/taxa?q=${encodeURIComponent(params.q)}`,
    upstream_url: url,
  };
}

export async function fetchTaxonById(taxonId: number): Promise<InatPassthroughResult> {
  const url = `${INAT_API_BASE}/taxa/${taxonId}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/taxa/${taxonId}`,
    upstream_url: url,
  };
}

export interface InatPlaceByIdParams {
  admin_level?: number;
}

export async function fetchPlaceById(placeId: number, params?: InatPlaceByIdParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  if (params?.admin_level !== undefined) q.set("admin_level", String(params.admin_level));
  const qs = q.toString();
  const url = `${INAT_API_BASE}/places/${placeId}${qs ? `?${qs}` : ""}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/places/${placeId}`,
    upstream_url: url,
  };
}

export interface InatPlacesNearbyParams {
  nelat: number;
  nelng: number;
  swlat: number;
  swlng: number;
  name?: string;
  per_page?: number;
}

export async function fetchPlacesNearby(params: InatPlacesNearbyParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  q.set("nelat", String(params.nelat));
  q.set("nelng", String(params.nelng));
  q.set("swlat", String(params.swlat));
  q.set("swlng", String(params.swlng));
  if (params.name) q.set("name", params.name);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));

  const url = `${INAT_API_BASE}/places/nearby?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/places?nelat=${params.nelat}&nelng=${params.nelng}&swlat=${params.swlat}&swlng=${params.swlng}`,
    upstream_url: url,
  };
}

export async function fetchTaxonSummary(observationId: number): Promise<InatPassthroughResult> {
  const url = `${INAT_API_BASE}/observations/${observationId}/taxon_summary`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/observations/${observationId}`,
    upstream_url: url,
  };
}

export interface InatSimilarSpeciesParams {
  taxon_id: number;
  place_id?: string;
  quality_grade?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  nelat?: number;
  nelng?: number;
  swlat?: number;
  swlng?: number;
}

export async function fetchSimilarSpecies(params: InatSimilarSpeciesParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  q.set("taxon_id", String(params.taxon_id));
  if (params.place_id !== undefined) q.set("place_id", String(params.place_id));
  if (params.quality_grade) q.set("quality_grade", params.quality_grade);
  if (params.lat !== undefined) q.set("lat", String(params.lat));
  if (params.lng !== undefined) q.set("lng", String(params.lng));
  if (params.radius !== undefined) q.set("radius", String(params.radius));
  if (params.nelat !== undefined) q.set("nelat", String(params.nelat));
  if (params.nelng !== undefined) q.set("nelng", String(params.nelng));
  if (params.swlat !== undefined) q.set("swlat", String(params.swlat));
  if (params.swlng !== undefined) q.set("swlng", String(params.swlng));

  const url = `${INAT_API_BASE}/identifications/similar_species?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/taxa/${params.taxon_id}`,
    upstream_url: url,
  };
}

export interface InatIdentSpeciesCountsParams {
  taxon_id?: number;
  place_id?: string;
  quality_grade?: string;
  per_page?: number;
  page?: number;
  d1?: string;
  d2?: string;
  month?: string;
  native?: boolean;
  introduced?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  nelat?: number;
  nelng?: number;
  swlat?: number;
  swlng?: number;
  order?: string;
  order_by?: string;
  taxon_of?: string;
  iconic_taxa?: string;
}

export async function fetchIdentSpeciesCounts(params: InatIdentSpeciesCountsParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  if (params.taxon_id !== undefined) q.set("taxon_id", String(params.taxon_id));
  if (params.place_id !== undefined) q.set("place_id", String(params.place_id));
  if (params.quality_grade) q.set("quality_grade", params.quality_grade);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.d1) q.set("d1", params.d1);
  if (params.d2) q.set("d2", params.d2);
  if (params.month) q.set("month", params.month);
  if (params.native !== undefined) q.set("native", String(params.native));
  if (params.introduced !== undefined) q.set("introduced", String(params.introduced));
  if (params.lat !== undefined) q.set("lat", String(params.lat));
  if (params.lng !== undefined) q.set("lng", String(params.lng));
  if (params.radius !== undefined) q.set("radius", String(params.radius));
  if (params.nelat !== undefined) q.set("nelat", String(params.nelat));
  if (params.nelng !== undefined) q.set("nelng", String(params.nelng));
  if (params.swlat !== undefined) q.set("swlat", String(params.swlat));
  if (params.swlng !== undefined) q.set("swlng", String(params.swlng));
  if (params.order) q.set("order", params.order);
  if (params.order_by) q.set("order_by", params.order_by);
  if (params.taxon_of) q.set("taxon_of", params.taxon_of);
  if (params.iconic_taxa) q.set("iconic_taxa", params.iconic_taxa);

  const url = `${INAT_API_BASE}/identifications/species_counts?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/identifications`,
    upstream_url: url,
  };
}

export interface InatRecentTaxaParams {
  place_id?: string;
  taxon_id?: number;
  quality_grade?: string;
  per_page?: number;
  page?: number;
  d1?: string;
  d2?: string;
}

export async function fetchRecentTaxa(params: InatRecentTaxaParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  if (params.place_id !== undefined) q.set("place_id", String(params.place_id));
  if (params.taxon_id !== undefined) q.set("taxon_id", String(params.taxon_id));
  if (params.quality_grade) q.set("quality_grade", params.quality_grade);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.d1) q.set("d1", params.d1);
  if (params.d2) q.set("d2", params.d2);

  const url = `${INAT_API_BASE}/identifications/recent_taxa?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/identifications`,
    upstream_url: url,
  };
}

export interface InatIdentificationsParams {
  taxon_id?: number;
  place_id?: string;
  quality_grade?: string;
  per_page?: number;
  page?: number;
  d1?: string;
  d2?: string;
  month?: string;
  native?: boolean;
  introduced?: boolean;
  lat?: number;
  lng?: number;
  radius?: number;
  nelat?: number;
  nelng?: number;
  swlat?: number;
  swlng?: number;
  locale?: string;
  user_id?: number;
  user_login?: string;
  iconic_taxa?: string;
  term_id?: number;
  term_value_id?: number;
  verifiable?: boolean;
  order?: string;
  order_by?: string;
}

export async function fetchIdentifications(params: InatIdentificationsParams): Promise<InatPassthroughResult> {
  const q = new URLSearchParams();
  if (params.taxon_id !== undefined) q.set("taxon_id", String(params.taxon_id));
  if (params.place_id !== undefined) q.set("place_id", String(params.place_id));
  if (params.quality_grade) q.set("quality_grade", params.quality_grade);
  if (params.per_page !== undefined) q.set("per_page", String(params.per_page));
  if (params.page !== undefined) q.set("page", String(params.page));
  if (params.d1) q.set("d1", params.d1);
  if (params.d2) q.set("d2", params.d2);
  if (params.month) q.set("month", params.month);
  if (params.native !== undefined) q.set("native", String(params.native));
  if (params.introduced !== undefined) q.set("introduced", String(params.introduced));
  if (params.lat !== undefined) q.set("lat", String(params.lat));
  if (params.lng !== undefined) q.set("lng", String(params.lng));
  if (params.radius !== undefined) q.set("radius", String(params.radius));
  if (params.nelat !== undefined) q.set("nelat", String(params.nelat));
  if (params.nelng !== undefined) q.set("nelng", String(params.nelng));
  if (params.swlat !== undefined) q.set("swlat", String(params.swlat));
  if (params.swlng !== undefined) q.set("swlng", String(params.swlng));
  if (params.locale) q.set("locale", params.locale);
  if (params.user_id !== undefined) q.set("user_id", String(params.user_id));
  if (params.user_login) q.set("user_login", params.user_login);
  if (params.iconic_taxa) q.set("iconic_taxa", params.iconic_taxa);
  if (params.term_id !== undefined) q.set("term_id", String(params.term_id));
  if (params.term_value_id !== undefined) q.set("term_value_id", String(params.term_value_id));
  if (params.verifiable !== undefined) q.set("verifiable", String(params.verifiable));
  if (params.order) q.set("order", params.order);
  if (params.order_by) q.set("order_by", params.order_by);

  const url = `${INAT_API_BASE}/identifications?${q.toString()}`;
  const raw = await inatFetch(url) as Record<string, unknown>;

  const sourceParts: string[] = [];
  if (params.taxon_id !== undefined) sourceParts.push(`taxon_id=${params.taxon_id}`);
  if (params.place_id !== undefined) sourceParts.push(`place_id=${params.place_id}`);
  const source_url = `https://www.inaturalist.org/identifications${sourceParts.length ? `?${sourceParts.join("&")}` : ""}`;

  return { raw_response: raw, source_url, upstream_url: url };
}

export async function fetchIdentificationById(id: number): Promise<InatPassthroughResult> {
  const url = `${INAT_API_BASE}/identifications/${id}`;
  const raw = await inatFetch(url) as Record<string, unknown>;
  return {
    raw_response: raw,
    source_url: `https://www.inaturalist.org/identifications/${id}`,
    upstream_url: url,
  };
}

export interface InatObservationSummaryRecord {
  id: number;
  uuid: string | null;
  uri: string;
  observed_on: string | null;
  quality_grade: string | null;
  obscured: boolean | null;
  license_code: string | null;
  description: string | null;
  tags: string[] | null;
  taxon_name: string | null;
  common_name: string | null;
  taxon: Record<string, unknown> | null;
  place_guess: string | null;
  location: string | null;
  observer: string | null;
  user: Record<string, unknown> | null;
  photo_url: string | null;
  photo_attribution: string | null;
  photos: Record<string, unknown>[] | null;
  annotations: Record<string, unknown>[] | null;
  ofvs: Record<string, unknown>[] | null;
}

export interface InatObservationSummaryResult {
  total_results: number;
  page: number;
  per_page: number;
  total_pages: number;
  results: InatObservationSummaryRecord[];
  source_url: string;
  upstream_url: string;
}

export interface InatObservationSummaryParams {
  taxon_id?: number | null;
  place_id?: string | null;
  quality_grade?: string | null;
  per_page?: number;
  page?: number;
  lat?: number | null;
  lng?: number | null;
  radius?: number | null;
  nelat?: number | null;
  nelng?: number | null;
  swlat?: number | null;
  swlng?: number | null;
}

export async function fetchObservationSummary(
  taxonId: number | null,
  placeId: string | null,
  qualityGrade: string | null,
  perPage: number,
  page: number,
  geoParams?: {
    lat?: number | null;
    lng?: number | null;
    radius?: number | null;
    nelat?: number | null;
    nelng?: number | null;
    swlat?: number | null;
    swlng?: number | null;
  },
  dateParams?: {
    d1?: string;
    d2?: string;
  },
): Promise<InatObservationSummaryResult> {
  const params = new URLSearchParams();
  if (taxonId !== null) params.set("taxon_id", String(taxonId));
  if (placeId !== null) params.set("place_id", String(placeId));
  if (qualityGrade) params.set("quality_grade", qualityGrade);
  params.set("per_page", String(perPage));
  params.set("page", String(page));
  params.set("order", "desc");
  params.set("order_by", "created_at");
  if (geoParams?.lat != null) params.set("lat", String(geoParams.lat));
  if (geoParams?.lng != null) params.set("lng", String(geoParams.lng));
  if (geoParams?.radius != null) params.set("radius", String(geoParams.radius));
  if (geoParams?.nelat != null) params.set("nelat", String(geoParams.nelat));
  if (geoParams?.nelng != null) params.set("nelng", String(geoParams.nelng));
  if (geoParams?.swlat != null) params.set("swlat", String(geoParams.swlat));
  if (geoParams?.swlng != null) params.set("swlng", String(geoParams.swlng));
  if (dateParams?.d1) params.set("d1", dateParams.d1);
  if (dateParams?.d2) params.set("d2", dateParams.d2);

  const url = `${INAT_API_BASE}/observations?${params.toString()}`;
  const raw = (await inatFetch(url)) as Record<string, unknown>;

  const totalResults = typeof raw.total_results === "number" ? raw.total_results : 0;
  const totalPages = totalResults > 0 ? Math.ceil(Math.min(totalResults, 10000) / perPage) : 0;

  const rawResults = (raw.results as Record<string, unknown>[]) ?? [];
  const results: InatObservationSummaryRecord[] = rawResults.map((r) => {
    const taxon = r.taxon as Record<string, unknown> | null;
    const user = r.user as Record<string, unknown> | null;
    const photos = (r.photos as Record<string, unknown>[]) ?? [];
    const firstPhoto = photos[0] ?? null;

    const rawPhotoUrl = (firstPhoto?.url as string) ?? null;
    const photo_url = rawPhotoUrl ? rawPhotoUrl.replace("/square.", "/medium.") : null;

    const rawTags = (r.tags as unknown[]) ?? [];
    const tags: string[] = rawTags
      .map((t) => {
        if (typeof t === "string") return t;
        if (typeof t === "object" && t !== null && "name" in t) return String((t as Record<string, unknown>).name);
        return null;
      })
      .filter((t): t is string => t !== null);

    const taxonRecord: Record<string, unknown> | null = taxon
      ? {
          id: taxon.id,
          rank: taxon.rank ?? null,
          name: taxon.name ?? null,
          preferred_common_name: taxon.preferred_common_name ?? null,
          iconic_taxon_name: taxon.iconic_taxon_name ?? null,
          default_photo: (taxon.default_photo as Record<string, unknown>) ?? null,
        }
      : null;

    const userRecord: Record<string, unknown> | null = user
      ? {
          id: user.id,
          login: user.login ?? null,
          name: user.name ?? null,
        }
      : null;

    return {
      id: r.id as number,
      uuid: (r.uuid as string) ?? null,
      uri: (r.uri as string) ?? `https://www.inaturalist.org/observations/${r.id}`,
      observed_on: (r.observed_on as string) ?? null,
      quality_grade: (r.quality_grade as string) ?? null,
      obscured: typeof r.obscured === "boolean" ? r.obscured : null,
      license_code: (r.license_code as string) ?? null,
      description: (r.description as string) ?? null,
      tags: tags.length > 0 ? tags : null,
      taxon_name: (taxon?.name as string) ?? null,
      common_name: (taxon?.preferred_common_name as string) ?? null,
      taxon: taxonRecord,
      place_guess: (r.place_guess as string) ?? null,
      location: (r.location as string) ?? null,
      observer: (user?.login as string) ?? null,
      user: userRecord,
      photo_url,
      photo_attribution: (firstPhoto?.attribution as string) ?? null,
      photos: photos.length > 0 ? photos : null,
      annotations: ((r.annotations as Record<string, unknown>[]) ?? null),
      ofvs: ((r.ofvs as Record<string, unknown>[]) ?? null),
    };
  });

  const sourceUrlParts: string[] = [];
  if (taxonId !== null) sourceUrlParts.push(`taxon_id=${taxonId}`);
  if (placeId !== null) sourceUrlParts.push(`place_id=${placeId}`);
  if (qualityGrade) sourceUrlParts.push(`quality_grade=${qualityGrade}`);
  if (dateParams?.d1) sourceUrlParts.push(`d1=${dateParams.d1}`);
  if (dateParams?.d2) sourceUrlParts.push(`d2=${dateParams.d2}`);
  const source_url = `https://www.inaturalist.org/observations${sourceUrlParts.length ? `?${sourceUrlParts.join("&")}` : ""}`;

  return { total_results: totalResults, page, per_page: perPage, total_pages: totalPages, results, source_url, upstream_url: url };
}

export function buildProvenance(upstreamUrl: string, method: "api_fetch" | "url_construction" = "api_fetch") {
  return {
    source_id: INAT_SOURCE_ID,
    fetched_at: new Date(),
    method,
    upstream_url: upstreamUrl,
    general_summary: INAT_GENERAL_SUMMARY,
    technical_details: INAT_TECHNICAL_DETAILS,
  };
}
