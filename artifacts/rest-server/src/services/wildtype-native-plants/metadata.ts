export const WILDTYPE_NATIVE_PLANTS_SOURCE_ID = "wildtype-native-plants";

export const WILDTYPE_NATIVE_PLANTS_LICENSES = ["cc0"];

export const WILDTYPE_NATIVE_PLANTS_LICENSE_NOTES =
  "GRANTED — Bill Schneider of WildType Native Plants confirmed permission to use the cultural guide. " +
  "Licensed CC0 unless WildType states otherwise.";

export const WILDTYPE_NATIVE_PLANTS_GENERAL_SUMMARY =
  "WildType Native Plants (Mason, MI) is a Michigan-genotype native plant nursery and ecological services operation " +
  "founded in 1996 by Bill Schneider (University of Michigan, 1993), specializing in trees, shrubs, grasses, wildflowers, " +
  "and emergent wetland species native to Michigan. " +
  "Their cultural guide covers 249 native plant species across four categories — wildflowers, grasses/sedges/rushes, " +
  "ferns, and trees/shrubs/vines — providing per-species growing information: sun and moisture preferences, " +
  "bloom color and timing, height, and structured ecological notes such as pollinator value, larval host status, " +
  "wetland classification, and spreading or opportunistic behavior. " +
  "Imported from WildType's published cultural guide. " +
  "A query to the plant guide returns all records (with optional category filter) or a single species record " +
  "by scientific name; the note-codes endpoint returns the full legend of 24 ecological codes and their descriptions. " +
  "The data reflects the ingested edition of the cultural guide; updates to WildType's catalog require a " +
  "service update to incorporate. " +
  "Known limitations: this is a nursery cultural guide, not a scientific flora; bloom time and height are given as ranges " +
  "(e.g. \"Jul–Aug\", \"2'–3'\"), not structured numeric values; some entries include plants that are tagged as not Michigan-genotype " +
  "(\"not a MI genotype\") or not Michigan-native (\"nearly native\").";

export const WILDTYPE_NATIVE_PLANTS_TECHNICAL_DETAILS =
  "Source: WildType Native Plants, Ecological Services Ltd., 900 N. Every Road, Mason, MI 48854 (wildtypeplants.com). " +
  "Founded 1996 by Bill Schneider (University of Michigan School of Natural Resources and Environment, 1993). " +
  "Permission: granted by Bill Schneider; licensed CC0 unless WildType states otherwise. " +
  "Data source: WildType cultural guide (249 plant records). " +
  "Method: static_data. No upstream API; no runtime network calls. " +
  "DB schema: none — no database tables; data is compiled into the service directly. " +
  "Caching: not applicable — data is served directly from the compiled service with no cache layer. " +
  "Fields per record: scientific_name, common_name, category (wildflowers | grasses, sedges, rushes | ferns | trees, shrubs & vines), " +
  "flower_color, bloom_time (string range, e.g. \"Jul-Aug\"), sun_full / sun_part / sun_shade (boolean), sun_summary (string), " +
  "height (string range, e.g. \"2'-3'\"), moisture_dry / moisture_average / moisture_wet (boolean), moisture_summary (string), " +
  "notes (array of code-description pairs, one per ecological note; empty array if none). " +
  "Coverage: 249 records; Michigan native plants; 4 categories. " +
  "Lookup: case-insensitive exact match on scientific_name. No fuzzy matching, no synonym resolution. " +
  "Deliberate scope exclusions: this source covers the cultural guide only. " +
  "Known limitations: taxonomy follows WildType nursery usage; " +
  "bloom time and height are preserved as string ranges, not structured numeric values.";

export const WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY = {
  source_id: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
  name: "WildType Native Plants — Michigan Native Plant Cultural Guide",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Growing conditions, bloom data, sun and moisture preferences, and ecological notes " +
    "(pollinator value, larval host status, wetland classification, spreading behavior) for 249 Michigan native plants — " +
    "wildflowers, grasses, sedges, ferns, trees, and shrubs. " +
    "From WildType Native Plants (Mason, MI), a Michigan-genotype nursery and ecological services operation " +
    "founded in 1996.",
  input_summary:
    "Optional category filter (wildflowers, grasses/sedges/rushes, ferns, trees/shrubs/vines) for the full guide; " +
    "scientific name for single-species lookup; no input required for the note-codes legend.",
  output_summary:
    "Per-species records with scientific name, common name, category, flower color, bloom time, sun and moisture " +
    "preferences, height, and structured ecological notes (code + description pairs); or the full 24-code legend.",
  dependencies: [] as string[],
  update_frequency:
    "Static. The WildType cultural guide is a periodic nursery publication. " +
    "Requires a FERNS service update to incorporate a new edition.",
  known_limitations:
    "Nursery cultural guide only — not a scientific flora. " +
    "No distribution data, conservation rankings, or Coefficient of Conservatism values. " +
    "Taxonomy follows WildType's nursery usage and is not reconciled to BONAP, GBIF, or Michigan Flora. " +
    "Some entries are flagged \"not a MI genotype\" or \"nearly native\" — verbatim source flags, not FERNS classifications. " +
    "Bloom time and height are preserved as string ranges (e.g. \"Jul-Aug\", \"2'-3'\"), not structured numeric values. " +
    "S (clonal) is a nursery-specific code variant not documented in the PDF key.",
  metadata_url: "/api/wildtype-native-plants/metadata",
  licenses: WILDTYPE_NATIVE_PLANTS_LICENSES,
  license_notes: WILDTYPE_NATIVE_PLANTS_LICENSE_NOTES,
  general_summary: WILDTYPE_NATIVE_PLANTS_GENERAL_SUMMARY,
  technical_details: WILDTYPE_NATIVE_PLANTS_TECHNICAL_DETAILS,
  permission_granted: true,
  non_passthrough_endpoints: [
    { endpoint: "/api/wildtype-native-plants/metadata", kind: "metadata" },
    { endpoint: "/api/wildtype-native-plants/plant-guide", kind: "in_memory" },
    { endpoint: "/api/wildtype-native-plants/plant-guide/:scientific_name", kind: "in_memory" },
    { endpoint: "/api/wildtype-native-plants/note-codes", kind: "in_memory" },
  ],
};
