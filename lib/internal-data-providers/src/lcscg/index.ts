export type { LcscgGuideRecord } from "./guides-data.js";
export type { LcscgSpeciesRecord } from "./species-data.js";

import { LCSCG_GUIDES } from "./guides-data.js";
import { LCSCG_SPECIES } from "./species-data.js";
import type { LcscgGuideRecord } from "./guides-data.js";
import type { LcscgSpeciesRecord } from "./species-data.js";

/**
 * Returns all 12 LCSCG guides in ascending guide_id order (1271–1282).
 * Always returns exactly 12 records; never throws.
 */
export function getLcscgGuides(): LcscgGuideRecord[] {
  return [...LCSCG_GUIDES].sort((a, b) => a.guide_id - b.guide_id);
}

/**
 * Returns the guide record and its full species list for a given guide ID,
 * or undefined if the guide ID is not one of the 12 known IDs (1271–1282).
 *
 * Species within the result are ordered by page_number ascending, then
 * species_id ascending — matching the source PDF page order.
 *
 * Never throws; returns undefined for any unrecognized guideId.
 */
export function getLcscgGuide(
  guideId: number
): { guide: LcscgGuideRecord; species: LcscgSpeciesRecord[] } | undefined {
  const guide = LCSCG_GUIDES.find((g) => g.guide_id === guideId);
  if (!guide) return undefined;

  const species = LCSCG_SPECIES.filter((s) => s.guide_id === guideId).sort(
    (a, b) =>
      a.page_number - b.page_number ||
      a.species_id.localeCompare(b.species_id)
  );

  return { guide, species };
}

/**
 * Returns all species records whose scientific_name OR common_name contains
 * `name` as a case-insensitive substring.
 *
 * Results are sorted by scientific_name ascending.
 * Returns [] (empty array) when no records match — never undefined, never null.
 * Never throws.
 *
 * The search spans all 12 guides (494 records total).
 */
export function getLcscgSpecies(name: string): LcscgSpeciesRecord[] {
  const query = name.toLowerCase();
  return LCSCG_SPECIES.filter(
    (s) =>
      s.scientific_name.toLowerCase().includes(query) ||
      s.common_name.toLowerCase().includes(query)
  ).sort((a, b) => a.scientific_name.localeCompare(b.scientific_name));
}
