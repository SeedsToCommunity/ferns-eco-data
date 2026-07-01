export type { WildTypeNativePlantsPlantRecord, WildTypeNativePlantsNote } from "./data.js";
export type { WildTypeNativePlantsNoteCodeEntry } from "./note-codes-data.js";

import { WILDTYPE_NATIVE_PLANTS_DATA } from "./data.js";
import { WILDTYPE_NATIVE_PLANTS_NOTE_CODES } from "./note-codes-data.js";

export interface WildTypeNativePlantsPlantGuideResult {
  total: number;
  category: string | null;
  plants: import("./data.js").WildTypeNativePlantsPlantRecord[];
}

export interface WildTypeNativePlantsNoteCodesResult {
  total: number;
  note_codes: import("./note-codes-data.js").WildTypeNativePlantsNoteCodeEntry[];
}

export function getWildTypeNativePlantsPlantGuide(
  category?: string | null,
): WildTypeNativePlantsPlantGuideResult {
  const filtered =
    category != null && category !== ""
      ? WILDTYPE_NATIVE_PLANTS_DATA.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase(),
        )
      : WILDTYPE_NATIVE_PLANTS_DATA;

  return {
    total: filtered.length,
    category: category ?? null,
    plants: filtered,
  };
}

export function getWildTypeNativePlantsPlantGuideByScientificName(
  scientific_name: string,
): import("./data.js").WildTypeNativePlantsPlantRecord | undefined {
  const normalized = scientific_name.trim().toLowerCase();
  return WILDTYPE_NATIVE_PLANTS_DATA.find(
    (p) => p.scientific_name.trim().toLowerCase() === normalized,
  );
}

export function getWildTypeNativePlantsNoteCodes(): WildTypeNativePlantsNoteCodesResult {
  return {
    total: WILDTYPE_NATIVE_PLANTS_NOTE_CODES.length,
    note_codes: WILDTYPE_NATIVE_PLANTS_NOTE_CODES,
  };
}

export const WILDTYPE_NATIVE_PLANTS_CATEGORIES = [
  "wildflowers",
  "grasses, sedges, rushes",
  "ferns",
  "trees, shrubs & vines",
] as const;
