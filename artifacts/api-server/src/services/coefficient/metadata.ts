export const COEFFICIENT_SOURCE_ID = "coefficient-of-conservatism";

export const COEFFICIENT_PERMISSION_GRANTED = true;

export const COEFFICIENT_PERMISSION_STATUS =
  "OPEN — Static reference data. Methodology published by Swink & Wilhelm (1994). No authentication required.";

export const COEFFICIENT_DERIVATION_SUMMARY =
  "The Coefficient of Conservatism (C-value) is an ecological fidelity score assigned to native plant species. " +
  "It was developed by Floyd Swink and Gerould Wilhelm in 'Plants of the Chicago Region' (1994) and is used " +
  "in Floristic Quality Assessment (FQA) to evaluate habitat quality. " +
  "The scale runs from 0 to 10, assigned by botanists based on each species' tolerance of habitat disturbance " +
  "and fidelity to natural ecosystems. " +
  "0 = cosmopolitan, weedy, or highly tolerant of disturbance; grows in heavily altered habitats. " +
  "1 = tolerant; common in disturbed or degraded habitats. " +
  "2 = somewhat tolerant; occurs in both degraded and moderately intact habitats. " +
  "3 = slightly intolerant; shows mild preference for higher quality habitats. " +
  "4 = moderately conservative; prefers relatively intact habitats, found in some disturbed areas. " +
  "5 = conservative; characteristic of habitats of good ecological quality. " +
  "6 = conservative; rarely found in significantly disturbed habitats. " +
  "7 = highly conservative; found only in relatively high-quality natural communities. " +
  "8 = very highly conservative; found only in high-quality, relatively undisturbed habitats. " +
  "9 = very highly conservative; strongly associated with pristine natural communities. " +
  "10 = most conservative; restricted to pristine, undisturbed habitats. " +
  "* = non-native/adventive species; no C-value is assigned. " +
  "DISAMBIGUATION: " +
  "C-value (this metric) is NOT the Coefficient of Wetness (W, -5 to +5), which measures a species' affinity for wetland conditions. " +
  "C-value is NOT a Wetland Indicator Status code (OBL/FACW/FAC/FACU/UPL), which expresses habitat hydrology. " +
  "C-value is NOT a WUCOLS rating (VL/L/M/H), which is a landscape irrigation guide for nursery professionals. " +
  "C-values are typically calibrated regionally. This source reflects the general Swink & Wilhelm methodology " +
  "as applied in Michigan Flora. Other states may assign different C-values to the same species.";

export const COEFFICIENT_DERIVATION_SCIENTIFIC =
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
};
