import { fetchJson, collectUrls } from "../http.js";
import { diffObjects } from "../diff.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const GBIF_API = "https://api.gbif.org/v1";

export async function runGbifComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    results.push(await compareGbifMatch(fernsBase, sp));
  }

  return results;
}

async function compareGbifMatch(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/gbif/match`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const gbifUrl = `${GBIF_API}/species/match?name=${encodeURIComponent(sp.name)}&kingdom=Plantae`;
  const label = `${sp.label} (${sp.name})`;

  try {
    const [gbifRaw, fernsRaw] = await Promise.all([
      fetchJson(gbifUrl),
      fetchJson(fernsUrl),
    ]);

    const gbifObj = gbifRaw as Record<string, unknown>;
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;

    const findings = diffObjects(gbifObj, fernsData, "GBIF");
    const urlsCollected = collectUrls(fernsEnvelope, `gbif/match:${sp.name}`);

    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: gbifObj,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "gbif",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
