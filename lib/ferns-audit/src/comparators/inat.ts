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

  const encoded = encodeURIComponent(sp.name.trim());
  const inatSearchUrl = `${INAT_API}/taxa?q=${encoded}&rank=species`;
  const label = `${sp.label} (${sp.name}) — species appearance`;

  try {
    const [inatSearchRaw, fernsRaw] = await Promise.all([
      fetchJson(inatSearchUrl),
      fetchJson(fernsUrl),
    ]);

    const inatSearch = inatSearchRaw as Record<string, unknown>;
    const inatResults = (inatSearch.results as Record<string, unknown>[] | undefined) ?? [];

    if (inatResults.length === 0) {
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

    const lowerName = sp.name.trim().toLowerCase();
    const exactMatch = inatResults.find(
      (r) => typeof r.name === "string" && r.name.toLowerCase() === lowerName && r.rank === "species",
    );
    const chosen = exactMatch ?? inatResults[0];
    const taxonId = chosen.id as number;

    const inatFullUrl = `${INAT_API}/taxa/${taxonId}`;
    const inatFullRaw = await fetchJson(inatFullUrl) as Record<string, unknown>;
    const inatFullResults = (inatFullRaw.results as Record<string, unknown>[] | undefined) ?? [];
    const inatTaxon = (inatFullResults[0] as Record<string, unknown> | undefined) ?? chosen;

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

  const placeParam = `&place_id=${place.id}`;
  const inatHistUrl = `${INAT_API}/observations/histogram?taxon_id=${taxonId}${placeParam}&interval=month_of_year`;
  const inatPfvUrl = `${INAT_API}/observations/popular_field_values?taxon_id=${taxonId}${placeParam}&verifiable=true`;
  const label = `${sp.label} in ${place.name} — phenology`;

  try {
    const [inatHistRaw, inatPfvRaw, fernsRaw] = await Promise.all([
      fetchJson(inatHistUrl),
      fetchJson(inatPfvUrl),
      fetchJson(fernsUrl),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const inatHist = inatHistRaw as Record<string, unknown>;
    const inatPfv = inatPfvRaw as Record<string, unknown>;

    const findings: EndpointComparison["findings"] = [];

    findings.push({
      type: "ok",
      sourceField: "(phenology)",
      note: "Phenology aggregates two iNat calls: histogram + popular_field_values. Diffing each full response against FERNS phenology data.",
    });

    const histFindings = diffObjects(inatHist as Record<string, unknown>, fernsData, "iNat histogram");
    for (const f of histFindings) {
      findings.push({ ...f, note: `[histogram] ${f.note ?? ""}` });
    }

    const pfvFindings = diffObjects(inatPfv as Record<string, unknown>, fernsData, "iNat field values");
    for (const f of pfvFindings) {
      const alreadyCovered = findings.some(
        (ex) => ex.sourceField === f.sourceField && ex.type === f.type,
      );
      if (!alreadyCovered) {
        findings.push({ ...f, note: `[popular_field_values] ${f.note ?? ""}` });
      }
    }

    const urlsCollected = collectUrls(fernsEnvelope, `inat/phenology:${sp.name}@${place.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}`,
      label,
      ok: true,
      rawSource: { histogram: inatHistRaw, pfv: inatPfvRaw } as unknown as Record<string, unknown>,
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
