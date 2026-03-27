# FERNS — Agent Reference

## Overview

FERNS (Federated Ecological Resource Network System) is a data infrastructure layer providing a federated REST API and an OpenAPI description for ecological and environmental data. It exposes data from independent authoritative sources — plant distribution, occurrence records, phenology, weather, geology, soils, glaciers, and any other domain relevant to ecological understanding — through a consistent REST API, per-source Explorer web interfaces, and a central Registry. This system is designed to be the foundation for other applications.

The primary users of this API are developers building applications for the general public (homeowners, community members, restoration practitioners, and students) who need access to ecological data without needing to integrate every source themselves. Secondary users include anyone making applications to assist with ecological missions, businesses, or research.

The project fetches, caches, and exposes ecological and environmental data from authoritative sources, wraps every response with a FERNS provenance envelope, and enforces permission statuses per source. FERNS does not interpret, recommend, or normalize across sources — that is the responsibility of the application layer. 

## User Preferences

- **Application Guidance**: Does not belong in this project.
- **Communication**: Provide detailed explanations.
- **New Source Workflow**: When asked to add a new source, follow the Source Onboarding Workflow below. Research the source independently from primary sources. Produce a Source Research Proposal and present it to the human for review before writing any code. Do not begin implementation until the proposal is explicitly approved. Checkpoints are required at the proposal stage and after the Explorer is live.
- **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
- **File editing**: Always use targeted edits (`edit` tool) on `replit.md` — never the `write` tool, which replaces the entire file.

## FERNS Core Principles

These principles govern every decision in this codebase. When a new source, feature, or design choice conflicts with any of them, the principle wins unless the human explicitly overrides it and updates this document.

**1. Source Fidelity**
The FERNS API mirrors each source's own interface as closely as possible. If a source returns 47 fields, the FERNS endpoint returns 47 fields. Nothing is omitted for cleanliness, renamed for consistency across sources, or restructured for developer convenience. Deviations from the upstream source interface are explicit, documented in the source description, and never made silently. Known quirks and unexpected behaviors in the source's own API are preserved and documented so that any consumer — human or AI — knows exactly what to expect.

**2. Sources Are Distinct Scientific Objects**
Two sources that return data about the same phenomenon (e.g., plant distribution) are not interchangeable implementations of the same function. They represent different institutions, different scientific methods, different embedded assumptions, and different epistemic authority. FERNS preserves and exposes this distinctness. It does not collapse sources into a common data model, map different sources onto shared field names, or imply equivalence where none exists. The differences between sources are data, not implementation noise.

**3. FERNS Does Not Select, Rank, or Recommend**
The registry describes sources. It does not evaluate or compare them. Decisions about which source to use for a given question belong to the application layer, not to FERNS. FERNS makes sources discoverable and their character legible; it does not make choices for consumers. There is no "best source for X" logic anywhere in this codebase.

**4. Source Descriptions Are the Primary Artifact**
For every source, the most important deliverable is the written description of the source's institutional context, scientific methodology, data generation process, embedded assumptions, and known limitations. This text must be comprehensive enough that a developer or AI assistant can understand everything relevant about the source without consulting external documentation. It reads like a cross between a journal article's methods section and the provenance documentation of an archive. See Source Description Standards below for what it must cover.

**5. Rich Prose Over Premature Structured Fields**
Source descriptions use rich, expert-written prose rather than structured enumerations. New structured fields (beyond the core required set: `permission_granted`, `data_vintage`, `attribution`) are not added until there is clear evidence across multiple real sources that a field is universally applicable with consistent semantics. The ecological and environmental data universe is too diverse to enumerate its dimensions before seeing them. AI systems can read and reason from well-written prose; premature structure creates false precision.

**6. The Explorer Is the Reference Implementation**
Each Source Explorer is the primary test of the FERNS interface for that source. It exercises every endpoint the FERNS API exposes for that source and displays every field the API returns — including raw, complex, or unglamorous data. The Explorer adds nothing on top of the API (no derived values, no cross-source lookups, no UX refinements that hide what the source actually provides). It removes nothing for cleanliness. If a field is in the API response, it must appear in the Explorer. The Explorer is the proof that the FERNS interface works and the honest demonstration of what a source provides.

**7. Provenance Is Mandatory and Structural**
Every database record and every API response includes a full provenance envelope (`source_id`, `fetched_at`, `method`, `upstream_url`, `derivation_summary`, `derivation_scientific`). This is not optional, not abbreviated for brevity, and not treated as debugging metadata. It is part of the core contract with every application built on FERNS, enabling trust decisions at the application layer.

**8. Self-Describing Registry**
All `metadata_url`, `explorer_url`, and `source_url` fields in registry and metadata responses must be absolute URLs resolved from request headers (`x-forwarded-proto`, `x-forwarded-host`). Relative paths are not acceptable. The registry must be fully navigable from a single entry point without prior knowledge of the base domain.

---

## Source Description Standards

Every source integrated into FERNS must have a description that covers all of the following. This applies to the registry `description` field, the per-source metadata endpoint, and attribution fields. Brevity is not a virtue here — omission is a defect.

- **Institutional identity and governance**: The full legal name of the creating institution. Who currently maintains it. What organization controls it and has authority to change or discontinue it. The governance model (federal agency, academic program, NGO, open consortium, commercial entity, intergovernmental body, etc.).

- **History and motivation**: Why this dataset was created. What gap or need it was designed to fill. What program, grant, or initiative produced it. Relevant historical context about when and why it came into existence.

