/**
 * GBIF Source Interface
 *
 * Mirrors the GBIF Species and Occurrence APIs at https://api.gbif.org/v1.
 * One exported async function per upstream endpoint; returns { raw, upstream_url }
 * with no field renaming or normalization.
 *
 * Does NOT read or write any database table — no @workspace/db, drizzle-orm,
 * or @workspace/api-envelope imports anywhere in this file.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const GBIF_API_BASE = "https://api.gbif.org/v1";
const GBIF_USER_AGENT = "FERNS/1.0 (ecologicalcommons.org)";
const GBIF_TIMEOUT_MS = 20_000;

// ── Error class ───────────────────────────────────────────────────────────────

export class GbifApiError extends Error {
  statusCode?: number;
  upstream_url: string;

  constructor(message: string, upstream_url: string, statusCode?: number) {
    super(message);
    this.name = "GbifApiError";
    this.upstream_url = upstream_url;
    this.statusCode = statusCode;
  }
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface GbifSpeciesMatchResult {
  raw: unknown;
  upstream_url: string;
}

export interface GbifSpeciesSearchResult {
  raw: unknown;
  upstream_url: string;
}

export interface GbifSpeciesSearchParams {
  q: string;
  qField?: string;
  rank?: string;
  kingdom?: string;
  limit?: number;
  offset?: number;
}

export interface GbifSpeciesResult {
  raw: unknown;
  upstream_url: string;
}

export interface GbifSpeciesSynonymsResult {
  raw: unknown;
  upstream_url: string;
}

export interface GbifSpeciesVernacularNamesResult {
  raw: unknown;
  upstream_url: string;
}

export interface GbifOccurrenceSearchResult {
  raw: unknown;
  upstream_url: string;
}

// ── Private helper ────────────────────────────────────────────────────────────

async function gbifFetch(url: string): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": GBIF_USER_AGENT,
      },
      signal: AbortSignal.timeout(GBIF_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err instanceof DOMException && err.name === "TimeoutError";
    throw new GbifApiError(
      isTimeout
        ? "GBIF request timed out"
        : `GBIF network error: ${err instanceof Error ? err.message : String(err)}`,
      url,
    );
  }

  if (!response.ok) {
    throw new GbifApiError(
      `GBIF API responded with ${response.status} ${response.statusText}`,
      url,
      response.status,
    );
  }

  return response.json();
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Upstream: GET /v1/species/match?name={name}&kingdom={kingdom}
 * No-match: upstream returns { matchType: "NONE" } (HTTP 200, no usageKey).
 * The EDP returns that verbatim; found determination is the adapter's responsibility.
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifSpeciesMatch(
  name: string,
  kingdom = "Plantae",
): Promise<GbifSpeciesMatchResult> {
  const upstream_url = `${GBIF_API_BASE}/species/match?name=${encodeURIComponent(name)}&kingdom=${encodeURIComponent(kingdom)}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}

/**
 * Upstream: GET /v1/species/search?q={q}[&qField=...&rank=...&kingdom=...&limit=...&offset=...]
 * Undefined params are omitted from the query string.
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifSpeciesSearch(
  params: GbifSpeciesSearchParams,
): Promise<GbifSpeciesSearchResult> {
  const parts: string[] = [`q=${encodeURIComponent(params.q)}`];
  if (params.qField !== undefined) {
    parts.push(`qField=${encodeURIComponent(params.qField)}`);
  }
  if (params.rank !== undefined) {
    parts.push(`rank=${encodeURIComponent(params.rank)}`);
  }
  if (params.kingdom !== undefined) {
    parts.push(`kingdom=${encodeURIComponent(params.kingdom)}`);
  }
  if (params.limit !== undefined) {
    parts.push(`limit=${params.limit}`);
  }
  if (params.offset !== undefined) {
    parts.push(`offset=${params.offset}`);
  }
  const upstream_url = `${GBIF_API_BASE}/species/search?${parts.join("&")}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}

/**
 * Upstream: GET /v1/species/{usageKey}
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifSpecies(
  usageKey: number,
): Promise<GbifSpeciesResult> {
  const upstream_url = `${GBIF_API_BASE}/species/${usageKey}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}

/**
 * Upstream: GET /v1/species/{usageKey}/synonyms?limit={limit}&offset={offset}
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifSpeciesSynonyms(
  usageKey: number,
  limit = 100,
  offset = 0,
): Promise<GbifSpeciesSynonymsResult> {
  const upstream_url = `${GBIF_API_BASE}/species/${usageKey}/synonyms?limit=${limit}&offset=${offset}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}

/**
 * Upstream: GET /v1/species/{usageKey}/vernacularNames?limit={limit}&offset={offset}
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifSpeciesVernacularNames(
  usageKey: number,
  limit = 100,
  offset = 0,
): Promise<GbifSpeciesVernacularNamesResult> {
  const upstream_url = `${GBIF_API_BASE}/species/${usageKey}/vernacularNames?limit=${limit}&offset=${offset}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}

/**
 * Upstream: GET /v1/occurrence/search?{...params}
 * Multi-value params: each value gets its own key=value pair.
 * Does NOT read or write any database table.
 * Throws GbifApiError on HTTP error or timeout.
 */
export async function getGbifOccurrenceSearch(
  params: Record<string, string | string[]>,
): Promise<GbifOccurrenceSearchResult> {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      for (const val of v) {
        parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(val)}`);
      }
    } else {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
  }
  const upstream_url = `${GBIF_API_BASE}/occurrence/search${parts.length ? "?" + parts.join("&") : ""}`;
  const raw = await gbifFetch(upstream_url);
  return { raw, upstream_url };
}
