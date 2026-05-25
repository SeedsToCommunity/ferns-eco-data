## Source Onboarding Playbook

### Onboarding Checklist (Mandatory — do not skip steps)

Every step must be completed before a source is considered done. If a step is genuinely not applicable, state that explicitly with a reason. Do not silently omit steps.

**Step 1: Research (before any code)**
Independently read the source's website, documentation, and terms of service from primary sources. Identify: institution, coverage (geographic, taxonomic, data type), access method (API / scrape / static), permission status (check robots.txt and ToS), data freshness, known limitations, and overlap with any existing FERNS source. Do not rely on secondary descriptions or assumptions. Done when you can answer every field in the Source Research Proposal template.

**Step 2: Source Research Proposal (must be approved before any code is written)**
Write the proposal using the template below. Present it to the user in a single message. Wait for explicit written approval before proceeding. Done when the user has replied with explicit approval.

**Step 3: DB Schema** (required if source needs caching; otherwise explicitly note "no DB cache — data is static/in-memory")
Create a new Drizzle schema file in `lib/db/src/schema/`. Export the table(s) from `lib/db/src/schema/index.ts`. Run `pnpm --filter @workspace/db run generate` to create a migration file in `lib/db/drizzle/`, then `pnpm --filter @workspace/db run migrate` to apply it to the development database. Commit the generated migration file with the code change. Rebuild DB declarations: `cd lib/db && pnpm exec tsc -p tsconfig.json`. Done when the table exists in the database and is queryable.

**Step 4: Connector / Importer** (required if source needs data ingestion; not needed for direct-construction sources)
Implement data ingestion in `artifacts/api-server/src/services/{source-id}/`. Done when data is in the DB or loaded into memory. If skipped, state why.

**Step 5: Source Metadata and Registry Seed (DO NOT SKIP description quality)**
Create `artifacts/api-server/src/services/{source-id}/metadata.ts` with the source constants (SOURCE_ID, GENERAL_SUMMARY, TECHNICAL_DETAILS, REGISTRY_ENTRY, PERMISSION_GRANTED, PERMISSION_STATUS). Create `artifacts/api-server/src/services/{source-id}/seed.ts` that upserts into `fernsSourcesTable`. The three description fields (`description`, `general_summary`, `technical_details`) must conform to the standards defined below before this step is considered done. A source is not complete if any description field fails its audience test. Done when `GET /api/v1/sources` includes the new source with description fields that meet the defined standards.

**Step 6: Route Handler**
If the upstream source has multiple endpoints, create one FERNS route per upstream endpoint. Do not merge upstream responses. See 'data-layer-contract.md` `Pass-Through Rules`. Create `artifacts/api-server/src/routes/{source-id}.ts`. Implement `GET /api/{source-id}` (data endpoint) and `GET /api/{source-id}/metadata` (metadata endpoint). The metadata endpoint must return the same envelope shape as all existing sources — read `artifacts/api-server/src/routes/miflora.ts` before writing the new one. Register the router in `artifacts/api-server/src/index.ts`. Done when both endpoints return 200 with a correct envelope.

**Step 7: OpenAPI Spec**
Add the new endpoints to `lib/api-spec/openapi.yaml`. Follow existing path, parameter, response schema, and tag conventions. Done when the spec is valid and covers the new endpoints. All 

**Step 8: Spec Drift Check**
Run: `pnpm --filter @workspace/api-server run spec:check`. This script cross-checks every GET route in code against the spec and reports any gap in either direction. Done when the command exits 0 with no drift reported.

**Step 9: Codegen**
Run: `pnpm --filter @workspace/api-spec run codegen`. Done when generated types are updated and there are no TypeScript errors in consumer packages.

**Step 10: Explorer Page (NON-NEGOTIABLE — never skip, never defer)**
Create `artifacts/registry-explorer/src/pages/{SourceId}Page.tsx`. The page must include a working search form, result display, and provenance panel. Follow `NatureservePage.tsx` for layout and data-fetch patterns. Use `const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, ""); const API_BASE = \`${BASE_URL}/api\`` for all fetch calls. If this source shares a query interface with existing sources, use or extend the appropriate shared page component. Done when the explorer page renders real search results for at least one species name.

