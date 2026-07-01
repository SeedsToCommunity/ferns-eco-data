# Ecological Commons MCP Server

The Ecological Commons MCP Server exposes every public [data layer](https://data.ecologicalcommons.org) endpoint as a Model Context Protocol (MCP) tool, so any MCP-compatible AI assistant (Claude Desktop, Cursor, etc.) can query 22+ ecological data sources directly.

One REST endpoint = one MCP tool. No aggregation, no magic — each tool is a faithful 1:1 proxy of its underlying API route.

## Connecting to the remote MCP server

The MCP server runs as part of the Ecological Commons data layer at `https://data.ecologicalcommons.org/mcp`. No local installation required.

### Claude Desktop (remote)

Add the following block to your `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ecological-commons": {
      "type": "http",
      "url": "https://data.ecologicalcommons.org/mcp"
    }
  }
}
```

### Cursor (remote)

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "ecological-commons": {
      "type": "http",
      "url": "https://data.ecologicalcommons.org/mcp"
    }
  }
}
```

### Other MCP clients

The endpoint accepts HTTP POST to `https://data.ecologicalcommons.org/mcp` with:

- `Content-Type: application/json`
- `Accept: application/json, text/event-stream`
- Body: JSON-RPC 2.0 message

Responses are streamed as Server-Sent Events (SSE). The server operates in stateless mode — no session management required.

---

## Migration note

If you have an existing local stdio config that sets `FERNS_API_BASE`, rename that env key to `API_BASE`. The old name is no longer recognised.

---

## Local / stdio mode (development only)

If you want to run the server locally against a local API instance:

### Requirements

- Node 18+ (`node --version`)
- `API_BASE` env var pointing at a running API instance (default: `http://localhost:8080`)

### Build the compiled binary

```bash
pnpm --filter @workspace/mcp-server run build
# Produces: artifacts/mcp-server/dist/index.mjs
```

### Claude Desktop configuration (local stdio)

```json
{
  "mcpServers": {
    "ecological-commons": {
      "command": "node",
      "args": ["/absolute/path/to/artifacts/mcp-server/dist/index.mjs"],
      "env": {
        "API_BASE": "https://data.ecologicalcommons.org"
      }
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to this repository on your machine.

### Development (no build step)

```bash
pnpm --filter @workspace/mcp-server run dev
```

This runs the server directly from TypeScript source using `tsx`, without compiling first.

---

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `API_BASE` | `http://localhost:8080` | Base URL of the Ecological Commons REST API (stdio mode only). Trailing slash stripped automatically. |

---

## Tool inventory (67 tools)

Tool names follow `{source_id}__{action}` (hyphens → underscores, double-underscore separator).

### bonap-napa — BONAP North American Plant Atlas

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `bonap_napa__map` | GET /bonap/map | genus, species | map_type, refresh | County-level distribution map URL for a species from the BONAP North American Plant Atlas |

### gbif — Global Biodiversity Information Facility

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `gbif__species_match` | GET /gbif/species/match | name | rank, strict, refresh | Match a scientific name to the GBIF backbone taxonomy; returns usageKey, rank, confidence, and status |
| `gbif__species_search` | GET /gbif/species/search | q | refresh | Search GBIF species by vernacular (common) name; returns paginated species results |
| `gbif__species` | GET /gbif/species/{usageKey} | usageKey | refresh | Full GBIF species record for a known usageKey |
| `gbif__species_synonyms` | GET /gbif/species/{usageKey}/synonyms | usageKey | limit, offset, refresh | All taxonomic synonyms for a GBIF taxon |
| `gbif__species_vernacular_names` | GET /gbif/species/{usageKey}/vernacularNames | usageKey | limit, offset, refresh | All vernacular (common) names for a GBIF taxon across all languages |
| `gbif__occurrence_search` | GET /gbif/occurrence/search | — | taxonKey, country, continent, hasCoordinate, hasGeospatialIssue, basisOfRecord, year, limit, offset, refresh | Search GBIF occurrence records using GBIF native parameters (passthrough) |

