export const BONAP_SOURCE_ID = "bonap-napa";

export const BONAP_DATA_VINTAGE =
  "NAPA maps: December 15, 2014. Color key documentation: February 8, 2024.";

export const BONAP_COLOR_KEY_URL = "http://www.bonap.org/MapKey.html";

export const BONAP_COLOR_KEY_IMAGE_URL = "http://www.bonap.org/Help/elements/Color%20Key.gif";

export const BONAP_PERMISSION_GRANTED = false;

export const BONAP_PERMISSION_STATUS =
  "REQUIRED — NOT YET REQUESTED. Written permission required from BONAP before any public deployment. Partnership letter drafted.";

export const BONAP_ATTRIBUTION = {
  source_name: "Biota of North America Program (BONAP)",
  maintainer: "Dr. John T. Kartesz",
  organization: "North Carolina Botanical Garden",
  website: "http://www.bonap.org",
  napa_url: "https://bonap.net/napa",
  citation_napa:
    "Kartesz, J.T., The Biota of North America Program (BONAP). 2015. North American Plant Atlas. (http://bonap.net/napa). Chapel Hill, N.C.",
  citation_tdc:
    "Kartesz, J.T., The Biota of North America Program (BONAP). 2015. Taxonomic Data Center. (http://bonap.net/tdc). Chapel Hill, N.C. [maps generated from Kartesz, J.T. 2015. Floristic Synthesis of North America, Version 1.0. Biota of North America Program (BONAP).]",
  copyright_notice:
    "All materials on this website are copyrighted and belong to the Biota of North America Program (BONAP). Reproduction or use requires advance written permission.",
};

export const BONAP_COLOR_KEY = [
  {
    code: "native_na",
    hex_approx: "#1a3a0f",
    hex_is_approximate: true,
    name: "Native to North America",
    description:
      "Species is indigenous to North America north of Mexico. State background is very dark green.",
    layer: "state_background" as const,
  },
  {
    code: "exotic_na",
    hex_approx: "#1a1a4e",
    hex_is_approximate: true,
    name: "Exotic to North America",
    description:
      "Species originates outside North America. State background is dark navy blue.",
    layer: "state_background" as const,
  },
  {
    code: "not_present",
    hex_approx: "#ffffff",
    hex_is_approximate: true,
    name: "Species not present in state",
    description:
      "Species has no recorded occurrence in this state. The entire state appears without the native/exotic background color.",
    layer: "state_background" as const,
  },
  {
    code: "native_indigenous_state",
    hex_approx: "#5c9e3a",
    hex_is_approximate: true,
    name: "Native and indigenous to this state",
    description:
      "Species is native to North America and indigenous to this specific state. Distinct from the state background color and from counties where the species is merely adventive or incidentally present.",
    layer: "county_fill" as const,
  },
  {
    code: "present_not_rare",
    hex_approx: "#2e7d32",
    hex_is_approximate: true,
    name: "Present and not rare",
    description:
      "Species is recorded in this county and is not considered rare there.",
    layer: "county_fill" as const,
  },
  {
    code: "present_rare",
    hex_approx: "#f9a825",
    hex_is_approximate: true,
    name: "Present and rare",
    description:
      "Species is recorded in this county but is considered rare within the state.",
    layer: "county_fill" as const,
  },
  {
    code: "extinct",
    hex_approx: "#9e9e9e",
    hex_is_approximate: true,
    name: "Extinct",
    description:
      "Species was historically present in this county but is now extinct.",
    layer: "county_fill" as const,
  },
  {
    code: "adventive",
    hex_approx: "#00796b",
    hex_is_approximate: true,
    name: "Adventive",
    description:
      "Species is native to North America but not indigenous to this state. It has naturalized without deliberate planting. BONAP's term for what others call 'introduced-naturalized.'",
    layer: "county_fill" as const,
  },
  {
    code: "waif",
    hex_approx: "#f8bbd0",
    hex_is_approximate: true,
    name: "Waif",
    description:
      "Species has been found casually but does not maintain a self-sustaining population.",
    layer: "county_fill" as const,
  },
  {
    code: "noxious",
    hex_approx: "#bf360c",
    hex_is_approximate: true,
    name: "Noxious",
    description:
      "Species is designated as a noxious weed in this state (includes noxious-weed seeds).",
    layer: "county_fill" as const,
  },
  {
    code: "eradicated",
    hex_approx: "#6d4c41",
    hex_is_approximate: true,
    name: "Eradicated",
    description:
      "Species was present but has been deliberately eradicated.",
    layer: "county_fill" as const,
  },
  {
    code: "native_extirpated",
    hex_approx: "#e65100",
    hex_is_approximate: true,
    name: "Native but extirpated/historic",
    description:
      "Species is native to North America and was historically present in this county but has not been documented in recent years.",
    layer: "county_fill" as const,
  },
  {
    code: "exotic_present",
    hex_approx: "#1565c0",
    hex_is_approximate: true,
    name: "Exotic and present",
    description:
      "Species is exotic to North America and is currently present in this county.",
    layer: "county_fill" as const,
  },
  {
    code: "questionable",
    hex_approx: "#bdbdbd",
    hex_is_approximate: true,
    name: "Questionable presence (cross-hatched)",
    description:
      "County record exists but presence is uncertain. Displayed with cross-hatching rather than a solid fill.",
    layer: "county_fill" as const,
  },
];

