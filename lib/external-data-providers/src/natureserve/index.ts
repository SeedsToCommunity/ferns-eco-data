/**
 * NatureServe Source Interface
 *
 * Mirrors the NatureServe Explorer API at https://explorer.natureserve.org/api/data.
 * One exported async function per upstream endpoint; returns { raw, upstream_url }
 * with no field renaming, normalization, or cross-endpoint stitching.
 *
 * Does NOT read or write any database table — no @workspace/db, drizzle-orm,
 * or @workspace/api-envelope imports anywhere in this file.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const NATURESERVE_API_BASE = "https://explorer.natureserve.org/api/data";
const NATURESERVE_TIMEOUT_MS = 20_000;

// ── Error class ───────────────────────────────────────────────────────────────

export class NatureserveApiError extends Error {
  statusCode?: number;
  upstream_url: string;

  constructor(message: string, upstream_url: string, statusCode?: number) {
    super(message);
    this.name = "NatureserveApiError";
    this.upstream_url = upstream_url;
    this.statusCode = statusCode;
  }
}

// ── Shared result type ────────────────────────────────────────────────────────

export interface NatureserveResult {
  raw: unknown;
  upstream_url: string;
}

// ── Request body types ────────────────────────────────────────────────────────

export interface NatureserveSpeciesSearchBody {
  criteriaType: string;
  textCriteria: Array<{
    paramType: string;
    searchToken: string;
  }>;
  pagingOptions?: {
    recordsPerPage?: number;
    page?: number;
  };
}

export interface NatureserveSearchBody {
  criteriaType: string;
  recordTypeCriteria?: Array<{
    paramType: string;
    recordType: string;
  }>;
  textCriteria?: Array<{
    paramType: string;
    searchToken: string;
  }>;
  pagingOptions?: {
    recordsPerPage?: number;
    page?: number;
  };
}

// ── Private helper ────────────────────────────────────────────────────────────

async function natureserveFetch(
  url: string,
  options?: RequestInit,
): Promise<NatureserveResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options?.headers as Record<string, string> | undefined),
      },
      signal: AbortSignal.timeout(NATURESERVE_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err instanceof DOMException && err.name === "TimeoutError";
    throw new NatureserveApiError(
      isTimeout
        ? "NatureServe request timed out"
        : `NatureServe network error: ${err instanceof Error ? err.message : String(err)}`,
      url,
    );
  }

  if (!response.ok) {
    throw new NatureserveApiError(
      `NatureServe API responded with ${response.status} ${response.statusText}`,
      url,
      response.status,
    );
  }

  return { raw: await response.json(), upstream_url: url };
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Upstream: POST https://explorer.natureserve.org/api/data/speciesSearch
 * Request body: { criteriaType, textCriteria, pagingOptions? }
 * Response: verbatim JSON — { resultsSummary: {...}, results: [...] }
 *
 * The adapter constructs the body; this function forwards it verbatim to the upstream.
 * State-scoping logic and any chained /taxon call are NOT reproduced here —
 * each upstream endpoint is a separate EDP function.
 *
 * Does NOT read or write any database table.
 * Throws NatureserveApiError on HTTP error or timeout.
 */
export async function postNatureserveSpeciesSearch(
  body: NatureserveSpeciesSearchBody,
): Promise<NatureserveResult> {
  const upstream_url = `${NATURESERVE_API_BASE}/speciesSearch`;
  return natureserveFetch(upstream_url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Upstream: POST https://explorer.natureserve.org/api/data/search
 * Request body: { criteriaType, recordTypeCriteria?, textCriteria?, pagingOptions? }
 * Response: verbatim JSON — { resultsSummary: {...}, results: [...] }
 *
 * The adapter constructs the body; this function forwards it verbatim to the upstream.
 * Does NOT read or write any database table.
 * Throws NatureserveApiError on HTTP error or timeout.
 */
export async function postNatureserveSearch(
  body: NatureserveSearchBody,
): Promise<NatureserveResult> {
  const upstream_url = `${NATURESERVE_API_BASE}/search`;
  return natureserveFetch(upstream_url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Upstream: GET https://explorer.natureserve.org/api/data/taxon/{uniqueId}
 * uniqueId format: "ELEMENT_GLOBAL.2.{elementGlobalId}" (caller constructs from speciesSearch results)
 * Response: verbatim JSON — full taxon detail object
 *
 * Does NOT read or write any database table.
 * Throws NatureserveApiError on HTTP error or timeout.
 */
export async function getNatureserveTaxon(
  uniqueId: string,
): Promise<NatureserveResult> {
  const upstream_url = `${NATURESERVE_API_BASE}/taxon/${encodeURIComponent(uniqueId)}`;
  return natureserveFetch(upstream_url);
}
