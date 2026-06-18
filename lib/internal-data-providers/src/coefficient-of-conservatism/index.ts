export type { CoefficientOfConservatismEntry } from "./data.js";
import { type CoefficientOfConservatismEntry, COEFFICIENT_OF_CONSERVATISM_DATA, lookupByValue } from "./data.js";

export function getCoefficientOfConservatism(value: string): CoefficientOfConservatismEntry | undefined {
  return lookupByValue(value);
}

export function getCoefficientOfConservatismList(): CoefficientOfConservatismEntry[] {
  return COEFFICIENT_OF_CONSERVATISM_DATA;
}
