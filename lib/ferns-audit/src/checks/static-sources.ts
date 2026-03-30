import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";

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

export async function runCoefficientChecks(fernsBase: string): Promise<EndpointComparison[]> {
  return Promise.all([
    checkEndpoint(
      "coefficient",
      "/api/coefficient?value=5",
      "Coefficient of Conservatism — value lookup (C=5)",
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (data && data.value !== undefined) {
          findings.push({
            type: "ok",
            sourceField: "data.value",
            note: `data.value present: ${data.value}`,
          });
        } else {
          findings.push({
            type: "mismatch",
            sourceField: "data.value",
            note: `data.value missing from response`,
          });
        }
        return findings;
      },
    ),
    checkEndpoint(
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
    ),
  ]);
}

export async function runWetlandIndicatorChecks(fernsBase: string): Promise<EndpointComparison[]> {
  return Promise.all([
    checkEndpoint(
      "wetland-indicator",
      "/api/wetland-indicator?code=OBL",
      "Wetland Indicator Status — code lookup (OBL)",
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (data && data.code !== undefined) {
          findings.push({
            type: "ok",
            sourceField: "data.code",
            note: `data.code present: ${data.code}`,
          });
        } else {
          findings.push({
            type: "mismatch",
            sourceField: "data.code",
            note: `data.code missing from response`,
          });
        }
        return findings;
      },
    ),
    checkEndpoint(
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
    ),
  ]);
}

export async function runWucolsChecks(fernsBase: string): Promise<EndpointComparison[]> {
  return Promise.all([
    checkEndpoint(
      "wucols",
      "/api/wucols?code=M",
      "WUCOLS — water use classification lookup (M = Moderate)",
      fernsBase,
      (envelope) => {
        const findings: FieldFinding[] = [];
        const data = envelope.data as Record<string, unknown> | null | undefined;
        if (data && data.code !== undefined) {
          findings.push({
            type: "ok",
            sourceField: "data.code",
            note: `data.code present: ${data.code}`,
          });
        } else {
          findings.push({
            type: "mismatch",
            sourceField: "data.code",
            note: `data.code missing from response`,
          });
        }
        return findings;
      },
    ),
    checkEndpoint(
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
    ),
  ]);
}

export async function runS2CChecks(fernsBase: string): Promise<EndpointComparison[]> {
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

  const speciesCheck = await checkEndpoint(
    "s2c",
    "/api/s2c?year=2026",
    "Seeds to Community — species list for 2026",
    fernsBase,
    (envelope) => {
      const findings: FieldFinding[] = [];
      const data = envelope.data as Record<string, unknown> | null | undefined;
      const speciesList = (data?.species ?? data?.species_list) as unknown[] | undefined;
      if (speciesList && speciesList.length > 0) {
        findings.push({
          type: "ok",
          sourceField: "data.species",
          note: `${speciesList.length} species returned for 2026`,
        });
      } else {
        findings.push({
          type: "mismatch",
          sourceField: "data.species",
          note: `data.species missing or empty for year=2026 — no 2026 data loaded yet`,
        });
      }
      return findings;
    },
  );

  return [yearsCheck, speciesCheck];
}
