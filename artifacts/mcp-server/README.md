# FERNS MCP Server

The FERNS MCP Server exposes every public [FERNS](https://data.ecologicalcommons.org) endpoint as a Model Context Protocol (MCP) tool, so any MCP-compatible AI assistant (Claude Desktop, Cursor, etc.) can query 22+ ecological data sources directly.

One REST endpoint = one MCP tool. No aggregation, no magic — each tool is a faithful 1:1 proxy of its underlying FERNS route.

## Quick start

### Requirements

- Node 18+ (`node --version`)
- `FERNS_API_BASE` env var pointing at a running FERNS API (default: `http://localhost:8080`)

### Run directly (development)

```bash
pnpm --filter @workspace/mcp-server run start
```

### Claude Desktop configuration

Add the following block to your `claude_desktop_config.json` (macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "ferns": {
      "command": "node",
      "args": ["--import=tsx/esm", "/absolute/path/to/artifacts/mcp-server/src/index.ts"],
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
      "args": ["--import=tsx/esm", "/absolute/path/to/artifacts/mcp-server/src/index.ts"],
      "env": {
        "FERNS_API_BASE": "https://data.ecologicalcommons.org"
      }
    }
  }
}
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `FERNS_API_BASE` | `http://localhost:8080` | Base URL of the FERNS REST API. Trailing slash is stripped automatically. |

## Tool inventory (48 tools)

Tool names follow `{source_id}__{action}` (hyphens → underscores, double-underscore separator).

### bonap-napa — BONAP North American Plant Atlas

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `bonap_napa__map` | GET /bonap/map | genus, species | map_type, refresh |

### gbif — Global Biodiversity Information Facility

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `gbif__match` | GET /gbif/match | name | refresh |
| `gbif__reconcile` | GET /gbif/reconcile | usageKey | — |
| `gbif__occurrences` | GET /gbif/occurrences | usageKey | countries, continent, bbox, refresh |
| `gbif__search` | GET /gbif/search | q | — |

### inaturalist — iNaturalist

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `inaturalist__place` | GET /inat/place | q | refresh |
| `inaturalist__species` | GET /inat/species | name | refresh |
| `inaturalist__histogram` | GET /inat/histogram | taxon_id | place_id, refresh |
| `inaturalist__field_values` | GET /inat/field-values | taxon_id | place_id, verifiable, refresh |
| `inaturalist__observations` | GET /inat/observations | — | taxon_id, place_id |

### michigan-flora — Michigan Flora

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `michigan_flora__species` | GET /miflora/species | name | refresh |
| `michigan_flora__counties` | GET /miflora/counties | name | refresh |
| `michigan_flora__images` | GET /miflora/images | name | refresh |

### coefficient-of-conservatism — Coefficient of Conservatism

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `coefficient_of_conservatism__lookup` | GET /coefficient-of-conservatism | value | — |
| `coefficient_of_conservatism__all` | GET /coefficient-of-conservatism/all | — | — |

### wetland-indicator-status — Wetland Indicator Status (USDA NRCS)

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `wetland_indicator_status__by_code` | GET /wetland-indicator | code | — |
| `wetland_indicator_status__by_w_value` | GET /wetland-indicator/w | value | — |
| `wetland_indicator_status__all` | GET /wetland-indicator/all | — | — |

### wucols-water-use — WUCOLS Water Use Classifications

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `wucols_water_use__lookup` | GET /wucols | code | — |
| `wucols_water_use__all` | GET /wucols/all | — | — |

### seeds-to-community-washtenaw — Seeds to Community Washtenaw

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `seeds_to_community_washtenaw__species` | GET /s2c | year | — |
| `seeds_to_community_washtenaw__years` | GET /s2c/years | — | — |

### lcscg — Lake County Seed Collection Guides

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `lcscg__guides` | GET /lcscg/guides | — | — |
| `lcscg__guide` | GET /lcscg/guide/{guideId} | guideId | — |
| `lcscg__species` | GET /lcscg/species | name | — |

### universal-fqa — Universal FQA

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `universal_fqa__databases` | GET /universal-fqa/databases | — | — |
| `universal_fqa__database` | GET /universal-fqa/databases/{id} | id | — |
| `universal_fqa__species` | GET /universal-fqa/species | name, database_id | — |
| `universal_fqa__assessments` | GET /universal-fqa/assessments | database_id | — |
| `universal_fqa__assessment` | GET /universal-fqa/assessment/{id} | id | — |

### gobotany — Go Botany (Native Plant Trust)

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `gobotany__species` | GET /gobotany | species | — |

### google-images — Google Images

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `google_images__search` | GET /google-images | species | — |

### illinois-wildflowers — Illinois Wildflowers

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `illinois_wildflowers__species` | GET /illinois-wildflowers | species | — |

### lady-bird-johnson — Lady Bird Johnson Wildflower Center

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `lady_bird_johnson__species` | GET /lady-bird-johnson | species | — |

### minnesota-wildflowers — Minnesota Wildflowers

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `minnesota_wildflowers__species` | GET /minnesota-wildflowers | species | — |

### missouri-plants — Missouri Plants

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `missouri_plants__species` | GET /missouri-plants | species | — |

### mnfi — Michigan Natural Features Inventory

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `mnfi__communities` | GET /mnfi/communities | — | class, group, name |
| `mnfi__community` | GET /mnfi/communities/{id} | id | — |
| `mnfi__community_plants` | GET /mnfi/communities/{id}/plants | id | — |
| `mnfi__county_elements` | GET /mnfi/county-elements | — | county, type |

### natureserve — NatureServe

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `natureserve__species` | GET /natureserve/species | name | state, refresh |
| `natureserve__ecosystems` | GET /natureserve/ecosystems | name | refresh |

### prairie-moon — Prairie Moon Nursery

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `prairie_moon__species` | GET /prairie-moon | species | — |

### usda-plants — USDA Plants Database

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `usda_plants__species` | GET /usda-plants | species | — |

### botanical-refs — Botanical Web References

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `botanical_refs__lookup` | GET /botanical-refs | species | — |
| `botanical_refs__sites` | GET /botanical-refs/sites | — | — |

### ferns — FERNS Registry (meta)

| Tool | Path | Required params | Optional params |
|---|---|---|---|
| `ferns__list_sources` | GET /v1/sources | — | — |
| `ferns__source_relationships` | GET /v1/source-relationships | — | source_id |

## Design notes

- **Strict 1:1 mapping.** Every MCP tool corresponds to exactly one FERNS REST endpoint. No aggregation, no fan-out.
- **Stdio transport.** The server communicates over stdin/stdout, the standard transport for local MCP servers.
- **Read-only.** No write or admin endpoints are exposed.
- **Error passthrough.** If the FERNS API returns an error, the tool returns `isError: true` with the status and body in the content.
- **Adding a new source.** Add one or more tool definitions to `src/index.ts` following the `{source_id}__{action}` convention, then update this README.
