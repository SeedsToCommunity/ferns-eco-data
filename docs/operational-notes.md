## Artifacts

**Dev-mode routing note**: In development, the Replit proxy routes all root (`/`) traffic to the api-server (port 8080) because it is the primary registered artifact. The api-server has a dev-only passthrough proxy that forwards any non-`/api` request to the ecological-commons-site Astro dev server (port 18478). This means both workflows must be running for the preview to work. In production, the api-server serves static files directly. The Astro dev server's `allowedHosts` setting must be inside the `vite.server` block (not `server`) in `astro.config.mjs` — Astro's own `server` config does not forward that option to Vite.

**ecological-commons-site** is an Astro static site using Lora serif / Inter sans typography and Tailwind 4 via the Vite plugin. All six content sections (Home, The Idea, Information Frontier, Computing Frontier, What's Built, Worksheet) are consolidated into a **single page** at the root URL. Content lives in `src/content/*.md` — each file is imported as an Astro Content component and rendered to HTML at build time. The page uses JavaScript tabs for human navigation (hash-based: `#home`, `#idea`, `#built`, `#worksheet`); the no-JS fallback displays all sections sequentially. All HTML content is present in the server-rendered response, so bots and AI tools see every section in one request. Rehype plugins handle: (1) external links → `target="_blank" rel="noopener noreferrer"`, (2) internal cross-section links → in-page `#` anchors. No backend — pure static site. Intended to be deployed to `ecologicalcommons.org` once the user points the domain. Build output: `dist/public/` (matches the API server production build expectation).

## Operational Rules

-   **Cache Policy**: Data is cached with specific TTLs per source. Michigan Flora data is cached permanently (no TTL, `expires_at=null`) since the source does not change; `?refresh=true` is the only way to force a re-fetch. Other sources vary — positive results are often cached long-term; negative results may have shorter TTLs.

-   **Database Schema**: Dedicated Drizzle ORM schemas exist for each source's cache tables and a central `ferns_sources` table for the registry. **Migration workflow**: The project uses Drizzle migration files (not `push`). When changing a schema, run `pnpm --filter @workspace/db run generate` to produce a SQL migration file in `lib/db/drizzle/`, then `pnpm --filter @workspace/db run migrate` to apply it to the dev database. Always commit the generated migration file alongside the schema change. The API server runs migrations automatically on startup before seeds. For production: on a fresh database the baseline migration creates all tables; on an existing database only new (unapproved) migrations are applied. **Known Drizzle-kit quirk**: Named composite unique constraints defined with `unique("name").on(...)` are NOT recognized by `drizzle-kit generate` introspection consistently — use `uniqueIndex("name").on(...)` instead. This is applied to `mnfiCountyElementsTable` in `lib/db/src/schema/mnfi.ts`. Do not change this back to `unique()`.

-   **TypeScript declarations**: When adding or changing a file in a package that uses `composite: true` (e.g., `lib/db`, `lib/api-client-react`), rebuild its declarations before type-checking consumers: `cd lib/db && pnpm exec tsc -p tsconfig.json` (emitDeclarationOnly). Stale dist/.d.ts files in those packages will cause false "no exported member" errors in packages that reference them.

## Infrastructure

-   **Database**: PostgreSQL
-   **ORM**: Drizzle
-   **Framework**: Express 5
-   **Codegen**: Orval (from OpenAPI spec)

### Codegen command

```
pnpm --filter @workspace/api-spec run codegen
```

Run from the workspace root after any spec change. Commit the generated files alongside the spec change.