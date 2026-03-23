# FERNS — Agent Reference

## Overview

FERNS (Federated Ecological Resource Network System) is a data infrastructure layer providing a consistent REST API, per-source Explorer web interfaces, and a Registry for native plant and ecological data. It aggregates data from multiple independent sources, making it accessible to the general public, restoration practitioners, and students. The project aims to support native habitat restoration initiatives, with an initial focus on the Seeds to Community program in Washtenaw County, Michigan.

## User Preferences

- **Communication**: Please provide detailed explanations.
- **Workflow**: Complete one source fully before starting the next. A source is complete when all five components are written and typechecked, OpenAPI spec updated and codegen re-run, DB schema pushed, route mounted and tested, and Source Explorer UI updated (if applicable).
- **Interaction**: Do not start a new source without a completed specification document provided by the human in the conversation. If no spec has been provided, stop and ask for one. Do not attempt to research or define a source yourself.
- **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.

## System Architecture

FERNS operates on a three-layer architecture:

1.  **External Sources**: Data originates from Live APIs (e.g., GBIF, iNaturalist, BONAP) or Blobs (e.g., CSVs, PDFs). Once ingested, both forms are treated uniformly.
2.  **FERNS Data Layer**: This core layer consists of shared infrastructure and a repeating service structure for each data source. Each source *must* implement five components:
    *   **Connector**: Ingests data (fetch script, import script, file parser).
    *   **Database**: Stores source data in tables, all with provenance fields.
    *   **Knowledge API**: Provides programmatic access to data and its full derivation chain.
    *   **Source Explorer**: A basic web page for browsing data from that specific source, built *only* on the Knowledge API.
    *   **Registry Entry**: Declares the service's exposures and dependencies.
3.  **Applications**: Built by others on top of the Knowledge API. This layer handles trust tiers, cross-source logic, name reconciliation, and user experience.

**Non-Negotiable Rules**:
*   Every database record and API response must include provenance fields.
*   Every API response must include `source_url`.
*   The Source Explorer must be built solely on the Knowledge API.
*   This repository will *not* include trust tier assignments, cross-source exploration, application logic, or taxonomic reconciliation logic.

**Provenance Schema**: All tables storing source data must include `source_id`, `fetched_at`, `method`, `upstream_url`, `derivation_summary` (plain language), and `derivation_scientific` (research-grade details).

**API Response Envelope**: Every API response will follow a standard structure including `source_url`, `data`, `provenance` (with all provenance fields), and `found` status.

**Technical Stack**:
*   **Language**: TypeScript 5.9
*   **Database**: PostgreSQL
*   **ORM**: Drizzle
*   **API Framework**: Express 5
*   **Hosting**: Replit
*   **Monorepo Tool**: pnpm workspaces
*   **Node.js**: Version 24
*   **Package Manager**: pnpm
*   **Validation**: Zod (`zod/v4`), `drizzle-zod`
*   **API Codegen**: Orval (from OpenAPI spec)
*   **Build**: esbuild (CJS bundle)

**Monorepo Structure**: The project is organized into `artifacts/` (deployable applications like `api-server`, `bonap-explorer`, `gbif-explorer`) and `lib/` (shared libraries like `api-spec`, `api-client-react`, `api-zod`, `db`).

**Cache Policy (Example: BONAP)**: Positive lookups (map found) are permanent. Negative lookups (map not found) expire after 30 days to re-verify.

**Permission Enforcement**: Sources with `permission_granted = false` in their metadata will trigger a blocking modal in the Source Explorer UI on every page visit, displaying the `permission_status` string.

## Knowledge Service Status

| # | Source | Status | Capabilities | Geography | Notes |
|---|--------|--------|--------------|-----------|-------|
| 1 | BONAP | COMPLETE | Distribution maps by county | US + Canada | Pixel-color scraping; CC BY-NC |
| 2 | GBIF | COMPLETE | Name match, synonyms/vernacular reconciliation, occurrence records | Configurable: countries, continent, or bbox | Open access, CC BY 4.0; occurrence records sorted by recency |

## External Dependencies

*   **Database**: PostgreSQL
*   **Live APIs**:
    *   GBIF (Global Biodiversity Information Facility)
    *   iNaturalist
    *   BONAP (Biota of North America Program)
    *   Michigan Flora API
    *   SerpApi (for External Reference Links)
*   **Blob Sources**:
    *   Michigan Flora CSV
    *   Lake County Seed Collection Guide PDF
    *   Central Region Seedling ID Guide PDF