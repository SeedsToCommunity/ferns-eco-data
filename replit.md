# Ecological Commons — Agent Reference

## Your role

You are a trusted translator between old data/interfaces and a faithful shared interface layer that the planet can rely upon. Clarity, accuracy, faithfulness to the source material, and completeness are your job. The data covers all things ecological.

This repository represents three parts of a broader Ecological Commons: an Overview Web Interface, the Data Layer and the Trust Layer. You translate upstream sources of information into a consistent interface without distorting what those sources say. You preserve provenance. You honor source identity. You do not interpret, recommend, or normalize across sources; that is the responsibility of the higher application layers. Some data will only reside within this data layer. Some data will be trieved from outside this system.

## What you are deep within - An Ecological Commons

The **Ecological Commons** is federated knowledge infrastructure for ecological data, built as a layered architecture where each layer has its own job.

**External sources** — research institutions, citizen science platforms, regional floras, government databases, partner organizations — retain their own authority and identity.

The **Data Layer** registers each source with a structured description, caches data where appropriate, and exposes registered sources through three consistent interfaces: its registry entry, a REST API, and an MCP interface. Every response carries a provenance envelope. FERNS does not interpret, normalize, or pick winners between disagreeing sources. Sources may freely agree or disagree. The data layer does not pick winners or losers. 

A **Trust Layer** sits above the Data Layer and acts to filter which sources an application considers. Users will define trust groups so certain data sources can be identified for specific jobs. 

**Applications** sit above the data and trust layers. They interpret, synthesize, and present. They are where opinions live. They are what people use.

**The technical commitments**: every response carries provenance; every API route is verbatim pass-through to one upstream endpoint; every source has three structured descriptions sized for different audiences; the registry is the single source of truth for source metadata; permissions are per-endpoint; names and equivalences are recorded with attribution, never invented.

The stack is unremarkable. The value of this approach is in the disciplined separation of concerns.

## User Preferences

-   **Communication**: Provide clear explanations that enable the user to make migh level decisions.
-   **New Source Workflow**: When asked or modifying a source, the _source-onboarding-playbook.md_ should be referenced and followed. 
-   **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
-   **Task sizing (hard limit, overrides skill defaults)**: When proposing a project task for this codebase, split before proposing if any of these are true: (a) the task plausibly modifies more than ~800 source lines, (b) it touches more than 3 packages, (c) its "Done looks like" section has more than 6 distinct observable outcomes, or (d) it requires holding more than one upstream data source's quirks in mind simultaneously. The `project_tasks` skill's default "prefer fewer tasks" bias is explicitly overridden for this repo — prefer many small atomic tasks over few large ones. Acceptable exception: a single cohesive file or single upstream source that cannot be split without breaking atomicity; document the exception explicitly in the plan file. Apply the same limits when decomposing work in Build mode (`.local/session_plan.md`).
-   **Automated validator behavior**: The Replit platform runs an internal code reviewer when tasks are marked complete. Fix code reviewer issues autonomously — do not surface them to the user unless they conflict with the project's general objectives (e.g. a reviewer demands removing a data source or changing a core architectural decision). Minor implementation issues, security hardening, documentation cleanup, and stylistic concerns are handled without user involvement.
-   **Discrepancy ownership**: All discrepancies — whether flagged by the audit script, the automated reviewer, or any other tool should be judged first against these guidance documents. If the guidance does not conflict on the discrepancy, then act. If guidance is missing or in conflict, provide the highest level explanation to the user as possible and get approval.  
-   **Post-task summary (required after any significant task)**: After completing a task that involved substantial implementation or decisions, write a plain-language summary covering all of the following — do not omit sections:
    1. **What was built** — one paragraph a non-technical person can follow.
    2. **Derivation summary** — reproduce the actual `general_summary` text verbatim if a new source was added, so the user can verify it reads correctly for a general audience.
    3. **Scientific/technical description** — reproduce the actual `technical_details` text verbatim, so the user can verify accuracy and completeness for a technical audience.
    4. **Architectural decisions made** — every non-trivial decision with its tradeoff stated explicitly. Examples: "chose in-memory cache instead of PostgreSQL — means data is lost on server restart"; "exact match only, no fuzzy fallback — means partial names won't match". Do not bury these. If you made a decision the user might have made differently, surface it.
    5. **What was NOT done** — explicitly list anything that was in scope but skipped, deferred, or not updated (e.g. "audit tool not updated", "no database cache added", "OpenAPI schema not reviewed").
    6. **What the user should decide or review** — flag anything that requires a human judgment call, approval, or follow-up action.


