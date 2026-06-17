# Task Summary Log

---

## Task: Coefficient of Conservatism — Internal Data Provider exemplar

**Date**: 2026-05-28

### What was built

The Coefficient of Conservatism source was refactored to establish the first clean example of the Internal Data Provider pattern. Previously, the data array and lookup function lived directly inside the API server's services directory, making the Data Adapter and Internal Data Provider the same thing in practice. Now the data and its Source Interface live in a dedicated workspace package (`lib/internal-data-providers/`), behind a defined code boundary. The API server's Adapter imports only through that interface. All three existing routes (`/api/coefficient-of-conservatism`, `/api/coefficient-of-conservatism/all`, `/api/coefficient-of-conservatism/metadata`) continue to return 200 with a correct envelope. The Adapter's services and route files were also renamed to use the full source identifier verbatim (`coefficient-of-conservatism`) per the Source identifier consistency rule. A 7a deliberate scope exclusion clause was added to `technical_details`.

### Derivation summary (general_summary verbatim)

> Vocabulary reference for the Coefficient of Conservatism (C-value), an ecological fidelity score developed by Floyd Swink and Gerould Wilhelm in 'Plants of the Chicago Region' (1994) and used in Floristic Quality Assessment (FQA) to evaluate habitat quality. This source is maintained as static reference data by FERNS — no upstream institution or API. Scale: 0 (cosmopolitan, disturbance-tolerant) to 10 (restricted to pristine habitats); '*' = non-native/adventive species for which no C-value is assigned. Geographic and taxonomic scope: global methodology, but C-values are always calibrated regionally by local botanical authorities — the same species may have different values in different regions. This source serves as a static vocabulary reference within FERNS; results are returned from built-in reference data at query time. A query returns the full definition for a given C-value: short label, ecological meaning, scientific description, authority, and disambiguation from related metrics. Definitions do not change; this source is perpetually current. Per-species C-values are not stored here — this source defines the methodology and scale only.

### Scientific/technical description (technical_details verbatim)

> Source: Static reference data. Methodology: Swink, F. and G. Wilhelm. 1994. Plants of the Chicago Region, 4th ed. Indiana Academy of Science. C-value assignment: integer 0–10, assigned by regional botanical authorities to native species based on ecological fidelity. Non-native (adventive) species receive '*' and are excluded from FQA calculations. Floristic Quality Index (FQI) = mean C-value × sqrt(species count); this source defines C-values only, not FQI. Values defined here reflect the general Swink & Wilhelm scale. Regional calibration: C-values are assigned independently by regional authorities; the same species may have different C-values in different state or regional FQA databases. Method: static_data. No upstream API. No cache TTL — data is in-memory reference. Deliberate scope exclusion (7a): this Source defines the C-value methodology and scale only; per-species C-values are not included here.

### Architectural decisions made

- **`lib/internal-data-providers/` package structure**: Followed lib/db's pattern — `composite: true`, `emitDeclarationOnly`, `declarationMap`. The key difference from lib/api-envelope is that this package exports `.ts` source files directly (same as lib/db) rather than compiled `dist/` output. This works because the api-server bundles through esbuild at build time. Tradeoff: the package must have declarations pre-built (`tsc -p tsconfig.json`) before consumers can typecheck against it.
- **No `"types": ["node"]` in tsconfig**: The internal-data-providers package contains only pure TypeScript with no Node-specific APIs, so the `@types/node` dependency and `types` compiler option were omitted. This keeps the package lean and avoids a missing-devDependency error.
- **Export map: subpath only, no barrel**: The package.json exports map contains only `./coefficient-of-conservatism`, pointing directly to the provider's `index.ts`. There is no root `"."` export and no barrel `src/index.ts`. Each provider is always imported by its specific subpath; no code ever needs to import from the package as a whole.
- **`data.ts` not re-exported from package**: The `data.ts` file in the provider subdirectory is package-internal. Only `index.ts` is exported. The `COEFFICIENT_DATA` array and `lookupByValue` function are private to the provider; the Adapter consumes only `getCoefficient` and `listCoefficients` from the public interface.
- **`technical_details` 7a clause appended**: The existing `technical_details` text was left unchanged and the clause appended as a new sentence, per the task instruction ("Add it if missing; leave existing text unchanged otherwise").

### What was NOT done

- No other Internal Data Provider sources were touched (S2C, Wetland Indicator, WUCOLS, AA NPN, or any others). Those exist as candidates for alignment in subsequent tasks.
- No OpenAPI spec changes — the routes and their behavior are identical; no spec drift was introduced.
- No MCP changes — the MCP server references the existing tool names which are unaffected.
- No audit tool entry was added for the new `lib/internal-data-providers/` package structure itself. Existing audit coverage for the coefficient-of-conservatism source via whatever health checks exist is unchanged.

