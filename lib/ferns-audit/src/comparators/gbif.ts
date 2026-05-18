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
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;

    const findings = diffObjects(gbifObj, fernsData, "GBIF");
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

async function compareGbifOccurrences(
  fernsBase: string,
  sp: TestSpecies,
  usageKey: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/occurrence/search`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?usageKey=${usageKey}&countries=US&refresh=true`;
  const label = `${sp.label} (${sp.name}) — GBIF occurrences (US)`;

  try {
    const [fernsRaw, upstreamCount] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(`${GBIF_API}/occurrence/count?taxonKey=${usageKey}&country=US`),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/occurrence/search:${sp.name}`);

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
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/${usageKey}/synonyms`);

    const findings: FieldFinding[] = [];

    const gbifResults = (gbifRaw.results as unknown[]) ?? [];
    const gbifCount = gbifRaw.count as number | undefined;
    const fernsSynonyms = (fernsData.synonyms as unknown[]) ?? [];
    const fernsCount = fernsData.synonym_count as number | undefined;

    if (fernsCount !== undefined && gbifCount !== undefined) {
      if (fernsCount === gbifCount) {
        findings.push({ type: "ok", sourceField: "synonym_count", fernsField: "synonym_count", fernsValue: fernsCount, note: `Synonym count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "synonym_count",
          fernsField: "synonym_count",
          sourceValue: gbifCount,
          fernsValue: fernsCount,
          note: "Counts may differ if GBIF updated between requests",
        });
      }
    }

    if (fernsSynonyms.length > 0 || gbifResults.length > 0) {
      findings.push({ type: "ok", sourceField: "synonyms", note: `FERNS: ${fernsSynonyms.length} synonyms vs upstream: ${gbifResults.length}` });
    } else {
      findings.push({ type: "ok", sourceField: "synonyms", note: `No synonyms for usageKey ${usageKey}` });
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
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/${usageKey}/vernacularNames`);

    const findings: FieldFinding[] = [];

    const gbifResults = (gbifRaw.results as unknown[]) ?? [];
    const gbifCount = gbifRaw.count as number | undefined;
    const fernsNames = (fernsData.vernacular_names as unknown[]) ?? [];
    const fernsCount = fernsData.vernacular_name_count as number | undefined;

    if (fernsCount !== undefined && gbifCount !== undefined) {
      if (fernsCount === gbifCount) {
        findings.push({ type: "ok", sourceField: "vernacular_name_count", fernsField: "vernacular_name_count", fernsValue: fernsCount, note: `Vernacular name count matches: ${fernsCount}` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "vernacular_name_count",
          fernsField: "vernacular_name_count",
          sourceValue: gbifCount,
          fernsValue: fernsCount,
          note: "Counts may differ if GBIF updated between requests",
        });
      }
    }

    if (fernsNames.length > 0 || gbifResults.length > 0) {
      findings.push({ type: "ok", sourceField: "vernacular_names", note: `FERNS: ${fernsNames.length} names vs upstream: ${gbifResults.length}` });
    } else {
      findings.push({ type: "ok", sourceField: "vernacular_names", note: `No vernacular names for usageKey ${usageKey}` });
    }

    if (fernsData.vernacular_name_primary !== undefined) {
      findings.push({ type: "ok", sourceField: "vernacular_name_primary", fernsField: "vernacular_name_primary", fernsValue: fernsData.vernacular_name_primary, note: `Primary English name: "${fernsData.vernacular_name_primary}"` });
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
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/species/search:${q}`);

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
