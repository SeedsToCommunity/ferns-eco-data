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
  "This source serves as a static vocabulary reference within FERNS; results are returned from built-in reference data at query time. " +
  "A query returns the full definition for a given C-value: short label, ecological meaning, " +
  "scientific description, authority, and disambiguation from related metrics. " +
  "Definitions do not change; this source is perpetually current. " +
  "Per-species C-values are not stored here — this source defines the methodology and scale only.";

export const COEFFICIENT_TECHNICAL_DETAILS =
  "Source: Static reference data. Methodology: Swink, F. and G. Wilhelm. 1994. " +
  "Plants of the Chicago Region, 4th ed. Indiana Academy of Science. " +
  "C-value assignment: integer 0–10, assigned by regional botanical authorities to native species based on ecological fidelity. " +
  "Non-native (adventive) species receive '*' and are excluded from FQA calculations. " +
  "Floristic Quality Index (FQI) = mean C-value × sqrt(species count); this source defines C-values only, not FQI. " +
  "Values defined here reflect the general Swink & Wilhelm scale. " +
  "Regional calibration: C-values are assigned independently by regional authorities; " +
  "the same species may have different C-values in different state or regional FQA databases. " +
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
  metadata_url: "/api/coefficient-of-conservatism/metadata",
  explorer_url: "/vocabulary/coefficient",
  permission_granted: COEFFICIENT_PERMISSION_GRANTED,
  permission_status: COEFFICIENT_PERMISSION_STATUS,
  general_summary: COEFFICIENT_GENERAL_SUMMARY,
  technical_details: COEFFICIENT_TECHNICAL_DETAILS,
};
