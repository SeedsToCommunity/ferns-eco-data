import { fetchJson, headUrl, isAbsoluteUrl, collectUrls } from "../http.js";
import type { EndpointComparison } from "../types.js";
import type { BonapTestSpecies } from "../corpus.js";

export async function runBonapComparators(
  fernsBase: string,
  species: BonapTestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  for (const sp of species) {
    results.push(await compareBonapMap(fernsBase, sp));
  }

  return results;
}

async function compareBonapMap(fernsBase: string, sp: BonapTestSpecies): Promise<EndpointComparison> {
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

    // Assert envelope found matches expectation
    const found = fernsRaw.found as boolean | undefined;
    if (found === undefined || found === null) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        fernsField: "found",
        fernsValue: found,
        note: "envelope found field is missing from FERNS response",
      });
    } else if (found !== sp.expectedFound) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        fernsField: "found",
        fernsValue: String(found),
        note: `found=${found} but expected ${sp.expectedFound} for "${sp.name}"`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "found",
        fernsField: "found",
        fernsValue: String(found),
        note: `found=${found} matches expected for "${sp.name}" ✓`,
      });
    }

    // Assert data.map_type_served is a valid enum value
    const mapTypeServed = fernsData.map_type_served as string | undefined;
    const validMapTypes = ["county_species", "state_species"];
    if (!mapTypeServed) {
      findings.push({
        type: "mismatch",
        sourceField: "map_type_served",
        fernsField: "map_type_served",
        fernsValue: mapTypeServed,
        note: "data.map_type_served is missing from FERNS response",
      });
    } else if (!validMapTypes.includes(mapTypeServed)) {
      findings.push({
        type: "mismatch",
        sourceField: "map_type_served",
        fernsField: "map_type_served",
        fernsValue: mapTypeServed,
        note: `data.map_type_served "${mapTypeServed}" is not one of: ${validMapTypes.join(", ")}`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "map_type_served",
        fernsField: "map_type_served",
        fernsValue: mapTypeServed,
        note: `data.map_type_served "${mapTypeServed}" is valid ✓`,
      });
    }

    // Assert data.genus matches the normalized genus from corpus
    const genus = fernsData.genus as string | undefined;
    if (!genus) {
      findings.push({
        type: "mismatch",
        sourceField: "genus",
        fernsField: "genus",
        fernsValue: genus,
        note: "data.genus is missing from FERNS response",
      });
    } else if (genus !== sp.genus) {
      findings.push({
        type: "mismatch",
        sourceField: "genus",
        fernsField: "genus",
        fernsValue: genus,
        note: `data.genus "${genus}" does not match expected "${sp.genus}"`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "genus",
        fernsField: "genus",
        fernsValue: genus,
        note: `data.genus "${genus}" matches expected ✓`,
      });
    }

    // Assert data.species is present and matches corpus epithet
    const speciesReturned = fernsData.species as string | undefined;
    if (!speciesReturned) {
      findings.push({
        type: "mismatch",
        sourceField: "species",
        fernsField: "species",
        fernsValue: speciesReturned,
        note: "data.species is missing from FERNS response",
      });
    } else if (speciesReturned !== sp.species) {
      findings.push({
        type: "mismatch",
        sourceField: "species",
        fernsField: "species",
        fernsValue: speciesReturned,
        note: `data.species "${speciesReturned}" does not match expected "${sp.species}"`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "species",
        fernsField: "species",
        fernsValue: speciesReturned,
        note: `data.species "${speciesReturned}" matches expected ✓`,
      });
    }

    return {
      source: "bonap",
      endpoint: `${fernsEndpoint}?genus=${encodeURIComponent(sp.genus)}&species=${encodeURIComponent(sp.species)}`,
      label,
      ok: true,
      rawFerns: fernsRaw,
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