### inaturalist — iNaturalist

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `inaturalist__places_autocomplete` | GET /inat/places/autocomplete | q | refresh | Search iNaturalist places by name and return place IDs for use in other iNaturalist tools |
| `inaturalist__observations_histogram` | GET /inat/observations/histogram | taxon_id | place_id, term_id, term_value_id, refresh | Monthly phenology histogram of observation counts for a taxon, optionally filtered by place |
| `inaturalist__observations_popular_field_values` | GET /inat/observations/popular_field_values | taxon_id | place_id, verifiable, refresh | Observer-submitted field values (habitat, height, etc.) for a taxon from iNaturalist |
| `inaturalist__observations` | GET /inat/observations | — | taxon_id, place_id, quality_grade, per_page, page | Paged slim observation records from iNaturalist |
| `inaturalist__observations_species_counts` | GET /inat/observations/species_counts | — | place_id, quality_grade, iconic_taxon_name, native, introduced | Species ranked by observation count from iNaturalist |
| `inaturalist__controlled_terms` | GET /inat/controlled_terms | — | refresh | Full list of iNaturalist controlled annotation terms and values |
| `inaturalist__controlled_terms_for_taxon` | GET /inat/controlled_terms/for_taxon | taxon_id | refresh | Controlled annotation terms applicable to a specific taxon |
| `inaturalist__taxa_autocomplete` | GET /inat/taxa/autocomplete | q | per_page, rank, locale | Fast partial-name taxon search for finding taxon IDs |
| `inaturalist__taxa_by_id` | GET /inat/taxa/{id} | id | refresh | Full iNaturalist taxon record by numeric ID |
| `inaturalist__places_by_id` | GET /inat/places/{id} | id | refresh | Full iNaturalist place record by numeric ID |
| `inaturalist__places_nearby` | GET /inat/places/nearby | nelat, nelng, swlat, swlng | — | iNaturalist places within a bounding box |
| `inaturalist__observations_taxon_summary` | GET /inat/observations/{id}/taxon_summary | observation_id | — | Wikipedia summary, nativity, and conservation status for a taxon at an observation location |
| `inaturalist__identifications_similar_species` | GET /inat/identifications/similar_species | taxon_id | place_id, quality_grade | Species commonly confused with a given taxon |
| `inaturalist__identifications_species_counts` | GET /inat/identifications/species_counts | — | taxon_id, place_id, taxon_of | Species ranked by identification activity |
| `inaturalist__identifications_recent_taxa` | GET /inat/identifications/recent_taxa | — | place_id, taxon_id, quality_grade | Taxa recently identified in a place |
| `inaturalist__identifications` | GET /inat/identifications | — | taxon_id, place_id, per_page, page | Paged list of individual iNaturalist identification records |
| `inaturalist__identifications_by_id` | GET /inat/identifications/{id} | id | — | Single iNaturalist identification record by ID |

### michigan-flora — Michigan Flora

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `michigan_flora__flora_search_sp` | GET /miflora/flora_search_sp | scientific_name | refresh | Search Michigan Flora by scientific name — returns array of matching species records |
| `michigan_flora__locs_sp` | GET /miflora/locs_sp | id | refresh | County-level occurrence records for a Michigan Flora species by plant_id |
| `michigan_flora__allimage_info` | GET /miflora/allimage_info | id | refresh | All image records for a Michigan Flora species by plant_id |

### coefficient-of-conservatism — Coefficient of Conservatism

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `coefficient_of_conservatism__lookup` | GET /coefficient-of-conservatism | value | — | Look up a single C-value (0–10): label and ecological description of that conservatism level |
| `coefficient_of_conservatism__list` | GET /coefficient-of-conservatism/list | — | — | All C-value records (0–10) with labels and descriptions — the complete reference table |

### wetland-indicator-status — Wetland Indicator Status (USDA NRCS)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `wetland_indicator_status__by_code` | GET /wetland-indicator-status | code | — | Wetland Indicator Status record for a USDA NRCS code (OBL, FACW, FAC, FACU, UPL): name, description, W-value |
| `wetland_indicator_status__by_w` | GET /wetland-indicator-status/w | value | — | Wetland Indicator Status record for a numeric W-value (−5, −3, 0, 3, or 5) |
| `wetland_indicator_status__list` | GET /wetland-indicator-status/list | — | — | All five wetland indicator codes with descriptions and W numeric values — the complete reference table |

### wucols-water-use — WUCOLS Water Use Classifications

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `wucols_water_use__lookup` | GET /wucols | code | — | WUCOLS water-use classification for a code (H, M, L, VL): label and irrigation need description |
| `wucols_water_use__list` | GET /wucols/list | — | — | All WUCOLS water-use codes with descriptions covering High, Medium, Low, and Very Low categories |

### seeds-to-community-washtenaw — Seeds to Community Washtenaw

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `seeds_to_community_washtenaw__seed_availability` | GET /seeds-to-community-washtenaw/seed-availability | year | — | Species available in the Seeds to Community Washtenaw seed catalog for a given year |
| `seeds_to_community_washtenaw__years` | GET /s2c/years | — | — | Years for which Seeds to Community Washtenaw seed availability data exists |
| `seeds_to_community_washtenaw__species_information` | GET /seeds-to-community-washtenaw/species-information | species | provenance_verbosity | Detailed species record for a single plant in the S2C dataset, looked up by botanical name; includes availability across catalog years and seed collection notes |

