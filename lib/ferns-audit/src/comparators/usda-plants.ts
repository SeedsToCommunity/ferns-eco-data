import { fetchJson, isAbsoluteUrl, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const SOURCE = "usda-plants";
const USDA_API_BASE = "https://plantsservices.sc.egov.usda.gov/api";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
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

function findMatchInSearchResults(name: string, results: UsdaPlantSearchItem[]): UsdaPlantSearchItem | null {
  const nameLower = name.toLowerCase();
  return (
    results.find((item) => {
      const sciName = item.Plant["ScientificName"] as string | null;
      if (!sciName) return false;
      const stripped = stripHtml(sciName).toLowerCase();
      return (
        stripped === nameLower ||
        stripped.startsWith(nameLower + " ") ||
        stripped.startsWith(nameLower + ",")
      );
    }) ?? null
  );
}

export async function runUsdaPlantsComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    results.push(await compareUsdaPlantsSpecies(fernsBase, sp));
  }

  return results;
}

async function compareUsdaPlantsSpecies(
  fernsBase: string,
  sp: TestSpecies,
): Promise<EndpointComparison> {
  const fernsEndpointPath = `/api/usda-plants`;
  const endpoint = `${fernsEndpointPath}?species=${encodeURIComponent(sp.name)}&refresh=true`;
  const fernsUrl = `${fernsBase}${endpoint}`;
  const label = `${sp.label} (${sp.name}) — USDA PLANTS species (name lookup + profile parity)`;

  try {
    const [fernsRaw, upstreamSearchResults] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      upstreamPlantSearch(sp.name),
    ]);

    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:${sp.name}`);

    const fernsFound = Boolean(fernsRaw.found);
    const upstreamMatch = findMatchInSearchResults(sp.name, upstreamSearchResults);
    const upstreamFound = upstreamMatch !== null;

    if (fernsFound !== upstreamFound) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        fernsField: "found",
        sourceValue: upstreamFound,
        fernsValue: fernsFound,
        note: `found mismatch: upstream returned ${upstreamFound ? "a match" : "no match"} but FERNS returned found=${fernsFound}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "found",
        note: `found parity: both ${fernsFound ? "found" : "not found"}`,
      });
    }

    if (!fernsFound || !upstreamFound) {
      if (!fernsFound && !upstreamFound) {
        findings.push({
          type: "ok",
          sourceField: "(usda-plants)",
          note: "Both FERNS and upstream agree: species not in USDA PLANTS database",
        });
      }
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
    const fernsProfileUrl = fernsData.profile_url as string | null;

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
          sourceField: "ScientificName",
          fernsField: "canonical_name",
          sourceValue: upstreamSciName,
          fernsValue: fernsCanonicalName,
          note: `canonical_name mismatch: upstream="${upstreamSciName}" FERNS="${fernsCanonicalName}"`,
        });
      } else {
        findings.push({
          type: "ok",
          sourceField: "ScientificName",
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
    }

    if (fernsProfileUrl) {
      if (!isAbsoluteUrl(fernsProfileUrl)) {
        findings.push({
          type: "mismatch",
          sourceField: "profile_url",
          fernsField: "profile_url",
          fernsValue: fernsProfileUrl,
          note: "profile_url is not absolute — passthrough URL rule violation",
        });
      } else if (!fernsProfileUrl.startsWith("https://plants.sc.egov.usda.gov/")) {
        findings.push({
          type: "mismatch",
          sourceField: "profile_url",
          fernsField: "profile_url",
          fernsValue: fernsProfileUrl,
          note: "profile_url does not point to expected USDA PLANTS domain",
        });
      } else {
        const expectedUrl = `https://plants.sc.egov.usda.gov/?symbol=${encodeURIComponent(fernsSymbol ?? "")}`;
        if (fernsProfileUrl !== expectedUrl) {
          findings.push({
            type: "mismatch",
            sourceField: "profile_url",
            fernsField: "profile_url",
            sourceValue: expectedUrl,
            fernsValue: fernsProfileUrl,
            note: `profile_url encoding differs from expected canonical form`,
          });
        } else {
          findings.push({
            type: "ok",
            sourceField: "profile_url",
            note: `profile_url valid: ${fernsProfileUrl}`,
          });
        }
      }
    } else {
      findings.push({
        type: "gap",
        sourceField: "profile_url",
        note: "profile_url is null",
      });
    }

    if (upstreamSymbol) {
      try {
        const upstreamProfile = await upstreamPlantProfile(upstreamSymbol);
        const fernsNativeStatuses = fernsData.native_statuses as Array<{ Region: string; Status: string }> | null;
        const upstreamNativeStatuses = (upstreamProfile["NativeStatuses"] as Array<{ Region: string; Status: string }>) ?? [];

        const upstreamL48 = upstreamNativeStatuses.find((s) => s.Region === "L48");
        const fernsL48 = fernsNativeStatuses?.find((s) => s.Region === "L48");

        if (upstreamL48 && fernsL48) {
          if (upstreamL48.Status !== fernsL48.Status) {
            findings.push({
              type: "mismatch",
              sourceField: "NativeStatuses[L48].Status",
              fernsField: "native_statuses[L48].Status",
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
        } else if (!fernsNativeStatuses || fernsNativeStatuses.length === 0) {
          if (upstreamNativeStatuses.length > 0) {
            findings.push({
              type: "mismatch",
              sourceField: "NativeStatuses",
              fernsField: "native_statuses",
              sourceValue: upstreamNativeStatuses.length,
              fernsValue: 0,
              note: `native_statuses empty in FERNS but upstream has ${upstreamNativeStatuses.length} entries`,
            });
          } else {
            findings.push({
              type: "ok",
              sourceField: "NativeStatuses",
              note: "native_statuses empty in both upstream and FERNS",
            });
          }
        }

        const upstreamFactSheets = (upstreamProfile["FactSheetUrls"] as string[]) ?? [];
        const fernsFactSheets = (fernsData.fact_sheet_urls as string[]) ?? [];
        if (upstreamFactSheets.length !== fernsFactSheets.length) {
          findings.push({
            type: "mismatch",
            sourceField: "FactSheetUrls.length",
            fernsField: "fact_sheet_urls.length",
            sourceValue: upstreamFactSheets.length,
            fernsValue: fernsFactSheets.length,
            note: `fact_sheet_urls count mismatch: upstream=${upstreamFactSheets.length} FERNS=${fernsFactSheets.length}`,
          });
        } else {
          findings.push({
            type: "ok",
            sourceField: "FactSheetUrls",
            note: `fact_sheet_urls parity: ${fernsFactSheets.length} entries`,
          });
        }
      } catch (profileErr) {
        findings.push({
          type: "gap",
          sourceField: "(upstream profile)",
          note: `Direct upstream profile fetch failed: ${String(profileErr)}`,
        });
      }
    }

    const cacheStatus = fernsData.cache_status as string | undefined;
    if (cacheStatus) {
      findings.push({
        type: "ok",
        sourceField: "cache_status",
        note: `Cache: ${cacheStatus}`,
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
