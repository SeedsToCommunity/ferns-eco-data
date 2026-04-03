# FERNS — Agent Reference

## Overview

FERNS (Federated Ecological Resource Network System) is a data infrastructure layer providing a federated REST API and an OpenAPI description for ecological and environmental data. It exposes data from independent authoritative sources through a consistent REST API, per-source Explorer web interfaces, and a central Registry. This system is designed to be the foundation for other applications.

The primary users are developers building applications for the general public (homeowners, community members, restoration practitioners, and students) needing access to ecological data without integrating every source themselves. Secondary users include those building applications for ecological missions, businesses, or research.

FERNS fetches, caches, and exposes ecological and environmental data from authoritative sources, wraps every response with a provenance envelope, and enforces permission statuses per source. FERNS does not interpret, recommend, or normalize across sources; that is the responsibility of the application layer.

## User Preferences

-   **Communication**: Provide detailed explanations.
-   **New Source Workflow**: When asked to add a new source, follow the Source Onboarding Playbook below (see ## Source Onboarding Playbook). Complete every step on the mandatory checklist. Research the source independently from primary sources. Produce a Source Research Proposal and present it to the user for review before writing any code. Do not begin implementation until the proposal is explicitly approved. After approval, execute all remaining steps autonomously — no interim check-ins unless a genuinely novel architectural decision arises that is not covered by this document.
-   **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
-   **File editing**: Always use targeted edits (`edit` tool) on `replit.md` — never the `write` tool, which replaces the entire file.
-   **Audit script results**: When the audit script (the passthrough compliance checker in this repository) reports discrepancies, stop immediately and present the results to the user. Do not make any changes based on audit output without explicit user direction. The user decides what — if anything — to do about each flagged discrepancy.
-   **Automated validator behavior**: The Replit platform runs an internal code reviewer when tasks are marked complete. Fix code reviewer issues autonomously — do not surface them to the user unless they conflict with the project's general objectives (e.g. a reviewer demands removing a data source or changing a core architectural decision). Minor implementation issues, security hardening, documentation cleanup, and stylistic concerns are handled without user involvement.
-   **Discrepancy ownership**: All discrepancies — whether flagged by the audit script, the automated reviewer, or any other tool — are the user's decision to resolve. Do not resolve them unilaterally.
-   **Post-task summary (required after any significant task)**: After completing a task that involved substantial implementation or decisions, write a plain-language summary covering all of the following — do not omit sections:
    1. **What was built** — one paragraph a non-technical person can follow.
    2. **Derivation summary** — reproduce the actual `general_summary` text verbatim if a new source was added, so the user can verify it reads correctly for a general audience.
    3. **Scientific/technical description** — reproduce the actual `technical_details` text verbatim, so the user can verify accuracy and completeness for a technical audience.
    4. **Architectural decisions made** — every non-trivial decision with its tradeoff stated explicitly. Examples: "chose in-memory cache instead of PostgreSQL — means data is lost on server restart"; "exact match only, no fuzzy fallback — means partial names won't match". Do not bury these. If you made a decision the user might have made differently, surface it.
    5. **What was NOT done** — explicitly list anything that was in scope but skipped, deferred, or not updated (e.g. "audit tool not updated", "no database cache added", "OpenAPI schema not reviewed").
    6. **What the user should decide or review** — flag anything that requires a human judgment call, approval, or follow-up action.
-   **Audit tool coverage (required when adding a new source)**: Adding a new FERNS source is not complete until the audit tool (`lib/ferns-audit`) has a comparator for that source. If the source has a structured API, add a comparator that queries both the upstream source directly and the FERNS endpoint and diffs the results. If the source cannot be compared directly (e.g. static data, no public API), add at minimum a health check (endpoint reachability + envelope structure). Do not mark a source task complete without updating the audit tool or explicitly flagging to the user that it was omitted and why.
-   **Audit tool rules (non-negotiable)**: The audit tool must NEVER run autonomously. It exists for human review only. No code or data changes may be made based on audit output without explicit user direction. The user decides what to fix. These rules are codified at the top of `lib/ferns-audit/src/index.ts` and must not be removed.
-   **Audit tool source coverage (current)**: GBIF (`comparators/gbif.ts` — covers: `/match` field diff, `/reconcile` synonym_count + vernacular_name_count vs upstream GBIF API, `/occurrences` US count vs upstream GBIF occurrence/count, `/search` vernacular candidate count). iNaturalist (`comparators/inat.ts` — covers: `/place` text-search result diff vs upstream iNat autocomplete, `/species` field diff, `/histogram` passthrough diff, `/field-values` passthrough diff, `/observations` URL-builder structural check). BONAP (`comparators/bonap.ts`). Michigan Flora (`comparators/miflora.ts` — covers: `/species` spec_text + synonyms diff vs upstream; `/counties` locations array count + set-equality diff vs upstream `locs_sp?id={plant_id}`; `/images` image count diff vs upstream `allimage_info?id={plant_id}` + checks that constructed `image_url` and `thumbnail_url` are present on first record). Universal FQA (`comparators/universal-fqa.ts` — covers: `/databases` list count; `/databases/:id` blob species-count + metadata + full bidirectional name-presence check + per-record field comparison (family, acronym, native, physiognomy, duration, common_name) for all matched species vs upstream parsed blob; `/species` per-species field comparison; `/assessment/:id` field comparison vs upstream `/get/inventory/:id`). Static source health checks with corpus-driven known-value assertions (`checks/static-sources.ts`): Coefficient of Conservatism (all-table + per-value assertions for C=0,5,10,* from `TEST_COEFFICIENT_VALUES`), Wetland Indicator Status (all-table + per-code assertions for OBL/FACW/FAC/FACU/UPL including `w_value` and `full_name` from `TEST_WETLAND_CODES`; W-value path `/wetland-indicator/w?value=` for −5/−3/0/3/5 with expected code + full_name + w_value from `TEST_WETLAND_W_VALUES`), WUCOLS (all-table + per-code assertions for VL/L/M/H from `TEST_WUCOLS_CODES`), Seeds to Community Washtenaw (per-year species list checks for 2023–2026 from `TEST_S2C_YEARS`), LCSCG (5 checks: `/api/lcscg/metadata` guide_count=12 + species_count=494 exact assertions; `/api/lcscg/guides` all 12 guide IDs + exact titles + season fields verified against corpus; `/api/lcscg/guide/1282` title="Fall Prairie Forbs", species_count=60, `Echinacea pallida` present with 3 image URLs, `Daucus carota` present; `/api/lcscg/species?name=Sporobolus+heterolepis` guide_id=1280 + 3 image URLs + description present; `/api/lcscg/species?name=Daucus+carota` non-native "Do Not Collect" record confirmed with image URLs + seed_group_names includes "Do Not Collect"). API docs and registry: `checks/docs.ts`. Test corpus (`corpus.ts`): `TEST_SPECIES` (3 species), `TEST_PLACES` (2 place IDs), `TEST_PLACE_QUERIES` (2 text queries), `TEST_GBIF_SEARCHES` (2 vernacular queries), `TEST_COEFFICIENT_VALUES`, `TEST_WETLAND_CODES`, `TEST_WETLAND_W_VALUES` (5 W-values), `TEST_WUCOLS_CODES`, `TEST_S2C_YEARS`, `TEST_UFQA_ASSESSMENTS` (assessment ID 37736).

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

-   **Provenance Tracking**: Every database record and API response includes comprehensive provenance metadata (`source_id`, `fetched_at`, `method`, `upstream_url`, `general_summary`, `technical_details`) to enable trust decisions.
-   **API Response Envelope**: All API responses are wrapped in a standard envelope including `source_url`, `data`, `provenance`, and `found` status.
-   **Cache Policy**: Data is cached with specific TTLs per source. Michigan Flora data is cached permanently (no TTL, `expires_at=null`) since the source does not change; `?refresh=true` is the only way to force a re-fetch. Other sources vary — positive results are often cached long-term; negative results may have shorter TTLs.
-   **Permission Enforcement**: Source metadata includes a `permission_granted` flag, and Explorer UIs display blocking modals when permission is not granted.
-   **Monorepo Structure**: Uses a pnpm workspace monorepo with `artifacts` (deployable applications) and `lib` (shared libraries).
-   **UI/UX Decisions**: All Source Explorer UIs live as routed pages within the single `registry-explorer` React + Vite application. Routes follow the pattern `/source/:sourceId` for data sources and `/vocabulary/:vocabulary` for reference sources. Every source page includes a "← All Sources" back-navigation header. Do NOT create a new standalone web app per source — all explorers belong in `registry-explorer` as additional pages. Explorer UIs consume only the FERNS API and include components for permission modals, search forms, result displays, and provenance panels.
-   **Explorer page requirement (NON-NEGOTIABLE)**: Every source added to FERNS MUST have a proper interactive explorer page in `artifacts/registry-explorer/src/pages/`. The explorer page is the UI where a user can actually use the source — search for species, browse records, view results, etc. The metadata page is NOT a substitute. A source is not complete until its explorer page exists and its route is registered in `App.tsx`. Sources that share a query interface can share a page component (e.g., all 8 botanical reference sources use `BotanicalRefSourcePage.tsx` because they all take `?species=` and return a URL). Do not skip this step. The user has explicitly flagged that this step is missed repeatedly.
-   **Generic source page (emergency fallback only)**: `artifacts/registry-explorer/src/pages/GenericSourcePage.tsx` is a catch-all that renders the metadata page for any `/source/:sourceId` not matched by an explicit route. It is an emergency fallback to prevent 404s — NOT a substitute for a real explorer page. If a source is landing on the generic page, the explorer page is missing and must be built. Add the explicit route in `App.tsx` BEFORE the generic catch-all line.
-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables and a central `ferns_sources` table for the registry.
-   **OpenAPI Specification**: An OpenAPI 3.1 spec (`openapi.yaml`) drives API codegen for consistency.
-   **Source Fidelity**: FERNS API mirrors each source's own interface as closely as possible, preserving all fields and known quirks.
-   **Source Descriptions**: Every source has three structured description fields — `description`, `general_summary`, and `technical_details` — that together serve as a complete self-contained reference for any reader. Standards and examples are defined in the Source Onboarding Playbook below.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Self-Describing Registry**: All `metadata_url`, `explorer_url`, and `source_url` fields in registry and metadata responses must be absolute URLs.
-   **TypeScript declarations**: When adding or changing a file in a package that uses `composite: true` (e.g., `lib/db`, `lib/api-client-react`), rebuild its declarations before type-checking consumers: `cd lib/db && pnpm exec tsc -p tsconfig.json` (emitDeclarationOnly). Stale dist/.d.ts files in those packages will cause false "no exported member" errors in packages that reference them.
-   **Metadata response structure**: Every source's `/metadata` endpoint must follow the same response shape as existing sources. The `general_summary` and `technical_details` fields must appear inside the `provenance` object, not as top-level keys or nested under any other wrapper. Before writing a new metadata route, read an existing one (e.g., `artifacts/api-server/src/routes/miflora.ts`) to confirm the shape. Do not invent a new response structure.
-   **Description field completeness**: The `description`, `general_summary`, and `technical_details` fields in every source's registry metadata must be fully self-contained. Together they must give any reader — general user, developer, researcher — a complete understanding of the source without consulting any external documentation. For sources with encoded fields (e.g. coded values like `OBL`, `C5`, `FACW`), `technical_details` must enumerate every possible value and its meaning. If a consumer cannot interpret the data from these fields alone, the registry entry is incomplete.
-   **Disambiguation requirement**: Any FERNS source whose vocabulary overlaps with another source must include explicit disambiguation language in both `general_summary` and `technical_details`. This means naming the other sources, stating clearly what this source does NOT measure, and identifying the authority, scale, and domain of each. This is factual domain mapping, not editorial opinion. Saying "this metric is used by ecologists for habitat assessment, not by nurseries for irrigation planning" is a factual statement and belongs in the description text.
-   **Clarity for humans and agents**: All metadata, description text, and documentation must be written to be understood by both human readers and AI agents. Avoid unexplained abbreviations. Spell out acronyms on first use. Prefer complete sentences over terse field lists.
-   **Dedicated vocabulary sources**: If a data type (such as the Coefficient of Conservatism) is a standalone, well-defined standard with a published authority and a use across multiple FERNS sources, it may have its own registry entry, API, and explorer so that its definition is authoritative and centrally queryable. This is a design option to consider, not a mandatory pattern — the user decides whether a given metric warrants a standalone source. A cross-reference meta-source whose sole purpose is to disambiguate other sources was evaluated and intentionally declined (see Task #28): disambiguation belongs in each source's own `general_summary` and `technical_details` fields and in this document, not in a separate API endpoint.
-   **Non-standard conventions**: When a data field uses a convention that is not backed by a published standard (e.g., a 1–10 numeric wetness scale used by some nursery databases), document it explicitly as a non-standard convention. State that different publishers may implement it differently, and that FERNS does not treat it as authoritative.

## Source Onboarding Playbook

### Onboarding Checklist (Mandatory — do not skip steps)

Every step must be completed before a source is considered done. If a step is genuinely not applicable, state that explicitly with a reason. Do not silently omit steps.

**Step 1: Research (before any code)**
Independently read the source's website, documentation, and terms of service from primary sources. Identify: institution, coverage (geographic, taxonomic, data type), access method (API / scrape / static), permission status (check robots.txt and ToS), data freshness, known limitations, and overlap with any existing FERNS source. Do not rely on secondary descriptions or assumptions. Done when you can answer every field in the Source Research Proposal template.

**Step 2: Source Research Proposal (must be approved before any code is written)**
Write the proposal using the template below. Present it to the user in a single message. Wait for explicit written approval before proceeding. Done when the user has replied with explicit approval.

**Step 3: DB Schema** (required if source needs caching; otherwise explicitly note "no DB cache — data is static/in-memory")
Create a new Drizzle schema file in `lib/db/src/schema/`. Export the table(s) from `lib/db/src/schema/index.ts`. Run `pnpm --filter @workspace/db run push` (pipe `\n` for the interactive prompt) to sync to the database. Rebuild DB declarations: `cd lib/db && pnpm exec tsc -p tsconfig.json`. Done when the table exists in the database and is queryable.

**Step 4: Connector / Importer** (required if source needs data ingestion; not needed for direct-construction sources)
Implement data ingestion in `artifacts/api-server/src/services/{source-id}/`. Done when data is in the DB or loaded into memory. If skipped, state why.

**Step 5: Source Metadata and Registry Seed (DO NOT SKIP description quality)**
Create `artifacts/api-server/src/services/{source-id}/metadata.ts` with the source constants (SOURCE_ID, GENERAL_SUMMARY, TECHNICAL_DETAILS, REGISTRY_ENTRY, PERMISSION_GRANTED, PERMISSION_STATUS). Create `artifacts/api-server/src/services/{source-id}/seed.ts` that upserts into `fernsSourcesTable`. The three description fields (`description`, `general_summary`, `technical_details`) must conform to the standards defined below before this step is considered done. A source is not complete if any description field fails its audience test. Done when `GET /api/v1/sources` includes the new source with description fields that meet the defined standards.

**Step 6: Route Handler**
Create `artifacts/api-server/src/routes/{source-id}.ts`. Implement `GET /api/{source-id}` (data endpoint) and `GET /api/{source-id}/metadata` (metadata endpoint). The metadata endpoint must return the same envelope shape as all existing sources — read `artifacts/api-server/src/routes/miflora.ts` before writing the new one. Register the router in `artifacts/api-server/src/index.ts`. Done when both endpoints return 200 with a correct envelope.

**Step 7: OpenAPI Spec**
Add the new endpoints to `lib/api-spec/openapi.yaml`. Follow existing path, parameter, response schema, and tag conventions. Done when the spec is valid and covers the new endpoints.

**Step 8: Codegen**
Run: `pnpm --filter @workspace/api-client-react run codegen`. Done when generated types are updated and there are no TypeScript errors in consumer packages.

**Step 9: Explorer Page (NON-NEGOTIABLE — never skip, never defer)**
Create `artifacts/registry-explorer/src/pages/{SourceId}Page.tsx`. The page must include a working search form, result display, and provenance panel. Follow `NatureservePage.tsx` for layout and data-fetch patterns. Use `const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, ""); const API_BASE = \`${BASE_URL}/api\`` for all fetch calls. If this source shares a query interface with existing sources, use or extend the appropriate shared page component. Done when the explorer page renders real search results for at least one species name.

**Step 10: App.tsx Route Registration**
Add an explicit `<Route path="/source/{source-id}">` in `artifacts/registry-explorer/src/App.tsx` BEFORE the generic catch-all route. Done when navigating to `/source/{source-id}` renders the explorer page — not the generic fallback page.

**Step 11: Audit Tool Coverage (DO NOT SKIP — skipping requires explicit written justification)**
Add a comparator or health check in `lib/ferns-audit/src/`. For API/scrape sources: add a comparator that queries both the upstream source and the FERNS endpoint and diffs the result. For static sources: add a health check with known-value assertions. Done when the audit tool has coverage for the new source. If this step is skipped for any reason, write an explicit paragraph in the post-task summary stating exactly what coverage was omitted and why — a silent omission is a task failure.

**Step 12: Post-Task Summary**
Write the mandatory post-task summary (see User Preferences). Include the verbatim text of `description`, `general_summary`, and `technical_details` so the user can verify them. Done when the summary is complete and presented.

---

### Source Research Proposal Template

Present this as a formatted document in one chat message. Every field is required unless marked optional.

```
## Source Research Proposal: {Source Name}

**Source URL**: {primary URL}
**Institution / Publisher**: {legal name of the institution or organization that runs it}
**Data type**: {taxonomy / distribution / occurrence / phenology / nursery catalog / field guide / etc.}
**Geographic coverage**: {continent / country / region / state — be specific}
**Taxonomic coverage**: {vascular plants / all plants / all species / etc.}
**Access method**: {API / sitemap scrape / species list scrape / static data / direct URL construction}
**Permission status**: {Open / Restricted / Unknown — state how you verified this: robots.txt, ToS URL, or contact}
**Data freshness**: {how often does the upstream source update? is FERNS data live or cached?}
**Proposed source_id**: {kebab-case identifier, e.g. prairie-moon}
**Proposed endpoints**:
  - GET /api/{source-id}?species={name} — {one sentence}
  - GET /api/{source-id}/metadata — standard metadata envelope
**Proposed caching strategy**: {DB cache with TTL / in-memory / no cache / permanent}
**Known limitations**: {gaps in coverage, taxonomy mismatches, edge cases, accuracy concerns}
**Overlap with existing FERNS sources**: {name any sources that cover similar data and explain how they differ; if none, say "none"}

**Draft description** (1–3 sentences, plain English, no jargon — see field standards below):
{draft}

**Draft general_summary** (comprehensive, plain language — see field standards below):
{draft}

**Draft technical_details** (graduate-level, complete reference — see field standards below):
{draft}
```

---

### Description Field Standards

These three fields are required on every FERNS source. They are structured deliverables with defined audiences and required content, not optional prose. A source is not complete until all three meet the standards below.

#### `description`

**Audience**: A non-technical person — a homeowner, student, or restoration practitioner — deciding whether this source is relevant to their question.

**Required content**:
- What kind of resource this is (nursery catalog, government database, field guide, scientific atlas, etc.)
- What you can find or do with it, in plain terms
- Geographic or domain scope, stated simply (e.g. "Midwest and Great Plains", "Michigan only")

**Length**: 1–3 sentences.

**Anti-patterns — do not include**:
- Technical method terms ("sitemap scrape", "API fetch", "ILIKE query", "DB cache")
- Botanical or scientific jargon without a plain-English translation
- URLs
- The source organization's name (the source card already shows the name)
- Repetition of information already visible in the source name or title

**Worked example (Prairie Moon)**:
> "An online guide and nursery catalog for native wildflowers, grasses, and sedges of the Midwest and Great Plains. Each plant has growing notes, ecological information, and nursery availability. Covers roughly 970 species."

---

#### `general_summary`

**Audience**: A general user — a developer, a citizen science app builder, a data program coordinator, a domain analyst — deciding whether this source aligns with their use case and domain.

**Required content (all 8 points must be covered)**:
1. Who runs it and what institution it belongs to
2. What the data is: type, content, scope
3. Geographic and taxonomic coverage (specific — counts and regions)
4. How FERNS accesses the data, stated in plain language (not technical jargon)
5. What a query to FERNS returns: what fields, what shape — in plain English
6. How current the data is: live, cached, static, and what the refresh policy is
7. Known limitations: what this source does not cover, edge cases, accuracy concerns
8. How this source relates to other FERNS sources that cover similar ground — name them explicitly; state when to use this one and when to use the other

**Length**: As many sentences as needed to cover all 8 points. Typically 4–8 sentences.

**Anti-patterns — do not include**:
- Omitting any of the 8 required points
- Technical implementation details: DB column names, SQL, URL patterns, exact parse logic
- Unexplained ecological or botanical terminology
- Vague non-statements ("provides data about plants", "contains useful information")
- Treating the data as equivalent to another FERNS source without explicitly comparing them

**Worked example (Prairie Moon)**:
> "Prairie Moon Nursery (Winona, Minnesota) is a leading native plant supplier for the Upper Midwest and Great Plains. Their website lists roughly 970 native species — wildflowers, grasses, sedges, ferns, and woody plants — with growing notes, ecological context, and nursery availability. FERNS imports Prairie Moon's full plant catalog periodically and stores it locally; when you query by scientific name, FERNS looks it up in that local index and returns a direct link to the Prairie Moon plant page if a match exists. The data reflects the time of the last import, not live nursery stock. Prairie Moon covers nursery availability and growing information only — it is not a scientific taxonomic source and does not include distribution data, nativity status, or conservation rankings. For taxonomy, use the GBIF source. For regional distribution in Michigan, use Michigan Flora. For native status, use BONAP."

---

#### `technical_details`

**Audience**: A graduate student, hardcore developer, botanist researcher, mathematician, or organizational data archivist who needs every technical and methodological detail without consulting any other document. This is the authoritative stop for everything precise.

**Required content (all 12 points must be covered)**:
1. Full institution name, URL, and any relevant legal, publication, or licensing context
2. Primary citation or authority: author, year, publication, if applicable
3. Exact access method: URL patterns, API endpoints, sitemap path, scraping strategy, parsing logic — include all edge cases and known exceptions
4. Scientific name inference or parsing logic, if applicable — document every rule and edge case
5. Database schema: table name(s), key columns, primary key, unique constraints, index strategy
6. Caching policy: TTL value, refresh strategy, cache invalidation behavior, what `?refresh=true` does if implemented
7. Response normalization: what FERNS adds, changes, or omits relative to the upstream data; any field transformations
8. All coded or enumerated field values with their complete meaning (e.g. OBL = Obligate Wetland; C=10 = highest ecological fidelity to undisturbed habitat; W=−5 = most strongly wetland-affiliated)
9. Coverage: record count, geographic region, taxonomic scope, date range if relevant — always use specific numbers
10. Known limitations, edge cases, and accuracy concerns: taxonomy mismatches, missing coverage, encoding issues, unstable upstream identifiers
11. Overlap with other FERNS sources: name them, state exactly what this source measures and what it does not, explain why a user would choose this source over the others — this is required for every source, even those with no apparent overlap
12. Any non-standard conventions used by the source: undocumented scales, idiosyncratic field names, publisher-specific coding

**Length**: As long as needed. Do not abbreviate to fit a length target. This field must be complete.

**Anti-patterns — do not include**:
- Omitting any of the 12 required points
- Vague coverage statements — always use specific record counts and geographic boundaries
- Unexplained coded values or abbreviations
- Omitting point 11 (overlap / disambiguation) — this is required even for apparently unique sources

**Worked example (Prairie Moon, excerpt)**:
> "Primary source: https://www.prairiemoon.com/sitemap.xml. Operator: Prairie Moon Nursery, Winona, MN (prairiemoon.com). Access method: sitemap_scrape. Sitemap parsed at import time; plant URLs filtered from root-level paths matching {genus}-{species}-{common-name-slug}, excluding /category/, /cart/, and /info/ paths (~970 plant URLs at last import). Scientific name inference from URL slug: genus = parts[0] capitalized; species = parts[1] lowercase; trinomial recognized when parts[2] is 'subsp' or 'var' (infraspecific epithet = parts[3]). DB table: botanical_species_lists (columns: id, site_id, scientific_name, url, imported_at; unique on (site_id, scientific_name)). Caching: full import on demand via POST /api/prairie-moon/import (admin-protected); no TTL; data is permanent until re-imported. FERNS returns: found (bool), species (inferred scientific name string), url (direct plant page URL string), validation_method = 'species_list_lookup', imported_at (timestamp). Lookup: ILIKE match on scientific_name column — case-insensitive, no fuzzy matching, exact binomial required. Known limitation: URL slug spelling may not match current accepted taxonomy (synonyms, older names not yet updated on the Prairie Moon site). Prairie Moon is a nursery catalog, not a scientific taxonomic authority. It does not provide distribution data, nativity status, conservation status, or C-values. For taxonomy: use GBIF (`gbif`). For Michigan distribution: use Michigan Flora (`miflora`). For regional distribution: use BONAP (`bonap`). For C-values: use Universal FQA (`universal-fqa`). Prairie Moon is useful specifically when you need to confirm nursery availability or retrieve a direct plant page URL for a Midwest or Great Plains native species."

---

### Autonomy Guidance

After the user approves the Source Research Proposal, execute all remaining checklist steps (Steps 3–12) autonomously. No interim check-ins are required or expected.

**Do NOT pause for**:
- Implementation choices already covered by this playbook or elsewhere in replit.md
- Caching strategy that follows an existing pattern
- Explorer page layout, component structure, or form design
- Route registration and OpenAPI spec additions
- Audit health check implementation for a source that follows existing patterns

**DO pause and present to the user before proceeding when**:
- A genuinely novel DB schema pattern is needed that has no precedent in existing sources
- A new caching approach is required that differs fundamentally from all existing sources (e.g. streaming, event-sourcing, Redis)
- The upstream API response cannot be cleanly mapped to the FERNS envelope without a structural design decision
- Permission status is unclear or requires contacting the source institution
- The source reveals a data overlap or disambiguation issue not yet addressed in replit.md

## Coefficient & Wetness Vocabulary Reference

The ecological/botanical domain contains several metrics whose names are superficially similar but measure entirely different things. This is a known source of confusion for both humans and agents. FERNS sources that use any of these metrics must disambiguate explicitly in their description fields.

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
-   **Michigan Flora** (University of Michigan Herbarium): Vascular plant species data for Michigan. API v1.0 at `https://michiganflora.net/api/v1.0`. Species lookup calls `flora_search_sp?scientific_name={name}`, then parallel detail calls: `spec_text?id=`, `synonyms?id=`, `pimage_info?id=`. County records from `locs_sp?id={id}` returning `{locations:[...county names...]}`. Image gallery from `allimage_info?id={id}` returning an array of image records. Image URL formula (reverse-engineered from frontend JS): full = `https://michiganflora.net/static/species_images/_pid_{plant_id}/{image_id}.jpg`; thumbnail = `..._pid_{plant_id}/thumb_{image_id}.jpg`. The `pimage_info` in species response is enriched with constructed `image_url` and `thumbnail_url` at serve time. Known quirks: adventive species names ALL-CAPS; `st` field is literal string `"NULL"` (not JSON null); `c` field always a string (`"*"` = non-native); `synonyms` returns either `{synonyms:[...]}` or `{message:"No synonyms found"}`; `search_records` contains all genus members. Cache TTL: **infinite** (`expires_at=null`) for all three MiFlora cache tables (species, counties, images) — MI Flora data does not change; `?refresh=true` forces re-fetch. Source URL pattern: `https://michiganflora.net/species/{plant_id}`. Endpoints: `GET /api/miflora/species`, `GET /api/miflora/counties`, `GET /api/miflora/images`, `GET /api/miflora/metadata`. DB tables: `miflora_species_cache`, `miflora_counties_cache`, `miflora_images_cache`.
-   **Seeds to Community Washtenaw**: Native plant seed-growing program in Washtenaw County, Michigan. Source ID: `seeds-to-community-washtenaw`. Knowledge type: `source_wrapper`. Method: `static_data` (in-memory, no upstream API). Exposes species availability lists (botanical names only) for four program years: 2023 (24 spp, from PDF plant sheets), 2024 (96 spp, spreadsheet), 2025 (151 spp, spreadsheet, `Barn S3=TRUE`), 2026 (166 spp, master spreadsheet, `Collected=TRUE`). Optional flags where tracked: `neat_and_tidy` (2024+), `sweet_and_simple` (2026 only). Data lives in `artifacts/api-server/src/services/s2c/data.ts`. Endpoints: `GET /api/s2c?year={year}`, `GET /api/s2c/years`, `GET /api/s2c/metadata`. Explorer: `/source/seeds-to-community-washtenaw`. Data owner is the program organizer; permission explicitly granted. To update for a new year: re-download Drive spreadsheets and re-run the extraction script to update `data.ts`.
-   **Lake County Seed Collection Guides (LCSCG)**: 12 illustrated field guides for native seed identification in Lake County, Illinois. Source ID: `lcscg`. Knowledge type: `source_wrapper`. Method: `static_data` (no upstream API; data imported from Google Drive JSON files once and stored in PostgreSQL). Authors: Kelly Schultz and Dale Shields. Publisher: Field Museum Field Guides (fieldguides.fieldmuseum.org). License: CC BY-NC 4.0. Covers 494 species in 12 guides (Field Museum Guide IDs 1271–1282), organized by season (spring, summer, fall, all) and habitat type (woodland, wetland, prairie, grasses_and_kin, asters_and_goldenrods, woody_plants). Species data includes scientific name (per Flora of the Chicago Region, Wilhelm & Rericha 2017), common name, plant family, harvest notes (description field), photo date, page number, 13 seed dispersal categories (Elaiosomes, Ballistic, Fluffy, Milkweed, Berries, Mama's Boys, Shakers, Beaks, Coneheads, Crumbly Coneheads, Shattering, Hitchhikers, Do Not Collect), and Cloudinary CDN image URLs (2,093 PNG images, cloud: dqe2vv0fo, URL pattern: `https://res.cloudinary.com/dqe2vv0fo/image/upload/{folder}/{stem}`). Non-native "Do Not Collect" comparison species (Daucus carota, Cirsium vulgare, etc.) are included in the dataset. Nomenclature follows Flora of the Chicago Region (2017) and may differ from GBIF, iNaturalist, or USDA PLANTS. DB tables: `lcscg_guides` (PK: guide_id integer, 12 rows), `lcscg_species` (serial PK, unique on (guide_id, species_id), 494 rows). Import script: `artifacts/api-server/src/services/lcscg/import.ts` (uses @replit/connectors-sdk Google Drive proxy + Cloudinary Search API; run via `pnpm exec tsx src/services/lcscg/import.ts` inside api-server). Image URL fix script: `artifacts/api-server/src/services/lcscg/reimport-images.ts` — re-fetches all Cloudinary image URLs and updates `image_urls` in the DB; run via `pnpm exec tsx src/services/lcscg/reimport-images.ts` inside api-server (requires `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`). Cloudinary Search API requires `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` env secrets. Cloudinary public_id format varies by guide: some have a trailing `_XXXXXX` random suffix (no folder prefix), others include the folder path as a prefix with no suffix — normalization strips the folder prefix (split on "/", take last part) and optionally strips `_XXXXXX`. All 1,468 image filenames are matched (0 nulls after re-import). `/api/lcscg/guides` now returns `species_count` per guide (from a COUNT join on `lcscg_species`). Endpoints: `GET /api/lcscg/metadata`, `GET /api/lcscg/guides`, `GET /api/lcscg/guide/:guideId`, `GET /api/lcscg/species?name=`. Explorer: `/source/lcscg` (two-mode: browse by guide and search by name). Drive folder IDs and Cloudinary folder names are in `artifacts/api-server/src/services/lcscg/metadata.ts`. Geographic scope: Lake County, Illinois only. FERNS does not cross-reference LCSCG with any other source.
-   **Michigan Natural Features Inventory (MNFI)**: Natural Community Classification and County Element Data for Michigan. Source ID: `mnfi`. Knowledge type: `source_wrapper`. Method: `static_data` for communities (auto-seeded at startup); `api_fetch` for county element data via public JSON API on the MNFI county element data page. 77 natural community types across 5 ecological classes (Palustrine, Palustrine/Terrestrial, Primary, Subterranean/Sink, Terrestrial) and 18 community groups. County element API endpoints: `https://mnfi.anr.msu.edu/resources/countyQuery?county={id}` (species) and `https://mnfi.anr.msu.edu/resources/countyCommunityQuery?county={id}` (communities); county IDs 1–83 correspond to Michigan counties in alphabetical order. 7,289 records in DB (6,360 species + 929 communities across all 83 counties). Community detail (`GET /api/mnfi/communities/:id`) includes inline `characteristic_plants` with plant list by life form — no separate request needed. DB tables: `mnfi_communities` (77 rows), `mnfi_community_plants` (5,777 rows across all 77 communities), `mnfi_county_elements` (7,289 rows across all 83 counties). Import scripts (all admin-protected, require `Authorization: Bearer <ADMIN_SECRET>`; fail-closed when `ADMIN_SECRET` is set, open only in dev when unset): `POST /api/mnfi/import-descriptions` (scrapes 77 description pages ~40s), `POST /api/mnfi/import-plant-lists` (scrapes 77 plant-list pages ~40s), `POST /api/mnfi/import-county-elements` (fetches all 83 counties from MNFI JSON API ~40s). Scraper: `artifacts/api-server/src/services/mnfi/scraper.ts`. County import: `artifacts/api-server/src/services/mnfi/county-import.ts`. Endpoints: `GET /api/mnfi/metadata`, `GET /api/mnfi/communities`, `GET /api/mnfi/communities/:id`, `GET /api/mnfi/communities/:id/plants`, `GET /api/mnfi/county-elements?county=&type=`, `POST /api/mnfi/import-communities`, `POST /api/mnfi/import-descriptions`, `POST /api/mnfi/import-plant-lists`, `POST /api/mnfi/import-county-elements`. Explorer: `/source/mnfi`. Citation: Cohen et al. 2025. Michigan Natural Community Classification. MNFI/MSU Extension. https://mnfi.anr.msu.edu/communities/classification. Audit coverage: `runMnfiChecks` — 5 checks: metadata (community_count=77, descriptions_fetched=77, plant_record_count>0, county_element_count>7000, 5 classes), communities list (77 total), community detail for prairie-fen (id/class/group/ranks + inline characteristic_plants), county elements for Washtenaw (result_count>0, total_imported>7000, Prairie Fen present), plant list for prairie-fen (plants_imported=true, graminoids+forbs present).
-   **Universal FQA** (universalfqa.org): Federated Floristic Quality Assessment platform. Source ID: `universal-fqa`. Knowledge type: `source_wrapper`. Method: `api_fetch`. No authentication required. Base URL: `http://universalfqa.org/get` (HTTP, redirects to HTTPS). Serves two distinct data types: (1) 93 regional FQA databases (per-species C-values, W-values, physiognomy, duration, nativity) spanning 1993–2025 for US states, EPA ecoregions, and Canadian provinces; (2) public site assessments (field inventories with observed species lists and computed FQI metrics). Databases are persisted to PostgreSQL (`universal_fqa_databases`, `universal_fqa_species` tables) on first fetch — subsequent requests are served from DB cache. Assessments are fetched live. Michigan Flora's C-values match Universal FQA database ID 50 (Reznicek et al. 2014). Endpoints: `GET /api/universal-fqa/metadata`, `GET /api/universal-fqa/databases`, `GET /api/universal-fqa/databases/:id` (full species blob), `GET /api/universal-fqa/species?name=&database_id=`, `GET /api/universal-fqa/assessments?database_id=`, `GET /api/universal-fqa/assessment/:id`. Explorer: `/source/universal-fqa` (3 tabs: Databases, Species Lookup, Assessments; Databases tab has "Browse all species" button that loads the full species list via the blob endpoint). DB schema: `lib/db/src/schema/universal-fqa.ts`. Service layer: `artifacts/api-server/src/services/universal-fqa/db-cache.ts`. Known limitation: some database IDs return malformed/empty JSON from universalfqa.org — these will return 502; handle gracefully.

-   **Botanical Web References (8 sites)**: A cross-source bundle of 8 botanical reference websites. Source IDs: `gobotany`, `google-images`, `missouri-plants`, `minnesota-wildflowers`, `illinois-wildflowers`, `prairie-moon`, `usda-plants`, `lady-bird-johnson`. Bundle endpoint: `GET /api/botanical-refs?species={name}` fans out to all 8 sites in parallel. Sites list: `GET /api/botanical-refs/sites`. Per-site endpoints: `GET /api/{site-id}?species={name}` and `GET /api/{site-id}/metadata`. URL strategies: (1) **Direct construction** (no DB, no HTTP validation): Google Images, USDA PLANTS, Lady Bird Johnson — always returns a search URL; (2) **HTTP GET validation**: GoBotany — constructs URL at `gobotany.nativeplanttrust.org/species/{genus}/{species}/` and validates with a GET request (200=found, 404=not found); (3) **Species list scrape** (DB lookup): Missouri Plants (1,493 species from `missouriplants.com/All_Species_list.html`), Minnesota Wildflowers (1,853 species from `/page/plants-by-name`), Illinois Wildflowers (1,459 entries across 8 habitat sections: prairie, savanna, woodland, wetland, weeds, grasses, trees, mosses), Prairie Moon (823 unique species from `prairiemoon.com/sitemap.xml`). DB table: `botanical_species_lists` with unique on `(site_id, scientific_name, section)`. Admin import endpoints: `POST /api/{missouri-plants|minnesota-wildflowers|illinois-wildflowers|prairie-moon}/import` (require `Authorization: Bearer <ADMIN_SECRET>`). Auto-import at startup when table is empty. Known limitations: USDA PLANTS and LBJ profile URLs require internal symbol codes not derivable from scientific names — FERNS returns search URLs instead. GoBotany HTTP validation adds latency (~1s) per query; bundle queries GoBotany in parallel with others. Illinois Wildflowers same species may appear in multiple sections (multiple rows returned). Prairie Moon sitemap deduplicated by scientific name — both slug and numeric-ID URL variants exist in sitemap; canonical slug URL preferred. Audit tool: NOT YET UPDATED (these sources are reference link aggregators, not data sources with field-level parity to compare — no comparators added).

**Infrastructure:**

-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express 5
-   **Codegen**: Orval (from OpenAPI spec)