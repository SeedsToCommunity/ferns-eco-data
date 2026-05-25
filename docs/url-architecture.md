## URL and API Architecture

This section records the decisions made about URL structure, domain routing, and API organization. It exists so these decisions do not need to be rederived in future sessions.

### Chosen URL structure

```
ecologicalcommons.org/              public website (ecological-commons-site)
data.ecologicalcommons.org/         FERNS data explorer (registry-explorer)
data.ecologicalcommons.org/api/v1/  unified REST API (all data + trust subsets)
```

Future additions follow the same pattern:
```
accounts.ecologicalcommons.org/     user auth (when needed — separate service)
```

Apps are independent products. They live at their own domains or subdomains (e.g. `species.ecologicalcommons.org`). They consume the data API but are not paths within it.

### Why this structure

**Single-deployment subdomain routing, not per-product subdomains.** The api-server (Express) handles all production traffic. It detects the `Host` header and serves:
- `data.*` → `artifacts/registry-explorer/dist/public` (FERNS explorer)
- all other hosts → `artifacts/ecological-commons-site/dist/public` (public site)

This is identical to how GBIF organizes itself: `www.gbif.org` is the portal, `api.gbif.org` is a single unified API namespace, and all features (taxonomy, occurrences, registry, maps) are paths under that one API domain — not separate subdomains.

**Trust subsets are parameters, not separate APIs.** When trust layers are added, they will be query parameters or versioned path segments under `data.ecologicalcommons.org/api/v1/`. A trust-scoped query looks like:
```
GET /api/v1/sources/gbif/occurrences?subset=se-michigan
```
This is the same API — a filter configuration on top of it. There is no `trust.ecologicalcommons.org/api/` or `subsets.ecologicalcommons.org/api/`.

**FERNS is an internal code name.** It does not appear in any public URL or public-facing surface. The public-facing concept is "the Ecological Commons data layer" at `data.ecologicalcommons.org`.

### Cautionary tale: Atlas of Living Australia (ALA)

ALA is the closest organizational analogue to this project — a national biodiversity data commons. They split early by product:
```
biocache.ala.org.au    occurrence data API
bie.ala.org.au         species browser API
lists.ala.org.au       species lists API
spatial.ala.org.au     spatial analysis API
```

The fragmentation created real problems: separate auth systems, inconsistent API versioning, developers not knowing where to look, and maintenance burden multiplied across teams. ALA has been actively consolidating since ~2020 and explicitly documents this as an architectural mistake in their own retrospectives.

The lesson: do not split into per-product subdomains. Add capabilities as versioned paths.

### How production routing works (implementation)

In production the api-server `artifact.toml` registers `paths = ["/"]`, so ALL requests are routed to the Express process. Express serves:
1. `/api/*` → API route handlers (no change)
2. All other paths, `Host: data.*` → `artifacts/registry-explorer/dist/public` with SPA fallback
3. All other paths, any other host → `artifacts/ecological-commons-site/dist/public` with SPA fallback

The api-server's production build (`build.mjs`) builds both web apps first (with `BASE_PATH=/`) before bundling Express, so their `dist/public` directories are present when Express starts.

In development, each site has its own Vite dev server at its own port. The static serving block in `app.ts` is gated on `NODE_ENV === "production"` and is skipped entirely during development.

### DNS setup (user action required, not automated)

Once the Replit deployment is live, the user needs to:
1. Point `ecologicalcommons.org` → Replit deployment domain (already correct — public site served at root for non-`data.` hosts)
2. Point `data.ecologicalcommons.org` → same Replit deployment domain (CNAME)

No Cloudflare rules or separate deployments are needed. The single Express process handles both domains.
