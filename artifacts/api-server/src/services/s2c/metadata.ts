export const S2C_SOURCE_ID = "seeds-to-community-washtenaw";

export const S2C_PERMISSION_GRANTED = true;

export const S2C_PERMISSION_STATUS =
  "GRANTED — Seeds to Community Washtenaw is operated by the data owner. " +
  "Data is public-facing and published for community use. Permission to serve via FERNS explicitly granted by the program organizer.";

export const S2C_GENERAL_SUMMARY =
  "Species availability records for Seeds to Community Washtenaw, a native plant seed-growing program " +
  "run by a Washtenaw County, Michigan community organization; FERNS serves this data with the " +
  "program organizer's permission. " +
  "Data type: the list of botanical names offered for growing in each annual workshop series, " +
  "extracted from program documents (PDFs and Google Sheets). " +
  "Geographic scope: Washtenaw County, Michigan; taxonomic scope: native plants suitable for " +
  "seed-growing workshops in the Upper Midwest. " +
  "FERNS serves static in-memory data extracted from program documents; no live API is queried at runtime. " +
  "A query by year returns the species list with optional metadata flags: " +
  "neat_and_tidy (suitable for formal garden settings) and sweet_and_simple (beginner-friendly, 2026+). " +
  "Data is updated annually when new program year documents are processed; " +
  "the 2023 list is from workshop PDFs (24 species) and may be incomplete. " +
  "Botanical names reflect S2C program usage and are not formally reconciled to any single taxonomic authority.";

export const S2C_TECHNICAL_DETAILS =
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
    "Annual lists of native plant botanical names offered at Washtenaw County, Michigan seed-growing workshops, " +
    "covering program years 2023–2026, with optional suitability flags: 'Neat & Tidy' for formal garden settings " +
    "and 'Sweet & Simple' for beginners (available from 2026 onward). " +
    "From Seeds to Community Washtenaw, a community seed-growing program in Washtenaw County, Michigan.",
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
  explorer_url: "/source/seeds-to-community-washtenaw",
  permission_granted: S2C_PERMISSION_GRANTED,
  permission_status: S2C_PERMISSION_STATUS,
  general_summary: S2C_GENERAL_SUMMARY,
  technical_details: S2C_TECHNICAL_DETAILS,
};
