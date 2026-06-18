export type { WucolsWaterUseEntry } from "./data.js";
import { type WucolsWaterUseEntry, WUCOLS_WATER_USE_DATA, lookupByCode } from "./data.js";

export function getWucolsWaterUse(code: string): WucolsWaterUseEntry | undefined {
  return lookupByCode(code);
}

export function getWucolsWaterUseList(): WucolsWaterUseEntry[] {
  return WUCOLS_WATER_USE_DATA;
}