## System Architecture

FERNS follows a three-layered architecture: External Sources, the FERNS Data Layer, and Applications. This repository focuses on the FERNS Data Layer.

**Core Architectural Pattern (Per Source):**

Every external data source integrated follows a consistent five-component pattern:

1.  **Connector**: Ingests data from the source.
2.  **Database**: Stores source data in dedicated tables, each record including provenance fields.
3.  **Knowledge API**: Provides programmatic access to the data. Every EC route path after the source identifier prefix MUST use the upstream source's own path verbatim — this is a non-negotiable prohibition. Each route maps to exactly one upstream endpoint; caching is the only permitted efficiency measure. Composite or aggregated routes that have no upstream equivalent are forbidden. If an experience requires data from multiple upstream calls, the application layer orchestrates those calls — the Knowledge API does not. Any deviation from upstream path structure requires explicit user approval and must be documented; it is not permitted for cosmetic or convenience reasons.
4.  **Registry Entry**: Declares the service's exposed data and dependencies within the FERNS Registry.

**Key Design Principles and Features:**

-   **Provenance Tracking**: Every API response carries a `provenance` object as defined by FERNS Response Envelope Contract v1 (see the dedicated section below): `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `derived_from`, `license`, `rights`. Per-response provenance does NOT include `general_summary` or `technical_details` — those live in the registry only (per refinement #2 of the contract). Database cache tables record their own ingestion-time provenance fields (e.g. `fetched_at`, `upstream_url`); those are storage-level columns, not envelope fields, and are mapped into the envelope at response time.
-   **API Response Envelope**: All API responses are wrapped in the FERNS Response Envelope Contract v1 (see the dedicated section below — that section is authoritative; this bullet only points to it).
-   **Cache Policy**: Data is cached with specific TTLs per source. Michigan Flora data is cached permanently (no TTL, `expires_at=null`) since the source does not change; `?refresh=true` is the only way to force a re-fetch. Other sources vary — positive results are often cached long-term; negative results may have shorter TTLs.
-   **Permission Enforcement**: Source metadata includes a `permission_granted` flag, and Explorer UIs display blocking modals when permission is not granted.
-   **Monorepo Structure**: Uses a pnpm workspace monorepo with `artifacts` (deployable applications) and `lib` (shared libraries).
-   **UI/UX Decisions**: All Source Explorer UIs live as routed pages within the single `registry-explorer` React + Vite application. Routes follow the pattern `/source/:sourceId` for data sources and `/vocabulary/:vocabulary` for reference sources. Every source page includes a "← All Sources" back-navigation header. Do NOT create a new standalone web app per source — all explorers belong in `registry-explorer` as additional pages. Explorer UIs consume only the FERNS API and include components for permission modals, search forms, result displays, and provenance panels.
-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables and a central `ferns_sources` table for the registry. **Migration workflow**: The project uses Drizzle migration files (not `push`). When changing a schema, run `pnpm --filter @workspace/db run generate` to produce a SQL migration file in `lib/db/drizzle/`, then `pnpm --filter @workspace/db run migrate` to apply it to the dev database. Always commit the generated migration file alongside the schema change. The API server runs migrations automatically on startup before seeds. For production: on a fresh database the baseline migration creates all tables; on an existing database only new (unapproved) migrations are applied. **Known Drizzle-kit quirk**: Named composite unique constraints defined with `unique("name").on(...)` are NOT recognized by `drizzle-kit generate` introspection consistently — use `uniqueIndex("name").on(...)` instead. This is applied to `mnfiCountyElementsTable` in `lib/db/src/schema/mnfi.ts`. Do not change this back to `unique()`.
-   **OpenAPI Specification**: An OpenAPI 3.1 spec (`openapi.yaml`) drives API codegen for consistency.
-   **Source Fidelity**: FERNS API route paths after the source identifier prefix MUST be verbatim copies of the upstream source's own paths — no renaming, no compositing, no omission. Each route maps to exactly one upstream endpoint; caching is the only permitted efficiency measure. If an experience requires data from multiple upstream calls, the application layer orchestrates those calls — the Knowledge API does not. Any deviation requires explicit user approval and must be documented. Field values and response structure are preserved unchanged.
-   **Source Descriptions**: Every source has three structured description fields — `description`, `general_summary`, and `technical_details` — that together serve as a complete self-contained reference for any reader. Standards and examples are defined in the Source Onboarding Playbook below.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Fat Registry Index**: The `/api/v1/sources` endpoint is the single source of truth for all source metadata. Each `SourceSummary` in the sources array includes the full set of identity, description, permission, and capability fields: `source_id`, `name`, `knowledge_type`, `status`, `description`, `input_summary`, `output_summary`, `dependencies`, `update_frequency`, `known_limitations`, `metadata_url`, `explorer_url`, `permission_granted`, `permission_status`, `general_summary`, and `technical_details`. These are persisted to the `ferns_sources` DB table via each source's `seed.ts` `onConflictDoUpdate` and read back on every registry request. An agent or application can make a single call to `/api/v1/sources` and have enough information to make a fully informed routing decision without calling any individual `/metadata` endpoint.
-   **Self-Describing Registry**: All `metadata_url`, `explorer_url`, and `source_url` fields in registry and metadata responses must be absolute URLs.
-   **TypeScript declarations**: When adding or changing a file in a package that uses `composite: true` (e.g., `lib/db`, `lib/api-client-react`), rebuild its declarations before type-checking consumers: `cd lib/db && pnpm exec tsc -p tsconfig.json` (emitDeclarationOnly). Stale dist/.d.ts files in those packages will cause false "no exported member" errors in packages that reference them.
-   **Metadata response structure**: Every source's `/metadata` endpoint returns the standard envelope (see "FERNS Response Envelope Contract v1" below). The `description`, `general_summary`, and `technical_details` text lives inside `data` — it is the source's own descriptive payload — and is NOT placed in `provenance`. `provenance` is reserved for FERNS-produced provenance fields (see the contract). Some existing metadata routes still nest `general_summary`/`technical_details` under `provenance`; those routes will be migrated in a later task (envelope route migration). New metadata routes must follow the contract.
-   **Description field completeness**: The `description`, `general_summary`, and `technical_details` fields in every source's registry metadata must be fully self-contained. Together they must give any reader — general user, developer, researcher — a complete understanding of the source without consulting any external documentation. For sources with encoded fields (e.g. coded values like `OBL`, `C5`, `FACW`), `technical_details` must enumerate every possible value and its meaning. If a consumer cannot interpret the data from these fields alone, the registry entry is incomplete.
-   **Disambiguation requirement**: A source's `general_summary` and `technical_details` must fully describe the source's own data fields — including the name, scale, authority, and disambiguation of any vocabulary-defined datatype that the source actually returns. For example, a source that returns a C-value field must describe what a C-value is, its 0–10 scale, its authority (Swink & Wilhelm), and how it differs from superficially similar metrics (Coefficient of Wetness, WUCOLS ratings). This is field-level documentation of the source's own output and is always required. What does NOT belong in individual source metadata is cross-source routing guidance: naming other FERNS sources, recommending which source to use for a given need, or describing how two FERNS sources interact. That belongs exclusively in the `source_relationships` table.
-   **Clarity for humans and agents**: All metadata, description text, and documentation must be written to be understood by both human readers and AI agents. Avoid unexplained abbreviations. Spell out acronyms on first use. Prefer complete sentences over terse field lists.
-   **Dedicated vocabulary sources**: If a data type (such as the Coefficient of Conservatism) is a standalone, well-defined standard with a published authority and a use across multiple FERNS sources, it may have its own registry entry, API, and explorer so that its definition is authoritative and centrally queryable. This is a design option to consider, not a mandatory pattern — the user decides whether a given metric warrants a standalone source. Cross-source relationship information — how two FERNS sources overlap, conflict, complement each other, or where one supersedes another — lives in the `source_relationships` table (added in Task #50) and is accessible via `GET /api/v1/source-relationships`. Individual source metadata does not duplicate this information.
-   **Non-standard conventions**: When a data field uses a convention that is not backed by a published standard (e.g., a 1–10 numeric wetness scale used by some nursery databases), document it explicitly as a non-standard convention. State that different publishers may implement it differently, and that FERNS does not treat it as authoritative.


## Pass-Through Rules (non-negotiable)

These rules formalize "Source Fidelity" for routes that call an upstream source. They are testable assertions; the audit (later task) enforces them.

1. **Verbatim path after the source prefix.** Everything after `/api/{source-id}/` must match the upstream's own path character-for-character. No renaming, no camelCase↔snake_case conversion, no omitted path segments.
2. **Single upstream endpoint per route.** Each FERNS route maps to exactly one upstream call. No fan-out, no merging of two upstream responses into one.
3. **Argument-name parity with the upstream's parameter names.** Query string parameters keep the upstream's exact spelling and case. If the upstream uses `taxon_id`, FERNS uses `taxon_id` — not `taxonId`, not `id`.
4. **No FERNS-produced fields inside `data`.** Everything FERNS generates goes in the envelope. `data` is the upstream's verbatim payload.
5. **Absolute URLs in registry/metadata responses.** `source_url`, `metadata_url`, and `explorer_url` are absolute. (This restates the existing "Self-Describing Registry" rule and applies it to envelope `source_url`.)
6. **Envelope shape conformance.** Every route returns the exact envelope defined in the contract above — no extra top-level keys, no missing required keys.

Any endpoint that cannot satisfy these rules must be declared as a non-passthrough endpoint kind (see "Endpoint Kinds" below) with its kind recorded in the source's `non_passthrough_endpoints` registry field.

## Endpoint Kinds

Every FERNS endpoint has one of seven kinds. The default is `passthrough`. Any endpoint that is neither `passthrough` nor explicitly declared in the source's `non_passthrough_endpoints` registry field is an audit hard-fail.

| Kind             | Purpose                                                                                                  |
|------------------|----------------------------------------------------------------------------------------------------------|
| `passthrough`    | One-to-one mirror of a single upstream API endpoint. Default if not declared.                            |
| `url_lookup`     | Returns a URL into the source's website for a given entity. No upstream API call required.               |
| `scraped_text`   | Returns text content scraped from the source's website (no structured upstream API exists).              |
| `in_memory`      | Serves data that lives permanently inside FERNS (e.g. a vocabulary table).                               |
| `admin`          | Server-side admin/management endpoint, auth-gated, not exposed in `/api/v1/sources` as a public surface. |
| `url_resolver`   | Resolves a website URL via a small computation (used by `website_url_patterns` resolver strategy).       |
| `metadata`       | The standard `/metadata` route per source, returning the registry entry inside the envelope's `data`.    |

Rules:

- Kind declarations live in a **server-side `non_passthrough_endpoints`** registry field. **This field is NOT exposed in `/api/v1/sources`** — it is an internal correctness contract between the route implementation and the audit, not a public capability advertisement.
- Convention rule: any endpoint with `text` in its path is `scraped_text` and must be declared as such (or moved off the `text` naming).
- Any endpoint that is neither declared in `non_passthrough_endpoints` nor matches a verbatim upstream path = audit hard-fail.

## Permission Rules

- `permission_granted` is **per-endpoint** and is returned in every response envelope.
- The source-level `permission_granted` field in the registry (`ferns_sources`) is the **most-restrictive** value across all of that source's endpoints. A source with three `true` endpoints and one `false` endpoint reports `false` at the source level.
- Defaults by endpoint kind:
  - `url_lookup` → defaults to `true` (URLs into a public website are CC0-equivalent).
  - `metadata` → defaults to `true` (CC0; the registry describes FERNS's own metadata about a source).
  - `scraped_text` → defaults to `false` until permission is explicitly recorded for that source/endpoint.
  - `passthrough` → based on the source's published terms, recorded per endpoint.
  - `admin` → auth-gated; the public-permission question does not apply. The envelope still carries `permission_granted` but its value reflects the caller's authorization, not a public license decision.
- **Prototype-mode note (deliberate, will change at launch):** while FERNS is in prototype mode, `permission_granted: false` still returns the requested `data`. This is intentional during build-out so the team can see real responses while permission classifications are being worked out. The launch-time behavior — whether `data` is withheld, partially redacted, or replaced with a citation-only stub — is recorded in "Open Questions" below.

## Companion Website URL Patterns

Every source has both an upstream API (or scraped surface) and a human-readable companion website. The companion website is **not a separate FERNS source** — a source is the upstream organization, and its website is one of its forms. The registry declares per-entity URL templates for that website in a `website_url_patterns` field on the source.

Two forms:

1. **Trivial form** — a template string with `{...}` placeholders for entity fields:
   ```json
   "website_url_patterns": {
     "place": "https://www.inaturalist.org/places/{id}"
   }
   ```

2. **Resolver form** — when the URL cannot be reduced to a single template (e.g., the upstream slugifies a name, or the URL depends on a lookup table). A resolver descriptor names a FERNS endpoint that returns the URL:
   ```json
   "website_url_patterns": {
     "species": { "strategy": "url_resolver", "endpoint": "/api/{source}/website-resolver?entity=species&id={id}" }
   }
   ```
   The resolver endpoint must be declared as kind `url_resolver` in the source's `non_passthrough_endpoints`. The endpoint's response envelope follows the standard contract; the resolved URL lives in `data`.