import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const GBIF_API = "https://api.gbif.org/v1";

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
      results.push(await compareGbifReconcile(fernsBase, sp, usageKey));
      results.push(await compareGbifOccurrences(fernsBase, sp, usageKey));
    }
  }

  for (const sq of searchQueries) {
    results.push(await compareGbifSearch(fernsBase, sq.q, sq.label));
  }

  return results;
}

async function compareGbifMatch(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/match`;
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
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;

    const findings = diffObjects(gbifObj, fernsData, "GBIF");
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/match:${sp.name}`);

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

async function compareGbifReconcile(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/reconcile`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?usageKey=${usageKey}&refresh=true`;
  const label = `${sp.label} (${sp.name}) — GBIF reconcile (synonyms + vernacular)`;

  try {
    const [fernsRaw, upstreamSynonyms, upstreamVernacular] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(`${GBIF_API}/species/${usageKey}/synonyms?limit=100`) as Promise<Record<string, unknown>>,
      fetchJson(`${GBIF_API}/species/${usageKey}/vernacularNames?limit=100`) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/reconcile:${sp.name}`);

    const findings: FieldFinding[] = [];

    const fernsCount = fernsData.synonym_count as number | undefined;
    const upstreamCount = upstreamSynonyms.count as number | undefined;
    if (fernsCount !== undefined && upstreamCount !== undefined) {
      if (fernsCount === upstreamCount) {
        findings.push({ type: "ok", sourceField: "synonym_count", fernsField: "synonym_count", fernsValue: fernsCount, note: `synonym_count matches: ${fernsCount}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "synonym_count", fernsField: "synonym_count", sourceValue: upstreamCount, fernsValue: fernsCount });
      }
    } else {
      findings.push({ type: "ok", sourceField: "synonym_count", note: `FERNS: ${fernsCount ?? "n/a"} — upstream count not available for comparison` });
    }

    const fernsVernCount = fernsData.vernacular_name_count as number | undefined;
    const upstreamVernCount = upstreamVernacular.count as number | undefined;
    if (fernsVernCount !== undefined && upstreamVernCount !== undefined) {
      if (fernsVernCount === upstreamVernCount) {
        findings.push({ type: "ok", sourceField: "vernacular_name_count", fernsField: "vernacular_name_count", fernsValue: fernsVernCount, note: `vernacular_name_count matches: ${fernsVernCount}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "vernacular_name_count", fernsField: "vernacular_name_count", sourceValue: upstreamVernCount, fernsValue: fernsVernCount });
      }
    }

    if (fernsData.vernacular_name_primary !== undefined) {
      findings.push({ type: "ok", sourceField: "vernacular_name_primary", fernsField: "vernacular_name_primary", fernsValue: fernsData.vernacular_name_primary, note: `primary vernacular name: "${fernsData.vernacular_name_primary}"` });
    }

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?usageKey=${usageKey}`,
      label,
      ok: true,
      rawSource: { synonyms: upstreamSynonyms, vernacular: upstreamVernacular },
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?usageKey=${usageKey}`,
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
  const fernsEndpoint = `/api/gbif/occurrences`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?usageKey=${usageKey}&countries=US&refresh=true`;
  const label = `${sp.label} (${sp.name}) — GBIF occurrences (US)`;

  try {
    const [fernsRaw, upstreamCount] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(`${GBIF_API}/occurrence/count?taxonKey=${usageKey}&country=US`),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/occurrences:${sp.name}`);

    const findings: FieldFinding[] = [];

    const fernsOccCount = fernsData.occurrence_count_us as number | undefined;
    const upstreamOccCount = typeof upstreamCount === "number" ? upstreamCount : undefined;

    if (fernsOccCount !== undefined && upstreamOccCount !== undefined) {
      if (fernsOccCount === upstreamOccCount) {
        findings.push({ type: "ok", sourceField: "occurrence_count_us", fernsField: "occurrence_count_us", fernsValue: fernsOccCount, note: `US occurrence count matches: ${fernsOccCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "occurrence_count_us",
          fernsField: "occurrence_count_us",
          sourceValue: upstreamOccCount,
          fernsValue: fernsOccCount,
          note: "Counts may differ if cache was populated at a different time than the audit run",
        });
      }
    } else {
      findings.push({ type: "ok", sourceField: "occurrence_count_us", note: `FERNS: ${fernsOccCount ?? "n/a"} — upstream returned: ${String(upstreamCount)}` });
    }

    if (typeof fernsData.geography_mode === "string") {
      findings.push({ type: "ok", sourceField: "geography_mode", fernsField: "geography_mode", fernsValue: fernsData.geography_mode, note: `geography_mode: "${fernsData.geography_mode}"` });
    }

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?usageKey=${usageKey}&countries=US`,
      label,
      ok: true,
      rawSource: { upstream_count: upstreamOccCount },
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?usageKey=${usageKey}&countries=US`,
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
  const fernsEndpoint = `/api/gbif/search`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?q=${encodeURIComponent(q)}`;
  const gbifUrl = `${GBIF_API}/species/search?q=${encodeURIComponent(q)}&qField=VERNACULAR&limit=20`;

  try {
    const [fernsRaw, gbifRaw] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(gbifUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/search:${q}`);

    const findings: FieldFinding[] = [];

    const fernsCandidates = (fernsData.candidates as unknown[]) ?? [];
    const gbifResults = (gbifRaw.results as unknown[]) ?? [];
    const gbifCount = gbifRaw.count as number | undefined;
    const fernsCount = fernsData.count as number | undefined;

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

    if (fernsCandidates.length > 0) {
      findings.push({ type: "ok", sourceField: "candidates", note: `${fernsCandidates.length} candidates in FERNS vs ${gbifResults.length} upstream results` });
    } else {
      findings.push({ type: "gap", sourceField: "candidates", note: `FERNS returned no candidates for query "${q}"` });
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
