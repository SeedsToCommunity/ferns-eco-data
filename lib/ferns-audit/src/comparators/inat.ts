import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies, TestPlace, TestPlaceQuery } from "../corpus.js";

const INAT_API = "https://api.inaturalist.org/v1";

export async function runInatComparators(
  fernsBase: string,
  species: TestSpecies[],
  places: TestPlace[],
  placeQueries: TestPlaceQuery[] = [],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const pq of placeQueries) {
    results.push(await compareInatPlace(fernsBase, pq));
  }

  for (const sp of species) {
    const speciesResult = await compareInatSpecies(fernsBase, sp);
    results.push(speciesResult);

    const inatTaxonId = speciesResult.rawSource
      ? (speciesResult.rawSource["id"] as number | undefined)
      : undefined;

    if (inatTaxonId) {
      for (const place of places) {
        results.push(await compareInatHistogram(fernsBase, sp, inatTaxonId, place));
        results.push(await compareInatFieldValues(fernsBase, sp, inatTaxonId, place));
      }
      results.push(await checkInatObservations(fernsBase, sp, inatTaxonId, places[0] ?? null));
    }
  }

  return results;
}

async function compareInatPlace(
  fernsBase: string,
  pq: TestPlaceQuery,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/place`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?q=${encodeURIComponent(pq.q)}&refresh=true`;
  const inatUrl = `${INAT_API}/places/autocomplete?q=${encodeURIComponent(pq.q)}`;
  const label = `${pq.label} — iNat place search`;

  try {
    const [fernsRaw, inatRaw] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(inatUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const fernsResults = (fernsData.results ?? []) as Array<Record<string, unknown>>;
    const inatResults = (inatRaw.results ?? []) as Array<Record<string, unknown>>;
    const urlsCollected = collectUrls(fernsEnvelope, `inat/place:${pq.q}`);

    const findings: FieldFinding[] = [];

    if (fernsResults.length === 0 && inatResults.length === 0) {
      findings.push({ type: "ok", sourceField: "results", note: "Both FERNS and upstream returned no results" });
    } else if (fernsResults.length === 0 && inatResults.length > 0) {
      findings.push({ type: "gap", sourceField: "results", note: `Upstream returned ${inatResults.length} results but FERNS returned none` });
    } else if (inatResults.length === 0 && fernsResults.length > 0) {
      findings.push({ type: "addition", sourceField: "results", note: `FERNS returned ${fernsResults.length} results but upstream returned none — possible stale cache` });
    } else {
      findings.push({ type: "ok", sourceField: "results", note: `FERNS: ${fernsResults.length} results, upstream: ${inatResults.length} results` });

      const firstFerns = fernsResults[0];
      const firstInat = inatResults[0];
      if (firstFerns && firstInat) {
        for (const field of ["id", "display_name", "place_type", "place_type_name"] as const) {
          if (String(firstFerns[field] ?? "") === String(firstInat[field] ?? "")) {
            findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: firstFerns[field], note: `First result ${field} matches` });
          } else {
            findings.push({ type: "mismatch", sourceField: field, fernsField: field, sourceValue: firstInat[field], fernsValue: firstFerns[field] });
          }
        }
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(pq.q)}`,
      label,
      ok: true,
      rawSource: inatRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(pq.q)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
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

async function compareInatHistogram(
  fernsBase: string,
  sp: TestSpecies,
  taxonId: number,
  place: TestPlace,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/histogram`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}&refresh=true`;
  const inatUrl = `${INAT_API}/observations/histogram?taxon_id=${taxonId}&place_id=${place.id}&interval=month_of_year`;
  const label = `${sp.label} in ${place.name} — histogram (passthrough)`;

  try {
    const [inatRaw, fernsRaw] = await Promise.all([
      fetchJson(inatUrl),
      fetchJson(fernsUrl),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const inatResponse = inatRaw as Record<string, unknown>;

    const findings = diffObjects(inatResponse, fernsData, "iNat histogram");
    const urlsCollected = collectUrls(fernsEnvelope, `inat/histogram:${sp.name}@${place.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}`,
      label,
      ok: true,
      rawSource: inatResponse,
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

async function compareInatFieldValues(
  fernsBase: string,
  sp: TestSpecies,
  taxonId: number,
  place: TestPlace,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/field-values`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}&verifiable=true&refresh=true`;
  const inatUrl = `${INAT_API}/observations/popular_field_values?taxon_id=${taxonId}&place_id=${place.id}&verifiable=true`;
  const label = `${sp.label} in ${place.name} — field-values (passthrough)`;

  try {
    const [inatRaw, fernsRaw] = await Promise.all([
      fetchJson(inatUrl),
      fetchJson(fernsUrl),
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const inatResponse = inatRaw as Record<string, unknown>;

    const findings = diffObjects(inatResponse, fernsData, "iNat field values");
    const urlsCollected = collectUrls(fernsEnvelope, `inat/field-values:${sp.name}@${place.name}`);

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}&verifiable=true`,
      label,
      ok: true,
      rawSource: inatResponse,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}&place_id=${place.id}&verifiable=true`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatObservations(
  fernsBase: string,
  sp: TestSpecies,
  taxonId: number,
  place: TestPlace | null,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/observations`;
  const placeParam = place ? `&place_id=${place.id}` : "";
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${taxonId}${placeParam}`;
  const label = `${sp.label} (taxon_id=${taxonId}) — iNat observations URL builder`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsRaw, `inat/observations:${sp.name}`);

    const findings: FieldFinding[] = [];

    const requiredFields = ["taxon_id", "observations_by_species_url", "observations_by_place_url", "api_observations_endpoint", "queried_at"] as const;
    for (const field of requiredFields) {
      if (fernsData[field] !== undefined && fernsData[field] !== null) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsData[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from response` });
      }
    }

    const obsUrl = fernsData.observations_by_species_url as string | undefined;
    if (obsUrl && typeof obsUrl === "string" && obsUrl.startsWith("https://")) {
      findings.push({ type: "ok", sourceField: "observations_by_species_url", note: `URL is absolute HTTPS: ${obsUrl}` });
    } else if (obsUrl) {
      findings.push({ type: "mismatch", sourceField: "observations_by_species_url", fernsValue: obsUrl, note: "URL should be absolute HTTPS" });
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}${placeParam}`,
      label,
      ok: true,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}${placeParam}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
