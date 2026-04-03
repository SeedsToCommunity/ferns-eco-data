export const WETLAND_INDICATOR_SOURCE_ID = "wetland-indicator-status";

export const WETLAND_INDICATOR_PERMISSION_GRANTED = true;

export const WETLAND_INDICATOR_PERMISSION_STATUS =
  "OPEN — Static reference data. Wetland indicator codes defined by USDA NRCS National Wetland Plant List and U.S. Army Corps of Engineers. No authentication required.";

export const WETLAND_INDICATOR_GENERAL_SUMMARY =
  "The Wetland Indicator Status (WIS) classifies plant species by their frequency of occurrence in wetland habitats. " +
  "Codes are assigned by the USDA NRCS National Wetland Plant List (NWPL) under authority of the U.S. Army Corps of Engineers (USACE). " +
  "The five national codes are: " +
  "OBL (Obligate Wetland): species occur in wetlands >99% of the time under natural conditions. Almost never found in uplands. " +
  "FACW (Facultative Wetland): species occur in wetlands 67–99% of the time. Usually found in wetlands but occasionally in uplands. " +
  "FAC (Facultative): species occur in wetlands 34–66% of the time. Equally likely in wetlands or uplands. " +
  "FACU (Facultative Upland): species occur in wetlands 1–33% of the time. Usually found in uplands but occasionally in wetlands. " +
  "UPL (Upland): species occur in wetlands <1% of the time under natural conditions. Almost never found in wetlands. " +
  "The Coefficient of Wetness (W-value) is the numeric companion to the WIS code, developed by Swink & Wilhelm for Floristic Quality Assessment. " +
  "W values map directly to WIS codes: OBL = -5, FACW = -3, FAC = 0, FACU = +3, UPL = +5. " +
  "DISAMBIGUATION: " +
  "Wetland Indicator Status (this metric) is NOT WUCOLS (Water Use Classifications of Landscape Species, VL/L/M/H). " +
  "WIS describes a plant's natural habitat hydrology in wild ecosystems. " +
  "WUCOLS describes supplemental irrigation needs in managed landscapes and gardens — it is a nursery planning tool, not an ecological classification. " +
  "WIS is NOT the Coefficient of Conservatism (C-value, 0–10), which measures ecological fidelity and disturbance tolerance, not wetland affinity.";

export const WETLAND_INDICATOR_TECHNICAL_DETAILS =
  "Source: Static reference data. " +
  "Authority: USDA NRCS National Wetland Plant List (NWPL), maintained under U.S. Army Corps of Engineers (USACE) regulatory authority. " +
  "See: https://wetland-plants.usace.army.mil/ " +
  "WIS codes — national standard: " +
  "OBL (Obligate Wetland, W=-5): >99% occurrence in wetlands under natural conditions; almost never in uplands. " +
  "FACW (Facultative Wetland, W=-3): 67–99% in wetlands; occasionally in uplands. " +
  "FAC (Facultative, W=0): 34–66% in wetlands; equal probability in either habitat type. " +
  "FACU (Facultative Upland, W=+3): 1–33% in wetlands; usually found in uplands. " +
  "UPL (Upland, W=+5): <1% in wetlands under natural conditions; almost exclusively in uplands. " +
  "W (Coefficient of Wetness): numeric, -5 to +5. Developed by Swink & Wilhelm (1994) for use in Floristic Quality Assessment (FQA). " +
  "W values are fixed by WIS code; they are not independently assigned. " +
  "Mean W-value for a plant community is calculated as the arithmetic mean of W-values of all species present. " +
  "Regional variation: USDA NRCS assigns regional ratings for species with geographically variable wetland affinity; " +
  "source data (e.g., Michigan Flora) may return compound codes such as 'FACU/UPL' reflecting regional disagreement. " +
  "Distinct from: " +
  "C-value (Swink & Wilhelm): 0–10 ecological fidelity scale; measures disturbance tolerance, not wetland affinity. " +
  "WUCOLS (UC Cooperative Extension): VL/L/M/H scale for supplemental irrigation in managed landscapes; unrelated to natural wetland ecology. " +
  "Method: static_data. No upstream API. No cache TTL — data is in-memory reference.";

export const WETLAND_INDICATOR_REGISTRY_ENTRY = {
  source_id: WETLAND_INDICATOR_SOURCE_ID,
  name: "Wetland Indicator Status & Coefficient of Wetness — USDA NRCS NWPL Reference",
  knowledge_type: "vocabulary_reference",
  status: "live",
  description:
    "Authoritative reference for the Wetland Indicator Status (WIS) codes (OBL, FACW, FAC, FACU, UPL) and their companion " +
    "Coefficient of Wetness (W) values (-5 to +5). Codes are defined by the USDA NRCS National Wetland Plant List (NWPL) " +
    "under USACE authority. Includes explicit disambiguation from WUCOLS (a landscape irrigation system, not an ecological classifier) " +
    "and from the Coefficient of Conservatism (a habitat quality metric, not a wetness measure).",
  input_summary:
    "WIS code (OBL, FACW, FAC, FACU, or UPL) or numeric W-value (-5, -3, 0, 3, or 5)",
  output_summary:
    "Full definition: code, W-value, wetland occurrence frequency range, ecological meaning, scientific description, and authority",
  dependencies: [] as string[],
  update_frequency:
    "Static. USDA NRCS NWPL codes are periodically updated for specific species, but the five-category classification system itself is stable. This source defines the classification system, not per-species ratings.",
  known_limitations:
    "Defines the national WIS classification system only. Per-species ratings are provided by individual flora sources (e.g., Michigan Flora). " +
    "Regional wetland indicator variations exist — some species have different ratings by region (e.g., 'FACU/UPL'); " +
    "this source defines the national standard only.",
  metadata_url: "/api/wetland-indicator/metadata",
  explorer_url: "/vocabulary/wetland-indicator",
  permission_granted: WETLAND_INDICATOR_PERMISSION_GRANTED,
  permission_status: WETLAND_INDICATOR_PERMISSION_STATUS,
  general_summary: WETLAND_INDICATOR_GENERAL_SUMMARY,
  technical_details: WETLAND_INDICATOR_TECHNICAL_DETAILS,
};
