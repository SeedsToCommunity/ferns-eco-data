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

## Post-Task Summary — Envelope Migration: Michigan Flora

### 1. What was built

All seven Michigan Flora API routes were migrated from manually assembled response objects to the shared `buildEnvelope()` function, bringing them into full compliance with the FERNS Response Envelope Contract v1. Before this task, the routes returned flat JSON with ad-hoc provenance fields. After this task, every Michigan Flora response carries a standardized envelope with `found`, `permission_granted`, `pagination`, and a `provenance` block containing `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `derived_from`, `license`, and `rights`. Four new columns were added to the Michigan Flora registry entry — `license`, `rights`, `website_url_patterns`, and `non_passthrough_endpoints` — and the seed upsert was updated to write them. The `spec_text` route correctly declares `permission_granted: false` (it is classified as `scraped_text` in `non_passthrough_endpoints`). The `metadata` route uses `sourceKind: "in-memory"`. All five data routes use `sourceKind: "single-source-proxy"` with `provenance.source_url` set to the upstream API endpoint URL and `provenance.queried_at` set to the original fetch time from `fetched_at` — not the serve time. The Explorer page was updated to read `provenance.source_url` rather than a top-level field. Two MCP tool descriptions were updated to reflect the most significant behavioral changes (`spec_text` permission, `pimage_info` data nesting). The audit comparator was updated with an `assertEnvelopeShape()` helper applied to all six comparator functions.

### 2. Derivation summary

Not applicable — no new data source was added. This was a structural migration of an existing source.

### 3. Scientific/technical description

Not applicable — no new `general_summary` or `technical_details` text was authored. The existing descriptions were preserved.

### 4. Architectural decisions made

- **`provenance.source_url` = upstream API URL, not the species page URL.** Each cache row stores two URL columns: `upstream_url` (the actual API call, e.g. `https://michiganflora.net/api/v1.0/locs_sp?id=1383`) and `source_url` (the human-readable species page, e.g. `https://michiganflora.net/species/1383`). The envelope's `provenance.source_url` is mapped from `upstream_url` — the literal URL FERNS contacted — per the contract's definition. The species page URL is accessible via the `website_url_patterns` registry entry (`species_page: "https://michiganflora.net/species/{plant_id}"`).

- **`provenance.queried_at` on cache hits = original fetch time, not serve time.** The contract requires "the moment the cached copy was originally fetched (not served), so the consumer can judge data age." This is read from the `fetched_at` column on each cache row. For fresh fetches it is read from the stored row's `fetched_at` (set at insert time). The `metadata` route uses `new Date()` because it is `in-memory` / computed.

- **`image_url` and `thumbnail_url` remain in `data` — pending user decision.** These fields are FERNS-constructed (built from a formula reverse-engineered from the Michigan Flora frontend, not returned verbatim by the upstream API). The contract's governing rule states "FERNS adds nothing to `data`." Keeping them in `data` is a contract violation. The task instruction said to keep them there because the Explorer gallery depends on them. This conflict was not resolved — it requires a user decision (see section 6).

- **`non_passthrough_endpoints` includes both `/metadata` (kind: `metadata`) and `/spec_text` (kind: `scraped_text`).** All other Michigan Flora routes are `passthrough` by default — they mirror exact upstream paths verbatim.

### 5. What was NOT done

- **`image_url` / `thumbnail_url` not moved out of `data`.** These FERNS-constructed fields remain inside `data.image`, which violates the contract. The correct location would be derivable from `website_url_patterns` at the application layer. Not changed pending user decision.
- **Generated API types (`lib/api-zod`, `lib/api-client-react`) not regenerated.** The Explorer page uses `as unknown as` type casts to work around the mismatch. Tracked as follow-up task #195.
- **OpenAPI spec not updated** for the new envelope response shape on Michigan Flora routes. Tracked as part of follow-up task #195.
- **Audit run configuration not added.** The comparator has envelope assertions but no automated end-to-end audit run exercises them. Tracked as follow-up task #196.

### 6. What the user should decide or review

- **`image_url` / `thumbnail_url` placement.** The contract says FERNS must not inject generated fields into `data`. These two fields are FERNS-constructed (the upstream returns only raw `image_id` and `plant_id`; FERNS builds the full URL). The options are: (a) remove them from `data`, update the Explorer to construct the URL from `website_url_patterns` templates and the raw IDs — contract-compliant; or (b) record the current behavior as an explicit approved exception in `docs/data-layer-contract.md` under "Approved Exceptions" with a stated rationale. Either is fine, but a decision is needed so the audit tool and future work can be consistent.

---

## Post-Task Summary — Michigan Flora: Move Image URL Construction to Client

### 1. What was built

The Michigan Flora API routes no longer construct image URLs. Previously, the server was building two fields — `image_url` and `thumbnail_url` — for every image record before storing and returning it. Those URLs were invented by FERNS using a formula reverse-engineered from the Michigan Flora website frontend, not returned by the upstream API itself. The contract governing FERNS says the `data` field in any response must contain only what the upstream source actually returned — FERNS is not allowed to add generated fields. So those two constructed fields were removed from the server entirely. Instead, the Michigan Flora registry entry already contains `website_url_patterns` with the two URL templates (`image_full` and `image_thumbnail`), and the Explorer page now constructs image URLs on the client side from the raw `image_id` and `plant_id` values that the upstream does return. The photo gallery and the primary species image both render correctly using this approach. The audit comparator was updated to check that `image_id` is present in image records (which it now verifies is the raw upstream value) rather than checking for the former constructed URLs.

