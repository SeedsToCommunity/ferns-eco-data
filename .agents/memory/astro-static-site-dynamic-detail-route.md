---
name: Static Astro site + dynamic detail route
description: Pattern for serving /thing/:slug-style detail pages from an Astro site built with static output (no SSR adapter), fronted by an Express server.
---

When an Astro site uses `output: "static"` (no server adapter), there is no way
to generate a true dynamic route for arbitrary runtime slugs — `[slug].astro`
only works for build-time-known params via `getStaticPaths()`.

**Pattern:** build a single "detail shell" page/route (e.g. `/thing/detail`)
that reads the slug from `window.location.pathname` client-side and fetches
data accordingly. Then make the fronting server rewrite `/thing/<slug>` to
that shell **without changing the browser URL**, in every mode the server runs
in:

- Dev: the dev proxy's `path:` rewrite option (e.g. http-proxy-middleware).
- Prod: an explicit Express route (e.g. `app.get(/^\/thing\/[^/]+$/, ...)`)
  placed *before* the static-file 404 catch-all, that `res.sendFile`s the
  shell's built `index.html`.

**Why:** Both the dev and prod code paths serve the static build independently
— fixing only one (usually the dev proxy, since it's what you test against
first) leaves production broken with a silent 404, since `express.static` has
no knowledge of the shell convention.

**How to apply:** Whenever restoring or building an Astro (or other
static-output framework) page that needs per-record detail URLs without an
SSR adapter, grep for both the dev proxy config and the production static-file
serving block and update both together, then verify by testing against the
production build (`NODE_ENV=production` start), not just `astro dev`.
