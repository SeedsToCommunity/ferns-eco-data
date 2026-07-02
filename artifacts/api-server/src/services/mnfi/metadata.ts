export const MNFI_SOURCE_ID = "mnfi";

export const MNFI_LICENSES = ["cc-by"];

export const MNFI_LICENSE_NOTES =
  "Public access — MNFI natural community classification, descriptions, characteristic plant lists, " +
  "and tracked rare species and county occurrence data are published by Michigan State University Extension " +
  "at mnfi.anr.msu.edu under a CC BY license. No authentication is required for any MNFI data consumed by FERNS.";

export const MNFI_GENERAL_SUMMARY =
  "The Michigan Natural Features Inventory (MNFI) is a research program of Michigan State University Extension " +
  "that maintains Michigan's authoritative classification of natural communities and tracks rare species across the state. " +
  "FERNS makes available the complete community classification (77 types), full ecological descriptions and characteristic plant lists " +
  "for each community type, tracked rare species with conservation status, and rare species and community occurrence records for all 83 Michigan counties. " +
  "Coverage is Michigan only; 77 community types and all 83 counties are included. " +
  "Data was captured once from MNFI's published website and stored locally inside FERNS; no live calls are made to MNFI at query time — " +
  "the capture date is recorded in each response so you can judge data age. " +
  "A community query returns the full community record including ecological description sections, characteristic plant list by life form, " +
  "rare species listed for that community, and similar communities; a species query returns conservation status and county distribution; " +
  "a county query returns all tracked rare species and community occurrences for that county. " +
  "The community classification is a published reference work and is static — it does not change between MNFI publication cycles. " +
  "Michigan only; locality and observation data (which requires a subscription or login on the MNFI site) is not included; " +
  "coverage is authoritative for tracked rare species but does not include common species.";

export const MNFI_TECHNICAL_DETAILS =
  "Primary source: Michigan Natural Features Inventory Natural Community Classification " +
  "(mnfi.anr.msu.edu/communities/classification), CC BY license. " +
  "Institution: Michigan State University Extension, Michigan Natural Features Inventory (MNFI). " +
  "Citation: Cohen, J.G., M.A. Kost, B.S. Slaughter, D.A. Albert, J.M. Lincoln, A.P. Kortenhoven, " +
  "C.M. Wilton, H.D. Enander, M.E. Anderson, M.R. Parr, T.J. Bassett, and K.M. Korroch (2025). " +
  "Michigan Natural Features Inventory Natural Community Classification. " +
  "Exact capture method: 5 HTML sources and 2 JSON endpoints were used. " +
  "Community taxonomy extracted from mnfi.anr.msu.edu/communities/list (77 community types). " +
  "Community descriptions scraped from mnfi.anr.msu.edu/communities/{id}/{slug} (77 pages), " +
  "applying a rate-limited sequential fetch with HTML section parsing. " +
  "Characteristic plant lists scraped from mnfi.anr.msu.edu/communities/plant-list/{id}/{slug} (77 pages). " +
  "Rare species roster scraped from two pages: the MNFI plants list and the MNFI animals list. " +
  "County element data fetched from two JSON endpoints: " +
  "mnfi.anr.msu.edu/resources/countyQuery?county={id} (species occurrences per county) and " +
  "mnfi.anr.msu.edu/resources/countyCommunityQuery?county={id} (community occurrences per county), " +
  "for all 83 counties (IDs 1–83, corresponding to Michigan counties in alphabetical order). " +
  "No scientific-name normalization was applied at capture time — names are stored as MNFI published them. " +
  "DB tables previously used to hold MNFI content have been dropped; all content is now held in TypeScript seed files " +
  "within the @workspace/internal-data-providers/mnfi package and served from in-process memory. " +
  "Caching: data is static seed data loaded at module initialization; there is no TTL and no cache invalidation — " +
  "data reflects the capture date stored in MNFI_SCRAPED_AT. " +
  "Response is verbatim IDP output with the FERNS envelope added; no field transformations are applied. " +
  "Deliberate scope exclusion: the MNFI observation/locality database (which tracks individual element occurrences by location " +
  "and requires a subscription or login on the MNFI website) is explicitly out of scope — " +
  "FERNS covers the published community classification, characteristic plant lists, rare species roster, " +
  "and county-level element occurrence summaries only. " +
  "Conservation rank codes follow NatureServe methodology: " +
  "G1=critically imperiled, G2=imperiled, G3=vulnerable, G4=apparently secure, G5=secure, " +
  "GU=unrankable, GNR=not yet ranked, GX=presumed extinct; " +
  "S-ranks parallel G-ranks for Michigan state level; SX=extirpated from Michigan. " +
  "Federal status codes: LE=listed endangered, LT=listed threatened, SC=species of concern. " +
  "State status codes: E=endangered, T=threatened, SC=special concern. " +
  "Species categories in county and roster data: Amphibians, Birds, Butterflies and Moths, Fishes, " +
  "Flowering Plants, Mammals, Mussels, Reptiles, Snails, Vascular Plants, and others as returned by MNFI. " +
  "Coverage: 77 community types spanning 5 ecological classes and 18 community groups; all 83 Michigan counties; " +
  "approximately 798 rare species records in the roster (as of the capture date in MNFI_SCRAPED_AT). " +
  "element_id join reliability: element_id values from the county feed and the community rare-species sections " +
  "were not always populated at capture time; the IDP falls back to scientific-name matching when element_id is null. " +
  "Community section variability: MNFI community pages do not follow a fixed section schema — " +
  "FERNS stores whatever sections the page presented at capture time; section names and presence vary by community type.";

