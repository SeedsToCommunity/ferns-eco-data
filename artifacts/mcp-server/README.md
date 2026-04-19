# FERNS MCP Server

The FERNS MCP Server exposes every public [FERNS](https://data.ecologicalcommons.org) endpoint as a Model Context Protocol (MCP) tool, so any MCP-compatible AI assistant (Claude Desktop, Cursor, etc.) can query 22+ ecological data sources directly.

One REST endpoint = one MCP tool. No aggregation, no magic — each tool is a faithful 1:1 proxy of its underlying FERNS route.

## Quick start

### Requirements

- Node 18+ (`node --version`)
- `FERNS_API_BASE` env var pointing at a running FERNS API (default: `http://localhost:8080`)

### Build the compiled binary (required before first use)

```bash
pnpm --filter @workspace/mcp-server run build
# Produces: artifacts/mcp-server/dist/index.mjs
```

### Claude Desktop configuration

Add the following block to your `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ferns": {
      "command": "node",
      "args": ["/absolute/path/to/artifacts/mcp-server/dist/index.mjs"],
      "env": {
        "FERNS_API_BASE": "https://data.ecologicalcommons.org"
      }
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to this repository on your machine.

> **Tip:** If you are running FERNS locally, set `FERNS_API_BASE` to `http://localhost:8080` (the default) and omit the `env` block entirely.

### Cursor configuration

Add to `.cursor/mcp.json` in your project root:

```json
{
  "mcpServers": {
    "ferns": {
      "command": "node",
      "args": ["/absolute/path/to/artifacts/mcp-server/dist/index.mjs"],
      "env": {
        "FERNS_API_BASE": "https://data.ecologicalcommons.org"
      }
    }
  }
}
```

### Development (no build step)

```bash
pnpm --filter @workspace/mcp-server run dev
```

This runs the server directly from TypeScript source using `tsx`, without compiling first. Useful for iterating during development.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `FERNS_API_BASE` | `http://localhost:8080` | Base URL of the FERNS REST API. Trailing slash is stripped automatically. |

## Tool inventory (48 tools)

Tool names follow `{source_id}__{action}` (hyphens → underscores, double-underscore separator).

### bonap-napa — BONAP North American Plant Atlas

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `bonap_napa__map` | GET /bonap/map | genus, species | map_type, refresh | County-level distribution map URL for a species from the BONAP North American Plant Atlas |

### gbif — Global Biodiversity Information Facility

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `gbif__match` | GET /gbif/match | name | refresh | Match a scientific name to the GBIF taxonomic backbone; returns usage key, rank, and confidence |
| `gbif__reconcile` | GET /gbif/reconcile | usageKey | — | Full taxonomic record for a GBIF usage key: vernacular names, synonyms, higher taxonomy |
| `gbif__occurrences` | GET /gbif/occurrences | usageKey | countries, continent, bbox, refresh | Aggregated occurrence counts for a taxon, filterable by country, continent, or bounding box |
| `gbif__search` | GET /gbif/search | q | — | Full-text search across the GBIF species index by scientific or common name |

### inaturalist — iNaturalist

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `inaturalist__place` | GET /inat/place | q | refresh | Search iNaturalist places by name and return place IDs for use in other iNaturalist tools |
| `inaturalist__species` | GET /inat/species | name | refresh | iNaturalist taxon record for a scientific name: taxon ID, common name, default photo, observation count |
| `inaturalist__histogram` | GET /inat/histogram | taxon_id | place_id, refresh | Monthly phenology histogram of observation counts for a taxon, optionally filtered by place |
| `inaturalist__field_values` | GET /inat/field-values | taxon_id | place_id, verifiable, refresh | Observer-submitted field values (habitat, height, etc.) for a taxon from iNaturalist |
| `inaturalist__observations` | GET /inat/observations | — | taxon_id, place_id | Construct iNaturalist observation URLs for a taxon and/or place |

### michigan-flora — Michigan Flora

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `michigan_flora__species` | GET /miflora/species | name | refresh | Full Michigan Flora species profile: family, nativity, habitat notes, species page link |
| `michigan_flora__counties` | GET /miflora/counties | name | refresh | County-level occurrence records for a species within Michigan |
| `michigan_flora__images` | GET /miflora/images | name | refresh | Image URLs and metadata for a species from the Michigan Flora image collection |

### coefficient-of-conservatism — Coefficient of Conservatism

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `coefficient_of_conservatism__lookup` | GET /coefficient-of-conservatism | value | — | Look up a single C-value (0–10): label and ecological description of that conservatism level |
| `coefficient_of_conservatism__all` | GET /coefficient-of-conservatism/all | — | — | All C-value records (0–10) with labels and descriptions — the complete reference table |

### wetland-indicator-status — Wetland Indicator Status (USDA NRCS)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `wetland_indicator_status__by_code` | GET /wetland-indicator | code | — | Wetland Indicator Status record for a USDA NRCS code (OBL, FACW, FAC, FACU, UPL): name, description, W-value |
| `wetland_indicator_status__by_w_value` | GET /wetland-indicator/w | value | — | Wetland Indicator Status record for a numeric W-value (−5, −3, 0, 3, or 5) |
| `wetland_indicator_status__all` | GET /wetland-indicator/all | — | — | All five wetland indicator codes with descriptions and W numeric values — the complete reference table |

### wucols-water-use — WUCOLS Water Use Classifications

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `wucols_water_use__lookup` | GET /wucols | code | — | WUCOLS water-use classification for a code (H, M, L, VL): label and irrigation need description |
| `wucols_water_use__all` | GET /wucols/all | — | — | All WUCOLS water-use codes with descriptions covering High, Medium, Low, and Very Low categories |

### seeds-to-community-washtenaw — Seeds to Community Washtenaw

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `seeds_to_community_washtenaw__species` | GET /s2c | year | — | Species available in the Seeds to Community Washtenaw seed catalog for a given year |
| `seeds_to_community_washtenaw__years` | GET /s2c/years | — | — | Years for which Seeds to Community Washtenaw seed availability data exists |

### lcscg — Lake County Seed Collection Guides

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `lcscg__guides` | GET /lcscg/guides | — | — | All 12 Lake County Seed Collection Guides with IDs, titles, seasons, and habitat types |
| `lcscg__guide` | GET /lcscg/guide/{guideId} | guideId | — | Full species list and details for one Lake County Seed Collection Guide by guide ID |
| `lcscg__species` | GET /lcscg/species | name | — | Search the LCSCG guides for a plant by name; returns harvest instructions, photos, and seed group |

### universal-fqa — Universal FQA

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `universal_fqa__databases` | GET /universal-fqa/databases | — | — | All FQA databases registered in the Universal FQA Tool, each representing a regional C-value list |
| `universal_fqa__database` | GET /universal-fqa/databases/{id} | id | — | Full details for a specific FQA database by ID: metadata and species count |
| `universal_fqa__species` | GET /universal-fqa/species | name, database_id | — | C-value and FQA attributes for a species within a specific regional FQA database |
| `universal_fqa__assessments` | GET /universal-fqa/assessments | database_id | — | All FQA site assessments stored in a given FQA database |
| `universal_fqa__assessment` | GET /universal-fqa/assessment/{id} | id | — | Full FQA assessment details: species list, FQI score, mean C-value, and site information |

### gobotany — Go Botany (Native Plant Trust)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `gobotany__species` | GET /gobotany | species | — | Go Botany species page URL for a plant; covers vascular flora of New England with identification keys |

### google-images — Google Images

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `google_images__search` | GET /google-images | species | — | Google Images search URL for a plant species — quick visual reference or identification aid |

### illinois-wildflowers — Illinois Wildflowers

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `illinois_wildflowers__species` | GET /illinois-wildflowers | species | — | Illinois Wildflowers species page URL: descriptions, photos, and ecological notes for Illinois flora |

### lady-bird-johnson — Lady Bird Johnson Wildflower Center

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `lady_bird_johnson__species` | GET /lady-bird-johnson | species | — | Lady Bird Johnson Wildflower Center search URL for a plant — one of the largest native plant databases |

### minnesota-wildflowers — Minnesota Wildflowers

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `minnesota_wildflowers__species` | GET /minnesota-wildflowers | species | — | Minnesota Wildflowers species page URL: photos, bloom times, habitat info, and Minnesota distribution |

### missouri-plants — Missouri Plants

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `missouri_plants__species` | GET /missouri-plants | species | — | Missouri Plants species page URL: photographs, descriptions, and habitat notes for Missouri flora |

### mnfi — Michigan Natural Features Inventory

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `mnfi__communities` | GET /mnfi/communities | — | class, group, name | Michigan natural community types from MNFI, optionally filtered by class, group, or name |
| `mnfi__community` | GET /mnfi/communities/{id} | id | — | Full MNFI natural community profile by ID: description, associated species, disturbance regime |
| `mnfi__community_plants` | GET /mnfi/communities/{id}/plants | id | — | Plant species associated with a specific MNFI natural community |
| `mnfi__county_elements` | GET /mnfi/county-elements | — | county, type | Rare species and natural community occurrences tracked by MNFI for a Michigan county |

### natureserve — NatureServe

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `natureserve__species` | GET /natureserve/species | name | state, refresh | NatureServe G-rank and S-rank conservation status for a species, optionally filtered by US state |
| `natureserve__ecosystems` | GET /natureserve/ecosystems | name | refresh | NatureServe ecological system records matching a name: codes, descriptions, species assemblages |

### prairie-moon — Prairie Moon Nursery

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `prairie_moon__species` | GET /prairie-moon | species | — | Prairie Moon Nursery catalog entry for a species: availability status and product page link |

### usda-plants — USDA Plants Database

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `usda_plants__species` | GET /usda-plants | species | — | USDA Plants Database record: USDA symbol, accepted name, nativity status, and profile link |

### botanical-refs — Botanical Web References

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `botanical_refs__lookup` | GET /botanical-refs | species | — | Queries 8 botanical websites simultaneously for a species and returns each site's URL in one call |
| `botanical_refs__sites` | GET /botanical-refs/sites | — | — | The botanical reference websites covered by botanical_refs__lookup with each site's strategy |

### ferns — FERNS Registry (meta)

| Tool | Path | Required | Optional | Description |
|---|---|---|---|---|
| `ferns__list_sources` | GET /v1/sources | — | — | Full registry of all FERNS data sources: IDs, names, descriptions, capabilities, and status |
| `ferns__source_relationships` | GET /v1/source-relationships | — | source_id | Relationship graph between FERNS data sources, optionally filtered to one source |

## Design notes

- **Strict 1:1 mapping.** Every MCP tool corresponds to exactly one FERNS REST endpoint. No aggregation, no fan-out.
- **Stdio transport.** The server communicates over stdin/stdout, the standard transport for local MCP servers.
- **Read-only.** No write or admin endpoints are exposed.
- **Error passthrough.** If the FERNS API returns an error, the tool returns `isError: true` with the status and body in the content.
- **Adding a new source.** Add one or more tool definitions to `src/index.ts` following the `{source_id}__{action}` convention, rebuild (`pnpm run build`), and update this README table.
