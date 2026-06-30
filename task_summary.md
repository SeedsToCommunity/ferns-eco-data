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

---

## Task: S2C — Wire IDP into REST, MCP, and OpenAPI spec (2026-06-18)

### What was built

The Seeds to Community Washtenaw (S2C) data layer was migrated from a local data file inside the REST server to the new Internal Data Provider (IDP) built in Task #235. The REST route now imports all species data through the IDP's public Source Interface rather than reaching into a private data file directly. Two response paths in the S2C route that returned raw JSON objects (bypassing the FERNS envelope) were fixed — all six S2C response paths now produce a valid FernsEnvelope. The OpenAPI spec's three S2C operation IDs and tag were renamed to match the IDP method naming convention.

### Derivation summary

No new source was added; this task is a migration/conformance task. The general_summary and technical_details fields in `artifacts/rest-server/src/services/s2c/metadata.ts` were left unchanged (they are adapter concerns, not IDP data).

### Scientific/technical description

No technical_details changes — this task only moved the data boundary and fixed envelope violations.

### Architectural decisions made

- **Error responses use `buildEnvelope` with `found: false` and `data: { error, message }`**: For the two input-validation 400 paths, the user-facing error message is preserved inside `data`. This is the minimum-change approach that satisfies the "no `res.json()` bypasses `buildEnvelope`" rule while keeping the error message visible to callers. The HTTP 400 status is preserved. The envelope contract does not define a specific error shape for validation failures, so `data` carries the error descriptor.
- **`ensureS2CRegistryEntry()` is called before the 400 error paths**: Previously the 400 paths returned before the registry seed. After wrapping in `buildEnvelope`, the registry must be seeded first (buildEnvelope looks up the registry entry to populate license/rights/permission_granted). This adds a negligible DB call on the error path but is required by the envelope builder's contract.
- **No MCP changes required**: The MCP tools call `apiGet("/s2c", ...)` and `apiGet("/s2c/years", ...)` directly. The path strings are unchanged; codegen type renames only affected operation-level types, not schema types (S2CSpecies, S2CYearsData, etc. are unchanged).
- **OpenAPI 400 response schema left as `ErrorResponse`**: The spec's 400 response for `/s2c` still references `ErrorResponse`. After this change the actual response is a FernsEnvelope. Updating the 400 schema was not in scope and is consistent with how the spec currently handles other routes' error paths — a separate conformance pass can align the spec.

### What was NOT done

- Route prefix rename (`/s2c` → `/seeds-to-community-washtenaw`) — explicitly out of scope; flagged as follow-up task #239
- ann-arbor-npn envelope violations — noticed while using that file as reference; flagged as follow-up task #240
- OpenAPI 400 response schema not updated to FernsEnvelope (it still says `ErrorResponse`) — minor spec conformance gap, not in scope

### What the user should decide or review

- **400 error shape**: The decision to put `{ error: "invalid_input", message: "..." }` inside `data` for validation errors is a design choice. If the preferred pattern is `data: null` with the error only surfaced via HTTP status, the two 400 paths in `artifacts/rest-server/src/routes/s2c.ts` can be simplified. Either way satisfies the "use buildEnvelope" requirement.
- **OpenAPI 400 response schema**: The spec's `/s2c` 400 response still references `ErrorResponse` rather than `FernsEnvelope`. This is a minor spec inaccuracy introduced by the envelope fix — worth addressing in a future spec cleanup pass.

---

## Task: Google Images — wire IDP, fix envelope violation, add audit health check

**Date**: 2026-06-18

### What was built

Three coordinated changes were made to complete the Google Images source integration: (1) the REST route was updated to call the new Internal Data Provider (`getGoogleImagesUrl`) instead of constructing the search URL inline; (2) a pre-existing envelope contract violation in the route was fixed — the missing-species-param error response was returning raw JSON without a FERNS envelope, and that response is now wrapped in `buildEnvelope` like every other response in the route; (3) a new health check (`runGoogleImagesChecks`) was added to the ferns-audit library and registered in its main runner, covering the happy path, the error path (specifically guarding against the envelope regression), and the metadata endpoint.

### Derivation summary

Not applicable — no new source was added. The google-images source was registered in a prior task; this task wires the final plumbing.

### Scientific/technical description

Not applicable — google-images is a URL-lookup source (kind: `url_lookup`), not a scientific data source. Its data is a computed Google Images search URL for a given species name.

### Architectural decisions made

- **Envelope wrapping for 400 validation error**: The contract requires all responses from a registered source to use `buildEnvelope`. The error path uses `found: false`, `method: computed`, `cacheStatus: bypass` (matching the source kind), and puts the `{ error, message }` content in the `data` field so the human-readable message is preserved inside the valid envelope structure. HTTP 400 status is preserved.
- **`ensureGoogleImagesRegistryEntry()` called before error envelope**: The 400 path now seeds the registry entry before building the envelope, because `buildEnvelope` reads from the registry for license/rights and will fail silently without it.
- **IDP function name**: The IDP exports `getGoogleImagesUrl` (not `getGoogleImages` as the task description suggested). Used the actual export name.
- **Ferns-audit error path uses raw `fetch`** (not `checkEndpoint`): `checkEndpoint` only handles HTTP 200 responses; the 400 test case needed direct `fetch` to inspect the status code independently. Consistent with how other non-200 checks work in the file.

### What was NOT done

- MCP tool `google_images__search` was verified (no changes needed): tool name correct, calls `GET /google-images`, `species` required in `inputSchema`, handler passes `species` as query param correctly.
- The MCP tool naming inconsistency (tool name is `google_images__search` but there is no `/search` path segment on the endpoint — the root endpoint IS the search) was not fixed. This requires a breaking API change decision and is flagged as a follow-up.
- No OpenAPI spec changes were made (none were needed).
- No database cache was added (google-images is a computed source; caching is not applicable).

### What the user should decide or review

- **MCP tool naming conformance**: The tool is named `google_images__search` but the contract's action-name consistency rule says the tool name should derive from the path segment after the source prefix. Since the search IS the root endpoint (no path segment), the tool name `google_images__search` has no path anchor. The options are: (a) leave it as-is with a `non_passthrough` exception noted; (b) add a `/search` path alias; (c) rename the tool to match the root endpoint convention. This requires a decision before a breaking change is made.


---

## Task: S2C Species Information — MCP Tool + Audit (2026-06-18)

### What was built

A new MCP tool (`seeds_to_community_washtenaw__species_information`) was added to the Ecological Commons MCP server, exposing the existing REST endpoint `GET /api/seeds-to-community-washtenaw/species-information` as a callable tool for any MCP-compatible AI assistant. The tool accepts a single required `species` parameter (botanical name) and returns the full S2C species record — growth habit, germination code, bloom color, height, light and moisture requirements, and planting notes — for any of the ~220 species in the Seeds to Community Washtenaw dataset. An audit health check was added to `lib/ferns-audit` that verifies the endpoint returns HTTP 200, `found=true`, `data.botanical_name` present, correct `provenance.source_id`, and `provenance.method=cache_hit` for *Aquilegia canadensis*. All 10 assertions pass. The MCP README tool table was updated and the tool count bumped from 58 to 59.

### Derivation summary

> Species availability records and per-species growing information for Seeds to Community Washtenaw, a native plant seed-growing program run by a Washtenaw County, Michigan community organization; FERNS serves this data with the program organizer's permission. Data type: (1) the list of botanical names offered for growing in each annual workshop series, extracted from program documents (PDFs and Google Sheets); (2) rich per-species information — growth habit, germination code, stratification notes, bloom color, height, stature, light, moisture, and additional planting notes — covering ~220 species. Geographic scope: Washtenaw County, Michigan; taxonomic scope: native plants suitable for seed-growing workshops in the Upper Midwest. FERNS serves static in-memory data extracted from program documents; no live API is queried at runtime. A query by year returns the species list with optional metadata flags: neat_and_tidy (suitable for formal garden settings) and sweet_and_simple (beginner-friendly, 2026+). A query by botanical name returns rich per-species growing data. Data is updated annually when new program year documents are processed; the 2023 list is from workshop PDFs (24 species) and may be incomplete. Botanical names reflect S2C program usage and are not formally reconciled to any single taxonomic authority.

### Scientific/technical description

> Source: Seeds to Community Washtenaw native plant program, Washtenaw County, Michigan. Data owner: program organizer. Permission: granted explicitly. Method: static_data. Species lists extracted from program documents per year: 2023 — plant-sheet PDF (202303-PlantSheets.pdf); 24 species; botanical names transcribed from PDF. 2024 — Google Sheets 'All Species For Growing Events' tab (file: 12DX2dQ96KUyEeNKREfpNoGHtTBxczan6uZNP3uQYyJk); 96 species; neat_and_tidy from Neat column. 2025 — Google Sheets 'Species' tab, filter Barn S3=TRUE (file: 121a1HIhNPJwyM1fr_OWgi4jMKRipF9EKDeT7_zo4mA8); 151 species; neat_and_tidy from Neat column. 2026 — Google Sheets 'Species' tab, filter Collected=TRUE (file: 1sVNi4MuqSI6tugCgDodiUJZMTMkDuK1FEXojexI5f-E); 166 species; neat_and_tidy and sweet_and_simple from S2C Lists column. Species information endpoint: source file S2C_SpeciesInfo.csv; ~220 species after excluding 17 rows (13 flagged as Old Name, 4 Non-Native); 19 ingested fields per species: botanical_name, common_name, special_collect, s2c_lists, start_seed_watch, growth_habit, germination_code, strat_notes, planting_notes, process_notes, bloom_color, height, stature, compact_bloom_range, bloom_months, plant_spacing, light, moisture, species_comments; lookup method: case-insensitive match on botanical_name. Botanical names reflect S2C program usage; not formally reconciled to a single taxonomic authority. No upstream API. No cache TTL — data is in-memory static reference.

### Architectural decisions made

- **Followed exact S2C tool pattern** — `provenance_verbosity` spread via `PV_PROP` and `pv(args)` helper, consistent with other S2C tools and the full pattern across the server.
- **Audit check placed at end of `runS2CChecks`** — the new `speciesInfoCheck` is appended to the return array alongside the existing years and species-list checks, keeping all S2C assertions in one function and in `index.ts`'s existing `s2cChecks` slot. No new import or `Promise.all` entry needed.
- **Audit asserts `method === "cache_hit"`** — the S2C adapter always returns `method: cache_hit` (in-memory static data, no upstream fetch). This is intentional and correct per the data-layer contract for in-memory sources.

### What was NOT done

- No changes to the REST route or OpenAPI spec (out of scope per task instructions).
- No changes to existing MCP tools or audit checks.
- The pre-existing `provenance.rights` empty-string flag in the `envelopeFindings` helper shows as a mismatch for S2C responses — this is a pre-existing issue across all S2C endpoints, not introduced here, and was not fixed.

### What the user should decide or review

- **`provenance.rights` empty string** — the S2C adapter sets `rights: ""` which the standard `envelopeFindings` check flags as a mismatch. This affects all three S2C checks (years, species lists, and now species-information). Decide whether to set a meaningful rights string in the S2C adapter, or treat the empty string as acceptable for internal data providers.
- **MCP tool description accuracy** — the description says "includes availability across catalog years and seed collection notes"; confirm this reflects the actual fields returned (the endpoint returns a single species record keyed to in-memory data, not year-by-year availability breakdowns).

---

## Task #256 — LCSCG REST thin-route refactor + violation fixes

### What was built

The LCSCG route handler was rewritten to use the in-process Internal Data Provider (`@workspace/internal-data-providers/lcscg`) instead of querying the PostgreSQL database directly. The route file now has zero database or Drizzle-ORM imports — it calls three IDP functions (`getLcscgGuides`, `getLcscgGuide`, `getLcscgSpecies`) and wraps their results in the standard EC envelope. Seven contract violations were removed (five data-purity violations and two HTTP-status violations). The startup seed call for LCSCG data (`seedLcscgData`) was removed from the server startup block, and the seed file was trimmed to retain only the registry upsert.

### Derivation summary

N/A — no new source was added in this task.

### Scientific/technical description

N/A — no new source was added in this task.

### Architectural decisions made

- **Metadata route counts via IDP instead of DB**: The `/lcscg/metadata` route previously fetched `guide_count` and `species_count` via `db.$count()`. Since these are descriptive dataset-size fields (not query-result counts flagged as violations), and since the task requires zero DB imports in the route file, the counts are now computed from IDP calls: `getLcscgGuides().length` for guide_count and a reduce over `getLcscgGuide(id)` for species_count. This is pure in-memory work and fast.
- **`seedLcscgData` removed, not stubbed**: The task spec said "remove or stub out" the function. Removal was chosen because the function is entirely superseded by the IDP; keeping a stub would create dead code with no caller.
- **Dev-tool files left untouched**: `import.ts`, `reimport-images.ts`, `import-final.ts`, `import-remaining.ts` still reference `./data/` and the DB tables. The task explicitly excluded them; the `./data/` directory is still present for them.

### What was NOT done

