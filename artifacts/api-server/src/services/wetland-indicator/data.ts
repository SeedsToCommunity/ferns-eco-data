export interface WetlandIndicatorEntry {
  code: string;
  w_value: number;
  full_name: string;
  occurrence_range: string;
  ecological_meaning: string;
  scientific_description: string;
}

export const WETLAND_INDICATOR_DATA: WetlandIndicatorEntry[] = [
  {
    code: "OBL",
    w_value: -5,
    full_name: "Obligate Wetland",
    occurrence_range: ">99% in wetlands",
    ecological_meaning:
      "Almost always occurs in wetlands under natural conditions. Rarely if ever found in uplands. These species are fully adapted to flooded or saturated soil conditions.",
    scientific_description:
      "OBL (Obligate Wetland, W=-5): Estimated probability >99% of occurrence in wetlands under natural conditions. " +
      "Hydrophytic species with morphological and physiological adaptations for saturated or inundated soils. " +
      "Indicator of positive wetland determination in U.S. Army Corps of Engineers wetland delineation. " +
      "W-value: -5 (Swink & Wilhelm FQA).",
  },
  {
    code: "FACW",
    w_value: -3,
    full_name: "Facultative Wetland",
    occurrence_range: "67–99% in wetlands",
    ecological_meaning:
      "Usually found in wetlands, but occasionally occurs in uplands. Strong preference for wet conditions but not exclusively wetland species.",
    scientific_description:
      "FACW (Facultative Wetland, W=-3): Estimated probability 67–99% of occurrence in wetlands under natural conditions. " +
      "Species with a strong affinity for wetland habitats but capable of growing in uplands under some conditions. " +
      "Considered hydrophytic vegetation and contributes to wetland determination. " +
      "W-value: -3 (Swink & Wilhelm FQA).",
  },
  {
    code: "FAC",
    w_value: 0,
    full_name: "Facultative",
    occurrence_range: "34–66% in wetlands",
    ecological_meaning:
      "Equally likely to occur in wetlands or uplands. These species show no strong preference for either habitat type and are found across a wide range of moisture conditions.",
    scientific_description:
      "FAC (Facultative, W=0): Estimated probability 34–66% of occurrence in wetlands under natural conditions. " +
      "Species occur with roughly equal frequency in wetlands and uplands. " +
      "Not a reliable indicator of either wetland or upland conditions in isolation. " +
      "W-value: 0 (Swink & Wilhelm FQA).",
  },
  {
    code: "FACU",
    w_value: 3,
    full_name: "Facultative Upland",
    occurrence_range: "1–33% in wetlands",
    ecological_meaning:
      "Usually found in uplands, but occasionally occurs in wetlands. Strong preference for drier conditions, with only occasional presence in wet habitats.",
    scientific_description:
      "FACU (Facultative Upland, W=+3): Estimated probability 1–33% of occurrence in wetlands under natural conditions. " +
      "Species with a strong affinity for upland habitats but occasionally found in wetlands. " +
      "Generally not considered hydrophytic vegetation for wetland delineation purposes. " +
      "W-value: +3 (Swink & Wilhelm FQA).",
  },
  {
    code: "UPL",
    w_value: 5,
    full_name: "Upland",
    occurrence_range: "<1% in wetlands",
    ecological_meaning:
      "Almost never occurs in wetlands under natural conditions. These are strictly upland species, fully adapted to dry or well-drained soils.",
    scientific_description:
      "UPL (Upland, W=+5): Estimated probability <1% of occurrence in wetlands under natural conditions. " +
      "Non-hydrophytic species with no significant wetland affinity. " +
      "Considered a strong negative indicator for wetland determination. " +
      "W-value: +5 (Swink & Wilhelm FQA).",
  },
];

const W_TO_CODE: Record<number, string> = {
  [-5]: "OBL",
  [-3]: "FACW",
  [0]: "FAC",
  [3]: "FACU",
  [5]: "UPL",
};

export function lookupByCode(code: string): WetlandIndicatorEntry | undefined {
  return WETLAND_INDICATOR_DATA.find(
    (e) => e.code === code.toUpperCase(),
  );
}

export function lookupByW(w: number): WetlandIndicatorEntry | undefined {
  const code = W_TO_CODE[w];
  if (!code) return undefined;
  return lookupByCode(code);
}
