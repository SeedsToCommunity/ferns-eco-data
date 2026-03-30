import http from "http";
import https from "https";
import { logger } from "../../lib/logger.js";

const USER_AGENT = "FERNS/1.0 (universalfqa.org)";
const TIMEOUT_MS = 30000;

export interface UniversalFqaDatabaseEntry {
  id: number;
  region: string;
  year: string;
  citation: string;
}

export interface UniversalFqaSpeciesRecord {
  scientific_name: string;
  family: string;
  acronym: string;
  native: string;
  c: string | number | null;
  w: string | number | null;
  physiognomy: string;
  duration: string;
  common_name: string;
}

export interface UniversalFqaDatabaseDetail {
  id: number;
  region: string;
  year: string;
  citation: string;
  total_species: number;
  native_species: number;
  non_native_species: number;
  total_mean_c: number | null;
  native_mean_c: number | null;
  species: UniversalFqaSpeciesRecord[];
}

export interface UniversalFqaAssessmentSummary {
  id: number;
  name: string;
  date: string;
  site: string;
  practitioner: string;
}

export interface UniversalFqaAssessmentDetail {
  id: number;
  site_name: string | null;
  date: string | null;
  city: string | null;
  county: string | null;
  state: string | null;
  country: string | null;
  fqa_db: { region: string | null; year: string | null; citation: string | null } | null;
  practitioner: string | null;
  latitude: string | null;
  longitude: string | null;
  weather_notes: string | null;
  duration_notes: string | null;
  community_type: string | null;
  other_notes: string | null;
  visibility: string | null;
  metrics: {
    total_mean_c: number | null;
    native_mean_c: number | null;
    total_fqi: number | null;
    native_fqi: number | null;
    adjusted_fqi: number | null;
    pct_c0: number | null;
    pct_c1_3: number | null;
    pct_c4_6: number | null;
    pct_c7_10: number | null;
    native_tree_mean_c: number | null;
    native_shrub_mean_c: number | null;
    native_herbaceous_mean_c: number | null;
    total_species: number | null;
    native_species: number | null;
    native_species_pct: number | null;
    non_native_species: number | null;
    non_native_species_pct: number | null;
    mean_wetness: number | null;
    native_mean_wetness: number | null;
    tree_count: number | null;
    tree_pct: number | null;
    shrub_count: number | null;
    shrub_pct: number | null;
    vine_count: number | null;
    vine_pct: number | null;
    forb_count: number | null;
    forb_pct: number | null;
    grass_count: number | null;
    grass_pct: number | null;
    sedge_count: number | null;
    sedge_pct: number | null;
    rush_count: number | null;
    rush_pct: number | null;
    fern_count: number | null;
    fern_pct: number | null;
    bryophyte_count: number | null;
    bryophyte_pct: number | null;
    annual_count: number | null;
    annual_pct: number | null;
    perennial_count: number | null;
    perennial_pct: number | null;
    biennial_count: number | null;
    biennial_pct: number | null;
    native_annual_count: number | null;
    native_annual_pct: number | null;
    native_perennial_count: number | null;
    native_perennial_pct: number | null;
    native_biennial_count: number | null;
    native_biennial_pct: number | null;
  };
  species: UniversalFqaSpeciesRecord[];
}

function fetchJson(url: string): Promise<{ status: string; data: unknown[][] }> {
  return new Promise((resolve, reject) => {
    const makeRequest = (targetUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error("Too many redirects"));
        return;
      }

      const isHttps = targetUrl.startsWith("https");
      const mod = isHttps ? https : http;

      const req = mod.get(
        targetUrl,
        {
          headers: { "User-Agent": USER_AGENT },
          timeout: TIMEOUT_MS,
        },
        (res) => {
          if (
            (res.statusCode === 301 || res.statusCode === 302) &&
            res.headers.location
          ) {
            makeRequest(res.headers.location, redirectCount + 1);
            return;
          }

          const chunks: Buffer[] = [];
          res.on("data", (chunk: Buffer) => chunks.push(chunk));
          res.on("end", () => {
            try {
              const body = Buffer.concat(chunks).toString("utf8");
              const parsed = JSON.parse(body);
              resolve(parsed);
            } catch (e) {
              reject(new Error(`Failed to parse JSON from ${targetUrl}: ${e}`));
            }
          });
        }
      );

      req.on("error", reject);
      req.on("timeout", () => {
        req.destroy();
        reject(new Error(`Request timed out: ${targetUrl}`));
      });
    };

    makeRequest(url);
  });
}

function nullStr(val: unknown): string | null {
  if (val === null || val === undefined || val === "") return null;
  return String(val);
}

function nullStrOrNum(val: unknown): string | number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return val;
  if (typeof val === "string") return val;
  return null;
}

