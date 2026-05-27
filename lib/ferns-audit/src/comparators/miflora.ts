import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies } from "../corpus.js";

const MIFLORA_API = "https://michiganflora.net/api/v1.0";

export async function runMifloraComparators(
  fernsBase: string,
  species: TestSpecies[],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];
  for (const sp of species) {
    const plantId = await getUpstreamPlantId(sp.name);
    results.push(await compareMifloraFloraSearch(fernsBase, sp));
    results.push(await compareMifloraCounties(fernsBase, sp, plantId));
    results.push(await compareMifloraImages(fernsBase, sp, plantId));
    if (plantId !== null) {
      results.push(await compareMifloraSpecText(fernsBase, sp, plantId));
      results.push(await compareMifloraSynonyms(fernsBase, sp, plantId));
      results.push(await compareMifloraPImage(fernsBase, sp, plantId));
    }
  }
  return results;
}

async function getUpstreamPlantId(name: string): Promise<number | string | null> {
  try {
    const raw = await fetchJson(`${MIFLORA_API}/flora_search_sp?scientific_name=${encodeURIComponent(name)}`);
    const records: Array<Record<string, unknown>> = Array.isArray(raw)
      ? (raw as Record<string, unknown>[])
      : (((raw as Record<string, unknown>)?.search_records as Array<Record<string, unknown>> | undefined) ?? []);
    if (!records.length) return null;
    const match = records.find(
      (r) => typeof r.scientific_name === "string" &&
        r.scientific_name.toLowerCase() === name.toLowerCase(),
    );
    return ((match?.plant_id ?? records[0]?.plant_id) as number | string | null) ?? null;
  } catch {
    return null;
  }
}

function assertEnvelopeShape(fernsRaw: Record<string, unknown>, endpointLabel: string): FieldFinding[] {
  const findings: FieldFinding[] = [];

  if (typeof fernsRaw.found !== "boolean") {
    findings.push({ type: "gap", sourceField: "found", note: `${endpointLabel}: envelope missing found (boolean)` });
  } else {
    findings.push({ type: "ok", sourceField: "found", note: `${endpointLabel}: envelope found=${fernsRaw.found}` });
  }

  if (typeof fernsRaw.permission_granted !== "boolean") {
    findings.push({ type: "gap", sourceField: "permission_granted", note: `${endpointLabel}: envelope missing permission_granted` });
  } else {
    findings.push({ type: "ok", sourceField: "permission_granted", note: `${endpointLabel}: permission_granted=${fernsRaw.permission_granted}` });
  }

  const provenance = fernsRaw.provenance as Record<string, unknown> | undefined;
  if (!provenance || typeof provenance !== "object") {
    findings.push({ type: "gap", sourceField: "provenance", note: `${endpointLabel}: envelope missing provenance block` });
    return findings;
  }

  if (provenance.source_id !== "michigan-flora") {
    findings.push({ type: "mismatch", sourceField: "provenance.source_id", sourceValue: "michigan-flora", fernsValue: String(provenance.source_id ?? ""), note: `${endpointLabel}: unexpected source_id` });
  } else {
    findings.push({ type: "ok", sourceField: "provenance.source_id", note: `${endpointLabel}: provenance.source_id=michigan-flora` });
  }

  const validMethods = ["api_fetch", "cache_hit", "computed"];
  if (!validMethods.includes(String(provenance.method ?? ""))) {
    findings.push({ type: "gap", sourceField: "provenance.method", note: `${endpointLabel}: unexpected method=${provenance.method}` });
  } else {
    findings.push({ type: "ok", sourceField: "provenance.method", note: `${endpointLabel}: provenance.method=${provenance.method}` });
  }

  const validStatuses = ["hit", "miss", "stale", "bypass"];
  if (!validStatuses.includes(String(provenance.cache_status ?? ""))) {
    findings.push({ type: "gap", sourceField: "provenance.cache_status", note: `${endpointLabel}: unexpected cache_status=${provenance.cache_status}` });
  } else {
    findings.push({ type: "ok", sourceField: "provenance.cache_status", note: `${endpointLabel}: provenance.cache_status=${provenance.cache_status}` });
  }

  return findings;
}

