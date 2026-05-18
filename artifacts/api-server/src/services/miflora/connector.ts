import {
  MIFLORA_API_BASE,
  MIFLORA_USER_AGENT,
  MIFLORA_REQUEST_TIMEOUT_MS,
  MIFLORA_SOURCE_ID,
  MIFLORA_GENERAL_SUMMARY,
  MIFLORA_TECHNICAL_DETAILS,
} from "./metadata.js";

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

export function buildFloraSearchCacheKey(name: string): string {
  const normalized = name.trim().toLowerCase().replace(/\s+/g, " ");
  return `miflora:flora_search_sp:${normalized}`;
}

export function buildSpecTextCacheKey(plantId: number): string {
  return `miflora:spec_text:${plantId}`;
}

export function buildSynonymsCacheKey(plantId: number): string {
  return `miflora:synonyms:${plantId}`;
}

export function buildPImageCacheKey(plantId: number): string {
  return `miflora:pimage:${plantId}`;
}

export interface MifloraSpeciesRecord {
  plant_id: number;
  scientific_name: string;
  c: string | null;
  st: string | null;
  w: number | null;
  wet: string | null;
  phys: string | null;
  na: string | null;
  family_name: string | null;
  author: string | null;
  acronym: string | null;
  common_name: string[];
}

export interface MifloraFloraSearchResult {
  found: boolean;
  plant_id: number | null;
  source_url: string | null;
  upstream_url: string;
  records: MifloraSpeciesRecord[];
}

export async function fetchFloraSearchSp(name: string): Promise<MifloraFloraSearchResult> {
  const trimmed = name.trim();
  const url = `${MIFLORA_API_BASE}/flora_search_sp?scientific_name=${encodeURIComponent(trimmed)}`;
  const raw = await mifloraFetch(url);
  const rawArr: unknown[] = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as Record<string, unknown>)?.search_records)
      ? ((raw as Record<string, unknown>).search_records as unknown[])
      : [];
  const records: MifloraSpeciesRecord[] = rawArr.map((item) => {
    const r = item as Record<string, unknown>;
    return {
      plant_id: Number(r.plant_id),
      scientific_name: String(r.scientific_name ?? ""),
      c: r.c != null ? String(r.c) : null,
      st: (r.st != null && r.st !== "NULL") ? String(r.st) : null,
      w: r.w != null ? Number(r.w) : null,
      wet: r.wet != null ? String(r.wet) : null,
      phys: r.phys != null ? String(r.phys) : null,
      na: r.na != null ? String(r.na) : null,
      family_name: r.family_name != null ? String(r.family_name) : null,
      author: r.author != null ? String(r.author) : null,
      acronym: r.acronym != null ? String(r.acronym) : null,
      common_name: Array.isArray(r.common_name) ? (r.common_name as string[]) : [],
    };
  });
  const first = records[0] ?? null;
  return {
    found: records.length > 0,
    plant_id: first ? first.plant_id : null,
    source_url: first ? `https://michiganflora.net/species/${first.plant_id}` : null,
    upstream_url: url,
    records,
  };
}

export interface MifloraSpecTextResult {
  found: boolean;
  plant_id: number;
  source_url: string;
  upstream_url: string;
  text: string | null;
}

export async function fetchSpecText(plantId: number): Promise<MifloraSpecTextResult> {
  const url = `${MIFLORA_API_BASE}/spec_text?id=${plantId}`;
  const raw = (await mifloraFetch(url)) as Record<string, unknown>;
  const text = raw.text != null ? String(raw.text) : null;
  return {
    found: text != null && text.length > 0,
    plant_id: plantId,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: url,
    text,
  };
}

export interface MifloraSynonymRecord {
  synonym: string;
  author: string | null;
}

export interface MifloraSynonymsResult {
  found: boolean;
  plant_id: number;
  source_url: string;
  upstream_url: string;
  synonyms: MifloraSynonymRecord[];
}

export async function fetchSynonyms(plantId: number): Promise<MifloraSynonymsResult> {
  const url = `${MIFLORA_API_BASE}/synonyms?id=${plantId}`;
  const raw = await mifloraFetch(url);
  const synonyms: MifloraSynonymRecord[] = Array.isArray(raw)
    ? (raw as Record<string, unknown>[]).map((r) => ({
        synonym: String(r.synonym ?? ""),
        author: r.author != null ? String(r.author) : null,
      }))
    : [];
  return {
    found: synonyms.length > 0,
    plant_id: plantId,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: url,
    synonyms,
  };
}

export interface MifloraPImageResult {
  found: boolean;
  plant_id: number;
  source_url: string;
  upstream_url: string;
  image: MifloraImageRecord | null;
}

export async function fetchPImageInfo(plantId: number): Promise<MifloraPImageResult> {
  const url = `${MIFLORA_API_BASE}/pimage_info?id=${plantId}`;
  const raw = (await mifloraFetch(url)) as Record<string, unknown>;
  const imageId = raw.image_id as number | string | undefined;
  if (imageId == null || "message" in raw) {
    return {
      found: false,
      plant_id: plantId,
      source_url: `https://michiganflora.net/species/${plantId}`,
      upstream_url: url,
      image: null,
    };
  }
  const urls = buildMifloraImageUrls(plantId, imageId);
  return {
    found: true,
    plant_id: plantId,
    source_url: `https://michiganflora.net/species/${plantId}`,
    upstream_url: url,
    image: {
      image_id: imageId,
      image_name: raw.image_name != null ? String(raw.image_name) : null,
      caption: raw.caption != null ? String(raw.caption) : null,
      photographer: raw.photographer != null ? String(raw.photographer) : null,
      image_url: urls.image_url,
      thumbnail_url: urls.thumbnail_url,
    },
  };
}

export function buildProvenance(upstreamUrl: string, method: "api_fetch" | "static_metadata" = "api_fetch") {
  return {
    source_id: MIFLORA_SOURCE_ID,
    fetched_at: new Date(),
    method,
    upstream_url: upstreamUrl,
    general_summary: MIFLORA_GENERAL_SUMMARY,
    technical_details: MIFLORA_TECHNICAL_DETAILS,
  };
}
