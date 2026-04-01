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

export async function runLcscgChecks(fernsBase: string): Promise<EndpointComparison[]> {
  const metadataCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/metadata",
    "LCSCG — service metadata",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const ec = envelope as Record<string, unknown>;
      if (typeof ec.guide_count === "number" && ec.guide_count > 0) {
        findings.push({ type: "ok", sourceField: "guide_count", note: `${ec.guide_count} guides` });
      } else {
        findings.push({ type: "mismatch", sourceField: "guide_count", note: `guide_count missing or 0` });
      }
      if (typeof ec.species_count === "number" && ec.species_count > 0) {
        findings.push({ type: "ok", sourceField: "species_count", note: `${ec.species_count} species` });
      } else {
        findings.push({ type: "mismatch", sourceField: "species_count", note: `species_count missing or 0` });
      }
      return findings;
    },
  );

  const guidesCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/guides",
    "LCSCG — guides list",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const guides = Array.isArray(data?.guides) ? data.guides : [];
      if (guides.length === 12) {
        findings.push({ type: "ok", sourceField: "data.guides", note: `12 guides returned (expected)` });
      } else if (guides.length > 0) {
        findings.push({ type: "mismatch", sourceField: "data.guides", note: `Expected 12 guides, got ${guides.length}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.guides", note: `No guides returned — import may not have run` });
      }
      return findings;
    },
  );

  const guideDetailCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/guide/1271",
    "LCSCG — guide detail (ID 1271, Summer Woodland Forbs)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      if (!data) {
        findings.push({ type: "mismatch", sourceField: "data", note: `No data returned — guide 1271 not found` });
        return findings;
      }
      const guide = data.guide as Record<string, unknown> | undefined;
      if (guide?.title) {
        findings.push({ type: "ok", sourceField: "data.guide.title", note: `Guide title: ${guide.title}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.guide.title", note: `Guide title missing` });
      }
      const speciesCount = typeof data.species_count === "number" ? data.species_count : 0;
      if (speciesCount > 0) {
        findings.push({ type: "ok", sourceField: "data.species_count", note: `${speciesCount} species in guide 1271` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.species_count", note: `No species in guide 1271 — import may not have run` });
      }
      return findings;
    },
  );

  const speciesSearchCheck = await checkEndpoint(
    "lcscg",
    "/api/lcscg/species?name=Asclepias",
    "LCSCG — species name search (Asclepias)",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const resultCount = typeof data?.result_count === "number" ? data.result_count : 0;
      if (resultCount > 0) {
        findings.push({ type: "ok", sourceField: "data.result_count", note: `${resultCount} records for "Asclepias"` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.result_count", note: `No records for "Asclepias" — import may not have run or no Asclepias in guides` });
      }
      const records = Array.isArray(data?.records) ? data.records : [];
      if (records.length > 0) {
        const first = records[0] as Record<string, unknown>;
        if (first.image_urls && Array.isArray(first.image_urls) && first.image_urls.length > 0) {
          findings.push({ type: "ok", sourceField: "data.records[0].image_urls", note: `image_urls populated: ${first.image_urls.length} URLs` });
        } else {
          findings.push({ type: "gap", sourceField: "data.records[0].image_urls", note: `image_urls missing or empty for first record` });
        }
      }
      return findings;
    },
  );

  return [metadataCheck, guidesCheck, guideDetailCheck, speciesSearchCheck];
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
