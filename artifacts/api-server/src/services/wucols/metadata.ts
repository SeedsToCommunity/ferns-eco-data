export const WUCOLS_SOURCE_ID = "wucols-water-use";

export const WUCOLS_PERMISSION_GRANTED = true;

export const WUCOLS_PERMISSION_STATUS =
  "OPEN — Static reference data. WUCOLS methodology published by the University of California Cooperative Extension. No authentication required.";

export const WUCOLS_DERIVATION_SUMMARY =
  "WUCOLS (Water Use Classifications of Landscape Species) is a classification system for the supplemental irrigation needs " +
  "of landscape and garden plants. It was developed by the University of California Cooperative Extension (UC CES) " +
  "and is widely used by nursery professionals, landscape architects, and water agencies in California and adjacent regions. " +
  "WUCOLS rates plants by how much supplemental water they need beyond natural rainfall to thrive in a managed landscape, " +
  "expressed as a percentage of reference evapotranspiration (ETo). " +
  "The four classification levels are: " +
  "VL (Very Low): <10% of ETo. Plants need very little to no supplemental irrigation once established. " +
  "L (Low): 10–30% of ETo. Plants need infrequent, deep irrigation. " +
  "M (Medium): 40–60% of ETo. Plants need moderate regular irrigation. " +
  "H (High): 70–90% of ETo. Plants need frequent, substantial irrigation. " +
  "DISAMBIGUATION: " +
  "WUCOLS (this metric) is NOT the Wetland Indicator Status (WIS, OBL/FACW/FAC/FACU/UPL). " +
  "WUCOLS describes supplemental water needs in cultivated landscapes and gardens. " +
  "WIS describes a plant's natural habitat hydrology — how often the plant occurs in wetlands in the wild — and is an ecological tool, not a gardening guide. " +
  "WUCOLS is NOT the Coefficient of Wetness (W, -5 to +5), which is the numeric companion to WIS in Floristic Quality Assessment. " +
  "WUCOLS is NOT the Coefficient of Conservatism (C-value, 0–10), which measures ecological fidelity to natural habitats.";

export const WUCOLS_DERIVATION_SCIENTIFIC =
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
  explorer_url: "/wucols-explorer/",
};
