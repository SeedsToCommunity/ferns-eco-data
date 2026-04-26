import { fetchJson, isAbsoluteUrl, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const SOURCE = "usda-plants";

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
  const label = `${sp.label} (${sp.name}) — USDA PLANTS species`;

  try {
    const fernsRaw = (await fetchJson(fernsUrl)) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `usda-plants:${sp.name}`);

    const found = Boolean(fernsRaw.found);

    if (!found) {
      findings.push({
        type: "gap",
        sourceField: "found",
        note: "USDA PLANTS has no record for this species (not necessarily an error — may not be in US flora)",
      });
      return { source: SOURCE, endpoint, label, ok: true, rawFerns: fernsData, findings, urlsCollected };
    }

    const symbol = fernsData.symbol as string | null | undefined;
    const canonicalName = fernsData.canonical_name as string | null | undefined;
    const profileUrl = fernsData.profile_url as string | null | undefined;
    const nativeStatuses = fernsData.native_statuses as Array<{ Region: string; Status: string }> | null | undefined;
    const cacheStatus = fernsData.cache_status as string | undefined;
    const provenance = fernsRaw.provenance as Record<string, unknown> | undefined;

    if (!symbol || typeof symbol !== "string" || symbol.trim() === "") {
      findings.push({
        type: "gap",
        sourceField: "symbol",
        note: "USDA PLANTS symbol is missing or empty",
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "symbol",
        note: `Symbol: ${symbol}`,
      });
    }

    if (!canonicalName) {
      findings.push({
        type: "gap",
        sourceField: "canonical_name",
        note: "canonical_name is null — taxonomy may be incomplete",
      });
    }

    if (!profileUrl) {
      findings.push({
        type: "gap",
        sourceField: "profile_url",
        note: "profile_url is null",
      });
    } else {
      if (!isAbsoluteUrl(profileUrl)) {
        findings.push({
          type: "mismatch",
          sourceField: "profile_url",
          fernsField: "profile_url",
          fernsValue: profileUrl,
          note: "profile_url is not absolute — passthrough URL rule violation",
        });
      } else if (!profileUrl.startsWith("https://plants.sc.egov.usda.gov/")) {
        findings.push({
          type: "mismatch",
          sourceField: "profile_url",
          fernsField: "profile_url",
          fernsValue: profileUrl,
          note: "profile_url does not point to expected USDA PLANTS domain",
        });
      } else {
        findings.push({
          type: "ok",
          sourceField: "profile_url",
          note: `Profile URL valid: ${profileUrl}`,
        });
      }
    }

    if (!nativeStatuses || nativeStatuses.length === 0) {
      findings.push({
        type: "gap",
        sourceField: "native_statuses",
        note: "native_statuses is empty — may be valid for non-US flora",
      });
    } else {
      const l48 = nativeStatuses.find((s) => s.Region === "L48");
      if (l48) {
        findings.push({
          type: "ok",
          sourceField: "native_statuses.L48",
          note: `L48 nativity: ${l48.Status === "N" ? "Native" : "Introduced"} (${l48.Status})`,
        });
      }
    }

    if (cacheStatus) {
      findings.push({
        type: "ok",
        sourceField: "cache_status",
        note: `Cache: ${cacheStatus}`,
      });
    }

    const upstreamUrl = provenance?.upstream_url as string | undefined;
    if (!upstreamUrl || !isAbsoluteUrl(upstreamUrl)) {
      findings.push({
        type: "gap",
        sourceField: "provenance.upstream_url",
        note: "provenance.upstream_url is missing or not absolute",
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
