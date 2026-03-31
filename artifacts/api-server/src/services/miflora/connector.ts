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
  found: boolean;
  source_url: string | null;
  upstream_url: string;
  raw_response: unknown;
}

export interface MifloraImageRecord {
  image_id: number | string;
  image_name: string | null;
  caption: string | null;
  photographer: string | null;
  image_url: string;
  thumbnail_url: string;
}

export interface MifloraImagesResult {
  found: boolean;
  plant_id: number | null;
  source_url: string | null;
  upstream_url: string;
  images: MifloraImageRecord[];
}

export function buildMifloraImageUrls(
  plantId: number,
  imageId: number | string,
): { image_url: string; thumbnail_url: string } {
  const base = `https://michiganflora.net/static/species_images/_pid_${plantId}/${imageId}.jpg`;
  const thumb = `https://michiganflora.net/static/species_images/_pid_${plantId}/thumb_${imageId}.jpg`;
  return { image_url: base, thumbnail_url: thumb };
}

export function buildSpeciesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:species:${normalized}`;
}

export function buildCountiesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:counties:${normalized}`;
}

export function buildImagesCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:images:${normalized}`;
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
  const searchUrl = `${MIFLORA_API_BASE}/flora_search_sp?scientific_name=${encodeURIComponent(trimmed)}`;

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

  const matchedRecord = searchRecords[0] as Record<string, unknown>;
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

export async function fetchCounties(name: string): Promise<MifloraCountiesResult> {
  const trimmed = name.trim();
  const searchUrl = `${MIFLORA_API_BASE}/flora_search_sp?scientific_name=${encodeURIComponent(trimmed)}`;

  const searchRaw = await mifloraFetch(searchUrl);
  const searchRecords: unknown[] = Array.isArray(searchRaw) ? searchRaw : [];

  if (searchRecords.length === 0) {
    return {
      found: false,
      source_url: null,
      upstream_url: searchUrl,
      raw_response: { locations: [] },
    };
  }

  const matchedRecord = searchRecords[0] as Record<string, unknown>;
  const plantId = Number(matchedRecord.plant_id);
  const locsUrl = `${MIFLORA_API_BASE}/locs_sp?id=${plantId}`;
  const raw = await mifloraFetch(locsUrl);

  const rawObj = raw as Record<string, unknown>;
  const locations = rawObj.locations as unknown[] | undefined;
  const found = Array.isArray(locations) && locations.length > 0;

  return {
    found,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: locsUrl,
    raw_response: raw,
  };
}

export async function fetchImages(name: string): Promise<MifloraImagesResult> {
  const trimmed = name.trim();
  const searchUrl = `${MIFLORA_API_BASE}/flora_search_sp?scientific_name=${encodeURIComponent(trimmed)}`;

  const searchRaw = await mifloraFetch(searchUrl);
  const searchRecords: unknown[] = Array.isArray(searchRaw) ? searchRaw : [];

  if (searchRecords.length === 0) {
    return {
      found: false,
      plant_id: null,
      source_url: null,
      upstream_url: searchUrl,
      images: [],
    };
  }

  const matchedRecord = searchRecords[0] as Record<string, unknown>;
  const plantId = Number(matchedRecord.plant_id);
  const allImageUrl = `${MIFLORA_API_BASE}/allimage_info?id=${plantId}`;
  const raw = await mifloraFetch(allImageUrl);

  const rawArr: unknown[] = Array.isArray(raw) ? raw : [];
  const images: MifloraImageRecord[] = rawArr.map((item) => {
    const rec = item as Record<string, unknown>;
    const imageId = rec["image_id"] as number | string;
    const urls = buildMifloraImageUrls(plantId, imageId);
    return {
      image_id: imageId,
      image_name: (rec["image_name"] as string | null) ?? null,
      caption: (rec["caption"] as string | null) ?? null,
      photographer: (rec["photographer"] as string | null) ?? null,
      image_url: urls.image_url,
      thumbnail_url: urls.thumbnail_url,
    };
  });

  return {
    found: images.length > 0,
    plant_id: plantId,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: allImageUrl,
    images,
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
