export type { S2cMiWashSpeciesEntry as S2cMiWashSeedAvailabilityEntry, S2cMiWashYearData } from "./data.js";
export type { S2cMiWashSpeciesInformationEntry } from "./species-information-data.js";
import {
  type S2cMiWashSpeciesEntry,
  S2C_MI_WASH_DATA,
  S2C_MI_WASH_AVAILABLE_YEARS,
  lookupByYear,
} from "./data.js";
import {
  type S2cMiWashSpeciesInformationEntry,
  S2C_MI_WASH_SPECIES_INFORMATION,
} from "./species-information-data.js";

export { S2C_MI_WASH_AVAILABLE_YEARS };

export interface S2cMiWashSeedAvailabilityResult {
  year: number;
  species_count: number;
  source_note: string;
  species: S2cMiWashSpeciesEntry[];
}

export interface S2cMiWashYearsResult {
  available_years: number[];
  years: Array<{ year: number; species_count: number; source_note: string }>;
}

export function getS2cMiWashSeedAvailability(year: number): S2cMiWashSeedAvailabilityResult | undefined {
  const data = lookupByYear(year);
  if (!data) return undefined;
  return {
    year: data.year,
    species_count: data.species.length,
    source_note: data.source_note,
    species: data.species,
  };
}

export function getS2cMiWashYears(): S2cMiWashYearsResult {
  const years = S2C_MI_WASH_DATA.map((y) => ({
    year: y.year,
    species_count: y.species.length,
    source_note: y.source_note,
  }));
  return {
    available_years: S2C_MI_WASH_AVAILABLE_YEARS,
    years,
  };
}

export function getS2cMiWashSpeciesInformation(
  species: string,
): S2cMiWashSpeciesInformationEntry | undefined {
  const normalized = species.trim().toLowerCase();
  return S2C_MI_WASH_SPECIES_INFORMATION.find(
    (entry) => entry.botanical_name.trim().toLowerCase() === normalized,
  );
}
