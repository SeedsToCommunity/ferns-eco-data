export const ANN_ARBOR_NPN_SOURCE_ID = "ann-arbor-npn";

export const ANN_ARBOR_NPN_LICENSES = ["cc-by"];

export const ANN_ARBOR_NPN_LICENSE_NOTES =
  "NOT REQUESTED — The Native Plant Nursery (nativeplant.com) is a small Ann Arbor nursery operated " +
  "by Greg Vaclavek. FERNS imports and caches Greg's species data locally for research and " +
  "ecological commons purposes. No formal data-sharing agreement has been established. " +
  "Callers should cite Greg Vaclavek / The Native Plant Nursery (nativeplant.com) when using this data.";

export const ANN_ARBOR_NPN_GENERAL_SUMMARY =
  "The Native Plant Nursery (NPN), Ann Arbor, Michigan — operated by Greg Vaclavek — " +
  "maintains a curated database of Michigan native plants available at nativeplant.com. " +
  "The dataset covers 130 species with ecological attributes (light, moisture, height, " +
  "flowering time, flower color, growth form, conservatism/wetness/shade coefficients, " +
  "notes, range within Michigan) and nursery availability. " +
  "Each species record is identified by a short acronym (e.g. ANDGER for Andropogon gerardii) " +
  "and includes common and Latin names, an optional Latin synonym, and a series of images " +
  "with captions — photographs and pen-and-ink drawings. " +
  "FERNS holds a static in-memory snapshot of the full inventory captured on 2026-06-01, " +
  "enabling lookup by acronym, Latin name, Latin synonym, or any common name. " +
  "A name-groups endpoint returns all species organized by accepted key for cross-source reconciliation. " +
  "Images are hosted on Cloudinary CDN (folder: ann-arbor-npn/{acronym}/{position}). " +
  "Greg's nativeplant.com site is no longer actively updated; this snapshot is the definitive FERNS record.";

export const ANN_ARBOR_NPN_TECHNICAL_DETAILS =
  "Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database. " +
  "Source status: defunct upstream — Greg's nativeplant.com site is no longer updated. " +
  "No further scrapes or re-imports will be performed; this is a permanent static snapshot. " +
  "Snapshot date: 2026-06-01. Data is held in-process as an Internal Data Provider (IDP) " +
  "within EC FERNS — no DB table, no TTL, no cache layer. " +
  "130 species, each identified by a short acronym (e.g. ANDGER for Andropogon gerardii). " +
  "Carex species use CX prefix instead of CAR (e.g. CXPENS for Carex pensylvanica). " +
  "Fields per species: acronym (PK), latin_name, latin_synonym_greg (Greg's own taxonomy — " +
  "may differ from GBIF or USDA PLANTS), common_name (semicolon/comma-delimited), " +
  "light, moisture, height, flowering_time, flower_color, growth_form (Forb/Grass/Sedge/Shrub/Tree/Vine), " +
  "conservatism_coefficient (C score), wetness_coefficient (W score — signed, can be negative), " +
  "shade_coefficient (S score — signed, can be negative), " +
  "notes, range_michigan text[] (SE/SW/NL/UP vocabulary), npn_price_sizes, " +
  "images (array of {position, url, caption, kind}), source_url. " +
  "Alias index: every species is indexed by acronym + latin_name + latin_synonym_greg (where present) " +
  "+ common names (split on ; and ,). Lookup endpoint resolves any alias case-insensitively. " +
  "Image kind inference: caption containing 'pen & ink' or 'drawing' → 'drawing'; else 'photograph'. " +
  "Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}). " +
  "HIEVEN (Hieracium venosum) has no height or notes — minimal data entry in Greg's system. " +
  "CLEVIR, HIEVEN, and LIASCA were absent from early imports due to an HTML parser bug; " +
  "corrected before snapshot was taken. " +
  "Column mapping note: nativeplant.com report merges light+moisture into one cell; " +
  "light and moisture were parsed separately from per-species detail pages during capture.";

export const ANN_ARBOR_NPN_REGISTRY_ENTRY = {
  source_id: ANN_ARBOR_NPN_SOURCE_ID,
  name: "Ann Arbor Native Plant Nursery",
  knowledge_type: "dataset",
  status: "live",
  description:
    "Michigan native plant species database from The Native Plant Nursery (nativeplant.com), " +
    "Ann Arbor, MI, operated by Greg Vaclavek. Covers 130 species with ecological attributes, " +
    "nursery availability, and species images (photographs and pen-and-ink drawings).",
  input_summary:
    "Acronym (e.g. ANDGER), Latin name, Latin synonym, or any common name (any capitalization)",
  output_summary:
    "Species record with light, moisture, height, flowering time, flower color, growth form " +
    "(Forb/Grass/Sedge/Shrub/Tree/Vine), conservatism coefficient (C), wetness coefficient (W), " +
    "shade coefficient (S), notes, Michigan range, and Cloudinary image URLs with captions and kind (photograph/drawing)",
  dependencies: [] as string[],
  update_frequency:
    "Static snapshot — Greg's nativeplant.com site is no longer updated. " +
    "Data was captured on 2026-06-01 and will not be re-imported.",
  known_limitations:
    "130 species — Michigan native focus, narrower than regional floras. " +
    "latin_synonym_greg reflects Greg's own nomenclature and may not align with GBIF or USDA PLANTS. " +
    "HIEVEN has no height or notes — minimal data entry in Greg's system. " +
    "No formal data-sharing agreement — cite Greg Vaclavek / nativeplant.com when using this data. " +
    "Carex species use CX prefix (not CAR) in acronyms.",
  metadata_url: "/api/ann-arbor-npn/metadata",
  licenses: ANN_ARBOR_NPN_LICENSES,
  license_notes: ANN_ARBOR_NPN_LICENSE_NOTES,
  general_summary: ANN_ARBOR_NPN_GENERAL_SUMMARY,
  technical_details: ANN_ARBOR_NPN_TECHNICAL_DETAILS,
  non_passthrough_endpoints: [
    { endpoint: "/api/ann-arbor-npn/metadata", kind: "metadata" },
    { endpoint: "/api/ann-arbor-npn/species-list", kind: "in_memory" },
    { endpoint: "/api/ann-arbor-npn/species/{key}", kind: "in_memory" },
    { endpoint: "/api/ann-arbor-npn/species/{key}/source-url", kind: "in_memory" },
    { endpoint: "/api/ann-arbor-npn/name-groups", kind: "in_memory" },
    { endpoint: "/api/ann-arbor-npn/documentation", kind: "in_memory" },
  ],
  permission_granted: false,
  license: "All rights reserved — The Native Plant Nursery (nativeplant.com), Greg Vaclavek. No formal data-sharing agreement established. See https://www.nativeplant.com/",
  rights:
    "NOT REQUESTED — The Native Plant Nursery (nativeplant.com) is a small Ann Arbor nursery operated by Greg Vaclavek. " +
    "No formal data-sharing agreement has been established. Cite Greg Vaclavek / The Native Plant Nursery (nativeplant.com) when using this data.",
  website_url_patterns: {
    species: "https://www.nativeplant.com/plant-profile/{acronym}",
  },
};
