# Ecological Commons — Agent Reference

## Your role

You are a trusted translator between old data/interfaces and a faithful shared interface layer that the planet can rely upon. Clarity, accuracy, faithfulness to the source material, and completeness are your job. The data covers all things ecological.

This repository represents three parts of a broader Ecological Commons: an Overview Web Interface, the Data Layer (source registry, REST, MCP) and the Trust Layer. You translate upstream sources of information into a consistent interface without distorting what those sources say. You preserve provenance. You honor source identity. You do not interpret, recommend, or normalize across sources; that is the responsibility of the higher application layers. Some data will only reside within this data layer. Some data will be retrieved from outside this system.

## What you are deep within - An Ecological Commons

The **Ecological Commons** is federated knowledge infrastructure for ecological data, built as a layered architecture where each layer has its own job.

**External sources** — research institutions, citizen science platforms, regional floras, government databases, partner organizations — retain their own authority and identity.

The **Data Layer** registers each source with a structured description, caches data where appropriate, and exposes registered sources through three consistent interfaces: its registry entry, a REST API, and an MCP interface. Every response carries a provenance envelope. FERNS does not interpret, normalize, or pick winners between disagreeing sources. Sources may freely agree or disagree. The data layer does not pick winners or losers. 

A **Trust Layer** sits above the Data Layer and acts to filter which sources an application considers. Users will define trust groups so certain data sources can be identified for specific jobs. 

**Applications** sit above the data and trust layers. They interpret, synthesize, and present. They are where opinions live. They are what people use.

**Users** of this entire system expect you to perform your role with consistency and to call out conflicts in your guidance so that building the system flows easily. The guidance must be consistent and all actors must call out inconsistencies. 

**The technical commitments**: every response carries provenance; every API route is verbatim pass-through to one upstream endpoint; every source has three structured descriptions sized for different audiences; the registry is the single source of truth for source metadata; permissions are per-endpoint; names and equivalences are recorded with attribution, never invented.

The stack is unremarkable. The value of this approach is in the disciplined separation of concerns.

## User Preferences

-   **Communication**: Provide clear explanations that enable the user to make high level decisions.
-   **New Source Workflow**: When asked or modifying a source, the docs/source-onboarding-playbook.md should be referenced and followed. 
-   **Constraint Adherence**: Do not introduce additional frameworks or databases without explicit instruction.
-   **Task sizing (hard limit, overrides skill defaults)**: When proposing a project task for this codebase, split before proposing if any of these are true: (a) the task plausibly modifies more than ~800 source lines, (b) it touches more than 3 packages, (c) its "Done looks like" section has more than 6 distinct observable outcomes, or (d) it requires holding more than one upstream data source's quirks in mind simultaneously. The `project_tasks` skill's default "prefer fewer tasks" bias is explicitly overridden for this repo — prefer many small atomic tasks over few large ones. Acceptable exception: a single cohesive file or single upstream source that cannot be split without breaking atomicity; document the exception explicitly in the plan file. Apply the same limits when decomposing work in Build mode (`.local/session_plan.md`).
-   **Automated validator behavior**: The Replit platform runs an internal code reviewer when tasks are marked complete. Fix code reviewer issues autonomously — do not surface them to the user unless they conflict with the project's general objectives (e.g. a reviewer demands removing a data source or changing a core architectural decision). Minor implementation issues, security hardening, documentation cleanup, and stylistic concerns are handled without user involvement.
-   **Discrepancy ownership**: All discrepancies — whether flagged by the audit script, the automated reviewer, or any other tool should be judged first against these guidance documents. If the guidance does not conflict on the discrepancy, then act. If guidance is missing or in conflict, provide the highest level explanation to the user as possible and get approval. If you think this file or other guidance files needs changes, raise them to get approval.
-   **Post-task summary (required after any significant task)**: After completing a task that involved substantial implementation or decisions, write a plain-language summary covering all of the following — do not omit sections:
    1. **What was built** — one paragraph a non-technical person can follow.
    2. **Derivation summary** — reproduce the actual `general_summary` text verbatim if a new source was added, so the user can verify it reads correctly for a general audience.
    3. **Scientific/technical description** — reproduce the actual `technical_details` text verbatim, so the user can verify accuracy and completeness for a technical audience.
    4. **Architectural decisions made** — every non-trivial decision with its tradeoff stated explicitly. Examples: "chose in-memory cache instead of PostgreSQL — means data is lost on server restart"; "exact match only, no fuzzy fallback — means partial names won't match". Do not bury these. If you made a decision the user might have made differently, surface it.
    5. **What was NOT done** — explicitly list anything that was in scope but skipped, deferred, or not updated (e.g. "audit tool not updated", "no database cache added", "OpenAPI schema not reviewed").
    6. **What the user should decide or review** — flag anything that requires a human judgment call, approval, or follow-up action.

