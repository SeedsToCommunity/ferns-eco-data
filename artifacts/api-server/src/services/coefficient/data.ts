export interface CoefficientEntry {
  value: string;
  short_label: string;
  ecological_meaning: string;
  scientific_description: string;
  is_native: boolean;
}

export const COEFFICIENT_DATA: CoefficientEntry[] = [
  {
    value: "*",
    short_label: "Non-native / Adventive",
    ecological_meaning:
      "Non-native or adventive species. No C-value is assigned. These species are introduced to the region and are excluded from Floristic Quality Index calculations.",
    scientific_description:
      "Non-native (adventive) species per Swink & Wilhelm (1994). C-value assignment applies only to species indigenous to the region. Adventive species are not evaluated for ecological fidelity or disturbance tolerance.",
    is_native: false,
  },
  {
    value: "0",
    short_label: "Cosmopolitan / Weedy",
    ecological_meaning:
      "Highly tolerant of disturbance. Occurs in heavily altered, degraded, or disturbed habitats. These are cosmopolitan, weedy species that persist under almost any conditions.",
    scientific_description:
      "C=0: Species with no fidelity to natural or near-natural plant communities. Occurs across a broad range of disturbed, degraded, and altered habitats. Characteristic of roadsides, waste areas, heavily grazed land, and highly disturbed natural areas.",
    is_native: true,
  },
  {
    value: "1",
    short_label: "Tolerant",
    ecological_meaning:
      "Tolerant of significant disturbance. Common in degraded habitats. Low ecological fidelity to natural plant communities.",
    scientific_description:
      "C=1: Species with very low fidelity to natural plant communities. Occurs commonly in disturbed and degraded habitats. May appear in natural areas where some disturbance has occurred.",
    is_native: true,
  },
  {
    value: "2",
    short_label: "Somewhat Tolerant",
    ecological_meaning:
      "Somewhat tolerant of disturbance. Occurs in both degraded and moderately intact habitats. May be found at disturbed edges of natural communities.",
    scientific_description:
      "C=2: Species with low fidelity to high-quality natural communities. Found in moderately disturbed habitats as well as intact areas. Not strongly indicative of habitat quality.",
    is_native: true,
  },
  {
    value: "3",
    short_label: "Slightly Conservative",
    ecological_meaning:
      "Slightly intolerant of disturbance. Shows a mild preference for higher quality habitats but may persist in moderately disturbed areas.",
    scientific_description:
      "C=3: Species with moderate-low fidelity to natural plant communities. Occurs in habitats spanning a range of quality. Presence does not strongly indicate high ecological integrity.",
    is_native: true,
  },
  {
    value: "4",
    short_label: "Moderately Conservative",
    ecological_meaning:
      "Moderately conservative. Prefers relatively intact habitats but can be found in some disturbed areas. Indicates moderate habitat quality.",
    scientific_description:
      "C=4: Species with moderate fidelity to natural plant communities. Found primarily in habitats of intermediate to good quality. Occasional occurrence in disturbed habitats.",
    is_native: true,
  },
  {
    value: "5",
    short_label: "Conservative",
    ecological_meaning:
      "Conservative. Characteristic of habitats of good ecological quality. Presence indicates meaningful habitat integrity.",
    scientific_description:
      "C=5: Species with moderate-high fidelity to natural plant communities. Characteristic of habitats in good ecological condition. Unusual in significantly disturbed areas.",
    is_native: true,
  },
  {
    value: "6",
    short_label: "Conservative",
    ecological_meaning:
      "Conservative. Rarely found in significantly disturbed habitats. A reliable indicator of good to high habitat quality.",
    scientific_description:
      "C=6: Species with high fidelity to natural plant communities. Strongly associated with habitats in good ecological condition. Rarely persists in significantly disturbed areas.",
    is_native: true,
  },
  {
    value: "7",
    short_label: "Highly Conservative",
    ecological_meaning:
      "Highly conservative. Found only in relatively high-quality natural habitats. A strong indicator of ecological integrity.",
    scientific_description:
      "C=7: Species with very high fidelity to natural, relatively undisturbed plant communities. Presence is a reliable indicator of high ecological quality. Almost absent from disturbed habitats.",
    is_native: true,
  },
  {
    value: "8",
    short_label: "Very Highly Conservative",
    ecological_meaning:
      "Very highly conservative. Found only in high-quality, relatively undisturbed habitats. Strongly indicative of pristine natural communities.",
    scientific_description:
      "C=8: Species with very high fidelity to high-quality natural plant communities. Characteristic of undisturbed or minimally disturbed habitats of exceptional ecological condition.",
    is_native: true,
  },
  {
    value: "9",
    short_label: "Very Highly Conservative",
    ecological_meaning:
      "Very highly conservative. Strongly associated with pristine natural communities. Presence signals exceptional habitat quality.",
    scientific_description:
      "C=9: Species with near-absolute fidelity to pristine natural plant communities. Occurrence outside of high-quality habitats is exceptional. A sensitive indicator of ecological condition.",
    is_native: true,
  },
  {
    value: "10",
    short_label: "Most Conservative",
    ecological_meaning:
      "Most conservative. Restricted to pristine, undisturbed habitats. These species do not tolerate disturbance and are the most demanding indicators of ecological quality.",
    scientific_description:
      "C=10: Species with absolute fidelity to pristine natural plant communities. Restricted to habitats of the highest ecological quality with no meaningful disturbance history. The most sensitive ecological indicators in the Swink & Wilhelm FQA system.",
    is_native: true,
  },
];

export function lookupByValue(value: string): CoefficientEntry | undefined {
  return COEFFICIENT_DATA.find((e) => e.value === value);
}
