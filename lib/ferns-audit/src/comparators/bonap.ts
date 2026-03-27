import { fetchJson, headUrl, isAbsoluteUrl, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";
import type { TestSpecies } from "../corpus.js";

export async function runBonapComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    results.push(await compareBonapMap(fernsBase, sp));
  }

  return results;
}

async function compareBonapMap(fernsBase: string, sp: TestSpecies): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/bonap/map`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?genus=${encodeURIComponent(sp.genus)}&species=${encodeURIComponent(sp.species)}&refresh=true`;
  const label = `${sp.label} (${sp.name}) — distribution map`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const mapUrl = fernsData.map_url as string | null | undefined;

    const findings: EndpointComparison["findings"] = [];
    const urlsCollected = collectUrls(fernsRaw, `bonap/map:${sp.name}`);

    findings.push({
      type: "ok",
      sourceField: "(bonap)",
      note: "BONAP serves PNG images, not structured JSON — map URL validation only",
    });

    if (!mapUrl) {
      findings.push({
        type: "gap",
        sourceField: "map_url",
        note: "FERNS returned null map_url — map may not exist for this species",
      });
    } else {
      if (!isAbsoluteUrl(mapUrl)) {
        findings.push({
          type: "mismatch",
          sourceField: "map_url",
          fernsField: "map_url",
          fernsValue: mapUrl,
          note: "map_url is not absolute — passthrough URL rule violation",
        });
      } else {
        try {
          const headResult = await headUrl(mapUrl);
          const contentType = headResult.contentType ?? "";
          const isPng = contentType.includes("image/png");
          if (headResult.status !== 200 || !isPng) {
            findings.push({
              type: "mismatch",
              sourceField: "map_url",
              fernsField: "map_url",
              fernsValue: mapUrl,
              note: `BONAP server returned HTTP ${headResult.status}, Content-Type: ${contentType}. Expected exactly HTTP 200 image/png.`,
            });
          } else {
            findings.push({
              type: "ok",
              sourceField: "map_url",
              fernsField: "map_url",
              fernsValue: mapUrl,
              note: `BONAP server: HTTP 200, Content-Type: ${contentType} ✓`,
            });
          }
        } catch (err) {
          findings.push({
            type: "mismatch",
            sourceField: "map_url",
            fernsField: "map_url",
            fernsValue: mapUrl,
            note: `HEAD request to BONAP server failed: ${String(err)}`,
          });
        }
      }
    }

    const status = fernsData.status as string | undefined;
    findings.push({
      type: "ok",
      sourceField: "status",
      fernsField: "status",
      fernsValue: status,
      note: `FERNS map status: ${status}`,
    });

    return {
      source: "bonap",
      endpoint: `${fernsEndpoint}?genus=${encodeURIComponent(sp.genus)}&species=${encodeURIComponent(sp.species)}`,
      label,
      ok: true,
      rawFerns: fernsData,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "bonap",
      endpoint: `${fernsEndpoint}?genus=${encodeURIComponent(sp.genus)}&species=${encodeURIComponent(sp.species)}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
