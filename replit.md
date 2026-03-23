# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

---

## FERNS — Federated Ecological Resource Network System

**FERNS** is the primary project in this workspace. It wraps external botanical data sources with provenance tracking, caching, and a research-focused UI. The first source is the **BONAP North American Plant Atlas (NAPA)** knowledge service.

### What FERNS Is

FERNS is a middleware layer that:
1. Fetches data from authoritative botanical sources (BONAP, iNaturalist, USDA PLANTS, etc.)
2. Caches results with defined TTLs (positive = permanent; negative = 30-day re-verification)
3. Wraps every response in a **FERNS envelope** with provenance metadata
4. Exposes a unified REST API consumed by the Source Explorer UI and future downstream tools
5. Enforces permission status per source — sources with `permission_granted = false` are flagged in every response

**Primary context**: Seeds to Community / Washtenaw County plant distribution research.

### Five-Component Pattern (per source)

Every FERNS knowledge service follows the same five-file pattern inside `artifacts/api-server/src/services/<source>/`:

| File | Purpose |
|------|---------|
| `connector.ts` | URL construction, upstream HTTP verification (HEAD/GET to confirm data exists), input normalization |
| `cache.ts` | Read/write cache against the `bonap_maps` table (or source-equivalent); enforces positive/negative TTL policy |
| `metadata.ts` | Static service identity constants: attribution, color key, permission status, data vintage |
| `seed.ts` | Populates the `registry_entries` table for this source on first deploy |
| Route handler | In `src/routes/<source>.ts`, mounted via `src/routes/index.ts` |

### FERNS Envelope (every API response)

```typescript
{
  source_url: string;        // Canonical URL for the resource at the upstream source
  found: boolean;            // Whether the upstream data was located
  data: { ... };             // Source-specific payload (map URL, species info, color key, attribution, etc.)
  provenance: {
    source_id: string;               // e.g. "bonap-napa"
    fetched_at: string;              // ISO 8601 timestamp
    method: string;                  // e.g. "api_fetch", "cache_hit"
    upstream_url: string;            // Direct URL FERNS checked or fetched
    derivation_summary: string;      // Human-readable plain English description
    derivation_scientific: string;   // Citable scientific derivation (full attribution chain)
  };
}
```

Both `derivation_summary` and `derivation_scientific` are non-negotiable — every response must include both.

### IN / OUT Rules (BONAP source)

**IN scope:**
- `county_species` map type: county-level PNG maps from `bonap.net/MapGallery/County/`
- `genus_county` map type: genus-level PNG maps (returns `source_url` only — no map stored)
- `/bonap/metadata` — static service identity, color key, attribution
- `/registry` — list of all registered FERNS knowledge services

**OUT of scope:**
- `state_species` map type: returns HTTP 501 (no BONAP URL pattern available)
- Image proxying or storing: FERNS returns URLs only, never stores or serves image bytes
- Subspecies handling: subspecies tokens are stripped from species names (`species_stripped: true` flag)

### Cache Policy

| Result | TTL | Rationale |
|--------|-----|-----------|
| Map found (positive) | Permanent | BONAP NAPA data frozen at December 2014; will never change |
| Map not found (negative) | 30 days | New taxonomy may add missing species; re-verify periodically |

### Build Order Rule

**Complete one source end-to-end before starting the next.** A source is complete when:
- All five components are written and typechecked
- OpenAPI spec updated and codegen re-run
- DB schema pushed
- Route mounted and tested
- Source Explorer UI updated (if applicable)

Never begin a new source without a completed spec provided by the user.

### Source Status Table

| # | Source ID | Name | Status | Permission |
|---|-----------|------|--------|------------|
| 1 | `bonap-napa` | BONAP North American Plant Atlas | ✅ Complete | ❌ Not yet requested |
| 2–20 | TBD | Additional botanical data sources | 🔲 Not started | — |

### Permission Enforcement

- `permission_granted` is a boolean in every source's metadata constants (currently `false` for BONAP)
- The Source Explorer UI must show a **blocking modal on every page visit** — no permanent suppression until `permission_granted = true`
- The modal text must surface the exact `permission_status` string from the metadata endpoint

### URL Construction (BONAP-specific)

- Genus: title-cased (e.g. `Asclepias`)
- Species: lowercase (e.g. `tuberosa`)
- Space separator: `%20`-encoded (not `+`)
- County PNG: `https://bonap.net/MapGallery/County/{Genus}%20{species}.png`
- TDC browser URL: `https://bonap.net/TDC/Image/Map?taxonType=Species&locationType=County&mapType=Normal&genus={Genus}&species={species}`

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
| `map_type` | text | `county_species` \| `state_species` \| `genus_county` |
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
