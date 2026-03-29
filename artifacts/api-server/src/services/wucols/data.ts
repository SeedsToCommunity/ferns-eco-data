export interface WucolsEntry {
  code: string;
  full_name: string;
  eto_range: string;
  eto_percentage_low: number | null;
  eto_percentage_high: number;
  irrigation_description: string;
  scientific_description: string;
}

export const WUCOLS_DATA: WucolsEntry[] = [
  {
    code: "VL",
    full_name: "Very Low Water Use",
    eto_range: "<10% of ETo",
    eto_percentage_low: null,
    eto_percentage_high: 10,
    irrigation_description:
      "Very little to no supplemental irrigation needed once established. These plants are highly drought-adapted and thrive with only natural rainfall in most California climate zones.",
    scientific_description:
      "VL (Very Low, <10% ETo): Supplemental irrigation need less than 10% of reference evapotranspiration (ETo). " +
      "Species in this category are highly drought-tolerant; most require no supplemental water after the establishment period (typically 1–2 years). " +
      "Suitable for unirrigated or minimal-water landscape zones. UC Cooperative Extension, WUCOLS IV (2014).",
  },
  {
    code: "L",
    full_name: "Low Water Use",
    eto_range: "10–30% of ETo",
    eto_percentage_low: 10,
    eto_percentage_high: 30,
    irrigation_description:
      "Low supplemental irrigation needed. Plants benefit from occasional deep watering, especially during dry periods, but do not require frequent irrigation.",
    scientific_description:
      "L (Low, 10–30% ETo): Supplemental irrigation need 10–30% of reference evapotranspiration (ETo). " +
      "Species tolerate extended dry periods between irrigation events. Infrequent deep watering supports healthy growth. " +
      "Suitable for low-water landscape zones with occasional irrigation. UC Cooperative Extension, WUCOLS IV (2014).",
  },
  {
    code: "M",
    full_name: "Medium Water Use",
    eto_range: "40–60% of ETo",
    eto_percentage_low: 40,
    eto_percentage_high: 60,
    irrigation_description:
      "Moderate regular irrigation required. Plants need consistent watering on a typical garden schedule and do not tolerate extended dry periods.",
    scientific_description:
      "M (Medium, 40–60% ETo): Supplemental irrigation need 40–60% of reference evapotranspiration (ETo). " +
      "Species require moderate, regular irrigation to maintain healthy growth. " +
      "Typical of conventional garden plants. UC Cooperative Extension, WUCOLS IV (2014).",
  },
  {
    code: "H",
    full_name: "High Water Use",
    eto_range: "70–90% of ETo",
    eto_percentage_low: 70,
    eto_percentage_high: 90,
    irrigation_description:
      "Frequent, substantial irrigation required. Plants need near-continuous soil moisture and cannot tolerate dry-down periods. These are high-maintenance water users in the landscape.",
    scientific_description:
      "H (High, 70–90% ETo): Supplemental irrigation need 70–90% of reference evapotranspiration (ETo). " +
      "Species require frequent, substantial supplemental irrigation. Sensitive to water stress; " +
      "cannot tolerate extended periods without irrigation. Generally not recommended in water-restricted landscapes. " +
      "UC Cooperative Extension, WUCOLS IV (2014).",
  },
];

export function lookupByCode(code: string): WucolsEntry | undefined {
  return WUCOLS_DATA.find((e) => e.code === code.toUpperCase());
}