### 2. Derivation summary

Not applicable — no new data source was added.

### 3. Scientific/technical description

Not applicable — no new `general_summary` or `technical_details` text was authored. The `technical_details` text for Michigan Flora was updated to replace the sentence that said "records are enriched at serve time with constructed image_url and thumbnail_url fields" with a corrected sentence documenting that image URLs are constructed client-side from the `website_url_patterns` templates.

### 4. Architectural decisions made

- **URL construction belongs at the consumer layer, not the data layer.** The Michigan Flora upstream API returns `image_id` and the query uses a known `plant_id`. The formula to produce a full image URL is `https://michiganflora.net/static/species_images/_pid_{plant_id}/{image_id}.jpg`. That formula lives in the `website_url_patterns` registry entry (`image_full` and `image_thumbnail`). Any consumer — the Explorer, an MCP client, an application layer — can apply it. FERNS's job is to faithfully pass through what upstream returned; URL construction is interpretation, which belongs above the data layer.

- **`plantId` for gallery images comes from `floraRes.data.plant_id`, not from the images endpoint.** The `allimage_info` response contains an array of image records, each with an `image_id` but no `plant_id` per-record. The `plant_id` is species-level and already available in the `flora_search_sp` response. The `ImageGallery` component now accepts a `plantId` prop. For the primary image (`pimage_info`), the `plant_id` is the query parameter and is also stored in `data.plant_id` in the response.

- **Stale cache entries with the old shape are harmless.** Old cached rows in the database still have `image_url` and `thumbnail_url` inside their `raw_response` JSON. The API server now returns those stale rows as-is on cache hits (since `raw_response` is passed through verbatim). A forced `?refresh=true` produces the new clean shape. This is acceptable because the extra fields are ignored by the updated Explorer and comparator, and they will naturally age out as cache entries are refreshed.

### 5. What was NOT done

- **Stale cache entries not migrated.** A one-time SQL update to remove `image_url`/`thumbnail_url` from existing `raw_response` JSON in the database was not run. Old cache hits will still include those fields in `data` until the cache entry is refreshed. This is benign but creates inconsistency between cache-hit and cache-miss response shapes temporarily.
- **`website_url_patterns` not exposed via a dedicated API endpoint.** Consumers must currently fetch the registry entry to get the URL templates. A convenience endpoint like `/api/miflora/url_patterns` was not added.
- **MCP tool descriptions not updated** for the image URL change. The MCP tool descriptions for `miflora__allimage_info` and `miflora__pimage_info` were not re-worded to note that `image_url`/`thumbnail_url` are no longer in data. Tracked as part of follow-up task #195.

### 6. What the user should decide or review

- **Stale cache migration.** If clean, consistent response shapes are important right now (e.g. for a downstream consumer that would break on unexpected extra fields), run a one-time SQL update to strip `image_url` and `thumbnail_url` from the `raw_response` JSONB columns in `miflora_images_cache` and `miflora_species_cache`. Otherwise the inconsistency resolves itself over time as entries are refreshed.
- **MCP descriptions.** The two MCP image tool descriptions still describe the old shape. This is low-priority but should be updated as part of #195 when generated types are regenerated.

---

## System Guidance Documents
Read these on demand — not every session. Each entry says when to open it.
- **`docs/data-layer-contract.md`** — Authoritative spec for the FERNS response envelope, pass-through rules, endpoint kinds, permission rules, companion website URL patterns, and the per-source architectural pattern. **Read when**: designing or modifying any API route, judging whether a response is correctly shaped, deciding whether something belongs in `data` vs the envelope, classifying an endpoint kind, or evaluating an audit finding. This is the document that "wins" if anything else contradicts it.
- **`docs/source-onboarding-playbook.md`** — The 14-step mandatory checklist for adding a new source, the Source Research Proposal template, the standards for `description` / `general_summary` / `technical_details`, the no-internal-TTL rule, the autonomy guidance, and the API Mirroring Checklist for parameter changes. **Read when**: adding a new source, modifying an existing source's metadata or description fields, or changing any query parameter (the API Mirroring Checklist covers spec → Zod → connector → MCP → Explorer in one place).
- **`docs/url-architecture.md`** — Decisions about domain structure (`ecologicalcommons.org` vs `data.ecologicalcommons.org`), why subdomain-per-product was rejected (ALA cautionary tale), how the single Express process routes by `Host` header in production, and the DNS setup the user must do manually. **Read when**: touching production routing, the api-server's static-serving block, deployment configuration, or anything that proposes a new subdomain or a new top-level URL surface.
- **`docs/vocabulary-disambiguation.md`** — Reference table for ecological metrics whose names are easily confused (C-value, Coefficient of Wetness, WIS, WUCOLS, the non-standard 1–10 wetness convention), with scales, authorities, and "what it is NOT" for each. **Read when**: writing or reviewing description fields that mention any coefficient, wetness, or water-use metric; building UI that displays these values; or judging whether a source's `technical_details` correctly disambiguates its own fields.
- **`docs/operational-notes.md`** — Dev-mode routing quirk (api-server proxies to the Astro dev server), the ecological-commons-site Astro structure, cache policy summary, Drizzle migration workflow and the `uniqueIndex` quirk, the TypeScript-declarations rebuild rule for `composite: true` packages, and the codegen command. **Read when**: debugging preview issues, changing a DB schema, hitting "no exported member" TS errors across packages, or running codegen.

