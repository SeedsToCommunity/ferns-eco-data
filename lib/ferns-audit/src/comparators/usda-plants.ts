import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const SOURCE = "usda-plants";
const USDA_API_BASE = "https://plantsservices.sc.egov.usda.gov/api";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function extractNameWithoutAuthor(strippedSciName: string, wordCount: number): string {
  return strippedSciName.split(/\s+/).slice(0, wordCount).join(" ");
}

interface UsdaPlantSearchItem {
  Text: string;
  Plant: Record<string, unknown>;
}

async function upstreamPlantSearch(name: string): Promise<UsdaPlantSearchItem[]> {
  const url = `${USDA_API_BASE}/PlantSearch?searchText=${encodeURIComponent(name)}`;
  const raw = (await fetchJson(url)) as unknown;
  if (!Array.isArray(raw)) return [];
  return raw as UsdaPlantSearchItem[];
}

async function upstreamPlantProfile(symbol: string): Promise<Record<string, unknown>> {
  const url = `${USDA_API_BASE}/PlantProfile?symbol=${encodeURIComponent(symbol)}`;
  const raw = await fetchJson(url);
  return (raw ?? {}) as Record<string, unknown>;
}

function findExactMatch(name: string, results: UsdaPlantSearchItem[]): UsdaPlantSearchItem | null {
  const nameLower = name.toLowerCase();
  const wordCount = name.split(/\s+/).length;
  return (
    results.find((item) => {
      const sciName = item.Plant["ScientificName"] as string | null;
      if (!sciName) return false;
      const nameWithoutAuthor = extractNameWithoutAuthor(stripHtml(sciName), wordCount);
      return nameWithoutAuthor.toLowerCase() === nameLower;
    }) ?? null
  );
}

export async function runUsdaPlantsComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    const upstreamSearchResults = await upstreamPlantSearch(sp.name);
    const upstreamMatch = findExactMatch(sp.name, upstreamSearchResults);

    results.push(await comparePlantSearchAutocomplete(fernsBase, sp, upstreamSearchResults));

    const symbol = (upstreamMatch?.Plant["Symbol"] as string | null) ?? null;
    if (symbol) {
      results.push(await compareUsdaPlantsProfile(fernsBase, sp.name, symbol));
    }

    results.push(await comparePlantsSearchResults(fernsBase, sp));
  }

  return results;
}

