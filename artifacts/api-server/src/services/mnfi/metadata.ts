export const MNFI_SOURCE_ID = "mnfi";

export const MNFI_PERMISSION_GRANTED = true;

export const MNFI_PERMISSION_STATUS =
  "Public access — MNFI natural community classification, descriptions, and county element data are " +
  "published by Michigan State University Extension at mnfi.anr.msu.edu. " +
  "FERNS imports community classification data at startup and imports county element data " +
  "(species and community occurrences per Michigan county) via MNFI's public JSON API " +
  "(countyQuery and countyCommunityQuery endpoints). " +
  "No authentication is required for any MNFI data consumed by FERNS.";

export const MNFI_GENERAL_SUMMARY =
  "The Michigan Natural Features Inventory (MNFI), a research program of Michigan State University Extension, " +
  "maintains Michigan's authoritative classification of natural communities — the 77 recurring plant community types " +
  "(such as oak woodlands, sedge meadows, and bog forests) that define Michigan's ecological landscape. " +
  "FERNS hosts the complete community classification: 77 types spanning 5 ecological classes and 18 community groups, " +
  "each with a NatureServe global rank and Michigan state rank (measures of imperilment ranging from G1/S1 = critically imperiled " +
  "to G5/S5 = secure), plus full ecological descriptions covering landscape context, soils, natural processes, vegetation, " +
  "and management considerations, and characteristic plant lists by life form. " +
  "County element data covers all 83 Michigan counties, with approximately 6,360 species records and 929 community records " +
  "documenting which species and communities have been observed in each county, along with conservation status codes and last observation year. " +
  "FERNS imports community classification data from MNFI's public website and API at startup; all data is available immediately on a correctly configured deployment. " +
  "A community query returns name, class, group, conservation ranks, full description, characteristic plant list, MNFI URL, and county distribution map link; " +
  "a county element query returns species and community occurrences with conservation status codes and last observation year. " +
  "MNFI community types align with NatureServe ecological systems at the national scale — MNFI provides Michigan field-level detail " +
  "(characteristic plants, county maps, management notes) that NatureServe's national classification does not; " +
  "using both FERNS services together gives the most complete picture of a community type. " +
  "Community description and characteristic plant list data is imported at server startup; if a deployment has just been initialized, descriptions may take a short time to populate. Geographic scope is Michigan only. " +
  "For scientific name verification of species in MNFI characteristic plant lists, use GBIF. " +
  "For vascular plant county occurrence data in Michigan, use Michigan Flora (miflora) — Michigan Flora provides botanical descriptions and distributional context MNFI does not. " +
  "For citizen science occurrence data for MNFI-tracked species, use iNaturalist (inaturalist).";

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
  "vegetation, management_notes, similar_communities (jsonb), mnfi_url, county_map_url. " +
  "Overlap with other FERNS sources: For Americas-wide conservation ranks (G/N/S) of the same community types, use NatureServe (natureserve) — NatureServe provides the national classification framework; MNFI provides Michigan-specific field detail, characteristic plant lists, and county distribution maps not in NatureServe. " +
  "For vascular plant county occurrence data in Michigan, use Michigan Flora (miflora) — Michigan Flora covers county distribution for all Michigan vascular plants at the species level; MNFI county element data covers MNFI-tracked taxa (vascular and non-vascular plants, animals, and communities). " +
  "For scientific name verification of species in MNFI characteristic plant lists, use GBIF (gbif). " +
  "For citizen science occurrence data for MNFI-tracked species, use iNaturalist (inaturalist).";

export const MNFI_REGISTRY_ENTRY = {
  source_id: MNFI_SOURCE_ID,
  name: "Michigan Natural Features Inventory — Natural Community Classification",
  knowledge_type: "source_wrapper" as const,
  status: "live" as const,
  description:
    "Natural community classifications, conservation ranks, ecological descriptions, characteristic plant lists, " +
    "and county-level occurrence records for species and communities across all 83 Michigan counties — " +
    "covering 77 community types spanning Michigan's major ecological zones. " +
    "From the Michigan Natural Features Inventory (MNFI), a research program of Michigan State University Extension.",
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
  permission_granted: MNFI_PERMISSION_GRANTED,
  permission_status: MNFI_PERMISSION_STATUS,
  general_summary: MNFI_GENERAL_SUMMARY,
  technical_details:
    MNFI_TECHNICAL_DETAILS +
    " Startup behavior: on first startup, the server automatically checks whether community descriptions are populated " +
    "and, if not, runs the three import endpoints in sequence as a background task (non-blocking): " +
    "POST /api/mnfi/import-descriptions, POST /api/mnfi/import-plant-lists, POST /api/mnfi/import-county-elements. " +
    "Requires ADMIN_SECRET environment variable to be set. " +
    "Subsequent startups skip the import if data is already present (idempotent check on description_fetched_at).",
};
