/**
 * MNFI county element import — fetches species and natural community occurrences
 * for all 83 Michigan counties via the MNFI REST API discovered at:
 *   https://mnfi.anr.msu.edu/resources/countyQuery?county={id}
 *   https://mnfi.anr.msu.edu/resources/countyCommunityQuery?county={id}
 *
 * County IDs are 1–83, corresponding to Michigan counties in alphabetical order.
 * Data is public at https://mnfi.anr.msu.edu/resources/county-element-data
 */

export const MICHIGAN_COUNTIES: ReadonlyArray<string> = [
  "Alcona", "Alger", "Allegan", "Alpena", "Antrim", "Arenac", "Baraga", "Barry", "Bay", "Benzie",
  "Berrien", "Branch", "Calhoun", "Cass", "Charlevoix", "Cheboygan", "Chippewa", "Clare", "Clinton", "Crawford",
  "Delta", "Dickinson", "Eaton", "Emmet", "Genesee", "Gladwin", "Gogebic", "Grand Traverse", "Gratiot", "Hillsdale",
  "Houghton", "Huron", "Ingham", "Ionia", "Iosco", "Iron", "Isabella", "Jackson", "Kalamazoo", "Kalkaska",
  "Kent", "Keweenaw", "Lake", "Lapeer", "Leelanau", "Lenawee", "Livingston", "Luce", "Mackinac", "Macomb",
  "Manistee", "Marquette", "Mason", "Mecosta", "Menominee", "Midland", "Missaukee", "Monroe", "Montcalm", "Montmorency",
  "Muskegon", "Newaygo", "Oakland", "Oceana", "Ogemaw", "Ontonagon", "Osceola", "Oscoda", "Otsego", "Ottawa",
  "Presque Isle", "Roscommon", "Saginaw", "Sanilac", "Schoolcraft", "Shiawassee", "St. Clair", "St. Joseph",
  "Tuscola", "Van Buren", "Washtenaw", "Wayne", "Wexford",
] as const;

const BASE = "https://mnfi.anr.msu.edu/resources";
const RATE_LIMIT_MS = 250;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

interface MnfiJsonResponse {
  COLUMNS: string[];
  DATA: Array<Array<string | number | null>>;
}

function rowToObj(columns: string[], row: Array<string | number | null>): Record<string, string | number | null> {
  const obj: Record<string, string | number | null> = {};
  columns.forEach((col, i) => { obj[col] = row[i] ?? null; });
  return obj;
}

export interface CountySpeciesRecord {
  county: string;
  county_id: number;
  element_type: "species";
  element_id: number;
  element_name: string;
  scientific_name: string | null;
  common_name: string | null;
  federal_status: string | null;
  state_status: string | null;
  global_rank: string | null;
  state_rank: string | null;
  g_rank_description: string | null;
  s_rank_description: string | null;
  species_category: string | null;
  occurrences_in_county: number | null;
  last_observed: string | null;
}

export interface CountyCommunityRecord {
  county: string;
  county_id: number;
  element_type: "community";
  element_id: number;
  element_name: string;
  scientific_name: null;
  common_name: null;
  federal_status: null;
  state_status: null;
  global_rank: string | null;
  state_rank: string | null;
  g_rank_description: string | null;
  s_rank_description: string | null;
  species_category: null;
  occurrences_in_county: number | null;
  last_observed: string | null;
}

export type CountyElementRecord = CountySpeciesRecord | CountyCommunityRecord;

async function fetchJson(url: string): Promise<MnfiJsonResponse> {
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "FERNS/1.0 (research; ecological data integration)",
      "Accept": "application/json, */*",
      "Referer": "https://mnfi.anr.msu.edu/resources/county-element-data",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json() as Promise<MnfiJsonResponse>;
}

