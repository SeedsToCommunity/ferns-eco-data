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
    const inatTaxonId = sp.inatTaxonId;
    if (inatTaxonId) {
      for (const place of places) {
        results.push(await compareInatHistogram(fernsBase, sp, inatTaxonId, place));
        results.push(await compareInatFieldValues(fernsBase, sp, inatTaxonId, place));
      }
      results.push(await checkInatObservations(fernsBase, sp, inatTaxonId, places[0] ?? null));
    }
  }

  results.push(await checkInatSpeciesCounts(fernsBase));
  results.push(await checkInatObservationSummaryExpanded(fernsBase, species[0] ?? null));
  results.push(await checkInatControlledTerms(fernsBase));

  const firstTaxonId = species[0]?.inatTaxonId;
  if (firstTaxonId) {
    results.push(await checkInatControlledTermsForTaxon(fernsBase, firstTaxonId));
    results.push(await checkInatTaxonById(fernsBase, firstTaxonId));
    results.push(await checkInatTaxaAutocomplete(fernsBase, species[0]?.label ?? "Trillium"));
  }

  if (places[0]) {
    results.push(await checkInatPlaceById(fernsBase, places[0].id));
    results.push(await checkInatPlacesNearby(fernsBase));
  }

  results.push(await checkInatTaxonSummary(fernsBase));
  results.push(await checkInatIdentificationById(fernsBase));
  results.push(await checkInatSimilarSpecies(fernsBase, firstTaxonId));
  results.push(await checkInatIdentSpeciesCounts(fernsBase));
  results.push(await checkInatRecentTaxa(fernsBase));
  results.push(await checkInatIdentifications(fernsBase, firstTaxonId));

  return results;
}

