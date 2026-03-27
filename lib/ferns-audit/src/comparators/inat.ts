import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies, TestPlace } from "../corpus.js";

const INAT_API = "https://api.inaturalist.org/v1";

export async function runInatComparators(
  fernsBase: string,
  species: TestSpecies[],
  places: TestPlace[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    results.push(await compareInatSpecies(fernsBase, sp));
  }

  for (const sp of species) {
    const fernsSpeciesUrl = `${fernsBase}/api/inat/species?name=${encodeURIComponent(sp.name)}`;
    let taxonId: number | null = null;
    try {
      const resp = await fetchJson(fernsSpeciesUrl) as Record<string, unknown>;
      const data = resp.data as Record<string, unknown> | undefined;
      if (data?.inat_taxon_id) taxonId = data.inat_taxon_id as number;
    } catch {
    }

    if (taxonId) {
      for (const place of places) {
        results.push(await compareInatPhenology(fernsBase, sp, taxonId, place));
      }
    }
  }

  return results;
}

async function compareInatSpecies(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/species`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const inatSearchUrl = `${INAT_API}/taxa?q=${encodeURIComponent(sp.name)}&rank=species&per_page=1`;
  const label = `${sp.label} (${sp.name}) — species appearance`;

  try {
    const [inatSearchRaw, fernsRaw] = await Promise.all([
      fetchJson(inatSearchUrl),
      fetchJson(fernsUrl),
    ]);

    const inatSearch = inatSearchRaw as Record<string, unknown>;
    const inatResults = (inatSearch.results as Record<string, unknown>[] | undefined) ?? [];
    const topResult = inatResults[0] as Record<string, unknown> | undefined;

    if (!topResult) {
      return {
        source: "inat",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
        label,
        ok: true,
        error: "iNat returned no results for this species — cannot diff",
        findings: [],
        urlsCollected: [],
      };
    }

    const taxonId = topResult.id as number;
    const inatFullUrl = `${INAT_API}/taxa/${taxonId}`;
    const inatFullRaw = await fetchJson(inatFullUrl) as Record<string, unknown>;
    const inatFullResults = (inatFullRaw.results as Record<string, unknown>[] | undefined) ?? [];
    const inatTaxon = inatFullResults[0] as Record<string, unknown> | undefined ?? topResult;

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;

    const findings = diffObjects(inatTaxon, fernsData, "iNaturalist");
    const urlsCollected = collectUrls(fernsEnvelope, `inat/species:${sp.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: inatTaxon,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareInatPhenology(
  fernsBase: string,
  sp: TestSpecies,
  taxonId: number,
  place: TestPlace,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/phenology`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}&refresh=true`;
  const inatHistUrl = `${INAT_API}/observations/histogram?taxon_id=${taxonId}&place_id=${place.id}&interval=month_of_year&verifiable=true`;
  const inatStagesUrl = `${INAT_API}/observations/popular_field_values?taxon_id=${taxonId}&place_id=${place.id}&verifiable=true`;
  const label = `${sp.label} in ${place.name} — phenology`;

  try {
    const [inatHistRaw, inatStagesRaw, fernsRaw] = await Promise.all([
      fetchJson(inatHistUrl),
      fetchJson(inatStagesUrl),
      fetchJson(fernsUrl),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;

    const inatHist = inatHistRaw as Record<string, unknown>;
    const inatStages = inatStagesRaw as Record<string, unknown>;

    const findings: EndpointComparison["findings"] = [];

    findings.push({
      type: "ok",
      sourceField: "(phenology)",
      note: "Phenology is a multi-call aggregate endpoint — structural comparison only (not field-level diff)",
    });

    const fernsObsByMonth = fernsData.observations_by_month as Record<string, number> | undefined;
    const inatHistResults = inatHist.results as Record<string, number> | undefined;

    if (fernsObsByMonth && inatHistResults) {
      const fernsTotal = Object.values(fernsObsByMonth).reduce((a, b) => a + b, 0);
      const inatTotal = Object.values(inatHistResults).reduce((a, b) => a + b, 0);
      if (fernsTotal !== inatTotal) {
        findings.push({
          type: "mismatch",
          sourceField: "histogram_total",
          fernsField: "observations_by_month (sum)",
          sourceValue: inatTotal,
          fernsValue: fernsTotal,
          note: "Total observation count differs between iNat histogram and FERNS phenology. Acceptable if cache is slightly stale.",
        });
      } else {
        findings.push({
          type: "ok",
          sourceField: "histogram_total",
          note: `Observation totals match: ${fernsTotal} observations`,
        });
      }
    }

    const inatFieldCount = (inatStages.results as unknown[] | undefined)?.length ?? 0;
    const fernsAnnotationsAvailable = fernsData.annotations_available as boolean | undefined;
    findings.push({
      type: "ok",
      sourceField: "annotations",
      note: `iNat returned ${inatFieldCount} field value entries. FERNS annotations_available=${fernsAnnotationsAvailable}`,
    });

    const urlsCollected = collectUrls(fernsEnvelope, `inat/phenology:${sp.name}@${place.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}`,
      label,
      ok: true,
      rawSource: { histogram: inatHistRaw, stages: inatStagesRaw },
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
