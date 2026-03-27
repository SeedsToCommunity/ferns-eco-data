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
    const speciesResult = await compareInatSpecies(fernsBase, sp);
    results.push(speciesResult);

    const inatTaxonId = speciesResult.rawSource
      ? (speciesResult.rawSource["id"] as number | undefined)
      : undefined;

    if (inatTaxonId) {
      for (const place of places) {
        results.push(await compareInatPhenology(fernsBase, sp, inatTaxonId, place));
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
    const inatTaxon = (inatFullResults[0] as Record<string, unknown> | undefined) ?? topResult;

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
      note: "Phenology is a multi-call aggregate endpoint. Field-level diff runs against each upstream iNat source call individually.",
    });

    const histSource: Record<string, unknown> = {
      results: inatHist.results,
      total_results: inatHist.total_results,
    };
    const histFindings = diffObjects(histSource, fernsData, "iNat histogram");
    for (const f of histFindings) {
      findings.push({ ...f, note: `[histogram vs phenology] ${f.note ?? ""}` });
    }

    const fieldValuesSource: Record<string, unknown> = {
      results: inatStages.results,
      total_results: inatStages.total_results,
    };
    const fieldValuesFindings = diffObjects(fieldValuesSource, fernsData, "iNat field values");
    for (const f of fieldValuesFindings) {
      const alreadyCovered = findings.some(
        (existing) => existing.sourceField === f.sourceField && existing.type === f.type,
      );
      if (!alreadyCovered) {
        findings.push({ ...f, note: `[field_values vs phenology] ${f.note ?? ""}` });
      }
    }

    const urlsCollected = collectUrls(fernsEnvelope, `inat/phenology:${sp.name}@${place.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}`,
      label,
      ok: true,
      rawSource: { histogram: inatHistRaw, stages: inatStagesRaw } as unknown as Record<string, unknown>,
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
