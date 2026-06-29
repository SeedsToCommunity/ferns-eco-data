/**
 * GBIF Integration Checks
 *
 * Verifies that all six GBIF adapter routes return correctly shaped envelopes,
 * that the cache miss → store → hit round-trip works for each route, and that
 * error paths (bad params → 400, non-existent upstream resource → 502) return
 * the expected JSON bodies.
 *
 * Requires a running FERNS server and live GBIF API access.
 */

import { collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";

const DEFAULT_TIMEOUT_MS = 25_000;

// ── Stable, well-known GBIF test anchor ───────────────────────────────────────
// Quercus rubra (northern red oak) has been in GBIF since its earliest imports.
// usageKey 2878688 is the accepted backbone taxon and is extremely unlikely to
// be deleted or renumbered.
const TEST_USAGE_KEY = 2878688;
const TEST_NAME = "Quercus rubra";
const TEST_SEARCH_Q = "red oak";

// usageKey guaranteed not to exist on GBIF (value well above any current taxon
// ID range); GBIF returns HTTP 404 which the adapter converts to 502.
const NONEXISTENT_USAGE_KEY = 9_999_999_999;

// ── HTTP helpers ──────────────────────────────────────────────────────────────

interface FetchResult {
  status: number;
  body: unknown;
  ok: boolean;
}

async function fetchRaw(url: string): Promise<FetchResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = null;
    }
    return { status: res.status, body, ok: res.ok };
  } finally {
    clearTimeout(timer);
  }
}

// ── Finding helpers ───────────────────────────────────────────────────────────

/** Returns true iff findings contain no gap or mismatch entries. */
function allPass(findings: FieldFinding[]): boolean {
  return !findings.some((f) => f.type === "gap" || f.type === "mismatch");
}

// ── Envelope shape assertions ─────────────────────────────────────────────────

function assertEnvelope(
  envelope: Record<string, unknown>,
  findings: FieldFinding[],
): void {
  for (const key of ["found", "permission_granted", "provenance", "data"] as const) {
    if (key in envelope) {
      findings.push({ type: "ok", sourceField: key, note: `envelope.${key} present` });
    } else {
      findings.push({ type: "gap", sourceField: key, note: `MISSING required envelope key: "${key}"` });
    }
  }

  const prov = (envelope.provenance ?? {}) as Record<string, unknown>;
  for (const key of ["source_url", "method", "cache_status", "queried_at", "license", "rights"] as const) {
    if (prov[key] !== undefined && prov[key] !== null) {
      findings.push({ type: "ok", sourceField: `provenance.${key}`, fernsValue: prov[key], note: `provenance.${key} = ${JSON.stringify(prov[key])}` });
    } else {
      findings.push({ type: "gap", sourceField: `provenance.${key}`, note: `MISSING provenance.${key}` });
    }
  }
}

function assertCacheStatus(
  envelope: Record<string, unknown>,
  expectedStatus: "miss" | "hit",
  findings: FieldFinding[],
): void {
  const prov = (envelope.provenance ?? {}) as Record<string, unknown>;
  const actual = prov.cache_status;
  if (actual === expectedStatus) {
    findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsValue: actual, note: `cache_status = "${actual}" (expected)` });
  } else {
    findings.push({
      type: "mismatch",
      sourceField: "provenance.cache_status",
      sourceValue: expectedStatus,
      fernsValue: actual,
      note: `cache_status: expected "${expectedStatus}", got ${JSON.stringify(actual)}`,
    });
  }
}

// ── Generic round-trip helper ─────────────────────────────────────────────────