- **Scientific methodology**: How the data was generated. What field methods, laboratory methods, analytical methods, modeling approaches, or compilation processes were used. What experts or expert systems made the determinations recorded in the data. Whether the data is observational, compiled from existing records, expert-modeled, remotely sensed, or some combination.

- **What a single record represents**: The atomic unit of the data. What does one row, one observation, one map pixel, or one entry in this source actually mean? What conditions must be met for a record to exist?

- **Taxonomic treatment** (where applicable): Which taxonomic authority the source follows, from which year or publication. Whether the source uses its own taxonomy and how it relates to other major authorities. Known cases where its taxonomy diverges from GBIF or other major systems.

- **Geographic scope and resolution**: The region the source covers. The spatial resolution (point occurrence, county-level polygon, 1km grid, etc.). Known coverage gaps within the stated scope. What happens at the boundaries.

- **Temporal scope and update model**: What time period the data covers. Whether it is a static snapshot or continuously updated. The release model if updates exist. How a consumer would know the data has changed. Whether historical records are preserved or overwritten.

- **Embedded assumptions**: What must be true for the data to be valid. What the data implicitly assumes about the world (about taxonomy, geography, observation effort, species concepts, etc.). Assumptions that are scientifically contested or regionally variable.

- **Explicit non-claims**: What the data does not assert. What conclusions are not supported by this source even though a naive reading might suggest they are. What the source explicitly disclaims.

- **Known limitations and API quirks**: Scientific limitations (sampling bias, geographic gaps, taxonomic coverage). Interface limitations (rate limits, field values that behave unexpectedly, missing data patterns, pagination behavior, fields that are present in the schema but rarely populated). Anything a developer would need to know to avoid building on a false assumption.

- **Licensing and full attribution**: The complete citation as required by the source. Copyright notice if applicable. Permission status (`permission_granted` flag and `permission_status` text). Any use restrictions, attribution requirements, or conditions on public deployment. Whether commercial use is permitted.

---

## Source Onboarding Workflow

When asked to add a new source to FERNS, follow these steps in order. Do not skip or compress steps.

**Step 1 — Research**
Research the source independently using primary sources: the institution's website, API documentation, published journal articles describing the dataset (data papers), licensing and terms-of-use pages, GitHub repositories, and the live API itself. Do not ask the human to provide this information — derive it from primary sources. Read the actual data, not just the marketing description.

**Step 2 — Propose**
Write a Source Research Proposal covering all items in Source Description Standards above, plus: what endpoints the source exposes and what FERNS routes they will map to, what the cache key strategy will be, what the Explorer tabs and interactions should be, and any known risks or open questions. Present this to the human for review before writing any code. This is a required checkpoint — call it out explicitly.

**Step 3 — Revise**
Incorporate any corrections, additions, or redirections from the human. If the human has domain knowledge that contradicts what the primary sources say, update the proposal and flag the discrepancy. Do not proceed to implementation with unresolved questions about the source's scientific character or institutional identity.

**Step 4 — Implement**
Once the proposal is explicitly approved, implement all five components: connector, database cache table(s), Knowledge API routes with full OpenAPI additions, Source Explorer UI, and registry entry. The registry `description` and metadata fields must match the approved proposal exactly — they are not to be abbreviated during implementation.

**Step 5 — Verify and Checkpoint**
Run the Explorer against the live API and confirm every field from the API specification appears in the Explorer UI. Confirm the registry entry appears correctly in the Registry Explorer. Summarize any deviations from the proposal (e.g., fields that don't exist in the live API, rate limit constraints that affected caching) and present them to the human. This is the second required checkpoint.

---

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
3.  **Knowledge API**: Provides programmatic access to the data and its full derivation chain (data lineage, known overlaps with other globaly recognized datasets, and data integrity warnings - all stated as facts about the data, not guidance about how to use it. This FERNS API mirrors the source interface as closely as possible. Devitions are explicit and documented, not made for convenience. Know quirks or unexpected behaviors in the source interface are documented within the source description, so agents and humans know what to expect.  
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
-   Every API response must include `source_url` as an absolute URL.
-   Every source must have all five components: connector, database cache, Knowledge API, Source Explorer, and registry entry.
-   The Source Explorer must only use the Knowledge API — never query the database directly.
-   The Source Explorer must display every field returned by the API for that source, including raw, complex, or unpretty data. No field may be hidden for aesthetic reasons.
-   Source descriptions must satisfy the Source Description Standards in full. Abbreviated descriptions are a defect.
-   No normalization across sources. Two sources' responses must never be mapped to a common schema or share field names that imply semantic equivalence where none exists.
-   `metadata_url`, `explorer_url`, and `source_url` fields in all registry and metadata responses must always be absolute URLs resolved from request headers. Relative paths are not acceptable.
-   A Source Research Proposal must be explicitly approved by the human before implementation of any new source begins.
-   This repository does not handle trust tier assignments, cross-source exploration logic, application-specific user-facing features, or recommendations about which source to use for a given question.

## External Dependencies

Currently integrated sources (three live):

-   **GBIF** (Global Biodiversity Information Facility) — taxonomic backbone, name reconciliation, occurrence records. Public API, no key required, attribution required.
-   **BONAP** (Biota of North America Program) — North American Plant Atlas distribution maps. HTML scraping (no API). Written permission required before public deployment — not yet obtained.
-   **iNaturalist** — species appearance (photos, Wikipedia summaries), phenology (monthly observation histograms), place lookup. Public API, attribution required.

Infrastructure:

-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express 5
-   **Codegen**: Orval (from OpenAPI spec)
