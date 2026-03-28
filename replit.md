# FERNS — Agent Reference

## Overview

FERNS (Federated Ecological Resource Network System) is a data infrastructure layer providing a federated REST API and an OpenAPI description for ecological and environmental data. It exposes data from independent authoritative sources through a consistent REST API, per-source Explorer web interfaces, and a central Registry. This system is designed to be the foundation for other applications.

The primary users are developers building applications for the general public (homeowners, community members, restoration practitioners, and students) needing access to ecological data without integrating every source themselves. Secondary users include those building applications for ecological missions, businesses, or research.

FERNS fetches, caches, and exposes ecological and environmental data from authoritative sources, wraps every response with a provenance envelope, and enforces permission statuses per source. FERNS does not interpret, recommend, or normalize across sources; that is the responsibility of the application layer.

## User Preferences

-   **Communication**: Provide detailed explanations.
-   **New Source Workflow**: When asked to add a new source, follow the Source Onboarding Workflow below. Research the source independently from primary sources. Produce a Source Research Proposal and present it to the human for review before writing any code. Do not begin implementation until the proposal is explicitly approved. Checkpoints are required at the proposal stage and after the Explorer is live.
-   **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
-   **File editing**: Always use targeted edits (`edit` tool) on `replit.md` — never the `write` tool, which replaces the entire file.

## System Architecture

FERNS follows a three-layered architecture: External Sources, the FERNS Data Layer, and Applications. This repository focuses on the FERNS Data Layer.

**Technical Stack:**

-   **Language**: TypeScript
-   **Database**: PostgreSQL
-   **API framework**: Express 5
-   **ORM**: Drizzle
-   **Hosting**: Replit
-   **Monorepo tool**: pnpm workspaces
-   **Node.js version**: 24
-   **Package manager**: pnpm
-   **TypeScript version**: 5.9
-   **Validation**: Zod (`zod/v4`), `drizzle-zod`
-   **API codegen**: Orval (from OpenAPI spec)
-   **Build**: esbuild (CJS bundle)

**Core Architectural Pattern (Per Source):**

Every external data source integrated into FERNS follows a consistent five-component pattern:

1.  **Connector**: Ingests data from the source.
2.  **Database**: Stores source data in dedicated tables, each record including provenance fields.
3.  **Knowledge API**: Provides programmatic access to the data, mirroring the source interface as closely as possible, with explicit documentation for any deviations or quirks.
4.  **Source Explorer**: A basic web page for browsing data specific to that source, built exclusively on the Knowledge API.
5.  **Registry Entry**: Declares the service's exposed data and dependencies within the FERNS Registry.

**Key Design Principles and Features:**

-   **Provenance Tracking**: Every database record and API response includes comprehensive provenance metadata (`source_id`, `fetched_at`, `method`, `upstream_url`, `derivation_summary`, `derivation_scientific`) to enable trust decisions.
-   **API Response Envelope**: All API responses are wrapped in a standard envelope including `source_url`, `data`, `provenance`, and `found` status.
-   **Cache Policy**: Data is cached with specific TTLs. Positive results are often permanently cached; negative results have shorter TTLs (e.g., 30 days).
-   **Permission Enforcement**: Source metadata includes a `permission_granted` flag, and Explorer UIs display blocking modals when permission is not granted.
-   **Monorepo Structure**: Uses a pnpm workspace monorepo with `artifacts` (deployable applications) and `lib` (shared libraries).
-   **UI/UX Decisions**: Explorer UIs are React + Vite single-page applications, consuming only the API. They include components for permission modals, search forms, result displays, and provenance panels.
-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables and a central `ferns_sources` table for the registry.
-   **OpenAPI Specification**: An OpenAPI 3.1 spec (`openapi.yaml`) drives API codegen for consistency.
-   **Source Fidelity**: FERNS API mirrors each source's own interface as closely as possible, preserving all fields and known quirks.
-   **Source Descriptions**: Comprehensive written descriptions are the primary artifact for each source, covering institutional context, scientific methodology, data generation, and limitations.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Self-Describing Registry**: All `metadata_url`, `explorer_url`, and `source_url` fields in registry and metadata responses must be absolute URLs.

## External Dependencies

**Integrated Sources:**

-   **GBIF** (Global Biodiversity Information Facility): Taxonomic backbone, name reconciliation, occurrence records.
-   **BONAP** (Biota of North America Program): North American Plant Atlas distribution maps.
-   **iNaturalist**: Species appearance, phenology, place lookup.
-   **Michigan Flora** (University of Michigan Herbarium): Vascular plant species data for Michigan. API v1.0 at `https://michiganflora.net/api/v1.0`. Species lookup splits name into genus+epithet, calls `flora_search_sp?genus={genus}&n_results=0&exact_match_genus=1`, then case-insensitive matches on `scientific_name`. Detail calls use `?id=` param: `spec_text`, `synonyms`, `pimage_info`. County records from `locs_sp?id={id}` returning `{locations:[...county names...]}`. Known quirks: adventive species names ALL-CAPS; `st` field is literal string `"NULL"` (not JSON null); `c` field always a string (`"*"` = non-native); `synonyms` returns either `{synonyms:[...]}` or `{message:"No synonyms found"}`; `search_records` contains all genus members. Cache TTL: 30 days. Source URL pattern: `https://michiganflora.net/species/{plant_id}`.

**Infrastructure:**

-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express 5
-   **Codegen**: Orval (from OpenAPI spec)