import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const MIFLORA_API = "https://michiganflora.net/api/v1.0";

export async function runMifloraComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];
  for (const sp of species) {
    results.push(await compareMifloraSpecies(fernsBase, sp));
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

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: upstreamSpecText as Record<string, unknown>,
      rawFerns: fernsSpecText,
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
