export const NPN_SOURCE_ID = "ann-arbor-npn";

export const NPN_PERMISSION_GRANTED = false;

export const NPN_PERMISSION_STATUS =
  "NOT REQUESTED — The Native Plant Nursery (nativeplant.com) is a small Ann Arbor nursery operated " +
  "by Greg Vaclavek. FERNS imports and caches Greg's species data locally for research and " +
  "ecological commons purposes. No formal data-sharing agreement has been established. " +
  "Callers should cite Greg Vaclavek / The Native Plant Nursery (nativeplant.com) when using this data.";

export const NPN_GENERAL_SUMMARY =
  "The Native Plant Nursery (NPN), Ann Arbor, Michigan — operated by Greg Vaclavek — " +
  "maintains a curated database of Michigan native plants available at nativeplant.com. " +
  "The dataset covers approximately 130 species with ecological attributes (light, moisture, height, " +
  "flowering time, habitat, range within Michigan) and nursery availability/pricing. " +
  "Each species record is identified by a short acronym (e.g. ANDCAN for Andropogon canadensis) " +
  "and includes common and Latin names, an optional Latin synonym, and a series of images " +
  "with captions — photographs and pen-and-ink drawings. " +
  "FERNS imports the full inventory into a local PostgreSQL database and serves it via structured API endpoints, " +
  "enabling lookup by acronym, Latin name, Latin synonym, or any common name. " +
  "A name-groups endpoint returns all species organized by accepted key for cross-source reconciliation. " +
  "Images are hosted on Cloudinary CDN (folder: ann-arbor-npn/{acronym}/{position}).";

export const NPN_TECHNICAL_DETAILS =
  "Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database. " +
  "Import method: admin-gated POST /api/ann-arbor-npn/import; auto-import at startup if table is empty. " +
  "DB tables: npn_species (PK: acronym text; fields: latin_name, latin_synonym_greg, common_name, " +
  "light, moisture, height, flowering_time, habitat, notes, range_michigan text[] (migration 0009 — was jsonb in 0008), npn_price_sizes, " +
  "images jsonb array of {position, url, caption, kind}, source_url, scraped_at); " +
  "npn_name_aliases (PK: alias text; FK: acronym → npn_species). " +
  "Alias index: acronym + latin_name + latin_synonym_greg (where present) + common names (split on ; and ,). " +
  "Image kind inference: caption containing 'pen & ink' or 'drawing' → 'drawing'; else 'photograph'. " +
  "Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}). " +
  "Carex species use CX prefix instead of CAR (e.g. CXSTRI for Carex stricta). " +
  "Lookup endpoint (GET /api/ann-arbor-npn/species/:key) accepts any name flavor and resolves via alias table. " +
  "Bulk endpoint (GET /api/ann-arbor-npn/species) returns all 130 species. " +
  "Names endpoint (GET /api/ann-arbor-npn/names) returns name groups with all_accepted_keys for reconciliation. " +
  "Known quirk: GENAND (Gentiana andrewsii) has 'Closed Gentian' in the synonym slot (common name, not taxonomic). " +
  "HIEVEN (Hieracium venosum) is a stub record with empty light/moisture/height/range fields.";

export const NPN_REGISTRY_ENTRY = {
  source_id: NPN_SOURCE_ID,
  name: "Ann Arbor Native Plant Nursery",
  knowledge_type: "source_wrapper" as const,
  status: "live",
  description:
    "Michigan native plant species database from The Native Plant Nursery (nativeplant.com), " +
    "Ann Arbor, MI, operated by Greg Vaclavek. Covers ~130 species with ecological attributes, " +
    "nursery pricing, and species images (photographs and pen-and-ink drawings).",
  input_summary:
    "Acronym (e.g. ANDCAN), Latin name, Latin synonym, or any common name (any capitalization)",
  output_summary:
    "Species record with light, moisture, height, flowering time, habitat, Michigan range, " +
    "nursery pricing/sizes, and Cloudinary image URLs with captions and kind (photograph/drawing)",
  dependencies: [] as string[],
  update_frequency:
    "Manual re-import via admin endpoint or auto-import at startup when table is empty. " +
    "Source data is Greg Vaclavek's nativeplant.com inventory; no automated refresh cycle.",
  known_limitations:
    "~130 species — Michigan native focus, narrower than regional floras. " +
    "latin_synonym_greg reflects Greg's own nomenclature and may not align with GBIF or USDA PLANTS. " +
    "GENAND synonym slot contains 'Closed Gentian' (common name, not a taxonomic synonym). " +
    "HIEVEN is a stub record with minimal data. " +
    "No formal data-sharing agreement — cite Greg Vaclavek / nativeplant.com when using this data. " +
    "Carex species use CX prefix (not CAR) in acronyms.",
  metadata_url: "/api/ann-arbor-npn/metadata",
  explorer_url: "/source/ann-arbor-npn",
  permission_granted: NPN_PERMISSION_GRANTED,
  permission_status: NPN_PERMISSION_STATUS,
  general_summary: NPN_GENERAL_SUMMARY,
  technical_details: NPN_TECHNICAL_DETAILS,
};
