import { GBIF_API_BASE, GBIF_DERIVATION_SCIENTIFIC, GBIF_DERIVATION_SUMMARY, GBIF_SOURCE_ID } from "./metadata.js";
import { createHash } from "crypto";

export type GeographyMode = "countries" | "continent" | "bbox";

export interface GeographyParams {
  mode: GeographyMode;
  countries?: string[];
  continent?: string;
  bbox?: { minLat: number; minLon: number; maxLat: number; maxLon: number };
}

export interface GbifMatchResult {
  usage_key: number | null;
  canonical_name: string | null;
  scientific_name: string | null;
  rank: string | null;
  status: string | null;
  accepted_usage_key: number | null;
  accepted_canonical_name: string | null;
  confidence: number | null;
  match_type: "EXACT" | "FUZZY" | "HIGHERRANK" | "NONE";
  kingdom: string | null;
  phylum: string | null;
  class_: string | null;
  order_: string | null;
  family: string | null;
  genus: string | null;
  species: string | null;
  source_url: string | null;
  matched_input: string;
  upstream_url: string;
}

export interface GbifSynonymRecord {
  key: number;
  canonicalName: string;
  scientificName: string;
  rank: string;
  taxonomicStatus: string;
  nameType: string;
  publishedIn: string | null;
}

export interface GbifVernacularRecord {
  vernacularName: string;
  language: string;
  country: string | null;
  source: string | null;
}

export interface GbifOccurrenceRecord {
  gbifID: string;
  decimalLatitude: number;
  decimalLongitude: number;
  country: string;
  stateProvince: string | null;
  county: string | null;
  eventDate: string | null;
  year: number | null;
  basisOfRecord: string;
  institutionCode: string | null;
  datasetName: string | null;
  coordinateUncertaintyInMeters: number | null;
  occurrenceStatus: string;
  gbifOccurrenceUrl: string;
}

export interface GbifReconcileResult {
  synonyms: GbifSynonymRecord[];
  synonym_count: number;
  vernacular_names: GbifVernacularRecord[];
  vernacular_name_primary: string | null;
  vernacular_name_count: number;
  synonyms_upstream_url: string;
  vernacular_upstream_url: string;
}

export interface GbifOccurrencesResult {
  occurrence_count: number;
  occurrence_count_us: number | null;
  recent_occurrences: GbifOccurrenceRecord[];
  source_url: string;
  upstream_url: string;
}

export function buildMatchCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ":");
  return `gbif:match:${normalized}:plantae`;
}

export function buildSynonymsCacheKey(usageKey: number): string {
  return `gbif:synonyms:${usageKey}`;
}

export function buildVernacularCacheKey(usageKey: number): string {
  return `gbif:vernacular:${usageKey}`;
}

export function buildOccurrencesCacheKey(usageKey: number, geo: GeographyParams): string {
  const geoStr = serializeGeography(geo);
  const hash = createHash("md5").update(geoStr).digest("hex").slice(0, 8);
  return `gbif:occurrences:${usageKey}:${hash}`;
}

export function serializeGeography(geo: GeographyParams): string {
  if (geo.mode === "countries" && geo.countries) {
    return `countries:${geo.countries.sort().join(",")}`;
  }
  if (geo.mode === "continent" && geo.continent) {
    return `continent:${geo.continent}`;
  }
  if (geo.mode === "bbox" && geo.bbox) {
    const { minLat, minLon, maxLat, maxLon } = geo.bbox;
    return `bbox:${minLat},${minLon},${maxLat},${maxLon}`;
  }
  return `countries:US,CA,MX`;
}

function buildGbifOccurrenceUrl(usageKey: number, geo?: GeographyParams): string {
  const base = `https://www.gbif.org/occurrence/search?taxonKey=${usageKey}`;
  if (!geo) return base;
  if (geo.mode === "countries" && geo.countries && geo.countries.length > 0) {
    return base + "&" + geo.countries.map((c) => `country=${c}`).join("&");
  }
  if (geo.mode === "continent" && geo.continent) {
    return `${base}&continent=${geo.continent}`;
  }
  if (geo.mode === "bbox" && geo.bbox) {
    const { minLat, minLon, maxLat, maxLon } = geo.bbox;
    return `${base}&geometry=POLYGON((${minLon} ${minLat},${maxLon} ${minLat},${maxLon} ${maxLat},${minLon} ${maxLat},${minLon} ${minLat}))`;
  }
  return base;
}