async function checkCacheRoundtrip(
  source: string,
  endpoint: string,
  label: string,
  fernsBase: string,
  refreshUrl: string,
  hitUrl: string,
): Promise<EndpointComparison> {
  const findings: FieldFinding[] = [];
  try {
    // First call: force cache miss
    const missResult = await fetchRaw(refreshUrl);
    if (!missResult.ok) {
      findings.push({ type: "gap", sourceField: "(http)", note: `cache-miss request failed: HTTP ${missResult.status}` });
      return { source, endpoint, label, ok: false, error: `HTTP ${missResult.status} on cache-miss request`, findings, urlsCollected: [] };
    }

    const missEnv = missResult.body as Record<string, unknown>;
    findings.push({ type: "ok", sourceField: "(http:miss)", note: `cache-miss request: HTTP 200` });
    assertEnvelope(missEnv, findings);
    assertCacheStatus(missEnv, "miss", findings);

    // Second call: should be served from cache
    const hitResult = await fetchRaw(hitUrl);
    if (!hitResult.ok) {
      findings.push({ type: "gap", sourceField: "(http)", note: `cache-hit request failed: HTTP ${hitResult.status}` });
      return { source, endpoint, label, ok: false, error: `HTTP ${hitResult.status} on cache-hit request`, findings, urlsCollected: [] };
    }

    const hitEnv = hitResult.body as Record<string, unknown>;
    findings.push({ type: "ok", sourceField: "(http:hit)", note: `cache-hit request: HTTP 200` });
    assertCacheStatus(hitEnv, "hit", findings);

    // Verify data is present and consistent between miss and hit
    const missData = (missEnv.data ?? null) as Record<string, unknown> | null;
    const hitData = (hitEnv.data ?? null) as Record<string, unknown> | null;

    if (missData !== null && hitData !== null) {
      findings.push({ type: "ok", sourceField: "data", note: `data present in both miss and hit responses` });
    } else {
      findings.push({ type: "gap", sourceField: "data", note: `data null in miss=${missData === null} hit=${hitData === null}` });
    }

    const urlsCollected = collectUrls(hitEnv, `${source}${endpoint}`);
    // ok is authoritative: no gap or mismatch findings anywhere in this check
    return { source, endpoint, label, ok: allPass(findings), rawFerns: hitEnv, findings, urlsCollected };
  } catch (err) {
    return { source, endpoint, label, ok: false, error: String(err), findings, urlsCollected: [] };
  }
}

// ── Generic error path helper ─────────────────────────────────────────────────

/**
 * expectedBody: key→value pairs that must ALL be present and match in the
 * response JSON. Use this to assert the full error contract, not just field
 * presence. Omit to check only HTTP status.
 */
async function checkErrorPath(
  source: string,
  endpoint: string,
  label: string,
  url: string,
  expectedStatus: number,
  expectedBody?: Record<string, unknown>,
): Promise<EndpointComparison> {
  const findings: FieldFinding[] = [];
  try {
    const result = await fetchRaw(url);

    // Assert HTTP status
    if (result.status === expectedStatus) {
      findings.push({ type: "ok", sourceField: "(http)", note: `HTTP ${result.status} as expected` });
    } else {
      findings.push({
        type: "mismatch",
        sourceField: "(http)",
        sourceValue: expectedStatus,
        fernsValue: result.status,
        note: `Expected HTTP ${expectedStatus}, got ${result.status}`,
      });
    }

    // Assert response body contract
    const body = result.body as Record<string, unknown> | null;
    if (body === null || typeof body !== "object") {
      findings.push({ type: "gap", sourceField: "(body)", note: `Response body is not a JSON object` });
    } else if (expectedBody) {
      for (const [key, expectedValue] of Object.entries(expectedBody)) {
        const actual = body[key];
        if (!(key in body)) {
          findings.push({ type: "gap", sourceField: key, note: `"${key}" field missing from error body` });
        } else if (expectedValue !== undefined && actual !== expectedValue) {
          findings.push({
            type: "mismatch",
            sourceField: key,
            sourceValue: expectedValue,
            fernsValue: actual,
            note: `"${key}": expected ${JSON.stringify(expectedValue)}, got ${JSON.stringify(actual)}`,
          });
        } else {
          findings.push({ type: "ok", sourceField: key, fernsValue: actual, note: `"${key}" = ${JSON.stringify(actual)}` });
        }
      }
    }

    // ok is authoritative: HTTP status must match AND no gap/mismatch findings
    return { source, endpoint, label, ok: allPass(findings), findings, urlsCollected: [] };
  } catch (err) {
    return { source, endpoint, label, ok: false, error: String(err), findings, urlsCollected: [] };
  }
}

// ── Per-route checks ──────────────────────────────────────────────────────────

async function checkSpeciesMatch(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/species/match`,
      `GBIF species/match cache round-trip (${TEST_NAME})`,
      fernsBase,
      `${fernsBase}/api/gbif/species/match?name=${encodeURIComponent(TEST_NAME)}&refresh=true`,
      `${fernsBase}/api/gbif/species/match?name=${encodeURIComponent(TEST_NAME)}`,
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/match`,
      `GBIF species/match — missing name → 400`,
      `${fernsBase}/api/gbif/species/match`,
      400,
      { error: "invalid_input" },
    ),
  );

  return results;
}

