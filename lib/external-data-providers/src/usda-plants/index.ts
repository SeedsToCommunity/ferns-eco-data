/**
 * USDA Plants Source Interface
 *
 * Handles live external interaction with plantsservices.sc.egov.usda.gov/api.
 * Wraps three upstream endpoints: PlantSearch (autocomplete), PlantProfile
 * (full taxon profile), and plants-search-results (paginated search).
 *
 * Does NOT read or write any database table — all cache reads and writes
 * remain in the REST Adapter layer.
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const USDA_PLANTS_API_BASE = "https://plantsservices.sc.egov.usda.gov/api";
const USDA_PLANTS_USER_AGENT = "FERNS/1.0";
const USDA_PLANTS_TIMEOUT_MS = 15000;

// ── Error class ───────────────────────────────────────────────────────────────

export class UsdaPlantsApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "UsdaPlantsApiError";
  }
}

// ── Result types ──────────────────────────────────────────────────────────────

export interface UsdaPlantsPlantItem {
  Text: string;
  Plant: Record<string, unknown>;
}

export interface UsdaPlantsPlantSearchResult {
  found: boolean;
  upstreamUrl: string;
  /** Verbatim upstream array. Empty array when upstream returns no results. */
  items: UsdaPlantsPlantItem[];
}

export interface UsdaPlantsPlantProfileResult {
  found: boolean;
  upstreamUrl: string;
  /** Verbatim upstream object, or null when upstream returns no record. */
  profile: Record<string, unknown> | null;
}

export interface UsdaPlantsPlantsSearchResult {
  found: boolean;
  upstreamUrl: string;
  /** Verbatim upstream response object. */
  raw: Record<string, unknown>;
}

// ── Input type ────────────────────────────────────────────────────────────────

export interface UsdaPlantsSearchCriteria {
  Text: string;
  Field: "Scientific Name" | "Common Name" | "Symbol" | "Family";
  pageNumber: number;
  SortBy?: string;
  Offset?: number;
  Type?: string;
}

// ── Private HTTP helper ───────────────────────────────────────────────────────

async function usdaPlantsFetch(
  url: string,
  options?: RequestInit,
): Promise<Response> {
  const signal = AbortSignal.timeout(USDA_PLANTS_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": USDA_PLANTS_USER_AGENT,
        ...(options?.headers ?? {}),
      },
    });
  } catch (err) {
    const isTimeout =
      err instanceof DOMException && err.name === "TimeoutError";
    throw new UsdaPlantsApiError(
      isTimeout
        ? `USDA Plants API request timed out after ${USDA_PLANTS_TIMEOUT_MS}ms for ${url}`
        : `USDA Plants API network error for ${url}: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
  if (!res.ok) {
    throw new UsdaPlantsApiError(
      `USDA Plants API responded with ${res.status} ${res.statusText} for ${url}`,
      res.status,
    );
  }
  return res;
}

// ── Exported functions ────────────────────────────────────────────────────────

/**
 * Upstream: GET /PlantSearch?searchText={searchText}
 * Returns the verbatim autocomplete array from the upstream.
 * Does NOT read or write any database table.
 * Throws UsdaPlantsApiError on HTTP error or timeout.
 */
export async function getUsdaPlantsPlantSearch(
  searchText: string,
): Promise<UsdaPlantsPlantSearchResult> {
  const upstreamUrl = `${USDA_PLANTS_API_BASE}/PlantSearch?searchText=${encodeURIComponent(searchText)}`;
  const res = await usdaPlantsFetch(upstreamUrl);
  const items = (await res.json()) as UsdaPlantsPlantItem[];
  return {
    found: Array.isArray(items) && items.length > 0,
    upstreamUrl,
    items: Array.isArray(items) ? items : [],
  };
}

/**
 * Upstream: GET /PlantProfile?symbol={symbol}
 * Returns the verbatim profile object from the upstream.
 * Does NOT read or write any database table.
 * Throws UsdaPlantsApiError on HTTP error or timeout.
 */
export async function getUsdaPlantsPlantProfile(
  symbol: string,
): Promise<UsdaPlantsPlantProfileResult> {
  const upstreamUrl = `${USDA_PLANTS_API_BASE}/PlantProfile?symbol=${encodeURIComponent(symbol)}`;
  const res = await usdaPlantsFetch(upstreamUrl);
  const profile = (await res.json()) as Record<string, unknown> | null;
  const found =
    profile !== null &&
    typeof profile === "object" &&
    typeof profile["Id"] === "number";
  return {
    found,
    upstreamUrl,
    profile: profile ?? null,
  };
}

/**
 * Upstream: POST /plants-search-results
 * Sends the criteria object verbatim as the POST body.
 * Returns the verbatim upstream response object.
 * Does NOT read or write any database table.
 * Throws UsdaPlantsApiError on HTTP error or timeout.
 */
export async function getUsdaPlantsPlantsSearchResults(
  criteria: UsdaPlantsSearchCriteria,
): Promise<UsdaPlantsPlantsSearchResult> {
  const upstreamUrl = `${USDA_PLANTS_API_BASE}/plants-search-results`;
  const body: Record<string, unknown> = {
    SortBy: "sortSciName",
    Offset: -1,
    Type: "Basic",
    FilterOptions: null,
    UnfilteredPlantIds: null,
    TaxonSearchCriteria: null,
    MasterId: -1,
    allData: 0,
    ...criteria,
  };
  const res = await usdaPlantsFetch(upstreamUrl, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const raw = (await res.json()) as Record<string, unknown>;
  const found =
    typeof raw["TotalResults"] === "number" && raw["TotalResults"] > 0;
  return {
    found,
    upstreamUrl,
    raw,
  };
}