function nullNum(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function parsePct(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  const s = String(val).replace("%", "");
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export async function fetchDatabaseList(): Promise<UniversalFqaDatabaseEntry[]> {
  const url = "http://universalfqa.org/get/database/";
  const result = await fetchJson(url);

  if (result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(`Unexpected response from database list: status=${result.status}`);
  }

  return result.data.map((row) => ({
    id: Number(row[0]),
    region: nullStr(row[1]) ?? "",
    year: nullStr(row[2]) ?? "",
    citation: nullStr(row[3]) ?? "",
  }));
}

export async function fetchDatabase(id: number): Promise<UniversalFqaDatabaseDetail> {
  const url = `http://universalfqa.org/get/database/${id}`;
  const result = await fetchJson(url);

  if (result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(`Unexpected response for database ${id}: status=${result.status}`);
  }

  const rows = result.data;

  const region = nullStr(rows[0]?.[0]) ?? "";
  const year = nullStr(rows[1]?.[0]) ?? "";
  const citation = nullStr(rows[2]?.[0]) ?? "";
  const totalSpecies = nullNum(rows[4]?.[1]) ?? 0;
  const nativeSpecies = nullNum(rows[5]?.[1]) ?? 0;
  const nonNativeSpecies = nullNum(rows[6]?.[1]) ?? 0;
  const totalMeanC = nullNum(rows[7]?.[1]);
  const nativeMeanC = nullNum(rows[8]?.[1]);

  const headerIdx = rows.findIndex(
    (r) => Array.isArray(r) && r[0] === "Scientific Name"
  );

  const speciesRows = headerIdx >= 0 ? rows.slice(headerIdx + 1) : [];
  const species: UniversalFqaSpeciesRecord[] = speciesRows
    .filter((r) => Array.isArray(r) && r.length >= 5 && r[0] != null && r[0] !== "")
    .map((r) => ({
      scientific_name: nullStr(r[0]) ?? "",
      family: nullStr(r[1]) ?? "",
      acronym: nullStr(r[2]) ?? "",
      native: nullStr(r[3]) ?? "",
      c: nullStrOrNum(r[4]),
      w: nullStrOrNum(r[5]),
      physiognomy: nullStr(r[6]) ?? "",
      duration: nullStr(r[7]) ?? "",
      common_name: nullStr(r[8]) ?? "",
    }));

  return {
    id,
    region,
    year,
    citation,
    total_species: totalSpecies,
    native_species: nativeSpecies,
    non_native_species: nonNativeSpecies,
    total_mean_c: totalMeanC,
    native_mean_c: nativeMeanC,
    species,
  };
}

export async function fetchAssessmentList(
  databaseId: number
): Promise<UniversalFqaAssessmentSummary[]> {
  const url = `http://universalfqa.org/get/database/${databaseId}/inventory`;
  const result = await fetchJson(url);

  if (result.status !== "success" || !Array.isArray(result.data)) {
    throw new Error(
      `Unexpected response for assessment list db=${databaseId}: status=${result.status}`
    );
  }

  return result.data.map((row) => ({
    id: Number(row[0]),
    name: nullStr(row[1]) ?? "",
    date: nullStr(row[2]) ?? "",
    site: nullStr(row[3]) ?? "",
    practitioner: nullStr(row[4]) ?? "",
  }));
}

export async function fetchAssessment(assessmentId: number): Promise<UniversalFqaAssessmentDetail> {
  const url = `http://universalfqa.org/get/inventory/${assessmentId}`;
  const result = await fetchJson(url);

  if (result.status !== "success" || !Array.isArray(result.data)) {
    const msg = (result as Record<string, unknown>).message;
    throw new Error(
      `Assessment ${assessmentId} unavailable: ${msg ?? result.status}`
    );
  }

  const rows = result.data;

  const fqaRegion = nullStr(rows[7]?.[1]);
  const fqaYear = nullStr(rows[8]?.[1]);
  const fqaCitation = nullStr(rows[9]?.[1]);

  const speciesHeaderIdx = rows.findIndex(
    (r) => Array.isArray(r) && r[0] === "Scientific Name"
  );
  const speciesRows = speciesHeaderIdx >= 0 ? rows.slice(speciesHeaderIdx + 1) : [];
  const species: UniversalFqaSpeciesRecord[] = speciesRows
    .filter((r) => Array.isArray(r) && r.length >= 5 && r[0] != null && r[0] !== "")
    .map((r) => ({
      scientific_name: nullStr(r[0]) ?? "",
      family: nullStr(r[1]) ?? "",
      acronym: nullStr(r[2]) ?? "",
      native: nullStr(r[3]) ?? "",
      c: nullStrOrNum(r[4]),
      w: nullStrOrNum(r[5]),
      physiognomy: nullStr(r[6]) ?? "",
      duration: nullStr(r[7]) ?? "",
      common_name: nullStr(r[8]) ?? "",
    }));

  const nativeSpeciesRow = rows[36];
  const nonNativeSpeciesRow = rows[37];

  const physiognomyLabels = ["tree", "shrub", "vine", "forb", "grass", "sedge", "rush", "fern", "bryophyte"];
  const physRows = rows.slice(44, 53);

  const durationLabels = ["annual", "perennial", "biennial"];
  const nativeDurationLabels = ["native_annual", "native_perennial", "native_biennial"];
  const durRows = rows.slice(55, 58);
  const nativeDurRows = rows.slice(58, 61);

  const metrics = {
    total_mean_c: nullNum(rows[21]?.[1]),
    native_mean_c: nullNum(rows[22]?.[1]),
    total_fqi: nullNum(rows[23]?.[1]),
    native_fqi: nullNum(rows[24]?.[1]),
    adjusted_fqi: nullNum(rows[25]?.[1]),
    pct_c0: nullNum(rows[26]?.[1]),
    pct_c1_3: nullNum(rows[27]?.[1]),
    pct_c4_6: nullNum(rows[28]?.[1]),
    pct_c7_10: nullNum(rows[29]?.[1]),
    native_tree_mean_c: nullNum(rows[30]?.[1]),
    native_shrub_mean_c: nullNum(rows[31]?.[1]),
    native_herbaceous_mean_c: nullNum(rows[32]?.[1]),
    total_species: nullNum(rows[35]?.[1]),
    native_species: nullNum(nativeSpeciesRow?.[1]),
    native_species_pct: parsePct(nativeSpeciesRow?.[2]),
    non_native_species: nullNum(nonNativeSpeciesRow?.[1]),
    non_native_species_pct: parsePct(nonNativeSpeciesRow?.[2]),
    mean_wetness: nullNum(rows[40]?.[1]),
    native_mean_wetness: nullNum(rows[41]?.[1]),
    ...Object.fromEntries(
      physiognomyLabels.flatMap((label, i) => [
        [`${label}_count`, nullNum(physRows[i]?.[1])],
        [`${label}_pct`, parsePct(physRows[i]?.[2])],
      ])
    ),
    ...Object.fromEntries(
      durationLabels.flatMap((label, i) => [
        [`${label}_count`, nullNum(durRows[i]?.[1])],
        [`${label}_pct`, parsePct(durRows[i]?.[2])],
      ])
    ),
    ...Object.fromEntries(
      nativeDurationLabels.flatMap((label, i) => [
        [`${label}_count`, nullNum(nativeDurRows[i]?.[1])],
        [`${label}_pct`, parsePct(nativeDurRows[i]?.[2])],
      ])
    ),
  } as UniversalFqaAssessmentDetail["metrics"];

  return {
    id: assessmentId,
    site_name: nullStr(rows[0]?.[0]),
    date: nullStr(rows[1]?.[0]),
    city: nullStr(rows[2]?.[0]),
    county: nullStr(rows[4]?.[0]),
    state: nullStr(rows[5]?.[0]),
    country: nullStr(rows[6]?.[0]),
    fqa_db:
      fqaRegion || fqaYear || fqaCitation
        ? { region: fqaRegion, year: fqaYear, citation: fqaCitation }
        : null,
    practitioner: nullStr(rows[11]?.[1]),
    latitude: nullStr(rows[12]?.[1]),
    longitude: nullStr(rows[13]?.[1]),
    weather_notes: nullStr(rows[14]?.[1]),
    duration_notes: nullStr(rows[15]?.[1]),
    community_type: nullStr(rows[16]?.[1]),
    other_notes: nullStr(rows[17]?.[1]),
    visibility: nullStr(rows[18]?.[1]),
    metrics,
    species,
  };
}

const dbSpeciesCache = new Map<number, Map<string, UniversalFqaSpeciesRecord>>();

export async function lookupSpeciesInDatabase(
  databaseId: number,
  scientificName: string
): Promise<{
  found: boolean;
  species: UniversalFqaSpeciesRecord | null;
  cache_hit: boolean;
  upstream_url: string;
}> {
  const upstreamUrl = `http://universalfqa.org/get/database/${databaseId}`;

  let cache_hit = true;
  if (!dbSpeciesCache.has(databaseId)) {
    cache_hit = false;
    logger.info({ databaseId }, "Universal FQA: loading database into cache");
    const detail = await fetchDatabase(databaseId);
    const speciesMap = new Map<string, UniversalFqaSpeciesRecord>();
    for (const sp of detail.species) {
      speciesMap.set(sp.scientific_name.toLowerCase(), sp);
    }
    dbSpeciesCache.set(databaseId, speciesMap);
  }

  const speciesMap = dbSpeciesCache.get(databaseId)!;
  const normalizedQuery = scientificName.toLowerCase().trim();

  const match = speciesMap.get(normalizedQuery) ?? null;

  return {
    found: match !== null,
    species: match,
    cache_hit,
    upstream_url: upstreamUrl,
  };
}
