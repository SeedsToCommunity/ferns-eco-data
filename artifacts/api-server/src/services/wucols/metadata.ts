export const WUCOLS_SOURCE_ID = "wucols-water-use";

export const WUCOLS_PERMISSION_GRANTED = true;

export const WUCOLS_PERMISSION_STATUS =
  "OPEN — Static reference data. WUCOLS methodology published by the University of California Cooperative Extension. No authentication required.";

export const WUCOLS_GENERAL_SUMMARY =
  "Vocabulary reference for WUCOLS (Water Use Classifications of Landscape Species), a supplemental " +
  "irrigation classification developed by the University of California Cooperative Extension (UC CES) " +
  "and widely used by nursery professionals, landscape architects, and water agencies. " +
  "This source is maintained as static reference data by FERNS — no upstream API call is made at query time. " +
  "Four classification levels rate how much supplemental irrigation a plant needs beyond natural rainfall: " +
  "VL (Very Low, <10% ETo), L (Low, 10–30% ETo), M (Medium, 40–60% ETo), H (High, 70–90% ETo). " +
  "Scope: US, primarily calibrated for California climate zones; applicability varies elsewhere. " +
  "A query returns the full definition for a WUCOLS code: ETo percentage range, irrigation frequency " +
  "description, scientific rationale, and authority. " +
  "Definitions do not change; this source is perpetually current. " +
  "Per-species WUCOLS ratings are not stored here; the UC WUCOLS database contains species-level ratings " +
  "but is not integrated into FERNS — this source defines only the classification system itself. " +
  "WUCOLS (this source) describes managed landscape irrigation needs — it is NOT the Wetland Indicator " +
  "Status (WIS, OBL/FACW/FAC/FACU/UPL), which classifies natural wetland habitat occurrence, nor the " +
  "Coefficient of Wetness (W, -5 to +5) or Coefficient of Conservatism (C-value, 0–10) — " +
  "all of which are separate FERNS vocabulary references covering ecological, not horticultural, dimensions.";

export const WUCOLS_TECHNICAL_DETAILS =
  "Source: Static reference data. " +
  "Authority: University of California Cooperative Extension (UC CES). " +
  "Reference: Costello, L.R. et al. WUCOLS IV: Water Use Classification of Landscape Species. " +
  "UC Cooperative Extension, 2014. https://ucanr.edu/sites/WUCOLS/ " +
  "Classification method: Supplemental irrigation need expressed as fraction of reference evapotranspiration (ETo). " +
  "ETo is calculated from local climate data (temperature, humidity, wind, solar radiation) per ASCE Penman-Monteith method. " +
  "WUCOLS levels: " +
  "VL (Very Low, <10% ETo): minimal supplemental irrigation needed after establishment; drought-adapted species. " +
  "L (Low, 10–30% ETo): infrequent deep irrigation; plants tolerate dry periods between watering events. " +
  "M (Medium, 40–60% ETo): moderate regular irrigation; typical garden watering schedule. " +
  "H (High, 70–90% ETo): frequent substantial irrigation; plants require near-continuous soil moisture. " +
  "Regional note: WUCOLS ratings are calibrated for California climate zones. " +
  "The same species may have different ratings in different California climate regions (e.g., coastal vs. inland vs. desert). " +
  "This source defines the classification system; species-level ratings are outside scope. " +
  "Distinct from: " +
  "WIS (USDA NRCS NWPL): OBL/FACW/FAC/FACU/UPL — ecological classification of natural wetland habitat occurrence. Unrelated to irrigation. " +
  "W (Swink & Wilhelm FQA): -5 to +5 numeric wetland affinity scale; companion to WIS. Unrelated to irrigation. " +
  "C-value (Swink & Wilhelm FQA): 0–10 ecological fidelity scale. Unrelated to irrigation. " +
  "Method: static_data. No upstream API. No cache TTL — data is in-memory reference.";

export const WUCOLS_REGISTRY_ENTRY = {
  source_id: WUCOLS_SOURCE_ID,
  name: "WUCOLS — Water Use Classifications of Landscape Species (UC Cooperative Extension)",
  knowledge_type: "vocabulary_reference",
  status: "live",
  description:
    "Authoritative reference for WUCOLS (Water Use Classifications of Landscape Species), the UC Cooperative Extension " +
    "system for rating supplemental irrigation needs of landscape plants. Defines all four classification levels " +
    "(VL, L, M, H) by percentage of reference evapotranspiration (ETo). Includes explicit disambiguation from " +
    "Wetland Indicator Status (OBL/FACW/FAC/FACU/UPL), which is an ecological wetland classifier and not a watering guide.",
  input_summary: "WUCOLS water use code (VL, L, M, or H)",
  output_summary:
    "Full definition: code, full name, ETo percentage range, irrigation need description, scientific description, and authority",
  dependencies: [] as string[],
  update_frequency:
    "Static. WUCOLS IV (2014) classification levels are stable. Species-level ratings are updated periodically in the WUCOLS database but are outside scope of this source.",
  known_limitations:
    "Defines the WUCOLS classification system only, not per-species ratings. " +
    "WUCOLS is calibrated for California climate zones; applicability varies in other regions. " +
    "The UC WUCOLS database contains species-level ratings but is not integrated into this source.",
  metadata_url: "/api/wucols/metadata",
  explorer_url: "/vocabulary/wucols",
  permission_granted: WUCOLS_PERMISSION_GRANTED,
  permission_status: WUCOLS_PERMISSION_STATUS,
  general_summary: WUCOLS_GENERAL_SUMMARY,
  technical_details: WUCOLS_TECHNICAL_DETAILS,
};