### lcscg — Lake County Seed Collection Guides

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `lcscg__guides` | GET /lcscg/guides | — | — | All 12 Lake County Seed Collection Guides with IDs, titles, seasons, and habitat types |
| `lcscg__guide` | GET /lcscg/guide/{guideId} | guideId | — | Full species list and details for one Lake County Seed Collection Guide by guide ID |
| `lcscg__species` | GET /lcscg/species | name | — | Search the LCSCG guides for a plant by name; returns harvest instructions, photos, and seed group |

### universal-fqa — Universal FQA

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `universal_fqa__get_database_list` | GET /universal-fqa/get/database | — | — | All regional FQA databases registered on universalfqa.org; verbatim upstream `{ status, data: unknown[][] }` |
| `universal_fqa__get_database` | GET /universal-fqa/get/database/{id} | id | — | Verbatim upstream row-indexed response for one FQA database by ID |
| `universal_fqa__get_database_inventory` | GET /universal-fqa/get/database/{id}/inventory | id | — | Verbatim upstream row-indexed list of public site assessments for a FQA database |
| `universal_fqa__get_inventory` | GET /universal-fqa/get/inventory/{id} | id | — | Verbatim upstream row-indexed response for one FQA site assessment by ID |

### gobotany — Go Botany (Native Plant Trust)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `gobotany__species` | GET /gobotany | species | — | Go Botany species page URL for a plant; covers vascular flora of New England with identification keys |
| `gobotany__species_text` | GET /gobotany/species-text | species | refresh | Full parsed text from the Go Botany species page: named prose sections (Facts, Distribution, Growing Conditions, etc.), cache status, and scrape timestamp |

### google-images — Google Images

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `google_images__search` | GET /google-images | species | — | Google Images search URL for a plant species — quick visual reference or identification aid |

### illinois-wildflowers — Illinois Wildflowers

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `illinois_wildflowers__species` | GET /illinois-wildflowers | species | — | Illinois Wildflowers species page URL: descriptions, photos, and ecological notes for Illinois flora |
| `illinois_wildflowers__species_text` | GET /illinois-wildflowers/species-text | species | refresh | Full parsed text from the Illinois Wildflowers species page: named prose sections (Description, Habitat & Light, Origin, Faunal Associations, etc.), cache status, and scrape timestamp |

### lady-bird-johnson — Lady Bird Johnson Wildflower Center

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `lady_bird_johnson__species` | GET /lady-bird-johnson | species | — | Lady Bird Johnson Wildflower Center search URL for a plant — one of the largest native plant databases |

### minnesota-wildflowers — Minnesota Wildflowers

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `minnesota_wildflowers__species` | GET /minnesota-wildflowers | species | — | Minnesota Wildflowers species page URL: photos, bloom times, habitat info, and Minnesota distribution |
| `minnesota_wildflowers__species_text` | GET /minnesota-wildflowers/species-text | species | refresh | Full parsed text from the Minnesota Wildflowers species page: named prose sections (Description, Habitat, Leaves, Flowers, Fruit, Notes, etc.), cache status, and scrape timestamp |

### missouri-plants — Missouri Plants

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `missouri_plants__species` | GET /missouri-plants | species | — | Missouri Plants species page URL: photographs, descriptions, and habitat notes for Missouri flora |
| `missouri_plants__species_text` | GET /missouri-plants/species-text | species | refresh | Full parsed text from the Missouri Plants species page: named prose sections (Description, Similar Species, Habitat, Origin, Uses, etc.), cache status, and scrape timestamp |

### mnfi — Michigan Natural Features Inventory

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `mnfi__communities_list` | GET /mnfi/communities | — | class, group, rank, name | All 77 MNFI natural community types, optionally filtered by ecological class, group, rank, or name |
| `mnfi__communities` | GET /mnfi/communities/{slug} | slug | — | Full MNFI natural community profile by URL slug: sections, characteristic plants, rare species, similar communities, map links |
| `mnfi__species_list` | GET /mnfi/species | — | name, kind, status, rank, category, limit, offset | Paginated list of MNFI tracked rare species with optional filters |
| `mnfi__species` | GET /mnfi/species/{name} | name | — | Single MNFI rare species record by URL-encoded scientific name |
| `mnfi__species_communities` | GET /mnfi/species/{name}/communities | name | — | MNFI natural community stubs for all communities whose rare-species list includes the given species |
| `mnfi__species_counties` | GET /mnfi/species/{name}/counties | name | — | Michigan county names where the given rare species has been recorded in MNFI county data |
| `mnfi__counties_list` | GET /mnfi/counties | — | — | Canonical authoritative list of all 83 Michigan counties |
| `mnfi__counties` | GET /mnfi/counties/{county} | county | kind, status, category | All tracked rare species and natural community occurrences for a Michigan county |

