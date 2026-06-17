# Data Provider Interface

Internal Data Providers live in `lib/internal-data-providers/src/{source-id}/`.

Each provider exposes exactly two files:
- `data.ts` — package-internal; types and static data. Not exported outside the package.
- `index.ts` — the Source Interface; the only public surface of the provider.

## Method naming convention

IDP method names are derived mechanically from the REST route action name (the path segment after the source prefix). See the action-name consistency rule in `docs/data-layer-contract.md` for the full derivation table.

| Route action | IDP method form | Example |
|---|---|---|
| `/{action}/:key` (single lookup) | `get{SourceName}{ActionPascalCase}(key)` | `getAnnArborNpnSpecies(key)` |
| `/{action}` (collection) | `list{SourceName}{ActionPascalCase}()` | `listAnnArborNpnSpecies()` |
| `/{action}/:key/{sub}` (sub-resource) | `get{SourceName}{ActionPascalCase}{SubPascalCase}(key)` | `getAnnArborNpnSpeciesSourceUrl(key)` — or omit if the field is already on the parent record |

PascalCase action: hyphens dropped, each segment capitalized (`alias-index` → `AliasIndex`).

`/metadata` has no IDP method counterpart — it is served by the Adapter's `metadata.ts`.

## Standard method set (species-catalog sources)

```typescript
// Single lookup — accepts any registered alias (acronym, latin name, common name, synonym)
get{SourceName}Species(key: string): {SourceName}SpeciesEntry | undefined

// Collection — returns all records
list{SourceName}Species(): {SourceName}SpeciesEntry[]

// Alias index — returns all species with every accepted lookup alias per species
list{SourceName}AliasIndex(): {SourceName}AliasGroup[]
```

Deviations from this set (additional methods, different signatures) must be documented in the source's IDP `index.ts` with a comment explaining why the standard form does not apply.
