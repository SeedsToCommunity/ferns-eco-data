export type { SeedsToCommunityWashtenawSpeciesEntry, SeedsToCommunityWashtenawYearData } from "./data.js";
import {
  type SeedsToCommunityWashtenawYearData,
  SEEDS_TO_COMMUNITY_WASHTENAW_DATA,
  SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS,
  lookupByYear,
} from "./data.js";

export { SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS };

export function getSeedsToCommunityWashtenawSpecies(year: number): SeedsToCommunityWashtenawYearData | undefined {
  return lookupByYear(year);
}

export function getSeedsToCommunityWashtenawYears(): Array<{ year: number; species_count: number; source_note: string }> {
  return SEEDS_TO_COMMUNITY_WASHTENAW_DATA.map((y) => ({
    year: y.year,
    species_count: y.species.length,
    source_note: y.source_note,
  }));
}