export const MNFI_REGISTRY_ENTRY = {
  source_id: MNFI_SOURCE_ID,
  name: "Michigan Natural Features Inventory — Natural Community Classification",
  knowledge_type: "source_wrapper" as const,
  status: "live" as const,
  description:
    "Community classifications, ecological descriptions, characteristic plant lists, rare species per community and county, " +
    "and county-level occurrence records for tracked rare species and natural communities across all 83 Michigan counties — " +
    "covering 77 community types spanning Michigan's major ecological zones. " +
    "From the Michigan Natural Features Inventory (MNFI), a research program of Michigan State University Extension.",
  input_summary:
    "Community slug; species scientific name; or Michigan county name",
  output_summary:
    "Natural community classification data: name, class, group, global rank, state rank, " +
    "ecological description sections, characteristic plant list, rare species, and similar communities. " +
    "Species data: conservation status, kind, category, and county distribution. " +
    "County data: all tracked rare species and community occurrences with conservation status codes.",
  dependencies: [] as string[],
  update_frequency:
    "Static — MNFI's natural community classification is a published reference work. " +
    "Data reflects the capture date stored in each response (MNFI_SCRAPED_AT). " +
    "Re-capture requires a new scraping run against the MNFI website.",
  known_limitations:
    "Michigan only; no national or multi-state coverage. " +
    "Observation and locality data (subscription/login-walled on the MNFI site) is not included. " +
    "Coverage is authoritative for tracked rare species but does not include common species. " +
    "Community sections vary by type; some sections may be absent for certain communities.",
  metadata_url: "/api/mnfi/metadata",
  licenses: MNFI_LICENSES,
  license_notes: MNFI_LICENSE_NOTES,
  license: "cc-by",
  rights:
    "CC BY — attribution required. Data published by Michigan Natural Features Inventory (MNFI), " +
    "a research program of Michigan State University Extension, at mnfi.anr.msu.edu. " +
    "Cite: Cohen et al. (2025), MNFI Natural Community Classification.",
  website_url_patterns: {
    community: "https://mnfi.anr.msu.edu/communities/{community_id}/{slug}",
    plant_list: "https://mnfi.anr.msu.edu/communities/plant-list/{community_id}/{slug}",
  },
  general_summary: MNFI_GENERAL_SUMMARY,
  technical_details: MNFI_TECHNICAL_DETAILS,
  non_passthrough_endpoints: [
    { endpoint: "/api/mnfi/metadata",                   kind: "metadata"  },
    { endpoint: "/api/mnfi/communities",                kind: "in_memory" },
    { endpoint: "/api/mnfi/communities/{slug}",         kind: "in_memory" },
    { endpoint: "/api/mnfi/species",                    kind: "in_memory" },
    { endpoint: "/api/mnfi/species/{name}",             kind: "in_memory" },
    { endpoint: "/api/mnfi/species/{name}/communities", kind: "in_memory" },
    { endpoint: "/api/mnfi/species/{name}/counties",    kind: "in_memory" },
    { endpoint: "/api/mnfi/counties",                   kind: "in_memory" },
    { endpoint: "/api/mnfi/counties/{county}",          kind: "in_memory" },
  ],
  permission_granted: true,
};
