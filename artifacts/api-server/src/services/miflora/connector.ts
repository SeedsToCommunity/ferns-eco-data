import {
  MIFLORA_API_BASE,
  MIFLORA_USER_AGENT,
  MIFLORA_REQUEST_TIMEOUT_MS,
  MIFLORA_SOURCE_ID,
  MIFLORA_DERIVATION_SUMMARY,
  MIFLORA_DERIVATION_SCIENTIFIC,
} from "./metadata.js";

export interface MifloraSpeciesResult {
  found: boolean;
  plant_id: number | null;
  source_url: string | null;
  upstream_url: string;
  raw_response: {
    search_records: unknown[];
    spec_text: unknown | null;
    synonyms: unknown | null;
    pimage_info: unknown | null;
  };
}

export interface MifloraCountiesResult {
  plant_id: number;
  found: boolean;
  source_url: string;
  upstream_url: string;
  raw_response: unknown;
}

export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, ":");
  return `miflora:species:${normalized}`;
}

export function buildCountiesCacheKey(plantId: number): string {
  return `miflora:counties:${plantId}`;
}

async function mifloraFetch(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": MIFLORA_USER_AGENT,
    },
    signal: AbortSignal.timeout(MIFLORA_REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Michigan Flora API error: ${response.status} ${response.statusText} — ${url}`);
  }
  return response.json();
}

export async function fetchSpecies(name: string): Promise<MifloraSpeciesResult> {
  const trimmed = name.trim();
  const parts = trimmed.split(/\s+/);
  const genus = parts[0];
  const speciesEpithet = parts.slice(1).join(" ").toLowerCase();

  const searchUrl = `${MIFLORA_API_BASE}/flora_search_sp?genus=${encodeURIComponent(genus)}&n_results=0&exact_match_genus=1`;

  const searchRaw = await mifloraFetch(searchUrl);
  const searchRecords: unknown[] = Array.isArray(searchRaw) ? searchRaw : [];

  if (searchRecords.length === 0) {
    return {
      found: false,
      plant_id: null,
      source_url: null,
      upstream_url: searchUrl,
      raw_response: {
        search_records: [],
        spec_text: null,
        synonyms: null,
        pimage_info: null,
      },
    };
  }

  let matchedRecord: Record<string, unknown> | null = null;
  if (speciesEpithet) {
    for (const rec of searchRecords) {
      const r = rec as Record<string, unknown>;
      const sciName = String(r.scientific_name ?? "").toLowerCase();
      if (sciName.includes(speciesEpithet)) {
        matchedRecord = r;
        break;
      }
    }
  } else {
    matchedRecord = searchRecords[0] as Record<string, unknown>;
  }

  if (!matchedRecord) {
    return {
      found: false,
      plant_id: null,
      source_url: null,
      upstream_url: searchUrl,
      raw_response: {
        search_records: searchRecords,
        spec_text: null,
        synonyms: null,
        pimage_info: null,
      },
    };
  }

  const plantId = Number(matchedRecord.plant_id);

  const [specTextRaw, synonymsRaw, pimageRaw] = await Promise.all([
    mifloraFetch(`${MIFLORA_API_BASE}/spec_text?id=${plantId}`),
    mifloraFetch(`${MIFLORA_API_BASE}/synonyms?id=${plantId}`),
    mifloraFetch(`${MIFLORA_API_BASE}/pimage_info?id=${plantId}`),
  ]);

  return {
    found: true,
    plant_id: plantId,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: searchUrl,
    raw_response: {
      search_records: searchRecords,
      spec_text: specTextRaw,
      synonyms: synonymsRaw,
      pimage_info: pimageRaw,
    },
  };
}

export async function fetchCounties(plantId: number): Promise<MifloraCountiesResult> {
  const url = `${MIFLORA_API_BASE}/locs_sp?id=${plantId}`;
  const raw = await mifloraFetch(url);

  const rawObj = raw as Record<string, unknown>;
  const locations = rawObj.locations as unknown[] | undefined;
  const found = Array.isArray(locations) && locations.length > 0;

  return {
    plant_id: plantId,
    found,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: url,
    raw_response: raw,
  };
}

export function buildProvenance(upstreamUrl: string, method: "api_fetch" | "static_metadata" = "api_fetch") {
  return {
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: new Date(),
    method,
    upstream_url: upstreamUrl,
    derivation_summary: MIFLORA_DERIVATION_SUMMARY,
    derivation_scientific: MIFLORA_DERIVATION_SCIENTIFIC,
  };
}
