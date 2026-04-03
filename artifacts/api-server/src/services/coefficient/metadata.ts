export const COEFFICIENT_SOURCE_ID = "coefficient-of-conservatism";

export const COEFFICIENT_PERMISSION_GRANTED = true;

export const COEFFICIENT_PERMISSION_STATUS =
  "OPEN — Static reference data. Methodology published by Swink & Wilhelm (1994). No authentication required.";

export const COEFFICIENT_GENERAL_SUMMARY =
  "Vocabulary reference for the Coefficient of Conservatism (C-value), an ecological fidelity score " +
  "developed by Floyd Swink and Gerould Wilhelm in 'Plants of the Chicago Region' (1994) and used " +
  "in Floristic Quality Assessment (FQA) to evaluate habitat quality. " +
  "This source is maintained as static reference data by FERNS — no upstream institution or API. " +
  "Scale: 0 (cosmopolitan, disturbance-tolerant) to 10 (restricted to pristine habitats); " +
  "'*' = non-native/adventive species for which no C-value is assigned. " +
  "Geographic and taxonomic scope: global methodology, but C-values are always calibrated regionally " +
  "by local botanical authorities — the same species may have different values in different regions. " +
  "This source serves as an in-memory vocabulary reference; no API call is made at query time. " +
  "A query returns the full definition for a given C-value: short label, ecological meaning, " +
  "scientific description, authority, and disambiguation from related metrics. " +
  "Definitions do not change; this source is perpetually current. " +
  "Per-species C-values are not stored here — they are accessed from Michigan Flora (c field) " +
  "or Universal FQA regional databases; this source defines the 0–10 scale those services apply. " +
  "C-value (this source) is NOT the Coefficient of Wetness (W, -5 to +5) defined by Wetland Indicator " +
  "Status, NOT a Wetland Indicator Status code (OBL/FACW etc.), and NOT a WUCOLS irrigation rating — " +
  "all three of these are separate FERNS vocabulary references covering distinct ecological dimensions.";

export const COEFFICIENT_TECHNICAL_DETAILS =
  "Source: Static reference data. Methodology: Swink, F. and G. Wilhelm. 1994. " +
  "Plants of the Chicago Region, 4th ed. Indiana Academy of Science. " +
  "C-value assignment: integer 0–10, assigned by regional botanical authorities to native species based on ecological fidelity. " +
  "Non-native (adventive) species receive '*' and are excluded from FQA calculations. " +
  "Floristic Quality Index (FQI) = mean C-value × sqrt(species count); this source defines C-values only, not FQI. " +
  "Values defined here reflect the general Swink & Wilhelm scale used by Michigan Flora. " +
  "Regional calibration: C-values are assigned independently by regional authorities; " +
  "the same species may have different C-values in different state or regional FQA databases. " +
  "Distinct from: " +
  "W (Coefficient of Wetness, Swink & Wilhelm): -5 to +5 numeric scale measuring wetland affinity. " +
  "WIS (Wetland Indicator Status, USDA NRCS NWPL): OBL/FACW/FAC/FACU/UPL categorical codes. " +
  "WUCOLS (UC Cooperative Extension): VL/L/M/H scale for managed landscape irrigation planning. " +
  "Method: static_data. No upstream API. No cache TTL — data is in-memory reference.";

export const COEFFICIENT_REGISTRY_ENTRY = {
  source_id: COEFFICIENT_SOURCE_ID,
  name: "Coefficient of Conservatism — Floristic Quality Assessment C-Value Reference",
  knowledge_type: "vocabulary_reference",
  status: "live",
  description:
    "Authoritative reference for the Coefficient of Conservatism (C-value) scale used in Floristic Quality Assessment (FQA). " +
    "Defines all 12 possible values (0–10 and '*' for non-natives), their ecological meaning, and the Swink & Wilhelm methodology. " +
    "Includes explicit disambiguation from the Coefficient of Wetness (W, -5 to +5), Wetland Indicator Status (OBL/FACW/FAC/FACU/UPL), " +
    "and WUCOLS water use ratings (VL/L/M/H), which are frequently confused with C-values.",
  input_summary: "Numeric C-value (0–10) or '*' for non-native species",
  output_summary:
    "Full ecological definition: value, short label, ecological meaning, scientific description, authority, and disambiguation from related metrics",
  dependencies: [] as string[],
  update_frequency:
    "Static. Swink & Wilhelm (1994) methodology; definitions do not change. Regional C-value calibrations may vary but are outside scope of this source.",
  known_limitations:
    "C-values are calibrated regionally. This source reflects the general Swink & Wilhelm methodology. " +
    "Some states assign different C-values to the same species. Per-species C-value lookup is outside scope — " +
    "species-level values are provided by individual flora sources (e.g., Michigan Flora).",
  metadata_url: "/api/coefficient/metadata",
  explorer_url: "/vocabulary/coefficient",
  permission_granted: COEFFICIENT_PERMISSION_GRANTED,
  permission_status: COEFFICIENT_PERMISSION_STATUS,
  general_summary: COEFFICIENT_GENERAL_SUMMARY,
  technical_details: COEFFICIENT_TECHNICAL_DETAILS,
};
