# Per-Source Package Architecture

## The problem at scale

Today every external data provider lives inside a single monolithic package — `@workspace/external-data-providers` — with subpath exports pointing at individual source directories:

```
lib/external-data-providers/
  package.json          ← one package.json for everything
  src/
    bonap-napa/
    gbif/
    gobotany/
    michigan-flora/
    usda-plants/
    ...
```

This works acceptably at a dozen sources. It breaks down in several ways as the number grows:

**Shared fate.** A compile error in one source blocks type-checking of every other source that lives in the same package. A bad import in `gobotany/index.ts` stops `bonap-napa/` from building.

**Undifferentiated dependencies.** Every source shares the same `dependencies` block. If source A needs a specialist HTTP client and source B does not, both get it. At 100 sources the `node_modules` surface area of the combined package reflects the union of every source's needs.

**No independent release path.** The package version bumps as a unit. A patch to BONAP pulls in the latest version of every other source even if nothing there changed. This matters once the data layer is depended on by other consumers beyond the REST server.

**Coordination overhead.** Adding a new source means editing a shared `package.json`. Two developers adding sources in parallel will produce a merge conflict in that file on every PR.

---

## The target architecture

Each data source becomes its own pnpm workspace package:

```
lib/
  edp-bonap-napa/
    package.json        name: "@workspace/edp-bonap-napa"
    tsconfig.json
    src/
      index.ts
  edp-gbif/
    package.json        name: "@workspace/edp-gbif"
    tsconfig.json
    src/
      index.ts
  edp-gobotany/
    ...
  idp-coefficient-of-conservatism/
    package.json        name: "@workspace/idp-coefficient-of-conservatism"
    ...
```

Each REST route in `artifacts/rest-server` declares only the package it actually needs:

```json
// rest-server/package.json
"dependencies": {
  "@workspace/edp-bonap-napa": "workspace:*",
  "@workspace/edp-gbif": "workspace:*"
}
```

And the import is unchanged from the consumer's perspective:

```ts
import { getBonapMapUrl } from "@workspace/edp-bonap-napa";
```

---

## How TypeScript resolution works in this model

Each package exports its `.ts` source directly via `package.json` exports (the same pattern already in use):

```json
// lib/edp-bonap-napa/package.json
{
  "name": "@workspace/edp-bonap-napa",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

With `moduleResolution: "bundler"` in `tsconfig.base.json`, TypeScript follows the exports map directly to the `.ts` source. No `dist/` directory is required for type-checking. Each package's `tsconfig.json` can still have `composite: true` for declaration building (used by esbuild and other compiled consumers), but that is decoupled from the type-check path.

Because each package is its own module, TypeScript only loads the source files reachable from the specific import in use. A route that imports only `@workspace/edp-bonap-napa` never causes TypeScript to parse `@workspace/edp-gbif`.

---

## Concrete package structure (per source)

```
lib/edp-bonap-napa/
  package.json
  tsconfig.json
  src/
    index.ts          ← fetch functions, result types, error class, SOURCE_FACTS
```

**`package.json`**

```json
{
  "name": "@workspace/edp-bonap-napa",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@workspace/db": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "catalog:"
  }
}
```

**`tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "composite": true,
    "declarationMap": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "tsBuildInfoFile": "dist/.tsbuildinfo",
    "rootDir": "src",
    "types": ["node"]
  },
  "include": ["src"],
  "references": [
    { "path": "../../lib/db" }
  ]
}
```

Note `tsBuildInfoFile` is set inside `dist/` so that deleting `dist/` also removes the build-state file, forcing a clean rebuild on the next `tsc --build` run.

---

## REST server wiring

`artifacts/rest-server/tsconfig.json` does **not** list individual EDP packages in `references`. It resolves them via source exports instead (no `dist/` dependency for type-checking). The route file declares its dependency in `package.json` and imports normally.

The root `tsconfig.json` references every EDP/IDP package so that `pnpm run typecheck:libs` builds declarations for all of them:

```json
"references": [
  { "path": "./lib/db" },
  { "path": "./lib/api-zod" },
  { "path": "./lib/edp-bonap-napa" },
  { "path": "./lib/edp-gbif" },
  { "path": "./lib/edp-gobotany" },
  ...
]
```

---

## Adding a new source (the target workflow)

A scaffold script creates the full package skeleton from a name argument. The developer only writes the fetch logic and `SOURCE_FACTS` inside `src/index.ts`.

```bash
pnpm scaffold:edp bonap-napa
# creates lib/edp-bonap-napa/ with package.json, tsconfig.json, src/index.ts stub
# adds the reference to root tsconfig.json
# prints the workspace:* dependency line to paste into rest-server/package.json
```

Everything else — `pnpm install` link, TypeScript resolution, declaration build — follows automatically from the package being a pnpm workspace member.

---

## Migration path from the current monolith

Migration is additive, not a flag day.

1. **New sources** are created as standalone packages from the start.
2. **Existing sources** are moved one at a time, each as its own PR:
   - Create `lib/edp-{source-id}/` with the same source content
   - Update `rest-server/package.json` to depend on the new package
   - Update the import in the route file
   - Delete the source directory from `lib/external-data-providers/src/`
   - Remove the export entry from `lib/external-data-providers/package.json`
   - Add the new package to the root `tsconfig.json` references
3. When `lib/external-data-providers/src/` is empty, the monolith package is deleted.

Each step is independently deployable and independently reviewable. There is no big-bang migration.

---

## Relationship to `edp-metadata-breakdown.md`

The `SOURCE_FACTS` pattern described in `edp-metadata-breakdown.md` is the content contract that lives inside each package's `src/index.ts`. The per-source-package structure described here is the packaging boundary that makes that contract independently ownable. The two documents are complementary: this one describes where the code lives; the other describes what it contains.
