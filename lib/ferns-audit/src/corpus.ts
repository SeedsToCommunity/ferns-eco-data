export interface TestSpecies {
  name: string;
  genus: string;
  species: string;
  label: string;
}

export interface TestPlace {
  id: number;
  name: string;
}

export interface TestPlaceQuery {
  q: string;
  label: string;
  expectedFirstName?: string;
}

export interface TestVocabularyEntry {
  key: string;
  label: string;
  expectedFields?: Record<string, unknown>;
}

export interface TestAssessment {
  id: number;
  label: string;
  databaseId?: number;
}

export const TEST_SPECIES: TestSpecies[] = [
  { name: "Quercus rubra", genus: "Quercus", species: "rubra", label: "Red oak" },
  { name: "Trillium grandiflorum", genus: "Trillium", species: "grandiflorum", label: "White trillium" },
  { name: "Asclepias tuberosa", genus: "Asclepias", species: "tuberosa", label: "Butterfly weed" },
];

export const TEST_PLACES: TestPlace[] = [
  { id: 10, name: "Michigan" },
  { id: 2423, name: "Washtenaw County, MI" },
];

export const TEST_PLACE_QUERIES: TestPlaceQuery[] = [
  { q: "Michigan", label: "Michigan state place search" },
  { q: "Washtenaw County", label: "Washtenaw County place search" },
];

export const TEST_GBIF_SEARCHES: Array<{ q: string; label: string }> = [
  { q: "red oak", label: "Red oak vernacular search" },
  { q: "trillium", label: "Trillium vernacular search" },
];

export const TEST_COEFFICIENT_VALUES: TestVocabularyEntry[] = [
  {
    key: "0",
    label: "C=0 (disturbance-tolerant species)",
    expectedFields: { value: "0" },
  },
  {
    key: "5",
    label: "C=5 (average fidelity to intact communities)",
    expectedFields: { value: "5" },
  },
  {
    key: "10",
    label: "C=10 (highest fidelity — least disturbed communities)",
    expectedFields: { value: "10" },
  },
  {
    key: "*",
    label: "C=* (non-native / adventive species)",
    expectedFields: { value: "*" },
  },
];

export const TEST_WETLAND_CODES: TestVocabularyEntry[] = [
  {
    key: "OBL",
    label: "OBL (Obligate Wetland)",
    expectedFields: { code: "OBL", w_value: -5, full_name: "Obligate Wetland" },
  },
  {
    key: "FACW",
    label: "FACW (Facultative Wetland)",
    expectedFields: { code: "FACW", w_value: -3, full_name: "Facultative Wetland" },
  },
  {
    key: "FAC",
    label: "FAC (Facultative)",
    expectedFields: { code: "FAC", w_value: 0, full_name: "Facultative" },
  },
  {
    key: "FACU",
    label: "FACU (Facultative Upland)",
    expectedFields: { code: "FACU", w_value: 3, full_name: "Facultative Upland" },
  },
  {
    key: "UPL",
    label: "UPL (Obligate Upland)",
    expectedFields: { code: "UPL", w_value: 5, full_name: "Obligate Upland" },
  },
];

export interface TestWetlandWValue {
  value: number;
  label: string;
  expectedCode: string;
  expectedFullName: string;
}

export const TEST_WETLAND_W_VALUES: TestWetlandWValue[] = [
  { value: -5, label: "W=-5 → OBL", expectedCode: "OBL", expectedFullName: "Obligate Wetland" },
  { value: -3, label: "W=-3 → FACW", expectedCode: "FACW", expectedFullName: "Facultative Wetland" },
  { value: 0, label: "W=0 → FAC", expectedCode: "FAC", expectedFullName: "Facultative" },
  { value: 3, label: "W=3 → FACU", expectedCode: "FACU", expectedFullName: "Facultative Upland" },
  { value: 5, label: "W=5 → UPL", expectedCode: "UPL", expectedFullName: "Obligate Upland" },
];

export const TEST_WUCOLS_CODES: TestVocabularyEntry[] = [
  {
    key: "VL",
    label: "VL (Very Low water use)",
    expectedFields: { code: "VL", full_name: "Very Low Water Use" },
  },
  {
    key: "L",
    label: "L (Low water use)",
    expectedFields: { code: "L", full_name: "Low Water Use" },
  },
  {
    key: "M",
    label: "M (Moderate water use)",
    expectedFields: { code: "M", full_name: "Moderate Water Use" },
  },
  {
    key: "H",
    label: "H (High water use)",
    expectedFields: { code: "H", full_name: "High Water Use" },
  },
];

export const TEST_S2C_YEARS: number[] = [2023, 2024, 2025, 2026];

export const TEST_UFQA_ASSESSMENTS: TestAssessment[] = [
  { id: 37736, label: "Assessment 37736 (KCG-Well Connect RLY, Chicago Region, public)", databaseId: 1 },
];

export const FERNS_ENVELOPE_FIELDS = new Set([
  "found",
  "provenance",
  "source_url",
  "queried_at",
  "cache_status",
]);
