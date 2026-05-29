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
