# FERNS — Agent Reference

## Overview

FERNS (Federated Ecological Resource Network System) is a data infrastructure layer providing a federated ecological data API. It exposes native plant and ecological data from various independent sources through a consistent REST API, per-source Explorer web interfaces, and a central Registry. This system is designed to be the foundation for other applications.

The primary users are the general public, including homeowners, community members, restoration practitioners, and students, who are interested in understanding and restoring native habitats. The initial deployment focuses on Seeds to Community, a native plant restoration program in Washtenaw County, Michigan.

The project aims to fetch and cache botanical data from authoritative sources, wrap every response with a FERNS envelope including provenance metadata, expose a unified REST API, and enforce permission statuses per source. It provides research-focused UIs for exploring this data.

## User Preferences

- **Communication**: Provide detailed explanations.
- **Interaction**: Do not start a new source without a completed spec document provided by the human. If no spec has been provided, stop and ask for one. Do not attempt to research or define a source yourself.
- **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
- **File editing**: Always use targeted edits (`edit` tool) on `replit.md` — never the `write` tool, which replaces the entire file.

## System Architecture

FERNS follows a three-layered architecture: External Sources, the FERNS Data Layer, and Applications. This repository focuses on the FERNS Data Layer.

**Technical Stack:**
- **Language**: TypeScript
- **Database**: PostgreSQL
- **API framework**: Express 5
- **ORM**: Drizzle
- **Hosting**: Replit
- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

**Core Architectural Pattern (Per Source):**
Every external data source integrated into FERNS follows a consistent five-component pattern:
1.  **Connector**: Ingests data from the source (fetch, import, or file parsing script).
2.  **Database**: Stores source data in dedicated tables, each record including provenance fields.
3.  **Knowledge API**: Provides programmatic access to the data and its full derivation chain.
4.  **Source Explorer**: A basic web page for browsing data specific to that source, built exclusively on the Knowledge API.
5.  **Registry Entry**: Declares the service's exposed data and dependencies within the FERNS Registry.

**Key Design Principles and Features:**
-   **Provenance Tracking**: Every database record and API response includes comprehensive provenance metadata (`source_id`, `fetched_at`, `method`, `upstream_url`, `derivation_summary`, `derivation_scientific`). This allows applications to make trust decisions.
-   **API Response Envelope**: All API responses are wrapped in a standard envelope including `source_url`, `data`, `provenance`, and `found` status.
-   **Cache Policy**: Data is cached with specific TTLs (Time-To-Live). "Positive" results (data found) are often permanently cached, while "negative" results (data not found) have shorter TTLs (e.g., 30 days) to allow for re-verification.
-   **Permission Enforcement**: Source metadata includes a `permission_granted` flag. Explorer UIs must display blocking modals when permission is not granted, preventing access until it is.
-   **Monorepo Structure**: The project uses a pnpm workspace monorepo with `artifacts` (deployable applications like `api-server`, `bonap-explorer`, `gbif-explorer`) and `lib` (shared libraries like `api-spec`, `api-client-react`, `api-zod`, `db`).
-   **UI/UX Decisions**: Explorer UIs are React + Vite single-page applications. They are pure API consumers, never directly querying the database. They feature specific components for permission modals, search forms, result displays, and provenance panels.
-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables (e.g., `bonap_maps`, `gbif_name_matches`, `gbif_synonyms`, `gbif_vernacular_names`, `gbif_occurrences`) and a central `ferns_sources` table for the registry.
-   **OpenAPI Specification**: An OpenAPI 3.1 spec (`openapi.yaml`) drives API codegen for React Query hooks and Zod schemas, ensuring consistency between frontend and backend.

**Non-Negotiable Rules:**
-   Every database record must have provenance fields.
-   Every API response must include `source_url`.
-   Every source must have all five components.
-   The Source Explorer must only use the Knowledge API.
-   This repository does not handle trust tier assignments, cross-source exploration logic, application-specific user-facing features, or taxonomic reconciliation logic (GBIF handles this).

## External Dependencies

-   **Live APIs**:
    -   GBIF (Global Biodiversity Information Facility) - for taxonomic backbone, name reconciliation, and occurrence records.
    -   BONAP (Biota of North America Program) - specifically the North American Plant Atlas for distribution maps.
    -   Michigan Flora API
    -   iNaturalist
    -   SerpApi - for External Reference Links.
-   **Blob Sources**:
    -   Michigan Flora CSV
    -   Lake County Seed Collection Guide PDF
    -   Central Region Seedling ID Guide PDF
-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express
-   **Codegen**: Orval (uses OpenAPI spec)