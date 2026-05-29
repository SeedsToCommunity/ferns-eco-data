export type { CoefficientEntry } from "./data.js";
import { type CoefficientEntry, COEFFICIENT_DATA, lookupByValue } from "./data.js";

export function getCoefficient(value: string): CoefficientEntry | undefined {
  return lookupByValue(value);
}

export function listCoefficients(): CoefficientEntry[] {
  return COEFFICIENT_DATA;
}
