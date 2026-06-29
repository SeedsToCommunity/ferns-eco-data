import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies, TestAssessment } from "../corpus.js";

const AUDIT_DATABASE_ID = 50;
const AUDIT_DATABASE_LABEL = "Michigan 2014 (DB 50)";
const AUDIT_ASSESSMENT_ID = 1;
const AUDIT_ASSESSMENT_LABEL = "Assessment ID 1";

export async function runUniversalFqaComparators(
  fernsBase: string,
  _species: TestSpecies[],
  _assessments: TestAssessment[] = [],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(await checkDatabaseList(fernsBase));
  results.push(await checkDatabase(fernsBase, AUDIT_DATABASE_ID, AUDIT_DATABASE_LABEL));
  results.push(await checkDatabaseInventory(fernsBase, AUDIT_DATABASE_ID, AUDIT_DATABASE_LABEL));
  results.push(await checkInventory(fernsBase, AUDIT_ASSESSMENT_ID, AUDIT_ASSESSMENT_LABEL));

  return results;
}

async function checkDatabaseList(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/get/database`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — GET /get/database/ (database list)`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = fernsRaw.data as Record<string, unknown> | null | undefined;
    const urlsCollected = collectUrls(fernsRaw, `universal-fqa/get/database`);

    const findings: FieldFinding[] = [];

    if (fernsData !== null && fernsData !== undefined && fernsData.status === "success") {
      findings.push({ type: "ok", sourceField: "data.status", fernsValue: fernsData.status, note: `data.status === "success"` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.status", fernsValue: fernsData?.status, note: `Expected data.status === "success"` });
    }

    const upstreamData = fernsData?.data;
    if (Array.isArray(upstreamData)) {
      findings.push({ type: "ok", sourceField: "data.data", note: `Array.isArray(data.data) — ${upstreamData.length} rows` });
      if (upstreamData.length > 0) {
        findings.push({ type: "ok", sourceField: "data.data.length", fernsValue: upstreamData.length, note: `data.data.length > 0 (${upstreamData.length} rows)` });
      } else {
        findings.push({ type: "mismatch", sourceField: "data.data.length", fernsValue: 0, note: `Expected data.data.length > 0 — universalfqa.org serves ~93 databases` });
      }
    } else {
      findings.push({ type: "mismatch", sourceField: "data.data", note: `Expected Array.isArray(data.data) to be true` });
    }

    const ok = findings.every((f) => f.type !== "mismatch");
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok,
      rawFerns: fernsData ?? undefined,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkDatabase(
  fernsBase: string,
  databaseId: number,
  databaseLabel: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/get/database/${databaseId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — GET /get/database/{id} (${databaseLabel})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = fernsRaw.data as Record<string, unknown> | null | undefined;
    const urlsCollected = collectUrls(fernsRaw, `universal-fqa/get/database/${databaseId}`);

    const findings: FieldFinding[] = [];

    if (fernsData !== null && fernsData !== undefined && fernsData.status === "success") {
      findings.push({ type: "ok", sourceField: "data.status", fernsValue: fernsData.status, note: `data.status === "success"` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.status", fernsValue: fernsData?.status, note: `Expected data.status === "success"` });
    }

    const upstreamData = fernsData?.data;
    if (Array.isArray(upstreamData)) {
      findings.push({ type: "ok", sourceField: "data.data", note: `Array.isArray(data.data) — ${upstreamData.length} rows` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.data", note: `Expected Array.isArray(data.data) to be true` });
    }

    const ok = findings.every((f) => f.type !== "mismatch");
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok,
      rawFerns: fernsData ?? undefined,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkDatabaseInventory(
  fernsBase: string,
  databaseId: number,
  databaseLabel: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/get/database/${databaseId}/inventory`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — GET /get/database/{id}/inventory (${databaseLabel})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = fernsRaw.data as Record<string, unknown> | null | undefined;
    const urlsCollected = collectUrls(fernsRaw, `universal-fqa/get/database/${databaseId}/inventory`);

    const findings: FieldFinding[] = [];

    if (fernsData !== null && fernsData !== undefined && fernsData.status === "success") {
      findings.push({ type: "ok", sourceField: "data.status", fernsValue: fernsData.status, note: `data.status === "success"` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.status", fernsValue: fernsData?.status, note: `Expected data.status === "success"` });
    }

    const upstreamData = fernsData?.data;
    if (Array.isArray(upstreamData)) {
      findings.push({ type: "ok", sourceField: "data.data", note: `Array.isArray(data.data) — ${upstreamData.length} rows` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.data", note: `Expected Array.isArray(data.data) to be true` });
    }

    const ok = findings.every((f) => f.type !== "mismatch");
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok,
      rawFerns: fernsData ?? undefined,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function checkInventory(
  fernsBase: string,
  assessmentId: number,
  assessmentLabel: string,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/get/inventory/${assessmentId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — GET /get/inventory/{id} (${assessmentLabel})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsData = fernsRaw.data as Record<string, unknown> | null | undefined;
    const urlsCollected = collectUrls(fernsRaw, `universal-fqa/get/inventory/${assessmentId}`);

    const findings: FieldFinding[] = [];

    if (fernsData !== null && fernsData !== undefined && fernsData.status === "success") {
      findings.push({ type: "ok", sourceField: "data.status", fernsValue: fernsData.status, note: `data.status === "success"` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.status", fernsValue: fernsData?.status, note: `Expected data.status === "success"` });
    }

    const upstreamData = fernsData?.data;
    if (Array.isArray(upstreamData)) {
      findings.push({ type: "ok", sourceField: "data.data", note: `Array.isArray(data.data) — ${upstreamData.length} rows` });
    } else {
      findings.push({ type: "mismatch", sourceField: "data.data", note: `Expected Array.isArray(data.data) to be true` });
    }

    const ok = findings.every((f) => f.type !== "mismatch");
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok,
      rawFerns: fernsData ?? undefined,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}
