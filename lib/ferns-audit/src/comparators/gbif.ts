import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const GBIF_API = "https://api.gbif.org/v1";

const REQUIRED_ENVELOPE_KEYS = ["found", "permission_granted", "pagination", "provenance", "data"] as const;

const REQUIRED_PROVENANCE_KEYS = ["source_url", "method", "cache_status", "queried_at", "license", "rights"] as const;

const RESERVED_DATA_FIELDS = [
  "matched_input",
  "query",
  "resolved_at",
  "source_url",
  "cache_status",
  "vernacular_name_primary",
  "accepted_canonical_name",
  "geography_mode",
  "geography_params",
  "occurrence_count_us",
  "recent_occurrences",
  "candidates",
] as const;

function assertEnvelopeShape(
  envelope: Record<string, unknown>,
  findings: FieldFinding[],
): void {
  for (const key of REQUIRED_ENVELOPE_KEYS) {
    if (!(key in envelope)) {
      findings.push({
        type: "gap",
        sourceField: `envelope.${key}`,
        note: `MISSING required envelope key: "${key}"`,
      });
    }
  }

  const extraKeys = Object.keys(envelope).filter(
    (k) => !(REQUIRED_ENVELOPE_KEYS as readonly string[]).includes(k),
  );
  if (extraKeys.length > 0) {
    findings.push({
      type: "gap",
      sourceField: "envelope",
      note: `Unexpected top-level envelope keys (contract allows only ${REQUIRED_ENVELOPE_KEYS.join(", ")}): ${extraKeys.join(", ")}`,
    });
  }

  const provenance = (envelope["provenance"] ?? {}) as Record<string, unknown>;
  for (const key of REQUIRED_PROVENANCE_KEYS) {
    if (!(key in provenance)) {
      findings.push({
        type: "gap",
        sourceField: `provenance.${key}`,
        note: `MISSING required provenance key: "${key}"`,
      });
    } else if (provenance[key] === undefined) {
      findings.push({
        type: "gap",
        sourceField: `provenance.${key}`,
        note: `provenance.${key} is undefined`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: `provenance.${key}`,
        fernsField: `provenance.${key}`,
        fernsValue: provenance[key],
        note: `provenance.${key} = ${JSON.stringify(provenance[key])}`,
      });
    }
  }

  const data = (envelope["data"] ?? {}) as Record<string, unknown>;
  for (const field of RESERVED_DATA_FIELDS) {
    if (field in data) {
      findings.push({
        type: "gap",
        sourceField: `data.${field}`,
        note: `RESERVED/stale field "${field}" present in data — FERNS should not inject this; data must be verbatim GBIF`,
      });
    }
  }
}

export async function runGbifComparators(
  fernsBase: string,
  species: TestSpecies[],
  searchQueries: Array<{ q: string; label: string }> = [],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    const matchResult = await compareGbifMatch(fernsBase, sp);
    results.push(matchResult);

    const usageKey = matchResult.rawFerns
      ? ((matchResult.rawFerns["usageKey"] ?? matchResult.rawFerns["usage_key"]) as number | undefined)
      : undefined;

    if (usageKey) {
      results.push(await compareGbifSpecies(fernsBase, sp, usageKey));
      results.push(await compareGbifOccurrences(fernsBase, sp, usageKey));
      results.push(await compareGbifSynonyms(fernsBase, sp, usageKey));
      results.push(await compareGbifVernacularNames(fernsBase, sp, usageKey));
    }
  }

  for (const sq of searchQueries) {
    results.push(await compareGbifSearch(fernsBase, sq.q, sq.label));
  }

  return results;
}

