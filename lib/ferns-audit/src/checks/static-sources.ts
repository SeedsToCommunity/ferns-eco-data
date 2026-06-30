import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestVocabularyEntry, TestWetlandWValue } from "../corpus.js";

function envelopeFindings(envelope: Record<string, unknown>, context: string): FieldFinding[] {
  const findings: FieldFinding[] = [];

  if (envelope.found !== undefined) {
    findings.push({ type: "ok", sourceField: "found", note: `found: ${envelope.found}` });
  } else {
    findings.push({
      type: "mismatch",
      sourceField: "found",
      note: `FERNS envelope missing "found" field [${context}]`,
    });
  }

  if (envelope.permission_granted !== undefined) {
    findings.push({ type: "ok", sourceField: "permission_granted", note: `permission_granted: ${envelope.permission_granted}` });
  } else {
    findings.push({
      type: "mismatch",
      sourceField: "permission_granted",
      note: `FERNS envelope missing "permission_granted" field [${context}]`,
    });
  }

  const prov = envelope.provenance as Record<string, unknown> | null | undefined;
  if (prov && typeof prov === "object") {
    for (const key of ["source_id", "method", "cache_status", "license", "rights"]) {
      if (prov[key] !== undefined && prov[key] !== null && prov[key] !== "") {
        findings.push({ type: "ok", sourceField: `provenance.${key}`, note: `present` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: `provenance.${key}`,
          note: `Missing from provenance — required field`,
        });
      }
    }
  } else {
    findings.push({
      type: "mismatch",
      sourceField: "provenance",
      note: `FERNS envelope missing provenance object [${context}]`,
    });
  }

  return findings;
}