export function parseGeography(params: {
  countries?: string;
  continent?: string;
  bbox?: string;
}): GeographyParams {
  if (params.bbox) {
    const parts = params.bbox.split(",").map(Number);
    if (parts.length === 4 && parts.every((n) => !isNaN(n))) {
      return {
        mode: "bbox",
        bbox: { minLat: parts[0], minLon: parts[1], maxLat: parts[2], maxLon: parts[3] },
      };
    }
  }
  if (params.continent) {
    return { mode: "continent", continent: params.continent };
  }
  if (params.countries) {
    const codes = params.countries
      .split(",")
      .map((c) => c.trim().toUpperCase())
      .filter(Boolean);
    return { mode: "countries", countries: codes };
  }
  return { mode: "countries", countries: ["US", "CA", "MX"] };
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

export async function fetchNameMatch(name: string): Promise<GbifMatchResult> {
  const encoded = encodeURIComponent(name.trim());
  const url = `${GBIF_API_BASE}/species/match?name=${encoded}&kingdom=Plantae`;

  const raw = (await gbifFetch(url)) as Record<string, unknown>;

  const matchType = (raw.matchType as string) || "NONE";

  if (!("usageKey" in raw) || raw.usageKey === undefined || raw.usageKey === null) {
    return {
      usage_key: null,
      canonical_name: null,
      scientific_name: null,
      rank: null,
      status: null,
      accepted_usage_key: null,
      accepted_canonical_name: null,
      confidence: null,
      match_type: "NONE",
      kingdom: null,
      phylum: null,
      class_: null,
      order_: null,
      family: null,
      genus: null,
      species: null,
      source_url: null,
      matched_input: name.trim(),
      upstream_url: url,
    };
  }

  const usageKey = raw.usageKey as number;
  let acceptedUsageKey: number | null = null;
  let acceptedCanonicalName: string | null = null;

  if (raw.status === "SYNONYM" && raw.acceptedUsageKey) {
    acceptedUsageKey = raw.acceptedUsageKey as number;
    const acceptedUrl = `${GBIF_API_BASE}/species/${acceptedUsageKey}`;
    try {
      const acceptedRaw = (await gbifFetch(acceptedUrl)) as Record<string, unknown>;
      acceptedCanonicalName = (acceptedRaw.canonicalName as string) || null;
    } catch {
      acceptedCanonicalName = (raw.acceptedCanonicalName as string) || null;
    }
  }

  return {
    usage_key: usageKey,
    canonical_name: (raw.canonicalName as string) || null,
    scientific_name: (raw.scientificName as string) || null,
    rank: (raw.rank as string) || null,
    status: (raw.status as string) || null,
    accepted_usage_key: acceptedUsageKey,
    accepted_canonical_name: acceptedCanonicalName,
    confidence: typeof raw.confidence === "number" ? raw.confidence : null,
    match_type: matchType as GbifMatchResult["match_type"],
    kingdom: (raw.kingdom as string) || null,
    phylum: (raw.phylum as string) || null,
    class_: (raw.class as string) || null,
    order_: (raw.order as string) || null,
    family: (raw.family as string) || null,
    genus: (raw.genus as string) || null,
    species: (raw.species as string) || null,
    source_url: `https://www.gbif.org/species/${usageKey}`,
    matched_input: name.trim(),
    upstream_url: url,
  };
}

export async function resolveToAcceptedUsageKey(usageKey: number): Promise<{ resolvedKey: number; wasSynonym: boolean }> {
  const url = `${GBIF_API_BASE}/species/${usageKey}`;
  const raw = (await gbifFetch(url)) as Record<string, unknown>;
  const status = raw.taxonomicStatus as string || raw.status as string || "";
  if ((status === "SYNONYM" || status.includes("SYNONYM")) && raw.acceptedKey) {
    return { resolvedKey: raw.acceptedKey as number, wasSynonym: true };
  }
  return { resolvedKey: usageKey, wasSynonym: false };
}

async function fetchAllSynonyms(usageKey: number): Promise<{ synonyms: GbifSynonymRecord[]; total: number; firstUrl: string }> {
  const PAGE_SIZE = 100;
  const firstUrl = `${GBIF_API_BASE}/species/${usageKey}/synonyms?limit=${PAGE_SIZE}&offset=0`;
  const firstPage = (await gbifFetch(firstUrl)) as Record<string, unknown>;
  const total = (firstPage.count as number) ?? 0;
  const firstResults = (firstPage.results as Record<string, unknown>[]) || [];

  const toRecord = (s: Record<string, unknown>): GbifSynonymRecord => ({
    key: s.key as number,
    canonicalName: (s.canonicalName as string) || "",
    scientificName: (s.scientificName as string) || "",
    rank: (s.rank as string) || "",
    taxonomicStatus: (s.taxonomicStatus as string) || "",
    nameType: (s.nameType as string) || "",
    publishedIn: (s.publishedIn as string) || null,
  });

  const synonyms: GbifSynonymRecord[] = firstResults.map(toRecord);

  if (total > PAGE_SIZE) {
    const pageCount = Math.ceil(total / PAGE_SIZE);
    const extraPages = await Promise.all(
      Array.from({ length: pageCount - 1 }, (_, i) => {
        const url = `${GBIF_API_BASE}/species/${usageKey}/synonyms?limit=${PAGE_SIZE}&offset=${(i + 1) * PAGE_SIZE}`;
        return gbifFetch(url) as Promise<Record<string, unknown>>;
      }),
    );
    for (const page of extraPages) {
      const results = (page.results as Record<string, unknown>[]) || [];
      synonyms.push(...results.map(toRecord));
    }
  }

  return { synonyms, total, firstUrl };
}

export async function fetchReconcile(usageKey: number): Promise<GbifReconcileResult> {
  const vernacularUrl = `${GBIF_API_BASE}/species/${usageKey}/vernacularNames?limit=500`;

  const [synonymData, vernacularRaw] = await Promise.all([
    fetchAllSynonyms(usageKey),
    gbifFetch(vernacularUrl) as Promise<Record<string, unknown>>,
  ]);

  const vernacularResults = (vernacularRaw.results as Record<string, unknown>[]) || [];
  const vernacularNames: GbifVernacularRecord[] = vernacularResults.map((v) => ({
    vernacularName: (v.vernacularName as string) || "",
    language: (v.language as string) || "",
    country: (v.country as string) || null,
    source: (v.source as string) || null,
  }));

  const primaryEnglish = vernacularNames.find((v) => v.language === "eng")?.vernacularName || null;

  return {
    synonyms: synonymData.synonyms,
    synonym_count: synonymData.total,
    vernacular_names: vernacularNames,
    vernacular_name_primary: primaryEnglish,
    vernacular_name_count: (vernacularRaw.count as number) ?? vernacularNames.length,
    synonyms_upstream_url: synonymData.firstUrl,
    vernacular_upstream_url: vernacularUrl,
  };
}

function buildOccurrenceQueryParams(usageKey: number, geo: GeographyParams, limit: number): string {
  const base = `taxonKey=${usageKey}&hasCoordinate=true&hasGeospatialIssue=false&limit=${limit}`;

  if (geo.mode === "countries" && geo.countries) {
    const countryParams = geo.countries.map((c) => `country=${c}`).join("&");
    return `${base}&${countryParams}`;
  }
  if (geo.mode === "continent" && geo.continent) {
    return `${base}&continent=${geo.continent}`;
  }
  if (geo.mode === "bbox" && geo.bbox) {
    const { minLat, minLon, maxLat, maxLon } = geo.bbox;
    return `${base}&decimalLatitude=${minLat},${maxLat}&decimalLongitude=${minLon},${maxLon}`;
  }
  return base;
}

export async function fetchOccurrences(usageKey: number, geo: GeographyParams): Promise<GbifOccurrencesResult> {
  const countParams = buildOccurrenceQueryParams(usageKey, geo, 0);
  const recordParams = buildOccurrenceQueryParams(usageKey, geo, 300);

  const countUrl = `${GBIF_API_BASE}/occurrence/search?${countParams}`;
  const recordUrl = `${GBIF_API_BASE}/occurrence/search?${recordParams}&offset=0`;

  let occurrenceCountUs: number | null = null;
  const fetchUsCount =
    geo.mode !== "countries" || (geo.countries && geo.countries.length > 1);

  const promises: Promise<Record<string, unknown>>[] = [
    gbifFetch(countUrl) as Promise<Record<string, unknown>>,
    gbifFetch(recordUrl) as Promise<Record<string, unknown>>,
  ];

  if (fetchUsCount && geo.mode === "countries" && geo.countries && geo.countries.includes("US")) {
    const usCountUrl = `${GBIF_API_BASE}/occurrence/search?taxonKey=${usageKey}&hasCoordinate=true&hasGeospatialIssue=false&country=US&limit=0`;
    promises.push(gbifFetch(usCountUrl) as Promise<Record<string, unknown>>);
  }

  const results = await Promise.all(promises);
  const countRaw = results[0];
  const recordRaw = results[1];
  if (results[2]) {
    occurrenceCountUs = (results[2].count as number) ?? null;
  }

  const occurrenceCount = (countRaw.count as number) ?? 0;
  const rawRecords = (recordRaw.results as Record<string, unknown>[]) || [];

  const recent_occurrences: GbifOccurrenceRecord[] = rawRecords.map((r) => ({
    gbifID: String(r.gbifID || r.key || ""),
    decimalLatitude: (r.decimalLatitude as number) ?? 0,
    decimalLongitude: (r.decimalLongitude as number) ?? 0,
    country: (r.country as string) || "",
    stateProvince: (r.stateProvince as string) || null,
    county: (r.county as string) || null,
    eventDate: (r.eventDate as string) || null,
    year: typeof r.year === "number" ? r.year : null,
    basisOfRecord: (r.basisOfRecord as string) || "",
    institutionCode: (r.institutionCode as string) || null,
    datasetName: (r.datasetName as string) || null,
    coordinateUncertaintyInMeters:
      typeof r.coordinateUncertaintyInMeters === "number"
        ? r.coordinateUncertaintyInMeters
        : null,
    occurrenceStatus: (r.occurrenceStatus as string) || "PRESENT",
    gbifOccurrenceUrl: `https://www.gbif.org/occurrence/${r.gbifID || r.key}`,
  }));

  return {
    occurrence_count: occurrenceCount,
    occurrence_count_us: occurrenceCountUs,
    recent_occurrences,
    source_url: buildGbifOccurrenceUrl(usageKey, geo),
    upstream_url: countUrl,
  };
}

export async function fetchVernacularSearch(q: string): Promise<{
  candidates: Array<{
    usageKey: number;
    canonicalName: string;
    scientificName: string;
    rank: string;
    status: string;
    family: string | null;
    vernacularName: string | null;
    source_url: string;
  }>;
  count: number;
  upstream_url: string;
}> {
  const encoded = encodeURIComponent(q.trim());
  const url = `${GBIF_API_BASE}/species/search?q=${encoded}&qField=VERNACULAR&rank=SPECIES&kingdom=Plantae&limit=20`;

  const raw = (await gbifFetch(url)) as Record<string, unknown>;
  const results = (raw.results as Record<string, unknown>[]) || [];

  const candidates = results.map((r) => ({
    usageKey: r.key as number,
    canonicalName: (r.canonicalName as string) || "",
    scientificName: (r.scientificName as string) || "",
    rank: (r.rank as string) || "",
    status: (r.taxonomicStatus as string) || "",
    family: (r.family as string) || null,
    vernacularName: (r.vernacularName as string) || null,
    source_url: `https://www.gbif.org/species/${r.key}`,
  }));

  return {
    candidates,
    count: (raw.count as number) ?? candidates.length,
    upstream_url: url,
  };
}

export function buildProvenance(upstreamUrl: string) {
  return {
    source_id: GBIF_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    derivation_summary: GBIF_DERIVATION_SUMMARY,
    derivation_scientific: GBIF_DERIVATION_SCIENTIFIC,
  };
}
