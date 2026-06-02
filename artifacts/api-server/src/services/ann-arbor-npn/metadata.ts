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
  "FERNS imports the full inventory into a local PostgreSQL database and serves it via structured API endpoints, " +
  "enabling lookup by acronym, Latin name, Latin synonym, or any common name. " +
  "A name-groups endpoint returns all species organized by accepted key for cross-source reconciliation. " +
  "Images are hosted on Cloudinary CDN (folder: ann-arbor-npn/{acronym}/{position}).";

export const ANN_ARBOR_NPN_TECHNICAL_DETAILS =
  "Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database. " +
  "Import method: admin-gated POST /api/ann-arbor-npn/import; auto-import at startup if table is empty. " +
  "DB tables: npn_species (PK: acronym text; fields: latin_name, latin_synonym_greg, common_name, " +
  "light, moisture, height, flowering_time, flower_color, growth_form, " +
  "conservatism_coefficient (C score), wetness_coefficient (W score — signed, can be negative), " +
  "shade_coefficient (S score — signed, can be negative), " +
  "notes, range_michigan text[] (migration 0009), npn_price_sizes, " +
  "images jsonb array of {position, url, caption, kind}, source_url, scraped_at); " +
  "npn_name_aliases (PK: alias text; FK: acronym → npn_species). " +
  "Column mapping note: the report page merges light+moisture into one cell; " +
  "light and moisture are parsed separately from per-species detail pages. " +
  "Alias index: acronym + latin_name + latin_synonym_greg (where present) + common names (split on ; and ,). " +
  "Image kind inference: caption containing 'pen & ink' or 'drawing' → 'drawing'; else 'photograph'. " +
  "Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}). " +
  "Carex species use CX prefix instead of CAR (e.g. CXPENS for Carex pensylvanica). " +
  "Lookup endpoint (GET /api/ann-arbor-npn/species/:key) accepts any name flavor and resolves via alias table. " +
  "Bulk endpoint (GET /api/ann-arbor-npn/species) returns all 130 species. " +
  "Names endpoint (GET /api/ann-arbor-npn/names) returns name groups with all_accepted_keys for reconciliation. " +
  "HIEVEN (Hieracium venosum) has no height or notes — minimal data entry in Greg's system. " +
  "CLEVIR, HIEVEN, and LIASCA were absent from early DB imports due to an HTML parser bug; " +
  "corrected in migration 0018 (data) and images scraped and uploaded to Cloudinary in the same pass.";

export const ANN_ARBOR_NPN_REGISTRY_ENTRY = {
  source_id: ANN_ARBOR_NPN_SOURCE_ID,
  name: "Ann Arbor Native Plant Nursery",
  knowledge_type: "source_wrapper" as const,
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
    "Data was captured once and will not be re-imported.",
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
    { endpoint: "/api/ann-arbor-npn/species", kind: "cached_proxy" },
    { endpoint: "/api/ann-arbor-npn/species/{key}", kind: "cached_proxy" },
    { endpoint: "/api/ann-arbor-npn/names", kind: "cached_proxy" },
    { endpoint: "/api/ann-arbor-npn/import", kind: "admin" },
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
