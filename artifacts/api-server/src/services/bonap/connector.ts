import {
  BONAP_DERIVATION_SCIENTIFIC,
  BONAP_DERIVATION_SUMMARY,
  BONAP_SOURCE_ID,
} from "./metadata.js";

export type MapType = "county_species" | "state_species";

export interface NormalizedInput {
  genus: string;
  species: string | null;
  map_type: MapType;
  species_stripped: boolean;
}

export interface VerificationResult {
  status: "found" | "not_found" | "unverified";
  map_url: string | null;
  source_url: string | null;
  upstream_url: string;
  normalized: NormalizedInput;
}

const SUBSPECIES_PATTERN = /\s+(subsp\.|var\.|f\.|ssp\.|cv\.|group|agg\.)\s+.*/i;

export function normalizeInput(
  genus: string,
  species?: string | null,
  map_type: MapType = "county_species",
): NormalizedInput {
  const normalizedGenus =
    genus.trim().charAt(0).toUpperCase() + genus.trim().slice(1).toLowerCase();

  let normalizedSpecies: string | null = null;
  let species_stripped = false;

  if (species && species.trim()) {
    const raw = species.trim().toLowerCase();
    if (SUBSPECIES_PATTERN.test(raw)) {
      normalizedSpecies = raw.replace(SUBSPECIES_PATTERN, "").trim();
      species_stripped = true;
    } else {
      normalizedSpecies = raw;
    }
  }

  return {
    genus: normalizedGenus,
    species: normalizedSpecies,
    map_type,
    species_stripped,
  };
}

export function buildMapUrl(input: NormalizedInput): string | null {
  if (!input.species) return null;
  const encoded = encodeURIComponent(`${input.genus} ${input.species}`);
  if (input.map_type === "county_species") {
    return `https://bonap.net/MapGallery/County/${encoded}.png`;
  }
  if (input.map_type === "state_species") {
    return `https://bonap.net/MapGallery/State/${encoded}.png`;
  }
  return null;
}

export function buildSourceUrl(input: NormalizedInput): string | null {
  if (input.species) {
    return `https://bonap.net/TDC/Image/Map?taxonType=Species&taxonId=&locationType=County&mapType=Normal&genus=${encodeURIComponent(input.genus)}&species=${encodeURIComponent(input.species)}`;
  }
  return null;
}

export function buildCacheKey(input: NormalizedInput): string {
  const genus = input.genus.toLowerCase();
  if (input.map_type === "state_species") {
    return `bonap:state:${genus}:${input.species ?? ""}`;
  }
  return `bonap:county:${genus}:${input.species ?? ""}`;
}

async function checkImageUrl(url: string): Promise<"found" | "not_found" | "unverified"> {
  let headStatus: number | null = null;
  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    });
    headStatus = headResponse.status;
    const headContentType = headResponse.headers.get("content-type") ?? "";
    if (headResponse.ok && headContentType.includes("image/png")) {
      return "found";
    }
    // Fall through to GET for definitive classification in all other cases
  } catch {
    return "unverified";
  }

  try {
    const getResponse = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });
    const getContentType = getResponse.headers.get("content-type") ?? "";
    if (getResponse.ok && getContentType.includes("image/png")) {
      return "found";
    }
    if (getResponse.ok) {
      return "not_found";
    }
    const status = getResponse.status;
    if (status === 404 || status === 410 || (headStatus !== null && (headStatus === 404 || headStatus === 410))) {
      return "not_found";
    }
    return "unverified";
  } catch {
    return "unverified";
  }
}

export async function verifyMapExists(
  input: NormalizedInput,
): Promise<VerificationResult> {
  const mapUrl = buildMapUrl(input);
  const sourceUrl = buildSourceUrl(input);

  if (!mapUrl) {
    return {
      status: "not_found",
      map_url: null,
      source_url: sourceUrl,
      upstream_url: input.map_type === "state_species"
        ? `https://bonap.net/MapGallery/State/`
        : `https://bonap.net/MapGallery/County/`,
      normalized: input,
    };
  }

  const result = await checkImageUrl(mapUrl);
  return {
    status: result,
    map_url: result === "found" ? mapUrl : null,
    source_url: sourceUrl,
    upstream_url: mapUrl,
    normalized: input,
  };
}

export function buildProvenance(result: VerificationResult) {
  return {
    source_id: BONAP_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: result.upstream_url,
    derivation_summary: BONAP_DERIVATION_SUMMARY,
    derivation_scientific: BONAP_DERIVATION_SCIENTIFIC,
  };
}
