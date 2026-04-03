export const LCSCG_SOURCE_ID = "lcscg";

export const LCSCG_PERMISSION_GRANTED = true;

export const LCSCG_PERMISSION_STATUS =
  "GRANTED — Lake County Seed Collection Guides are published by the Lake County Forest Preserve District " +
  "under a CC BY-NC 4.0 license. The guides are freely available on the Field Museum Field Guides platform. " +
  "FERNS serves static data extracted from those publicly licensed PDF documents.";

export const LCSCG_GENERAL_SUMMARY =
  "Illustrated field guide data for native seed collection in Lake County, northeastern Illinois, " +
  "compiled by the Lake County Forest Preserve District Volunteer Stewardship Network and published " +
  "as 12 CC BY-NC 4.0 guides by the Field Museum Field Guides platform (Guide IDs 1271–1282). " +
  "Authors: Kelly Schultz (LCFPD Stewardship Ecologist) and Dale Shields. " +
  "Covers 494 plant species organized by season (spring, summer, fall) and habitat (woodland, wetland, " +
  "prairie, grasses and sedges, asters and goldenrods, woody plants). " +
  "Geographic scope: Lake County, Illinois; taxonomic scope: native and adventive vascular plants of that region. " +
  "FERNS serves static data extracted from the PDF guides (no live upstream API); " +
  "2,093 guide photographs are served from Cloudinary CDN. " +
  "A species query returns scientific name, common name, plant family, guide and habitat section, seed dispersal " +
  "category, harvest technique description, photo date (timing proxy), and image URLs. " +
  "Data is static with no update cycle; not all records are native — non-native comparison species " +
  "marked 'Do Not Collect' are included; no Floristic Quality C-values or wetland status codes are provided. " +
  "LCSCG species names follow Flora of the Chicago Region (Wilhelm & Rericha 2017), which may differ from " +
  "GBIF, iNaturalist, BONAP, USDA PLANTS, or Michigan Flora taxonomy used by other FERNS sources — " +
  "cross-reference names carefully when combining with those services.";

export const LCSCG_TECHNICAL_DETAILS =
  "Primary source: 12 PDF field guides (version 2, March 2021) authored by Kelly Schultz " +
  "(LCFPD Stewardship Ecologist) and Dale Shields (volunteer); photography by Dale J. Shields. " +
  "Published by Field Museum Field Guides. " +
  "Field Museum Guide IDs: 1271 (Summer Woodland Forbs), 1272 (Woody Plants), " +
  "1273 (Summer Wetland Grasses and Kin), 1274 (Summer Wetland Forbs), 1275 (Summer Prairie Forbs), " +
  "1276 (Summer Grasses and Kin), 1277 (Spring Woodland Forbs), 1278 (Fall Woodland Forbs), " +
  "1279 (Fall Wetland Forbs), 1280 (Fall Grasses and Kin), 1281 (Asters and Goldenrods), " +
  "1282 (Fall Prairie Forbs). " +
  "Scientific reviewer: Laurie Ryan, McHenry County Conservation District. " +
  "Data extracted from PDFs into JSON files; stored in FERNS as static PostgreSQL records " +
  "(no TTL, no cache, no refresh). " +
  "Nomenclature follows Flora of the Chicago Region (Wilhelm & Rericha, 2017), which may differ from " +
  "GBIF, iNaturalist, or USDA PLANTS taxonomy. " +
  "Images (2,093 PNGs) hosted on Cloudinary (cloud: dqe2vv0fo), organized in per-guide folders. " +
  "Fields per species: scientific_name, common_name, family, guide_id, guide_name, season, habitat_type, " +
  "page_number, photo_date (M-D-YY format; date of reference photograph; approximate collection timing; " +
  "varies by local weather, proximity to Lake Michigan, slope, sun/shade), " +
  "description (authors' harvest notes), seed_group_names (string array), " +
  "seed_group_details (array of {name, description, images}), " +
  "image_urls (JSONB array of Cloudinary CDN URLs). " +
  "494 total records, all unique by scientific name. " +
  "Non-native Do Not Collect species included: Daucus carota, Cirsium vulgare, Phleum pratense, " +
  "Abutilon theophrasti, Dianthus armeria, others. " +
  "FERNS does NOT cross-reference LCSCG records with any other FERNS source.";

export const LCSCG_REGISTRY_ENTRY = {
  source_id: LCSCG_SOURCE_ID,
  name: "Lake County Seed Collection Guides — Native Seed Identification and Collection",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "12 illustrated field guides for native seed identification in Lake County, Illinois, " +
    "produced by the Lake County Forest Preserve District Volunteer Stewardship Network. " +
    "Covers 494 species organized by season and habitat. " +
    "Each species record includes harvest notes, seed dispersal category, photo date, " +
    "and CDN-hosted photographs. Nomenclature follows Flora of the Chicago Region (2017).",
  input_summary: "Scientific name (partial or exact) or guide ID (1271–1282)",
  output_summary:
    "Species harvest description, seed dispersal categories, photo date, plant family, " +
    "guide context (season, habitat), and Cloudinary image URLs",
  dependencies: [] as string[],
  update_frequency:
    "Static — data imported once from version 2 (March 2021) PDF guides. " +
    "No upstream API. Updates require a new import if guides are revised.",
  known_limitations:
    "Nomenclature follows Flora of the Chicago Region (Wilhelm & Rericha, 2017), which may differ from " +
    "GBIF, iNaturalist, or USDA PLANTS taxonomy. " +
    "494 records extracted from 12 PDFs; printed book edition claims ~600 species. " +
    "Non-native 'Do Not Collect' comparison species are included in the dataset. " +
    "Photo dates are reference photograph dates, not guaranteed collection windows — " +
    "actual timing varies by microclimate, proximity to Lake Michigan, slope, and sun/shade. " +
    "Geographic scope is Lake County, Illinois only.",
  metadata_url: "/api/lcscg/metadata",
  explorer_url: "/source/lcscg",
  permission_granted: LCSCG_PERMISSION_GRANTED,
  permission_status: LCSCG_PERMISSION_STATUS,
  general_summary: LCSCG_GENERAL_SUMMARY,
  technical_details: LCSCG_TECHNICAL_DETAILS,
};

