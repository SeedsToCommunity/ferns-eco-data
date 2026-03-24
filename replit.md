# FERNS — Agent Reference

## Overview

The Federated Ecological Resource Network System (FERNS) is an API-driven data infrastructure layer designed to expose native plant and ecological data from various independent sources. It provides a consistent REST API, per-source Explorer web interfaces, and a Registry. FERNS aims to empower the general public, including homeowners, community members, restoration practitioners, and students, with accessible data for native habitat understanding and restoration. The initial deployment targets the Seeds to Community native plant restoration program in Washtenaw County, Michigan.

## User Preferences

- **Communication**: Provide detailed explanations.
- **Interaction**: Do not start a new source without a completed spec document provided by the human. If no spec has been provided, stop and ask for one. Do not attempt to research or define a source yourself.
- **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
- **File editing**: Always use targeted edits (`edit` tool) on `replit.md` — never the `write` tool, which replaces the entire file.

## System Architecture

FERNS operates on a three-layer architecture:

**Layer 1: External Sources**: Data originates from external live APIs (e.g., GBIF, iNaturalist) or file blobs (CSVs, PDFs).

**Layer 2: FERNS Data Layer**: This core layer provides shared infrastructure and a repeating service structure for each data source. Each source implementation follows a "five-component pattern":
1.  **Connector**: Ingests data from the source.
2.  **Database**: Stores source data with provenance fields.
3.  **Knowledge API**: Offers programmatic access to data, including its full derivation chain.
4.  **Source Explorer**: A basic web interface for browsing the specific source's data, built exclusively on its Knowledge API.
5.  **Registry Entry**: Declares the service's exposed data and dependencies.

**Layer 3: Applications**: External applications are built on top of the FERNS Knowledge API. This layer handles trust tiers, cross-source logic, and user experience.

**Core Principles and Constraints**:
*   **Provenance**: Every database record and API response includes comprehensive provenance metadata (`source_id`, `fetched_at`, `method`, `upstream_url`, `derivation_summary`, `derivation_scientific`).
*   **API Response Envelope**: All API responses are wrapped in a standard envelope including `source_url`, `data`, `provenance`, and `found` status.
*   **No Trust Tiers/Cross-Source Logic in Data Layer**: The data layer provides provenance; applications make trust decisions and handle cross-source comparisons.
*   **Build Order**: Sources are built end-to-end sequentially. A new source is only started after the previous one is fully complete and a specification document is provided.
*   **Monorepo Structure**: The project is a pnpm workspace monorepo using TypeScript.

**Technology Stack**:
*   **Language**: TypeScript
*   **Database**: PostgreSQL
*   **ORM**: Drizzle
*   **API Framework**: Express 5
*   **Hosting**: Replit
*   **Monorepo Tool**: pnpm workspaces
*   **Validation**: Zod, `drizzle-zod`
*   **API Codegen**: Orval (from OpenAPI spec)
*   **Build**: esbuild (CJS bundle)
*   **UI Frameworks**: React, Vite (for explorer UIs)

**UI/UX Decisions**:
*   Each source has a dedicated "Source Explorer" UI (e.g., `bonap-explorer`, `gbif-explorer`).
*   Explorers are pure API consumers, never directly querying the database.
*   Permission Enforcement: Sources with `permission_granted = false` trigger a blocking modal on every page visit in their respective explorer UI.
*   Consistent attribution footers for licensing (e.g., CC BY 4.0 for GBIF).

## External Dependencies

*   **GBIF**: Taxonomic backbone, name reconciliation, and occurrence records (Live API).
*   **BONAP (North American Plant Atlas)**: Distribution maps (Live API).
*   **Michigan Flora API**: (Planned Live API integration).
*   **iNaturalist**: (Planned Live API integration).
*   **Michigan Flora CSV**: (Planned Blob data integration).
*   **SerpApi**: For external reference links (Planned Live API integration).
*   **PDF Data Sources**: Lake County Seed Collection Guide, Central Region Seedling ID Guide (Planned Blob data integration).