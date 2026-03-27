import type { FieldFinding } from "./types.js";
import { KNOWN_FERNS_ADDITIONS } from "./corpus.js";

function camelToSnake(key: string): string {
  return key.replace(/([A-Z])/g, "_$1").toLowerCase();
}

const RESERVED_WORD_MAP: Record<string, string> = {
  class: "class_",
  order: "order_",
};

function normalizeSourceKey(key: string): string {
  if (RESERVED_WORD_MAP[key]) return RESERVED_WORD_MAP[key];
  return camelToSnake(key);
}

export function diffObjects(
  sourceObj: Record<string, unknown>,
  fernsData: Record<string, unknown>,
  sourceLabel: string,
): FieldFinding[] {
  const findings: FieldFinding[] = [];
  const fernsKeys = new Set(Object.keys(fernsData));
  const sourceKeys = Object.keys(sourceObj);

  const normalizedToFerns: Map<string, string> = new Map();
  for (const sKey of sourceKeys) {
    const normalized = normalizeSourceKey(sKey);
    normalizedToFerns.set(sKey, normalized);
  }

  for (const sKey of sourceKeys) {
    const normalized = normalizedToFerns.get(sKey)!;
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
    } else if (fernsKeys.has(normalized) && normalized !== sKey) {
      const fernsVal = fernsData[normalized];
      if (JSON.stringify(sourceVal) !== JSON.stringify(fernsVal)) {
        findings.push({
          type: "name_diff",
          sourceField: sKey,
          fernsField: normalized,
          sourceValue: sourceVal,
          fernsValue: fernsVal,
          note: `${sourceLabel} uses "${sKey}", FERNS uses "${normalized}"`,
        });
      } else {
        findings.push({
          type: "name_diff",
          sourceField: sKey,
          fernsField: normalized,
          sourceValue: sourceVal,
          fernsValue: fernsVal,
          note: `${sourceLabel} uses "${sKey}", FERNS uses "${normalized}" (values match)`,
        });
      }
    } else {
      findings.push({
        type: "gap",
        sourceField: sKey,
        sourceValue: sourceVal,
        note: `Field present in ${sourceLabel} response but absent from FERNS data`,
      });
    }
  }

  for (const fKey of fernsKeys) {
    const inSource = sourceKeys.some((sk) => sk === fKey || normalizeSourceKey(sk) === fKey);
    if (!inSource) {
      const isKnownAddition = KNOWN_FERNS_ADDITIONS.has(fKey);
      findings.push({
        type: "addition",
        sourceField: fKey,
        fernsField: fKey,
        fernsValue: fernsData[fKey],
        note: isKnownAddition
          ? "FERNS-added field (expected)"
          : "Field in FERNS data not present in source response — possible unexpected addition",
      });
    }
  }

  return findings;
}
