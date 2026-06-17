# FERNS Data Adapter Interfaces

The Data Adapter exposes the IDP's Source Interface to the outside world via REST and MCP. Each layer's names are derived mechanically from the same canonical action name. See the action-name consistency rule in `docs/data-layer-contract.md` for the full derivation table.

## Derivation summary

| REST route | MCP tool | IDP method |
|---|---|---|
| `GET /api/{source-id}/metadata` | `{source}__metadata` | *(none — served by Adapter's metadata.ts)* |
| `GET /api/{source-id}/{action}` (collection) | `{source}__{action}_list` | `list{Source}{ActionPascalCase}()` |
| `GET /api/{source-id}/{action}/:key` (single) | `{source}__{action}` | `get{Source}{ActionPascalCase}(key)` |
| `GET /api/{source-id}/{action}/:key/{sub}` (sub-resource) | `{source}__{action}_{sub}` | `get{Source}{ActionPascalCase}{SubPascalCase}(key)` *(or field on parent)* |

Hyphens in action names become underscores in MCP tool names and are dropped (segments capitalized) in IDP method names.

## NPN example (ann-arbor-npn)

| REST route | MCP tool | IDP method |
|---|---|---|
| `GET /api/ann-arbor-npn/metadata` | `ann_arbor_npn__metadata` | *(none)* |
| `GET /api/ann-arbor-npn/species` | `ann_arbor_npn__species_list` | `listAnnArborNpnSpecies()` |
| `GET /api/ann-arbor-npn/species/:key` | `ann_arbor_npn__species` | `getAnnArborNpnSpecies(key)` |
| `GET /api/ann-arbor-npn/species/:key/source-url` | `ann_arbor_npn__species_source_url` | *(field on parent record)* |
| `GET /api/ann-arbor-npn/alias-index` | `ann_arbor_npn__alias_index` | `listAnnArborNpnAliasIndex()` |
| `GET /api/ann-arbor-npn/documentation` | `ann_arbor_npn__documentation` | `getAnnArborNpnDocumentation()` |