async function comparePlantSearchAutocomplete(
  fernsBase: string,
  sp: TestSpecies,
  upstreamSearchResults: UsdaPlantSearchItem[],
): Promise<EndpointComparison> {
  const fernsEndpointPath = `/api/usda-plants/PlantSearch`;
  const endpoint = `${fernsEndpointPath}?searchText=${encodeURIComponent(sp.name)}&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `${sp.label} (${sp.name}) — USDA PLANTS /PlantSearch autocomplete parity`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:PlantSearch:${sp.name}`);

    if (!Array.isArray(fernsRaw.data)) {
      findings.push({
        type: "mismatch",
        sourceField: "data",
        fernsField: "data",
        sourceValue: "Array",
        fernsValue: typeof fernsRaw.data,
        note: `data must be a verbatim upstream array; got ${typeof fernsRaw.data}`,
      });
      return { source: SOURCE, endpoint, label, ok: false, rawFerns: fernsRaw, findings, urlsCollected };
    }

    findings.push({
      type: "ok",
      sourceField: "data",
      note: `data is array with ${(fernsRaw.data as unknown[]).length} item(s) — verbatim upstream shape`,
    });

    const fernsItems = fernsRaw.data as UsdaPlantSearchItem[];
    if (fernsItems.length > 0) {
      const first = fernsItems[0];
      const hasText = "Text" in first;
      const hasPlant = "Plant" in first;
      if (!hasText || !hasPlant) {
        findings.push({
          type: "mismatch",
          sourceField: "data[0]",
          fernsField: "data[0]",
          sourceValue: "{ Text, Plant }",
          fernsValue: JSON.stringify(Object.keys(first)),
          note: `first element missing expected keys — hasText=${hasText} hasPlant=${hasPlant}`,
        });
      } else {
        findings.push({
          type: "ok",
          sourceField: "data[0]",
          note: `first element has Text and Plant keys — verbatim upstream shape confirmed`,
        });
      }
    }

    const upstreamCount = upstreamSearchResults.length;
    const fernsCount = fernsItems.length;
    if (upstreamCount !== fernsCount) {
      findings.push({
        type: "mismatch",
        sourceField: "data.length",
        fernsField: "data.length",
        sourceValue: upstreamCount,
        fernsValue: fernsCount,
        note: `result count mismatch: upstream=${upstreamCount} FERNS=${fernsCount}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "data.length",
        note: `result count parity: ${fernsCount}`,
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

async function compareUsdaPlantsProfile(
  fernsBase: string,
  speciesName: string,
  symbol: string,
): Promise<EndpointComparison> {
  const fernsEndpointPath = `/api/usda-plants/PlantProfile`;
  const endpoint = `${fernsEndpointPath}?symbol=${encodeURIComponent(symbol)}&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `${speciesName} (${symbol}) — USDA PLANTS /PlantProfile endpoint parity`;

  try {
    const [fernsRaw, upstreamProfile] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      upstreamPlantProfile(symbol),
    ]);

    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:PlantProfile:${symbol}`);

    const fernsFound = Boolean(fernsRaw.found);
    const upstreamHasData = typeof upstreamProfile["Id"] === "number";

    if (fernsFound !== upstreamHasData) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        fernsField: "found",
        sourceValue: upstreamHasData,
        fernsValue: fernsFound,
        note: `profile found mismatch: upstream hasData=${upstreamHasData} FERNS found=${fernsFound}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "found",
        note: `found parity: ${fernsFound}`,
      });
    }

    if (!fernsFound && !upstreamHasData) {
      return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsData, findings, urlsCollected };
    }

    const upstreamId = upstreamProfile["Id"] as number | null;
    const fernsId = fernsData["Id"] as number | null;
    if (upstreamId !== fernsId) {
      findings.push({
        type: "mismatch",
        sourceField: "Id",
        fernsField: "data.Id",
        sourceValue: upstreamId,
        fernsValue: fernsId,
        note: `profile Id mismatch: upstream=${upstreamId} FERNS=${fernsId}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "Id",
        note: `profile Id parity: ${fernsId}`,
      });
    }

    const upstreamSymbolField = (upstreamProfile["Symbol"] as string) ?? null;
    const fernsSymbolField = (fernsData["Symbol"] as string) ?? null;
    if (fernsSymbolField !== symbol.toUpperCase()) {
      findings.push({
        type: "mismatch",
        sourceField: "Symbol",
        fernsField: "data.Symbol",
        sourceValue: symbol.toUpperCase(),
        fernsValue: fernsSymbolField,
        note: `data.Symbol must equal symbol.toUpperCase(): expected=${symbol.toUpperCase()} FERNS=${fernsSymbolField}`,
      });
    } else if (upstreamSymbolField && fernsSymbolField && upstreamSymbolField !== fernsSymbolField) {
      findings.push({
        type: "mismatch",
        sourceField: "Symbol",
        fernsField: "data.Symbol",
        sourceValue: upstreamSymbolField,
        fernsValue: fernsSymbolField,
        note: `profile symbol mismatch: upstream=${upstreamSymbolField} FERNS=${fernsSymbolField}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "data.Symbol",
        note: `profile symbol parity: ${fernsSymbolField ?? symbol}`,
      });
    }

    const upstreamNativeStatuses = (upstreamProfile["NativeStatuses"] as Array<{ Region: string; Status: string }>) ?? [];
    const fernsNativeStatuses = (fernsData["NativeStatuses"] as Array<{ Region: string; Status: string }>) ?? [];

    if (upstreamNativeStatuses.length !== fernsNativeStatuses.length) {
      findings.push({
        type: "mismatch",
        sourceField: "NativeStatuses.length",
        fernsField: "data.NativeStatuses.length",
        sourceValue: upstreamNativeStatuses.length,
        fernsValue: fernsNativeStatuses.length,
        note: `NativeStatuses count mismatch: upstream=${upstreamNativeStatuses.length} FERNS=${fernsNativeStatuses.length}`,
      });
    } else {
      const upstreamL48 = upstreamNativeStatuses.find((s) => s.Region === "L48");
      const fernsL48 = fernsNativeStatuses.find((s) => s.Region === "L48");
      if (upstreamL48 && fernsL48) {
        if (upstreamL48.Status !== fernsL48.Status) {
          findings.push({
            type: "mismatch",
            sourceField: "NativeStatuses[L48].Status",
            fernsField: "data.NativeStatuses[L48].Status",
            sourceValue: upstreamL48.Status,
            fernsValue: fernsL48.Status,
            note: `L48 nativity mismatch: upstream=${upstreamL48.Status} FERNS=${fernsL48.Status}`,
          });
        } else {
          findings.push({
            type: "ok",
            sourceField: "NativeStatuses[L48]",
            note: `L48 nativity parity: ${fernsL48.Status === "N" ? "Native" : "Introduced"} (${fernsL48.Status})`,
          });
        }
      }
    }

    const upstreamFactSheets = (upstreamProfile["FactSheetUrls"] as string[]) ?? [];
    const fernsFactSheets = (fernsData["FactSheetUrls"] as string[]) ?? [];
    if (upstreamFactSheets.length !== fernsFactSheets.length) {
      findings.push({
        type: "mismatch",
        sourceField: "FactSheetUrls.length",
        fernsField: "data.FactSheetUrls.length",
        sourceValue: upstreamFactSheets.length,
        fernsValue: fernsFactSheets.length,
        note: `FactSheetUrls count mismatch: upstream=${upstreamFactSheets.length} FERNS=${fernsFactSheets.length}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "FactSheetUrls",
        note: `FactSheetUrls parity: ${fernsFactSheets.length} entries`,
      });
    }

    const provenance = (fernsRaw.provenance ?? {}) as Record<string, unknown>;
    const envelopeCacheStatus = provenance["cache_status"] as string | undefined;
    if (envelopeCacheStatus) {
      findings.push({
        type: "ok",
        sourceField: "cache_status",
        note: `Cache: ${envelopeCacheStatus} (from provenance)`,
      });
    }

    return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsData, findings, urlsCollected };
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

async function comparePlantsSearchResults(
  fernsBase: string,
  sp: TestSpecies,
): Promise<EndpointComparison> {
  const text = sp.name;
  const field = "Scientific Name";
  const fernsEndpointPath = `/api/usda-plants/plants-search-results`;
  const endpoint = `${fernsEndpointPath}?Text=${encodeURIComponent(text)}&Field=${encodeURIComponent(field)}&pageNumber=1`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `${sp.label} (${sp.name}) — USDA PLANTS /plants-search-results parity`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:plants-search-results:${sp.name}`);

    if (!Array.isArray(fernsData["PlantResults"])) {
      findings.push({
        type: "mismatch",
        sourceField: "PlantResults",
        fernsField: "data.PlantResults",
        sourceValue: "Array",
        fernsValue: typeof fernsData["PlantResults"],
        note: `data.PlantResults must be a verbatim upstream array; got ${typeof fernsData["PlantResults"]}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "PlantResults",
        note: `data.PlantResults is array with ${(fernsData["PlantResults"] as unknown[]).length} item(s)`,
      });
    }

    if (typeof fernsData["TotalResults"] !== "number") {
      findings.push({
        type: "mismatch",
        sourceField: "TotalResults",
        fernsField: "data.TotalResults",
        sourceValue: "number",
        fernsValue: typeof fernsData["TotalResults"],
        note: `data.TotalResults must be a number; got ${typeof fernsData["TotalResults"]}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "TotalResults",
        note: `data.TotalResults = ${fernsData["TotalResults"]}`,
      });
    }

    const ok =
      Array.isArray(fernsData["PlantResults"]) &&
      typeof fernsData["TotalResults"] === "number";

    return { source: SOURCE, endpoint, label, ok, rawFerns: fernsData, findings, urlsCollected };
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
