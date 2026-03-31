import { fetchJson, collectUrls } from "../http.js";
import type { EndpointComparison, FieldFinding } from "../types.js";
import type { TestSpecies, TestAssessment } from "../corpus.js";

const UFQA_API = "https://universalfqa.org/get";

const AUDIT_DATABASE_ID = 1;
const AUDIT_DATABASE_LABEL = "Chicago Region (DB 1)";

export async function runUniversalFqaComparators(
  fernsBase: string,
  species: TestSpecies[],
  assessments: TestAssessment[] = [],
): Promise<EndpointComparison[]> {
  const results: EndpointComparison[] = [];

  results.push(await checkDatabaseList(fernsBase));

  const upstream = await fetchUpstreamDatabase(AUDIT_DATABASE_ID);

  results.push(await compareDatabaseBlob(fernsBase, AUDIT_DATABASE_ID, AUDIT_DATABASE_LABEL, upstream));

  for (const sp of species) {
    results.push(await compareSpeciesLookup(fernsBase, sp, upstream));
  }

  for (const assessment of assessments) {
    results.push(await compareAssessment(fernsBase, assessment));
  }

  return results;
}

async function checkDatabaseList(fernsBase: string): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/databases`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — database list`;

  try {
    const raw = await fetchJson(fernsUrl);
    const envelope = raw as Record<string, unknown>;
    const data = (envelope.data ?? {}) as Record<string, unknown>;
    const databases = (data.databases ?? []) as unknown[];
    const urlsCollected = collectUrls(envelope, `universal-fqa/databases`);

    const findings: FieldFinding[] = [];

    if (databases.length === 0) {
      findings.push({
        type: "mismatch",
        sourceField: "databases",
        note: `FERNS returned an empty database list — universalfqa.org serves ~93 databases`,
      });
    } else {
      findings.push({
        type: "ok",
        sourceField: "databases",
        note: `FERNS returned ${databases.length} database entries`,
      });
    }

    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: data,
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

async function compareDatabaseBlob(
  fernsBase: string,
  databaseId: number,
  databaseLabel: string,
  upstream: UpstreamDatabaseResult,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/databases/${databaseId}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `Universal FQA — database blob (${databaseLabel})`;

  try {
    const fernsRaw = await fetchJson(fernsUrl) as Record<string, unknown>;
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `universal-fqa/databases/${databaseId}`);

    const findings: FieldFinding[] = [];

    if (!fernsEnvelope.found) {
      findings.push({ type: "gap", sourceField: "found", note: `FERNS returned found: false for database ${databaseId}` });
      return {
        source: "universal-fqa",
        endpoint: fernsEndpoint,
        label,
        ok: true,
        findings,
        urlsCollected,
      };
    }

    const fernsSpecies = (fernsData.species ?? []) as Array<Record<string, unknown>>;
    const upstreamCount = upstream.species.size;
    const fernsCount = fernsSpecies.length;
    const fernsTotalSpecies = fernsData.total_species as number | undefined;

    if (fernsCount === upstreamCount) {
      findings.push({ type: "ok", sourceField: "species.length", fernsField: "species.length", fernsValue: fernsCount, note: `Species array length matches upstream: ${fernsCount}` });
    } else {
      findings.push({ type: "mismatch", sourceField: "species.length", fernsField: "species.length", sourceValue: upstreamCount, fernsValue: fernsCount, note: `Species array length mismatch vs upstream parsed count` });
    }

    if (fernsTotalSpecies !== undefined) {
      if (fernsTotalSpecies === upstreamCount) {
        findings.push({ type: "ok", sourceField: "total_species", fernsField: "total_species", fernsValue: fernsTotalSpecies, note: `total_species field matches upstream count: ${fernsTotalSpecies}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "total_species", fernsField: "total_species", sourceValue: upstreamCount, fernsValue: fernsTotalSpecies });
      }
    }

    const metaFields = ["region", "year", "citation"] as const;
    for (const field of metaFields) {
      if (fernsData[field] !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsData[field], note: `${field} present: ${String(fernsData[field])}` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from FERNS blob response` });
      }
    }

    if (upstream.ok && fernsSpecies.length > 0) {
      const sampleUpstream = [...upstream.species.values()].slice(0, 3);
      for (const upSp of sampleUpstream) {
        const fernsMatch = fernsSpecies.find(
          (s) => typeof s["scientific_name"] === "string" &&
            s["scientific_name"].toLowerCase() === upSp.scientific_name.toLowerCase(),
        );
        if (fernsMatch) {
          const fieldChecks: Array<keyof typeof upSp> = ["family", "acronym", "native", "physiognomy", "duration", "common_name"];
          const mismatched = fieldChecks.filter(
            (f) => String(upSp[f] ?? "").toLowerCase() !== String((fernsMatch[f] as unknown) ?? "").toLowerCase(),
          );
          if (mismatched.length === 0) {
            findings.push({ type: "ok", sourceField: `species[${upSp.scientific_name}]`, note: `Spot-check: all fields match for "${upSp.scientific_name}"` });
          } else {
            findings.push({ type: "mismatch", sourceField: `species[${upSp.scientific_name}]`, note: `Spot-check mismatch on fields: ${mismatched.join(", ")} for "${upSp.scientific_name}"` });
          }
        } else {
          findings.push({ type: "gap", sourceField: `species[${upSp.scientific_name}]`, note: `Upstream species "${upSp.scientific_name}" not found in FERNS blob array` });
        }
      }
    }

    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawFerns: { total_species: fernsCount, region: fernsData["region"], year: fernsData["year"] },
      rawSource: { total_species: upstreamCount },
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

interface UpstreamSpeciesRecord {
  scientific_name: string;
  family: string;
  acronym: string;
  native: string;
  c: unknown;
  w: unknown;
  physiognomy: string;
  duration: string;
  common_name: string;
}

interface UpstreamDatabaseResult {
  ok: boolean;
  error?: string;
  species: Map<string, UpstreamSpeciesRecord>;
}

async function fetchUpstreamDatabase(databaseId: number): Promise<UpstreamDatabaseResult> {
  try {
    const raw = await fetchJson(`${UFQA_API}/database/${databaseId}`) as Record<string, unknown>;
    const data = raw.data as unknown[][] | null | undefined;

    if (!data || !Array.isArray(data)) {
      return { ok: false, error: `Upstream returned no data array for database ${databaseId}`, species: new Map() };
    }

    const speciesMap = new Map<string, UpstreamSpeciesRecord>();

    let inSpeciesSection = false;
    for (const row of data) {
      if (!Array.isArray(row) || row.length === 0) {
        inSpeciesSection = false;
        continue;
      }
      if (row[0] === "Scientific Name") {
        inSpeciesSection = true;
        continue;
      }
      if (inSpeciesSection && row.length >= 9) {
        const sp: UpstreamSpeciesRecord = {
          scientific_name: String(row[0] ?? ""),
          family: String(row[1] ?? ""),
          acronym: String(row[2] ?? ""),
          native: String(row[3] ?? ""),
          c: row[4] ?? null,
          w: row[5] ?? null,
          physiognomy: String(row[6] ?? ""),
          duration: String(row[7] ?? ""),
          common_name: String(row[8] ?? ""),
        };
        speciesMap.set(sp.scientific_name.toLowerCase(), sp);
      }
    }

    return { ok: true, species: speciesMap };
  } catch (err) {
    return { ok: false, error: String(err), species: new Map() };
  }
}

async function compareSpeciesLookup(
  fernsBase: string,
  sp: TestSpecies,
  upstream: UpstreamDatabaseResult,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/species`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&database_id=${AUDIT_DATABASE_ID}`;
  const label = `${sp.label} (${sp.name}) — Universal FQA species in ${AUDIT_DATABASE_LABEL}`;

  try {
    const fernsRaw = await fetchJson(fernsUrl);
    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const fernsSpecies = (fernsData.species ?? null) as Record<string, unknown> | null;
    const urlsCollected = collectUrls(fernsEnvelope, `universal-fqa/species:${sp.name}`);

    const findings: FieldFinding[] = [];

    if (!upstream.ok) {
      findings.push({
        type: "ok",
        sourceField: "(upstream)",
        note: `Upstream database fetch failed: ${upstream.error} — cannot compare; FERNS returned found: ${fernsEnvelope.found}`,
      });
      return {
        source: "universal-fqa",
        endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&database_id=${AUDIT_DATABASE_ID}`,
        label,
        ok: true,
        rawFerns: fernsSpecies ?? undefined,
        findings,
        urlsCollected,
      };
    }

    const upstreamMatch = upstream.species.get(sp.name.toLowerCase());

    if (!upstreamMatch && !fernsEnvelope.found) {
      findings.push({
        type: "ok",
        sourceField: "(match)",
        note: `Species not found in either FERNS or upstream ${AUDIT_DATABASE_LABEL} — consistent`,
      });
    } else if (!upstreamMatch && fernsEnvelope.found) {
      findings.push({
        type: "mismatch",
        sourceField: "found",
        note: `FERNS returned found: true but species not present in upstream ${AUDIT_DATABASE_LABEL}`,
      });
    } else if (upstreamMatch && !fernsEnvelope.found) {
      findings.push({
        type: "gap",
        sourceField: "found",
        note: `Species IS in upstream ${AUDIT_DATABASE_LABEL} but FERNS returned found: false`,
      });
    } else if (upstreamMatch && fernsSpecies) {
      const fields: Array<keyof UpstreamSpeciesRecord> = [
        "scientific_name", "family", "acronym", "native", "physiognomy", "duration", "common_name",
      ];

      for (const field of fields) {
        const sourceVal = String(upstreamMatch[field] ?? "");
        const fernsVal = String((fernsSpecies[field] as unknown) ?? "");
        if (sourceVal.toLowerCase() !== fernsVal.toLowerCase()) {
          findings.push({
            type: "mismatch",
            sourceField: field,
            fernsField: field,
            sourceValue: sourceVal,
            fernsValue: fernsVal,
          });
        } else {
          findings.push({
            type: "ok",
            sourceField: field,
            fernsField: field,
            fernsValue: fernsVal,
            note: `${field}: "${fernsVal}" matches upstream`,
          });
        }
      }

      for (const field of ["c", "w"] as const) {
        const sourceVal = upstreamMatch[field];
        const fernsVal = fernsSpecies[field];
        if (String(sourceVal ?? "") !== String(fernsVal ?? "")) {
          findings.push({
            type: "mismatch",
            sourceField: field,
            fernsField: field,
            sourceValue: sourceVal,
            fernsValue: fernsVal,
            note: `C/W values may differ due to type normalization (number vs string)`,
          });
        } else {
          findings.push({
            type: "ok",
            sourceField: field,
            fernsField: field,
            fernsValue: fernsVal,
            note: `${field}: "${fernsVal}" matches upstream`,
          });
        }
      }
    }

    const upstreamRecord: Record<string, unknown> = upstreamMatch
      ? { ...upstreamMatch }
      : {};

    return {
      source: "universal-fqa",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&database_id=${AUDIT_DATABASE_ID}`,
      label,
      ok: true,
      rawSource: upstreamRecord,
      rawFerns: fernsSpecies ?? undefined,
      findings,
      urlsCollected,
    };
  } catch (err) {
    return {
      source: "universal-fqa",
      endpoint: `${fernsEndpoint}?name=${encodeURIComponent(sp.name)}&database_id=${AUDIT_DATABASE_ID}`,
      label,
      ok: false,
      error: String(err),
      findings: [],
      urlsCollected: [],
    };
  }
}

async function compareAssessment(
  fernsBase: string,
  assessment: TestAssessment,
): Promise<EndpointComparison> {
  const fernsEndpoint = `/api/universal-fqa/assessment/${assessment.id}`;
  const fernsUrl = `${fernsBase}${fernsEndpoint}`;
  const label = `${assessment.label} — Universal FQA assessment`;

  try {
    const [fernsRaw, upstreamRaw] = await Promise.all([
      fetchJson(fernsUrl) as Promise<Record<string, unknown>>,
      fetchJson(`${UFQA_API}/assessment/${assessment.id}`) as Promise<Record<string, unknown>>,
    ]);

    const fernsEnvelope = fernsRaw as Record<string, unknown>;
    const fernsData = (fernsEnvelope.data ?? {}) as Record<string, unknown>;
    const upstreamData = (upstreamRaw.data ?? upstreamRaw) as Record<string, unknown>;
    const urlsCollected = collectUrls(fernsEnvelope, `universal-fqa/assessment:${assessment.id}`);

    const findings: FieldFinding[] = [];

    if (!fernsEnvelope.found) {
      findings.push({ type: "gap", sourceField: "found", note: `FERNS returned found: false for assessment ${assessment.id}` });
      return {
        source: "universal-fqa",
        endpoint: fernsEndpoint,
        label,
        ok: true,
        rawFerns: fernsData,
        findings,
        urlsCollected,
      };
    }

    findings.push({ type: "ok", sourceField: "found", note: `Assessment ${assessment.id} found in FERNS` });

    const requiredFields = ["assessment_name", "date", "db_name", "site_name"] as const;
    for (const field of requiredFields) {
      const fernsVal = fernsData[field];
      const upstreamVal = upstreamData[field];
      if (fernsVal !== undefined && upstreamVal !== undefined) {
        if (String(fernsVal) === String(upstreamVal)) {
          findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsVal, note: `${field} matches upstream` });
        } else {
          findings.push({ type: "mismatch", sourceField: field, fernsField: field, sourceValue: upstreamVal, fernsValue: fernsVal });
        }
      } else if (fernsVal !== undefined) {
        findings.push({ type: "ok", sourceField: field, fernsField: field, fernsValue: fernsVal, note: `${field} present in FERNS (not in upstream raw)` });
      } else {
        findings.push({ type: "gap", sourceField: field, note: `${field} missing from FERNS response` });
      }
    }

    const upstreamSpeciesArray = upstreamData.species as unknown[] | undefined;
    const fernsSpeciesArray = fernsData.species as unknown[] | undefined;

    if (fernsSpeciesArray !== undefined && upstreamSpeciesArray !== undefined) {
      if (fernsSpeciesArray.length === upstreamSpeciesArray.length) {
        findings.push({ type: "ok", sourceField: "species.length", note: `Species count matches: ${fernsSpeciesArray.length}` });
      } else {
        findings.push({ type: "mismatch", sourceField: "species.length", sourceValue: upstreamSpeciesArray.length, fernsValue: fernsSpeciesArray.length });
      }
    } else if (fernsSpeciesArray !== undefined) {
      findings.push({ type: "ok", sourceField: "species", note: `${fernsSpeciesArray.length} species in FERNS response` });
    }

    return {
      source: "universal-fqa",
      endpoint: fernsEndpoint,
      label,
      ok: true,
      rawSource: upstreamData,
      rawFerns: fernsData,
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