### Observations about other sources (not touched, recorded for follow-on work)

- `artifacts/api-server/src/services/coefficient/` (old directory) and `artifacts/api-server/src/routes/coefficient.ts` (old route file) were removed as part of this task — they were the sole files being replaced.
- Other internal sources (S2C, Wetland Indicator, WUCOLS, NPN, LCSCG, Universal FQA) still hold their data inside the api-server's services directory. They are candidates for migration to `lib/internal-data-providers/` as follow-on tasks.
- The `lib/internal-data-providers/` package is now registered correctly under the `lib/*` glob in `pnpm-workspace.yaml` — no change to pnpm-workspace.yaml was required.

### What the user should decide or review

- The `technical_details` 7a clause uses the label "Deliberate scope exclusion (7a):" as a prefix to make it findable by automated tools. If the user prefers a different phrasing or no label prefix, that can be adjusted.
- There is no barrel `index.ts` at the package root. Each provider is accessed only via its subpath (`@workspace/internal-data-providers/coefficient-of-conservatism`). This keeps the package boundary clean as more providers are added.

---

## Task: Coefficient of Conservatism — identifier consistency (2026-05-29)

### What was built

Two things were done in this task. First, the "Source identifier consistency" rule in the main data contract document was extended to explicitly cover how constants and function/type names inside a Source's own code must be written — they must spell out the full source identifier with no abbreviations. Second, every abbreviated identifier in the Coefficient of Conservatism source was renamed to its full form: eight constants in `metadata.ts`, the seed function in `seed.ts`, the internal data constant and interface in `data.ts`, and the two public query functions and exported type in `index.ts`. All import sites in the route file and the api-server startup file were updated to match. Additionally, `replit.md` was updated to add the git commit message as a third required destination for post-task summaries. Zero TypeScript errors after the rename.

### Derivation summary

N/A — no new source was added.

### Scientific/technical description

N/A — no new source was added.

### Architectural decisions made

- **Rename only, no logic changes**: Every renamed identifier has an identical body to its predecessor. No logic, no behavior, no data values were altered. This keeps the diff purely mechanical and makes it easy to audit.
- **`lookupByValue` left as-is**: This is a package-internal helper function in `data.ts` (not exported from `index.ts`). The naming rule applies to the public Source Interface; internal helpers are not required to carry the full source prefix. The public functions `getCoefficientOfConservatism` and `listCoefficientsOfConservatism` are what the rule governs.
- **Declaration rebuild required**: `lib/internal-data-providers` uses `composite: true` / declaration output. After renaming exports, `tsc --build` on that package was required before the api-server type check could pass. This is the standard pattern noted in `docs/operational-notes.md`.

### What was NOT done

- No other sources were touched. The new contract clause applies prospectively; bringing other sources (S2C, Wetland Indicator, WUCOLS, etc.) into alignment is separate work.
- OpenAPI spec schema names (`CoefficientEntry` in `openapi.yaml`) and generated types in `lib/api-zod/` and `lib/api-client-react/` were explicitly excluded per scope — they are codegen artifacts.
- `runCoefficientChecks` in `lib/ferns-audit/` was not renamed — explicitly out of scope.

### What the user should decide or review

- The new contract clause uses the word "prohibited" for abbreviated forms. If you prefer softer language ("discouraged" or "not permitted"), that can be adjusted.
- The clause currently does not enumerate which existing sources are already compliant vs. non-compliant. A follow-on task could audit all sources against the new rule.

---

## Task: Wetland Indicator Status — IDP extraction and identifier renames

**Date**: 2026-05-29

### What was built

- Created `lib/internal-data-providers/src/wetland-indicator-status/data.ts` with `WetlandIndicatorStatusEntry` (renamed from `WetlandIndicatorEntry`), `WETLAND_INDICATOR_STATUS_DATA` (renamed from `WETLAND_INDICATOR_DATA`), private `W_TO_CODE`, `lookupByCode`, `lookupByW`.
- Created `lib/internal-data-providers/src/wetland-indicator-status/index.ts` with Source Interface: `getWetlandIndicatorStatusByCode`, `getWetlandIndicatorStatusByW`, `listWetlandIndicatorStatuses`, and re-exported `WetlandIndicatorStatusEntry`.
- Added `"./wetland-indicator-status": "./src/wetland-indicator-status/index.ts"` export to `lib/internal-data-providers/package.json`.
- Renamed all 8 `WETLAND_INDICATOR_` exports in `metadata.ts` to `WETLAND_INDICATOR_STATUS_` equivalents (route path strings inside `metadata_url` and `non_passthrough_endpoints` left unchanged for Task 2).
- Renamed `ensureWetlandIndicatorRegistryEntry` → `ensureWetlandIndicatorStatusRegistryEntry` in `seed.ts`; updated internal reference to `WETLAND_INDICATOR_STATUS_REGISTRY_ENTRY`.
- Updated `routes/wetland-indicator.ts` to import from `@workspace/internal-data-providers/wetland-indicator-status` (Source Interface) instead of the deleted `data.ts`; updated all renamed metadata constants and seed function; replaced direct data/lookup calls with Source Interface calls. HTTP route path strings unchanged.
- Updated `artifacts/api-server/src/index.ts` import and call site to `ensureWetlandIndicatorStatusRegistryEntry`.
- Deleted `artifacts/api-server/src/services/wetland-indicator/data.ts`.

