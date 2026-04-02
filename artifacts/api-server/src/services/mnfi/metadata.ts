export const MNFI_SOURCE_ID = "mnfi";

export const MNFI_PERMISSION_STATUS =
  "Public access — MNFI natural community classification and descriptions are published by Michigan State " +
  "University Extension under an open educational use policy at mnfi.anr.msu.edu. " +
  "FERNS serves static data imported from the publicly accessible MNFI web application. " +
  "County element data tables are dynamically served by MNFI's web UI; no public bulk-download API is available. " +
  "Users seeking bulk county element data should contact MNFI directly via their Special Data Requests program.";

export const MNFI_DERIVATION_SUMMARY =
  "Michigan Natural Features Inventory (MNFI) — Natural Communities Classification and County Element Data. " +
  "MNFI is housed at Michigan State University Extension and maintains the authoritative classification " +
  "of Michigan's natural communities. " +
  "FERNS imports 77 natural community types spanning 5 ecological classes (Palustrine, " +
  "Palustrine/Terrestrial, Primary, Subterranean/Sink, Terrestrial) and 18 community groups. " +
  "Each record includes: community name, MNFI community ID, URL slug, class, group, " +
  "NatureServe global rank (G1–G5/GU/GNR/GX), Michigan state rank (S1–S5/SX/SU), " +
  "and links to MNFI county distribution maps. " +
  "County element data (species and community occurrences per Michigan county) is tracked in a separate table " +
  "populated via MNFI's web interface; direct API access is not available from MNFI. " +
  "Classification citation: Cohen et al. 2025. Michigan Natural Community Classification [web application]. " +
  "MNFI, Michigan State University Extension, Lansing, MI. https://mnfi.anr.msu.edu/communities/classification. " +
  "Geographic scope: Michigan (all 83 counties, Lower and Upper Peninsula).";

export const MNFI_DERIVATION_SCIENTIFIC =
  "Primary source: Michigan Natural Features Inventory Natural Community Classification " +
  "(mnfi.anr.msu.edu/communities/classification), version accessed April 2026. " +
  "Authors: Cohen, J.G., M.A. Kost, B.S. Slaughter, D.A. Albert, J.M. Lincoln, A.P. Kortenhoven, " +
  "C.M. Wilton, H.D. Enander, M.E. Anderson, M.R. Parr, T.J. Bassett, and K.M. Korroch (2025). " +
  "Community data extracted from mnfi.anr.msu.edu/communities/list (77 community types). " +
  "Each community record is keyed by MNFI community_id (integer, from URL path), slug (URL slug), " +
  "name, community_class, community_group, global_rank, state_rank, mnfi_url, county_map_url. " +
  "County element data schema: county (Michigan county name), element_type ('species' or 'community'), " +
  "element_name, scientific_name, common_name, federal_status (LE/LT/SC etc.), state_status (E/T/SC), " +
  "global_rank, state_rank, occurrences_in_county (integer), last_observed (year text). " +
  "County element data requires scraping MNFI's dynamic web UI (no public bulk export API); " +
  "the county_elements table is populated separately when data is available. " +
  "Rank codes follow NatureServe methodology: G1=critically imperiled, G2=imperiled, G3=vulnerable, " +
  "G4=apparently secure, G5=secure, GU=unrankable, GNR=not ranked, GX=presumed extinct; " +
  "S-ranks parallel G-ranks for Michigan state level; SX=extirpated from state. " +
  "No live upstream API — FERNS serves static imported records. " +
  "Fields: community_id (integer PK), slug, name, community_class, community_group, " +
  "global_rank, state_rank, overview (nullable), landscape_context (nullable), " +
  "mnfi_url, county_map_url (PNG distribution map).";

export const MNFI_REGISTRY_ENTRY = {
  source_id: MNFI_SOURCE_ID,
  name: "Michigan Natural Features Inventory — Natural Community Classification",
  knowledge_type: "source_wrapper" as const,
  status: "live" as const,
  description:
    "Michigan's authoritative natural community classification maintained by MNFI at MSU Extension. " +
    "Covers 77 natural community types organized into 5 ecological classes and 18 community groups, " +
    "ranging from rare globally imperiled communities (G1) to common secure types (G4–G5). " +
    "Includes NatureServe global and Michigan state conservation ranks for each type. " +
    "County element occurrence data (species and communities recorded per county) is tracked " +
    "in a companion table for all 83 Michigan counties.",
  input_summary:
    "Community ID, slug, or name; or Michigan county name for county element lookups",
  output_summary:
    "Natural community classification data: name, class, group, global rank, state rank, " +
    "MNFI URL, and county distribution map link. " +
    "County element data: species/community occurrences per county with conservation status codes.",
  dependencies: [] as string[],
  update_frequency:
    "Static — community classification imported from MNFI website (April 2026 snapshot). " +
    "County element data loaded separately when available. " +
    "MNFI updates their classification periodically; re-import required for updates.",
  known_limitations:
    "County element data (species and community occurrences per county) is not available via " +
    "public API — MNFI serves this data only through a dynamic web interface. " +
    "Bulk county element data requires direct contact with MNFI's Special Data Requests program. " +
    "Community description text (overview, landscape context) requires a web scraping import step " +
    "and may be null until that step is run. " +
    "Geographic scope: Michigan only. No national or multi-state coverage.",
  metadata_url: "/api/mnfi/metadata",
  explorer_url: "/source/mnfi",
};
