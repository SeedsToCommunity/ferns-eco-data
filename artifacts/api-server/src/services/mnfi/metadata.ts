export const MNFI_SOURCE_ID = "mnfi";

export const MNFI_PERMISSION_STATUS =
  "Public access — MNFI natural community classification, descriptions, and county element data are " +
  "published by Michigan State University Extension at mnfi.anr.msu.edu. " +
  "FERNS imports community classification data at startup and imports county element data " +
  "(species and community occurrences per Michigan county) via MNFI's public JSON API " +
  "(countyQuery and countyCommunityQuery endpoints). " +
  "No authentication is required for any MNFI data consumed by FERNS.";

export const MNFI_GENERAL_SUMMARY =
  "Michigan Natural Features Inventory (MNFI) — Natural Communities Classification and County Element Data. " +
  "MNFI is housed at Michigan State University Extension and maintains the authoritative classification " +
  "of Michigan's natural communities. " +
  "FERNS imports 77 natural community types spanning 5 ecological classes (Palustrine, " +
  "Palustrine/Terrestrial, Primary, Subterranean/Sink, Terrestrial) and 18 community groups. " +
  "Each record includes: community name, MNFI community ID, URL slug, class, group, " +
  "NatureServe global rank (G1–G5/GU/GNR/GX), Michigan state rank (S1–S5/SX/SU), " +
  "description sections (overview, landscape context, soils, natural processes, vegetation, management), " +
  "characteristic plant list by life form, and links to MNFI county distribution maps. " +
  "County element data (species and natural community occurrences recorded per Michigan county) " +
  "is fetched from MNFI's public JSON API (countyQuery and countyCommunityQuery endpoints) " +
  "covering all 83 Michigan counties; 7,289 records total (6,360 species + 929 community occurrences). " +
  "Classification citation: Cohen et al. 2025. Michigan Natural Community Classification [web application]. " +
  "MNFI, Michigan State University Extension, Lansing, MI. https://mnfi.anr.msu.edu/communities/classification. " +
  "Geographic scope: Michigan (all 83 counties, Lower and Upper Peninsula).";

export const MNFI_TECHNICAL_DETAILS =
  "Primary source: Michigan Natural Features Inventory Natural Community Classification " +
  "(mnfi.anr.msu.edu/communities/classification), version accessed April 2026. " +
  "Authors: Cohen, J.G., M.A. Kost, B.S. Slaughter, D.A. Albert, J.M. Lincoln, A.P. Kortenhoven, " +
  "C.M. Wilton, H.D. Enander, M.E. Anderson, M.R. Parr, T.J. Bassett, and K.M. Korroch (2025). " +
  "Community taxonomy extracted from mnfi.anr.msu.edu/communities/list (77 community types). " +
  "Community descriptions scraped from mnfi.anr.msu.edu/communities/{id}/{slug} (77 pages). " +
  "Characteristic plant lists scraped from mnfi.anr.msu.edu/communities/plant-list/{id}/{slug} (77 pages). " +
  "County element data fetched from MNFI public JSON API: " +
  "https://mnfi.anr.msu.edu/resources/countyQuery?county={id} (species elements, 16 columns: " +
  "ELEMENT_ID, FORMATTED_SCIENTIFIC_NAME, FORMATTED_SYNONYM_NAME, SCIENTIFIC_NAME, COMMON_NAME, " +
  "US_STATUS, STATE_STATUS, G_RANK, S_RANK, US_STATUS_DESCRIPTION, STATE_STATUS_DESCRIPTION, " +
  "G_RANK_DESCRIPTION, S_RANK_DESCRIPTION, SPECIES_CATEGORY, COUNT, LAST_OBS_YEAR) and " +
  "https://mnfi.anr.msu.edu/resources/countyCommunityQuery?county={id} (community elements, 8 columns: " +
  "ELEMENT_ID, NAME, G_RANK, S_RANK, G_RANK_DESCRIPTION, S_RANK_DESCRIPTION, COUNT, LAST_OBS_DATE). " +
  "County IDs 1–83 correspond to Michigan counties in alphabetical order. " +
  "Each community record is keyed by MNFI community_id (integer, from URL path). " +
  "Rank codes follow NatureServe methodology: G1=critically imperiled, G2=imperiled, G3=vulnerable, " +
  "G4=apparently secure, G5=secure, GU=unrankable, GNR=not ranked, GX=presumed extinct; " +
  "S-ranks parallel G-ranks for Michigan state level; SX=extirpated from state. " +
  "Species categories in county data: Amphibians, Birds, Butterflies and Moths, Fishes, " +
  "Flowering Plants, Mammals, Mussels, Reptiles, Snails, Vascular Plants, and others as returned by MNFI. " +
  "Federal status codes: LE=listed endangered, LT=listed threatened, SC=species of concern. " +
  "State status codes: E=endangered, T=threatened, SC=special concern. " +
  "Fields stored per community: community_id, slug, name, community_class, community_group, " +
  "global_rank, state_rank, overview, landscape_context, soils_description, natural_processes, " +
  "vegetation, management_notes, similar_communities (jsonb), mnfi_url, county_map_url.";

export const MNFI_REGISTRY_ENTRY = {
  source_id: MNFI_SOURCE_ID,
  name: "Michigan Natural Features Inventory — Natural Community Classification",
  knowledge_type: "source_wrapper" as const,
  status: "live" as const,
  description:
    "Michigan's authoritative natural community classification maintained by MNFI at MSU Extension. " +
    "Covers 77 natural community types organized into 5 ecological classes and 18 community groups, " +
    "ranging from rare globally imperiled communities (G1) to common secure types (G4–G5). " +
    "Includes NatureServe global and Michigan state conservation ranks, full community descriptions, " +
    "characteristic plant lists by life form, and county element occurrence data " +
    "(species and communities recorded per county) for all 83 Michigan counties.",
  input_summary:
    "Community ID, slug, or name; or Michigan county name for county element lookups",
  output_summary:
    "Natural community classification data: name, class, group, global rank, state rank, " +
    "description sections, characteristic plant list, MNFI URL, and county distribution map link. " +
    "County element data: species/community occurrences per county with conservation status codes " +
    "and last observation year.",
  dependencies: [] as string[],
  update_frequency:
    "Community classification and descriptions: imported from MNFI website (April 2026 snapshot); " +
    "re-import required for updates (POST /api/mnfi/import-descriptions). " +
    "County element data: fetched from MNFI public JSON API for all 83 counties; " +
    "refresh via POST /api/mnfi/import-county-elements.",
  known_limitations:
    "Community description text (overview, landscape context, soils, vegetation) requires a " +
    "web scraping import step (POST /api/mnfi/import-descriptions) and may be null until run. " +
    "Characteristic plant lists require POST /api/mnfi/import-plant-lists. " +
    "Geographic scope: Michigan only. No national or multi-state coverage.",
  metadata_url: "/api/mnfi/metadata",
  explorer_url: "/source/mnfi",
};
