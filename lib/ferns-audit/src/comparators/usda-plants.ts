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
    const speciesResult = await compareUsdaPlantsSpecies(fernsBase, sp);
    results.push(speciesResult);

    const fernsData = speciesResult.rawFerns as Record<string, unknown> | undefined;
    const symbol = fernsData?.symbol as string | null | undefined;
    if (symbol) {
      results.push(await compareUsdaPlantsProfile(fernsBase, sp.name, symbol));
    }
  }

  return results;
}

async function compareUsdaPlantsSpecies(
  fernsBase: string,
  sp: TestSpecies,
): Promise<EndpointComparison> {
  const fernsEndpointPath = `/api/usda-plants/PlantSearch`;
  const endpoint = `${fernsEndpointPath}?species=${encodeURIComponent(sp.name)}&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `${sp.label} (${sp.name}) — USDA PLANTS species name lookup parity`;

  try {
    const [fernsRaw, upstreamSearchResults] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      upstreamPlantSearch(sp.name),
    ]);

    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:PlantSearch:${sp.name}`);

    const fernsFound = Boolean(fernsRaw.found);
    const upstreamMatch = findExactMatch(sp.name, upstreamSearchResults);
    const upstreamFound = upstreamMatch !== null;

    if (fernsFound !== upstreamFound) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        fernsField: "found",
        sourceValue: upstreamFound,
        fernsValue: fernsFound,
        note: `found mismatch: upstream=${upstreamFound} FERNS=${fernsFound}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "found",
        note: `found parity: both ${fernsFound ? "found" : "not found"}`,
      });
    }

    if (!fernsFound && !upstreamFound) {
      findings.push({
        type: "ok",
        sourceField: "(usda-plants)",
        note: "Both FERNS and upstream agree: species not in USDA PLANTS database",
      });
      return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsData, findings, urlsCollected };
    }

    if (!upstreamFound) {
      return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsData, findings, urlsCollected };
    }

    const upstreamPlant = upstreamMatch!.Plant;
    const upstreamSymbol = (upstreamPlant["Symbol"] as string) ?? null;
    const upstreamSciName = upstreamPlant["ScientificName"]
      ? stripHtml(upstreamPlant["ScientificName"] as string)
      : null;
    const upstreamCommonName = (upstreamPlant["CommonName"] as string) ?? null;
    const upstreamRank = (upstreamPlant["Rank"] as string) ?? null;

    const fernsSymbol = fernsData.symbol as string | null;
    const fernsCanonicalName = fernsData.canonical_name as string | null;
    const fernsCommonName = fernsData.common_name as string | null;
    const fernsRank = fernsData.rank as string | null;

    if (fernsSymbol !== upstreamSymbol) {
      findings.push({
        type: "mismatch",
        sourceField: "Symbol",
        fernsField: "symbol",
        sourceValue: upstreamSymbol,
        fernsValue: fernsSymbol,
        note: `symbol mismatch: upstream=${upstreamSymbol} FERNS=${fernsSymbol}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "Symbol",
        note: `symbol parity: ${fernsSymbol}`,
      });
    }

    if (upstreamSciName && fernsCanonicalName) {
      if (upstreamSciName.toLowerCase() !== fernsCanonicalName.toLowerCase()) {
        findings.push({
          type: "mismatch",
          sourceField: "ScientificName (stripped)",
          fernsField: "canonical_name",
          sourceValue: upstreamSciName,
          fernsValue: fernsCanonicalName,
          note: `canonical_name mismatch: upstream="${upstreamSciName}" FERNS="${fernsCanonicalName}"`,
        });
      } else {
        findings.push({
          type: "ok",
          sourceField: "ScientificName (stripped)",
          note: `canonical_name parity: "${fernsCanonicalName}"`,
        });
      }
    }

    if (upstreamCommonName && fernsCommonName && upstreamCommonName !== fernsCommonName) {
      findings.push({
        type: "mismatch",
        sourceField: "CommonName",
        fernsField: "common_name",
        sourceValue: upstreamCommonName,
        fernsValue: fernsCommonName,
        note: `common_name mismatch: upstream="${upstreamCommonName}" FERNS="${fernsCommonName}"`,
      });
    } else if (fernsCommonName) {
      findings.push({
        type: "ok",
        sourceField: "CommonName",
        note: `common_name: "${fernsCommonName}"`,
      });
    }

    if (upstreamRank && fernsRank && upstreamRank !== fernsRank) {
      findings.push({
        type: "mismatch",
        sourceField: "Rank",
        fernsField: "rank",
        sourceValue: upstreamRank,
        fernsValue: fernsRank,
        note: `rank mismatch: upstream="${upstreamRank}" FERNS="${fernsRank}"`,
      });
    } else if (fernsRank) {
      findings.push({
        type: "ok",
        sourceField: "Rank",
        note: `rank: "${fernsRank}"`,
      });
    }

    // profile_url removed from data in envelope migration (plan 07). Client constructs
    // from website_url_patterns. No profile_url check needed.
    findings.push({
      type: "ok",
      sourceField: "profile_url",
      note: "profile_url removed from data per envelope migration (plan 07); client constructs from website_url_patterns",
    });

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
    const fernsProfile = (fernsData.profile ?? {}) as Record<string, unknown>;
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
    const fernsId = fernsProfile["Id"] as number | null;
    if (upstreamId !== fernsId) {
      findings.push({
        type: "mismatch",
        sourceField: "Id",
        fernsField: "profile.Id",
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
    const fernsSymbolField = (fernsProfile["Symbol"] as string) ?? null;
    if (upstreamSymbolField && fernsSymbolField && upstreamSymbolField !== fernsSymbolField) {
      findings.push({
        type: "mismatch",
        sourceField: "Symbol",
        fernsField: "profile.Symbol",
        sourceValue: upstreamSymbolField,
        fernsValue: fernsSymbolField,
        note: `profile symbol mismatch: upstream=${upstreamSymbolField} FERNS=${fernsSymbolField}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "profile.Symbol",
        note: `profile symbol parity: ${fernsSymbolField ?? symbol}`,
      });
    }

    const upstreamNativeStatuses = (upstreamProfile["NativeStatuses"] as Array<{ Region: string; Status: string }>) ?? [];
    const fernsNativeStatuses = (fernsProfile["NativeStatuses"] as Array<{ Region: string; Status: string }>) ?? [];

    if (upstreamNativeStatuses.length !== fernsNativeStatuses.length) {
      findings.push({
        type: "mismatch",
        sourceField: "NativeStatuses.length",
        fernsField: "profile.NativeStatuses.length",
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
            fernsField: "profile.NativeStatuses[L48].Status",
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
    const fernsFactSheets = (fernsProfile["FactSheetUrls"] as string[]) ?? [];
    if (upstreamFactSheets.length !== fernsFactSheets.length) {
      findings.push({
        type: "mismatch",
        sourceField: "FactSheetUrls.length",
        fernsField: "profile.FactSheetUrls.length",
        sourceValue: upstreamFactSheets.length,
        fernsValue: fernsFactSheets.length,
        note: `fact_sheet_urls count mismatch: upstream=${upstreamFactSheets.length} FERNS=${fernsFactSheets.length}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "FactSheetUrls",
        note: `FactSheetUrls parity: ${fernsFactSheets.length} entries`,
      });
    }

    // cache_status moved to provenance.cache_status in envelope migration (plan 07)
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
