/**
 * Michigan Flora Source Interface
 *
 * Mirrors the Michigan Flora REST API at https://michiganflora.net/api/v1.0/
 * directly: one exported function per upstream endpoint, same parameter names
 * as the upstream.
 *
 * Does NOT read or write any database table.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = "https://michiganflora.net/api/v1.0";
const USER_AGENT =
  "EcologicalCommons/1.0 (research aggregator; ecologicalcommons.org)";
const TIMEOUT_MS = 10_000;

// ── Exported types ─────────────────────────────────────────────────────────────

/** One record from flora_search_sp */
export interface MichiganFloraSpeciesRecord {
  plant_id: number;
  scientific_name: string;
  family_name: string | null;
  na: string | null;          // nativity: "N" | "A"
  c: string | null;           // coefficient of conservatism, 0–10 or "*"
  w: number | null;           // wetland numeric
  wet: string | null;         // wetland indicator: OBL, FACW, FAC, FACU, UPL + modifiers
  st: string | null;          // state status: T, E, SC, X, or null (was "NULL" upstream)
  phys: string | null;        // physiognomy
  author: string | null;
  acronym: string | null;
  common_name: string[];
}

/** Result from getMichiganFloraFloraSearchSp */
export interface MichiganFloraFloraSearchSpResult {
  found: boolean;
  upstreamUrl: string;
  records: MichiganFloraSpeciesRecord[];
}

/** Result from getMichiganFloraLocsSp */
export interface MichiganFloraLocsSpResult {
  found: boolean;
  upstreamUrl: string;
  locations: string[];
}

/** One image record — from allimage_info or pimage_info */
export interface MichiganFloraImageRecord {
  image_id: number | string;
  image_name: string | null;
  caption: string | null;
  photographer: string | null;
}

/** Result from getMichiganFloraAllimageInfo */
export interface MichiganFloraAllimageInfoResult {
  found: boolean;
  upstreamUrl: string;
  images: MichiganFloraImageRecord[];
}

/** Result from getMichiganFloraSpecText */
export interface MichiganFloraSpecTextResult {
  found: boolean;
  upstreamUrl: string;
  text: string | null;
}

/** Result from getMichiganFloraSynonyms */
export interface MichiganFloraSynonymsResult {
  found: boolean;
  upstreamUrl: string;
  synonyms: Array<{ synonym: string; author: string | null }>;
}

/** Result from getMichiganFloraPimageInfo */
export interface MichiganFloraPimageInfoResult {
  found: boolean;
  upstreamUrl: string;
  image: MichiganFloraImageRecord | null;
}

/** Thrown when the Michigan Flora API returns a non-OK response or times out */
export class MichiganFloraApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "MichiganFloraApiError";
  }
}

// ── Private helpers ────────────────────────────────────────────────────────────

/**
 * Shared HTTP fetch with standard headers, 10 s timeout.
 * Throws MichiganFloraApiError on any non-OK response.
 */
async function michiganFloraFetch(url: string): Promise<unknown> {
  let resp: Response;
  try {
    resp = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new MichiganFloraApiError(`Network error fetching ${url}: ${String(err)}`);
  }

  if (!resp.ok) {
    throw new MichiganFloraApiError(
      `HTTP ${resp.status} from Michigan Flora: ${url}`,
      resp.status,
    );
  }

  return resp.json();
}

/**
 * Maps a raw API object to MichiganFloraSpeciesRecord.
 * Normalizes st: "NULL" → null.
 */
function parseSpeciesRecord(raw: Record<string, unknown>): MichiganFloraSpeciesRecord {
  const st = raw["st"];
  return {
    plant_id: raw["plant_id"] as number,
    scientific_name: raw["scientific_name"] as string,
    family_name: (raw["family_name"] as string | null) ?? null,
    na: (raw["na"] as string | null) ?? null,
    c: (raw["c"] as string | null) ?? null,
    w: (raw["w"] as number | null) ?? null,
    wet: (raw["wet"] as string | null) ?? null,
    st: st === "NULL" || st == null ? null : (st as string),
    phys: (raw["phys"] as string | null) ?? null,
    author: (raw["author"] as string | null) ?? null,
    acronym: (raw["acronym"] as string | null) ?? null,
    common_name: Array.isArray(raw["common_name"])
      ? (raw["common_name"] as string[])
      : [],
  };
}

// ── Exported functions ─────────────────────────────────────────────────────────

