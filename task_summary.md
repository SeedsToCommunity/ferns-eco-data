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