**Step 11: App.tsx Route Registration**
Add an explicit `<Route path="/source/{source-id}">` in `artifacts/registry-explorer/src/App.tsx` BEFORE the generic catch-all route. Done when navigating to `/source/{source-id}` renders the explorer page — not the generic fallback page.

**Step 12: Audit Tool Coverage (DO NOT SKIP — skipping requires explicit written justification)**
Add a comparator or health check in `lib/ferns-audit/src/`. For API/scrape sources: add a comparator that queries both the upstream source and the FERNS endpoint and diffs the result. For static sources: add a health check with known-value assertions. Done when the audit tool has coverage for the new source. If this step is skipped for any reason, write an explicit paragraph in the post-task summary stating exactly what coverage was omitted and why — a silent omission is a task failure.

**Step 13: Post-Task Summary**
Write all mandatory post-task summaries as expected by replit.md. Include the verbatim text of `description`, `general_summary`, and `technical_details` so the user can verify them. Done when the summary is complete and presented.

**Step 14: MCP Tool Wiring**
Add a new tool (or tools) to `artifacts/mcp-server/src/index.ts` for each new source endpoint. Follow the `{source_id}__{action}` naming convention (hyphens → underscores, double-underscore separator). One REST endpoint = one MCP tool; no aggregation. Define `inputSchema` covering all required and optional query parameters, matching the route handler in `artifacts/api-server/src/routes/{source-id}.ts`. For path-parameter endpoints, build the URL in the handler directly (e.g., `` fernsGet(`/lcscg/guide/${Number(args["guideId"])}`) ``). Update the tool table in `artifacts/mcp-server/README.md`. Done when `tools/list` on the MCP server includes the new tool(s) and the README table is up to date.

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

**Structure (required order)**:
1. **Accessible scope first** — what FERNS makes available from this source: what you can look up or retrieve, and the geographic or domain scope, stated in plain terms. This is the lead.
2. **Source identity second** — who publishes or maintains the data and what kind of authority it is (government agency, university herbarium, national nonprofit, nursery, etc.). One phrase or sentence, at the end.

**Length**: 1–3 sentences.

**Anti-patterns — do not include**:
- Technical method terms ("sitemap scrape", "API fetch", "ILIKE query", "DB cache")
- Botanical or scientific jargon without a plain-English translation
- "Adventive" used without definition — always write "introduced, non-native (adventive)" on first use within any description field
- "Taxonomic" as a descriptor — use "plant scientific name" or "species name" in plain language instead
- URLs
- Leading with source identity — accessible content always comes first
- Repeating the exact source name shown in the card label; the institution or authority name is fine and often important
- Repetition of information already visible in the source name or title

**Worked example (Woodland Sun)**:
> "Growing notes, ecological information, and nursery availability for roughly 970 native wildflowers, grasses, and sedges of the Midwest and Great Plains. From Woodland Sun Nursery, a leading native plant nursery and field reference resource for the region."

---

#### `general_summary`

**Audience**: A general user — a developer, a citizen science app builder, a data program coordinator, a domain analyst — deciding whether this source aligns with their use case and domain.

**Required content (all 7 points must be covered)**:
1. Who runs it and what institution it belongs to
2. What the data is: type, content, scope
3. Geographic and taxonomic coverage (specific — counts and regions)
4. How FERNS accesses the data, stated in plain language (not technical jargon)
5. What a query to FERNS returns: what fields, what shape — in plain English
6. How current the data is: live, cached, static, and what the refresh policy is
7. Known limitations: what this source does not cover, edge cases, accuracy concerns

**Length**: As many sentences as needed to cover all 7 points. Typically 3–6 sentences.

**Anti-patterns — do not include**:
- Omitting any of the 7 required points
- Technical implementation details: DB column names, SQL, URL patterns, exact parse logic
- Internal system terminology in point 4 (how FERNS accesses the data): "server memory", "JavaScript Map", "ILIKE", "cache key", "server restart" — describe caching in plain language only: "cached locally", "stored locally and reused for subsequent queries", "fetched live per request"
- Unexplained ecological or botanical terminology
- Vague non-statements ("provides data about plants", "contains useful information")