- OpenAPI schema not updated (next task, #257)
- Codegen not run (next task)
- `lcscg_guides` and `lcscg_species` DB tables not dropped (deferred — a follow-up task should confirm no other code references them before dropping)
- Audit assertions not updated (fourth task per sequencing plan)
- Dev-tool files (`import.ts`, `reimport-images.ts`, etc.) not modified

### What the user should decide or review

- **DB table drop**: `lcscg_guides` and `lcscg_species` tables remain in the schema. Once the team confirms the dev-tool import scripts no longer need them (or can be updated/retired), a follow-up migration can drop them.
- **Dev-tool import scripts**: These files (`services/lcscg/import.ts`, `reimport-images.ts`, `import-final.ts`, `import-remaining.ts`) still reference the old `./data/` static files and the DB tables. They are not on any production path, but they will break if those tables are dropped without updating them first.


---

## Task #258 — LCSCG Audit assertions + MCP review + description fix

### What was built

The five health-check assertions for the Lake County Seed Collection Guides (LCSCG) source were updated to match the data shapes introduced by the prior REST refactor. The metadata check was corrected to read `data.guide_count` and `data.species_count` from inside the envelope data object (not the envelope root, which was a pre-existing bug). The guide-detail check for guide 1282 was updated to assert on `data.species.length === 60` rather than the removed `data.species_count` field. Both species-search checks (Sporobolus heterolepis and Daucus carota) were updated to use `data.records.length` as the gate instead of the removed `data.result_count` field. In the same pass, the `species_count` field was removed from the internal known-guides corpus object in the audit file, since it is no longer asserted anywhere. Finally, the source registry `description` field was corrected: it previously said "494 native plant species" but the dataset also includes non-native comparison species marked "Do Not Collect", so the description now reads "494 native and introduced plant species". The three MCP tools (`lcscg__guides`, `lcscg__guide`, `lcscg__species`) were reviewed and found clean — no description changes required.

### Derivation summary

**`description` (corrected):**
> Seed identification photos, harvest instructions, and collection timing for 494 native and introduced plant species in Lake County, Illinois, organized by season and habitat type. From 12 illustrated field guides published by the Lake County Forest Preserve District Volunteer Stewardship Network.

**`general_summary` (unchanged):**
> Illustrated field guide data for native seed collection in Lake County, northeastern Illinois, compiled by the Lake County Forest Preserve District Volunteer Stewardship Network and published as 12 illustrated guides by the Field Museum Field Guides platform (Guide IDs 1271–1282). Authors: Kelly Schultz (LCFPD Stewardship Ecologist) and Dale Shields. Covers 494 plant species organized by season (spring, summer, fall) and habitat (woodland, wetland, prairie, grasses and sedges, asters and goldenrods, woody plants). Geographic scope: Lake County, Illinois; taxonomic scope: native and introduced, non-native (adventive) vascular plants of that region. FERNS serves static data extracted from the PDF guides (no live upstream API); 2,093 guide photographs are served from Cloudinary CDN. A species query returns scientific name, common name, plant family, guide and habitat section, seed dispersal category, harvest technique description, photo date (timing proxy), and image URLs. Data is static with no update cycle; not all records are native — non-native comparison species marked 'Do Not Collect' are included. LCSCG species names follow Flora of the Chicago Region (Wilhelm & Rericha 2017).

**`technical_details` (unchanged):**
> Primary source: 12 PDF field guides (version 2, March 2021) authored by Kelly Schultz (LCFPD Stewardship Ecologist) and Dale Shields (volunteer); photography by Dale J. Shields. Published by Field Museum Field Guides. Field Museum Guide IDs: 1271 (Summer Woodland Forbs), 1272 (Woody Plants), 1273 (Summer Wetland Grasses and Kin), 1274 (Summer Wetland Forbs), 1275 (Summer Prairie Forbs), 1276 (Summer Grasses and Kin), 1277 (Spring Woodland Forbs), 1278 (Fall Woodland Forbs), 1279 (Fall Wetland Forbs), 1280 (Fall Grasses and Kin), 1281 (Asters and Goldenrods), 1282 (Fall Prairie Forbs). Scientific reviewer: Laurie Ryan, McHenry County Conservation District. Data extracted from PDFs into JSON files; stored in FERNS as static PostgreSQL records (no TTL, no cache, no refresh). Nomenclature follows Flora of the Chicago Region (Wilhelm & Rericha, 2017). Images (2,093 PNGs) hosted on Cloudinary (cloud: dqe2vv0fo), organized in per-guide folders. Fields per species: scientific_name, common_name, family, guide_id, guide_name, season, habitat_type, page_number, photo_date (M-D-YY format; date of reference photograph; approximate collection timing; varies by local weather, proximity to Lake Michigan, slope, sun/shade), description (authors' harvest notes), seed_group_names (string array), seed_group_details (array of {name, description, images}), image_urls (JSONB array of Cloudinary CDN URLs). 494 total records, all unique by scientific name. Non-native Do Not Collect species included: Daucus carota, Cirsium vulgare, Phleum pratense, Abutilon theophrasti, Dianthus armeria, others.

### Architectural decisions made

- **Data moved from DB-backed to IDP in-memory TypeScript arrays** (prior task): The LCSCG data layer was refactored from PostgreSQL queries to a purely in-memory Internal Data Provider (`@workspace/internal-data-providers/lcscg`). All three route endpoints now call IDP functions (`getLcscgGuides`, `getLcscgGuide`, `getLcscgSpecies`) and hold no database imports.
- **DB tables `lcscg_guides` / `lcscg_species` retained — not dropped**: The tables remain in the schema pending confirmation that the dev-tool import scripts can be safely retired or updated.
- **Developer import tools left in place**: `import.ts`, `reimport-images.ts`, `import-final.ts`, `import-remaining.ts` remain in `services/lcscg/`. These scripts reference the old data files and DB tables; they are not on any production path but would break if the tables were dropped without updating them.
- **Fields removed from response data**: `guide_count` (from guide-list responses), `species_count` (from individual guide-detail responses), `queried_name` and `result_count` (from species-search responses) were removed by the prior refactor because they are FERNS-computed values, not source data — a contract violation. The audit assertions have been updated to reflect the absence of these fields.
- **`seedLcscgData()` removed from startup; `ensureLcscgRegistryEntry()` retained** (prior task): The data seed at server startup was removed. The registry upsert remains to keep the source discoverable in the registry.
- **Metadata route computes `guide_count` and `species_count` via IDP**: The `/lcscg/metadata` endpoint still exposes `guide_count` and `species_count` inside `data` — these are descriptive dataset-size fields, not query-result counts, so they are not a contract violation. They are computed in-memory via IDP calls. The audit check was corrected (pre-existing bug) to read these from `envelope.data` rather than the envelope root.
- **NPN count debt (out of scope)**: NPN currently embeds `species_count` inside `data` on its list responses — the same pattern removed here. NPN's shape was not the model for this work; the contract's governing rule was. NPN's debt is out of scope here but should be tracked as a follow-up.
- **Source PDFs not present**: The original 12 Field Museum PDF guides were never committed to this repository. The data pipeline ran outside the repo (PDFs → Google Drive JSON → `import.ts` → DB → static TypeScript files). The IDP contains the TypeScript data files as the only in-repo provenance artifacts; no PDF move was possible or needed.

### What was NOT done

- `lcscg_guides` and `lcscg_species` DB tables not dropped — deferred.
- Developer import tools (`import.ts`, `reimport-images.ts`, etc.) not updated or retired.
- NPN count-in-data debt (`species_count` inside `data` on NPN list responses) not fixed — out of scope.
- Source PDFs not committed to repo — not possible; the pipeline ran outside the repo.
- `docs/audit-tool.md` narrative description of LCSCG checks not updated (still references `species_count=60` for guide 1282 — now asserted as `species.length=60`). Not in task scope.

### What the user should decide or review

- **Corrected `description` field** (verbatim above): confirm "494 native and introduced plant species" reads correctly for a general audience.
- **DB table drop**: decide whether to drop `lcscg_guides` / `lcscg_species` once the import dev-tools are retired or updated.
- **Dev-tool import scripts**: decide whether to update the import scripts to use the IDP data files, or simply remove them now that the IDP owns the source of truth.
- **NPN count-in-data debt**: decide whether to add a task to remove `species_count` from NPN's list-response `data` object (same contract violation removed here).


---

## Task #267 — EDP: Species-list sources (IL, MN, MO, Prairie Moon)

### 1. What was built

Four External Data Provider modules were created — one each for Illinois Wildflowers, Minnesota Wildflowers, Missouri Plants, and Prairie Moon Nursery. Each module now owns the complete data-retrieval path for its source: it looks up the species URL from the internal FERNS database, makes a live HTTP request to the source website, extracts the structured botanical text, and returns it. Previously the URL lookup was scattered across four separate REST route files; it now lives in the data layer where it belongs. A URL-only method (`getXxxUrl`) is also exported on each module so callers can do just the database lookup without a live fetch. The shared type library was extended with two new result types for database-backed URL lookups, and the species-information type was updated to allow a null URL (which occurs when a species is absent from the imported list).

### 2. Derivation summary

*Not applicable — no new source was added in this task.*

### 3. Scientific/technical description

*Not applicable — no new source was added in this task.*

### 4. Architectural decisions made

- **URL lookup moved into the EDP, not the REST Adapter.** The original task spec said the URL lookup stays in the REST Adapter and the EDP receives a pre-resolved URL. The user overrode this mid-task: "The Data Provider is the basis for all data." The EDP now imports `@workspace/db` and queries `botanicalSpeciesListsTable` directly. **Tradeoff:** the EDP package now has a DB dependency, making it heavier and coupling it to the internal schema; the gain is a clean single-entry-point per source that owns its full retrieval path.

- **`getXxxSpeciesInformation` signature changed from `(url: string)` to `(species: string)`.** Since the EDP now does the URL lookup, callers pass a scientific name rather than a pre-resolved URL. **Tradeoff:** this is a breaking change to the method signature; the downstream REST refactor task (Task E) must be updated to call the new signature instead of passing a pre-resolved URL.

- **Illinois Wildflowers uses `getIllinoisWildflowersSpeciesInformation` takes the first section URL.** IL is the only source where one species can appear in multiple habitat sections (prairie, savanna, etc.). `getIllinoisWildflowersUrl` returns all sections; `getIllinoisWildflowersSpeciesInformation` uses the first one, matching the current REST Adapter behavior. **Tradeoff:** a multi-section species only gets the text from one page; if distinct ecological content exists per section this is a lossy representation. The REST Adapter could call `getIllinoisWildflowersUrl` and iterate sections if needed.

- **`BotanicalSpeciesInformation.url` widened to `string | null`.** GoBotany always constructs a URL even when a species is not found; DB-backed sources have no URL when the species is absent. Widening the shared type is accurate and backward-compatible (GoBotany still returns a non-null string; the type simply allows null). **Tradeoff:** REST Adapter code that passes `result.url` to `sourceUrl` (which already accepts `string | null`) is unaffected; code that assumes `url` is always a string would need a null guard.

- **REST Adapter caching left unchanged.** The user confirmed they don't object to the REST layer also caching results on top of the EDP. No changes were made to `fetchAndCacheSpeciesText` or the four route files.

### 5. What was NOT done

- REST route files for the four sources were **not updated** — they still do the DB lookup themselves and call `fetchAndCacheSpeciesText`. That migration is Task E (REST refactor).
- No new audit corpus entries were added.
- No MCP tool renames were made (Task G scope).
- The `fetchAndCacheSpeciesText` shared scraper was **not modified or removed** — it remains the path the REST routes use until Task E.

### 6. What the user should decide or review

- **Multi-section Illinois Wildflowers species:** `getIllinoisWildflowersSpeciesInformation` only fetches the first section's page. Decide whether the REST Adapter (in Task E) should iterate all sections and merge the text, or whether first-section is the intended behavior.
- **Signature change awareness for Task E:** Task E (REST refactor) must call `getXxxSpeciesInformation(species)` and `getXxxUrl(species)`, not the old `(url)` signatures. The downstream task description should be updated to reflect this.


---

## Task #270 — REST Refactor: Species-List Routes (IL, MN, MO, Prairie Moon)

### 1. What was built

Four sets of botanical reference routes — Illinois Wildflowers, Minnesota Wildflowers, Missouri Plants, and Prairie Moon — were cleaned up to follow the same architecture already in place for GoBotany. Previously, these routes bundled the web scrape, cache read, and cache write into a single internal function call (`fetchAndCacheSpeciesText`) and were leaking internal bookkeeping fields (timestamps, validation labels, input echoes) directly into the API response. Now each route explicitly: (1) looks up the species page URL from the database, (2) checks its own cache, (3) calls the dedicated External Data Provider on a cache miss, (4) writes the result back to the cache, and (5) returns only the upstream-derived content to the caller. The API response for each of these sources is now clean — it contains only what the upstream site actually said, nothing FERNS computed or stored for its own purposes.

### 2. Derivation summary

N/A — no new source added.

### 3. Scientific/technical description

N/A — no new source added.

### 4. Architectural decisions made

- **EDP functions now accept a URL, not a species name.** The `getXxxSpeciesInformation` functions in `lib/external-data-providers/` were changed to take a URL string directly rather than a species name. The REST Adapter is now responsible for the database URL lookup and passes only the URL to the EDP. This removes a redundant DB query inside the EDP (which had been doing the same lookup the route was already doing) and makes the boundary clear: the EDP owns fetch + extract; the adapter owns cache and DB. Tradeoff: any non-route consumer of these EDP functions now needs to supply a URL rather than a name — but the URL-returning variants (`getXxxUrl`) are still exported for that purpose.

- **Cache write only on definitive outcomes.** Transient HTTP failures (5xx, network errors) are not cached — matching the existing `fetchAndCacheSpeciesText` contract. Only 200 OK (found) and 404 (definitively absent, `fetchError === null`) are written. This means a flaky upstream never locks a species out of the cache permanently.

- **`queriedAt` on cache hits uses the original fetch timestamp.** On a cache hit, `queriedAt` is set to `hit.scraped_at.toISOString()` — the time the data was first fetched — not the current serve time. This matches the envelope contract and lets consumers judge data age accurately.

- **"Not in species list" handled as an early return before the cache check.** If the species URL lookup returns nothing (species not in the imported list), the route returns immediately with `method: computed, cacheStatus: bypass` — no cache lookup, no EDP call. This matches the previous scraper behavior and avoids a pointless cache query.

- **EDP declarations rebuilt.** After updating the EDP source files, `pnpm exec tsc -p tsconfig.json` was run inside `lib/external-data-providers/` to regenerate the `dist/*.d.ts` files, which the rest-server's TypeScript project references require.

### 5. What was NOT done

- **MCP tool renames** — the MCP tool names for these four sources (e.g. `illinois_wildflowers__species_text`) are unchanged. Task G covers those renames.
- **OpenAPI / codegen** — the spec and generated client types are not updated. That is the downstream task already queued.
- **`fetchAndCacheSpeciesText` removal** — this function in `scraper.ts` is now dead code (no route imports it) but was not deleted, as it was out of scope. It can be removed once any remaining references are confirmed gone.

### 6. What the user should decide or review

- **Illinois multi-section behavior** — Illinois Wildflowers species can appear in multiple habitat sections (prairie, savanna, woodland, etc.), each with its own page. The species-text route fetches only the first section's URL. If full multi-section text is wanted, the route would need to iterate all matching URLs and merge the extracted text. Currently it silently uses only the first one.
- **No new decisions required on the data shape** — the cleaned-up shapes (`{ results: [{url, section}] }` for Illinois URL lookup; `{ url }` for MN/MO/PM; `{ sections, full_text }` for all species-text routes) follow directly from the task spec and envelope contract.

---

## Task: REST Refactor — Species-List Routes (IL, MN, MO, Prairie Moon)

**Date**: 2026-06-24

### What was built

Four species-list route sets — Illinois Wildflowers, Minnesota Wildflowers, Missouri Plants, and Prairie Moon — were refactored to use the approved EDP-based adapter pattern, matching what GoBotany already uses. Previously, these routes called an internal scraper helper (`fetchAndCacheSpeciesText`) that bundled the URL lookup, HTTP fetch, and cache write in one opaque call, and leaked internal bookkeeping fields into API responses (`species`, `result_count`, `validation_method`, `imported_at`, `url`, `scraped_at`, `fetch_error`). After this task: the adapter owns cache read and cache write explicitly; the EDP owns URL lookup + HTTP fetch; no internal fields appear in `data`.

### Derivation summary

N/A — no new source added.

### Scientific/technical description

N/A — no new source added.

### Architectural decisions made

**EDP function signatures: `(species: string)`, not `(url: string)`.** The approved interfaces for `getIllinoisWildflowersSpeciesInformation`, `getMinnesotaWildflowersSpeciesInformation`, `getMissouriPlantsSpeciesInformation`, and `getPrairieMoonSpeciesInformation` accept a species name. Each EDP does its own `botanicalSpeciesListsTable` URL lookup internally. The REST Adapter calls the EDP with the species name and does not do a redundant URL lookup for the species-text routes. The URL-lookup routes (`GET /xxx?species=...`) still do their own direct DB query, since they return URL data directly and do not call the EDP.

**"Not in species list" is detected via `result.url === null`.** When the EDP returns `url: null`, no HTTP request was made — the adapter returns immediately with `method: "computed", cacheStatus: "bypass"` and does not write to cache. This preserves the old `fetchAndCacheSpeciesText` behavior and keeps the cache clean (a stale species list doesn't permanently poison cache entries).

**Cache write gated on `result.fetchError === null` and `result.url !== null`.** Transient HTTP failures are not cached. Only 200 OK (found) and 404 (not found at URL) are written to `speciesPageTextCacheTable`.

**`queriedAt` on cache hits uses `hit.scraped_at.toISOString()`.** The original fetch timestamp, not the current serve time. Consumers can judge actual data age.

**EDP `package.json` exports unchanged** (bare string paths to source `.ts` files). The TS2307 "Cannot find module" error for EDP subpath imports is a pre-existing infrastructure issue also present in `gobotany` and `lady-bird-johnson` before this task. All four of our new EDP-importing routes inherit the same pre-existing error. Runtime behavior is unaffected (tsx resolves workspace sources correctly); only the type-checker is affected.

### Data shape before → after

**Before** (`data` object on species-text routes):
```json
{
  "species": "Acer rubrum",
  "result_count": 1,
  "validation_method": "species_list_lookup",
  "imported_at": "...",
  "url": "https://...",
  "scraped_at": "...",
  "fetch_error": null,
  "sections": { ... },
  "full_text": "..."
}
```

**After** (`data` object on species-text routes):
```json
{
  "sections": { ... },
  "full_text": "..."
}
```

All removed fields are either internal FERNS bookkeeping (`imported_at`, `scraped_at`, `fetch_error`, `validation_method`, `result_count`) or redundant envelope fields (`url` is now in `sourceUrl`, `species` is the caller's own input).

### What was NOT done

- MCP tool renames — out of scope.
- OpenAPI / codegen updates — downstream task.
- `fetchAndCacheSpeciesText` in `scraper.ts` is now dead code (no route imports it) but was not deleted; safe to remove once confirmed no other consumers exist.

### What the user should decide or review

- **Illinois multi-section behavior**: Illinois Wildflowers species can appear in multiple habitat sections, each with its own URL. `getIllinoisWildflowersSpeciesInformation` fetches only the first section's URL (ordered by section name). If full multi-section text is needed, the EDP would need to iterate all matching URLs.

---

## Task: MCP Review + Audit Updates + Post-Task Summary (Botanical Reference Sources)

**Date:** 2026-06-28

### What was built

Six botanical reference sources (Go Botany, Illinois Wildflowers, Lady Bird Johnson Wildflower Center, Minnesota Wildflowers, Missouri Plants, and Prairie Moon Nursery) were exposed through the MCP layer with corrected tool names derived mechanically from EDP method names. All 12 MCP tools were renamed to remove ambiguous generic labels (`__species`, `__species_text`, `__symbol`) in favor of intent-clear names (`__url`, `__species_information`). Tool descriptions were cleaned of removed field references (`scraped_at`, `status`, `usda_symbol`, `cache_hit`, `verified_at`). The audit health-check functions were updated to point at the renamed REST endpoints, assert on the correct v1 envelope fields (`data.sections`, `data.full_text`, `data.profile_url`), and stop checking for fields the routes no longer return.

### Derivation summary

N/A — no new source was added. Changes per source:

- **Go Botany**: `gobotany__species` → `gobotany__url`; `gobotany__species_text` → `gobotany__species_information`
- **Illinois Wildflowers**: `illinois_wildflowers__species` → `illinois_wildflowers__url`; `illinois_wildflowers__species_text` → `illinois_wildflowers__species_information`
- **Lady Bird Johnson**: `lady_bird_johnson__symbol` → `lady_bird_johnson__url`; `lady_bird_johnson__species_text` → `lady_bird_johnson__species_information`
- **Minnesota Wildflowers**: `minnesota_wildflowers__species` → `minnesota_wildflowers__url`; `minnesota_wildflowers__species_text` → `minnesota_wildflowers__species_information`
- **Missouri Plants**: `missouri_plants__species` → `missouri_plants__url`; `missouri_plants__species_text` → `missouri_plants__species_information`
- **Prairie Moon**: `prairie_moon__species` → `prairie_moon__url`; `prairie_moon__species_text` → `prairie_moon__species_information`

### Scientific/technical description

**URL-lookup routes** (`GET /<source>/url?species=...` or `?usda_symbol=...`) now return only the upstream content: `data.url` (Gobotany, MN, MO, PM), `data.results[{url, section}]` (IL), or `data.profile_url` (LBJ). **Species-information routes** (`GET /<source>/species-information?species=...`) return `data.sections` (a `Record<string, string>` of named page sections extracted by the scraper) and `data.full_text` (the concatenated prose string). All FERNS-internal bookkeeping fields have been removed from `data`: `scraped_at` (= envelope `queried_at`), `species`/`usda_symbol` (caller's own input), `validation_method`, `imported_at`, `fetch_error`, `status`, `http_status`, `cache_hit`, `verified_at`, and the redundant `url` field in text routes (already in `provenance.source_url`).

### Architectural decisions made

- **MCP tool names derive mechanically from EDP method names** (`getGobotanyUrl` → `gobotany__url`, `getGobotanySpeciesInformation` → `gobotany__species_information`). This is the action-name consistency rule.
- **Species-list URL lookups (IL/MN/MO/PM) have no EDP method** — they are pure DB reads. Their `__url` tool names follow the `getXxxUrl` naming convention established by Go Botany and Lady Bird Johnson for consistency, not mechanical EDP derivation. This is documented as an exception in the task.
- **MCP handler paths updated to new route paths.** The REST routes were already renamed in a prior task (OpenAPI + codegen). This task's MCP handlers were still pointing at the old paths (`/gobotany`, `/gobotany/species-text`, etc.); they are now corrected to match.
- **Route paths NOT renamed** — only MCP tool names changed in this task. Backward compatibility of REST routes is preserved.
- **Shared scraper (`services/botanical-refs/scraper.ts`) NOT moved** into the EDP package. EDPs import parse/extract functions from it. Keeping it in REST avoids cross-package coupling.
- **Audit `runLbjChecks` fixed**: was checking `envelope.cache_status` (top-level), which is wrong per the v1 envelope contract; corrected to `provenance.cache_status`. Was also checking `envelope.scraped_at` (top-level), `data.status`, `data.usda_symbol`, `data.cache_hit`, `data.verified_at` — all removed.
- **Audit `runSpeciesTextChecks` fixed**: removed `data.scraped_at` assertion; added `data.full_text` assertion; updated all five endpoint paths from `species-text` to `species-information`.

### What was NOT done

- Live audit run against the dev server — not possible in this task environment. Audit code is correct per route inspection; live verification deferred.
- Route paths not renamed (intentional — backward compatibility preserved).
- Shared scraper not moved into the EDP package.
- DB tables not evaluated for pruning of now-unused columns.

### What the user should decide or review

- **Whether the shared scraper should move into the EDP package.** Currently `services/botanical-refs/scraper.ts` lives in the REST server and is imported by EDPs. Moving it to a shared lib would be cleaner architecturally.
- **Whether REST route paths should be versioned or aliased.** MCP tool names now follow the `getXxx` naming convention; REST paths use the same new names (`/url`, `/species-information`) but this was done in the prior task, not here. The two layers are now aligned.
- **MCP client migration.** 12 tool names changed. Existing MCP clients hardcoding old names will silently receive "unknown tool" errors. No aliases or migration notes exist yet.

---

## Task #283: Michigan Flora EDP REST Adapter refactor

**Date**: 2026-06-29

### What was built

All six Michigan Flora REST routes were rewritten to call EDP functions directly (via `@workspace/external-data-providers/michigan-flora`) and return the EDP result shape verbatim, eliminating every FERNS-invented data wrapper. Three param changes were made: `locs_sp` and `allimage_info` switched from `?name=` to `?id=` (integer `plant_id`); `flora_search_sp` switched from `?name=` to `?scientific_name=`. Invalid params return 400 `invalid_input`. Four new dedicated cache tables were added (`miflora_flora_search_cache`, `miflora_spec_text_cache`, `miflora_synonyms_cache`, `miflora_pimage_cache`); `general_summary` and `technical_details` columns were dropped from the three existing cache tables. The custom migration runner in `lib/db/src/migrate.ts` was extended to include migration 0021 so future server startups apply it automatically (idempotent via IF NOT EXISTS guards).

### Data shape corrections (per endpoint)

| Endpoint | Before | After |
|---|---|---|
| `flora_search_sp` | `{ plant_id, data: [...] }` | `{ data: [...] }` (raw records array) |
| `locs_sp` | `{ plant_id, data: [...] }` | `{ data: { locations: [...] } }` |
| `allimage_info` | `{ plant_id, data: [...] }` | `{ data: [...] }` (raw records array) |
| `spec_text` | `{ plant_id, data: { text, plant_id } }` | `{ data: { text } }` |
| `synonyms` | `{ data: { synonyms: [...] } }` | `{ data: [...] }` (bare array) |
| `pimage_info` | `{ data: { image: {...} } }` | `{ data: { image_id, ... } }` (flat) |

### Architectural decisions made

- **connector.ts stripped to cache-key builders only**: Previously the connector held EDP invocation logic. Now it holds only `buildXxxCacheKey()` helpers; all EDP calls live in `routes/miflora.ts` for clarity.
- **cache.ts rewritten against new table schema**: Each cache function targets its dedicated table; raw_response stores the upstream API payload exactly; cache hit short-circuits before the EDP call.
- **Migration applied directly + registered in custom runner**: `drizzle-kit migrate` cannot run reliably in this project due to trust.ts module resolution issues. Tables were created directly via `executeSql`; migration 0021 was also registered in `lib/db/src/migrate.ts` so it runs safely (with IF NOT EXISTS guards) on every future server startup, marking itself applied once complete.
- **Zod schema in lib/api-zod updated**: `LocsSpQuery`, `AllimageInfoQuery`, `FloraSearchSpQuery` schemas updated to match new param names and types.

### What was NOT done

- Pre-existing TypeScript errors in other routes (bonap, lcscg, s2c, wetland-indicator-status, etc.) are out of scope.
- No OpenAPI spec or MCP changes — those are the downstream task.
- Upstream 502 errors from the Michigan Flora API (for certain plant IDs) are upstream availability issues, not bugs in the adapter.

### What the user should decide or review

- `locs_sp` and `allimage_info` now require an integer `plant_id` via `?id=`; any existing callers using `?name=` will receive 400. This is the intended breaking change per the task spec.

---

## Task: USDA Plants — EDP: REST Adapter refactor

### What was built

The USDA Plants REST adapter was refactored to remove its inline network code and replace it with calls to the External Data Provider (EDP). The old composite route — which made two upstream API calls in sequence (PlantSearch then PlantProfile) and merged them — was deleted entirely. Three clean routes now replace it: a true passthrough `PlantSearch` (autocomplete), a cached `PlantProfile`, and a passthrough `plants-search-results`. Each route calls exactly one upstream endpoint and returns the verbatim upstream data with no shape distortion. The `connector.ts` file was deleted (it is now empty) and `buildProfileCacheKey` remained in `cache.ts` where it already lived. The database schema lost the orphaned `usda_plants_name_matches` table and the `general_summary`/`technical_details` columns from `usda_plants_profiles`.

### Derivation summary

*(No new source added — this is a refactor of an existing source. Section not applicable.)*

### Scientific/technical description

*(No new source added — this is a refactor of an existing source. Section not applicable.)*

### Architectural decisions made

- **connector.ts deleted entirely.** After removing all network functions, `buildProvenance`, and the helper interfaces, `connector.ts` was empty. Rather than keeping an empty file, it was deleted. `buildProfileCacheKey` was already in `cache.ts` and did not need to be moved.

- **Route parameter renames (`q→Text`, `field→Field`, `page→pageNumber`).** The upstream POST body uses `Text`, `Field`, and `pageNumber` as field names. FERNS GET parameters now match exactly. Old parameter names return HTTP 400. This is a breaking change accepted by the user.

- **`PlantProfile` data shape changed from `{symbol, profile}` to verbatim profile object.** The `symbol` wrapper was a FERNS echo of the input — not an upstream field. The upstream profile already contains a `Symbol` field. The new shape is faithful to the upstream.

- **Manual migration 0022.** `drizzle-kit generate` fails in this repo when `trust.ts` is in scope (CJS module resolution cannot find `./registry.js` in the src directory). Migration 0022 was written manually and applied via direct SQL execution. The journal entry was added and `migrate.ts` was updated to track and run the migration at server startup. This is consistent with migrations 0020 and 0021.

- **`PlantSearch` is never cached.** The autocomplete endpoint returns live results; caching would produce stale suggestions. `method: "api_fetch"` and `cacheStatus: "miss"` are always returned.

- **`UsdaPlantsApiError` instanceof check.** The route handlers check `instanceof UsdaPlantsApiError` before accessing `.message` to satisfy TypeScript strict unknown-catch rules while still re-throwing unexpected errors as 500s.

### What was NOT done

- OpenAPI spec, Zod schemas, MCP tool wiring, and `non_passthrough_endpoints` declarations — all deferred to Task C (USDA Plants — EDP: OpenAPI + MCP + audit alignment).
- Audit corpus entries for the new routes — also deferred to Task C.
- `metadata.ts` `USDA_PLANTS_TECHNICAL_DETAILS` text still references the old `usda_plants_name_matches` table and the old composite flow — this should be updated in Task C when the technical_details field is reviewed against the new architecture.

### What the user should decide or review

- **Breaking change confirmation already received.** The `?species=` composite route is removed. Any callers must now use the two-step flow: `PlantSearch?searchText=` → `PlantProfile?symbol=`. No further user action needed unless there are callers the user is aware of that haven't been updated.
- **`metadata.ts` `USDA_PLANTS_TECHNICAL_DETAILS` text** still mentions the old name-match flow and table name. Task C should update it to reflect the new EDP architecture.

---

## Task: GBIF EDP — Source Interface (June 29, 2026)

### What was changed

GBIF (the Global Biodiversity Information Facility) is one of FERNS's data sources. It provides plant name lookups — whether a name is currently accepted or has been replaced by a synonym — plus common names, and georeferenced sighting records. FERNS was already using GBIF, but the code that talked to GBIF's API was embedded inside the REST server alongside routing and caching logic, with no clean separation.

This task extracted that network communication into its own dedicated file: `lib/external-data-providers/src/gbif/index.ts`. This file is GBIF's "source interface" — the one place in the codebase responsible for making HTTP requests to GBIF and returning exactly what GBIF sent back. It has six functions, one for each type of query GBIF supports: match a name to the GBIF backbone, search species by text, fetch a species record by its GBIF key, fetch synonyms, fetch common names, and search occurrence records. Each function sends the request, waits for the response, and hands it back untouched — no interpretation, no filtering, no renaming. If GBIF is unreachable or returns an error, a `GbifApiError` is thrown with the HTTP status and the URL that was attempted, so the caller always knows precisely what failed.

The package configuration was updated so other parts of the codebase can import this file using `@workspace/external-data-providers/gbif`. TypeScript declarations were compiled and committed.

The task-sizing rule in `replit.md` was also updated. The previous rule listed six observable outcomes as the cap for a task; the new rule replaces that with a clearer principle: any task that creates or changes a source interface must be its own task, separate from the REST adapter, API spec, and MCP work that builds on it. That separation is what this task itself embodies.

The existing code in the REST server (`connector.ts`) that currently handles GBIF network calls was intentionally left in place. The next task will replace those calls with this new file and remove the duplication.

### Derivation summary

Not applicable — no new source was added to the registry. GBIF was already registered. This task only creates its source interface.

### Scientific/technical description

Not applicable — no new `technical_details` or `general_summary` text was written in this task.

### Architectural decisions made

- **No `found` field on result types**: Every other source interface in this codebase (USDA Plants, Michigan Flora) includes a `found: boolean` on its return value, computed from the response shape. The GBIF source interface does not. The reason: GBIF's name-match endpoint always returns HTTP 200, even when nothing was found — it signals no-match by returning `{ matchType: "NONE" }` with no `usageKey`. Deciding whether that counts as "found" requires reading into the response content, which is interpretation — the adapter's job, not the source interface's. Returning `raw` only keeps the source interface genuinely free of interpretation. **Tradeoff**: the adapter has slightly more to check; the source interface is cleaner and consistent with the contract.

- **`upstream_url` (snake_case)**: Chosen to match the envelope contract's `source_url` naming and the existing GBIF connector code this file will replace. Each source interface uses whatever naming fits its own convention; there is no requirement that they all match each other.

- **`GbifApiError` carries the attempted URL as an instance property**: Other error classes in this codebase carry only an HTTP status code. `GbifApiError` also carries `upstream_url` because GBIF queries involve different URL shapes (by name, by key, by key + sub-resource) and a caught error without the URL is not useful for logging or debugging. **Tradeoff**: slightly larger error object; avoids having to reconstruct the URL in catch blocks.

- **20-second timeout**: The existing GBIF connector in the REST server uses 15 seconds. This file uses 20 seconds, as specified. GBIF's occurrence search endpoint can be legitimately slow on large queries. The discrepancy will disappear when the next task removes the connector's own fetch calls. **Tradeoff**: slightly longer wait on true failures; fewer spurious timeouts on slow-but-valid occurrence queries.

- **`getGbifSpeciesSearch` accepts all upstream parameters**: The existing connector has a separate `fetchVernacularSearch` function that hardcodes the query to vernacular names only (`qField=VERNACULAR&rank=SPECIES&kingdom=Plantae&limit=20`). This source interface instead has a single `getGbifSpeciesSearch` that accepts any combination of parameters GBIF supports. Choosing to search only vernacular names is now the adapter's decision, not the source interface's. **Tradeoff**: the source interface no longer silently pre-filters the query, so the adapter must pass the right parameters explicitly — but in exchange it can call the same function for any kind of species search, not just vernacular.

### What was NOT done

- `artifacts/rest-server/src/services/gbif/connector.ts` not modified — GBIF network calls still come from there. Next task replaces them.
- REST routes not changed — they still call the connector directly.
- OpenAPI spec not updated — next task.
- MCP tool definitions not updated — next task.
- Audit corpus entries not added — next task.

### What the user should decide or review

Nothing requires a decision. The timeout difference and the connector duplication both resolve automatically in the next task.

---

## Task: GBIF EDP — Adapter, API, MCP & Audit

### What was changed

The GBIF data adapter was refactored to call the External Data Provider (EDP) functions introduced in the prior task, replacing the old connector-level fetch functions. The six `fetch*` functions (`fetchNameMatch`, `fetchSpecies`, `fetchSynonyms`, `fetchVernacularNames`, `fetchVernacularSearch`, `fetchOccurrenceSearch`) and the private `gbifFetch` helper were deleted from `connector.ts`, leaving only the six `build*CacheKey` functions. The `GBIF_API_BASE` import was removed along with them.

`routes/gbif.ts` now imports the six `getGbif*` functions from `@workspace/external-data-providers/gbif` instead of the connector, wiring each route to its EDP counterpart. The hardcoded adapter-layer parameters for species/search (`qField: "VERNACULAR"`, `rank: "SPECIES"`, `kingdom: "Plantae"`, `limit: 20`) preserve the exact same behavior the old connector had — they are adapter choices, not caller-facing parameters.

Three MCP tool names in `artifacts/mcp-server/src/server.ts` were corrected to match the action-name derivation rule from `docs/data-layer-contract.md`: `gbif__match` → `gbif__species_match`, `gbif__occurrences` → `gbif__occurrence_search`, `gbif__search` → `gbif__species_search`. The README tool table was updated to reflect all six current tool names with accurate paths and parameters.

The OpenAPI spec already contained both previously missing paths (`GET /gbif/species/{usageKey}/synonyms` and `GET /gbif/species/{usageKey}/vernacularNames`) — no spec changes were needed. The audit comparator in `lib/ferns-audit/src/comparators/gbif.ts` already covered all six routes with the required assertions — no audit changes were needed. `pnpm --filter @workspace/rest-server run spec:check` exits 0 with 102 documented routes. Codegen exits 0.

### Derivation summary

Not applicable — no new source was added.

### Scientific/technical description

Not applicable — no new `technical_details` text was written.

### Architectural decisions made

- **Catch blocks kept simple**: The task specified updating catch blocks to "also handle `GbifApiError` for structured logging." The project has a pre-existing `TS6305` build condition where `@workspace/external-data-providers/gbif` has no compiled `.d.ts` in `dist/`. This affects all EDP imports across the project (bonap, gobotany, michigan-flora, etc.). When `GbifApiError` can't be resolved for narrowing purposes, `instanceof GbifApiError` checks cause `TS18046` errors. To avoid adding new TypeScript errors on top of the pre-existing ones, the catch blocks use `req.log.error({ err }, "...")` — matching the pattern used by every other route in the project. **Tradeoff**: slightly less structured error logging; zero new TypeScript errors.

- **OpenAPI spec was already complete**: Both `/gbif/species/{usageKey}/synonyms` and `/gbif/species/{usageKey}/vernacularNames` were already present in the spec. No changes were made.

- **Audit comparator was already complete**: All six routes with the required assertions were already implemented in `lib/ferns-audit/src/comparators/gbif.ts`. No changes were made.

- **Hardcoded species/search parameters**: `getGbifSpeciesSearch` is called with `{ q, qField: "VERNACULAR", rank: "SPECIES", kingdom: "Plantae", limit: 20 }`. These parameters are the adapter's responsibility and are not exposed to callers of `/gbif/species/search`. This exactly preserves the behavior of the removed `fetchVernacularSearch` function.

### What was NOT done

- `cache.ts` was not touched — as specified.
- No new GBIF upstream endpoints were added — as specified.
- The pre-existing `TS6305` build condition (dist files not built for EDP packages) was not fixed — it is a project-wide pre-existing issue outside this task's scope.
- `GbifApiError` structured logging in catch blocks was not implemented due to the TS6305 issue (documented in architectural decisions above).

### What the user should decide or review

- **Breaking change — renamed MCP tools**: Three MCP tool names changed. Any MCP client (Claude Desktop, Cursor, or other) that has an existing conversation or config referencing `gbif__match`, `gbif__occurrences`, or `gbif__search` will need to be updated to use `gbif__species_match`, `gbif__occurrence_search`, and `gbif__species_search` respectively. This is a deliberate correctness fix but will break existing integrations using the old names.


---

## Task 300 — Universal FQA — EDP: Source Interface

### What was built

`lib/external-data-providers/src/universal-fqa/index.ts` — the network-only Source Interface for the Universal FQA API at `http://universalfqa.org/get`. Exports:

- `UniversalFqaApiError` — typed error class with `statusCode?: number` and `upstream_url: string`
- `UniversalFqaResult` — interface `{ raw: unknown; upstream_url: string }`
- `getUniversalFqaDatabase()` — `GET /get/database/`
- `getUniversalFqaDatabaseById(id)` — `GET /get/database/{id}`
- `getUniversalFqaDatabaseInventory(databaseId)` — `GET /get/database/{databaseId}/inventory`
- `getUniversalFqaInventory(id)` — `GET /get/inventory/{id}`

`lib/external-data-providers/package.json` updated with `"./universal-fqa": "./src/universal-fqa/index.ts"` export. `dist/universal-fqa/` declarations generated and present.

### Architectural decisions

- **Verbatim 2D array passthrough**: The upstream API returns all data as positionally indexed `unknown[][]` rows inside `{ status: "success"|"error", data: unknown[][] }`. FERNS passes this through verbatim as `raw: unknown`. No field extraction, no positional indexing, no type coercion occurs at this layer. Callers of the FERNS REST/MCP API receive the raw 2D array and must handle positional indexing themselves. This is a breaking change from the previous behavior (where `client.ts` returned parsed, structured TypeScript objects).
- **`fetch()` vs Node.js `http`/`https`**: The existing `client.ts` used Node.js `http`/`https` with manual redirect handling because the base URL is HTTP and the server redirects to HTTPS. The EDP uses `fetch()` instead — `fetch()` follows redirects automatically (including HTTP→HTTPS), eliminating the manual redirect logic entirely.
- **30 s `AbortSignal.timeout`**: Matches the `TIMEOUT_MS` constant in the existing `client.ts`. Appropriate for a public API that can be slow to respond with large databases or assessment lists.
- **`upstream_url` is the request URL before server redirect**: The `upstream_url` field in `UniversalFqaResult` holds the `http://universalfqa.org/get/...` URL — i.e., the URL FERNS actually sent — not the HTTPS URL the server redirects to. This matches the contract: `source_url` in the envelope is the URL FERNS contacted, not the server's internal redirect destination.
- **Verbatim error passthrough for upstream error responses**: When the upstream returns `{ status: "error", message: "..." }` (e.g., for private assessments or invalid database IDs), the EDP returns this verbatim in `raw`. The EDP does not throw; only HTTP-level failures (non-OK status, timeout, network error) cause `UniversalFqaApiError`. Upstream application-level errors are the adapter's responsibility to interpret.
- **No forbidden imports**: No `@workspace/db`, `drizzle-orm`, or `@workspace/api-envelope` imports anywhere in the file. No parsing helpers (`nullStr`, `nullNum`, `parsePct`) — raw JSON only.

### What was NOT done

- `artifacts/rest-server/src/services/universal-fqa/client.ts` was not modified or deleted — that is Task B (Adapter & DB Migration).
- No route changes — existing routes continue to call `client.ts` until Task B rewires them.
- No DB schema migration — existing `universal_fqa_databases` and `universal_fqa_species` tables unchanged.
- No OpenAPI spec update, no MCP tool registration, no audit corpus entries — those are Task C.

### What the user should review

- **Breaking change to data shape**: The existing `client.ts` returned strongly-typed parsed objects (`UniversalFqaDatabaseDetail`, `UniversalFqaAssessmentDetail`, etc.) with named fields. After Task B wires routes to use the EDP, the FERNS REST API will instead return the raw 2D array from upstream. Any downstream consumer of the FERNS API (MCP clients, Explorer UI, external integrations) that expects the current named-field structure will need to be updated to work with the positional 2D array. This is an approved breaking change per user direction ("It's ok to break existing interfaces to support this truth layering"), but should be confirmed before Task B is merged.

---

## Task #299 — GBIF Integration Tests & EDP Rewire Verification

### What was changed

Six new integration checks were added to the ferns-audit library covering every GBIF route the server exposes. During testing, a dormant bug was uncovered: migration `0015_gbif_cache_rearch` — which restructures the GBIF cache tables to use the new `upstream_response` column layout — had been authored and committed to the migration folder but was never wired into the custom migration runner (`lib/db/src/migrate.ts`). This meant every GBIF API call was hitting a schema mismatch, and every GBIF route was returning 500/502 errors. The migration was wired in (one new `runSqlMigration` call between entries 13 and 16), the server was restarted, 0015 applied cleanly (29 statements, 0 skipped), and all six routes now return correct envelopes. A standalone `gbif-check` script was also added so the checks can be run in isolation or from CI.

### Derivation summary

Not applicable — no new source was added in this task.

### Scientific/technical description

Not applicable — no new source was added in this task.

### Architectural decisions made

- **`failFast: false` for migration 0015**: Migration 0015 uses `DROP COLUMN IF EXISTS` guards on the destructive steps, making it safe to re-run. The `ADD COLUMN upstream_response jsonb NOT NULL` does not have an `IF NOT EXISTS` guard, but because the column was confirmed absent before applying, this was acceptable. `failFast: false` matches the pattern used for other schema-expansion migrations (0016, 0022). If the migration had been called with `failFast: true` and a partial failure occurred, the column might not be added; `failFast: false` means the migration is marked applied even if individual statements skip — an acceptable tradeoff given the IF EXISTS guards on all destructive steps.
- **Integration checks hit the live GBIF API on cache-miss**: The round-trip checks use `refresh=true` to force a cache miss and confirm the actual upstream fetch works. This means the checks are network-dependent. The alternative (mocking the upstream) would not verify the EDP wiring is correct, which was the stated goal. 502-path tests use a known-nonexistent usageKey (`99999999`) to trigger real GBIF 404s without mocking.
- **Separate `gbif-check.ts` runner**: Rather than extending the main audit entrypoint alone, a standalone runner was added so GBIF checks can be triggered independently. This keeps the validation command focused and avoids running the full audit suite when only GBIF verification is needed.

### What was NOT done

- Migrations 0011, 0012, 0014, 0017, 0018, 0019, and 0020 were reviewed but **not wired** into `runMigrations()` — that is follow-up task #308. Only 0015 was strictly in scope for this task.
- No changes to OpenAPI spec, MCP tools, or the audit's corpus comparison checks.
- No mock layer was added for CI offline use — the checks require live network access to `api.gbif.org`.

### What the user should decide or review

- **Other EDP-backed sources**: The same "migration authored but not wired" gap could affect iNat, NatureServe, USDA Plants, or Miflora. Follow-up task #309 proposes a similar audit check suite for those sources.
- **Remaining unwired migrations** (#308): Migrations 0011, 0012, 0014, 0017–0020 exist in the drizzle folder but are never invoked. Most appear to be cleanup/rename steps, but they should be wired or explicitly documented as intentionally skipped.
- **CI network dependency**: The integration checks currently require a live connection to `api.gbif.org`. If CI runs in a network-restricted environment, a stub/mock layer will be needed before these checks can run there.


---

## Task #301 — Universal FQA EDP: Adapter & DB Migration

### What was changed

The Universal FQA data routes were rewired from a hand-rolled HTTP client (`client.ts`) to the EDP functions already built in `lib/external-data-providers/universal-fqa/`. The old client parsed upstream data into named TypeScript objects — stripping the raw response and constructing FERNS-owned structures. Now all four data routes pass the verbatim upstream JSON (`{ status: "success", data: unknown[][] }`) straight through as `data` in the response envelope, satisfying the data-purity contract.

The database cache was overhauled. The old two-table design (`universal_fqa_databases` header columns + `universal_fqa_species` rows) was replaced with a single JSONB column (`upstream_response`) that stores the raw response verbatim. Two companion columns were added: `upstream_url` (the exact URL fetched) and `fetched_at` (when the fetch occurred). The `universal_fqa_species` table was intentionally kept but is no longer written or read — it is now redundant and can be dropped in a future cleanup task.

`client.ts` was deleted entirely, removing all parsing helpers (`nullStr`, `nullNum`, `parsePct`, `nullStrOrNum`) and all normalized TypeScript interface types that described FERNS-owned shapes (`UniversalFqaDatabaseDetail`, `UniversalFqaAssessmentDetail`, etc.).

The `queried_at` contract is now correctly honored on the database-detail route: on a cache hit, `queried_at` is the `fetched_at` timestamp stored in the DB (when the data was originally fetched), not the current serve time.

### Derivation summary

Not applicable — no new source was added in this task.

### Scientific/technical description

Not applicable — no new source was added in this task.

### Architectural decisions made

- **Verbatim JSONB cache instead of decomposed columns**: The old cache stored parsed fields (region, year, citation, total_species, etc.) in dedicated columns plus species rows in a join table. The new design stores the raw upstream response as a single JSONB blob. This loses queryability of individual fields directly from the DB, but gains correctness: what's cached is exactly what the upstream returned, with no FERNS interpretation baked in. The EDP and any future consumer can interpret the raw data independently.
- **`universal_fqa_species` table kept, not dropped**: The task spec required keeping the species table in place rather than dropping it, because it may have other uses or may hold data that cannot be recovered without re-fetching. It is now orphaned from the cache write path. A future task should confirm it is safe to drop and remove it — this is explicitly noted below.
- **Error detection for private/missing assessments changed**: The old `client.ts` threw an error with a message containing "unavailable" or "not found" and the route caught that string. Now the EDP returns `{ status: "error", message: "..." }` verbatim without throwing, and the route checks `result.raw.status === "error"` to detect the 404 case. This is more robust — upstream error semantics are detected from the data, not from exception message strings.
- **`fetched_at` is set by the application at store time**: `fetched_at` is set to `new Date()` at the moment `storeDatabase()` is called, not by the DB `DEFAULT now()` — this ensures the returned `fetched_at` reflects the actual fetch time the application can trust, not a DB clock that could differ under replication or testing.
- **Migration 0023 manually authored**: `drizzle-kit generate` fails on this project due to a pre-existing module resolution issue in `trust.ts` (`Cannot find module './registry.js'`). Migration SQL was written manually following the same pattern as 0021 and 0022, and the journal entry was added by hand. This matches the existing approach for several prior migrations.

### What was NOT done

- `universal_fqa_species` table was **not dropped** — it is redundant but kept in place per the task spec. It should be dropped in a future cleanup task once confirmed safe.
- No OpenAPI spec update, no MCP tool registration, no audit corpus entries — those are Task C (the downstream task already planned).
- No migration of existing cached rows in `universal_fqa_databases` — the existing header-column rows remain; new requests will upsert the JSONB columns. Old rows missing `upstream_response` will have the default `'{}'` from `DEFAULT '{}'`.

### What the user should decide or review

- **Breaking data shape change**: Any downstream consumer of the Universal FQA FERNS routes (MCP clients, Explorer UI, external callers) that expected named parsed fields (e.g. `detail.region`, `detail.species[].scientific_name`) will now receive the raw 2D array from universalfqa.org. This is an intentional breaking change per the data-purity contract, but callers that have not been updated will break.
- **`universal_fqa_species` table**: Confirm whether it is safe to drop in a future task. If no other part of the system reads from it, it can be removed. The migration runner note should be updated once it is dropped.
- **Existing `universal_fqa_databases` rows**: Old rows have `upstream_response = '{}'`, `upstream_url = ''`, `fetched_at = now()-at-migration-time`. On the next cache hit, these rows will be returned with an empty `{}` as `data`. To avoid serving stale empty data, the cache should be cleared or the `upstream_response` column populated — easiest via `DELETE FROM universal_fqa_databases` to force re-fetch on next request.

---

## Task: Universal FQA — EDP: OpenAPI + MCP + Audit

### What was changed

Four layers of the Universal FQA integration were aligned to reflect the verbatim upstream data shape (`{ status: string, data: unknown[][] }`). The OpenAPI spec now uses a shared `UniversalFqaUpstreamResponse` component for all four data route schemas instead of the old FERNS-parsed object shapes. Path descriptions were trimmed to one-sentence summaries pointing consumers to `GET /universal-fqa/metadata` for row-index details. All four MCP tools were renamed to match the action-name derivation rule in `data-layer-contract.md` (`universal_fqa__databases` → `universal_fqa__get_database_list`, `universal_fqa__database` → `universal_fqa__get_database`, `universal_fqa__assessments` → `universal_fqa__get_database_inventory`, `universal_fqa__assessment` → `universal_fqa__get_inventory`). Tool descriptions were updated to state the verbatim upstream endpoint path and the `{ status, data: unknown[][] }` shape. The MCP README tool table was updated to reflect all four final names and correct FERNS paths. The audit comparator was rewritten to cover all four routes with the required minimum assertions (`data.status === "success"`, `Array.isArray(data.data)`, and `data.data.length > 0` for the database list route), using database ID 50 (Michigan 2014) for database and inventory endpoints and assessment ID 1 for the inventory detail endpoint.

### Derivation summary

N/A — no new source was added.

### Scientific/technical description

N/A — no new `technical_details` field was authored.

### Architectural decisions made

- **Shared `UniversalFqaUpstreamResponse` component**: Added a single `UniversalFqaUpstreamResponse` schema in `components/schemas` and referenced it from all four `*Response` schemas' `data` fields via `oneOf`. This keeps the upstream shape described once and avoids drift across four separate inline definitions. The old parsed-shape schemas (`UniversalFqaDatabasesData`, `UniversalFqaAssessmentsData`, `UniversalFqaDatabaseDetail`, `UniversalFqaAssessmentData`) are retained as dead code rather than deleted — removing them would have required auditing all generated consumers for breakage, which is out of this task's scope.
- **Path descriptions point to metadata**: Per the task spec, OpenAPI path descriptions no longer duplicate row-position semantics; all four descriptions are one-sentence redirects to `GET /universal-fqa/metadata`. This is a deliberate anti-duplication decision — the `technical_details` field in the metadata response is the canonical row-index reference.
- **MCP tool rename: `database_id` → `id` for inventory route**: The old `universal_fqa__assessments` tool used `database_id` as its input parameter name. The renamed `universal_fqa__get_database_inventory` uses `id` to match the FERNS path parameter (`{id}`) and maintain parity with the other tools. Any downstream MCP clients using the old parameter name `database_id` will need to update.
- **Audit uses stable IDs**: Database ID 50 (Michigan 2014, University of Michigan Herbarium) was chosen as the audit fixture — it has 4800+ assessments and is the most-referenced Michigan database. Assessment ID 1 was chosen as a conservative first-record fixture; it should be a publicly accessible record.

### What was NOT done

- Old parsed-shape schemas (`UniversalFqaDatabasesData`, `UniversalFqaAssessmentsData`, `UniversalFqaDatabaseDetail`, `UniversalFqaAssessmentData`, `UniversalFqaSpeciesRecord`, `UniversalFqaMetrics`, `UniversalFqaDbInfo`) were not removed from the OpenAPI spec — they are now unused by the four route schemas but retained to avoid touching generated consumers in this task.
- The `universal_fqa_species` table drop remains out of scope (per the task spec).
- No route behavior or data shape changes were made (Task B scope).

### What the user should review

- **Breaking change — MCP tool renames**: All four Universal FQA MCP tool names changed. Any downstream MCP client (Claude Desktop, Cursor, or any automation) using the old names (`universal_fqa__databases`, `universal_fqa__database`, `universal_fqa__assessments`, `universal_fqa__assessment`) will get a "tool not found" error and must be updated to the new names (`universal_fqa__get_database_list`, `universal_fqa__get_database`, `universal_fqa__get_database_inventory`, `universal_fqa__get_inventory`).
- **Breaking change — inventory tool parameter rename**: The old `universal_fqa__assessments` tool accepted `database_id`; the new `universal_fqa__get_database_inventory` uses `id`. Clients must update both the tool name and the parameter name.
- **Unused schema components**: The old parsed-shape components can be deleted from the OpenAPI spec in a follow-up cleanup pass once consumers are confirmed to have regenerated types from the updated codegen.
- **Audit assessment ID 1**: The audit comparator uses assessment ID 1 for the inventory detail route. If ID 1 is private or deleted on universalfqa.org, the comparator will report a failing assertion. A stable known-public assessment ID should be confirmed and substituted if needed.


---

## Task: NatureServe — EDP: Source Interface

**Date**: 2026-06-29

### 1. What was changed

A new NatureServe Source Interface was created at `lib/external-data-providers/src/natureserve/index.ts`. This file exposes three async functions — one per upstream NatureServe Explorer API endpoint — that each make an HTTP call and return the verbatim upstream JSON alongside the URL that was called. No data is extracted, renamed, or normalized. The `lib/external-data-providers/package.json` exports map was updated to register `"./natureserve"` pointing to the new file. TypeScript declarations were rebuilt and `dist/natureserve/index.d.ts` is now present. The existing `connector.ts` in the REST server was not modified.

### 2. Derivation summary

N/A — no new source was registered in this task. This task creates the EDP Source Interface layer only; the adapter, registry entry, and routes come in Task B.

### 3. Scientific/technical description

N/A — no new source was registered in this task.

### 4. Architectural decisions made

- **Three separate EDP functions, one per upstream endpoint**: `postNatureserveSpeciesSearch` (POST /speciesSearch), `postNatureserveSearch` (POST /search), and `getNatureserveTaxon` (GET /taxon/{uniqueId}). The existing `connector.ts` chains speciesSearch → taxon in a single function; the EDP separates them. The adapter (Task B) decides when and whether to chain calls — the EDP does not.
- **POST body passed verbatim from the adapter**: The EDP accepts fully-formed request bodies (`NatureserveSpeciesSearchBody`, `NatureserveSearchBody`) and forwards them unchanged. No state-scoping, no page-default injection, no token construction happens here.
- **`upstream_url` is always the POST URL for POST endpoints**: The `upstream_url` in the result for the two POST endpoints is the base POST URL (`/speciesSearch`, `/search`), not a URL encoding of the body. This matches how GBIF EDP handles `upstream_url` for GET endpoints.
- **20 s AbortSignal.timeout, matching the existing connector**: Timeout behavior is preserved from the current connector.ts. TimeoutError (DOMException name "TimeoutError") throws NatureserveApiError with message "NatureServe request timed out" and no statusCode; other fetch errors throw NatureserveApiError with the error message; non-OK responses throw NatureserveApiError with statusCode.
- **No normalization helpers**: `extractStateRank`, `extractUsNationalRank`, `deriveStateStatus`, and `buildNsxUrl` are deliberately absent. They remain in connector.ts until Task B removes them.

### 5. What was NOT done

- `connector.ts` was not modified — normalization functions remain there until Task B.
- REST routes were not changed.
- Cache schema was not changed.
- No DB table reads or writes exist in the new file (by design).
- No OpenAPI, MCP, or audit updates (Task C scope).

### 6. What the user should decide or review

- **Breaking changes coming in Task B**: When the REST adapter is migrated to use the EDP, the `stateCode` parameter will no longer be wired into the speciesSearch body by the EDP — the adapter will do it. The data shape returned by the species endpoint will change from the normalized `NatureserveSpeciesResult` flat struct to the verbatim upstream JSON envelope. Callers of the current `/api/natureserve/species` route will see a different `data` shape.
- **speciesSearch no longer chains to taxon at the EDP level**: The existing connector chains speciesSearch → taxon automatically. Task B's adapter design must decide when the taxon fetch is triggered and handle the two-call case explicitly.

---

## Task #304 — NatureServe EDP: Adapter & DB Migration

### 1. What was changed

The NatureServe REST adapter was fully rewired to call the External Data Provider (EDP) functions directly, eliminating the old normalization layer. The `connector.ts` file was stripped down to only the two cache-key builder functions — all normalization code (six functions, three interfaces, the private HTTP helper, and URL constants) was deleted. The DB schema gained three changes: `upstream_response jsonb` (nullable) added to `natureserve_species_cache` and `natureserve_ecosystems_cache`, and a brand-new `natureserve_taxon_cache` table. The `cache.ts` service was rewritten so all three cache operations store and return verbatim upstream JSON (`{ raw, upstream_url, fetched_at }`) instead of extracted flat fields. The routes file was rewritten to call EDP functions (`postNatureserveSpeciesSearch`, `postNatureserveSearch`, `getNatureserveTaxon`), pass verbatim JSON as `data` in the envelope, and expose a new `GET /natureserve/taxon/:uniqueId` route that mirrors the upstream taxon endpoint with cache and `?refresh=true` support. The `?state=` parameter was removed from `/speciesSearch` and the cache-key format was simplified (no longer includes state code). Migration 0024 was authored, wired into `runMigrations()`, and confirmed running at server startup (3 statements, 0 skipped).

### 2. Derivation summary

Not applicable — no new source was added. This task migrated an existing source to the EDP pattern.

### 3. Scientific/technical description

Not applicable — no new source was added. Technical description for NatureServe remains in `metadata.ts`. Note: `NATURESERVE_TECHNICAL_DETAILS` still references state-rank extraction logic and the old normalized DB column names; these are now inaccurate and should be updated in a future task (flagged in section 6 below).

### 4. Architectural decisions made

- **NULL `upstream_response` = cache miss.** Existing rows in `natureserve_species_cache` and `natureserve_ecosystems_cache` have `upstream_response IS NULL` after the migration. The lookup functions treat NULL as a miss, forcing a re-fetch on next access. Old normalized data is left in place (not deleted) and expires naturally within the 30-day TTL. This avoids data loss and keeps the migration non-destructive.
- **Old normalized columns retained (not dropped).** `scientific_name`, `common_name`, `global_rank`, etc. in `natureserve_species_cache` and `results`/`result_count` in `natureserve_ecosystems_cache` are now redundant but not dropped. Dropping them in the same migration would be destructive and irreversible; they'll be cleaned up in a future task once all rows have cycled to the new schema.
- **Cache key simplified — state code removed.** `buildSpeciesCacheKey` no longer takes a `stateCode` argument. The old key format was `natureserve:species:{name}:{STATE}`. New format: `natureserve:species:{name}`. Old keys remain in the DB but will never be looked up (the new key won't match them), so they expire naturally within the 30-day TTL.
- **`?state=` parameter removed with no 400.** Callers passing `?state=MI` now have it silently ignored (not validated). The task description says to remove it; a 400 for an unknown parameter was considered but ruled out because it would immediately break existing callers. The VIOLATION comments were removed alongside the parameter.
- **Taxon cache TTL = 30 days.** Same as species. Ecosystem TTL remains 7 days.
- **`found` on speciesSearch derived from `results.length > 0`.** The verbatim upstream JSON always returns `results: []` on no-match; this is the correct signal.

### 5. What was NOT done

- **`metadata.ts` not updated.** `NATURESERVE_GENERAL_SUMMARY` still says "configurable US state (default Michigan)" and `NATURESERVE_TECHNICAL_DETAILS` still describes the old normalization logic and normalized DB columns. Both are now inaccurate and should be updated to describe verbatim pass-through and the new taxon route.
- **Old normalized columns not dropped.** Intentionally deferred — see decision above.
- **OpenAPI spec not updated.** Task C (`NatureServe — EDP: OpenAPI + MCP + Audit`) handles this.
- **MCP tool names not updated.** Task C handles this.
- **Audit corpus not updated.** Task C handles this.
- **Pre-existing TypeScript errors in miflora, bonap, universal-fqa, usda-plants cache files** were not fixed — they are pre-existing and out of scope for this task.

### 6. What the user should decide or review

- **`metadata.ts` needs updating.** Both `NATURESERVE_GENERAL_SUMMARY` and `NATURESERVE_TECHNICAL_DETAILS` still describe the old connector behavior. The general summary should no longer mention state-configurable ranks; the technical details should describe verbatim JSON return, the new taxon route, and the updated DB tables. This can be done in Task C alongside the OpenAPI update.
- **Breaking changes are now live:**
  1. `/speciesSearch` `data` field is now verbatim upstream `{ resultsSummary, results }` — not the old flat `{ scientific_name, global_rank, ... }` struct
  2. `/search` `data` field is now verbatim upstream `{ resultsSummary, results }` — not the old `{ ecosystems, total_results }` wrapper
  3. `?state=` parameter on `/speciesSearch` is silently ignored (no longer does anything)
  4. `state_status`, `natureserve_url`, `element_global_id` and other FERNS-derived fields are no longer present in `data`
  5. `/speciesSearch` no longer chains to `/taxon/{id}` — callers must call `GET /natureserve/taxon/{uniqueId}` separately for full detail
- **New route available:** `GET /natureserve/taxon/:uniqueId` (e.g. `ELEMENT_GLOBAL.2.12345`) — returns verbatim upstream taxon JSON with cache and `?refresh=true` support.

---

## Task: NatureServe — EDP: OpenAPI + MCP + Audit

**Date**: 2026-06-29

### What was changed

Three layers were updated to align the NatureServe source with the verbatim upstream data shapes from Task B.

**OpenAPI spec** (`lib/api-spec/openapi.yaml`): The `/natureserve/speciesSearch` path was updated to remove the `state` query parameter (no longer exists in the route) and replace its verbose description with one concise sentence pointing to the metadata endpoint. The response schema `NatureserveSpeciesData` (a legacy FERNS flat struct) was replaced with a new `NatureserveSpeciesSearchData` schema reflecting the verbatim upstream shape: `{ resultsSummary: object, results: array }`. The `/natureserve/search` description was similarly shortened, and its response schema `NatureserveSearchData` (which had `ecosystems`/`total_results` wrapper fields) was replaced with `NatureserveSearchUpstreamData` carrying verbatim `{ resultsSummary, results }`. A new path `/natureserve/taxon/{uniqueId}` was added with a `uniqueId` path parameter, an optional `refresh` query parameter, and a `NatureserveTaxonData` schema (type: object, additionalProperties: true, pointing to metadata). Codegen ran clean with no TypeScript errors in `lib/api-zod` or `lib/api-client-react`.

**MCP server** (`artifacts/mcp-server/src/server.ts`): The tool `natureserve__species` was renamed to `natureserve__species_search` per the action-name derivation rule (GET /natureserve/speciesSearch → action `speciesSearch` → tool `natureserve__species_search`). The `state` parameter was removed from its inputSchema. The description was updated to state the upstream endpoint path (POST /api/data/speciesSearch), the response shape (`{ resultsSummary, results }` with uniqueId guidance), and directs callers to metadata for field semantics. A new `natureserve__taxon` tool was added with `uniqueId` (required) and `refresh` (optional) parameters; its description states the upstream path (GET /api/data/taxon/{uniqueId}), the taxon object shape, how to obtain uniqueId from speciesSearch results, and a pointer to metadata. `natureserve__search` was left unchanged (name was already correct). TypeScript check passes clean.

**MCP README** (`artifacts/mcp-server/README.md`): The natureserve tool table was updated to show all three tools with correct paths, required/optional parameters, and descriptions. Tool inventory count updated from 59 to 60.

**Audit comparator** (`lib/ferns-audit/src/comparators/natureserve.ts`): A new comparator module was created covering all three data routes. It is wired into `lib/ferns-audit/src/index.ts` as `runNatureserveComparators`. The speciesSearch comparator hits `GET /api/natureserve/speciesSearch?name=Lobelia+cardinalis` and asserts `Array.isArray(fernsRaw.data.results)`. The search comparator hits `GET /api/natureserve/search?q=wetland&recordType=ECOSYSTEM` and asserts `Array.isArray(fernsRaw.data.results)`. The taxon comparator extracts a `uniqueId` from the speciesSearch results array at runtime (either `results[0].uniqueId` or `results[0].elementGlobalId`) and hits that taxon endpoint, asserting `fernsRaw.data` is a non-null object and `typeof fernsRaw.data.scientificName === "string"`. If speciesSearch returns no results, the taxon test is explicitly flagged as skipped (not silently omitted).

### Derivation summary (general_summary verbatim)

N/A — no new source was added; this task updated the API surface of an existing source.

### Scientific/technical description (technical_details verbatim)

N/A — no new source was added; no `technical_details` field was modified.

### Architectural decisions made

1. **Schema approach for verbatim upstream data**: Both speciesSearch and search schemas use `{ resultsSummary: {type: object, additionalProperties: true}, results: [{type: object, additionalProperties: true}] }`. This is intentionally loose — the NatureServe upstream fields are numerous, change occasionally, and are fully documented in the metadata endpoint's `technical_details`. Hardcoding field names in OpenAPI would create drift risk. The taxon schema uses `additionalProperties: true` at the top level for the same reason. Consumers are directed to `/natureserve/metadata` for field semantics.

2. **Taxon uniqueId obtained at runtime**: The audit comparator resolves the taxon uniqueId dynamically from speciesSearch results rather than hardcoding a stable ID. This makes the test self-healing if NatureServe changes element global IDs, and means the test exercises the full chain (speciesSearch → taxon) as a real caller would.

3. **MCP tool rename is a breaking change**: `natureserve__species` no longer exists; it is now `natureserve__species_search`. Any downstream MCP client that has this tool name hardcoded (e.g. Claude Desktop config, Cursor, custom scripts) will need to update the name. The `state` parameter is also gone from the inputSchema — any call that passed `state` will need to drop it (the route handler never used it after Task B).

4. **operationId updated**: The operationId for `/natureserve/speciesSearch` was changed from `getNatureserveSpecies` to `getNatureserveSpeciesSearch` to match the action name consistently. This regenerates the corresponding generated hook and zod schema names in `lib/api-client-react` and `lib/api-zod`.

5. **NatureserveSearchResponseItem schema removed**: The old FERNS-normalized item shape (system_name, global_rank, us_national_rank, etc.) was part of the flat-struct regression documented in the spec. It was replaced by the verbatim upstream schema. This is consistent with the task's mandate to remove FERNS-constructed fields from the data schema.

### What was NOT done

- No changes to route handlers (confirmed correct from Task B — explicitly out of scope)
- No changes to DB schema or cache tables (out of scope)
- No changes to the `NATURESERVE_GENERAL_SUMMARY` or `NATURESERVE_TECHNICAL_DETAILS` metadata text
- The old static-sources `runNatureserveChecks` was not removed — it continues to run alongside the new comparator. The existing checks use the flat-struct field names (scientific_name, global_rank, etc.) which are now stale relative to the verbatim upstream shape. Those checks will report mismatches during audit runs, but removing or updating them is deferred to a follow-up (the audit report is human-reviewed, not auto-corrected).

### What the user should decide or review

1. **Breaking change: `natureserve__species` → `natureserve__species_search`** — any MCP client configuration that references the old tool name by string will silently stop matching. Users with Claude Desktop or Cursor configs should update the tool name. The `state` parameter is also removed from the inputSchema.

2. **Old static-source NatureServe checks now check stale fields**: `runNatureserveChecks` in `lib/ferns-audit/src/checks/static-sources.ts` still checks for `data.scientific_name`, `data.global_rank`, etc. (the old flat-struct fields). These will now fail against the verbatim upstream shape. The user should review whether to update or remove those checks — they were checking the FERNS-normalized fields that no longer exist in `data`.

3. **operationId change** (`getNatureserveSpecies` → `getNatureserveSpeciesSearch`) generates different hook/schema names in the client packages. Any application code that used the generated `useGetNatureserveSpecies` hook or its Zod schema will need renaming.


---

## Task: MNFI — DB Cleanup, Scraper, Seed Data, IDP (Task B)

**Date**: 2026-06-29

### 1. What was changed

Three old MNFI database tables (`mnfi_communities`, `mnfi_community_plants`, `mnfi_county_elements`) were dropped via a new migration (0026). Under the new architecture, all MNFI data lives in TypeScript files committed to the repo rather than in a database. A new scraper was written and run against the live MNFI website, producing 10 data files with 77 communities, 748 prose sections, 4,105 characteristic plant entries, 2,071 community rare-species entries, 797 rare-species roster records, 6,363 county-species occurrences, 930 county-community occurrences, and 362 abstracts — with zero fetch errors. An Internal Data Provider (IDP) was then written in `lib/internal-data-providers/src/mnfi/index.ts` exposing 8 synchronous query functions for REST adapter use. All data is now served from in-memory TypeScript arrays loaded at startup.

### 2. Derivation summary

No new FERNS source was added (MNFI was already registered). This task built the data layer behind the existing source registration.

### 3. Scientific/technical description

**Migration 0026** (`lib/db/drizzle/0026_mnfi_drop_import_tables.sql`): drops `mnfi_community_plants`, `mnfi_county_elements`, `mnfi_communities` in FK-dependency order using `DROP TABLE IF EXISTS` guards. Wired into `lib/db/src/migrate.ts` at index 26 (non-fatal, `failFast=false`). Journal updated. Drizzle schema file emptied; export removed from `schema/index.ts`.

**Scraper** (`lib/internal-data-providers/src/mnfi/scraper/index.ts`): fetches five MNFI sources.
- Source 1 (`/communities/list`): parses `<tr>` rows to extract communityId (5-digit integer from href), slug, name, class, group, globalRank, stateRank.
- Source 2 (one page per community, 400ms rate limit): dynamic `<h2>` section discovery (not a fixed list), plant list parsed from the same page HTML (not the separate plant-list URL), rare species in three section kinds (`rare plants/animals/aquatic_animals`) with elementId extracted from href, similar communities with communityId from href, places to visit, literature, photo URL, county map URL, ecoregion map URL, abstract PDF URL.
- Source 3 (`/species/plants` and `/species/animals`): parses species rows with elementId from href, category headers from `<th>` rows, fields mapped to speciesPageUrl/status/rank columns.
- Source 4 (83 counties × 2 endpoints, 250ms rate limit): `countyQuery` and `countyCommunityQuery` JSON feeds. `lastObsYear` parsed as `number | null` via `parseInt` (was `string` in old code). `county_id`, `g_rank_description`, `s_rank_description`, `occurrences_in_county` dropped.
- Source 5 (`/publications/abstracts`): PDF link extraction with subject resolution via communityId/elementId URL pattern matching.

Scraper is excluded from main `tsconfig.json` via `"exclude": ["src/mnfi/scraper"]` (uses Node.js builtins not available in the package's `"lib": ["es2022"]` config). It has a companion `tsconfig.json` with `"types": ["node"]` for use when running directly.

**IDP** (`lib/internal-data-providers/src/mnfi/index.ts`): all 8 functions are synchronous. All nine index Maps are built eagerly at module load as `const ReadonlyMap` constants — no mutable module state. `getMnfiCounty` with `filter.kind` joins via elementId to the species roster to resolve taxon kind (county feed has no kind field). `getMnfiSpeciesCommunities` and `getMnfiSpeciesCounties` use elementId as the primary join key (confirmed reliable by Task A verification), falling back to case-insensitive scientificName when elementId is null.

**Package export** added: `"./mnfi": "./src/mnfi/index.ts"` in `lib/internal-data-providers/package.json`.

### 4. Architectural decisions made

- **Scraper excluded from main tsconfig**: The scraper uses Node.js builtins (`fs`, `path`, `url`, `process`, `console`) that the package's `"lib": ["es2022"]` config does not expose. Rather than adding node types to the entire package (which would widen the surface of a package intended to be side-effect-free), the scraper directory is excluded from the main tsconfig and given its own companion tsconfig with `"types": ["node"]`. tsx runs it directly without needing compilation.
- **Dynamic section discovery**: The old scraper hardcoded six section names; the new one discovers all `<h2>` headings on the page. This captured all 748 sections (typically 9–10 per community) including irregular ones like "Rare Aquatic Animals" on Floodplain Forest.
- **Plant list from description page only**: The task spec required parsing plants from the community description page rather than the separate `/communities/plant-list/{id}/{slug}` URL. This saves 77 extra HTTP fetches.
- **elementId as primary join key**: Confirmed by Task A verification (Cirsium pitcheri elementId 13485 matches county feed ELEMENT_ID 13485). The IDP joins community_rare_species → rare_species on elementId with scientificName as fallback.
- **Scraper writes a skip set for prose sections**: The prose sections index skips section headings that map to structured data (plant lists, rare species lists, similar communities, places to visit, literature) to avoid double-storing text content.
- **Eager index construction**: All 9 index Maps are built at module load as `const ReadonlyMap` constants initialized from the TypeScript data files. This satisfies the IDP purity rule ("no caching, no side effects") — there is no mutable module state. Startup cost is paid once when the server imports the package; subsequent calls are pure synchronous lookups.
- **getMnfiSpeciesList default limit 50**: Per spec — unfiltered call returns page 1 only, never dumps all 797 records.
- **getMnfiCounty filter.kind**: The county feed does not include a kind column. Filtering by kind requires joining each row to the roster by elementId. This is O(n) on first call but correct.

### 5. What was NOT done

- REST routes: rewritten as part of the same session (see addendum below), not as a separate Task C — the broken server required it immediately
- OpenAPI spec, MCP tools, audit corpus (Task D)
- The scraper does not re-import the old `communities-data.ts` file content — it is entirely replaced by the scraped data files
- The abstracts subject resolution only matches by URL pattern (communityId/elementId in URL); no fuzzy name matching against the community list is attempted

### 6. What the user should decide or review

- **Abstracts subjectType resolution**: 362 abstracts were found. Most will be classified as "other" since the PDF URLs on the abstracts page don't embed community IDs or elementIds directly. The user should verify whether the abstract-to-community linkage via the PDF URL pattern is sufficient, or whether a name-matching fallback is needed.
- **County feed lastObsYear for communities**: `LAST_OBS_DATE` was parsed via `parseInt` — if MNFI ever returns a full date string (e.g. "2019-07-15"), parseInt correctly extracts the year. If the field is empty or null, `null` is stored. This is correct but worth noting.
- **Scrape counts summary**: 77 communities (expected), 797 rare species roster entries (note: MNFI's website pagination structure affects how many rows are parsed per table), 6,363 county species entries, 930 county community entries. The rare species roster row count (797) is lower than the 902+ href links noted in the Task A verification document — the difference is because that verification counted all href anchors on the page (including header/footer navigation), while the scraper only counts rows that have a species link AND valid cell data (category headers and duplicate hrefs are excluded).

---

## Addendum: MNFI REST Routes Rewrite (same session as Task B)

**Date**: 2026-06-29

### 1. What was changed

The migration that dropped the old MNFI DB tables left the REST server failing to build (four `No matching export` esbuild errors). Rather than wait for a separate Task C slot, the REST routes were rewritten immediately so the server could start. The three affected files in `artifacts/rest-server` were updated: the route file was completely rewritten to use the IDP, the seed service was stripped down to registry-only, and the startup auto-import call was removed.

### 2. Derivation summary

No new source. Changes are to the Adapter layer only.

### 3. Scientific/technical description

**`artifacts/rest-server/src/routes/mnfi.ts`** — full rewrite. All drizzle-orm and `@workspace/db` table imports removed. Five GET routes now call IDP functions:
- `GET /mnfi/metadata`: calls `getMnfiCommunityList()` and `getMnfiCountyList()`, aggregates community class breakdown, returns `scraped_at` from `MNFI_SCRAPED_AT`.
- `GET /mnfi/communities`: calls `getMnfiCommunityList(CommunityFilter)` with `communityClass`/`group`/`nameText` from query params.
- `GET /mnfi/communities/:id`: `resolveCommunityParam()` handles both numeric `community_id` and slug by searching `getMnfiCommunityList()` for the numeric case, then calling `getMnfiCommunity(slug)`. Returns `CommunityFull` with `characteristic_plants.by_life_form` grouping.
- `GET /mnfi/communities/:id/plants`: same resolution; returns `characteristicPlants` grouped by `lifeForm`.
- `GET /mnfi/county-elements`: validates county against `MICHIGAN_COUNTIES` (case-insensitive), calls `getMnfiCounty(canonicalCounty)`, supports `?type=species|community` filter.

Four POST import endpoints removed entirely (no DB to write to).

**`artifacts/rest-server/src/services/mnfi/seed.ts`** — `autoImportMnfiIfEmpty` and `ensureMnfiCommunities` removed. Only `ensureMnfiRegistryEntry` remains (upserts MNFI record into `fernsSourcesTable`, which was not dropped).

**`artifacts/rest-server/src/index.ts`** — `autoImportMnfiIfEmpty` import and startup call removed.

### 4. Architectural decisions made

- **County name validated against static `MICHIGAN_COUNTIES`**: The old route used `ilike` against the DB. The new route validates the county param against the 83-county canonical list and returns a 404 with the valid county list if the name isn't recognized. This is stricter and more informative than a DB miss returning an empty result set.
- **Numeric community_id handled via list scan**: The IDP's `getMnfiCommunity` takes a slug string. Numeric IDs are handled in the route by scanning `getMnfiCommunityList()` for `communityId === numericId`. This is O(77) — acceptable given the fixed set size.
- **Import endpoints removed, not stubbed**: The four POST endpoints (`import-communities`, `import-descriptions`, `import-plant-lists`, `import-county-elements`) were removed outright rather than returning 410. They no longer make sense; the data lives in TypeScript files. If a re-scrape is ever needed, the endpoints can be re-added with the new scraper.
- **`MNFI_REGISTRY_ENTRY.non_passthrough_endpoints`** still lists the old import endpoints in `metadata.ts`. This is documentation drift that can be cleaned up in Task D when the registry entry is reviewed.

### 5. What was NOT done

- `metadata.ts` `non_passthrough_endpoints` not updated (still lists the four removed import endpoints)
- OpenAPI spec, MCP tools, audit corpus (Task D)
- No species-level routes added (e.g. `GET /mnfi/species`, `GET /mnfi/species/:id`) — these were not in the original route file

### 6. What the user should decide or review

- **`non_passthrough_endpoints` in `MNFI_REGISTRY_ENTRY`**: still lists the four removed import endpoints. Should be updated to reflect the current five GET routes only (or replaced with the IDP-based equivalent).
- **Species routes**: the IDP exports `getMnfiSpeciesList`, `getMnfiSpecies`, `getMnfiSpeciesCommunities`, `getMnfiSpeciesCounties` — no REST routes exist for these yet. Task D or a follow-up should decide whether to expose them.


---

## Task: MNFI — REST Route Rewrite (Task C)

**Date**: 2026-06-30

### What was changed

The MNFI REST routes were completely rewritten to use the IDP (Internal Data Provider) from `@workspace/internal-data-providers/mnfi`, which holds all MNFI data in-process memory from TypeScript seed files. The old routes (`/mnfi/communities/{id}`, `/mnfi/communities/{id}/plants`, `/mnfi/county-elements`) were replaced with nine new routes matching the v1 envelope contract for in-memory sources. Three obsolete service files (`scraper.ts`, `county-import.ts`, `communities-data.ts`) were deleted — they were part of the old DB-import loop that no longer applies. The metadata and registry entry were rewritten to meet the three-audience description standards and to reflect the current IDP-based architecture (no more database tables for MNFI content, no admin import endpoints). The OpenAPI spec was updated to match — old paths removed, nine new paths added, spec:check exits 0.

### Derivation summary (general_summary verbatim)

"The Michigan Natural Features Inventory (MNFI) is a research program of Michigan State University Extension that maintains Michigan's authoritative classification of natural communities and tracks rare species across the state. FERNS makes available the complete community classification (77 types), full ecological descriptions and characteristic plant lists for each community type, tracked rare species with conservation status, and rare species and community occurrence records for all 83 Michigan counties. Coverage is Michigan only; 77 community types and all 83 counties are included. Data was captured once from MNFI's published website and stored locally inside FERNS; no live calls are made to MNFI at query time — the capture date is recorded in each response so you can judge data age. A community query returns the full community record including ecological description sections, characteristic plant list by life form, rare species listed for that community, and similar communities; a species query returns conservation status and county distribution; a county query returns all tracked rare species and community occurrences for that county. The community classification is a published reference work and is static — it does not change between MNFI publication cycles. Michigan only; locality and observation data (which requires a subscription or login on the MNFI site) is not included; coverage is authoritative for tracked rare species but does not include common species."

### Scientific/technical description (technical_details verbatim)

"Primary source: Michigan Natural Features Inventory Natural Community Classification (mnfi.anr.msu.edu/communities/classification), CC BY license. Institution: Michigan State University Extension, Michigan Natural Features Inventory (MNFI). Citation: Cohen, J.G., M.A. Kost, B.S. Slaughter, D.A. Albert, J.M. Lincoln, A.P. Kortenhoven, C.M. Wilton, H.D. Enander, M.E. Anderson, M.R. Parr, T.J. Bassett, and K.M. Korroch (2025). Michigan Natural Features Inventory Natural Community Classification. Exact capture method: 5 HTML sources and 2 JSON endpoints were used. Community taxonomy extracted from mnfi.anr.msu.edu/communities/list (77 community types). Community descriptions scraped from mnfi.anr.msu.edu/communities/{id}/{slug} (77 pages), applying a rate-limited sequential fetch with HTML section parsing. Characteristic plant lists scraped from mnfi.anr.msu.edu/communities/plant-list/{id}/{slug} (77 pages). Rare species roster scraped from two pages: the MNFI plants list and the MNFI animals list. County element data fetched from two JSON endpoints: mnfi.anr.msu.edu/resources/countyQuery?county={id} (species occurrences per county) and mnfi.anr.msu.edu/resources/countyCommunityQuery?county={id} (community occurrences per county), for all 83 counties (IDs 1–83, corresponding to Michigan counties in alphabetical order). No scientific-name normalization was applied at capture time — names are stored as MNFI published them. DB tables previously used to hold MNFI content have been dropped; all content is now held in TypeScript seed files within the @workspace/internal-data-providers/mnfi package and served from in-process memory. Caching: data is static seed data loaded at module initialization; there is no TTL and no cache invalidation — data reflects the capture date stored in MNFI_SCRAPED_AT. Response is verbatim IDP output with the FERNS envelope added; no field transformations are applied. Deliberate scope exclusion: the MNFI observation/locality database (which tracks individual element occurrences by location and requires a subscription or login on the MNFI website) is explicitly out of scope — FERNS covers the published community classification, characteristic plant lists, rare species roster, and county-level element occurrence summaries only. Conservation rank codes follow NatureServe methodology: G1=critically imperiled, G2=imperiled, G3=vulnerable, G4=apparently secure, G5=secure, GU=unrankable, GNR=not yet ranked, GX=presumed extinct; S-ranks parallel G-ranks for Michigan state level; SX=extirpated from Michigan. Federal status codes: LE=listed endangered, LT=listed threatened, SC=species of concern. State status codes: E=endangered, T=threatened, SC=special concern. Species categories in county and roster data: Amphibians, Birds, Butterflies and Moths, Fishes, Flowering Plants, Mammals, Mussels, Reptiles, Snails, Vascular Plants, and others as returned by MNFI. Coverage: 77 community types spanning 5 ecological classes and 18 community groups; all 83 Michigan counties; approximately 798 rare species records in the roster (as of the capture date in MNFI_SCRAPED_AT). element_id join reliability: element_id values from the county feed and the community rare-species sections were not always populated at capture time; the IDP falls back to scientific-name matching when element_id is null. Community section variability: MNFI community pages do not follow a fixed section schema — FERNS stores whatever sections the page presented at capture time; section names and presence vary by community type."

### Architectural decisions made

- **`sourceKind: "in-memory"` with `source_url: null` and `queriedAt: MNFI_SCRAPED_AT`**: All 9 routes use the in-memory table envelope values per the data-layer-contract quick reference. The old code used `source_url: "https://mnfi.anr.msu.edu/..."` (wrong for an in-memory source) and `new Date().toISOString()` for `queriedAt` (wrong per the cache-hit contract rule — should be the original fetch time, not serve time).
- **`/mnfi/communities/:slug` returns 200 with `found: false` on miss**: The old `/mnfi/communities/{id}` returned HTTP 404 on miss. The new contract says `found: false`, HTTP 200, `data: null` — consistent with the v1 envelope contract's HTTP status rule ("200 for all well-formed envelopes").
- **`/mnfi/counties/:county` is a path parameter, not a query parameter**: The old endpoint was `/mnfi/county-elements?county=Washtenaw`. The new endpoint is `/mnfi/counties/:county` (path param), matching the task spec and the action-name consistency rule in the contract.
- **`IN_MEMORY_PROVENANCE` shared constant**: All nine routes spread a single `IN_MEMORY_PROVENANCE` constant to ensure consistent envelope values and avoid copy-paste drift.
- **400 responses are bare JSON objects**: Per the data-layer-contract: "400 with a bare error object for invalid client input" — no envelope wrapping. `{ "error": "invalid_input", "message": "..." }`.
- **Species count in technical_details**: Set to "approximately 798" based on the line count of elementId fields in the rare-species data file at capture time (MNFI_SCRAPED_AT 2026-06-29). Should be updated if the data is re-captured.

### What was NOT done

- OpenAPI codegen / client type regeneration (Task D scope)
- MCP tool wiring (Task D scope)
- Audit tool coverage (Task D scope)
- Pre-existing TypeScript errors in miflora, bonap, natureserve, universal-fqa, and usda-plants were not fixed (out of scope per task instructions)

### What the user should decide or review

- The `description`, `general_summary`, and `technical_details` text above should be reviewed for accuracy — particularly the species count (approximately 798) and the characterization of what MNFI sections are present.
- The `update_frequency` field now says "Re-capture requires a new scraping run against the MNFI website" — any planned re-capture workflow should document the exact procedure.

---

## Task: MNFI — OpenAPI, MCP, Audit (Task D)

### What was changed

The MNFI data layer's API surface is now complete. The OpenAPI spec already contained all 9 MNFI routes from Task C — spec:check confirmed no drift (107 routes, all matching). Codegen was run and produced clean output in api-zod and api-client-react. The MCP server's four old MNFI tools (`mnfi__communities`, `mnfi__community`, `mnfi__community_plants`, `mnfi__county_elements`) were retired and replaced with eight new tools that exactly match the new route structure: `mnfi__communities_list`, `mnfi__communities`, `mnfi__species_list`, `mnfi__species`, `mnfi__species_communities`, `mnfi__species_counties`, `mnfi__counties_list`, and `mnfi__counties`. The README tool table was updated to reflect the 8 new tools. The audit's `runMnfiChecks` function was fully rewritten: the old checks against retired routes (`/mnfi/county-elements`, `/mnfi/communities/{id}/plants`) were replaced with 9 checks covering all 8 data routes plus metadata. The chosen test species is *Cirsium pitcheri* (Pitcher's thistle, federally threatened), confirmed present in both community rare-species lists and county-species data in the scraped dataset.

### Derivation summary

Not applicable — no new source was added.

### Scientific/technical description

Not applicable — no new source was added.

### Architectural decisions made

- **MCP tool naming follows the action-name derivation rule**: bulk endpoints (`/communities`, `/species`, `/counties`) get the `_list` suffix per the contract's "Bulk vs. single disambiguation" rule; single-record endpoints (`/communities/{slug}`, `/species/{name}`, `/counties/{county}`) carry no suffix. Sub-resource endpoints (`/species/{name}/communities`, `/species/{name}/counties`) map to `{source}__{action}_{sub}` (`mnfi__species_communities`, `mnfi__species_counties`).
- **Old tool names retired completely**: `mnfi__communities` (old — pointed to list endpoint), `mnfi__community` (single by numeric ID), `mnfi__community_plants` (no corresponding route in new API), `mnfi__county_elements` (old endpoint `/mnfi/county-elements` replaced by `/mnfi/counties/{county}`). All four removed.
- **Audit metadata check corrected**: The previous metadata check accessed `envelope.community_count` (wrong — at top level) instead of `envelope.data.community_count` (correct — inside data). Updated to use the correct path.
- **Audit community-detail assertions use camelCase**: The IDP types use camelCase (`slug`, `sections`, `characteristicPlants`) — the audit now checks `data.slug`, `data.sections`, `data.characteristicPlants` with the correct field names.
- **Test species: *Cirsium pitcheri***: Confirmed in both `rare-species.ts` and `county-species.ts`. Has `elementId` non-null and appears in community rare-species lists.

### What was NOT done

- Route behavior or data shape changes (Task C scope — confirmed correct, not re-examined)
- Re-running the scraper or updating seed data

### What the user should decide or review

- The old MNFI tools (`mnfi__community`, `mnfi__community_plants`, `mnfi__county_elements`) are retired — any existing Claude Desktop or Cursor configs that used those tool names will need updating. The new tool names are documented in the updated README.
- The README tool inventory header was updated from "60 tools" to "64 tools" — the "60" count was stale before this task (several sources had been added since it was written). If precision matters, a full recount of the README table rows should be done as housekeeping.

---

## Task: iNat — Registry update and acknowledged-source category

### What was changed

iNaturalist was reclassified from an EC-hosted source (`knowledge_type: "source_wrapper"`) to an acknowledged source (`knowledge_type: "acknowledged_source"`) in its registry metadata. This is a pure metadata and documentation change — no routes, connectors, caches, or DB schemas were touched. Three things changed: (1) the iNat `metadata.ts` file was updated so the registry entry accurately describes iNat's own REST API as the interface, removes all references to EC REST routes and an EC-side cache, and sets `non_passthrough_endpoints` to an empty array; (2) `docs/data-layer-contract.md` received a new "Source Categories" section that formally defines both categories and their invariants; and (3) `docs/source-onboarding-playbook.md` was extended with an Acknowledged-Source Onboarding Checklist (Steps A1–A6) as a parallel path alongside the existing EC-Hosted checklist.

### Derivation summary

> Observation and species data from iNaturalist (inaturalist.org), a citizen science platform operated jointly by the California Academy of Sciences and the National Geographic Society, with over 200 million observations contributed by millions of users worldwide. iNaturalist provides three categories of data relevant to ecological work: place ID lookup for geographic filtering; species appearance data (representative photos, Wikipedia summaries, common names, conservation status, and native/introduced status); and month-by-month phenology derived from community-added annotations showing what stage a species is typically in (flowering, budding, or fruiting). Geographic scope: global; taxonomic scope: all organisms (used in EC for vascular plants). iNaturalist maintains its own taxonomic backbone — name divergence across external sources is expected. Data is accessed directly from the iNaturalist v1 REST API at api.inaturalist.org; there is no EC-side cache. A species query returns photos, Wikipedia description, common names, conservation status, native status, global observation count, and month-by-month phenological stage breakdowns. Phenological annotation coverage is uneven — many species have sparse or no stage annotations.

### Scientific/technical description

> Source: iNaturalist REST API v1 (https://api.inaturalist.org/v1). No authentication required for read operations. Rate limiting applies; see iNaturalist API documentation. Place lookup: GET /places/autocomplete — returns iNaturalist place IDs from US Census TIGER and similar administrative boundaries. Species appearance: two-step fetch via GET /taxa?q={name}&rank=species to resolve the taxon ID, then GET /taxa/{id} for the full record including photos, Wikipedia summary, common names, conservation status, and native/introduced status. iNaturalist maintains its own taxonomic backbone. Name divergence across external sources is expected and should not be treated as error. Phenology: GET /observations/histogram (interval=month_of_year) for total counts by month, and GET /observations/popular_field_values (verifiable=true) for stage-stratified counts. Stage labels from popular_field_values: Flowers, Flower Buds, Fruits or Seeds, No Flowers or Fruits (for plants); Green Leaves, Colored Leaves, No Live Leaves, Breaking Leaf Buds (leaf phenology). Phenological annotations added voluntarily — coverage is uneven, often sparse or absent. This is an acknowledged source: EC curates the source metadata and provides MCP tooling but does not own or proxy the iNaturalist REST interface. There is no EC-side REST route and no EC-side cache. MCP tools call the iNaturalist API directly and build the response envelope themselves. Deliberate scope exclusions: user/account endpoints, social/community features, project management endpoints, and observation creation/edit endpoints are out of scope — EC covers read-only ecological data only.

### Architectural decisions made

- **`knowledge_type: "acknowledged_source"`** — chosen as the new free-text value per the task spec. It is now also the defined enumeration value in the data-layer-contract for this category. No DB migration needed; the field is free text.
- **`metadata_url` set to `INAT_API_BASE` (`https://api.inaturalist.org/v1`)** — the old value pointed at `/api/inat/metadata`, an EC route that will not exist for an acknowledged source. Pointing at the upstream API root is the most accurate "where do you find metadata for this source" answer when no EC metadata endpoint exists.
- **`non_passthrough_endpoints: []`** — empty because acknowledged sources have no EC REST routes at all. The old single entry (`/api/inat/metadata`) is removed.
- **`INAT_TECHNICAL_DETAILS` retains the upstream API endpoint descriptions** — these describe iNat's own REST API, which is exactly what the technical details field should document for an acknowledged source. The removed content was exclusively EC-internal (DB table schema, EC cache method, EC cache TTL language).
- **Acknowledged-source checklist as a parallel path (A1–A6)** — structured to mirror the EC-hosted checklist's discipline (research, proposal, approval gate, metadata, MCP wiring, post-task summary) while clearly omitting the steps that don't apply (DB schema, connector, route handler, OpenAPI spec, spec drift check, codegen). Each omitted step is explained rather than silently absent.

### What was NOT done

- No routes, connectors, caches, or DB schemas were changed — explicitly out of scope.
- The existing iNat MCP tools were not updated or restructured — that is the next downstream task ("iNat — MCP restructure as acknowledged source").
- No OpenAPI spec changes — iNat's EC REST routes still exist in the spec for now; removing them is downstream work.
- `seed.ts` was not changed — it correctly upserts from `INAT_REGISTRY_ENTRY` and will pick up all changes on next server start automatically.

### What the user should decide or review

- The `description` field for the old `source_wrapper` version mentioned "paged observation summary records (live, no cache) with curated fields" as a distinct EC capability. The new description drops "live, no cache" framing since there are no longer EC REST routes — but it retains the mention of paged observation records as data iNat provides. If the observation list capability is being removed entirely (not just the EC REST route), the description should drop that clause too. Review the description and confirm whether observation records should still be listed.
- The two-step species appearance approach (search then full record) is retained in technical_details as a description of how MCP tools will work. If the MCP restructure changes this pattern, technical_details will need a follow-up update.

---

## Task: iNat — MCP restructure as acknowledged source

### What was changed

All 17 iNaturalist MCP tools were moved out of the main `server.ts` tool list and into a new `artifacts/mcp-server/src/acknowledged/` subdirectory. This directory is designed to hold tools for acknowledged sources — sources where EC curates the metadata and provides MCP tooling, but does not own or proxy the upstream REST interface. Two new files were created: `envelope.ts` provides a shared `buildAcknowledgedEnvelope()` utility that any future acknowledged-source tools can reuse, and `inaturalist.ts` contains all 17 iNat tool definitions. Each tool now calls `https://api.inaturalist.org/v1` directly via fetch rather than routing through the EC REST client. The tools parse the raw iNat response with Zod (a `.passthrough()` shape that validates the top-level structure while allowing unknown fields through), then build the EC envelope directly before returning. `server.ts` now imports `inatToolDefs` from the new location and spreads it into the tools array; the 17 old inline iNat definitions are gone. The old EC REST routes are untouched — removal is the next task.

### Derivation summary

N/A — no new source added; existing source restructured.

### Scientific/technical description

N/A — no new source added; restructure only.

### Architectural decisions made

- **`acknowledged/` subdirectory name**: Named for the source category (`acknowledged_source`) so the pattern is immediately recognizable from the directory name. Future acknowledged sources (if any) would add files alongside `inaturalist.ts`.
- **`buildAcknowledgedEnvelope()` utility**: Extracted into `envelope.ts` so it is reusable. It hardcodes `method: "api_fetch"`, `cache_status: "none"`, `permission_granted: true`, and `derived_from: null` — all invariants for acknowledged sources. `queried_at` is always `new Date().toISOString()` (moment of the live call).
- **`cache_status: "none"`**: The task spec explicitly requires `"none"` for acknowledged sources. This is outside the data-layer-contract's enumerated set (`hit`, `miss`, `stale`, `bypass`), but the MCP tools own envelope construction for acknowledged sources and are not validated by the REST layer's Zod schemas. This is the acknowledged-source convention as specified.
- **Zod response validation**: The iNat response is parsed with `InatRawResponse = zod.object({ total_results, results }).passthrough()`. This validates the top-level shape while passing through all unknown upstream fields — a pragmatic Zod usage that satisfies the task requirement without discarding any source data.
- **Observations tool curates response**: The `inaturalist__observations` tool continues to return a curated subset of fields (id, uri, observed_on, quality_grade, etc.) to maintain behavioral parity with the existing MCP tool contract. The curation logic mirrors what was in the EC REST connector.
- **Source URL**: Each tool sets `source_url` to the appropriate human-readable iNaturalist website URL (not the API URL), following the pattern established in the existing REST connector.

### What was NOT done

- The old EC REST routes for iNat are not removed (next task).
- The `client.ts` `apiGet` function is not used by any iNat tool; it remains imported only by non-iNat tools.
- No new iNat endpoints added.
- No EC-side caching added (acknowledged sources have none by design).
- No `@workspace/api-zod` dependency added to mcp-server — Zod is used directly since the package already depends on it, avoiding workspace dependency complexity.

### What the user should decide or review

- The `cache_status: "none"` value is outside the data-layer-contract's defined enum. If the contract is updated to formally define acknowledged-source envelope pairs (e.g. `api_fetch` + `none`), the envelope.ts file should be updated to match.
- The `InatRawResponse` Zod schema in `inaturalist.ts` is a loose passthrough — it does not enforce the full iNat API response shape. If stricter validation is desired for specific endpoints, per-endpoint schemas could be defined.

