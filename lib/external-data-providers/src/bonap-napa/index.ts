/**
 * BONAP NAPA Source Interface
 *
 * Handles live external interaction with bonap.net:
 * PNG map URL construction and HTTP image existence checks.
 *
 * Does NOT read or write any database table — all cache reads and writes
 * remain in the REST Adapter layer.
 */

/** Result returned on success. */
export interface BonapNapaMapUrlResult {
  found: boolean;
  mapUrl: string | null;
  upstreamUrl: string;
  mapTypeServed: "county_species" | "state_species";
}

/** Thrown when bonap.net cannot be reached or returns an inconclusive response. */
export class BonapNapaNetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BonapNapaNetworkError";
  }
}

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Constructs the BONAP PNG map URL with BONAP's required casing:
 * genus is first-letter uppercase + rest lowercase; species is all lowercase.
 */
function buildMapPngUrl(
  genus: string,
  species: string,
  mapType: "county_species" | "state_species",
): string {
  const g = genus.trim().charAt(0).toUpperCase() + genus.trim().slice(1).toLowerCase();
  const s = species.trim().toLowerCase();
  const encoded = encodeURIComponent(`${g} ${s}`);
  if (mapType === "state_species") {
    return `https://bonap.net/MapGallery/State/${encoded}.png`;
  }
  return `https://bonap.net/MapGallery/County/${encoded}.png`;
}

/**
 * Constructs the human-readable BONAP TDC species page URL.
 */
function buildSourcePageUrl(genus: string, species: string): string {
  const g = genus.trim().charAt(0).toUpperCase() + genus.trim().slice(1).toLowerCase();
  const s = species.trim().toLowerCase();
  return `https://bonap.net/TDC/Image/Map?taxonType=Species&taxonId=&locationType=County&mapType=Normal&genus=${encodeURIComponent(g)}&species=${encodeURIComponent(s)}`;
}

/**
 * Checks whether the given URL resolves to a PNG image on bonap.net.
 *
 * Uses HEAD first; falls back to GET for definitive classification.
 *
 * Returns true when the image is confirmed present (200 + image/png).
 * Returns false when the image is confirmed absent (404 or 410).
 * Throws BonapNapaNetworkError on network failure or any response that
 * cannot be definitively classified as found or not_found.
 */
async function checkImageUrl(url: string): Promise<boolean> {
  let headStatus: number | null = null;

  try {
    const headResponse = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(10000),
    });
    headStatus = headResponse.status;
    const contentType = headResponse.headers.get("content-type") ?? "";
    if (headResponse.ok && contentType.includes("image/png")) {
      return true;
    }
    if (headStatus === 404 || headStatus === 410) {
      return false;
    }
  } catch (err) {
    throw new BonapNapaNetworkError(
      `Network error reaching bonap.net: ${String(err)}`,
    );
  }

  try {
    const getResponse = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });
    const contentType = getResponse.headers.get("content-type") ?? "";
    if (getResponse.ok && contentType.includes("image/png")) {
      return true;
    }
    const status = getResponse.status;
    if (
      status === 404 ||
      status === 410 ||
      (headStatus !== null && (headStatus === 404 || headStatus === 410))
    ) {
      return false;
    }
    throw new BonapNapaNetworkError(
      `Inconclusive response from bonap.net: HTTP ${status}`,
    );
  } catch (err) {
    if (err instanceof BonapNapaNetworkError) throw err;
    throw new BonapNapaNetworkError(
      `Network error reaching bonap.net: ${String(err)}`,
    );
  }
}

// ── Source Interface method ───────────────────────────────────────────────────

/**
 * Returns the BONAP NAPA distribution map URL for a species.
 *
 * Constructs the PNG image URL from the provided inputs and verifies
 * that it resolves to an image on bonap.net (HEAD + GET fallback).
 *
 * - `genus`: the genus name as provided by the caller (e.g. "Acer")
 * - `species`: the species epithet as provided by the caller (e.g. "rubrum")
 *   Subspecies qualifiers (subsp., var., f., ssp., cv., group, agg.)
 *   are invalid input and must be rejected by the caller before this
 *   method is invoked.
 * - `mapType`: "county_species" or "state_species"
 *
 * Does NOT read or write any database table.
 * Throws BonapNapaNetworkError on timeout, connection failure, or any
 * response that cannot be definitively classified as found or not_found.
 */
export async function getBonapNapaMapUrl(
  genus: string,
  species: string,
  mapType: "county_species" | "state_species",
): Promise<BonapNapaMapUrlResult> {
  const pngUrl = buildMapPngUrl(genus, species, mapType);

  const found = await checkImageUrl(pngUrl);

  return {
    found,
    mapUrl: found ? pngUrl : null,
    upstreamUrl: pngUrl,
    mapTypeServed: mapType,
  };
}