async function compareGbifMatch(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/species/match`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const gbifUrl = `${GBIF_API}/species/match?name=${encodeURIComponent(sp.name)}&kingdom=Plantae`;
  const label = `${sp.label} (${sp.name})`;

  try {
    const [gbifRaw, fernsRaw] = await Promise.all([
      fetchJson(gbifUrl),
      fetchJson(fernsUrl),
    ]);

    const gbifObj = gbifRaw as Record<string, unknown>;
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);
    findings.push(...diffObjects(gbifObj, fernsData, "GBIF"));
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/match:${sp.name}`);

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: gbifObj,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareGbifSpecies(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/species/${usageKey}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?refresh=true`;
  const gbifUrl = `${GBIF_API}/species/${usageKey}`;
  const label = `${sp.label} (${sp.name}) — GBIF species record`;

  try {
    const [gbifRaw, fernsRaw] = await Promise.all([
      fetchJson(gbifUrl) as Promise<Record<string, unknown>>,
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/${usageKey}`);

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);
    findings.push(...diffObjects(gbifRaw as Record<string, unknown>, fernsData, "GBIF"));

    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawSource: gbifRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareGbifOccurrences(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/occurrence/search`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxonKey=${usageKey}&country=US&hasCoordinate=true&hasGeospatialIssue=false&limit=20&refresh=true`;
  const label = `${sp.label} (${sp.name}) — GBIF occurrences (US)`;

  try {
    const [fernsRaw, upstreamRaw] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(`${GBIF_API}/occurrence/search?taxonKey=${usageKey}&country=US&hasCoordinate=true&hasGeospatialIssue=false&limit=1`),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/occurrence/search:${sp.name}`);
    const upstreamObj = upstreamRaw as Record<string, unknown>;

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);

    const fernsCount = fernsData["count"] as number | undefined;
    const upstreamCount = upstreamObj["count"] as number | undefined;

    if (fernsCount !== undefined && upstreamCount !== undefined) {
      if (fernsCount === upstreamCount) {
        findings.push({ type: "ok", sourceField: "count", fernsField: "count", fernsValue: fernsCount, note: `US occurrence count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "count",
          fernsField: "count",
          sourceValue: upstreamCount,
          fernsValue: fernsCount,
          note: "Counts may differ if cache was populated at a different time than the audit run",
        });
      }
    } else {
      findings.push({ type: "ok", sourceField: "count", note: `FERNS count: ${fernsCount ?? "n/a"} — upstream count: ${upstreamCount ?? "n/a"}` });
    }

    const fernsResults = (fernsData["results"] as unknown[] | undefined) ?? [];
    findings.push({ type: "ok", sourceField: "results", note: `FERNS returned ${fernsResults.length} occurrence records (limit 20)` });

    for (const required of ["offset", "limit", "endOfRecords"] as const) {
      if (required in fernsData) {
        findings.push({ type: "ok", sourceField: required, fernsField: required, fernsValue: fernsData[required], note: `GBIF native pagination field present: ${required}` });
      } else {
        findings.push({ type: "gap", sourceField: required, note: `MISSING GBIF native pagination field: ${required}` });
      }
    }

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?taxonKey=${usageKey}&country=US`,
      label,
      ok: true,
      rawSource: upstreamObj,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?taxonKey=${usageKey}&country=US`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareGbifSynonyms(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/species/${usageKey}/synonyms`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?refresh=true`;
  const gbifUrl = `${GBIF_API}/species/${usageKey}/synonyms?limit=100`;
  const label = `${sp.label} (${sp.name}) — GBIF synonyms`;

  try {
    const [gbifRaw, fernsRaw] = await Promise.all([
      fetchJson(gbifUrl) as Promise<Record<string, unknown>>,
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/${usageKey}/synonyms`);

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);

    const gbifResults = (gbifRaw["results"] as unknown[]) ?? [];
    const gbifCount = gbifRaw["count"] as number | undefined;
    const fernsResults = (fernsData["results"] as unknown[]) ?? [];
    const fernsCount = fernsData["count"] as number | undefined;

    if (fernsCount !== undefined && gbifCount !== undefined) {
      if (fernsCount === gbifCount) {
        findings.push({ type: "ok", sourceField: "count", fernsField: "count", fernsValue: fernsCount, note: `Synonym count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "count",
          fernsField: "count",
          sourceValue: gbifCount,
          fernsValue: fernsCount,
          note: "Counts may differ if GBIF updated between requests",
        });
      }
    }

    if (fernsResults.length > 0 || gbifResults.length > 0) {
      findings.push({ type: "ok", sourceField: "results", note: `FERNS: ${fernsResults.length} synonyms vs upstream: ${gbifResults.length}` });
    } else {
      findings.push({ type: "ok", sourceField: "results", note: `No synonyms for usageKey ${usageKey}` });
    }

    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawSource: gbifRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareGbifVernacularNames(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/species/${usageKey}/vernacularNames`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?refresh=true`;
  const gbifUrl = `${GBIF_API}/species/${usageKey}/vernacularNames?limit=100`;
  const label = `${sp.label} (${sp.name}) — GBIF vernacular names`;

  try {
    const [gbifRaw, fernsRaw] = await Promise.all([
      fetchJson(gbifUrl) as Promise<Record<string, unknown>>,
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/${usageKey}/vernacularNames`);

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);

    const gbifResults = (gbifRaw["results"] as unknown[]) ?? [];
    const gbifCount = gbifRaw["count"] as number | undefined;
    const fernsResults = (fernsData["results"] as unknown[]) ?? [];
    const fernsCount = fernsData["count"] as number | undefined;

    if (fernsCount !== undefined && gbifCount !== undefined) {
      if (fernsCount === gbifCount) {
        findings.push({ type: "ok", sourceField: "count", fernsField: "count", fernsValue: fernsCount, note: `Vernacular name count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "count",
          fernsField: "count",
          sourceValue: gbifCount,
          fernsValue: fernsCount,
          note: "Counts may differ if GBIF updated between requests",
        });
      }
    }

    if (fernsResults.length > 0 || gbifResults.length > 0) {
      findings.push({ type: "ok", sourceField: "results", note: `FERNS: ${fernsResults.length} names vs upstream: ${gbifResults.length}` });
    } else {
      findings.push({ type: "ok", sourceField: "results", note: `No vernacular names for usageKey ${usageKey}` });
    }

    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawSource: gbifRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareGbifSearch(
  fernsBase: string,
  q: string,
  label: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/species/search`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?q=${encodeURIComponent(q)}`;
  const gbifUrl = `${GBIF_API}/species/search?q=${encodeURIComponent(q)}&qField=VERNACULAR&limit=20`;

  try {
    const [fernsRaw, gbifRaw] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(gbifUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope["data"] ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/search:${q}`);

    const findings: FieldFinding[] = [];
    assertEnvelopeShape(fernsEnvelope, findings);

    const fernsResults = (fernsData["results"] as unknown[]) ?? [];
    const gbifResults = (gbifRaw["results"] as unknown[]) ?? [];
    const gbifCount = gbifRaw["count"] as number | undefined;
    const fernsCount = fernsData["count"] as number | undefined;

    if (fernsCount !== undefined && gbifCount !== undefined) {
      if (fernsCount === gbifCount) {
        findings.push({ type: "ok", sourceField: "count", fernsField: "count", fernsValue: fernsCount, note: `Result count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "count",
          fernsField: "count",
          sourceValue: gbifCount,
          fernsValue: fernsCount,
          note: "Count may differ if cache was populated at a different time",
        });
      }
    }

    if (fernsResults.length > 0) {
      findings.push({ type: "ok", sourceField: "results", note: `${fernsResults.length} results in FERNS vs ${gbifResults.length} upstream results` });
    } else {
      findings.push({ type: "gap", sourceField: "results", note: `FERNS returned no results for query "${q}"` });
    }

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(q)}`,
      label: `${label} — GBIF vernacular search`,
      ok: true,
      rawSource: gbifRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(q)}`,
      label: `${label} — GBIF vernacular search`,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