async function checkSpeciesSearch(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/species/search`,
      `GBIF species/search cache round-trip (q="${TEST_SEARCH_Q}")`,
      fernsBase,
      `${fernsBase}/api/gbif/species/search?q=${encodeURIComponent(TEST_SEARCH_Q)}&refresh=true`,
      `${fernsBase}/api/gbif/species/search?q=${encodeURIComponent(TEST_SEARCH_Q)}`,
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/search`,
      `GBIF species/search — missing q → 400`,
      `${fernsBase}/api/gbif/species/search`,
      400,
      { error: "invalid_input" },
    ),
  );

  return results;
}

async function checkSpeciesRecord(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/species/${TEST_USAGE_KEY}`,
      `GBIF species/:usageKey cache round-trip (usageKey=${TEST_USAGE_KEY})`,
      fernsBase,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}?refresh=true`,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}`,
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/${NONEXISTENT_USAGE_KEY}`,
      `GBIF species/:usageKey — non-existent usageKey → 502`,
      `${fernsBase}/api/gbif/species/${NONEXISTENT_USAGE_KEY}?refresh=true`,
      502,
      { error: "upstream_error", message: undefined },
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/not-a-number`,
      `GBIF species/:usageKey — non-numeric usageKey → 400`,
      `${fernsBase}/api/gbif/species/not-a-number`,
      400,
      { error: "invalid_input" },
    ),
  );

  return results;
}

async function checkSynonyms(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/species/${TEST_USAGE_KEY}/synonyms`,
      `GBIF synonyms cache round-trip (usageKey=${TEST_USAGE_KEY})`,
      fernsBase,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}/synonyms?refresh=true`,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}/synonyms`,
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/${NONEXISTENT_USAGE_KEY}/synonyms`,
      `GBIF synonyms — non-existent usageKey → 502`,
      `${fernsBase}/api/gbif/species/${NONEXISTENT_USAGE_KEY}/synonyms?refresh=true`,
      502,
      { error: "upstream_error", message: undefined },
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/bad/synonyms`,
      `GBIF synonyms — non-numeric usageKey → 400`,
      `${fernsBase}/api/gbif/species/bad/synonyms`,
      400,
      { error: "invalid_input" },
    ),
  );

  return results;
}

async function checkVernacularNames(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/species/${TEST_USAGE_KEY}/vernacularNames`,
      `GBIF vernacularNames cache round-trip (usageKey=${TEST_USAGE_KEY})`,
      fernsBase,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}/vernacularNames?refresh=true`,
      `${fernsBase}/api/gbif/species/${TEST_USAGE_KEY}/vernacularNames`,
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/${NONEXISTENT_USAGE_KEY}/vernacularNames`,
      `GBIF vernacularNames — non-existent usageKey → 502`,
      `${fernsBase}/api/gbif/species/${NONEXISTENT_USAGE_KEY}/vernacularNames?refresh=true`,
      502,
      { error: "upstream_error", message: undefined },
    ),
  );

  results.push(
    await checkErrorPath(
      "gbif",
      `/api/gbif/species/bad/vernacularNames`,
      `GBIF vernacularNames — non-numeric usageKey → 400`,
      `${fernsBase}/api/gbif/species/bad/vernacularNames`,
      400,
      { error: "invalid_input" },
    ),
  );

  return results;
}

async function checkOccurrenceSearch(fernsBase: string): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  const occParams = `taxonKey=${TEST_USAGE_KEY}&country=US&hasCoordinate=true&hasGeospatialIssue=false&limit=5`;

  results.push(
    await checkCacheRoundtrip(
      "gbif",
      `/api/gbif/occurrence/search`,
      `GBIF occurrence/search cache round-trip (taxonKey=${TEST_USAGE_KEY}, US)`,
      fernsBase,
      `${fernsBase}/api/gbif/occurrence/search?${occParams}&refresh=true`,
      `${fernsBase}/api/gbif/occurrence/search?${occParams}`,
    ),
  );

  return results;
}

// ── Public entry point ────────────────────────────────────────────────────────

export async function runGbifIntegrationChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const [matchChecks, searchChecks, speciesChecks, synonymChecks, vernacularChecks, occurrenceChecks] =
    await Promise.all([
      checkSpeciesMatch(fernsBase),
      checkSpeciesSearch(fernsBase),
      checkSpeciesRecord(fernsBase),
      checkSynonyms(fernsBase),
      checkVernacularNames(fernsBase),
      checkOccurrenceSearch(fernsBase),
    ]);

  return [
    ...matchChecks,
    ...searchChecks,
    ...speciesChecks,
    ...synonymChecks,
    ...vernacularChecks,
    ...occurrenceChecks,
  ];
}
