import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const MIFLORA_API = "https://michiganflora.net/api/v1.0";

export async function runMifloraComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];
  for (const sp of species) {
    const speciesResult = await compareMifloraSpecies(fernsBase, sp);
    results.push(speciesResult);

    const plantId = speciesResult.rawFerns
      ? (speciesResult.rawFerns as Record<string, unknown>)["plant_id"] as number | string | undefined
      : undefined;

    results.push(await compareMifloraCounties(fernsBase, sp, plantId ?? null));
  }
  return results;
}

async function compareMifloraSpecies(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/species`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const label = `${sp.label} (${sp.name}) — Michigan Flora species`;

  try {
    const fernsRaw = await fetchJson(fernsUrl);
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `miflora/species:${sp.name}`);

    if (!fernsEnvelope.found) {
      return {
        source: "miflora",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
        label,
        ok: true,
        error: `FERNS returned found: false — species may not be in Michigan Flora (note: Michigan Flora covers Michigan plants only)`,
        findings: [],
        urlsCollected,
      };
    }

    const searchRecords = fernsData.search_records as Array<Record<string, unknown>> | null | undefined;
    const matchedRecord = (searchRecords ?? []).find(
      (r) => typeof r.scientific_name === "string" &&
        r.scientific_name.toLowerCase() === sp.name.toLowerCase(),
    );

    if (!matchedRecord) {
      return {
        source: "miflora",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
        label,
        ok: true,
        rawFerns: fernsData,
        error: `FERNS found the species but no exact scientific_name match in search_records — cannot identify plant_id for upstream comparison`,
        findings: [],
        urlsCollected,
      };
    }

    const plantId = matchedRecord.plant_id as number | string;

    const [upstreamSpecText, upstreamSynonyms] = await Promise.all([
      fetchJson(`${MIFLORA_API}/spec_text?id=${plantId}`) as Promise<Record<string, unknown>>,
      fetchJson(`${MIFLORA_API}/synonyms?id=${plantId}`).catch(() => null),
    ]);

    const fernsSpecText = (fernsData.spec_text ?? {}) as Record<string, unknown>;

    const findings = diffObjects(
      upstreamSpecText as Record<string, unknown>,
      fernsSpecText,
      "Michigan Flora",
    );

    if (upstreamSynonyms !== null) {
      const fernsSynonyms = (fernsData.synonyms ?? {}) as Record<string, unknown>;
      const upstreamSynonymsObj = upstreamSynonyms as Record<string, unknown>;
      const synonymFindings = diffObjects(upstreamSynonymsObj, fernsSynonyms, "Michigan Flora synonyms");
      findings.push(...synonymFindings);
    }

    const resultData = { ...fernsData, plant_id: plantId };

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: upstreamSpecText as Record<string, unknown>,
      rawFerns: resultData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareMifloraCounties(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string | null,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/counties`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const label = `${sp.label}${plantId !== null ? ` (plant_id=${plantId})` : ""} — Michigan Flora counties`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const fernsLocations = (fernsData.locations ?? []) as string[];
    const urlsCollected = collectUrls(fernsEnvelope, `miflora/counties:${sp.name}`);

    const findings: FieldFinding[] = [];

    if (plantId === null) {
      findings.push({
        type: "ok",
        sourceField: "locations",
        note: `FERNS returned ${fernsLocations.length} counties — upstream comparison skipped (no plant_id from species lookup, species may not be in Michigan Flora)`,
      });
      return {
        source: "miflora",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
        label,
        ok: true,
        rawFerns: fernsData,
        findings,
        urlsCollected,
      };
    }

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/locs_sp?id=${plantId}`) as Record<string, unknown>;
    const upstreamLocations = (upstreamRaw.locations ?? []) as string[];

    if (fernsLocations.length === upstreamLocations.length) {
      findings.push({
        type: "ok",
        sourceField: "locations.length",
        fernsField: "locations.length",
        fernsValue: fernsLocations.length,
        note: `County count matches: ${fernsLocations.length} counties`,
      });
    } else {
      findings.push({
        type: "mismatch",
        sourceField: "locations.length",
        fernsField: "locations.length",
        sourceValue: upstreamLocations.length,
        fernsValue: fernsLocations.length,
        note: `County count mismatch`,
      });
    }

    if (fernsLocations.length > 0 || upstreamLocations.length > 0) {
      const fernsSet = new Set(fernsLocations.map((l) => l.toLowerCase().trim()));
      const upstreamSet = new Set(upstreamLocations.map((l) => l.toLowerCase().trim()));

      const missingFromFerns = [...upstreamSet].filter((l) => !fernsSet.has(l));
      const extraInFerns = [...fernsSet].filter((l) => !upstreamSet.has(l));

      if (missingFromFerns.length === 0 && extraInFerns.length === 0) {
        findings.push({
          type: "ok",
          sourceField: "locations",
          note: `All ${fernsLocations.length} county names match upstream exactly`,
        });
      } else {
        if (missingFromFerns.length > 0) {
          findings.push({
            type: "gap",
            sourceField: "locations",
            note: `${missingFromFerns.length} counties in upstream not in FERNS: ${missingFromFerns.slice(0, 5).join(", ")}${missingFromFerns.length > 5 ? "..." : ""}`,
          });
        }
        if (extraInFerns.length > 0) {
          findings.push({
            type: "addition",
            sourceField: "locations",
            note: `${extraInFerns.length} counties in FERNS not in upstream: ${extraInFerns.slice(0, 5).join(", ")}${extraInFerns.length > 5 ? "..." : ""}`,
          });
        }
      }
    } else {
      findings.push({ type: "ok", sourceField: "locations", note: "Both FERNS and upstream returned no counties (species may have no Michigan occurrences)" });
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: upstreamRaw,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
