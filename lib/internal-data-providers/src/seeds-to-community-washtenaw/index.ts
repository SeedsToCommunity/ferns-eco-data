export type { SeedsToCommunityWashtenawSpeciesEntry, SeedsToCommunityWashtenawYearData } from "./data.js";
import {
  type SeedsToCommunityWashtenawSpeciesEntry,
  SEEDS_TO_COMMUNITY_WASHTENAW_DATA,
  SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS,
  lookupByYear,
} from "./data.js";

export { SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS };

export interface SeedsToCommunityWashtenawSpeciesResult {
  year: number;
  species_count: number;
  source_note: string;
  species: SeedsToCommunityWashtenawSpeciesEntry[];
}

export interface SeedsToCommunityWashtenawYearsResult {
  available_years: number[];
  years: Array<{ year: number; species_count: number; source_note: string }>;
}

export function getSeedsToCommunityWashtenawSpecies(year: number): SeedsToCommunityWashtenawSpeciesResult | undefined {
  const data = lookupByYear(year);
  if (!data) return undefined;
  return {
    year: data.year,
    species_count: data.species.length,
    source_note: data.source_note,
    species: data.species,
  };
}

export function getSeedsToCommunityWashtenawYears(): SeedsToCommunityWashtenawYearsResult {
  const years = SEEDS_TO_COMMUNITY_WASHTENAW_DATA.map((y) => ({
    year: y.year,
    species_count: y.species.length,
    source_note: y.source_note,
  }));
  return {
    available_years: SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS,
    years,
  };
}
