export const S2C_SOURCE_ID = "seeds-to-community-washtenaw";

export const S2C_PERMISSION_GRANTED = true;

export const S2C_PERMISSION_STATUS =
  "GRANTED — Seeds to Community Washtenaw is operated by the data owner. " +
  "Data is public-facing and published for community use. Permission to serve via FERNS explicitly granted by the program organizer.";

export const S2C_DERIVATION_SUMMARY =
  "Seeds to Community Washtenaw is a native plant seed-growing program based in Washtenaw County, Michigan. " +
  "Each program year (January–March workshops), participants grow native plants from seeds collected " +
  "during the prior spring–fall season. " +
  "This source records the botanical names of species offered in each program year's growing workshops. " +
  "Program years are labeled by the calendar year in which the January–March workshops occur. " +
  "Series 1 (2023): 24 species; source is plant-sheet PDFs distributed at workshops. " +
  "Series 2 (2024): 96 species; source is the public program spreadsheet. " +
  "Series 3 (2025): 151 species; source is the public program spreadsheet. " +
  "Series 4 (2026): 166 species; source is the master species tracking spreadsheet (Collected=TRUE). " +
  "Optional metadata flags when tracked: " +
  "neat_and_tidy — species suitable for 'neat and tidy' formal or managed garden settings. " +
  "sweet_and_simple — species designated for first-time or beginner growers (introduced in 2026).";

export const S2C_DERIVATION_SCIENTIFIC =
  "Source: Seeds to Community Washtenaw native plant program, Washtenaw County, Michigan. " +
  "Data owner: program organizer. Permission: granted explicitly. " +
  "Method: static_data. Species lists extracted from program documents per year: " +
  "2023 — plant-sheet PDF (202303-PlantSheets.pdf); 24 species; botanical names transcribed from PDF. " +
  "2024 — Google Sheets 'All Species For Growing Events' tab (file: 12DX2dQ96KUyEeNKREfpNoGHtTBxczan6uZNP3uQYyJk); 96 species; neat_and_tidy from Neat column. " +
  "2025 — Google Sheets 'Species' tab, filter Barn S3=TRUE (file: 121a1HIhNPJwyM1fr_OWgi4jMKRipF9EKDeT7_zo4mA8); 151 species; neat_and_tidy from Neat column. " +
  "2026 — Google Sheets 'Species' tab, filter Collected=TRUE (file: 1sVNi4MuqSI6tugCgDodiUJZMTMkDuK1FEXojexI5f-E); 166 species; neat_and_tidy and sweet_and_simple from S2C Lists column. " +
  "Botanical names reflect S2C program usage; not formally reconciled to a single taxonomic authority. " +
  "No upstream API. No cache TTL — data is in-memory static reference.";

export const S2C_REGISTRY_ENTRY = {
  source_id: S2C_SOURCE_ID,
  name: "Seeds to Community Washtenaw — Annual Native Plant Species Availability",
  knowledge_type: "source_wrapper",
  status: "live",
  description:
    "Species availability records for Seeds to Community Washtenaw, a native plant seed-growing program " +
    "in Washtenaw County, Michigan. Covers program years 2023–2026. " +
    "Each record is the list of botanical names offered for growing in that year's January–March workshops. " +
    "Where tracked, includes 'Neat & Tidy' flags (species suitable for formal garden settings) " +
    "and 'Sweet & Simple' flags (beginner-friendly selections, introduced 2026).",
  input_summary: "Program year (2023–2026)",
  output_summary:
    "List of botanical names offered that year, with optional neat_and_tidy and sweet_and_simple metadata flags where tracked",
  dependencies: [] as string[],
  update_frequency:
    "Updated annually after each program year's species list is finalized (typically late fall). " +
    "Requires a FERNS service update to incorporate new program year data.",
  known_limitations:
    "2023 data sourced from PDF plant sheets — may not represent the complete program offering for that year. " +
    "Botanical names reflect S2C program usage and are not formally reconciled to BONAP, GBIF, or Michigan Flora taxonomies. " +
    "Neat & Tidy flag not tracked for 2023. Sweet & Simple flag only available from 2026 onward.",
  metadata_url: "/api/s2c/metadata",
  explorer_url: "/registry-explorer/source/seeds-to-community-washtenaw",
};