export const GUIDE_METADATA: Record<
  number,
  { title: string; subtitle: string; season: string; habitat_type: string; cloudinary_folder: string }
> = {
  1271: {
    title: "Summer Woodland Forbs",
    subtitle: "Summerwoodlandforbs",
    season: "summer",
    habitat_type: "woodland",
    cloudinary_folder: "1271_usa_illinois_lakecounty_summerwoodlandforbs_v2",
  },
  1272: {
    title: "Woody Plants",
    subtitle: "Woodyplantsv2",
    season: "all",
    habitat_type: "woody_plants",
    cloudinary_folder: "1272_usa_illinois_lakecounty_woodyplantsv2",
  },
  1273: {
    title: "Summer Wetland Grasses and Kin",
    subtitle: "Summerwetlandgrassesandkin",
    season: "summer",
    habitat_type: "grasses_and_kin",
    cloudinary_folder: "1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2",
  },
  1274: {
    title: "Summer Wetland Forbs",
    subtitle: "Summerwetlandforbs",
    season: "summer",
    habitat_type: "wetland",
    cloudinary_folder: "1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1",
  },
  1275: {
    title: "Summer Prairie Forbs",
    subtitle: "Summerprairieforbsv2",
    season: "summer",
    habitat_type: "prairie",
    cloudinary_folder: "1275_usa_illinois_lakecounty_summerprairieforbsv2",
  },
  1276: {
    title: "Summer Grasses and Kin",
    subtitle: "Summergrassesandkin",
    season: "summer",
    habitat_type: "grasses_and_kin",
    cloudinary_folder: "1276_usa_illinois_lakecounty_summergrassesandkin_v2",
  },
  1277: {
    title: "Spring Woodland Forbs",
    subtitle: "Springwoodlandforbsv2",
    season: "spring",
    habitat_type: "woodland",
    cloudinary_folder: "1277_usa_illinois_lakecounty_springwoodlandforbsv2_0",
  },
  1278: {
    title: "Fall Woodland Forbs",
    subtitle: "Fallwoodlandforbsv2",
    season: "fall",
    habitat_type: "woodland",
    cloudinary_folder: "1278_usa_illinois_lakecounty_fallwoodlandforbsv2",
  },
  1279: {
    title: "Fall Wetland Forbs",
    subtitle: "Fallwetlandforbsv2",
    season: "fall",
    habitat_type: "wetland",
    cloudinary_folder: "1279_usa_illinois_lakecounty_fallwetlandforbsv2_1",
  },
  1280: {
    title: "Fall Grasses and Kin",
    subtitle: "Fallgrassesandkin",
    season: "fall",
    habitat_type: "grasses_and_kin",
    cloudinary_folder: "1280_usa_illinois_lakecounty_fallgrassesandkinv2_1",
  },
  1281: {
    title: "Asters and Goldenrods",
    subtitle: "Astersgoldenodsv2",
    season: "fall",
    habitat_type: "asters_and_goldenrods",
    cloudinary_folder: "1281_usa_illinois_lakecounty_astersgoldenodsv2_0",
  },
  1282: {
    title: "Fall Prairie Forbs",
    subtitle: "Fallprairieforbsv2",
    season: "fall",
    habitat_type: "prairie",
    cloudinary_folder: "1282_usa_illinois_lakecounty_fallprairieforbsv2_0",
  },
};

export const DRIVE_FOLDER_IDS: Record<number, string> = {
  1271: "1qPqFpexsIx1RjUat3fuIQycOswM4URHx",
  1272: "14Ijph3GxbOuWXYPLyII_GaD45LYKvy0R",
  1273: "1XB3l28DsVXdYPolZIGUm4Am8oA8gs8_r",
  1274: "1dRnA0_wXz2w_ItKqti7-hA3kczwIjuv_",
  1275: "1-AQWi0LhWUCdCrKg5d_w_pltPbqOxrLa",
  1276: "1Gt6zmXSrvbBaTtKvs6S504Ytoo6k7dhT",
  1277: "1I1X8tuhfBQp-qextH3SsiZGeDiZQg-gc",
  1278: "1jYzyXd2fnj_DsBY5yd3u67XdS3AUfiwx",
  1279: "1Zo727vKZtcXhLJCOLZdr-1JxKNLll1ca",
  1280: "14Hei0aH8auXLAuXvUjiL3RyPTVCLDJmb",
  1281: "1xa41Dlpb9KAKJzxuA-NvoSjvQ8ZA5t2U",
  1282: "1zNr5EFMaFiReQtJ15eSZMLYvau8N84rm",
};