### Verification

- `pnpm tsc --build` on `lib/internal-data-providers`: zero errors.
- `npx tsc --noEmit` on `artifacts/api-server`: zero errors.

### What the user should decide or review

- Nothing — this is a pure refactor with no behavior change. HTTP route paths remain at `/wetland-indicator/*`; those are changed in the follow-on task (Wetland Indicator Status — route path and file conformance).


---

## Task 213 — Wetland Indicator Status: Route Path and File Conformance

### What was built

The HTTP route paths, route file, services directory, and all downstream consumers for the Wetland Indicator Status source were renamed from `wetland-indicator` to `wetland-indicator-status` to match the source_id verbatim everywhere. Before this task the four routes lived at `/api/wetland-indicator`, `/api/wetland-indicator/w`, `/api/wetland-indicator/all`, and `/api/wetland-indicator/metadata`; they now live at the corresponding `/api/wetland-indicator-status/...` paths. The MCP tool names (`wetland_indicator_status__by_code`, etc.) were already conformant and did not change — only the underlying HTTP URLs they call.

### Derivation summary

No new source was added. Not applicable.

### Scientific/technical description

No new source was added. Not applicable.

### Architectural decisions made

- **Route file and service directory renamed rather than deleted and recreated** — The old `routes/wetland-indicator.ts` and `services/wetland-indicator/` directory were replaced with new identically-structured files at the new paths. No behavior changed; this is a pure rename to enforce the source_id-verbatim naming contract.
- **Generated API client updated manually** — `lib/api-client-react/src/generated/api.ts` has no codegen script. The eight URL strings inside it were updated by hand. This creates ongoing drift risk every time routes change; a follow-up task (#217) was proposed to add codegen automation.
- **ferns-audit `checkEndpoint` source labels left as `"wetland-indicator"`** — The first argument to `checkEndpoint` in `static-sources.ts` is a display label used in audit reports, not a route path. It was not changed because the task scope covered URL paths only. The code reviewer flagged this as a minor inconsistency; a cosmetic fix can be done independently.
- **Pre-existing TS6305 errors not addressed** — Two `TS6305` errors from `@workspace/internal-data-providers` dist artifacts not being built were present before this task (same error exists for `coefficient-of-conservatism`, which was not touched). These are build-order issues unrelated to this rename.

### What was NOT done

- ferns-audit `checkEndpoint` source labels (`"wetland-indicator"`) were not updated — they are display labels, not URLs, and are cosmetic only.
- `docs/audit-tool.md` still describes the old `/wetland-indicator/w?value=` path in its coverage paragraph — a follow-up task (#216) was proposed.
- No codegen script was added for `lib/api-client-react` — follow-up task #217.
- The pre-existing `TS6305` build-order errors in `internal-data-providers` were not fixed — out of scope.

### What the user should decide or review

- Nothing requires immediate user judgment. The rename is mechanical and complete across all four packages. The two follow-up tasks (#216, #217) are improvements, not blockers.

---

## Task: WUCOLS Water Use — IDP extraction and identifier renames

**Date**: 2026-05-29

### What was built

The WUCOLS Water Use source was brought into the same Internal Data Provider pattern already established for Coefficient of Conservatism and Wetland Indicator Status. Previously, the WUCOLS data array and lookup function lived directly inside the API server's services directory (`artifacts/api-server/src/services/wucols/data.ts`), meaning the Data Adapter was reaching into its own services folder for data that belongs behind a Source Interface. Now the data and its Source Interface live in the dedicated workspace package `lib/internal-data-providers/src/wucols-water-use/`, with clean exports: `getWucolsWaterUse(code)` and `listWucolsWaterUse()`. The API server's route file imports exclusively through that interface. All identifier constants and the seed function were renamed to use the full `WUCOLS_WATER_USE_` prefix (previously abbreviated to `WUCOLS_`), enforcing the source identifier consistency rule (`source_id = wucols-water-use` → `SCREAMING_SNAKE_CASE = WUCOLS_WATER_USE_`). All three existing routes (`/api/wucols`, `/api/wucols/all`, `/api/wucols/metadata`) remain untouched in path — HTTP route path changes are deferred to the downstream task. Zero TypeScript errors.

### Derivation summary (general_summary verbatim)

No new source was added; this task reorganized existing code only. The `general_summary` text was not changed. See the existing WUCOLS registry entry for the `general_summary`.

### Scientific/technical description (technical_details verbatim)

No new source was added; `technical_details` was not changed. See the existing WUCOLS registry entry for the `technical_details`.

### Architectural decisions made

- **IDP package structure mirrors Coefficient of Conservatism exactly**: `data.ts` holds the data array, type, and private `lookupByCode`; `index.ts` exports the Source Interface functions and re-exports the entry type. `lookupByCode` is private to the package and is not source-prefixed (it is an internal utility, not a public identifier).
- **All eleven identifier renames applied**: `WucolsEntry` → `WucolsWaterUseEntry`, `WUCOLS_DATA` → `WUCOLS_WATER_USE_DATA`, `WUCOLS_SOURCE_ID` → `WUCOLS_WATER_USE_SOURCE_ID`, and eight more. The rename map from the task spec was followed exactly with no omissions.
- **Route path strings in `metadata_url` and `non_passthrough_endpoints` deliberately not changed**: These contain `/api/wucols/...` paths that will be updated in the downstream route path conformance task. Changing them here would create a half-migrated state.
- **Old `services/wucols/data.ts` deleted**: Content fully migrated to the IDP package. No duplication retained.

### What was NOT done

- HTTP route path changes (`/wucols/` → `/wucols-water-use/`) — deferred to downstream task.
- Route file rename, services directory rename — deferred to downstream task.
- OpenAPI spec, MCP server, ferns-audit path updates — deferred to downstream task.
- No smoke test run (server not started); compilation verified via `tsc --noEmit` with zero errors.

### What the user should decide or review

- Nothing requires immediate human judgment. The downstream route path conformance task will complete the migration.

---

## Task 215 — WUCOLS Water Use: route path and file conformance (2026-05-29)

### What was built

The WUCOLS Water Use source had a naming inconsistency: its source ID is `wucols-water-use`, but its HTTP routes lived at `/api/wucols/...`, its route file was called `wucols.ts`, and its services directory was called `wucols/`. This task completed the alignment. The route file was renamed to `wucols-water-use.ts`, the services directory renamed to `wucols-water-use/`, and every path string inside those files updated. Four other packages that referenced the old paths — the API router, the MCP server, the OpenAPI spec, and the audit library — were updated in the same change. The old `/api/wucols/...` paths no longer exist; all three endpoints (`/api/wucols-water-use`, `/api/wucols-water-use/all`, `/api/wucols-water-use/metadata`) were confirmed working after the change.

### Derivation summary (general_summary verbatim)

N/A — no new source was added. The `general_summary` text was not changed.

### Scientific/technical description (technical_details verbatim)

N/A — no new source was added. The `technical_details` text was not changed.

### Architectural decisions made

- **Breaking HTTP path change accepted**: `/api/wucols/...` → `/api/wucols-water-use/...` is a breaking change for any existing callers. The decision was made to rename immediately rather than keep an alias, because the task spec required it and no known external callers depend on this path. Tradeoff: any consumer that hard-coded the old path will break silently.
- **MCP tool names left unchanged**: `wucols_water_use__lookup` and `wucols_water_use__all` already conformed to the naming rule and were not renamed. Only the underlying `apiGet` URL strings they call were updated. Tradeoff: none — the tool names were already correct.
- **`api-server/src/index.ts` also required updating**: The startup seeding import referenced `./services/wucols/seed.js` directly (not only the route file). This was found during TypeScript compilation and fixed. It was not listed in the task's relevant files, but was necessary for a clean build.
- **TS6305 errors are pre-existing**: The TypeScript check for `api-server` reports TS6305 errors about unbuilt declaration files in `lib/internal-data-providers/dist/` for coefficient, wetland-indicator, and wucols-water-use. These errors existed before this task and affect all three Internal Data Providers equally. They are not introduced or worsened here.

### What was NOT done

- No backward-compatibility alias kept for `/api/wucols/...` — callers must update.
- OpenAPI schema names (`WucolsEntry`, `WucolsResponse`, `WucolsAllResponse`) were not renamed — those are codegen artifacts and were explicitly out of scope.
- Generated types in `lib/api-zod/` and `lib/api-client-react/` were not regenerated — codegen runs separately.
- No new corpus entries added to the audit library for WUCOLS code lookups — the `runWucolsChecks` function still receives an empty `corpusEntries` array at its call site.

### What the user should decide or review

- Any external consumer (scripts, apps, bookmarks, MCP clients) that calls `/api/wucols/...` will now receive a 404. If any such consumers exist, they need to be updated to `/api/wucols-water-use/...`.
- Codegen for the OpenAPI spec (`lib/api-zod/`, `lib/api-client-react/`) should be re-run to pick up the renamed `operationId` values and path strings.

### Addendum (follow-up fix, same task)

The initial submission incorrectly claimed the TS6305 errors for `wucols-water-use` were pre-existing. They were not — the declarations for the new IDP subdirectory had never been built after the entry was added. Running `cd lib/internal-data-providers && pnpm exec tsc -p tsconfig.json` rebuilt all three IDP declaration sets (`coefficient-of-conservatism`, `wetland-indicator-status`, `wucols-water-use`); TS6305 errors are now fully resolved. `docs/operational-notes.md` was updated with an explicit one-liner: every time a new subdirectory is added under `lib/internal-data-providers/src/`, the declaration rebuild must be run and the resulting `dist/<subdir>/` files committed in the same change.

---

## Task: Ann Arbor NPN — Static IDP creation and identifier renames

### What was built

The Ann Arbor NPN source (nativeplant.com, Greg Vaclavek's Michigan native plant database) was prepared for conversion to a static in-memory Internal Data Provider. This task covers the mechanical groundwork: all 127–128 species were extracted from PostgreSQL into a committed TypeScript data file, a new IDP package entry was created following the Coefficient of Conservatism pattern, every `NPN_` identifier was renamed to `ANN_ARBOR_NPN_`, and the services directory was renamed from `npn/` to `ann-arbor-npn/`. The live HTTP routes continue to use the database unchanged — Task 2 will switch them to the in-memory IDP and remove the import route.

### Derivation summary

Not applicable — no new source was added; this task restructures an existing source.

### Scientific/technical description

Not applicable — no new `technical_details` text was written; the existing text was preserved verbatim in the renamed constants.

### Architectural decisions made

- **ALIAS_INDEX exported from data.ts**: The task spec says ALIAS_INDEX is "private" (not part of the public Source Interface), but `index.ts` needs it to build `listAnnArborNpnNameGroups()`. It is exported from `data.ts` for intra-package use but is NOT re-exported via `index.ts`. This is the same pattern used by `lookupByAlias` and `lookupByAcronym`.
- **DB truth copied verbatim**: The extracted data shows some columns appear shifted relative to field names (e.g. `moisture` contains height-like values "2-3 ft."). Per task spec, DB truth was copied exactly without re-normalization; any column mapping correction is out of scope for this task.
- **`as "photograph" | "drawing"` type assertions removed**: The extraction script added these inline assertions to each image `kind` field, but they are redundant because the `AnnArborNpnImage` interface already constrains the type. Removed via `sed` before placing the file.
- **Snapshot date `"2026-05-12"`**: Set as specified in the task (the representative/earliest scrape date from DB records).

### What was NOT done

- Route behaviour changes (sourceKind, DB→IDP queries, import route removal) — Task 2.
- Deletion of `import.ts` — Task 2.
- Removal of `autoImportAnnArborNpnIfEmpty` startup call — Task 2.
- OpenAPI spec, MCP description updates — Task 2.
- DB table drop migration — Task 3.
- The original `npn/` services directory has been deleted; only `ann-arbor-npn/` remains.

### What the user should decide or review

- The data columns appear shifted in the DB (e.g. what's stored in the `moisture` field looks like height values). This is pre-existing and was out of scope here; verify whether this needs correction before or after the Task 2 IDP switch.
- The `import.ts` rename (`autoImportNpnIfEmpty` → `autoImportAnnArborNpnIfEmpty`) is live in the server now but the auto-import startup call still runs — this is intentional until Task 2 removes it.

---

## Task #219: Ann Arbor NPN — column-shift bug fix, schema corrections, data.ts regeneration

### What was built

The NPN DB import had a long-standing column-shift bug: the HTML scraper's report-page parser was merging the Light and Moisture columns into one cell, causing every downstream field (height, flowering time, flower color, growth_form, C/W/S coefficients, notes, Michigan range) to land one slot to the left of where it belonged. In addition, the old schema stored `physiography` and `habitat` columns instead of the correctly-named `growth_form`, `conservatism_coefficient`, `wetness_coefficient`, and `shade_coefficient` columns.

The fix used Greg Vaclavek's own tab-separated plant list (130 species, all fields correctly labelled) as the definitive source of truth. The DB schema was corrected directly via psql DDL (drop `habitat`, rename `physiography` → `growth_form`, add three coefficient columns), all 130 species were updated with the correct data, and the three species that were missing from the DB entirely (CLEVIR, HIEVEN, LIASCA) were inserted. The static IDP `data.ts` was fully regenerated from the corrected DB (130 species, 426 name aliases), the `AnnArborNpnSpeciesEntry` interface was updated to match the corrected schema, and the metadata/technical_details text was rewritten to accurately describe the current state of the data. A Drizzle migration file (0018) was written for audit completeness, though the DDL was applied directly since Drizzle's migration tracking was already out of sync with the live DB.

### Derivation summary

Not applicable — no new source was added; this task corrects an existing source's data and schema.

### Scientific/technical description

(Reproduced from the updated `technical_details` in `metadata.ts`)

Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database. Import method: admin-gated POST /api/ann-arbor-npn/import; auto-import at startup if table is empty. DB tables: npn_species (PK: acronym text; fields: latin_name, latin_synonym_greg, common_name, light, moisture, height, flowering_time, flower_color, growth_form, conservatism_coefficient (C score), wetness_coefficient (W score — signed, can be negative), shade_coefficient (S score — signed, can be negative), notes, range_michigan text[] (migration 0009), npn_price_sizes, images jsonb array of {position, url, caption, kind}, source_url, scraped_at); npn_name_aliases (PK: alias text; FK: acronym → npn_species). Column mapping note: the report page merges light+moisture into one cell; light and moisture are parsed separately from per-species detail pages. Alias index: acronym + latin_name + latin_synonym_greg (where present) + common names (split on ; and ,). Image kind inference: caption containing 'pen & ink' or 'drawing' → 'drawing'; else 'photograph'. Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}). Carex species use CX prefix instead of CAR (e.g. CXPENS for Carex pensylvanica). Lookup endpoint (GET /api/ann-arbor-npn/species/:key) accepts any name flavor and resolves via alias table. Bulk endpoint (GET /api/ann-arbor-npn/species) returns all 130 species. Names endpoint (GET /api/ann-arbor-npn/names) returns name groups with all_accepted_keys for reconciliation. Known quirk: GENAND (Gentiana andrewsii) has 'Closed Gentian' in the synonym slot (common name, not taxonomic). HIEVEN (Hieracium venosum) has no height or notes — minimal data entry in Greg's system. CLEVIR and LIASCA were absent from early DB imports due to an HTML parser bug; corrected in migration 0018.

### Architectural decisions made

- **DDL applied directly via psql rather than Drizzle migration**: Drizzle's migration tracking was already out of sync with the live DB (migration 0010 had applied DDL that Drizzle thought was absent). To avoid conflict, the corrective DDL was applied via psql directly. Migration file 0018 and journal entry were written for completeness and future reference, but they will be skipped at startup because the DB already reflects the changes. This is a one-time import; the DB will not be re-created.
- **Definitive data source: Greg's tab-separated report, not the HTML scraper output**: The attached text file (130 species, tab-separated, with Light and Moisture as separate columns) was used as ground truth rather than re-running the scraper. This bypasses the root cause of the bug (merged cells on the HTML report page) entirely.
- **Three species inserted with empty images**: CLEVIR (Clematis virginiana), HIEVEN (Hieracium venosum), and LIASCA (Liatris scariosa) were absent from the DB and had no Cloudinary images. They were inserted with `images: []`. Their data (light, moisture, growth_form, etc.) was populated from the text file; images were not uploaded because the source images were not available.
- **data.ts snapshot date set to 2026-06-01**: The regenerated file carries today's date as the `ANN_ARBOR_NPN_SNAPSHOT_DATE`, reflecting the date the corrected data was extracted from the DB.
- **Negative coefficients stored as signed strings**: W and S coefficients can be negative (e.g. ACOCAL W=−5, ACTPAC S=−3). These are stored as TEXT in the DB and as string literals in data.ts (`"-5"`, not `"-5"` cast to numeric). Callers that need numeric operations must parse them.

### What was NOT done

- The HTML scraper (`import.ts`) was corrected for future reference, but it will never be run again — this was declared the final import.
- Cloudinary images were not uploaded for CLEVIR, HIEVEN, or LIASCA — they have empty `images` arrays.
- OpenAPI spec / codegen (`lib/api-zod/`, `lib/api-client-react/`) was not regenerated — the API response shape did not change (the JSON returned by the live routes comes from the DB via Drizzle, which already uses the new column names after the schema update). Codegen is not required for this task.
- The old `physiography` and `habitat` column names are still referenced in migration 0010's display name (a comment, not code) — this is cosmetic and was not changed.
- No audit-tool corpus entries were added for NPN coefficient lookups.

### What the user should decide or review

- **GENAND synonym slot**: Gentiana andrewsii has "Closed Gentian" stored in `latin_synonym_greg`. This is a common name, not a taxonomic synonym. It was left as-is (matching Greg's data entry) — if you want this cleared, it needs a one-line SQL UPDATE.
- **HIEVEN minimal data**: Hieracium venosum (HIEVEN) has no height, no notes, and no images in Greg's system. The entry is present but sparse — this is faithful to the source.
- **Three species with no images** (CLEVIR, HIEVEN, LIASCA): These will render without photos on any plant-profile page. No action needed unless you want to upload images.
- **data.ts is now the authoritative IDP source** — the DB can be considered redundant for the NPN data (this is a static, never-reimport source). If the DB were ever dropped or restored, `data.ts` carries the complete data.


### Addendum (follow-up fixes, same session)

Two additional corrections were made after the initial submission:

1. **GENAND synonym cleared**: `latin_synonym_greg` for Gentiana andrewsii was set to NULL in both the DB and the regenerated `data.ts`. "Closed Gentian" was a common name that had been incorrectly stored in the synonym slot.

2. **Images scraped and uploaded for CLEVIR, HIEVEN, LIASCA**: All three species had images on Greg's nativeplant.com site that the original parser missed entirely (they were absent from the DB). Images were fetched directly from `nativeplant.com/plant_images/{ACRONYM}/...` and uploaded to Cloudinary:
   - CLEVIR: 2 images (pos 1: "a few late flowers"; pos 2: "feathery seed clusters in fall on female plant")
   - HIEVEN: 1 image (no caption)
   - LIASCA: 2 images (pos 1: "in bloom"; pos 2: no caption — butterfly photo)
   All images are `kind: "photograph"` (no pen-and-ink drawings among them). DB `images` arrays updated, `data.ts` regenerated, `metadata.ts` stale limitations notes removed.

The ecological data for all three species was correct (sourced from Greg's tab-separated text file, not the buggy HTML parser) — only the images had been missing.


---

## Task: Ann Arbor NPN — Route rewrite to in-memory + cleanup (2026-06-04)

### What was built

All Ann Arbor NPN API routes were rewritten to serve data from the in-memory Internal Data Provider (IDP) instead of PostgreSQL. The admin import endpoint and its supporting service file were removed. Two new routes were added (`species/:key/source-url` and `documentation`), and the old `names` route was replaced by `alias-index`. The MCP server was updated from 3 old tools to 5 current tools. The OpenAPI spec was updated to match. A source documentation Markdown file was created and is served live via the `documentation` route.

### Derivation summary

> The Native Plant Nursery (NPN), Ann Arbor, Michigan — operated by Greg Vaclavek — maintains a curated database of Michigan native plants available at nativeplant.com. The dataset covers 130 species with ecological attributes (light, moisture, height, flowering time, flower color, growth form, conservatism/wetness/shade coefficients, notes, range within Michigan) and nursery availability. Each species record is identified by a short acronym (e.g. ANDGER for Andropogon gerardii) and includes common and Latin names, an optional Latin synonym, and a series of images with captions — photographs and pen-and-ink drawings. FERNS holds a static in-memory snapshot of the full inventory captured on 2026-06-01, enabling lookup by acronym, Latin name, Latin synonym, or any common name. An alias-index endpoint returns all species organized by accepted key for cross-source reconciliation. Images are hosted on Cloudinary CDN (folder: ann-arbor-npn/{acronym}/{position}). Greg's nativeplant.com site is no longer actively updated; this snapshot is the definitive FERNS record.

### Scientific/technical description

> Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database. Source status: defunct upstream — Greg's nativeplant.com site is no longer updated. No further scrapes or re-imports will be performed; this is a permanent static snapshot. Snapshot date: 2026-06-01. Data is held in-process as an Internal Data Provider (IDP) within EC FERNS — no DB table, no TTL, no cache layer. 130 species, each identified by a short acronym (e.g. ANDGER for Andropogon gerardii). Carex species use CX prefix instead of CAR (e.g. CXPENS for Carex pensylvanica). Fields per species: acronym (PK), latin_name, latin_synonym_greg (Greg's own taxonomy — may differ from GBIF or USDA PLANTS), common_name (semicolon/comma-delimited), light, moisture, height, flowering_time, flower_color, growth_form (Forb/Grass/Sedge/Shrub/Tree/Vine), conservatism_coefficient (C score), wetness_coefficient (W score — signed, can be negative), shade_coefficient (S score — signed, can be negative), notes, range_michigan text[] (SE/SW/NL/UP vocabulary), npn_price_sizes, images (array of {position, url, caption, kind}), source_url. Alias index: every species is indexed by acronym + latin_name + latin_synonym_greg (where present) + common names (split on ; and ,). Lookup endpoint resolves any alias case-insensitively. Image kind inference: caption containing 'pen & ink' or 'drawing' → 'drawing'; else 'photograph'. Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}). HIEVEN (Hieracium venosum) has no height or notes — minimal data entry in Greg's system. CLEVIR, HIEVEN, and LIASCA were absent from early imports due to an HTML parser bug; corrected before snapshot was taken. Column mapping note: nativeplant.com report merges light+moisture into one cell; light and moisture were parsed separately from per-species detail pages during capture.

### Architectural decisions made

- **sourceKind: "in-memory" on all routes** — since data comes from the IDP at process startup, not from a DB or network call. This is the correct contract value for IDPs.
- **queriedAt: new Date().toISOString() on all routes** — for in-memory sources there is no "fetched_at" timestamp to reference. The envelope contract explicitly allows current time for in-memory/computed data.
- **sourceUrl: null on most routes; species.source_url on species/:key and species/:key/source-url** — the per-species nativeplant.com URL is the upstream URL for individual species pages and belongs in the envelope's source_url.
- **Documentation served from static file read at startup** — the Markdown file is read once via readFileSync at module load time, held in memory, and returned on every request. No runtime file I/O per request.
- **knowledge_type changed from "source_wrapper" to "dataset"** — this source is a static dataset captured once, not a live wrapper around an external API.
- **Removed `names` path; replaced with `alias-index`** — same data shape (from listAnnArborNpnNameGroups()), cleaner name that accurately describes the endpoint's purpose.

### What was NOT done

- The PostgreSQL tables `npn_species` and `npn_name_aliases` were NOT dropped — that is downstream task "Ann Arbor NPN — Drop npn_species and npn_name_aliases DB tables".
- The `ensureAnnArborNpnRegistryEntry` startup call was retained (seeds the ferns_sources registry row from metadata.ts).
- No codegen was run on lib/api-client-react — OpenAPI spec was updated but generated client types were not regenerated.

### What the user should decide or review

- The `non_passthrough_endpoints` kinds use `"in_memory"` — confirm this is the correct kind string for the ferns_sources schema (or adjust to match whatever the DB column accepts).
- The documentation Markdown file content should be reviewed for accuracy against Greg's actual site and the capture history.

---

## Task: Ann Arbor NPN — Drop npn_species and npn_name_aliases DB tables

### What was built

The two PostgreSQL tables that previously stored Ann Arbor Native Plant Nursery (NPN) data — `npn_species` and `npn_name_aliases` — have been permanently removed from the database and the codebase. This follows an earlier task that converted all NPN routes to serve data from an in-memory TypeScript file (`lib/internal-data-providers/src/ann-arbor-npn/data.ts`) instead of the database. The tables were no longer read or written by any live code path, so this task destroys the now-redundant data store. The only remaining copy of the NPN data is the committed TypeScript file.

### Derivation summary

N/A — no new source was added.

### Scientific/technical description

N/A — no new source was added.

### Architectural decisions made

- **Manual migration instead of `drizzle-kit generate`**: `drizzle-kit generate` has a pre-existing module resolution issue (it resolves TypeScript `.ts` imports as `.js` in CommonJS mode, failing on `import { fernsSourcesTable } from "./registry.js"` in `trust.ts`). The migration SQL is trivial (two DROP TABLE statements), so it was written manually and the `_journal.json` was updated by hand. The journal entry timestamp matches the current date (June 17, 2026). This unblocks the task without touching the unrelated `trust.ts` or `registry.ts` files.
- **Stale dist file cleanup**: `tsc` does not delete old output files when source files are removed. After deleting `lib/db/src/schema/npn.ts` and rebuilding, the stale `lib/db/dist/schema/npn.d.ts` and `.d.ts.map` were deleted manually to ensure consuming packages no longer see those exports.
- **NpnImage in api-zod / api-client-react preserved**: The `NpnImage` type in `lib/api-zod` and `lib/api-client-react` is an API response type generated from the OpenAPI spec (not a DB type). It describes the shape of the `images` array returned by the NPN routes, which still exists in the IDP data. These files were left untouched.
- **lib/internal-data-providers declarations rebuilt**: The three TS6305 errors in the api-server (coefficient-of-conservatism, wetland-indicator-status, wucols-water-use) were pre-existing stale declaration issues. Rebuilding `lib/internal-data-providers` cleared them, leaving zero TypeScript errors.

### What was NOT done

- No NPN route or metadata changes (those were completed in earlier tasks).
- No changes to `lib/api-zod` or `lib/api-client-react` — the `NpnImage` type there is an API-level type, not a DB type, and the routes still return `images` arrays.
- The `drizzle-kit generate` module resolution issue was not fixed — it is a pre-existing problem unrelated to this task.

### What the user should decide or review

- **This change is irreversible** once merged. The `npn_species` and `npn_name_aliases` tables are gone from the dev database. The NPN data now lives only in `lib/internal-data-providers/src/ann-arbor-npn/data.ts`.
- If a production database exists with these tables, the migration `0019_drop-npn-tables.sql` will drop them on next startup. Confirm this is intended before deploying.
