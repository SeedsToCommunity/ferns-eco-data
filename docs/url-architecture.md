## URL and API Architecture

This section records the decisions made about URL structure, domain routing, and API organization. It exists so these decisions do not need to be rederived in future sessions.

### Chosen URL structure

```
ecologicalcommons.org/              public website (ecological-commons-site)
ecologicalcommons.org/api/v1/       unified REST API (all data + trust subsets)
data.ecologicalcommons.org/         data explorer (external application)
```

Future additions follow the same pattern:
```
accounts.ecologicalcommons.org/     user auth (when needed — separate service)
```

Apps are independent products. They live at their own domains or subdomains (e.g. `species.ecologicalcommons.org`). They consume the data API but are not paths within it.

### Why this structure

**Single Express process serves both website and API.** The rest-server handles all production traffic for `ecologicalcommons.org` — public website for non-/api paths, REST API for /api/* paths. There is no Host-header branching; the same static files and API handlers are served regardless of which hostname the request arrives on.

**Data explorer is an external application.** The data explorer at `data.ecologicalcommons.org` is an external application. DNS for that subdomain should point directly to the external app — the rest-server has no knowledge of it and does not redirect or proxy to it.

This mirrors how GBIF organizes itself: `www.gbif.org` is the portal, `api.gbif.org` is a single unified API namespace, and all features (taxonomy, occurrences, registry, maps) are paths under that one API domain — not separate subdomains.

**Trust subsets are parameters, not separate APIs.** When trust layers are added, they will be query parameters or versioned path segments under `/api/v1/`. A trust-scoped query looks like:
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

In production the rest-server `artifact.toml` registers `paths = ["/"]`, so ALL requests are routed to the Express process. Express serves:
1. `/api/*` → API route handlers
2. All other paths → `artifacts/ecological-commons-site/dist/public` with SPA fallback

The rest-server's production build (`build.mjs`) builds the public website first (with `BASE_PATH=/`) before bundling Express, so its `dist/public` directory is present when Express starts.

In development, the ecological-commons-site has its own Vite dev server at its own port. The static serving block in `app.ts` is gated on `NODE_ENV === "production"` and is skipped entirely during development.

### DNS setup (user action required, not automated)

Once the Replit deployment is live, the user needs to:
1. Point `ecologicalcommons.org` → Replit deployment domain (public site + API)
2. Point `data.ecologicalcommons.org` → the external data explorer application (separate DNS record — does NOT point to this deployment)
