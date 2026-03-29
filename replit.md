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
-   **Audit script results**: When the audit script (the passthrough compliance checker in this repository) reports discrepancies, stop immediately and present the results to the user. Do not make any changes based on audit output without explicit user direction. The user decides what — if anything — to do about each flagged discrepancy.
-   **Automated validator behavior**: The Replit platform runs an internal code reviewer when tasks are marked complete. If it rejects the work and requests changes, stop and surface the rejection to the user rather than acting on reviewer instructions autonomously. Any significant redesign or scope change flagged by an automated reviewer requires explicit user approval before implementation.
-   **Discrepancy ownership**: All discrepancies — whether flagged by the audit script, the automated reviewer, or any other tool — are the user's decision to resolve. Do not resolve them unilaterally.

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
-   **UI/UX Decisions**: All Source Explorer UIs live as routed pages within the single `registry-explorer` React + Vite application. Routes follow the pattern `/source/:sourceId` for data sources and `/vocabulary/:vocabulary` for reference sources. Every source page includes a "← All Sources" back-navigation header. Do NOT create a new standalone web app per source — all explorers belong in `registry-explorer` as additional pages. Explorer UIs consume only the FERNS API and include components for permission modals, search forms, result displays, and provenance panels.
-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables and a central `ferns_sources` table for the registry.
-   **OpenAPI Specification**: An OpenAPI 3.1 spec (`openapi.yaml`) drives API codegen for consistency.
-   **Source Fidelity**: FERNS API mirrors each source's own interface as closely as possible, preserving all fields and known quirks.
-   **Source Descriptions**: Comprehensive written descriptions are the primary artifact for each source, covering institutional context, scientific methodology, data generation, and limitations.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Self-Describing Registry**: All `metadata_url`, `explorer_url`, and `source_url` fields in registry and metadata responses must be absolute URLs.
-   **Derivation field completeness**: The `derivation_summary` and `derivation_scientific` fields in every source's registry metadata must be fully self-contained. A reader — human or AI agent — must be able to understand the data completely from those fields alone, without consulting external documentation. For sources with encoded fields (e.g. coded values like `OBL`, `C5`, `FACW`), the derivation fields must enumerate every possible value and its meaning. If a consumer cannot interpret the data from the metadata alone, the registry entry is incomplete.
-   **Disambiguation requirement**: Any FERNS source whose vocabulary overlaps with another source must include explicit disambiguation language in both `derivation_summary` and `derivation_scientific`. This means naming the other metrics, stating clearly what this source does NOT measure, and identifying the authority, scale, and domain of each. This is factual domain mapping, not editorial opinion. Saying "this metric is used by ecologists for habitat assessment, not by nurseries for irrigation planning" is a factual statement and belongs in the derivation text.
-   **Clarity for humans and agents**: All metadata, derivation text, and documentation must be written to be understood by both human readers and AI agents. Avoid unexplained abbreviations. Spell out acronyms on first use. Prefer complete sentences over terse field lists.
-   **Dedicated vocabulary sources**: If a data type (such as the Coefficient of Conservatism) is a standalone, well-defined standard with a published authority and a use across multiple FERNS sources, it may have its own registry entry, API, and explorer so that its definition is authoritative and centrally queryable. This is a design option to consider, not a mandatory pattern — the user decides whether a given metric warrants a standalone source. A cross-reference meta-source whose sole purpose is to disambiguate other sources was evaluated and intentionally declined (see Task #28): disambiguation belongs in each source's own `derivation_summary` / `derivation_scientific` fields and in this document, not in a separate API endpoint.
-   **Non-standard conventions**: When a data field uses a convention that is not backed by a published standard (e.g., a 1–10 numeric wetness scale used by some nursery databases), document it explicitly as a non-standard convention. State that different publishers may implement it differently, and that FERNS does not treat it as authoritative.

## Coefficient & Wetness Vocabulary Reference

The ecological/botanical domain contains several metrics whose names are superficially similar but measure entirely different things. This is a known source of confusion for both humans and agents. FERNS sources that use any of these metrics must disambiguate explicitly in their derivation fields.

| Metric | FERNS Source ID (planned) | Scale | Authority | Domain | What it is NOT |
|---|---|---|---|---|---|
| Coefficient of Conservatism (C-value) | `fqa-coefficient-of-conservatism` | 0–10 (integer string) or `"*"` for non-native | Swink & Wilhelm, Floristic Quality Assessment | Ecological fidelity of a native plant to intact, undisturbed communities | Not a wetness measure; not a watering guide; not the Coefficient of Wetness |
| Coefficient of Wetness (W) | `wetland-indicator-status` | −5 to +5 (five discrete values: −5, −3, 0, +3, +5) | Swink & Wilhelm, Floristic Quality Assessment | Numeric expression of a plant's wetland affinity; companion to WIS categorical codes | Not the C-value (Conservatism); not WUCOLS; the scale is −5 to +5, not 0–10 |
| Wetland Indicator Status (WIS) | `wetland-indicator-status` | Categorical: OBL / FACW / FAC / FACU / UPL | USDA National Wetland Plant List (NWPL) / U.S. Army Corps of Engineers | Probability that a plant species occurs in a wetland habitat | Not an irrigation guide; not a gardening watering recommendation |
| WUCOLS Water Use Classification | `wucols-water-use` | VL / L / M / H (percentage of reference evapotranspiration) | UC Cooperative Extension | Supplemental irrigation need of a species in managed landscape settings | Not an ecological wetness measure; not related to Swink & Wilhelm FQA |
| 1–10 Wetness Convention | *(no FERNS source — non-standard)* | 1–10 (mapping varies by publisher) | No single authority | Used by some nursery databases as a numeric approximation of WIS | Not a published standard; FERNS does not treat it as authoritative; different publishers implement it differently |

**Michigan Flora fields that use these metrics:**
- `c` — Coefficient of Conservatism (string, `"0"`–`"10"` or `"*"`)
- `w` — Coefficient of Wetness (numeric, one of: −5, −3, 0, 3, 5)
- `wet` — Wetland Indicator Status (string: `OBL`, `FACW`, `FAC`, `FACU`, `UPL`)

## External Dependencies

**Integrated Sources:**

-   **GBIF** (Global Biodiversity Information Facility): Taxonomic backbone, name reconciliation, occurrence records.
-   **BONAP** (Biota of North America Program): North American Plant Atlas distribution maps.
-   **iNaturalist**: Species appearance, phenology, place lookup.
-   **Michigan Flora** (University of Michigan Herbarium): Vascular plant species data for Michigan. API v1.0 at `https://michiganflora.net/api/v1.0`. Species lookup splits name into genus+epithet, calls `flora_search_sp?genus={genus}&n_results=0&exact_match_genus=1`, then case-insensitive matches on `scientific_name`. Detail calls use `?id=` param: `spec_text`, `synonyms`, `pimage_info`. County records from `locs_sp?id={id}` returning `{locations:[...county names...]}`. Known quirks: adventive species names ALL-CAPS; `st` field is literal string `"NULL"` (not JSON null); `c` field always a string (`"*"` = non-native); `synonyms` returns either `{synonyms:[...]}` or `{message:"No synonyms found"}`; `search_records` contains all genus members. Cache TTL: 30 days. Source URL pattern: `https://michiganflora.net/species/{plant_id}`.
-   **Seeds to Community Washtenaw**: Native plant seed-growing program in Washtenaw County, Michigan. Source ID: `seeds-to-community-washtenaw`. Knowledge type: `source_wrapper`. Method: `static_data` (in-memory, no upstream API). Exposes species availability lists (botanical names only) for four program years: 2023 (24 spp, from PDF plant sheets), 2024 (96 spp, spreadsheet), 2025 (151 spp, spreadsheet, `Barn S3=TRUE`), 2026 (166 spp, master spreadsheet, `Collected=TRUE`). Optional flags where tracked: `neat_and_tidy` (2024+), `sweet_and_simple` (2026 only). Data lives in `artifacts/api-server/src/services/s2c/data.ts`. Endpoints: `GET /api/s2c?year={year}`, `GET /api/s2c/years`, `GET /api/s2c/metadata`. Explorer: `/source/seeds-to-community-washtenaw`. Data owner is the program organizer; permission explicitly granted. To update for a new year: re-download Drive spreadsheets and re-run the extraction script to update `data.ts`.

**Infrastructure:**

-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express 5
-   **Codegen**: Orval (from OpenAPI spec)