import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";

const SOURCE = "natureserve";

export async function runNatureserveComparators(
  fernsBase: string,
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  const speciesResult = await compareSpeciesSearch(fernsBase);
  results.push(speciesResult);

  results.push(await compareSearch(fernsBase));

  const uniqueId = extractUniqueId(speciesResult);
  results.push(await compareTaxon(fernsBase, uniqueId));

  return results;
}

function extractUniqueId(speciesResult: EndpointComparison): string | null {
  try {
    const envelope = speciesResult.rawFerns as Record<string, unknown> | undefined;
    const data = envelope?.data as Record<string, unknown> | undefined;
    const results = data?.results as Array<Record<string, unknown>> | undefined;
    if (!Array.isArray(results) || results.length === 0) return null;
    const first = results[0];
    if (typeof first?.uniqueId === "string" && first.uniqueId.length > 0) {
      return first.uniqueId;
    }
    if (typeof first?.elementGlobalId === "string" && first.elementGlobalId.length > 0) {
      return first.elementGlobalId;
    }
    return null;
  } catch {
    return null;
  }
}

async function compareSpeciesSearch(fernsBase: string): Promise<EndpointComparison> {
  const endpoint = `/api/natureserve/speciesSearch?name=Lobelia+cardinalis&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `NatureServe — speciesSearch (Lobelia cardinalis): data.results is array`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `${SOURCE}:speciesSearch:Lobelia cardinalis`);

    const data = fernsRaw.data as Record<string, unknown> | null | undefined;
    if (!data || typeof data !== "object") {
      findings.push({
        type: "mismatch",
        sourceField: "data",
        note: `data must be a non-null object; got ${data === null ? "null" : typeof data}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    if (!Array.isArray(data.results)) {
      findings.push({
        type: "mismatch",
        sourceField: "data.results",
        fernsField: "data.results",
        sourceValue: "Array",
        fernsValue: typeof data.results,
        note: `data.results must be an array (verbatim upstream shape); got ${typeof data.results}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    findings.push({
      type: "ok",
      sourceField: "data.results",
      note: `data.results is array with ${(data.results as unknown[]).length} item(s) — verbatim upstream shape confirmed`,
    });

    if (data.resultsSummary && typeof data.resultsSummary === "object") {
      const summary = data.resultsSummary as Record<string, unknown>;
      findings.push({
        type: "ok",
        sourceField: "data.resultsSummary",
        note: `data.resultsSummary present (totalResults=${summary.totalResults ?? "n/a"})`,
      });
    } else {
      findings.push({
        type: "gap",
        sourceField: "data.resultsSummary",
        note: `data.resultsSummary missing or wrong type — expected object from upstream`,
      });
    }

    const results = data.results as Array<Record<string, unknown>>;
    if (results.length > 0) {
      const first = results[0];
      const uid = first.uniqueId ?? first.elementGlobalId;
      if (uid) {
        findings.push({
          type: "ok",
          sourceField: "data.results[0].uniqueId",
          note: `uniqueId present: ${String(uid)}`,
        });
      } else {
        findings.push({
          type: "gap",
          sourceField: "data.results[0].uniqueId",
          note: `uniqueId field absent from first result — cannot chain to taxon endpoint`,
        });
      }
    } else {
      findings.push({
        type: "gap",
        sourceField: "data.results[0]",
        note: `No results for Lobelia cardinalis — upstream may have changed; taxon test will be skipped`,
      });
    }

    const provenance = (fernsRaw.provenance ?? {}) as Record<string, unknown>;
    if (provenance.cache_status) {
      findings.push({
        type: "ok",
        sourceField: "provenance.cache_status",
        note: `cache_status=${provenance.cache_status}`,
      });
    }

    return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsRaw, findings, urlsCollected };
  } catch (err) {
    return {
      source: SOURCE,
      endpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareSearch(fernsBase: string): Promise<EndpointComparison> {
  const endpoint = `/api/natureserve/search?q=wetland&recordType=ECOSYSTEM&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `NatureServe — search (wetland, ECOSYSTEM): data.results is array`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `${SOURCE}:search:wetland:ECOSYSTEM`);

    const data = fernsRaw.data as Record<string, unknown> | null | undefined;
    if (!data || typeof data !== "object") {
      findings.push({
        type: "mismatch",
        sourceField: "data",
        note: `data must be a non-null object; got ${data === null ? "null" : typeof data}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    if (!Array.isArray(data.results)) {
      findings.push({
        type: "mismatch",
        sourceField: "data.results",
        fernsField: "data.results",
        sourceValue: "Array",
        fernsValue: typeof data.results,
        note: `data.results must be an array (verbatim upstream shape); got ${typeof data.results}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    findings.push({
      type: "ok",
      sourceField: "data.results",
      note: `data.results is array with ${(data.results as unknown[]).length} item(s) — verbatim upstream shape confirmed`,
    });

    if (data.resultsSummary && typeof data.resultsSummary === "object") {
      const summary = data.resultsSummary as Record<string, unknown>;
      findings.push({
        type: "ok",
        sourceField: "data.resultsSummary",
        note: `data.resultsSummary present (totalResults=${summary.totalResults ?? "n/a"})`,
      });
    } else {
      findings.push({
        type: "gap",
        sourceField: "data.resultsSummary",
        note: `data.resultsSummary missing or wrong type — expected object from upstream`,
      });
    }

    const provenance = (fernsRaw.provenance ?? {}) as Record<string, unknown>;
    if (provenance.cache_status) {
      findings.push({
        type: "ok",
        sourceField: "provenance.cache_status",
        note: `cache_status=${provenance.cache_status}`,
      });
    }
    if (typeof fernsRaw.found === "boolean") {
      findings.push({
        type: "ok",
        sourceField: "found",
        note: `found=${fernsRaw.found}`,
      });
    }

    return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsRaw, findings, urlsCollected };
  } catch (err) {
    return {
      source: SOURCE,
      endpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareTaxon(
  fernsBase: string,
  uniqueId: string | null,
): Promise<EndpointComparison> {
  if (!uniqueId) {
    const endpoint = `/api/natureserve/taxon/(skipped)`;
    return {
      source: SOURCE,
      endpoint,
      label: `NatureServe — taxon: SKIPPED (no uniqueId obtained from speciesSearch)`,
      ok: false,
      error: "Could not obtain a uniqueId from speciesSearch results — taxon test skipped",
      findings: [
        {
          type: "gap",
          sourceField: "uniqueId",
          note: `No uniqueId available from speciesSearch results; taxon comparator requires a known stable uniqueId to proceed`,
        },
      ],
      urlsCollected: [],
    };
  }

  const endpoint = `/api/natureserve/taxon/${uniqueId}`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `NatureServe — taxon (${uniqueId}): data is object with scientificName`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `${SOURCE}:taxon:${uniqueId}`);

    const data = fernsRaw.data as Record<string, unknown> | null | undefined;
    if (!data || typeof data !== "object") {
      findings.push({
        type: "mismatch",
        sourceField: "data",
        note: `data must be a non-null object; got ${data === null ? "null" : typeof data}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    findings.push({
      type: "ok",
      sourceField: "data",
      note: `data is a non-null object — verbatim upstream taxon record`,
    });

    if (typeof data.scientificName === "string") {
      findings.push({
        type: "ok",
        sourceField: "data.scientificName",
        note: `data.scientificName="${data.scientificName}"`,
      });
    } else {
      findings.push({
        type: "mismatch",
        sourceField: "data.scientificName",
        fernsField: "data.scientificName",
        sourceValue: "string",
        fernsValue: typeof data.scientificName,
        note: `data.scientificName must be a string; got ${typeof data.scientificName}`,
      });
    }

    if (data.uniqueId || data.elementGlobalId) {
      findings.push({
        type: "ok",
        sourceField: "data.uniqueId",
        note: `uniqueId/elementGlobalId present: ${String(data.uniqueId ?? data.elementGlobalId)}`,
      });
    } else {
      findings.push({
        type: "gap",
        sourceField: "data.uniqueId",
        note: `uniqueId/elementGlobalId field absent from taxon record`,
      });
    }

    const provenance = (fernsRaw.provenance ?? {}) as Record<string, unknown>;
    if (provenance.cache_status) {
      findings.push({
        type: "ok",
        sourceField: "provenance.cache_status",
        note: `cache_status=${provenance.cache_status}`,
      });
    }

    const ok =
      data !== null &&
      typeof data === "object" &&
      typeof data.scientificName === "string";

    return { source: SOURCE, endpoint, label, ok, rawFerns: fernsRaw, findings, urlsCollected };
  } catch (err) {
    return {
      source: SOURCE,
      endpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