export const BONAP_GENERAL_SUMMARY =
  "Distribution data from the Biota of North America Program (BONAP) North American Plant Atlas (NAPA). " +
  "BONAP maps show which U.S. counties a vascular plant species has been recorded in, based on vouchered herbarium " +
  "specimens — physical plant samples deposited in scientific collections. Colors indicate nativity status, rarity, " +
  "and presence type. Data was last updated December 15, 2014. FERNS provides the map URL pointing to BONAP's " +
  "server; no image is stored or proxied.";

export const BONAP_TECHNICAL_DETAILS =
  "Source: Kartesz, J.T., The Biota of North America Program (BONAP). 2015. North American Plant Atlas. " +
  "(http://bonap.net/napa). Chapel Hill, N.C. [maps generated from Kartesz, J.T. 2015. Floristic Synthesis of " +
  "North America, Version 1.0. Biota of North America Program (BONAP).] " +
  "NAPA county-level distribution data is compiled from nearly four million vouchered herbarium specimens " +
  "and covers approximately 28,000 accepted vascular plant taxa in North America north of Mexico. " +
  "Records are vetted for taxonomic accuracy against BONAP's annually updated nomenclature. False reports " +
  "(approximately 175,000 known erroneous occurrence records) are tracked and mapped separately. " +
  "County-level presence/absence and status (native, adventive, exotic, rare, noxious, extirpated, waif, " +
  "extinct) are determined from the compiled and vetted specimen record. NAPA maps were published as a " +
  "batch in December 2014. Method: api_fetch (HTTP GET to BONAP MapGallery URL; image presence verified " +
  "by Content-Type: image/png in HTTP response). Copyright: All materials copyrighted by BONAP; advance " +
  "written permission required for reproduction. Permission not yet granted.";

export const BONAP_REGISTRY_ENTRY = {
  source_id: BONAP_SOURCE_ID,
  name: "BONAP North American Plant Atlas — Distribution Maps",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Plant distribution maps from the Biota of North America Program (BONAP). Shows which U.S. counties a vascular plant species has been recorded in, based on vouchered herbarium specimens. Colors show whether the species is native, rare, adventive, or exotic in each county. Data covers roughly 28,000 plant taxa across the continental US and Canada.",
  input_summary:
    "Genus name (required) + species epithet (required) + map type (county_species or state_species)",
  output_summary:
    "Map URL pointing to BONAP's PNG image on their server, color key metadata, color key image URL, data vintage, full attribution and copyright notice",
  dependencies: [] as string[],
  update_frequency:
    "Static. NAPA maps last updated December 2014. Not updated since. No update notification mechanism exists.",
  known_limitations:
    "Data vintage 2014. No subspecies-level maps. Family-level maps exist at bonap.net but are not implemented. Color key hex codes are approximate. Written permission from BONAP is required before public deployment — not yet obtained.",
  metadata_url: "/api/bonap/metadata",
  explorer_url: "/source/bonap-napa",
  permission_granted: BONAP_PERMISSION_GRANTED,
  permission_status: BONAP_PERMISSION_STATUS,
  general_summary: BONAP_GENERAL_SUMMARY,
  technical_details: BONAP_TECHNICAL_DETAILS,
};
