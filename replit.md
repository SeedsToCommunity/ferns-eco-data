# FERNS — Agent Reference

Federated Ecological Resource Network System

---

## What FERNS Is

FERNS is a federated ecological data API. It exposes native plant and ecological data from multiple independent sources through a consistent REST API, a per-source Explorer web interface, and a Registry. It is the data infrastructure layer that other applications are built on top of.

The primary users are general public — homeowners, community members, restoration practitioners, and students who want to understand and restore native habitat. Seeds to Community, a native plant restoration program in Washtenaw County, Michigan, is the initial deployment community.

---

## Stack — Do Not Deviate

- **Language**: TypeScript
- **Database**: PostgreSQL
- **API framework**: Express
- **ORM**: Drizzle
- **Hosting**: Replit
- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **TypeScript version**: 5.9
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

Do not suggest alternatives. Do not introduce additional frameworks or databases without explicit instruction.

---

## The Architecture — Three Layers

### Layer 1: External Sources

Data comes from outside the system. Two physical forms:
- **Live APIs** — fetched on demand (GBIF, iNaturalist, BONAP, Michigan Flora API, etc.)
- **Blobs** — files received externally (CSVs, PDFs, species lists, partner data)

Both forms are treated the same way once they enter the system.

### Layer 2: FERNS Data Layer — what this repo builds

Shared infrastructure plus one repeating service structure per source.

**Shared infrastructure:**
- Relational database (PostgreSQL)
- Provenance tracking — every record carries source, derivation chain, method, timestamp
- Caching — TTL per source type
- Federation — shared schema and API contract across instances

**Per-source pattern — the same five components, every source, no exceptions:**
1. **Connector** — ingests data from the source (fetch script, import script, or file parser depending on source type)
2. **Database** — however many tables the source data requires, all with provenance fields
3. **Knowledge API** — programmatic access to the data plus its full derivation chain at two levels (see Provenance Schema below)
4. **Source Explorer** — a basic web page for browsing this source; only shows what the API exposes, never more
5. **Registry Entry** — declares what this service exposes and its dependencies

Note: taxonomic name reconciliation is not shared infrastructure. GBIF provides this as a Knowledge Service. Applications that need name resolution call the GBIF service.

### Layer 3: Applications

Built by others, on top of the Knowledge API. Trust tiers, cross-source logic, name reconciliation decisions, and UX live here. This repo does not build applications.

---

## Non-Negotiable Rules

**IN — always present:**
- Every database record has provenance fields (see Provenance Schema below)
- Every API response includes `source_url`
- Every source gets all five components: Connector, Database, Knowledge API, Source Explorer, Registry Entry
- The Source Explorer is built solely on the Knowledge API — it never queries the database directly

**OUT — never in this repo:**
- Trust tier assignments — provenance metadata enables apps to make trust decisions; the data layer never makes them
- Cross-source exploration — the Source Explorer sees one source only; comparing sources is an application concern
- Application logic — no user-facing features, no trust scoring, no recommendations
- Taxonomic reconciliation logic — that is GBIF's job, not ours

---

## Provenance Schema

Every table that stores source data must include these fields:

```typescript
source_id: string          // stable identifier for this data source
fetched_at: timestamp      // when this record was obtained
method: string             // "api_fetch" | "blob_import" | "llm_synthesis"
upstream_url: string       // where this data came from (API endpoint, file path, or registry entry)

// Two levels of derivation description — both required:
derivation_summary: string      // plain language: what this data is and where it came from,
                                // readable by a homeowner or community member

derivation_scientific: string   // research-grade: methods, measurement protocols, algorithms,
                                // prompts used, citations, transformations applied —
                                // sufficient for a scientist to evaluate and reproduce
```

Both derivation fields are exposed through the Knowledge API. Applications decide which level to show based on their audience.

---

## API Response Envelope

Every API response follows this structure:

```typescript
{
  source_url: string,        // always present, even for not-found results
  data: object | null,       // null if not found
  provenance: {
    source_id: string,
    fetched_at: string,
    method: string,
    upstream_url: string,
    derivation_summary: string,
    derivation_scientific: string
  },
  found: boolean
}
```

`source_url` is present even when `found` is false. This enables "View on [source]" links in applications regardless of whether data exists.

---

## Build Order Rule

Build one source completely end-to-end before starting the next:

1. BONAP — simplest source, well-documented, good pattern to establish ✅ Complete
2. GBIF — taxonomic backbone and name reconciliation service
3. Michigan Flora API
4. iNaturalist
5. Michigan Flora CSV
6. External Reference Links
7. Lake County Seed Collection Guide PDF
8. Central Region Seedling ID Guide PDF
9. Additional sources as specs are completed

Do not start a new source until:
1. The previous source has all five components working
2. A completed spec document for the next source has been provided by the human in the conversation

If no spec has been provided, stop and ask for one. Do not attempt to research or define a source yourself.

---

## Source Status Table

| # | Source ID | Name | Type | Status | Permission |
|---|-----------|------|------|--------|------------|
| 1 | `bonap-napa` | BONAP North American Plant Atlas | Live API | ✅ Complete | ❌ Not yet requested |
| 2 | `gbif` | GBIF Taxonomic Backbone | Live API | 🔲 Not started | — |
| 3 | `michigan-flora-api` | Michigan Flora API | Live API | 🔲 Not started | — |
| 4 | `inaturalist` | iNaturalist | Live API | 🔲 Not started | — |
| 5 | `michigan-flora-csv` | Michigan Flora CSV | Blob | 🔲 Not started | — |
| 6 | `external-ref-links` | External Reference Links (SerpApi) | Live API | 🔲 Not started | — |
| 7 | `lake-county-seed-guide` | Lake County Seed Collection Guide PDF | Blob | 🔲 Not started | — |
| 8 | `central-region-seedling-guide` | Central Region Seedling ID Guide PDF | Blob | 🔲 Not started | — |