/**
 * Searches Michigan Flora species by scientific name.
 * Upstream: GET /flora_search_sp?scientific_name=...
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraFloraSearchSp(
  scientificName: string,
): Promise<MichiganFloraFloraSearchSpResult> {
  const url = `${BASE_URL}/flora_search_sp?scientific_name=${encodeURIComponent(scientificName)}`;
  const data = await michiganFloraFetch(url);

  // Upstream returns either a bare array or { search_records: [...] }
  let rawRecords: unknown[];
  if (Array.isArray(data)) {
    rawRecords = data;
  } else if (
    data !== null &&
    typeof data === "object" &&
    Array.isArray((data as Record<string, unknown>)["search_records"])
  ) {
    rawRecords = (data as Record<string, unknown>)["search_records"] as unknown[];
  } else {
    rawRecords = [];
  }

  const records = rawRecords.map((r) =>
    parseSpeciesRecord(r as Record<string, unknown>),
  );

  return {
    found: records.length > 0,
    upstreamUrl: url,
    records,
  };
}

/**
 * Returns county occurrence data for a Michigan Flora plant_id.
 * Upstream: GET /locs_sp?id=...
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraLocsSp(
  plantId: number,
): Promise<MichiganFloraLocsSpResult> {
  const url = `${BASE_URL}/locs_sp?id=${plantId}`;
  const data = await michiganFloraFetch(url);

  const raw = data as Record<string, unknown>;
  const locations = Array.isArray(raw["locations"])
    ? (raw["locations"] as string[])
    : [];

  return {
    found: locations.length > 0,
    upstreamUrl: url,
    locations,
  };
}

/**
 * Returns all image records for a Michigan Flora plant_id.
 * Upstream: GET /allimage_info?id=...
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraAllimageInfo(
  plantId: number,
): Promise<MichiganFloraAllimageInfoResult> {
  const url = `${BASE_URL}/allimage_info?id=${plantId}`;
  const data = await michiganFloraFetch(url);

  const rawArr = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  const images: MichiganFloraImageRecord[] = rawArr.map((r) => ({
    image_id: r["image_id"] as number | string,
    image_name: (r["image_name"] as string | null) ?? null,
    caption: (r["caption"] as string | null) ?? null,
    photographer: (r["photographer"] as string | null) ?? null,
  }));

  return {
    found: images.length > 0,
    upstreamUrl: url,
    images,
  };
}

/**
 * Returns the botanical description text for a Michigan Flora plant_id.
 * Upstream: GET /spec_text?id=...
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraSpecText(
  plantId: number,
): Promise<MichiganFloraSpecTextResult> {
  const url = `${BASE_URL}/spec_text?id=${plantId}`;
  const data = await michiganFloraFetch(url);

  const raw = data as Record<string, unknown>;
  const text = typeof raw["text"] === "string" ? raw["text"] : null;

  return {
    found: text !== null,
    upstreamUrl: url,
    text,
  };
}

/**
 * Returns the synonym list for a Michigan Flora plant_id.
 * Upstream: GET /synonyms?id=...
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraSynonyms(
  plantId: number,
): Promise<MichiganFloraSynonymsResult> {
  const url = `${BASE_URL}/synonyms?id=${plantId}`;
  const data = await michiganFloraFetch(url);

  const rawArr = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
  const synonyms = rawArr.map((r) => ({
    synonym: r["synonym"] as string,
    author: (r["author"] as string | null) ?? null,
  }));

  return {
    found: synonyms.length > 0,
    upstreamUrl: url,
    synonyms,
  };
}

/**
 * Returns the primary image record for a Michigan Flora plant_id.
 * Upstream: GET /pimage_info?id=...
 * found: false when upstream returns { message } (no primary image).
 * Does NOT read or write any database table.
 * Throws MichiganFloraApiError on HTTP error or timeout.
 */
export async function getMichiganFloraPimageInfo(
  plantId: number,
): Promise<MichiganFloraPimageInfoResult> {
  const url = `${BASE_URL}/pimage_info?id=${plantId}`;
  const data = await michiganFloraFetch(url);

  const raw = data as Record<string, unknown>;

  // Upstream returns { message } when there is no primary image
  if ("message" in raw) {
    return {
      found: false,
      upstreamUrl: url,
      image: null,
    };
  }

  const image: MichiganFloraImageRecord = {
    image_id: raw["image_id"] as number | string,
    image_name: (raw["image_name"] as string | null) ?? null,
    caption: (raw["caption"] as string | null) ?? null,
    photographer: (raw["photographer"] as string | null) ?? null,
  };

  return {
    found: true,
    upstreamUrl: url,
    image,
  };
}
