/**
 * Universal FQA Source Interface
 *
 * Mirrors the Universal FQA API at http://universalfqa.org/get (redirects to HTTPS;
 * fetch() follows automatically). One exported async function per upstream endpoint;
 * returns { raw, upstream_url } with no field renaming or normalization.
 *
 * The upstream API returns all responses as { status: "success"|"error", data: unknown[][] }
 * — a positionally indexed 2D array. The EDP returns this verbatim.
 *
 * Does NOT read or write any database table — no @workspace/db, drizzle-orm,
 * or @workspace/api-envelope imports anywhere in this file.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const UNIVERSAL_FQA_API_BASE = "http://universalfqa.org/get";
const UNIVERSAL_FQA_USER_AGENT = "FERNS/1.0 (ecologicalcommons.org)";
const UNIVERSAL_FQA_TIMEOUT_MS = 30_000;

// ── Error class ───────────────────────────────────────────────────────────────

export class UniversalFqaApiError extends Error {
  statusCode?: number;
  upstream_url: string;

  constructor(message: string, upstream_url: string, statusCode?: number) {
    super(message);
    this.name = "UniversalFqaApiError";
    this.upstream_url = upstream_url;
    this.statusCode = statusCode;
  }
}

// ── Result type ───────────────────────────────────────────────────────────────

export interface UniversalFqaResult {
  // verbatim upstream: { status: "success"|"error", data: unknown[][] }
  // or { status: "error", message: string } for not-found cases
  raw: unknown;
  upstream_url: string;
}

// ── Private helper ────────────────────────────────────────────────────────────

async function universalFqaFetch(url: string): Promise<UniversalFqaResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": UNIVERSAL_FQA_USER_AGENT,
      },
      signal: AbortSignal.timeout(UNIVERSAL_FQA_TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout =
      err instanceof DOMException && err.name === "TimeoutError";
    throw new UniversalFqaApiError(
      isTimeout
        ? "Universal FQA request timed out"
        : `Universal FQA network error: ${err instanceof Error ? err.message : String(err)}`,
      url,
    );
  }

  if (!response.ok) {
    throw new UniversalFqaApiError(
      `Universal FQA API responded with ${response.status} ${response.statusText}`,
      url,
      response.status,
    );
  }

  return { raw: await response.json(), upstream_url: url };
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Upstream: GET http://universalfqa.org/get/database/
 * Returns: { status: "success", data: [[id, region, year, citation], ...] }
 * Does NOT read or write any database table.
 * Throws UniversalFqaApiError on HTTP error or timeout.
 */
export async function getUniversalFqaDatabase(): Promise<UniversalFqaResult> {
  const upstream_url = `${UNIVERSAL_FQA_API_BASE}/database/`;
  return universalFqaFetch(upstream_url);
}

/**
 * Upstream: GET http://universalfqa.org/get/database/{id}
 * Returns: { status: "success", data: [[...row-indexed header and species rows...]] }
 * Some IDs return { status: "error", message: "..." } — EDP returns this verbatim.
 * Does NOT read or write any database table.
 * Throws UniversalFqaApiError on HTTP error or timeout.
 */
export async function getUniversalFqaDatabaseById(
  id: number,
): Promise<UniversalFqaResult> {
  const upstream_url = `${UNIVERSAL_FQA_API_BASE}/database/${id}`;
  return universalFqaFetch(upstream_url);
}

/**
 * Upstream: GET http://universalfqa.org/get/database/{databaseId}/inventory
 * Returns: { status: "success", data: [[id, name, date, site, practitioner], ...] }
 * Does NOT read or write any database table.
 * Throws UniversalFqaApiError on HTTP error or timeout.
 */
export async function getUniversalFqaDatabaseInventory(
  databaseId: number,
): Promise<UniversalFqaResult> {
  const upstream_url = `${UNIVERSAL_FQA_API_BASE}/database/${databaseId}/inventory`;
  return universalFqaFetch(upstream_url);
}

/**
 * Upstream: GET http://universalfqa.org/get/inventory/{id}
 * Returns: { status: "success", data: [[...row-indexed assessment rows...]] }
 * Private assessments return { status: "error", message: "..." } — EDP returns verbatim.
 * Does NOT read or write any database table.
 * Throws UniversalFqaApiError on HTTP error or timeout.
 */
export async function getUniversalFqaInventory(
  id: number,
): Promise<UniversalFqaResult> {
  const upstream_url = `${UNIVERSAL_FQA_API_BASE}/inventory/${id}`;
  return universalFqaFetch(upstream_url);
}
