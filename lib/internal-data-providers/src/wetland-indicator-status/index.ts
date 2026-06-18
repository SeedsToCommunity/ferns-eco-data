export type { WetlandIndicatorStatusEntry } from "./data.js";
import { type WetlandIndicatorStatusEntry, WETLAND_INDICATOR_STATUS_DATA, lookupByCode, lookupByW } from "./data.js";

export function getWetlandIndicatorStatusByCode(code: string): WetlandIndicatorStatusEntry | undefined {
  return lookupByCode(code);
}

export function getWetlandIndicatorStatusByW(w: number): WetlandIndicatorStatusEntry | undefined {
  return lookupByW(w);
}

export function getWetlandIndicatorStatusList(): WetlandIndicatorStatusEntry[] {
  return WETLAND_INDICATOR_STATUS_DATA;
}