### natureserve — NatureServe

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `natureserve__species_search` | GET /natureserve/speciesSearch | name | refresh | Verbatim NatureServe speciesSearch response: resultsSummary and results[] with uniqueId, ranks, IUCN, federal status |
| `natureserve__search` | GET /natureserve/search | q | recordType, limit, page, refresh | Verbatim NatureServe search response for ecosystems, species, communities, or associations |
| `natureserve__taxon` | GET /natureserve/taxon/{uniqueId} | uniqueId | refresh | Full verbatim NatureServe taxon record by uniqueId — obtain uniqueId from natureserve__species_search results |

### prairie-moon — Prairie Moon Nursery

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `prairie_moon__species` | GET /prairie-moon | species | — | Prairie Moon Nursery catalog entry for a species: availability status and product page link |
| `prairie_moon__species_text` | GET /prairie-moon/species-text | species | refresh | Full parsed text from the Prairie Moon plant page: named prose sections (Description, Culture, Wildlife Value, Comments, etc.), cache status, and scrape timestamp |

### usda-plants — USDA Plants Database

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `usda_plants__species` | GET /usda-plants | species | refresh | Resolves a scientific name to a USDA symbol and returns the full plant profile: nativity per US region, taxonomy, synonyms, wetland data, legal statuses, and document links |
| `usda_plants__profile` | GET /usda-plants/profile | symbol | refresh | Full USDA PLANTS profile for a known symbol (e.g. ASTU). Use when the symbol is already known |
| `usda_plants__search` | GET /usda-plants/search | q | field, page | Search the USDA PLANTS database by Scientific Name, Common Name, Symbol, or Family |


### ann-arbor-npn — Ann Arbor Native Plant Nursery

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `ann_arbor_npn__species` | GET /ann-arbor-npn/species/{key} | key | provenance_verbosity | Single NPN species record resolved by acronym (e.g. LOBSIP), Latin name, Greg's Latin synonym, or any common name — via in-memory alias index. Returns 404 when not found. |
| `ann_arbor_npn__species_list` | GET /ann-arbor-npn/species | — | provenance_verbosity | All 130 NPN species with ecological attributes, nursery pricing, and Cloudinary image URLs (photograph / drawing). Static in-memory snapshot from 2026-06-01. |
| `ann_arbor_npn__species_source_url` | GET /ann-arbor-npn/species/{key}/source-url | key | provenance_verbosity | Per-species nativeplant.com URL for a given key (any name flavor). Returns 404 when not found. |
| `ann_arbor_npn__alias_index` | GET /ann-arbor-npn/alias-index | — | provenance_verbosity | All 130 NPN species as name groups with common_names[] and all_accepted_keys — designed for cross-source reconciliation against GBIF, USDA PLANTS, or iNaturalist. |
| `ann_arbor_npn__documentation` | GET /ann-arbor-npn/documentation | — | provenance_verbosity | Full source documentation as Markdown: Greg Vaclavek's background, field descriptions, Michigan range vocabulary, alias index construction, Cloudinary storage, and migration history. |

### wildtype-native-plants — WildType Native Plants

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `wildtype_native_plants__plant_guide_list` | GET /wildtype-native-plants/plant-guide | — | category | Full WildType cultural guide (249 Michigan native plant species) with optional category filter; each record includes bloom data, sun/moisture preferences, height, and ecological notes |
| `wildtype_native_plants__plant_guide` | GET /wildtype-native-plants/plant-guide/:scientific_name | scientific_name | — | Single WildType species record by scientific name (case-insensitive exact match); returns found=false if not in guide |
| `wildtype_native_plants__note_codes` | GET /wildtype-native-plants/note-codes | — | — | Full ecological note-code legend: all 23 codes with descriptions (LH, EW, GC, N, PP, O, and others) |

### registry — Ecological Commons Registry (meta)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `registry__list_sources` | GET /v1/sources | — | — | Full registry of all Ecological Commons data sources: IDs, names, descriptions, capabilities, and status |
| `registry__source_relationships` | GET /v1/source-relationships | — | source_id | Relationship graph between data sources, optionally filtered to one source |

---

## Design notes

- **Streamable HTTP transport (primary).** The server runs as part of the Ecological Commons data layer at `data.ecologicalcommons.org/mcp`, using the MCP Streamable HTTP transport. Responses are SSE-formatted. No session management (stateless mode).
- **Stdio transport (development fallback).** `artifacts/mcp-server/src/index.ts` runs a stdio-based MCP server for local integration with Claude Desktop or Cursor when you prefer not to rely on the deployed endpoint.
- **Strict 1:1 mapping.** Every MCP tool corresponds to exactly one REST endpoint. No aggregation, no fan-out.
- **Read-only.** No write or admin endpoints are exposed.
- **Error passthrough.** If the API returns an error, the tool returns `isError: true` with the status and body in the content.
- **Adding a new source.** Add tool definitions to `artifacts/mcp-server/src/server.ts` following the `{source_id}__{action}` convention, then update this README table.