**Worked example (Woodland Sun)**:
> "Woodland Sun Nursery (Winona, Minnesota) is a leading native plant supplier for the Upper Midwest and Great Plains. Their website lists roughly 970 native species — wildflowers, grasses, sedges, ferns, and woody plants — with growing notes, ecological context, and nursery availability. FERNS imports Woodland Sun's full plant catalog periodically and stores it locally; when you query by scientific name, FERNS looks it up in that local index and returns a direct link to the Woodland Sun plant page if a match exists. The data reflects the time of the last import, not live nursery stock. Woodland Sun covers nursery availability and growing information only — it is not a scientific taxonomic source and does not include distribution data, nativity status, or conservation rankings."

---

#### `technical_details`

**Audience**: A graduate student, hardcore developer, botanist researcher, mathematician, or organizational data archivist who needs every technical and methodological detail without consulting any other document. This is the authoritative stop for everything precise.

**Required content (all 11 points must be covered)**:
1. Full institution name, URL, and any relevant legal, publication, or licensing context
2. Primary citation or authority: author, year, publication, if applicable
3. Exact access method: URL patterns, API endpoints, sitemap path, scraping strategy, parsing logic — include all edge cases and known exceptions
4. Scientific name inference or parsing logic, if applicable — document every rule and edge case
5. Database schema: table name(s), key columns, primary key, unique constraints, index strategy
6. Caching policy: what is cached, refresh strategy, cache invalidation behavior, what `?refresh=true` does if implemented — do not include specific TTL day values (see rule below)
7. Response normalization: what FERNS adds, changes, or omits relative to the upstream data; any field transformations
8. All coded or enumerated field values with their complete meaning (e.g. OBL = Obligate Wetland; C=10 = highest ecological fidelity to undisturbed habitat; W=−5 = most strongly wetland-affiliated)
9. Coverage: record count, geographic region, taxonomic scope, date range if relevant — always use specific numbers
10. Known limitations, edge cases, and accuracy concerns: taxonomy mismatches, missing coverage, encoding issues, unstable upstream identifiers
11. Any non-standard conventions used by the source: undocumented scales, idiosyncratic field names, publisher-specific coding

**Length**: As long as needed. Do not abbreviate to fit a length target. This field must be complete.

**Anti-patterns — do not include**:
- Omitting any of the 11 required points
- Vague coverage statements — always use specific record counts and geographic boundaries
- Unexplained coded values or abbreviations

**Worked example (Woodland Sun, excerpt)**:
> "Primary source: https://www.prairiemoon.com/sitemap.xml. Operator: Woodland Sun Nursery, Winona, MN (prairiemoon.com). Access method: sitemap_scrape. Sitemap parsed at import time; plant URLs filtered from root-level paths matching {genus}-{species}-{common-name-slug}, excluding /category/, /cart/, and /info/ paths (~970 plant URLs at last import). Scientific name inference from URL slug: genus = parts[0] capitalized; species = parts[1] lowercase; trinomial recognized when parts[2] is 'subsp' or 'var' (infraspecific epithet = parts[3]). DB table: botanical_species_lists (columns: id, site_id, scientific_name, url, imported_at; unique on (site_id, scientific_name)). Caching: full import on demand via POST /api/prairie-moon/import (admin-protected); no TTL; data is permanent until re-imported. FERNS returns: found (bool), species (inferred scientific name string), url (direct plant page URL string), validation_method = 'species_list_lookup', imported_at (timestamp). Lookup: ILIKE match on scientific_name column — case-insensitive, no fuzzy matching, exact binomial required. Known limitation: URL slug spelling may not match current accepted taxonomy (synonyms, older names not yet updated on the Woodland Sun site). Woodland Sun is a nursery catalog, not a scientific taxonomic authority. It does not provide distribution data, nativity status, conservation status, or C-values."

---

### Rule Applying to All Three Description Fields — No Internal Cache TTL Values

Do not include specific cache duration values (e.g. "30 days", "7 days", "90 days", "permanent") in `description`, `general_summary`, `technical_details`, or `update_frequency` text. Cache TTLs are implementation details defined in the code and can change without any change to the source's data or methodology. Hardcoding them in description fields creates silent drift when a TTL is adjusted.