async function checkEndpoint(
  source: string,
  endpoint: string,
  label: string,
  fernsBase: string,
  extraChecks?: (envelope: Record<string, unknown>) => FieldFinding[],
): Promise<EndpointComparison> {
  const url = `${fernsBase}${endpoint}`;
  try {
    const raw = await fetchJson(url);
    const envelope = raw as Record<string, unknown>;
    const urlsCollected = collectUrls(envelope, `${source}${endpoint}`);
    const findings: FieldFinding[] = [
      { type: "ok", sourceField: "(http)", note: `HTTP 200 OK` },
      ...envelopeFindings(envelope, endpoint),
      ...(extraChecks ? extraChecks(envelope) : []),
    ];
    return {
      source,
      endpoint,
      label,
      ok: true,
      rawFerns: envelope,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source,
      endpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

function knownValueFindings(
  data: Record<string, unknown> | null | undefined,
  entry: TestVocabularyEntry,
): FieldFinding[] {
  const findings: FieldFinding[] = [];
  if (!data) return findings;
  if (!entry.expectedFields) return findings;

  for (const [field, expected] of Object.entries(entry.expectedFields)) {
    const actual = data[field];
    if (actual === expected) {
      findings.push({
        type: "ok",
        sourceField: `data.${field}`,
        fernsField: `data.${field}`,
        fernsValue: actual,
        note: `${field} = ${JSON.stringify(actual)} (expected)`,
      });
    } else {
      findings.push({
        type: "mismatch",
        sourceField: `data.${field}`,
        fernsField: `data.${field}`,
        sourceValue: expected,
        fernsValue: actual,
        note: `${field}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
      });
    }
  }
  return findings;
}

export async function runCoefficientChecks(
  fernsBase: string,
  corpusEntries: TestVocabularyEntry[] = [],
): Promise<EndpointComparison[]> {
  const allCheck = await checkEndpoint(
    "coefficient",
    "/api/coefficient-of-conservatism/list",
    "Coefficient of Conservatism — full lookup table",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data;
      const entries = Array.isArray(data) ? data : [];
      if (entries.length > 0) {
        findings.push({
          type: "ok",
          sourceField: "data",
          note: `${entries.length} C-value entries returned`,
        });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data",
          note: `data is empty or not an array`,
        });
      }
      return findings;
    },
  );

  const perValueChecks = await Promise.all(
    corpusEntries.map((entry) =>
      checkEndpoint(
        "coefficient",
        `/api/coefficient-of-conservatism?value=${encodeURIComponent(entry.key)}`,
        `Coefficient of Conservatism — value lookup (C=${entry.key})`,
        fernsBase,
        (envelope) => {
          const data = envelope.data as Record<string, unknown> | null | undefined;
          return [
            ...(data?.value !== undefined
              ? [{ type: "ok" as const, sourceField: "data.value", note: `data.value present: ${data.value}` }]
              : [{ type: "mismatch" as const, sourceField: "data.value", note: `data.value missing from response` }]),
            ...knownValueFindings(data, entry),
          ];
        },
      ),
    ),
  );

  return [allCheck, ...perValueChecks];
}

export async function runWetlandIndicatorChecks(
  fernsBase: string,
  corpusEntries: TestVocabularyEntry[] = [],
  wValues: TestWetlandWValue[] = [],
): Promise<EndpointComparison[]> {
  const allCheck = await checkEndpoint(
    "wetland-indicator",
    "/api/wetland-indicator-status/list",
    "Wetland Indicator Status — full code table",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data;
      const entries = Array.isArray(data) ? data : [];
      if (entries.length > 0) {
        findings.push({
          type: "ok",
          sourceField: "data",
          note: `${entries.length} WIS code entries returned`,
        });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data",
          note: `data is empty or not an array`,
        });
      }
      return findings;
    },
  );

  const perCodeChecks = await Promise.all(
    corpusEntries.map((entry) =>
      checkEndpoint(
        "wetland-indicator",
        `/api/wetland-indicator-status?code=${encodeURIComponent(entry.key)}`,
        `Wetland Indicator Status — code lookup (${entry.key})`,
        fernsBase,
        (envelope) => {
          const data = envelope.data as Record<string, unknown> | null | undefined;
          return [
            ...(data?.code !== undefined
              ? [{ type: "ok" as const, sourceField: "data.code", note: `data.code present: ${data.code}` }]
              : [{ type: "mismatch" as const, sourceField: "data.code", note: `data.code missing from response` }]),
            ...knownValueFindings(data, entry),
          ];
        },
      ),
    ),
  );

  const perWValueChecks = await Promise.all(
    wValues.map((wv) =>
      checkEndpoint(
        "wetland-indicator",
        `/api/wetland-indicator-status/w?value=${wv.value}`,
        `Wetland Indicator Status — W-value lookup (${wv.label})`,
        fernsBase,
        (envelope) => {
          const data = envelope.data as Record<string, unknown> | null | undefined;
          const findings: FieldFinding[] = [];

          if (data?.code !== undefined) {
            if (data.code === wv.expectedCode) {
              findings.push({ type: "ok", sourceField: "data.code", fernsField: "data.code", fernsValue: data.code, note: `code matches expected: "${wv.expectedCode}"` });
            } else {
              findings.push({ type: "mismatch", sourceField: "data.code", fernsField: "data.code", sourceValue: wv.expectedCode, fernsValue: data.code });
            }
          } else {
            findings.push({ type: "mismatch", sourceField: "data.code", note: `data.code missing from W-value response` });
          }

          if (data?.full_name !== undefined) {
            if (data.full_name === wv.expectedFullName) {
              findings.push({ type: "ok", sourceField: "data.full_name", fernsField: "data.full_name", fernsValue: data.full_name, note: `full_name matches expected: "${wv.expectedFullName}"` });
            } else {
              findings.push({ type: "mismatch", sourceField: "data.full_name", fernsField: "data.full_name", sourceValue: wv.expectedFullName, fernsValue: data.full_name });
            }
          } else {
            findings.push({ type: "mismatch", sourceField: "data.full_name", note: `data.full_name missing from W-value response` });
          }

          if (data?.w_value !== undefined) {
            if (data.w_value === wv.value) {
              findings.push({ type: "ok", sourceField: "data.w_value", fernsField: "data.w_value", fernsValue: data.w_value, note: `w_value matches: ${wv.value}` });
            } else {
              findings.push({ type: "mismatch", sourceField: "data.w_value", fernsField: "data.w_value", sourceValue: wv.value, fernsValue: data.w_value });
            }
          } else {
            findings.push({ type: "mismatch", sourceField: "data.w_value", note: `data.w_value missing from W-value response` });
          }

          return findings;
        },
      ),
    ),
  );

  return [allCheck, ...perCodeChecks, ...perWValueChecks];
}

export async function runWucolsChecks(
  fernsBase: string,
  corpusEntries: TestVocabularyEntry[] = [],
): Promise<EndpointComparison[]> {
  const allCheck = await checkEndpoint(
    "wucols-water-use",
    "/api/wucols-water-use/list",
    "WUCOLS — full water use classification table",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data;
      const entries = Array.isArray(data) ? data : [];
      if (entries.length > 0) {
        findings.push({
          type: "ok",
          sourceField: "data",
          note: `${entries.length} WUCOLS entries returned`,
        });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data",
          note: `data is empty or not an array`,
        });
      }
      return findings;
    },
  );

  const perCodeChecks = await Promise.all(
    corpusEntries.map((entry) =>
      checkEndpoint(
        "wucols-water-use",
        `/api/wucols-water-use?code=${encodeURIComponent(entry.key)}`,
        `WUCOLS — water use classification lookup (${entry.key})`,
        fernsBase,
        (envelope) => {
          const data = envelope.data as Record<string, unknown> | null | undefined;
          return [
            ...(data?.code !== undefined
              ? [{ type: "ok" as const, sourceField: "data.code", note: `data.code present: ${data.code}` }]
              : [{ type: "mismatch" as const, sourceField: "data.code", note: `data.code missing from response` }]),
            ...knownValueFindings(data, entry),
          ];
        },
      ),
    ),
  );

  return [allCheck, ...perCodeChecks];
}

// Known-value corpus for LCSCG assertions
// guide_id -> { title, season, habitat_type }
const LCSCG_KNOWN_GUIDES: Record<number, { title: string; season: string; habitat_type: string }> = {
  1271: { title: "Summer Woodland Forbs",          season: "summer", habitat_type: "woodland"               },
  1272: { title: "Woody Plants",                   season: "all",    habitat_type: "woody_plants"           },
  1273: { title: "Summer Wetland Grasses and Kin", season: "summer", habitat_type: "grasses_and_kin"        },
  1274: { title: "Summer Wetland Forbs",           season: "summer", habitat_type: "wetland"                },
  1275: { title: "Summer Prairie Forbs",           season: "summer", habitat_type: "prairie"                },
  1276: { title: "Summer Grasses and Kin",         season: "summer", habitat_type: "grasses_and_kin"        },
  1277: { title: "Spring Woodland Forbs",          season: "spring", habitat_type: "woodland"               },
  1278: { title: "Fall Woodland Forbs",            season: "fall",   habitat_type: "woodland"               },
  1279: { title: "Fall Wetland Forbs",             season: "fall",   habitat_type: "wetland"                },
  1280: { title: "Fall Grasses and Kin",           season: "fall",   habitat_type: "grasses_and_kin"        },
  1281: { title: "Asters and Goldenrods",          season: "fall",   habitat_type: "asters_and_goldenrods"  },
  1282: { title: "Fall Prairie Forbs",             season: "fall",   habitat_type: "prairie"                },
};

export async function runLcscgChecks(fernsBase: string): Promise<EndpointComparison[]> {
  // 1. Metadata: assert data.guide_count=12, data.species_count=494
  const metadataCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/metadata",
    "LCSCG — service metadata (data.guide_count=12, data.species_count=494)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const guideCount = typeof data?.guide_count === "number" ? data.guide_count : -1;
      if (guideCount === 12) {
        findings.push({ type: "ok", sourceField: "data.guide_count", note: `guide_count = 12 (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.guide_count", note: `Expected guide_count=12, got ${guideCount}` });
      }
      const speciesCount = typeof data?.species_count === "number" ? data.species_count : -1;
      if (speciesCount === 494) {
        findings.push({ type: "ok", sourceField: "data.species_count", note: `species_count = 494 (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species_count", note: `Expected species_count=494, got ${speciesCount}` });
      }
      return findings;
    },
  );

  // 2. Guides list: 12 guides, all known IDs and titles present, season+habitat fields present
  const guidesCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/guides",
    "LCSCG — guides list (12 guides, all IDs and titles verified)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const guides = (Array.isArray(data?.guides) ? data.guides : []) as Array<Record<string, unknown>>;
      if (guides.length === 12) {
        findings.push({ type: "ok", sourceField: "data.guides", note: `12 guides returned (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.guides", note: `Expected 12 guides, got ${guides.length}` });
        return findings;
      }
      // Verify each known guide is present with correct title and fields
      const guideMap = new Map(guides.map((g) => [g["guide_id"] as number, g]));
      for (const [id, expected] of Object.entries(LCSCG_KNOWN_GUIDES)) {
        const g = guideMap.get(Number(id));
        if (!g) {
          findings.push({ type: "mismatch", sourceField: `data.guides[${id}]`, note: `Guide ID ${id} (${expected.title}) not found` });
          continue;
        }
        if (g["title"] === expected.title) {
          findings.push({ type: "ok", sourceField: `data.guides[${id}].title`, note: `"${g["title"]}"` });
        } else {
          findings.push({ type: "mismatch", sourceField: `data.guides[${id}].title`, note: `Expected "${expected.title}", got "${g["title"]}"` });
        }
        if (g["season"] === expected.season) {
          findings.push({ type: "ok", sourceField: `data.guides[${id}].season`, note: `season="${expected.season}"` });
        } else {
          findings.push({ type: "mismatch", sourceField: `data.guides[${id}].season`, note: `Expected season="${expected.season}", got "${g["season"]}"` });
        }
      }
      return findings;
    },
  );

  // 3. Guide detail: guide 1282 (Fall Prairie Forbs, 60 species) contains Echinacea pallida and Daucus carota
  const guide1282Check = await checkEndpoint(
    "lcscg",
    "/api/lcscg/guide/1282",
    "LCSCG — guide detail ID 1282 (Fall Prairie Forbs, 60 species, Echinacea pallida + Daucus carota present)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned for guide 1282` });
        return findings;
      }
      const guide = data.guide as Record<string, unknown> | undefined;
      if (guide?.title === "Fall Prairie Forbs") {
        findings.push({ type: "ok", sourceField: "data.guide.title", note: `"Fall Prairie Forbs" (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.guide.title", note: `Expected "Fall Prairie Forbs", got "${guide?.title}"` });
      }
      const species = (Array.isArray(data.species) ? data.species : []) as Array<Record<string, unknown>>;
      if (species.length === 60) {
        findings.push({ type: "ok", sourceField: "data.species.length", note: `species.length = 60 (expected for guide 1282)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species.length", note: `Expected 60 species for guide 1282, got ${species.length}` });
      }
      const names = species.map((s) => s["scientific_name"] as string);
      for (const expected of ["Echinacea pallida", "Daucus carota"]) {
        if (names.includes(expected)) {
          findings.push({ type: "ok", sourceField: "data.species[].scientific_name", note: `"${expected}" present in guide 1282` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.species[].scientific_name", note: `"${expected}" expected in guide 1282 but not found` });
        }
      }
      // Verify Echinacea pallida has 3 non-null image_urls
      const echinacea = species.find((s) => s["scientific_name"] === "Echinacea pallida");
      if (echinacea) {
        const urls = Array.isArray(echinacea["image_urls"]) ? echinacea["image_urls"] as Array<string | null> : [];
        const nonNull = urls.filter((u) => u !== null && u !== "");
        if (nonNull.length === 3) {
          findings.push({ type: "ok", sourceField: "Echinacea pallida.image_urls", note: `3 non-null image URLs (expected)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "Echinacea pallida.image_urls", note: `Expected 3 image URLs, got ${nonNull.length} non-null` });
        }
      }
      return findings;
    },
  );

  // 4. Species search: Sporobolus heterolepis in Fall Grasses and Kin (guide 1280), 3 images
  const sporobolusCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/species?name=Sporobolus+heterolepis",
    "LCSCG — species search for Sporobolus heterolepis (guide 1280, 3 images)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const records = (Array.isArray(data?.records) ? data.records : []) as Array<Record<string, unknown>>;
      if (records.length > 0) {
        findings.push({ type: "ok", sourceField: "data.records", note: `${records.length} record(s) for "Sporobolus heterolepis"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.records", note: `No records for "Sporobolus heterolepis" — expected ≥1 from guide 1280` });
        return findings;
      }
      const spRecord = records.find((r) => r["guide_id"] === 1280);
      if (spRecord) {
        findings.push({ type: "ok", sourceField: "data.records[].guide_id", note: `Record in guide 1280 (Fall Grasses and Kin) — expected` });
        // family assertion
        const family = typeof spRecord["family"] === "string" ? spRecord["family"] : "";
        if (family === "Poaceae") {
          findings.push({ type: "ok", sourceField: "data.records[guide_1280].family", note: `family = "Poaceae" (expected for Sporobolus heterolepis)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.records[guide_1280].family", note: `Expected family "Poaceae", got "${family}"` });
        }
        // seed_group_names Shattering assertion
        const sgnRaw = spRecord["seed_group_names"];
        const sgn = Array.isArray(sgnRaw) ? (sgnRaw as string[]) : [];
        if (sgn.includes("Shattering")) {
          findings.push({ type: "ok", sourceField: "data.records[guide_1280].seed_group_names", note: `"Shattering" present in seed_group_names` });
        } else {
          findings.push({ type: "gap", sourceField: "data.records[guide_1280].seed_group_names", note: `"Shattering" absent from seed_group_names (${JSON.stringify(sgn)}) — expected for Prairie Dropseed` });
        }
        const urls = Array.isArray(spRecord["image_urls"]) ? spRecord["image_urls"] as Array<string | null> : [];
        const nonNull = urls.filter((u) => u !== null && u !== "");
        if (nonNull.length === 3) {
          findings.push({ type: "ok", sourceField: "data.records[guide_1280].image_urls", note: `3 non-null Cloudinary image URLs (expected)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.records[guide_1280].image_urls", note: `Expected 3 image URLs, got ${nonNull.length} non-null` });
        }
        if (typeof spRecord["description"] === "string" && spRecord["description"].length > 0) {
          findings.push({ type: "ok", sourceField: "data.records[guide_1280].description", note: `harvest description present` });
        } else {
          findings.push({ type: "gap", sourceField: "data.records[guide_1280].description", note: `harvest description missing` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.records[].guide_id", note: `No record for Sporobolus heterolepis in guide 1280` });
      }
      return findings;
    },
  );

  // 5. Species search: Daucus carota (non-native "Do Not Collect" species) — confirms non-native records are present
  const daucusCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/species?name=Daucus+carota",
    "LCSCG — species search Daucus carota (non-native Do Not Collect, guide 1282)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const records = (Array.isArray(data?.records) ? data.records : []) as Array<Record<string, unknown>>;
      if (records.length > 0) {
        findings.push({ type: "ok", sourceField: "data.records", note: `${records.length} record(s) for non-native "Daucus carota"` });
        const rec = records[0];
        const urls = Array.isArray(rec["image_urls"]) ? rec["image_urls"] as Array<string | null> : [];
        const nonNull = urls.filter((u) => u !== null && u !== "");
        if (nonNull.length > 0) {
          findings.push({ type: "ok", sourceField: "data.records[0].image_urls", note: `${nonNull.length} non-null image URL(s)` });
        } else {
          findings.push({ type: "gap", sourceField: "data.records[0].image_urls", note: `image_urls empty for Daucus carota` });
        }
        const groups = Array.isArray(rec["seed_group_names"]) ? rec["seed_group_names"] as string[] : [];
        if (groups.includes("Hitchhikers")) {
          findings.push({ type: "ok", sourceField: "data.records[0].seed_group_names", note: `"Hitchhikers" dispersal group confirmed (expected for wild carrot)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.records[0].seed_group_names", note: `Expected "Hitchhikers" dispersal group for Daucus carota, got: ${JSON.stringify(groups)}` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.records", note: `Daucus carota not found — expected in guide 1282 as Do Not Collect species` });
      }
      return findings;
    },
  );

  return [metadataCheck, guidesCheck, guide1282Check, sporobolusCheck, daucusCheck];
}

export async function runS2CChecks(
  fernsBase: string,
  years: number[] = [],
): Promise<EndpointComparison[]> {
  const yearsCheck = await checkEndpoint(
    "s2c",
    "/api/s2c/years",
    "Seeds to Community — available years list",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const available = data?.available_years as number[] | undefined;
      const yearsObjs = data?.years as Array<{ year: number }> | undefined;
      const yearNums = available ?? yearsObjs?.map((y) => y.year) ?? [];
      if (yearNums.length > 0) {
        findings.push({
          type: "ok",
          sourceField: "data.available_years",
          note: `${yearNums.length} years available: ${yearNums.join(", ")}`,
        });
        for (const expectedYear of years) {
          if (yearNums.includes(expectedYear)) {
            findings.push({ type: "ok", sourceField: `data.available_years[${expectedYear}]`, note: `Year ${expectedYear} is present` });
          } else {
            findings.push({ type: "gap", sourceField: `data.available_years[${expectedYear}]`, note: `Year ${expectedYear} expected in corpus but not found in /years response` });
          }
        }
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.available_years",
          note: `data.available_years missing or empty`,
        });
      }
      return findings;
    },
  );

  const speciesChecks = await Promise.all(
    years.map((year) =>
      checkEndpoint(
        "s2c",
        `/api/s2c?year=${year}`,
        `Seeds to Community — species list for ${year}`,
        fernsBase,
        (envelope) => {
          const findings: FieldFinding[] = [];
          const data = envelope.data as Record<string, unknown> | null | undefined;
          const speciesList = (data?.species ?? data?.species_list) as unknown[] | undefined;
          if (speciesList && speciesList.length > 0) {
            findings.push({
              type: "ok",
              sourceField: "data.species",
              note: `${speciesList.length} species returned for ${year}`,
            });
          } else {
            findings.push({
              type: "mismatch",
              sourceField: "data.species",
              note: `data.species missing or empty for year=${year}`,
            });
          }
          return findings;
        },
      ),
    ),
  );

  const speciesInfoCheck = await checkEndpoint(
    "s2c",
    "/api/seeds-to-community-washtenaw/species-information?species=Aquilegia+canadensis",
    "Seeds to Community — species information (Aquilegia canadensis)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      if (envelope.found !== true) {
        findings.push({
          type: "mismatch",
          sourceField: "found",
          note: `Expected found=true for Aquilegia canadensis, got ${envelope.found}`,
        });
        return findings;
      }
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (data && typeof data["botanical_name"] === "string" && data["botanical_name"].length > 0) {
        findings.push({ type: "ok", sourceField: "data.botanical_name", note: `botanical_name present: "${data["botanical_name"]}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.botanical_name", note: `data.botanical_name missing or empty` });
      }
      const prov = envelope.provenance as Record<string, unknown> | null | undefined;
      if (prov?.source_id === "seeds-to-community-washtenaw") {
        findings.push({ type: "ok", sourceField: "provenance.source_id", note: `source_id = "seeds-to-community-washtenaw" (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance.source_id", note: `Expected "seeds-to-community-washtenaw", got "${prov?.source_id}"` });
      }
      if (prov?.method === "cache_hit") {
        findings.push({ type: "ok", sourceField: "provenance.method", note: `method = "cache_hit" (expected for in-memory source)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance.method", note: `Expected method="cache_hit", got "${prov?.method}"` });
      }
      return findings;
    },
  );

  return [yearsCheck, ...speciesChecks, speciesInfoCheck];
}

export async function runMnfiChecks(fernsBase: string): Promise<EndpointComparison[]> {
  // Known test species: Cirsium pitcheri (Pitcher's thistle, federally threatened).
  // Confirmed present in both community rare-species lists and county-species data.
  const KNOWN_SPECIES = "Cirsium pitcheri";

  // 1. Metadata: assert community_count=77, county_count=83, community_classes present
  const metadataCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/metadata",
    "MNFI — service metadata (community_count=77, county_count=83, community_classes present)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const communityCount = typeof data?.community_count === "number" ? data.community_count : -1;
      if (communityCount === 77) {
        findings.push({ type: "ok", sourceField: "data.community_count", note: `community_count = 77 (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.community_count",
          note: `Expected community_count=77, got ${communityCount}`,
        });
      }
      const countyCount = typeof data?.county_count === "number" ? data.county_count : -1;
      if (countyCount === 83) {
        findings.push({ type: "ok", sourceField: "data.county_count", note: `county_count = 83 (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.county_count",
          note: `Expected county_count=83, got ${countyCount}`,
        });
      }
      const classes = data?.community_classes;
      if (Array.isArray(classes) && classes.length > 0) {
        findings.push({ type: "ok", sourceField: "data.community_classes", note: `${classes.length} ecological class entries present` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.community_classes",
          note: `Expected community_classes array, got ${Array.isArray(classes) ? "empty array" : "non-array"}`,
        });
      }
      return findings;
    },
  );

  // 2. Communities list: Array.isArray(data.communities); length === 77
  const communitiesCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/communities",
    "MNFI — communities list (Array.isArray(data.communities); length === 77)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!Array.isArray(data?.communities)) {
        findings.push({ type: "mismatch", sourceField: "data.communities", note: `data.communities is not an array` });
        return findings;
      }
      const communities = data.communities as Array<Record<string, unknown>>;
      if (communities.length === 77) {
        findings.push({ type: "ok", sourceField: "data.communities.length", note: `77 communities returned (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.communities.length",
          note: `Expected 77 communities, got ${communities.length}`,
        });
      }
      const classes = new Set(communities.map((c) => c["communityClass"] as string));
      const expectedClasses = ["Palustrine", "Palustrine/Terrestrial", "Primary", "Subterranean/Sink", "Terrestrial"];
      for (const cls of expectedClasses) {
        if (classes.has(cls)) {
          findings.push({ type: "ok", sourceField: `communityClass[${cls}]`, note: `Class "${cls}" is present` });
        } else {
          findings.push({ type: "gap", sourceField: `communityClass[${cls}]`, note: `Class "${cls}" not found in communities list` });
        }
      }
      return findings;
    },
  );

  // 3. Community by slug: prairie-fen — found=true; data.slug is string; data.sections is array; data.characteristicPlants is array
  const prairieFeCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/communities/prairie-fen",
    "MNFI — community detail 'prairie-fen' (found=true; slug string; sections array; characteristicPlants array)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      if (envelope.found !== true) {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=true for prairie-fen, got ${envelope.found}` });
        return findings;
      }
      findings.push({ type: "ok", sourceField: "found", note: `found=true` });
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned for slug 'prairie-fen'` });
        return findings;
      }
      if (typeof data["slug"] === "string") {
        findings.push({ type: "ok", sourceField: "data.slug", note: `slug="${data["slug"]}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.slug", note: `data.slug is not a string: ${JSON.stringify(data["slug"])}` });
      }
      if (Array.isArray(data["sections"])) {
        findings.push({ type: "ok", sourceField: "data.sections", note: `sections is array (${(data["sections"] as unknown[]).length} entries)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.sections", note: `data.sections is not an array` });
      }
      if (Array.isArray(data["characteristicPlants"])) {
        findings.push({ type: "ok", sourceField: "data.characteristicPlants", note: `characteristicPlants is array (${(data["characteristicPlants"] as unknown[]).length} entries)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.characteristicPlants", note: `data.characteristicPlants is not an array` });
      }
      return findings;
    },
  );

  // 4. Species list: Array.isArray(data.species); data.species.length <= 10; pagination.total > 0
  const speciesListCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/species?kind=plant&limit=10",
    "MNFI — species list kind=plant&limit=10 (Array.isArray; length<=10; pagination.total>0)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!Array.isArray(data?.species)) {
        findings.push({ type: "mismatch", sourceField: "data.species", note: `data.species is not an array` });
      } else {
        const species = data.species as unknown[];
        findings.push({ type: "ok", sourceField: "data.species", note: `data.species is array` });
        if (species.length <= 10) {
          findings.push({ type: "ok", sourceField: "data.species.length", note: `length=${species.length} (<=10, limit respected)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.species.length", note: `Expected <=10, got ${species.length}` });
        }
      }
      const pagination = envelope.pagination as Record<string, unknown> | null | undefined;
      const total = typeof pagination?.total === "number" ? pagination.total : 0;
      if (total > 0) {
        findings.push({ type: "ok", sourceField: "pagination.total", note: `pagination.total=${total} (>0)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "pagination.total", note: `Expected pagination.total>0, got ${total}` });
      }
      return findings;
    },
  );

  // 5. Species single: Cirsium pitcheri — found=true; data.scientificName present; data.kind === "plant"|"animal"
  const speciesSingleCheck = await checkEndpoint(
    "mnfi",
    `/api/mnfi/species/${encodeURIComponent(KNOWN_SPECIES)}`,
    `MNFI — species single '${KNOWN_SPECIES}' (found=true; scientificName present; kind plant|animal)`,
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      if (envelope.found !== true) {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=true for ${KNOWN_SPECIES}, got ${envelope.found}` });
        return findings;
      }
      findings.push({ type: "ok", sourceField: "found", note: `found=true` });
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned` });
        return findings;
      }
      if (typeof data["scientificName"] === "string" && data["scientificName"].length > 0) {
        findings.push({ type: "ok", sourceField: "data.scientificName", note: `scientificName="${data["scientificName"]}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.scientificName", note: `data.scientificName missing or empty` });
      }
      if (data["kind"] === "plant" || data["kind"] === "animal") {
        findings.push({ type: "ok", sourceField: "data.kind", note: `kind="${data["kind"]}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.kind", note: `Expected kind "plant" or "animal", got ${JSON.stringify(data["kind"])}` });
      }
      return findings;
    },
  );

  // 6. Species communities: Array.isArray(data.communities)
  const speciesCommunitiesCheck = await checkEndpoint(
    "mnfi",
    `/api/mnfi/species/${encodeURIComponent(KNOWN_SPECIES)}/communities`,
    `MNFI — species communities for '${KNOWN_SPECIES}' (Array.isArray(data.communities))`,
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (Array.isArray(data?.communities)) {
        findings.push({ type: "ok", sourceField: "data.communities", note: `data.communities is array (${(data.communities as unknown[]).length} entries)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.communities", note: `data.communities is not an array` });
      }
      return findings;
    },
  );

  // 7. Species counties: Array.isArray(data.counties)
  const speciesCountiesCheck = await checkEndpoint(
    "mnfi",
    `/api/mnfi/species/${encodeURIComponent(KNOWN_SPECIES)}/counties`,
    `MNFI — species counties for '${KNOWN_SPECIES}' (Array.isArray(data.counties))`,
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (Array.isArray(data?.counties)) {
        findings.push({ type: "ok", sourceField: "data.counties", note: `data.counties is array (${(data.counties as unknown[]).length} entries)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.counties", note: `data.counties is not an array` });
      }
      return findings;
    },
  );

  // 8. Counties list: Array.isArray(data.counties); length === 83
  const countiesListCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/counties",
    "MNFI — counties list (Array.isArray(data.counties); length === 83)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!Array.isArray(data?.counties)) {
        findings.push({ type: "mismatch", sourceField: "data.counties", note: `data.counties is not an array` });
        return findings;
      }
      const counties = data.counties as unknown[];
      findings.push({ type: "ok", sourceField: "data.counties", note: `data.counties is array` });
      if (counties.length === 83) {
        findings.push({ type: "ok", sourceField: "data.counties.length", note: `83 counties returned (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.counties.length", note: `Expected 83 counties, got ${counties.length}` });
      }
      return findings;
    },
  );

  // 9. County Washtenaw: found=true; Array.isArray(data.species); data.species.length > 0; Array.isArray(data.communities)
  const countyWashtenawCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/counties/Washtenaw",
    "MNFI — county Washtenaw (found=true; species array non-empty; communities array)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      if (envelope.found !== true) {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=true for Washtenaw, got ${envelope.found}` });
        return findings;
      }
      findings.push({ type: "ok", sourceField: "found", note: `found=true` });
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned for Washtenaw` });
        return findings;
      }
      if (Array.isArray(data["species"])) {
        const speciesArr = data["species"] as unknown[];
        if (speciesArr.length > 0) {
          findings.push({ type: "ok", sourceField: "data.species", note: `data.species is array with ${speciesArr.length} entries (>0)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.species", note: `data.species is empty — expected records for Washtenaw` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species", note: `data.species is not an array` });
      }
      if (Array.isArray(data["communities"])) {
        findings.push({ type: "ok", sourceField: "data.communities", note: `data.communities is array (${(data["communities"] as unknown[]).length} entries)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.communities", note: `data.communities is not an array` });
      }
      return findings;
    },
  );

  return [
    metadataCheck,
    communitiesCheck,
    prairieFeCheck,
    speciesListCheck,
    speciesSingleCheck,
    speciesCommunitiesCheck,
    speciesCountiesCheck,
    countiesListCheck,
    countyWashtenawCheck,
  ];
}

export async function runNatureserveChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const metadataCheck = await checkEndpoint(
    "natureserve",
    "/api/natureserve/metadata",
    "NatureServe — service metadata (licenses, attribution, cache_stats)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const ec = envelope as Record<string, unknown>;
      if (Array.isArray(ec.licenses) && ec.licenses.length > 0) {
        findings.push({ type: "ok", sourceField: "licenses", note: `licenses=${JSON.stringify(ec.licenses)}` });
      } else if (Array.isArray(ec.licenses)) {
        findings.push({ type: "ok", sourceField: "licenses", note: "licenses=[] (not yet characterized)" });
      } else {
        findings.push({ type: "mismatch", sourceField: "licenses", note: `licenses field missing or wrong type` });
      }
      const attr = ec.attribution as Record<string, unknown> | null | undefined;
      if (attr && attr.source_name) {
        findings.push({ type: "ok", sourceField: "attribution.source_name", note: `${attr.source_name}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "attribution", note: "attribution block missing" });
      }
      const cs = ec.cache_stats as Record<string, unknown> | null | undefined;
      if (cs && typeof cs.ttl_days === "object" && cs.ttl_days !== null) {
        const ttl = cs.ttl_days as Record<string, unknown>;
        findings.push({ type: "ok", sourceField: "cache_stats.ttl_days", note: `ttl_days.species=${ttl.species}, ttl_days.ecosystems=${ttl.ecosystems}` });
      } else if (cs) {
        findings.push({ type: "gap", sourceField: "cache_stats.ttl_days", note: `ttl_days missing or wrong type (expected object {species, ecosystems})` });
      } else {
        findings.push({ type: "gap", sourceField: "cache_stats", note: "cache_stats block missing or malformed" });
      }
      return findings;
    },
  );

  // Verbatim upstream shape: { resultsSummary: object, results: array }
  // Per task #305: data no longer contains flat-struct fields (scientific_name, global_rank, etc.)
  const speciesCheck = await checkEndpoint(
    "natureserve",
    "/api/natureserve/speciesSearch?name=Platanthera+leucophaea",
    "NatureServe — speciesSearch (Platanthera leucophaea): verbatim upstream shape",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data || typeof data !== "object") {
        findings.push({ type: "mismatch", sourceField: "data", note: `data must be a non-null object; got ${data === null ? "null" : typeof data}` });
        return findings;
      }
      if (!Array.isArray(data.results)) {
        findings.push({ type: "mismatch", sourceField: "data.results", note: `data.results must be an array (verbatim upstream); got ${typeof data.results}` });
      } else {
        findings.push({ type: "ok", sourceField: "data.results", note: `data.results is array with ${(data.results as unknown[]).length} item(s)` });
      }
      if (data.resultsSummary && typeof data.resultsSummary === "object") {
        const summary = data.resultsSummary as Record<string, unknown>;
        findings.push({ type: "ok", sourceField: "data.resultsSummary", note: `data.resultsSummary present (totalResults=${summary.totalResults ?? "n/a"})` });
      } else {
        findings.push({ type: "gap", sourceField: "data.resultsSummary", note: "data.resultsSummary missing or wrong type" });
      }
      if (Array.isArray(data.results) && (data.results as unknown[]).length > 0) {
        const first = (data.results as Record<string, unknown>[])[0];
        const uid = first.uniqueId ?? first.elementGlobalId;
        if (uid) {
          findings.push({ type: "ok", sourceField: "data.results[0].uniqueId", note: `uniqueId=${String(uid)}` });
        } else {
          findings.push({ type: "gap", sourceField: "data.results[0].uniqueId", note: "uniqueId/elementGlobalId absent from first result" });
        }
      }
      return findings;
    },
  );

  // Verbatim upstream shape: { resultsSummary: object, results: array }
  // Per task #305: data.ecosystems, data.result_count, and data.cache_status are removed (were FERNS wrappers)
  const ecosystemSearchCheck = await checkEndpoint(
    "natureserve",
    "/api/natureserve/search?q=oak+savanna&recordType=ECOSYSTEM&limit=5",
    "NatureServe — search (oak savanna, ECOSYSTEM): verbatim upstream shape",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const ec = envelope as Record<string, unknown>;
      if (typeof ec.found === "boolean") {
        findings.push({ type: "ok", sourceField: "found", note: `found=${ec.found}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "found", note: "found field missing" });
        return findings;
      }
      const data = ec.data as Record<string, unknown> | null | undefined;
      if (!data || typeof data !== "object") {
        findings.push({ type: "mismatch", sourceField: "data", note: `data must be a non-null object; got ${data === null ? "null" : typeof data}` });
        return findings;
      }
      if (!Array.isArray(data.results)) {
        findings.push({ type: "mismatch", sourceField: "data.results", note: `data.results must be an array (verbatim upstream); got ${typeof data.results}` });
      } else {
        findings.push({ type: "ok", sourceField: "data.results", note: `data.results is array with ${(data.results as unknown[]).length} item(s)` });
      }
      if (data.resultsSummary && typeof data.resultsSummary === "object") {
        const summary = data.resultsSummary as Record<string, unknown>;
        findings.push({ type: "ok", sourceField: "data.resultsSummary", note: `data.resultsSummary present (totalResults=${summary.totalResults ?? "n/a"})` });
      } else {
        findings.push({ type: "gap", sourceField: "data.resultsSummary", note: "data.resultsSummary missing or wrong type" });
      }
      if (Array.isArray(data.results) && (data.results as unknown[]).length > 0) {
        const first = (data.results as Record<string, unknown>[])[0];
        const uid = first.uniqueId ?? first.elementGlobalId;
        if (uid) {
          findings.push({ type: "ok", sourceField: "data.results[0].uniqueId", note: `uniqueId=${String(uid)}` });
        } else {
          findings.push({ type: "gap", sourceField: "data.results[0].uniqueId", note: "uniqueId/elementGlobalId absent from first result" });
        }
      } else if (Array.isArray(data.results)) {
        findings.push({ type: "gap", sourceField: "data.results[0]", note: "No results for 'oak savanna' — may be upstream API change" });
      }
      return findings;
    },
  );

  return [metadataCheck, speciesCheck, ecosystemSearchCheck];
}

// ─── Botanical URL-Lookup Health Checks ───────────────────────────────────────
// Tests the /url endpoint for each of the five botanical reference sources that
// take a species-name parameter (Go Botany, Illinois Wildflowers, Minnesota
// Wildflowers, Missouri Plants, Prairie Moon). Lady Bird Johnson uses
// /url?usda_symbol= and is covered separately in runLbjChecks.
// Uses Asclepias tuberosa — a common native wildflower present on all five sites.
// Verifies: found (bool), and when found=true: data.url (string, all except IL)
// or data.results[0].url + data.results[0].section (IL multi-section format).

export async function runBotanicalUrlChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_SPECIES_NAME = "Asclepias tuberosa";
  const encodedSpecies = encodeURIComponent(TEST_SPECIES_NAME);

  function standardUrlChecks(source: string) {
    return (envelope: Record<string, unknown>): FieldFinding[] => {
      const findings: FieldFinding[] = [];
      if (typeof envelope.found === "boolean") {
        findings.push({ type: "ok", sourceField: "found", note: `found=${envelope.found}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "found", note: "found field missing or not boolean" });
      }
      if (envelope.found === true) {
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (data && typeof data.url === "string" && data.url.startsWith("http")) {
          findings.push({ type: "ok", sourceField: "data.url", note: `url=${data.url}` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.url", note: `data.url missing or not a URL: ${data?.url}` });
        }
      } else {
        findings.push({ type: "ok", sourceField: "data.url", note: `found=false on ${source} — url check skipped` });
      }
      const prov = envelope.provenance as Record<string, unknown> | null | undefined;
      if (prov && prov.source_id) {
        findings.push({ type: "ok", sourceField: "provenance.source_id", note: `${prov.source_id}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance", note: "provenance.source_id missing" });
      }
      return findings;
    };
  }

  function illinoisUrlChecks(envelope: Record<string, unknown>): FieldFinding[] {
    const findings: FieldFinding[] = [];
    if (typeof envelope.found === "boolean") {
      findings.push({ type: "ok", sourceField: "found", note: `found=${envelope.found}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "found", note: "found field missing or not boolean" });
    }
    if (envelope.found === true) {
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const results = data?.results;
      if (Array.isArray(results) && results.length > 0) {
        const first = results[0] as Record<string, unknown>;
        if (typeof first.url === "string" && first.url.startsWith("http")) {
          findings.push({ type: "ok", sourceField: "data.results[0].url", note: `url=${first.url}` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.results[0].url", note: `url missing or not a URL: ${first.url}` });
        }
        if (typeof first.section === "string" && first.section.length > 0) {
          findings.push({ type: "ok", sourceField: "data.results[0].section", note: `section=${first.section}` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.results[0].section", note: `section missing: ${first.section}` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.results", note: "data.results missing or empty when found=true" });
      }
    } else {
      findings.push({ type: "ok", sourceField: "data.results", note: "found=false on Illinois Wildflowers — results check skipped" });
    }
    const prov = envelope.provenance as Record<string, unknown> | null | undefined;
    if (prov && prov.source_id) {
      findings.push({ type: "ok", sourceField: "provenance.source_id", note: `${prov.source_id}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "provenance", note: "provenance.source_id missing" });
    }
    return findings;
  }

  const [gobotanyUrlCheck, illinoisUrlCheck, minnesotaUrlCheck, missouriUrlCheck, prairieMoonUrlCheck] = await Promise.all([
    checkEndpoint(
      "gobotany",
      `/api/gobotany/url?species=${encodedSpecies}`,
      `Go Botany — URL lookup (${TEST_SPECIES_NAME}: envelope contract, found, data.url)`,
      fernsBase,
      standardUrlChecks("Go Botany"),
    ),
    checkEndpoint(
      "illinois-wildflowers",
      `/api/illinois-wildflowers/url?species=${encodedSpecies}`,
      `Illinois Wildflowers — URL lookup (${TEST_SPECIES_NAME}: envelope contract, found, data.results[].url+section)`,
      fernsBase,
      illinoisUrlChecks,
    ),
    checkEndpoint(
      "minnesota-wildflowers",
      `/api/minnesota-wildflowers/url?species=${encodedSpecies}`,
      `Minnesota Wildflowers — URL lookup (${TEST_SPECIES_NAME}: envelope contract, found, data.url)`,
      fernsBase,
      standardUrlChecks("Minnesota Wildflowers"),
    ),
    checkEndpoint(
      "missouri-plants",
      `/api/missouri-plants/url?species=${encodedSpecies}`,
      `Missouri Plants — URL lookup (${TEST_SPECIES_NAME}: envelope contract, found, data.url)`,
      fernsBase,
      standardUrlChecks("Missouri Plants"),
    ),
    checkEndpoint(
      "prairie-moon",
      `/api/prairie-moon/url?species=${encodedSpecies}`,
      `Prairie Moon — URL lookup (${TEST_SPECIES_NAME}: envelope contract, found, data.url)`,
      fernsBase,
      standardUrlChecks("Prairie Moon"),
    ),
  ]);

  return [gobotanyUrlCheck, illinoisUrlCheck, minnesotaUrlCheck, missouriUrlCheck, prairieMoonUrlCheck];
}

// ─── Species-Text Health Checks ───────────────────────────────────────────────
// Tests the /species-information scraping endpoint for each of the five
// botanical reference sources that support it. Uses Asclepias tuberosa
// (butterfly milkweed) — a common, widely documented native wildflower present
// on all five sites. Verifies envelope contract: found, cache_status, sections,
// full_text. Does not assert on section content (site-specific).

export async function runSpeciesTextChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_SPECIES_NAME = "Asclepias tuberosa";
  const encodedSpecies = encodeURIComponent(TEST_SPECIES_NAME);

  function speciesTextChecks(source: string) {
    return (envelope: Record<string, unknown>): FieldFinding[] => {
      const findings: FieldFinding[] = [];
      // found field — checked by envelopeFindings; add source-specific note
      findings.push({
        type: "ok",
        sourceField: "found",
        note: `found=${envelope.found} (${source} species-text)`,
      });
      // cache_status is now in provenance (checked by envelopeFindings for presence).
      // Verify the value is a valid scraped-text cache status.
      const prov = envelope.provenance as Record<string, unknown> | null | undefined;
      const cacheStatus = prov?.cache_status as string | undefined;
      const validStatuses = ["hit", "miss", "bypass"];
      if (typeof cacheStatus === "string" && validStatuses.includes(cacheStatus)) {
        findings.push({ type: "ok", sourceField: "provenance.cache_status", note: `cache_status=${cacheStatus}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance.cache_status", note: `invalid scraped-text cache_status: ${cacheStatus}` });
      }
      // data.sections and data.full_text only required when found=true
      if (envelope.found === true) {
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (!data) {
          findings.push({ type: "mismatch", sourceField: "data", note: "data missing when found=true" });
          return findings;
        }
        // sections is Record<string, string> in envelope data (not an array)
        const sections = data.sections;
        if (sections && typeof sections === "object" && !Array.isArray(sections)) {
          const keys = Object.keys(sections as object);
          if (keys.length > 0) {
            findings.push({ type: "ok", sourceField: "data.sections", note: `${keys.length} section(s) returned` });
          } else {
            findings.push({ type: "gap", sourceField: "data.sections", note: `found=true but data.sections is empty — scraper may not have extracted any content` });
          }
        } else {
          findings.push({ type: "mismatch", sourceField: "data.sections", note: "data.sections missing or not an object" });
        }
        // full_text is the concatenated prose string
        if (typeof data.full_text === "string" && data.full_text.length > 0) {
          findings.push({ type: "ok", sourceField: "data.full_text", note: `full_text present (${data.full_text.length} chars)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.full_text", note: "data.full_text missing or empty when found=true" });
        }
      } else {
        findings.push({ type: "ok", sourceField: "data.sections", note: `species not found on ${source} — sections check skipped` });
      }
      return findings;
    };
  }

  const [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck] = await Promise.all([
    checkEndpoint(
      "gobotany",
      `/api/gobotany/species-information?species=${encodedSpecies}`,
      `Go Botany — species-information (${TEST_SPECIES_NAME}: envelope contract, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks("Go Botany"),
    ),
    checkEndpoint(
      "illinois-wildflowers",
      `/api/illinois-wildflowers/species-information?species=${encodedSpecies}`,
      `Illinois Wildflowers — species-information (${TEST_SPECIES_NAME}: envelope contract, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks("Illinois Wildflowers"),
    ),
    checkEndpoint(
      "minnesota-wildflowers",
      `/api/minnesota-wildflowers/species-information?species=${encodedSpecies}`,
      `Minnesota Wildflowers — species-information (${TEST_SPECIES_NAME}: envelope contract, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks("Minnesota Wildflowers"),
    ),
    checkEndpoint(
      "missouri-plants",
      `/api/missouri-plants/species-information?species=${encodedSpecies}`,
      `Missouri Plants — species-information (${TEST_SPECIES_NAME}: envelope contract, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks("Missouri Plants"),
    ),
    checkEndpoint(
      "prairie-moon",
      `/api/prairie-moon/species-information?species=${encodedSpecies}`,
      `Prairie Moon — species-information (${TEST_SPECIES_NAME}: envelope contract, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks("Prairie Moon"),
    ),
  ]);

  return [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck];
}

// ─── Lady Bird Johnson Wildflower Center Health Checks ────────────────────────
// Tests the /lady-bird-johnson (URL verify) and /lady-bird-johnson/species-text
// endpoints. Uses Asclepias tuberosa — USDA symbol ASTU — as the test species.
// Verifies: envelope contract (found, status, profile_url, cache_hit),
// and species-text contract (found, cache_status, scraped_at, sections, provenance).
// Does not assert on text content (site-specific).

export async function runLbjChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_SYMBOL = "ASTU"; // Asclepias tuberosa
  const encodedSymbol = encodeURIComponent(TEST_SYMBOL);

  function urlVerifyChecks(envelope: Record<string, unknown>): FieldFinding[] {
    const findings: FieldFinding[] = [];
    // found
    if (typeof envelope.found === "boolean") {
      findings.push({ type: "ok", sourceField: "found", note: `found=${envelope.found}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "found", note: "found field missing or not boolean" });
    }
    const data = envelope.data as Record<string, unknown> | null | undefined;
    // data.profile_url present when found
    if (envelope.found === true) {
      if (data && typeof data.profile_url === "string" && data.profile_url.includes(TEST_SYMBOL)) {
        findings.push({ type: "ok", sourceField: "data.profile_url", note: `profile_url contains ${TEST_SYMBOL}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.profile_url", note: `profile_url missing or malformed: ${data?.profile_url}` });
      }
    } else {
      findings.push({ type: "ok", sourceField: "data.profile_url", note: `found=false — profile_url check skipped` });
    }
    // provenance
    const prov = envelope.provenance as Record<string, unknown> | null | undefined;
    if (prov && prov.source_id) {
      findings.push({ type: "ok", sourceField: "provenance.source_id", note: `${prov.source_id}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "provenance", note: "provenance.source_id missing" });
    }
    return findings;
  }

  function speciesTextChecks(envelope: Record<string, unknown>): FieldFinding[] {
    const findings: FieldFinding[] = [];
    // found
    if (typeof envelope.found === "boolean") {
      findings.push({ type: "ok", sourceField: "found", note: `found=${envelope.found}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "found", note: "found field missing or not boolean" });
    }
    // cache_status is in provenance per v1 envelope contract
    const prov = envelope.provenance as Record<string, unknown> | null | undefined;
    const cacheStatus = prov?.cache_status as string | undefined;
    const validStatuses = ["hit", "miss"];
    if (typeof cacheStatus === "string" && validStatuses.includes(cacheStatus)) {
      findings.push({ type: "ok", sourceField: "provenance.cache_status", note: `cache_status=${cacheStatus}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "provenance.cache_status", note: `cache_status missing or invalid: ${cacheStatus}` });
    }
    if (envelope.found === true) {
      // data.sections and data.full_text
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (data && data.sections && typeof data.sections === "object" && !Array.isArray(data.sections)) {
        const sectionKeys = Object.keys(data.sections as object);
        if (sectionKeys.length > 0) {
          findings.push({ type: "ok", sourceField: "data.sections", note: `${sectionKeys.length} section(s): ${sectionKeys.slice(0, 3).join(", ")}` });
        } else {
          findings.push({ type: "gap", sourceField: "data.sections", note: "found=true but sections object is empty — scraper may not have extracted content" });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.sections", note: "data.sections missing or not an object when found=true" });
      }
      if (data && typeof data.full_text === "string" && data.full_text.length > 0) {
        findings.push({ type: "ok", sourceField: "data.full_text", note: `full_text present (${data.full_text.length} chars)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.full_text", note: "data.full_text missing or empty when found=true" });
      }
    } else {
      findings.push({ type: "ok", sourceField: "data.sections", note: "species not found — sections check skipped" });
    }
    // provenance
    if (prov && prov.source_id) {
      findings.push({ type: "ok", sourceField: "provenance.source_id", note: `${prov.source_id}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "provenance", note: "provenance.source_id missing" });
    }
    return findings;
  }

  const [urlCheck, textCheck] = await Promise.all([
    checkEndpoint(
      "lady-bird-johnson",
      `/api/lady-bird-johnson/url?usda_symbol=${encodedSymbol}`,
      `Lady Bird Johnson — URL verify (${TEST_SYMBOL}: envelope, found, data.profile_url)`,
      fernsBase,
      urlVerifyChecks,
    ),
    checkEndpoint(
      "lady-bird-johnson",
      `/api/lady-bird-johnson/species-information?usda_symbol=${encodedSymbol}`,
      `Lady Bird Johnson — species-information (${TEST_SYMBOL}: envelope, cache_status, sections, full_text)`,
      fernsBase,
      speciesTextChecks,
    ),
  ]);

  return [urlCheck, textCheck];
}

// ─── Ann Arbor NPN Health Checks ─────────────────────────────────────────────
// Tests the metadata, species (by key + Latin + alias), bulk list, and names
// endpoints.
//
// Test corpus:
//   LOBSIP (Lobelia spicata) — primary test species; well-populated record
//   ASTCOR — secondary alias check (Aster cordifolius / Symphyotrichum cordifolium)
//   Expected bulk count: 130 species

export async function runNpnChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_ACRONYM = "LOBSIP";
  const TEST_LATIN = "Lobelia siphilitica";   // exact Latin name on Greg's site for LOBSIP
  const TEST_ALIAS = "astcor";               // lower-case alias (acronym-as-alias) for ASTCOR
  const EXPECTED_COUNT = 130;
  const encodedAcronym = encodeURIComponent(TEST_ACRONYM);
  const encodedLatin = encodeURIComponent(TEST_LATIN);
  const encodedAlias = encodeURIComponent(TEST_ALIAS);

  function makeSpeciesChecker(opts: {
    label: string;
    expectedAcronym?: string;
    expectedLatinName?: string;
    requireNonEmptyImages?: boolean;
  }) {
    return (envelope: Record<string, unknown>): FieldFinding[] => {
      const findings: FieldFinding[] = [];

      // found — boolean required
      if (typeof envelope.found !== "boolean") {
        findings.push({ type: "mismatch", sourceField: "found", note: "found field missing or not boolean" });
        return findings;
      }
      findings.push({ type: "ok", sourceField: "found", note: `found=${envelope.found}` });

      if (envelope.found !== true) {
        findings.push({ type: "gap", sourceField: "data", note: `found=false — not yet imported or key unrecognised [${opts.label}]` });
        return findings;
      }

      const data = envelope.data as Record<string, unknown> | null | undefined;

      // data.acronym — exact match
      if (data && typeof data.acronym === "string") {
        if (opts.expectedAcronym && data.acronym !== opts.expectedAcronym) {
          findings.push({ type: "mismatch", sourceField: "data.acronym", note: `known-value: expected "${opts.expectedAcronym}", got "${data.acronym}"` });
        } else {
          findings.push({ type: "ok", sourceField: "data.acronym", note: `acronym=${data.acronym}${opts.expectedAcronym ? " ✓" : ""}` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.acronym", note: `data.acronym missing or not string [${opts.label}]` });
      }

      // data.latin_name — exact match against expectedLatinName (case-insensitive)
      if (data && typeof data.latin_name === "string") {
        if (opts.expectedLatinName && data.latin_name.toLowerCase() !== opts.expectedLatinName.toLowerCase()) {
          findings.push({ type: "mismatch", sourceField: "data.latin_name", note: `known-value: expected "${opts.expectedLatinName}", got "${data.latin_name}"` });
        } else {
          findings.push({ type: "ok", sourceField: "data.latin_name", note: `latin_name="${data.latin_name}"${opts.expectedLatinName ? " ✓" : ""}` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.latin_name", note: `data.latin_name missing [${opts.label}]` });
      }

      // data.images — non-empty array required
      if (data && Array.isArray(data.images)) {
        const count = data.images.length;
        if (opts.requireNonEmptyImages && count === 0) {
          findings.push({ type: "mismatch", sourceField: "data.images", note: `images array is empty — expected at least one image for ${opts.label}` });
        } else {
          findings.push({ type: "ok", sourceField: "data.images", note: `${count} image(s)${count > 0 ? " ✓" : " (none yet)"}` });
        }
      } else {
        findings.push({ type: "gap", sourceField: "data.images", note: `data.images missing or not array [${opts.label}]` });
      }

      return findings;
    };
  }

  const [metaCheck, acronymCheck, latinCheck, aliasCheck, bulkCheck, namesCheck] = await Promise.all([
    checkEndpoint(
      "ann-arbor-npn",
      "/api/ann-arbor-npn/metadata",
      "Ann Arbor NPN — metadata endpoint (service_id, licenses)",
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        // service_id must be exactly "ann-arbor-npn"
        if (typeof envelope.service_id === "string" && envelope.service_id === "ann-arbor-npn") {
          findings.push({ type: "ok", sourceField: "service_id", note: `service_id="${envelope.service_id}" ✓` });
        } else {
          findings.push({ type: "mismatch", sourceField: "service_id", note: `expected "ann-arbor-npn", got "${envelope.service_id}"` });
        }
        // licenses — should be a string array
        if (Array.isArray(envelope.licenses) && envelope.licenses.length > 0) {
          findings.push({ type: "ok", sourceField: "licenses", note: `licenses=${JSON.stringify(envelope.licenses)}` });
        } else if (Array.isArray(envelope.licenses)) {
          findings.push({ type: "ok", sourceField: "licenses", note: "licenses=[] (not yet characterized)" });
        } else {
          findings.push({ type: "mismatch", sourceField: "licenses", note: "licenses field missing or wrong type" });
        }
        return findings;
      },
    ),

    checkEndpoint(
      "ann-arbor-npn",
      `/api/ann-arbor-npn/species/${encodedAcronym}`,
      `Ann Arbor NPN — species by acronym (${TEST_ACRONYM}): found=true, acronym="${TEST_ACRONYM}", latin_name="${TEST_LATIN}", non-empty images`,
      fernsBase,
      makeSpeciesChecker({
        label: `acronym:${TEST_ACRONYM}`,
        expectedAcronym: TEST_ACRONYM,
        expectedLatinName: TEST_LATIN,
        requireNonEmptyImages: true,
      }),
    ),

    checkEndpoint(
      "ann-arbor-npn",
      `/api/ann-arbor-npn/species/${encodedLatin}`,
      `Ann Arbor NPN — species by Latin name ("${TEST_LATIN}"): same record as acronymCheck`,
      fernsBase,
      makeSpeciesChecker({
        label: `latin:${TEST_LATIN}`,
        expectedAcronym: TEST_ACRONYM,
        expectedLatinName: TEST_LATIN,
        requireNonEmptyImages: true,
      }),
    ),

    checkEndpoint(
      "ann-arbor-npn",
      `/api/ann-arbor-npn/species/${encodedAlias}`,
      `Ann Arbor NPN — species by alias ("${TEST_ALIAS}"): resolves to ASTCOR (Aster/Symphyotrichum)`,
      fernsBase,
      (envelope) => {
        const findings = makeSpeciesChecker({ label: `alias:${TEST_ALIAS}` })(envelope);
        if (envelope.found === true) {
          const data = envelope.data as Record<string, unknown> | null | undefined;
          // acronym must be exactly ASTCOR
          if (data && typeof data.acronym === "string") {
            if (data.acronym.toUpperCase() === "ASTCOR") {
              findings.push({ type: "ok", sourceField: "data.acronym", note: `known-value: alias "${TEST_ALIAS}" → ASTCOR ✓` });
            } else {
              findings.push({ type: "mismatch", sourceField: "data.acronym", note: `known-value: expected ASTCOR, got "${data.acronym}"` });
            }
          }
          // latin_name must contain "Aster" or "Symphyotrichum"
          if (data && typeof data.latin_name === "string") {
            const l = data.latin_name.toLowerCase();
            if (l.includes("aster") || l.includes("symphyotrichum")) {
              findings.push({ type: "ok", sourceField: "data.latin_name", note: `known genus present in "${data.latin_name}" ✓` });
            } else {
              findings.push({ type: "mismatch", sourceField: "data.latin_name", note: `expected Aster or Symphyotrichum genus, got "${data.latin_name}"` });
            }
          }
        }
        return findings;
      },
    ),
    checkEndpoint(
      "ann-arbor-npn",
      "/api/ann-arbor-npn/species",
      `Ann Arbor NPN — bulk species list (expected count: ${EXPECTED_COUNT})`,
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (data && Array.isArray(data.species)) {
          findings.push({ type: "ok", sourceField: "data.species", note: `${data.species.length} species in list` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.species", note: "data.species not an array" });
        }
        return findings;
      },
    ),
    checkEndpoint(
      "ann-arbor-npn",
      "/api/ann-arbor-npn/names",
      `Ann Arbor NPN — names endpoint (count=${EXPECTED_COUNT}, common_names[], ASTCOR known-value)`,
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (!data || !Array.isArray(data.name_groups)) {
          findings.push({ type: "gap", sourceField: "data.name_groups", note: "data.name_groups missing or not an array (import may not have run yet)" });
          return findings;
        }

        const groups = data.name_groups as Array<Record<string, unknown>>;
        findings.push({ type: "ok", sourceField: "data.name_groups", note: `${groups.length} name groups` });

        // Count assertion: expect EXPECTED_COUNT groups when import is complete
        if (groups.length === 0) {
          findings.push({ type: "gap", sourceField: "data.name_groups.length", note: "0 name groups — import may not have run yet" });
        } else if (groups.length !== EXPECTED_COUNT) {
          findings.push({
            type: "mismatch",
            sourceField: "data.name_groups.length",
            note: `expected ${EXPECTED_COUNT} name groups, got ${groups.length} — database may be stale`,
          });
        } else {
          findings.push({ type: "ok", sourceField: "data.name_groups.length", note: `${groups.length} groups matches expected ${EXPECTED_COUNT} ✓` });
        }

        // Shape check on first group
        const sample = groups[0];
        if (sample) {
          if (Array.isArray(sample.all_accepted_keys)) {
            findings.push({ type: "ok", sourceField: "data.name_groups[0].all_accepted_keys", note: `${sample.all_accepted_keys.length} alias(es) in first group` });
          } else {
            findings.push({ type: "mismatch", sourceField: "data.name_groups[0].all_accepted_keys", note: "all_accepted_keys missing from first name group" });
          }
          if (Array.isArray(sample.common_names)) {
            findings.push({ type: "ok", sourceField: "data.name_groups[0].common_names", note: `common_names is string[] with ${sample.common_names.length} entry/entries ✓` });
          } else {
            findings.push({ type: "mismatch", sourceField: "data.name_groups[0].common_names", note: `common_names missing or not array — expected string[], got ${typeof sample.common_names}` });
          }
        }

        // Known-value: ASTCOR group must have "symphyotrichum cordifolium" in all_accepted_keys.
        // This verifies that Greg's Latin synonym is properly indexed as a searchable alias.
        // ASTCOR = Aster cordifolius; modern accepted name = Symphyotrichum cordifolium.
        if (groups.length > 0) {
          const astcorGroup = groups.find(
            (g) => typeof g.acronym === "string" && g.acronym.toUpperCase() === "ASTCOR",
          );
          if (!astcorGroup) {
            findings.push({ type: "gap", sourceField: "ASTCOR name group", note: "ASTCOR not found in name groups — import may not have run yet" });
          } else {
            const keys = Array.isArray(astcorGroup.all_accepted_keys)
              ? (astcorGroup.all_accepted_keys as string[])
              : [];
            const hasSymphyotrichum = keys.some((k) =>
              k.toLowerCase() === "symphyotrichum cordifolium",
            );
            if (hasSymphyotrichum) {
              findings.push({ type: "ok", sourceField: "ASTCOR.all_accepted_keys", note: `"symphyotrichum cordifolium" present in ASTCOR aliases ✓` });
            } else {
              findings.push({
                type: "mismatch",
                sourceField: "ASTCOR.all_accepted_keys",
                note: `known-value: exact key "symphyotrichum cordifolium" not found in ASTCOR aliases. Actual keys: [${keys.join(", ")}]. Verify that latin_synonym_greg for ASTCOR is "Symphyotrichum cordifolium".`,
              });
            }
          }
        }

        return findings;
      },
    ),
  ]);

  return [metaCheck, acronymCheck, latinCheck, aliasCheck, bulkCheck, namesCheck];
}

export async function runGoogleImagesChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_SPECIES_NAME = "Acer rubrum";
  const encoded = encodeURIComponent(TEST_SPECIES_NAME);
  const expectedUrl = `https://www.google.com/search?tbm=isch&q=${encoded}`;

  // 1. Happy path: valid species param returns correct envelope with expected URL shape
  const happyCheck = await checkEndpoint(
    "google-images",
    `/api/google-images/search?species=${encoded}`,
    `Google Images — happy path (Acer rubrum → correct URL shape, found=true)`,
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      if (envelope.found !== true) {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=true, got ${envelope.found}` });
        return findings;
      }
      findings.push({ type: "ok", sourceField: "found", note: `found=true ✓` });

      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `data is null or missing` });
        return findings;
      }

      const url = typeof data["url"] === "string" ? data["url"] : null;
      if (url && url.startsWith("https://www.google.com/search?tbm=isch&q=")) {
        findings.push({ type: "ok", sourceField: "data.url", note: `url starts with expected Google Images prefix ✓` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.url", note: `Expected URL starting with https://www.google.com/search?tbm=isch&q=, got: ${url}` });
      }

      if (url === expectedUrl) {
        findings.push({ type: "ok", sourceField: "data.url", note: `url exactly matches expected: ${expectedUrl} ✓` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.url", note: `url mismatch — expected ${expectedUrl}, got ${url}` });
      }

      const species = data["species"];
      if (species === TEST_SPECIES_NAME) {
        findings.push({ type: "ok", sourceField: "data.species", note: `data.species = "${species}" ✓` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species", note: `Expected data.species="${TEST_SPECIES_NAME}", got "${species}"` });
      }

      return findings;
    },
  );

  // 2. Error path: missing species param must return a valid FernsEnvelope (not raw JSON).
  // This permanently guards against regression of the envelope violation fixed in this task.
  const errorUrl = `${fernsBase}/api/google-images/search`;
  let errorCheck: EndpointComparison;
  try {
    const raw = await fetch(errorUrl);
    const body = await raw.json() as Record<string, unknown>;
    const urlsCollected = collectUrls(body, "google-images/no-species");
    const findings: FieldFinding[] = [];

    // The response must have been HTTP 400
    if (raw.status === 400) {
      findings.push({ type: "ok", sourceField: "(http)", note: `HTTP 400 (expected for missing species param)` });
    } else {
      findings.push({ type: "mismatch", sourceField: "(http)", note: `Expected HTTP 400 for missing species, got HTTP ${raw.status}` });
    }

    // The body must be a valid FernsEnvelope — not a raw { error, message } object
    if (body["found"] !== undefined) {
      findings.push({ type: "ok", sourceField: "found", note: `found field present — response is a FernsEnvelope ✓` });
    } else {
      findings.push({ type: "mismatch", sourceField: "found", note: `"found" field missing — response is raw JSON, not a FernsEnvelope (envelope violation)` });
    }

    if (body["provenance"] !== undefined) {
      findings.push({ type: "ok", sourceField: "provenance", note: `provenance present — envelope confirmed ✓` });
    } else {
      findings.push({ type: "mismatch", sourceField: "provenance", note: `provenance missing — not a valid FernsEnvelope` });
    }

    // The data field should preserve the human-readable error message
    const data = body["data"] as Record<string, unknown> | null | undefined;
    if (data && typeof data["message"] === "string" && data["message"].length > 0) {
      findings.push({ type: "ok", sourceField: "data.message", note: `human-readable error message present: "${data["message"]}"` });
    } else {
      findings.push({ type: "gap", sourceField: "data.message", note: `data.message missing from error envelope` });
    }

    const hasMismatch = findings.some((f) => f.type === "mismatch");
    errorCheck = {
      source: "google-images",
      endpoint: "/api/google-images/search (no species param)",
      label: "Google Images — error path (no species → valid FernsEnvelope with HTTP 400)",
      ok: !hasMismatch,
      rawFerns: body,
      findings,
      urlsCollected,
    };
  } catch (err) {
    errorCheck = {
      source: "google-images",
      endpoint: "/api/google-images/search (no species param)",
      label: "Google Images — error path (no species → valid FernsEnvelope with HTTP 400)",
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }

  // 3. Metadata endpoint
  const metaCheck = await checkEndpoint(
    "google-images",
    "/api/google-images/metadata",
    "Google Images — metadata endpoint (source_id, name, description present)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `metadata data is null` });
        return findings;
      }
      if (data["source_id"] === "google-images") {
        findings.push({ type: "ok", sourceField: "data.source_id", note: `source_id = "google-images" ✓` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.source_id", note: `Expected "google-images", got "${data["source_id"]}"` });
      }
      if (typeof data["name"] === "string" && data["name"].length > 0) {
        findings.push({ type: "ok", sourceField: "data.name", note: `name present: "${data["name"]}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.name", note: `data.name missing or empty` });
      }
      return findings;
    },
  );

  return [happyCheck, errorCheck, metaCheck];
}

// ─── Species-Information Smoke Test ───────────────────────────────────────────
// Smoke-tests the /species-information scraping endpoint for each of the five
// botanical reference sources that support it, using Asclepias syriaca (common
// milkweed) — chosen because it is broadly documented on all five sites and
// is distinct from the Asclepias tuberosa test in runSpeciesTextChecks.
//
// Note: the task specification listed these endpoints as
//   ?genus=Asclepias&species=syriaca
// but all five routes accept only the combined ?species= parameter
// (e.g. ?species=Asclepias+syriaca). The correct format is used below.
//
// Asserts per endpoint:
//   - HTTP 200
//   - found === true
//   - data.sections is a non-null object with ≥1 key
//   - data.full_text is a non-empty string
//   - provenance.source_id matches the expected source ID

export async function runSpeciesInfoSmokeTest(fernsBase: string): Promise<EndpointComparison[]> {
  const TEST_SPECIES_NAME = "Asclepias syriaca";
  const encodedSpecies = encodeURIComponent(TEST_SPECIES_NAME);

  function speciesInfoChecks(expectedSourceId: string) {
    return (envelope: Record<string, unknown>): FieldFinding[] => {
      const findings: FieldFinding[] = [];

      // found must be true for this species on all five sources
      if (envelope.found === true) {
        findings.push({ type: "ok", sourceField: "found", note: `found=true (${expectedSourceId})` });
      } else {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=true for ${TEST_SPECIES_NAME} on ${expectedSourceId}, got found=${envelope.found}` });
      }

      // provenance.source_id must match expected
      const prov = envelope.provenance as Record<string, unknown> | null | undefined;
      const sourceId = prov?.source_id;
      if (sourceId === expectedSourceId) {
        findings.push({ type: "ok", sourceField: "provenance.source_id", note: `source_id="${sourceId}" (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance.source_id", note: `Expected source_id="${expectedSourceId}", got "${sourceId}"` });
      }

      if (envelope.found === true) {
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (!data) {
          findings.push({ type: "mismatch", sourceField: "data", note: "data missing when found=true" });
          return findings;
        }

        // data.sections must be a non-null object with at least one key
        const sections = data.sections;
        if (sections && typeof sections === "object" && !Array.isArray(sections)) {
          const keys = Object.keys(sections as object);
          if (keys.length > 0) {
            findings.push({ type: "ok", sourceField: "data.sections", note: `${keys.length} section(s): ${keys.slice(0, 3).join(", ")}` });
          } else {
            findings.push({ type: "mismatch", sourceField: "data.sections", note: `found=true but data.sections is empty — scraper returned no sections for ${TEST_SPECIES_NAME}` });
          }
        } else {
          findings.push({ type: "mismatch", sourceField: "data.sections", note: "data.sections missing or not an object when found=true" });
        }

        // data.full_text must be a non-empty string
        if (typeof data.full_text === "string" && data.full_text.length > 0) {
          findings.push({ type: "ok", sourceField: "data.full_text", note: `full_text present (${data.full_text.length} chars)` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.full_text", note: `data.full_text missing or empty when found=true` });
        }

        // sections and full_text consistency: full_text length should be ≥ longest single section
        if (
          sections &&
          typeof sections === "object" &&
          !Array.isArray(sections) &&
          typeof data.full_text === "string" &&
          data.full_text.length > 0
        ) {
          const sectionValues = Object.values(sections as Record<string, unknown>).filter((v) => typeof v === "string") as string[];
          const longestSection = sectionValues.reduce((max, v) => Math.max(max, v.length), 0);
          if (data.full_text.length >= longestSection) {
            findings.push({ type: "ok", sourceField: "data.full_text/sections", note: `full_text (${data.full_text.length} chars) ≥ longest section (${longestSection} chars) — consistent` });
          } else {
            findings.push({ type: "mismatch", sourceField: "data.full_text/sections", note: `full_text (${data.full_text.length} chars) shorter than longest section (${longestSection} chars) — inconsistency` });
          }
        }
      }

      return findings;
    };
  }

  const [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck] = await Promise.all([
    checkEndpoint(
      "gobotany",
      `/api/gobotany/species-information?species=${encodedSpecies}`,
      `Go Botany — species-information smoke test (${TEST_SPECIES_NAME}: found=true, sections, full_text, source_id)`,
      fernsBase,
      speciesInfoChecks("gobotany"),
    ),
    checkEndpoint(
      "illinois-wildflowers",
      `/api/illinois-wildflowers/species-information?species=${encodedSpecies}`,
      `Illinois Wildflowers — species-information smoke test (${TEST_SPECIES_NAME}: found=true, sections, full_text, source_id)`,
      fernsBase,
      speciesInfoChecks("illinois-wildflowers"),
    ),
    checkEndpoint(
      "minnesota-wildflowers",
      `/api/minnesota-wildflowers/species-information?species=${encodedSpecies}`,
      `Minnesota Wildflowers — species-information smoke test (${TEST_SPECIES_NAME}: found=true, sections, full_text, source_id)`,
      fernsBase,
      speciesInfoChecks("minnesota-wildflowers"),
    ),
    checkEndpoint(
      "missouri-plants",
      `/api/missouri-plants/species-information?species=${encodedSpecies}`,
      `Missouri Plants — species-information smoke test (${TEST_SPECIES_NAME}: found=true, sections, full_text, source_id)`,
      fernsBase,
      speciesInfoChecks("missouri-plants"),
    ),
    checkEndpoint(
      "prairie-moon",
      `/api/prairie-moon/species-information?species=${encodedSpecies}`,
      `Prairie Moon — species-information smoke test (${TEST_SPECIES_NAME}: found=true, sections, full_text, source_id)`,
      fernsBase,
      speciesInfoChecks("prairie-moon"),
    ),
  ]);

  return [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck];
}

// ─── Species-Information Absent-Species Test ───────────────────────────────────
// Confirms that each of the five botanical species-information scrapers returns
// found=false (with data=null and no fetch error) when queried for a species
// that is confirmed absent from all five sites.
//
// Species chosen: Protea cynaroides (King Protea) — a Southern Hemisphere shrub
// endemic to South Africa.  None of the five North American regional botanical
// reference sites (Go Botany, Illinois Wildflowers, Minnesota Wildflowers,
// Missouri Plants, Prairie Moon) carry a page for this species, making it a
// reliable absent-species sentinel.
//
// Asserts per endpoint:
//   - HTTP 200 (scraper did not throw)
//   - found === false
//   - data === null
//   - envelope contract fields present (found, permission_granted, provenance)

export async function runSpeciesInfoAbsentTest(fernsBase: string): Promise<EndpointComparison[]> {
  const ABSENT_SPECIES_NAME = "Protea cynaroides";
  const encodedSpecies = encodeURIComponent(ABSENT_SPECIES_NAME);

  function absentSpeciesChecks(expectedSourceId: string) {
    return (envelope: Record<string, unknown>): FieldFinding[] => {
      const findings: FieldFinding[] = [];

      // found must be false — the species has no page on this source
      if (envelope.found === false) {
        findings.push({ type: "ok", sourceField: "found", note: `found=false for absent species on ${expectedSourceId} (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "found", note: `Expected found=false for ${ABSENT_SPECIES_NAME} on ${expectedSourceId}, got found=${envelope.found}` });
      }

      // data must be strictly null when the species is not found — undefined is
      // a contract violation (the field must be present and explicitly null)
      if (envelope.data === null) {
        findings.push({ type: "ok", sourceField: "data", note: `data=null when found=false (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data",
          note: envelope.data === undefined
            ? `data field absent when found=false on ${expectedSourceId} — must be explicitly null per envelope contract`
            : `Expected data=null when found=false on ${expectedSourceId}, got non-null data`,
        });
      }

      // provenance.source_id must still match expected — even for absent species
      const prov = envelope.provenance as Record<string, unknown> | null | undefined;
      const sourceId = prov?.source_id;
      if (sourceId === expectedSourceId) {
        findings.push({ type: "ok", sourceField: "provenance.source_id", note: `source_id="${sourceId}" (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "provenance.source_id", note: `Expected source_id="${expectedSourceId}", got "${sourceId}"` });
      }

      return findings;
    };
  }

  const [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck] = await Promise.all([
    checkEndpoint(
      "gobotany",
      `/api/gobotany/species-information?species=${encodedSpecies}`,
      `Go Botany — species-information absent-species test (${ABSENT_SPECIES_NAME}: found=false, data=null)`,
      fernsBase,
      absentSpeciesChecks("gobotany"),
    ),
    checkEndpoint(
      "illinois-wildflowers",
      `/api/illinois-wildflowers/species-information?species=${encodedSpecies}`,
      `Illinois Wildflowers — species-information absent-species test (${ABSENT_SPECIES_NAME}: found=false, data=null)`,
      fernsBase,
      absentSpeciesChecks("illinois-wildflowers"),
    ),
    checkEndpoint(
      "minnesota-wildflowers",
      `/api/minnesota-wildflowers/species-information?species=${encodedSpecies}`,
      `Minnesota Wildflowers — species-information absent-species test (${ABSENT_SPECIES_NAME}: found=false, data=null)`,
      fernsBase,
      absentSpeciesChecks("minnesota-wildflowers"),
    ),
    checkEndpoint(
      "missouri-plants",
      `/api/missouri-plants/species-information?species=${encodedSpecies}`,
      `Missouri Plants — species-information absent-species test (${ABSENT_SPECIES_NAME}: found=false, data=null)`,
      fernsBase,
      absentSpeciesChecks("missouri-plants"),
    ),
    checkEndpoint(
      "prairie-moon",
      `/api/prairie-moon/species-information?species=${encodedSpecies}`,
      `Prairie Moon — species-information absent-species test (${ABSENT_SPECIES_NAME}: found=false, data=null)`,
      fernsBase,
      absentSpeciesChecks("prairie-moon"),
    ),
  ]);

  return [gobotanyCheck, illinoisCheck, minnesotaCheck, missouriCheck, prairieMoonCheck];
}