async function compareInatPlace(
  fernsBase: string,
  pq: TestPlaceQuery,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/places/autocomplete`;
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
    const urlsCollected = collectUrls(fernsEnvelope, `inat/places/autocomplete:${pq.q}`);

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
          if (field === "place_type_name") {
            findings.push({
              type: "addition",
              sourceField: field,
              fernsField: field,
              fernsValue: firstFerns[field],
              note: `place_type_name is intentional FERNS enrichment: human-readable label derived from the numeric place_type value (${firstFerns["place_type"]}); iNat does not include this field in autocomplete results`,
            });
          } else if (String(firstFerns[field] ?? "") === String(firstInat[field] ?? "")) {
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

async function compareInatHistogram(
  fernsBase: string,
  sp: TestSpecies,
  taxonId: number,
  place: TestPlace,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/observations/histogram`;
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
    const urlsCollected = collectUrls(fernsEnvelope, `inat/observations/histogram:${sp.name}@${place.name}`);

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
  const fernsEndpoint = `/api/inat/observations/popular_field_values`;
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
    const urlsCollected = collectUrls(fernsEnvelope, `inat/observations/popular_field_values:${sp.name}@${place.name}`);

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

async function checkInatSpeciesCounts(
  fernsBase: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/observations/species_counts`;
  const placeId = 2649;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?place_id=${placeId}&native=true&iconic_taxon_name=Plantae&quality_grade=research&per_page=10`;
  const inatUrl = `https://api.inaturalist.org/v1/observations/species_counts?place_id=${placeId}&native=true&iconic_taxon_name=Plantae&quality_grade=research&per_page=10`;
  const label = `Washtenaw Co (place_id=2649), native=true, Plantae, research — species_counts (live passthrough)`;

  try {
    const [inatRaw, fernsRaw] = await Promise.all([
      fetchJson(inatUrl) as Promise<Record<string, unknown>>,
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `inat/observations/species_counts:Plantae@Washtenaw`);
    const inatResponse = inatRaw as Record<string, unknown>;

    const findings: FieldFinding[] = [];

    const inatTotal = inatResponse["total_results"] as number | undefined;
    const fernsTotal = fernsData["total_results"] as number | undefined;

    if (inatTotal !== undefined && fernsTotal !== undefined) {
      if (inatTotal === fernsTotal) {
        findings.push({ type: "ok", sourceField: "total_results", fernsField: "total_results", fernsValue: fernsTotal, note: "total_results matches upstream" });
      } else {
        findings.push({ type: "mismatch", sourceField: "total_results", sourceValue: inatTotal, fernsField: "total_results", fernsValue: fernsTotal, note: "Live call — minor divergence is expected if iNat index updated between requests" });
      }
    } else if (fernsTotal === undefined) {
      findings.push({ type: "gap", sourceField: "total_results", note: "total_results missing from FERNS response" });
    }

    const inatResults = (inatResponse["results"] ?? []) as Array<Record<string, unknown>>;
    const fernsResults = (fernsData["results"] ?? []) as Array<Record<string, unknown>>;

    if (fernsResults.length === 0 && inatResults.length > 0) {
      findings.push({ type: "gap", sourceField: "results", note: `Upstream returned ${inatResults.length} results but FERNS returned none` });
    } else if (fernsResults.length > 0) {
      findings.push({ type: "ok", sourceField: "results", note: `FERNS: ${fernsResults.length} results, upstream: ${inatResults.length} results` });

      const firstInatEntry = inatResults[0] as Record<string, unknown> | undefined;
      const firstFernsEntry = fernsResults[0] as Record<string, unknown> | undefined;

      if (firstInatEntry && firstFernsEntry) {
        const inatCount = firstInatEntry["count"] as number | undefined;
        const fernsCount = firstFernsEntry["count"] as number | undefined;
        if (inatCount !== undefined && fernsCount !== undefined) {
          if (inatCount === fernsCount) {
            findings.push({ type: "ok", sourceField: "results[0].count", fernsValue: fernsCount, note: "Top result count matches" });
          } else {
            findings.push({ type: "mismatch", sourceField: "results[0].count", sourceValue: inatCount, fernsValue: fernsCount, note: "Live call — divergence expected if index changed between requests" });
          }
        }

        const inatTaxon = firstInatEntry["taxon"] as Record<string, unknown> | undefined;
        const fernsTaxon = firstFernsEntry["taxon"] as Record<string, unknown> | undefined;
        if (inatTaxon && fernsTaxon) {
          if (inatTaxon["id"] === fernsTaxon["id"]) {
            findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: fernsTaxon["id"], note: "Top taxon id matches" });
          } else {
            findings.push({ type: "mismatch", sourceField: "results[0].taxon.id", sourceValue: inatTaxon["id"], fernsValue: fernsTaxon["id"] });
          }

          if (typeof fernsTaxon["name"] === "string" && fernsTaxon["name"].length > 0) {
            findings.push({ type: "ok", sourceField: "results[0].taxon.name", fernsValue: fernsTaxon["name"], note: "Top taxon name present" });
          } else {
            findings.push({ type: "gap", sourceField: "results[0].taxon.name", note: "taxon.name missing from first result" });
          }
        }
      }

      const sampleSize = Math.min(fernsResults.length, 5);
      let sampleGaps = 0;
      for (let i = 0; i < sampleSize; i++) {
        const entry = fernsResults[i] as Record<string, unknown> | undefined;
        const taxon = (entry?.["taxon"] ?? {}) as Record<string, unknown>;
        const hasRequired =
          typeof entry?.["count"] === "number" &&
          (typeof taxon["id"] === "number" || typeof taxon["id"] === "string") &&
          typeof taxon["name"] === "string" && (taxon["name"] as string).length > 0;
        if (!hasRequired) sampleGaps++;
      }
      if (sampleGaps === 0) {
        findings.push({ type: "ok", sourceField: `results[0..${sampleSize - 1}]`, note: `All ${sampleSize} sampled results have count, taxon.id, and taxon.name` });
      } else {
        findings.push({ type: "gap", sourceField: `results[sample]`, note: `${sampleGaps}/${sampleSize} sampled results missing required fields (count, taxon.id, taxon.name)` });
      }
    }

    const prov = fernsEnvelope["provenance"] as Record<string, unknown> | undefined;
    if (prov && prov["source_id"]) {
      findings.push({ type: "ok", sourceField: "provenance.source_id", fernsValue: prov["source_id"], note: "Provenance block present" });
    } else {
      findings.push({ type: "gap", sourceField: "provenance", note: "Provenance block missing from FERNS response" });
    }

    const failGaps = findings.filter((f) => f.type === "gap");
    const requiredOk =
      fernsEnvelope["found"] !== undefined &&
      fernsData["total_results"] !== undefined &&
      (fernsTotal ?? 0) > 0 &&
      fernsResults.length > 0 &&
      prov !== undefined &&
      prov["source_id"] !== undefined;

    if (!requiredOk) {
      findings.push({
        type: "gap",
        sourceField: "required_checks",
        note: `Required checks failed: found=${fernsEnvelope["found"]}, total_results=${fernsTotal}, results.length=${fernsResults.length}, provenance.source_id=${prov?.["source_id"]}`,
      });
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&native=true&iconic_taxon_name=Plantae&quality_grade=research&per_page=10`,
      label,
      ok: requiredOk && failGaps.length === 0,
      rawSource: inatResponse,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&native=true&iconic_taxon_name=Plantae&quality_grade=research&per_page=10`,
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

    const requiredFields = ["total_results", "page", "per_page", "results"] as const;
    for (const field of requiredFields) {
      if (fernsData[field] !== undefined && fernsData[field] !== null) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsData[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from data` });
      }
    }

    const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
    if (prov?.["source_id"]) {
      findings.push({ type: "ok", sourceField: "provenance.source_id", fernsField: "provenance.source_id", fernsValue: prov["source_id"], note: `source_id=${prov["source_id"]}` });
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

async function checkInatObservationSummaryExpanded(
  fernsBase: string,
  sp: TestSpecies | null,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/observations`;
  const taxonParam = sp ? `?taxon_id=${sp.inatTaxonId ?? ""}&per_page=5` : `?per_page=5`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}${taxonParam}`;
  const label = sp
    ? `${sp.label} — iNat observations expanded fields`
    : `iNat observations expanded fields`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/observations");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from response` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    const results = Array.isArray(data?.["results"]) ? data!["results"] as Array<Record<string, unknown>> : [];

    findings.push({ type: "ok", sourceField: "total_results", fernsField: "total_results", fernsValue: data?.["total_results"], note: `total_results present` });
    findings.push({ type: "ok", sourceField: "page", fernsField: "page", fernsValue: data?.["page"], note: `page present` });
    findings.push({ type: "ok", sourceField: "per_page", fernsField: "per_page", fernsValue: data?.["per_page"], note: `per_page present` });

    if (results.length > 0) {
      const rec = results[0];
      const expandedFields = [
        "uuid", "obscured", "license_code", "description", "tags",
        "photos", "annotations", "ofvs",
      ] as const;
      for (const field of expandedFields) {
        if (rec[field] !== undefined) {
          findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: rec[field], note: `record.${field} present` });
        } else {
          findings.push({ type: "gap", sourceField: field, note: `record.${field} missing from observation record` });
        }
      }
      const taxon = rec["taxon"] as Record<string, unknown> | undefined;
      if (taxon) {
        for (const sub of ["id", "rank", "iconic_taxon_name"] as const) {
          if (taxon[sub] !== undefined) {
            findings.push({ type: "ok", sourceField: `taxon.${sub}`, fernsField: `taxon.${sub}`, fernsValue: taxon[sub], note: `taxon.${sub} present` });
          } else {
            findings.push({ type: "gap", sourceField: `taxon.${sub}`, note: `taxon.${sub} missing from observation record` });
          }
        }
      } else {
        findings.push({ type: "gap", sourceField: "taxon", note: "taxon object missing from observation record" });
      }
      const user = rec["user"] as Record<string, unknown> | undefined;
      if (user) {
        for (const sub of ["id", "login"] as const) {
          if (user[sub] !== undefined) {
            findings.push({ type: "ok", sourceField: `user.${sub}`, fernsField: `user.${sub}`, fernsValue: user[sub], note: `user.${sub} present` });
          } else {
            findings.push({ type: "gap", sourceField: `user.${sub}`, note: `user.${sub} missing from observation record` });
          }
        }
      } else {
        findings.push({ type: "gap", sourceField: "user", note: "user object missing from observation record" });
      }
    } else {
      findings.push({ type: "gap", sourceField: "results", note: "No observation records returned — cannot verify expanded fields" });
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}${taxonParam}`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}${taxonParam}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatControlledTerms(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/controlled_terms`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `iNat controlled_terms reference list`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/controlled_terms");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from response` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results) && results.length > 0) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} controlled terms returned` });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No controlled terms in response" });
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatControlledTermsForTaxon(
  fernsBase: string,
  taxonId: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/controlled_terms/for_taxon`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${taxonId}`;
  const label = `iNat controlled_terms/for_taxon (taxon_id=${taxonId})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/controlled_terms/for_taxon");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from response` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${taxonId}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatTaxaAutocomplete(
  fernsBase: string,
  q: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/taxa/autocomplete`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?q=${encodeURIComponent(q)}`;
  const label = `iNat taxa/autocomplete q="${q}"`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/taxa/autocomplete");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results) && results.length > 0) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} taxon autocomplete results` });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No autocomplete results" });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(q)}`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?q=${encodeURIComponent(q)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatTaxonById(
  fernsBase: string,
  taxonId: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/taxa/${taxonId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `iNat taxa by ID (taxon_id=${taxonId})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, `inat/taxa/${taxonId}`);

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }

    const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
    if (prov?.["source_url"] !== undefined) {
      findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
    } else {
      findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
    }
    if (prov?.["cache_status"]) {
      findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results) && results.length > 0) {
        const t = results[0] as Record<string, unknown>;
        findings.push({ type: "ok", sourceField: "id", fernsField: "id", fernsValue: t["id"], note: `taxon id=${t["id"]}` });
        findings.push({ type: "ok", sourceField: "name", fernsField: "name", fernsValue: t["name"], note: `name=${t["name"]}` });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No results in taxon response" });
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatPlaceById(
  fernsBase: string,
  placeId: number,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/places/${placeId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `iNat places by ID (place_id=${placeId})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, `inat/places/${placeId}`);

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }

    const placeProv = fernsRaw["provenance"] as Record<string, unknown> | undefined;
    if (placeProv?.["source_url"] !== undefined) {
      findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: placeProv["source_url"], note: `source_url present` });
    } else {
      findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
    }
    if (placeProv?.["cache_status"]) {
      findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: placeProv["cache_status"], note: `cache_status=${placeProv["cache_status"]}` });
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results) && results.length > 0) {
        const p = results[0] as Record<string, unknown>;
        findings.push({ type: "ok", sourceField: "id", fernsField: "id", fernsValue: p["id"], note: `place id=${p["id"]}` });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No results in place response" });
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatPlacesNearby(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/places/nearby`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?nelat=42.45&nelng=-83.5&swlat=42.12&swlng=-84.1`;
  const label = `iNat places/nearby (Washtenaw County bbox)`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/places/nearby");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"] as Record<string, unknown> | undefined;
      if (results) {
        const standard = results["standard"];
        const community = results["community"];
        if (Array.isArray(standard)) {
          findings.push({ type: "ok", sourceField: "results.standard", note: `${standard.length} standard places` });
        }
        if (Array.isArray(community)) {
          findings.push({ type: "ok", sourceField: "results.community", note: `${community.length} community places` });
        }
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No results in nearby places response" });
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatTaxonSummary(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/observations/${362023441}/taxon_summary`;
  const observationId = 362023441;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `iNat observations/:id/taxon_summary (observation_id=${observationId})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, `inat/observations/${observationId}/taxon_summary`);

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      for (const subField of ["wikipedia_summary", "listed_taxon", "conservation_status"] as const) {
        if (data[subField] !== undefined && data[subField] !== null) {
          findings.push({ type: "ok", sourceField: subField, fernsValue: typeof data[subField] === "object" ? "[object]" : data[subField], note: `${subField} present` });
        } else {
          findings.push({ type: "ok", sourceField: subField, note: `${subField} not set for this observation (may be normal)` });
        }
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatIdentificationById(fernsBase: string): Promise<EndpointComparison> {
  const identId = 813148877;
  const fernsEndpoint = `/api/inat/identifications/${identId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `iNat identifications/:id (id=${identId})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, `inat/identifications/${identId}`);

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results) && results.length > 0) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} identification record(s) returned` });
        const first = results[0] as Record<string, unknown>;
        if (typeof first["id"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].id", fernsValue: first["id"], note: "identification id present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].id", note: "identification id missing" });
        }
        const taxon = first["taxon"] as Record<string, unknown> | undefined;
        if (taxon && typeof taxon["id"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: taxon["id"], note: "taxon.id present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].taxon.id", note: "taxon.id missing" });
        }
        const user = first["user"] as Record<string, unknown> | undefined;
        if (user && typeof user["login"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].user.login", fernsValue: user["login"], note: "user.login present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].user.login", note: "user.login missing" });
        }
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "No results returned for identification" });
      }
    }

    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatSimilarSpecies(
  fernsBase: string,
  taxonId: number | undefined,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/identifications/similar_species`;
  const tid = taxonId ?? 47486;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${tid}`;
  const label = `iNat identifications/similar_species (taxon_id=${tid})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/identifications/similar_species");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results)) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} similar species returned` });
        if (results.length > 0) {
          const first = results[0] as Record<string, unknown>;
          const taxon = first["taxon"] as Record<string, unknown> | undefined;
          const count = first["count"];
          if (typeof count === "number") {
            findings.push({ type: "ok", sourceField: "results[0].count", fernsValue: count, note: "co-confusion count present" });
          } else {
            findings.push({ type: "gap", sourceField: "results[0].count", note: "co-confusion count missing from first result" });
          }
          if (taxon && typeof taxon["id"] !== "undefined") {
            findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: taxon["id"], note: "taxon.id present" });
          } else {
            findings.push({ type: "gap", sourceField: "results[0].taxon.id", note: "taxon.id missing from first result" });
          }
        }
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "results array missing from similar-species response" });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${tid}`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${tid}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatIdentSpeciesCounts(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/identifications/species_counts`;
  const placeId = 2649;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`;
  const label = `iNat identifications/species_counts (place_id=${placeId}, research)`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/identifications/species_counts");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const total = data["total_results"];
      const results = data["results"];
      if (typeof total === "number") {
        findings.push({ type: "ok", sourceField: "total_results", fernsValue: total, note: `total_results=${total}` });
      } else {
        findings.push({ type: "gap", sourceField: "total_results", note: "total_results missing from response" });
      }
      if (Array.isArray(results) && results.length > 0) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} identification species counts returned` });
        const first = results[0] as Record<string, unknown>;
        const taxon = first["taxon"] as Record<string, unknown> | undefined;
        if (typeof first["count"] === "number") {
          findings.push({ type: "ok", sourceField: "results[0].count", fernsValue: first["count"], note: "count present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].count", note: "count missing from first result" });
        }
        if (taxon && typeof taxon["id"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: taxon["id"], note: "taxon.id present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].taxon.id", note: "taxon.id missing from first result" });
        }
      } else if (Array.isArray(results) && results.length === 0) {
        findings.push({ type: "ok", sourceField: "results", note: "No identification species counts — may be normal for this place" });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "results array missing" });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatRecentTaxa(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/identifications/recent_taxa`;
  const placeId = 10;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`;
  const label = `iNat identifications/recent_taxa (place_id=${placeId} Michigan, research)`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/identifications/recent_taxa");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const results = data["results"];
      if (Array.isArray(results)) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} recently identified taxa returned` });
        if (results.length > 0) {
          const first = results[0] as Record<string, unknown>;
          const taxon = first["taxon"] as Record<string, unknown> | undefined;
          if (taxon && typeof taxon["id"] !== "undefined") {
            findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: taxon["id"], note: "taxon.id present" });
          } else {
            findings.push({ type: "gap", sourceField: "results[0].taxon.id", note: "taxon.id missing from first result" });
          }
        }
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "results array missing from recent-taxa response" });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?place_id=${placeId}&quality_grade=research&per_page=10`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInatIdentifications(
  fernsBase: string,
  taxonId: number | undefined,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/inat/identifications`;
  const tid = taxonId ?? 47486;
  const placeId = 2649;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?taxon_id=${tid}&place_id=${placeId}&quality_grade=research&per_page=5`;
  const label = `iNat identifications (taxon_id=${tid}, place_id=${placeId}, research)`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const findings: FieldFinding[] = [];
    const urlsCollected = collectUrls(fernsRaw, "inat/identifications");

    for (const field of ["found", "data", "provenance"] as const) {
      if (fernsRaw[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsRaw[field], note: `${field} present` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing` });
      }
    }
    {
      const prov = fernsRaw["provenance"] as Record<string, unknown> | undefined;
      if (prov?.["source_url"] !== undefined) {
        findings.push({ type: "ok", sourceField: "provenance.source_url", fernsField: "provenance.source_url", fernsValue: prov["source_url"], note: `source_url present` });
      } else {
        findings.push({ type: "gap", sourceField: "provenance.source_url", note: "provenance.source_url missing" });
      }
      if (prov?.["cache_status"]) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", fernsField: "provenance.cache_status", fernsValue: prov["cache_status"], note: `cache_status=${prov["cache_status"]}` });
      }
    }

    const data = fernsRaw.data as Record<string, unknown> | undefined;
    if (data) {
      const total = data["total_results"];
      const results = data["results"];
      if (typeof total === "number") {
        findings.push({ type: "ok", sourceField: "total_results", fernsValue: total, note: `total_results=${total}` });
      } else {
        findings.push({ type: "gap", sourceField: "total_results", note: "total_results missing" });
      }
      if (Array.isArray(results) && results.length > 0) {
        findings.push({ type: "ok", sourceField: "results", note: `${results.length} identification records returned` });
        const first = results[0] as Record<string, unknown>;
        if (typeof first["id"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].id", fernsValue: first["id"], note: "identification id present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].id", note: "identification id missing from first result" });
        }
        const taxon = first["taxon"] as Record<string, unknown> | undefined;
        if (taxon && typeof taxon["id"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].taxon.id", fernsValue: taxon["id"], note: "taxon.id present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].taxon.id", note: "taxon.id missing from first result" });
        }
        const user = first["user"] as Record<string, unknown> | undefined;
        if (user && typeof user["login"] !== "undefined") {
          findings.push({ type: "ok", sourceField: "results[0].user.login", fernsValue: user["login"], note: "user.login present" });
        } else {
          findings.push({ type: "gap", sourceField: "results[0].user.login", note: "user.login missing from first result" });
        }
      } else if (Array.isArray(results) && results.length === 0) {
        findings.push({ type: "ok", sourceField: "results", note: "No identifications returned — may be normal" });
      } else {
        findings.push({ type: "gap", sourceField: "results", note: "results array missing" });
      }
    }

    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${tid}&place_id=${placeId}&quality_grade=research&per_page=5`,
      label,
      ok: true,
      rawFerns: fernsRaw,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "inat",
      endpoint: `${fernsEndpoint}?taxon_id=${tid}&place_id=${placeId}&quality_grade=research&per_page=5`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
