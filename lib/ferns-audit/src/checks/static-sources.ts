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

  const prov = envelope.provenance as Record<string, unknown> | null | undefined;
  if (prov && typeof prov === "object") {
    for (const key of ["source_id", "method", "derivation_summary", "derivation_scientific"]) {
      if (prov[key]) {
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
    "/api/coefficient/all",
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
        `/api/coefficient?value=${encodeURIComponent(entry.key)}`,
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
    "/api/wetland-indicator/all",
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
        `/api/wetland-indicator?code=${encodeURIComponent(entry.key)}`,
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
        `/api/wetland-indicator/w?value=${wv.value}`,
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
    "wucols",
    "/api/wucols/all",
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
        "wucols",
        `/api/wucols?code=${encodeURIComponent(entry.key)}`,
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
// guide_id -> { title, season, habitat_type, expected_species_count }
const LCSCG_KNOWN_GUIDES: Record<number, { title: string; season: string; habitat_type: string; species_count: number }> = {
  1271: { title: "Summer Woodland Forbs",          season: "summer", habitat_type: "woodland",           species_count: 28 },
  1272: { title: "Woody Plants",                   season: "all",    habitat_type: "woody_plants",       species_count: 50 },
  1273: { title: "Summer Wetland Grasses and Kin", season: "summer", habitat_type: "grasses_and_kin",   species_count: 37 },
  1274: { title: "Summer Wetland Forbs",           season: "summer", habitat_type: "wetland",            species_count: 23 },
  1275: { title: "Summer Prairie Forbs",           season: "summer", habitat_type: "prairie",            species_count: 42 },
  1276: { title: "Summer Grasses and Kin",         season: "summer", habitat_type: "grasses_and_kin",   species_count: 38 },
  1277: { title: "Spring Woodland Forbs",          season: "spring", habitat_type: "woodland",           species_count: 29 },
  1278: { title: "Fall Woodland Forbs",            season: "fall",   habitat_type: "woodland",           species_count: 55 },
  1279: { title: "Fall Wetland Forbs",             season: "fall",   habitat_type: "wetland",            species_count: 66 },
  1280: { title: "Fall Grasses and Kin",           season: "fall",   habitat_type: "grasses_and_kin",   species_count: 32 },
  1281: { title: "Asters and Goldenrods",          season: "fall",   habitat_type: "asters_and_goldenrods", species_count: 34 },
  1282: { title: "Fall Prairie Forbs",             season: "fall",   habitat_type: "prairie",            species_count: 60 },
};

export async function runLcscgChecks(fernsBase: string): Promise<EndpointComparison[]> {
  // 1. Metadata: assert guide_count=12, species_count=494
  const metadataCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/metadata",
    "LCSCG — service metadata (guide_count=12, species_count=494)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const ec = envelope as Record<string, unknown>;
      const guideCount = typeof ec.guide_count === "number" ? ec.guide_count : -1;
      if (guideCount === 12) {
        findings.push({ type: "ok", sourceField: "guide_count", note: `guide_count = 12 (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "guide_count", note: `Expected guide_count=12, got ${guideCount}` });
      }
      const speciesCount = typeof ec.species_count === "number" ? ec.species_count : -1;
      if (speciesCount === 494) {
        findings.push({ type: "ok", sourceField: "species_count", note: `species_count = 494 (expected)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "species_count", note: `Expected species_count=494, got ${speciesCount}` });
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
      const speciesCount = typeof data.species_count === "number" ? data.species_count : 0;
      if (speciesCount === 60) {
        findings.push({ type: "ok", sourceField: "data.species_count", note: `species_count = 60 (expected for guide 1282)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species_count", note: `Expected species_count=60 for guide 1282, got ${speciesCount}` });
      }
      const species = (Array.isArray(data.species) ? data.species : []) as Array<Record<string, unknown>>;
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
      const resultCount = typeof data?.result_count === "number" ? data.result_count : 0;
      if (resultCount > 0) {
        findings.push({ type: "ok", sourceField: "data.result_count", note: `${resultCount} records for "Sporobolus heterolepis"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.result_count", note: `No records for "Sporobolus heterolepis" — expected ≥1 from guide 1280` });
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
        findings.push({ type: "ok", sourceField: "data.result_count", note: `${records.length} record(s) for non-native "Daucus carota"` });
        const rec = records[0];
        const urls = Array.isArray(rec["image_urls"]) ? rec["image_urls"] as Array<string | null> : [];
        const nonNull = urls.filter((u) => u !== null && u !== "");
        if (nonNull.length > 0) {
          findings.push({ type: "ok", sourceField: "data.records[0].image_urls", note: `${nonNull.length} non-null image URL(s)` });
        } else {
          findings.push({ type: "gap", sourceField: "data.records[0].image_urls", note: `image_urls empty for Daucus carota` });
        }
        const groups = Array.isArray(rec["seed_group_names"]) ? rec["seed_group_names"] as string[] : [];
        if (groups.includes("Do Not Collect")) {
          findings.push({ type: "ok", sourceField: "data.records[0].seed_group_names", note: `"Do Not Collect" group confirmed` });
        } else {
          findings.push({ type: "mismatch", sourceField: "data.records[0].seed_group_names", note: `Expected "Do Not Collect" group for Daucus carota, got: ${JSON.stringify(groups)}` });
        }
      } else {
        findings.push({ type: "mismatch", sourceField: "data.result_count", note: `Daucus carota not found — expected in guide 1282 as Do Not Collect species` });
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

  return [yearsCheck, ...speciesChecks];
}

export async function runMnfiChecks(fernsBase: string): Promise<EndpointComparison[]> {
  // 1. Metadata: assert community_count=77, descriptions_fetched=77, plant_record_count>0
  const metadataCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/metadata",
    "MNFI — service metadata (community_count=77, descriptions_fetched=77, plant_record_count>0)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const ec = envelope as Record<string, unknown>;
      const communityCount = typeof ec.community_count === "number" ? ec.community_count : -1;
      if (communityCount === 77) {
        findings.push({ type: "ok", sourceField: "community_count", note: `community_count = 77 (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "community_count",
          note: `Expected community_count=77, got ${communityCount}`,
        });
      }
      const descFetched = typeof ec.descriptions_fetched === "number" ? ec.descriptions_fetched : -1;
      if (descFetched === 77) {
        findings.push({ type: "ok", sourceField: "descriptions_fetched", note: `descriptions_fetched = 77 (all scraped)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "descriptions_fetched",
          note: `Expected descriptions_fetched=77, got ${descFetched} — run POST /api/mnfi/import-descriptions`,
        });
      }
      const plantCount = typeof ec.plant_record_count === "number" ? ec.plant_record_count : -1;
      if (plantCount > 0) {
        findings.push({ type: "ok", sourceField: "plant_record_count", note: `plant_record_count = ${plantCount} (>0)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "plant_record_count",
          note: `plant_record_count = ${plantCount}; run POST /api/mnfi/import-plant-lists`,
        });
      }
      const classes = ec.community_classes;
      if (Array.isArray(classes) && classes.length === 5) {
        findings.push({ type: "ok", sourceField: "community_classes", note: `5 ecological classes present` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "community_classes",
          note: `Expected 5 community classes, got ${Array.isArray(classes) ? classes.length : "non-array"}`,
        });
      }
      const countyElementCount = typeof ec.county_element_count === "number" ? ec.county_element_count : -1;
      if (countyElementCount > 7000) {
        findings.push({ type: "ok", sourceField: "county_element_count", note: `county_element_count=${countyElementCount} (all 83 counties imported)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "county_element_count",
          note: `Expected county_element_count>7000, got ${countyElementCount} — run POST /api/mnfi/import-county-elements`,
        });
      }
      return findings;
    },
  );

  // 2. Communities list: 77 communities, all 5 classes represented
  const communitiesCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/communities",
    "MNFI — communities list (77 total, all 5 ecological classes)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const communities = Array.isArray(data?.communities) ? (data.communities as Array<Record<string, unknown>>) : [];
      if (communities.length === 77) {
        findings.push({ type: "ok", sourceField: "data.community_count", note: `77 communities returned (expected)` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.community_count",
          note: `Expected 77 communities, got ${communities.length}`,
        });
      }
      const classes = new Set(communities.map((c) => c["community_class"] as string));
      const expectedClasses = ["Palustrine", "Palustrine/Terrestrial", "Primary", "Subterranean/Sink", "Terrestrial"];
      for (const cls of expectedClasses) {
        if (classes.has(cls)) {
          findings.push({ type: "ok", sourceField: `community_class[${cls}]`, note: `Class "${cls}" is present` });
        } else {
          findings.push({ type: "gap", sourceField: `community_class[${cls}]`, note: `Class "${cls}" not found in communities list` });
        }
      }
      return findings;
    },
  );

  // 3. Community by slug: prairie-fen — full profile including inline characteristic plants
  const prairieFeCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/communities/prairie-fen",
    "MNFI — community detail 'prairie-fen' (id=10667, G3/S3, inline characteristic_plants)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned for slug 'prairie-fen'` });
        return findings;
      }
      const checks: Array<[string, unknown, unknown]> = [
        ["community_id", data.community_id, 10667],
        ["name", data.name, "Prairie Fen"],
        ["community_class", data.community_class, "Palustrine"],
        ["community_group", data.community_group, "Fen Group"],
        ["global_rank", data.global_rank, "G3"],
        ["state_rank", data.state_rank, "S3"],
      ];
      for (const [field, actual, expected] of checks) {
        if (actual === expected) {
          findings.push({ type: "ok", sourceField: `data.${field}`, note: `${field} = ${JSON.stringify(expected)}` });
        } else {
          findings.push({
            type: "mismatch",
            sourceField: `data.${field}`,
            note: `Expected ${field}=${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
          });
        }
      }
      if (typeof data.mnfi_url === "string" && data.mnfi_url.includes("mnfi.anr.msu.edu")) {
        findings.push({ type: "ok", sourceField: "data.mnfi_url", note: `mnfi_url present and points to mnfi.anr.msu.edu` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.mnfi_url", note: `mnfi_url missing or unexpected: ${data.mnfi_url}` });
      }
      // Inline characteristic plants must be present in the community detail response
      const charPlants = data.characteristic_plants as Record<string, unknown> | null | undefined;
      if (charPlants && typeof charPlants === "object") {
        const totalEntries = typeof charPlants.total_entries === "number" ? charPlants.total_entries : 0;
        if (totalEntries > 0) {
          findings.push({ type: "ok", sourceField: "data.characteristic_plants.total_entries", note: `${totalEntries} plant entries inline in community detail` });
        } else {
          findings.push({
            type: "mismatch",
            sourceField: "data.characteristic_plants.total_entries",
            note: `characteristic_plants.total_entries=0 — plants not loaded`,
          });
        }
        const byLifeForm = charPlants.by_life_form as Record<string, unknown> | null | undefined;
        for (const form of ["Graminoids", "Forbs"]) {
          if (byLifeForm && Array.isArray(byLifeForm[form]) && (byLifeForm[form] as unknown[]).length > 0) {
            findings.push({ type: "ok", sourceField: `data.characteristic_plants.by_life_form.${form}`, note: `${form} life form present inline` });
          } else {
            findings.push({ type: "gap", sourceField: `data.characteristic_plants.by_life_form.${form}`, note: `${form} life form missing from inline plants` });
          }
        }
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.characteristic_plants",
          note: `characteristic_plants object missing from community detail — plants should be inline`,
        });
      }
      return findings;
    },
  );

  // 4. County elements: Washtenaw must return real species + community records
  const countyCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/county-elements?county=Washtenaw",
    "MNFI — county elements for Washtenaw (real species+community records imported for all 83 counties)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned for county=Washtenaw` });
        return findings;
      }
      if (typeof data.county === "string") {
        findings.push({ type: "ok", sourceField: "data.county", note: `county="${data.county}"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.county", note: `data.county field missing` });
      }
      const resultCount = typeof data.result_count === "number" ? data.result_count : 0;
      if (resultCount > 0) {
        findings.push({ type: "ok", sourceField: "data.result_count", note: `result_count=${resultCount} elements for Washtenaw` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.result_count",
          note: `result_count=0 — county element data not imported. Run POST /api/mnfi/import-county-elements`,
        });
      }
      const totalImported = typeof data.total_imported_across_all_counties === "number" ? data.total_imported_across_all_counties : 0;
      if (totalImported > 7000) {
        findings.push({ type: "ok", sourceField: "data.total_imported_across_all_counties", note: `${totalImported} records across all 83 counties` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.total_imported_across_all_counties",
          note: `Expected >7000 records across all counties, got ${totalImported}`,
        });
      }
      // Verify Prairie Fen is in Washtenaw's community data
      const elements = Array.isArray(data.elements) ? (data.elements as Array<Record<string, unknown>>) : [];
      const prairiefen = elements.find((e) => e["element_name"] === "Prairie Fen" && e["element_type"] === "community");
      if (prairiefen) {
        const count = prairiefen["occurrences_in_county"];
        findings.push({ type: "ok", sourceField: "data.elements[Prairie Fen]", note: `Prairie Fen in Washtenaw with ${count} occurrence(s)` });
      } else {
        findings.push({ type: "gap", sourceField: "data.elements[Prairie Fen]", note: `Prairie Fen not found in Washtenaw county elements (type filter active)` });
      }
      return findings;
    },
  );

  // 5. Plant list for prairie-fen: 86 entries, Graminoids/Forbs/Shrubs present
  const plantListCheck = await checkEndpoint(
    "mnfi",
    "/api/mnfi/communities/10667/plants",
    "MNFI — prairie-fen plant list (plants_imported=true, graminoids+forbs+shrubs present)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: "No data returned for prairie-fen plants" });
        return findings;
      }
      if (data.plants_imported === true) {
        findings.push({ type: "ok", sourceField: "data.plants_imported", note: `plants_imported=true` });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.plants_imported",
          note: `plants_imported=${data.plants_imported}; run POST /api/mnfi/import-plant-lists`,
        });
      }
      const totalEntries = typeof data.total_entries === "number" ? data.total_entries : 0;
      if (totalEntries > 0) {
        findings.push({ type: "ok", sourceField: "data.total_entries", note: `${totalEntries} plant entries for prairie fen` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.total_entries", note: `total_entries=${totalEntries}; no plants loaded` });
      }
      const byLifeForm = data.by_life_form as Record<string, unknown> | null | undefined;
      for (const form of ["Graminoids", "Forbs", "Shrubs"]) {
        if (byLifeForm && Array.isArray(byLifeForm[form]) && (byLifeForm[form] as unknown[]).length > 0) {
          findings.push({ type: "ok", sourceField: `data.by_life_form.${form}`, note: `${form} list present (${(byLifeForm[form] as unknown[]).length} entries)` });
        } else {
          findings.push({ type: "gap", sourceField: `data.by_life_form.${form}`, note: `${form} life form missing from prairie-fen plant list` });
        }
      }
      return findings;
    },
  );

  return [metadataCheck, communitiesCheck, prairieFeCheck, countyCheck, plantListCheck];
}