**Use qualitative language instead:**
- In `technical_details`: `"Method: api_fetch. Results are cached between requests."`
- In `update_frequency`: describe only the upstream source's refresh cadence, not FERNS's caching interval. Examples:
  - `"Live — iNaturalist data is continuously updated by the global community."`
  - `"Live API. Backbone updated approximately annually. Occurrence index updated continuously."`
  - `"Static. Michigan Flora Online (2011) is a published reference work. Content does not change."`

The precise TTL for each cache entry lives in the source's `cache.ts` file and is the authoritative reference for cache duration.

---

### Autonomy Guidance

After the user approves the Source Research Proposal, execute all remaining checklist steps (Steps 3–14) autonomously. No interim check-ins are required or expected.

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

---

## API Mirroring Checklist

Every time a query parameter is added, removed, or has its type changed in `lib/api-spec/openapi.yaml`, all four layers below must be updated in the same task. Use this checklist to verify completeness.

### 1. OpenAPI spec (`lib/api-spec/openapi.yaml`)

- [ ] Parameter added/removed/changed in `parameters:` block of the affected endpoint(s)
- [ ] `type:` is correct (e.g. `string` for comma-separated IDs, not `integer`)
- [ ] `description:` explains accepted values (e.g. "Comma-separated iNaturalist place IDs (e.g. 2649 or 2649,986)")
- [ ] `required:` is set correctly
- [ ] `enum:` is present if the parameter has a fixed set of values

### 2. Zod codegen (`lib/api-zod/` and `lib/api-client-react/`)

- [ ] Run `pnpm --filter @workspace/api-spec run generate` after spec changes
- [ ] Verify generated Zod schemas in `lib/api-zod/src/generated/` reflect the new type
- [ ] Verify generated React Query hooks in `lib/api-client-react/src/generated/` accept the new type
- [ ] Note: the Orval coerce config (`orval.config.ts`) coerces `boolean` and `number` query params from strings — it does NOT coerce `string` params, so changing `integer` → `string` removes coercion for that param

### 3. API server connector (`artifacts/api-server/src/services/<source>/connector.ts`)

- [ ] The relevant params interface has the correct TypeScript type (e.g. `place_id?: string` not `place_id?: number`)
- [ ] Any function signature that takes the param as a positional argument is updated (e.g. `fetchObservationSummary(placeId: string | null, ...)`)
- [ ] Any `Number(params.place_id)` or `String(params.place_id)` coercions are consistent with the new type
- [ ] Route handler in `artifacts/api-server/src/routes/<source>.ts` passes the value through without incorrect coercion

### 4. MCP server (`artifacts/mcp-server/src/server.ts`)

- [ ] `inputSchema.properties.<param>.type` is updated (e.g. `"string"` not `"number"`)
- [ ] `inputSchema.properties.<param>.description` matches the spec description
- [ ] Handler call uses `String(args["<param>"])` for string params, `Number(...)` for number params
- [ ] Both the `inputSchema` block AND the `handler` call are updated — they are separate and both must change

### 5. Registry-Explorer UI (`artifacts/registry-explorer/src/components/`)

- [ ] Any `<input type="number">` for the param is changed to `<input type="text">` if the type is now `string` (to allow comma-separated values)
- [ ] Placeholder text updated to show comma-separated example (e.g. `"e.g. 2649 or 2649,986"`)
- [ ] Any `Number(inputValue.trim())` coercion before passing to the API is removed (pass the string directly)
- [ ] Hardcoded example values in "Try:" buttons are strings, not numeric literals (e.g. `placeId: "2649"` not `placeId: 2649`)
- [ ] State variable types match the new param type (e.g. `useState<string | undefined>` not `useState<number | undefined>`)

## Summary

Complete every step on the mandatory checklist. Research the source independently from primary sources. Produce a Source Research Proposal and present it to the user for review before writing any code. Do not begin implementation until the proposal is explicitly approved. After approval, execute all remaining steps autonomously — no interim check-ins unless a genuinely novel architectural decision arises that is not covered by this document.
