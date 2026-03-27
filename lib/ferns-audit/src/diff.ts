import type { FieldFinding } from "./types.js";

const ENVELOPE_FIELDS = new Set([
  "found",
  "provenance",
  "queried_at",
  "cache_status",
  "source_url",
]);

export function diffObjects(
  sourceObj: Record<string, unknown>,
  fernsData: Record<string, unknown>,
  _sourceLabel: string,
): FieldFinding[] {
  const findings: FieldFinding[] = [];
  const fernsKeys = new Set(Object.keys(fernsData));
  const sourceKeys = Object.keys(sourceObj);

  for (const sKey of sourceKeys) {
    const sourceVal = sourceObj[sKey];

    if (fernsKeys.has(sKey)) {
      const fernsVal = fernsData[sKey];
      if (JSON.stringify(sourceVal) !== JSON.stringify(fernsVal)) {
        findings.push({
          type: "mismatch",
          sourceField: sKey,
          fernsField: sKey,
          sourceValue: sourceVal,
          fernsValue: fernsVal,
        });
      }
    } else {
      findings.push({
        type: "gap",
        sourceField: sKey,
        sourceValue: sourceVal,
        note: `Field present in source but absent from FERNS data`,
      });
    }
  }

  for (const fKey of fernsKeys) {
    const inSource = sourceKeys.includes(fKey);
    if (!inSource) {
      const isEnvelope = ENVELOPE_FIELDS.has(fKey);
      findings.push({
        type: "addition",
        sourceField: fKey,
        fernsField: fKey,
        fernsValue: fernsData[fKey],
        note: isEnvelope
          ? "Permitted FERNS envelope field"
          : "FERNS-added field not present in source — passthrough violation if not from source",
      });
    }
  }

  return findings;
}
