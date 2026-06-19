export type { SeedsToCommunityWashtenawSpeciesEntry as SeedsToCommunityWashtenawSeedAvailabilityEntry, SeedsToCommunityWashtenawYearData } from "./data.js";
export type { SeedsToCommunityWashtenawSpeciesInformationEntry } from "./species-information-data.js";
import {
  type SeedsToCommunityWashtenawSpeciesEntry,
  SEEDS_TO_COMMUNITY_WASHTENAW_DATA,
  SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS,
  lookupByYear,
} from "./data.js";
import {
  type SeedsToCommunityWashtenawSpeciesInformationEntry,
  SEEDS_TO_COMMUNITY_WASHTENAW_SPECIES_INFORMATION,
} from "./species-information-data.js";

export { SEEDS_TO_COMMUNITY_WASHTENAW_AVAILABLE_YEARS };

export interface SeedsToCommunityWashtenawSeedAvailabilityResult {
  year: number;
  species_count: number;
  source_note: string;
  species: SeedsToCommunityWashtenawSpeciesEntry[];
}

export interface SeedsToCommunityWashtenawYearsResult {
  available_years: number[];
  years: Array<{ year: number; species_count: number; source_note: string }>;
}

export function getSeedsToCommunityWashtenawSeedAvailability(year: number): SeedsToCommunityWashtenawSeedAvailabilityResult | undefined {
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

export function getSeedsToCommunityWashtenawSpeciesInformation(
  species: string,
): SeedsToCommunityWashtenawSpeciesInformationEntry | undefined {
  const normalized = species.trim().toLowerCase();
  return SEEDS_TO_COMMUNITY_WASHTENAW_SPECIES_INFORMATION.find(
    (entry) => entry.botanical_name.trim().toLowerCase() === normalized,
  );
}