---

## Artifacts

### `artifacts/api-server` — FERNS API Server

The central Express 5 API. All FERNS knowledge service routes are mounted here under `/api/`.

- Routes: `src/routes/bonap.ts` (BONAP map + metadata), `src/routes/registry.ts`, `src/routes/health.ts`
- Services: `src/services/bonap/` (connector, cache, metadata, seed)
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `artifacts/bonap-explorer` — BONAP Source Explorer UI

React + Vite single-page application at `/bonap/`. Research-facing UI for querying BONAP distribution maps.

- **Pure API consumer** — never queries the database directly; all data via `/api/*`
- Permission modal blocks on every visit (no suppress) while `permission_granted = false`
- Components: `PermissionModal`, `SearchForm`, `ResultDisplay`, `ColorKey`, `ProvenancePanel`
- Hook: `useBonapExplorer` wraps `useGetBonnapMap` + `useGetBonnapMetadata`
- Vite dev proxy: `/api/*` → API server on port 8080

---

## BONAP Source — Implementation Notes

### Map Types

| Map Type | URL Pattern | Status |
|----------|------------|--------|
| `county_species` | `https://bonap.net/MapGallery/County/{Genus}%20{species}.png` | ✅ Working |
| `state_species` | `https://bonap.net/MapGallery/State/{Genus}%20{species}.png` | ✅ Working |

Family maps (`https://bonap.net/MapGallery/State/Family/ASTERACEAE.png`) exist on BONAP's server but are not implemented in FERNS.

### Color Key

BONAP publishes an authoritative composite color key GIF: `http://www.bonap.org/Help/elements/Color%20Key.gif`

The map key reference page is: `http://www.bonap.org/MapKey.html`

Individual color swatch JPEGs are at: `http://www.bonap.org/map%20legend/{filename}.jpg`

### URL Construction

- Genus: title-cased (e.g. `Asclepias`)
- Species: lowercase (e.g. `tuberosa`)
- Space separator: `%20`-encoded (not `+`)
- Subspecies tokens stripped from species names (`species_stripped: true` flag)
- TDC browser URL: `https://bonap.net/TDC/Image/Map?taxonType=Species&locationType=County&mapType=Normal&genus={Genus}&species={species}`

### Cache Policy

| Result | TTL | Rationale |
|--------|-----|-----------|
| Map found (positive) | Permanent (`expires_at = null`) | BONAP NAPA data frozen at December 2014; will never change |
| Map not found (negative) | 30 days | New taxonomy may add missing species; re-verify periodically |

### Permission Enforcement

- `permission_granted = false` for BONAP (not yet requested)
- The Source Explorer UI must show a **blocking modal on every page visit** — no permanent suppression until `permission_granted = true`
- The modal text must surface the exact `permission_status` string from the metadata endpoint

---

## Monorepo Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # FERNS Express API server
│   └── bonap-explorer/     # BONAP Source Explorer React UI
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema (FERNS)

### `bonap_maps` — Cache table for BONAP map lookups

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | |
| `cache_key` | text UNIQUE | `{genus}:{species}:{map_type}` |
| `genus` | text | |
| `species` | text | nullable |
| `map_type` | text | `county_species` \| `state_species` |
| `map_url` | text | nullable (null = not found) |
| `source_url` | text | upstream BONAP URL checked |
| `found` | boolean | |
| `species_stripped` | boolean | subspecies removed from lookup |
| `cache_status` | text | `fresh` \| `cached` |
| `fetched_at` | timestamptz | |
| `expires_at` | timestamptz | nullable (null = permanent) |

### `registry_entries` — FERNS knowledge service registry

| Column | Type | Notes |
|--------|------|-------|
| `id` | serial PK | |
| `source_id` | text UNIQUE | e.g. `bonap-napa` |
| `source_name` | text | Display name |
| `source_type` | text | e.g. `distribution_maps` |
| `base_url` | text | Upstream base URL |
| `permission_granted` | boolean | |
| `permission_status` | text | Human-readable status |
| `data_vintage` | text | |
| `active` | boolean | |
| `created_at` / `updated_at` | timestamptz | |

---

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck`. This builds the full dependency graph.
- **`emitDeclarationOnly`** — only `.d.ts` files during typecheck; actual JS bundling by esbuild/vite.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly`

## Packages

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `src/schema/bonap.ts` — `bonap_maps` cache table
- `src/schema/registry.ts` — `registry_entries` table
- `drizzle.config.ts` — Drizzle Kit config (uses `DATABASE_URL`)
- Push schema: `pnpm --filter @workspace/db run push`

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and Orval config (`orval.config.ts`). Codegen outputs to:
1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas (e.g. `GetBonnapMapQueryParams`, `BonnapMapResponse`). Used by `api-server` for request validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks (e.g. `useGetBonnapMap`, `useGetBonnapMetadata`). Used by the bonap-explorer frontend.

### `scripts` (`@workspace/scripts`)

Utility scripts. Run via `pnpm --filter @workspace/scripts run <script>`.

## Logging

- **API server handlers**: use `req.log` (pino-http request logger)
- **Non-request server code**: use the `logger` singleton from `src/lib/logger.ts`
- **No `console.log` in server code**