async function fetchCountySpecies(countyId: number, countyName: string): Promise<CountySpeciesRecord[]> {
  const data = await fetchJson(`${BASE}/countyQuery?county=${countyId}`);
  return data.DATA.map((row) => {
    const r = rowToObj(data.COLUMNS, row);
    return {
      county: countyName,
      county_id: countyId,
      element_type: "species" as const,
      element_id: r["ELEMENT_ID"] as number,
      element_name: (r["SCIENTIFIC_NAME"] as string | null) ?? (r["FORMATTED_SCIENTIFIC_NAME"] as string | null) ?? "",
      scientific_name: r["FORMATTED_SCIENTIFIC_NAME"] as string | null,
      common_name: r["COMMON_NAME"] as string | null,
      federal_status: r["US_STATUS"] as string | null,
      state_status: r["STATE_STATUS"] as string | null,
      global_rank: r["G_RANK"] as string | null,
      state_rank: r["S_RANK"] as string | null,
      g_rank_description: r["G_RANK_DESCRIPTION"] as string | null,
      s_rank_description: r["S_RANK_DESCRIPTION"] as string | null,
      species_category: r["SPECIES_CATEGORY"] as string | null,
      occurrences_in_county: r["COUNT"] as number | null,
      last_observed: r["LAST_OBS_YEAR"] !== null ? String(r["LAST_OBS_YEAR"]) : null,
    };
  });
}

async function fetchCountyCommunities(countyId: number, countyName: string): Promise<CountyCommunityRecord[]> {
  const data = await fetchJson(`${BASE}/countyCommunityQuery?county=${countyId}`);
  return data.DATA.map((row) => {
    const r = rowToObj(data.COLUMNS, row);
    return {
      county: countyName,
      county_id: countyId,
      element_type: "community" as const,
      element_id: r["ELEMENT_ID"] as number,
      element_name: r["NAME"] as string ?? "",
      scientific_name: null,
      common_name: null,
      federal_status: null,
      state_status: null,
      global_rank: r["G_RANK"] as string | null,
      state_rank: r["S_RANK"] as string | null,
      g_rank_description: r["G_RANK_DESCRIPTION"] as string | null,
      s_rank_description: r["S_RANK_DESCRIPTION"] as string | null,
      species_category: null,
      occurrences_in_county: r["COUNT"] as number | null,
      last_observed: r["LAST_OBS_DATE"] !== null ? String(r["LAST_OBS_DATE"]) : null,
    };
  });
}

export interface ImportCountyElementsResult {
  total_counties: number;
  succeeded_counties: number;
  total_species_records: number;
  total_community_records: number;
  failed: Array<{ county_id: number; county: string; error: string }>;
}

export async function importAllCountyElements(
  onProgress?: (done: number, total: number, county: string, speciesCount: number, communityCount: number) => void,
): Promise<{ records: CountyElementRecord[]; result: ImportCountyElementsResult }> {
  const result: ImportCountyElementsResult = {
    total_counties: MICHIGAN_COUNTIES.length,
    succeeded_counties: 0,
    total_species_records: 0,
    total_community_records: 0,
    failed: [],
  };
  const allRecords: CountyElementRecord[] = [];

  for (let i = 0; i < MICHIGAN_COUNTIES.length; i++) {
    const countyId = i + 1;
    const countyName = MICHIGAN_COUNTIES[i];
    if (i > 0) await sleep(RATE_LIMIT_MS);

    try {
      const [species, communities] = await Promise.all([
        fetchCountySpecies(countyId, countyName),
        fetchCountyCommunities(countyId, countyName),
      ]);
      allRecords.push(...species, ...communities);
      result.succeeded_counties++;
      result.total_species_records += species.length;
      result.total_community_records += communities.length;
      onProgress?.(i + 1, MICHIGAN_COUNTIES.length, countyName, species.length, communities.length);
    } catch (err) {
      result.failed.push({ county_id: countyId, county: countyName, error: String(err) });
      onProgress?.(i + 1, MICHIGAN_COUNTIES.length, `${countyName} (FAILED)`, 0, 0);
    }
  }

  return { records: allRecords, result };
}