async function compareMifloraCounties(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string | null,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/locs_sp`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const label = `${sp.label}${plantId !== null ? ` (plant_id=${plantId})` : ""} — Michigan Flora counties`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const fernsLocations = (fernsData.locations ?? []) as string[];
    const urlsCollected = collectUrls(fernsRaw, `miflora/locs_sp:${sp.name}`);

    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "locs_sp");

    if (plantId === null) {
      findings.push({
        type: "ok",
        sourceField: "locations",
        note: `FERNS returned ${fernsLocations.length} counties — upstream comparison skipped (no plant_id resolved from upstream, species may not be in Michigan Flora)`,
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

async function compareMifloraImages(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string | null,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/allimage_info`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const label = `${sp.label}${plantId !== null ? ` (plant_id=${plantId})` : ""} — Michigan Flora images`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsImages = Array.isArray(fernsRaw.data) ? (fernsRaw.data as unknown[]) : [];
    const urlsCollected = collectUrls(fernsRaw, `miflora/allimage_info:${sp.name}`);

    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "allimage_info");

    if (plantId === null) {
      findings.push({
        type: "ok",
        sourceField: "images.length",
        note: `FERNS returned ${fernsImages.length} images — upstream comparison skipped (no plant_id resolved from upstream, species may not be in Michigan Flora)`,
      });
      return {
        source: "miflora",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
        label,
        ok: true,
        rawFerns: { image_count: fernsImages.length },
        findings,
        urlsCollected,
      };
    }

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/allimage_info?id=${plantId}`);
    const upstreamImages = Array.isArray(upstreamRaw) ? upstreamRaw : [];

    if (fernsImages.length === upstreamImages.length) {
      findings.push({
        type: "ok",
        sourceField: "images.length",
        fernsField: "data.length",
        fernsValue: fernsImages.length,
        note: `Image count matches: ${fernsImages.length} images`,
      });
    } else {
      findings.push({
        type: "mismatch",
        sourceField: "images.length",
        fernsField: "data.length",
        sourceValue: upstreamImages.length,
        fernsValue: fernsImages.length,
        note: `Image count mismatch: upstream has ${upstreamImages.length}, FERNS has ${fernsImages.length}`,
      });
    }

    if (fernsImages.length > 0) {
      const firstFerns = fernsImages[0] as Record<string, unknown>;
      const hasImageId = firstFerns["image_id"] != null;

      if (hasImageId) {
        findings.push({
          type: "ok",
          sourceField: "image_id",
          note: `First image has image_id=${firstFerns["image_id"]} (consumers construct URLs via website_url_patterns)`,
        });
      } else {
        findings.push({
          type: "gap",
          sourceField: "image_id",
          note: `First image record is missing image_id`,
        });
      }
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: { image_count: upstreamImages.length },
      rawFerns: { image_count: fernsImages.length },
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

async function compareMifloraFloraSearch(
  fernsBase: string,
  sp: TestSpecies,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/flora_search_sp`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&refresh=true`;
  const label = `${sp.label} — Michigan Flora flora_search_sp`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsRaw, `miflora/flora_search_sp:${sp.name}`);
    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "flora_search_sp");

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/flora_search_sp?scientific_name=${encodeURIComponent(sp.name)}`);
    const upstreamRecords: Array<Record<string, unknown>> = Array.isArray(upstreamRaw)
      ? (upstreamRaw as Record<string, unknown>[])
      : (((upstreamRaw as Record<string, unknown>)?.search_records as Array<Record<string, unknown>> | undefined) ?? []);
    const upstreamFirst = upstreamRecords[0] ?? null;

    if (!upstreamFirst && !fernsData.plant_id) {
      findings.push({ type: "ok", sourceField: "found", note: "Both FERNS and upstream: species not found" });
    } else if (!upstreamFirst) {
      findings.push({ type: "addition", sourceField: "found", note: "FERNS found a result but upstream returned no records" });
    } else if (!fernsData.plant_id) {
      findings.push({ type: "gap", sourceField: "found", note: "Upstream found a result but FERNS found is false" });
    } else {
      const fernsPlantId = Number(fernsData.plant_id);
      const upstreamPlantId = Number(upstreamFirst.plant_id);
      if (fernsPlantId === upstreamPlantId) {
        findings.push({ type: "ok", sourceField: "plant_id", fernsValue: fernsPlantId, note: `plant_id matches: ${fernsPlantId}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "plant_id", sourceValue: upstreamPlantId, fernsValue: fernsPlantId, note: "plant_id mismatch" });
      }
      for (const field of ["scientific_name", "family_name", "na", "c", "wet"] as const) {
        const fernsVal = String(fernsData[field] ?? "");
        const upstreamVal = String(upstreamFirst[field] ?? "");
        if (fernsVal.toLowerCase() === upstreamVal.toLowerCase() || (!fernsVal && !upstreamVal)) {
          findings.push({ type: "ok", sourceField: field, fernsValue: fernsVal, note: `${field} matches` });
        } else {
          findings.push({ type: "mismatch", sourceField: field, sourceValue: upstreamVal, fernsValue: fernsVal, note: `${field} mismatch` });
        }
      }
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}`,
      label,
      ok: true,
      rawSource: upstreamFirst ? { plant_id: upstreamFirst.plant_id, scientific_name: upstreamFirst.scientific_name } : undefined,
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

async function compareMifloraSpecText(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/spec_text`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?id=${plantId}&refresh=true`;
  const label = `${sp.label} (plant_id=${plantId}) — Michigan Flora spec_text`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsRaw, `miflora/spec_text:${plantId}`);
    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "spec_text");

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/spec_text?id=${plantId}`) as Record<string, unknown>;
    const upstreamText = typeof upstreamRaw.text === "string" ? upstreamRaw.text : null;
    const fernsText = typeof fernsData.text === "string" ? fernsData.text : null;

    if (upstreamText && fernsText) {
      const lenDiff = Math.abs(fernsText.length - upstreamText.length);
      const pct = upstreamText.length > 0 ? (lenDiff / upstreamText.length) * 100 : 0;
      if (pct < 5) {
        findings.push({ type: "ok", sourceField: "text", note: `text length similar (upstream=${upstreamText.length}, ferns=${fernsText.length}, diff=${lenDiff} chars)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "text", sourceValue: upstreamText.length, fernsValue: fernsText.length, note: `text length differs by ${pct.toFixed(0)}%` });
      }
    } else if (!upstreamText && !fernsText) {
      findings.push({ type: "ok", sourceField: "text", note: "Both FERNS and upstream: no description text" });
    } else if (!fernsText) {
      findings.push({ type: "gap", sourceField: "text", note: "Upstream has description text but FERNS returned null" });
    } else {
      findings.push({ type: "addition", sourceField: "text", note: "FERNS has description text but upstream returned null" });
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: true,
      rawSource: { text_length: upstreamText?.length ?? 0 },
      rawFerns: { text_length: fernsText?.length ?? 0 },
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareMifloraSynonyms(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/synonyms`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?id=${plantId}&refresh=true`;
  const label = `${sp.label} (plant_id=${plantId}) — Michigan Flora synonyms`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const ferns = (fernsData.synonyms ?? []) as unknown[];
    const urlsCollected = collectUrls(fernsRaw, `miflora/synonyms:${plantId}`);
    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "synonyms");

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/synonyms?id=${plantId}`);
    const upstream = Array.isArray(upstreamRaw) ? upstreamRaw : [];

    if (ferns.length === upstream.length) {
      findings.push({ type: "ok", sourceField: "synonyms.length", fernsValue: ferns.length, note: `Synonym count matches: ${ferns.length}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "synonyms.length", sourceValue: upstream.length, fernsValue: ferns.length, note: `Synonym count mismatch` });
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: true,
      rawSource: { synonym_count: upstream.length },
      rawFerns: { synonym_count: ferns.length },
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareMifloraPImage(
  fernsBase: string,
  sp: TestSpecies,
  plantId: number | string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/miflora/pimage_info`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?id=${plantId}&refresh=true`;
  const label = `${sp.label} (plant_id=${plantId}) — Michigan Flora pimage_info`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = (fernsRaw.data ?? {}) as Record<string, unknown>;
    const fernsImage = fernsData.image as Record<string, unknown> | null;
    const urlsCollected = collectUrls(fernsRaw, `miflora/pimage_info:${plantId}`);
    const findings: FieldFinding[] = assertEnvelopeShape(fernsRaw, "pimage_info");

    const upstreamRaw = await fetchJson(`${MIFLORA_API}/pimage_info?id=${plantId}`) as Record<string, unknown>;
    const upstreamImageId = upstreamRaw.image_id as number | string | undefined;
    const hasUpstream = upstreamImageId != null && !("message" in upstreamRaw);

    if (hasUpstream && fernsImage) {
      const fernsId = String(fernsImage.image_id ?? "");
      const upstreamId = String(upstreamImageId);
      if (fernsId === upstreamId) {
        findings.push({ type: "ok", sourceField: "image_id", fernsValue: fernsId, note: `image_id matches: ${fernsId}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "image_id", sourceValue: upstreamId, fernsValue: fernsId, note: "image_id mismatch" });
      }
      const hasImageId = fernsImage.image_id != null;
      if (hasImageId) {
        findings.push({ type: "ok", sourceField: "image_id", note: `image_id present in data.image (consumers construct URLs via website_url_patterns): image_id=${fernsImage.image_id}` });
      } else {
        findings.push({ type: "gap", sourceField: "image_id", note: "Missing image_id in data.image" });
      }
    } else if (!hasUpstream && !fernsImage) {
      findings.push({ type: "ok", sourceField: "image", note: "Both FERNS and upstream: no primary image" });
    } else if (!fernsImage) {
      findings.push({ type: "gap", sourceField: "image", note: "Upstream has a primary image but FERNS returned null" });
    } else {
      findings.push({ type: "addition", sourceField: "image", note: "FERNS has a primary image but upstream returned none" });
    }

    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: true,
      rawSource: { image_id: upstreamImageId ?? null },
      rawFerns: { image_id: fernsImage?.image_id ?? null, image_url: fernsImage?.image_url ?? null },
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "miflora",
      endpoint: `${fernsEndpoint}?id=${plantId}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