## Post-Task Summary — Envelope Contract v1: Coefficient Family Migration

### 1. What was built

Four API routes — Coefficient of Conservatism, WUCOLS, Wetland Indicator Status, and Universal FQA — were migrated to use the shared `buildEnvelope()` function from the `@workspace/api-envelope` package, bringing them into compliance with the FERNS Response Envelope Contract v1. Before this task, these routes assembled their own response envelopes by hand, each doing it slightly differently and missing fields the contract now requires. After this task, every response from these four routes carries a standardized `provenance` block containing `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `derived_from`, `license`, and `rights` — plus top-level `found`, `permission_granted`, and `pagination` fields. The three in-memory vocabulary sources (Coefficient, WUCOLS, Wetland Indicator) report `method: cache_hit` and `cache_status: hit` because their data never leaves the server process. Universal FQA reports `method: api_fetch` / `cache_status: miss` on live upstream calls and `method: cache_hit` / `cache_status: hit` on database-cached responses. Registry seed files were updated so the database rows for all four sources now store `license`, `rights`, and `website_url_patterns` columns. The audit comparator was updated to check for `permission_granted` and the new provenance fields instead of the old `general_summary`/`technical_details` fields it was incorrectly asserting. The three vocabulary explorer pages now use `SourceExplorerLayout` (the same framing all other source pages use) instead of the generic `Layout`. The Universal FQA explorer page was fixed to read `cache_status` from `provenance.cache_status` instead of a top-level field that no longer exists. The shared `FernsProvenance` TypeScript type across all generated client files was updated to reflect the v1 contract fields, which also fixed pre-existing type errors in the iNat Phenology tab as a side effect.

### 2. Derivation summary

Not applicable — no new data source was added in this task. This was a structural migration of existing sources.

### 3. Scientific/technical description

Not applicable — no new `technical_details` text was authored. The existing `general_summary` and `technical_details` fields for all four sources were preserved and continue to be served through the `/metadata` endpoint for each source.

### 4. Architectural decisions made

- **`sourceKind: "single-source-proxy"` for Universal FQA data endpoints** — The envelope builder requires the caller to declare how data was obtained. Universal FQA makes live HTTP calls to `universalfqa.org`, making it a single-source proxy. The metadata endpoint, which serves in-process data, uses `"in-memory"`. This means the `source_url` field in `provenance` is populated with the upstream URL for data calls and `null` for metadata calls, which is the correct v1 behavior.

- **`license` and `rights` as scalar strings, distinct from the existing `licenses` array and `license_notes` string** — The DB schema and v1 contract define `license` (a single canonical license URI, e.g. `"cc-by"`) and `rights` (a human-readable permission statement) as separate scalar columns. The existing `licenses` (array) and `license_notes` fields remain on the registry row and the `/metadata` response for backward compatibility. Both sets of fields now live in the DB.

- **`FernsProvenance` updated in-place rather than replaced** — The generated client type was updated to include the new v1 fields while keeping the old fields as optional with `@deprecated` markers. This avoids breaking the BONAP, iNat, and other routes that haven't yet been migrated and still return the old envelope shape. The trade-off: the type is now a broader union and older consumers won't get a compile error when they read a deprecated field — they just get `undefined` at runtime. A future codegen regeneration will need to align the OpenAPI spec and re-run orval to make this clean.

- **Audit `envelopeFindings` updated for all static sources at once** — The shared `envelopeFindings()` function in `static-sources.ts` now checks `permission_granted` and `provenance.cache_status/license/rights` instead of the old `provenance.general_summary/technical_details`. This means ALL static-source audit checks (Coefficient, WUCOLS, Wetland Indicator, and any future static sources using that helper) now validate the v1 contract fields. BONAP, iNat, and other non-static-source comparators were not touched.

### 5. What was NOT done

- **MCP tool blocks for the four sources were not changed.** The MCP tools pass a `provenance_verbosity` parameter to the routes. Since `buildEnvelope()` does not filter on `provenance_verbosity`, the parameter is silently ignored on these four routes. The MCP tools still call the correct endpoints and return whatever the API returns — behavior is correct, the parameter just has no effect.
- **Universal FQA audit comparator (`lib/ferns-audit/src/comparators/universal-fqa.ts`) was not updated.** The code reviewer flagged this. The comparator file currently has no envelope-shape assertions at all. Adding `permission_granted` and provenance v1 field checks to that file is follow-up work.
- **OpenAPI spec was not regenerated.** The `FernsProvenance` type was updated manually in the generated source and dist files. The authoritative OpenAPI spec has not been changed, and the orval codegen has not been re-run. A future `pnpm run codegen` will overwrite the manual fix unless the spec is updated first.
- **Generated endpoint-level response types** (e.g. `CoefficientResponse`, `WucolsResponse`) still model the old top-level `cache_status`/`queried_at` fields. These were not changed in this task.
- **The pre-existing `PlaceLookupTab.tsx` type error** (`Property 'data' does not exist on type 'InatMetadataResponse'`) was not fixed — it predates this task and is tracked as follow-up task #191.

### 6. What the user should decide or review

- **Universal FQA comparator audit coverage** — The audit tool doesn't assert envelope-v1 structure on Universal FQA responses. This is the only one of the four migrated sources without that check. Decide whether to add it now or leave it for the broader comparator pass.
- **OpenAPI spec update timing** — The generated types were patched manually. If `pnpm run codegen` is run before the spec is updated, the `FernsProvenance` fix will be overwritten and the PhenologyTab/UniversalFqaPage errors will return. The codegen needs a spec update to match the v1 contract before it can be run safely. See follow-up task #192.
- **`provenance_verbosity` on the migrated routes** — These four routes now ignore `provenance_verbosity` because `buildEnvelope()` doesn't filter. If MCP consumers or other callers rely on verbosity filtering for these sources, that behavior is now gone. Confirm this is the intended direction.

---

## System Guidance Documents
Read these on demand — not every session. Each entry says when to open it.
- **`docs/data-layer-contract.md`** — Authoritative spec for the FERNS response envelope, pass-through rules, endpoint kinds, permission rules, companion website URL patterns, and the per-source architectural pattern. **Read when**: designing or modifying any API route, judging whether a response is correctly shaped, deciding whether something belongs in `data` vs the envelope, classifying an endpoint kind, or evaluating an audit finding. This is the document that "wins" if anything else contradicts it.
- **`docs/source-onboarding-playbook.md`** — The 14-step mandatory checklist for adding a new source, the Source Research Proposal template, the standards for `description` / `general_summary` / `technical_details`, the no-internal-TTL rule, the autonomy guidance, and the API Mirroring Checklist for parameter changes. **Read when**: adding a new source, modifying an existing source's metadata or description fields, or changing any query parameter (the API Mirroring Checklist covers spec → Zod → connector → MCP → Explorer in one place).
- **`docs/url-architecture.md`** — Decisions about domain structure (`ecologicalcommons.org` vs `data.ecologicalcommons.org`), why subdomain-per-product was rejected (ALA cautionary tale), how the single Express process routes by `Host` header in production, and the DNS setup the user must do manually. **Read when**: touching production routing, the api-server's static-serving block, deployment configuration, or anything that proposes a new subdomain or a new top-level URL surface.
- **`docs/vocabulary-disambiguation.md`** — Reference table for ecological metrics whose names are easily confused (C-value, Coefficient of Wetness, WIS, WUCOLS, the non-standard 1–10 wetness convention), with scales, authorities, and "what it is NOT" for each. **Read when**: writing or reviewing description fields that mention any coefficient, wetness, or water-use metric; building UI that displays these values; or judging whether a source's `technical_details` correctly disambiguates its own fields.
- **`docs/operational-notes.md`** — Dev-mode routing quirk (api-server proxies to the Astro dev server), the ecological-commons-site Astro structure, cache policy summary, Drizzle migration workflow and the `uniqueIndex` quirk, the TypeScript-declarations rebuild rule for `composite: true` packages, and the codegen command. **Read when**: debugging preview issues, changing a DB schema, hitting "no exported member" TS errors across packages, or running codegen.

