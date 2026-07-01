---
name: Production IPv4 bind requirement
description: Replit Cloud Run containers default to IPv6-only binding; must use "0.0.0.0" explicitly or health checks fail.
---

# Production IPv4 bind requirement

**Rule:** Always pass `"0.0.0.0"` as the host to `app.listen(port, "0.0.0.0", callback)` in `artifacts/rest-server/src/index.ts`.

**Why:** In Replit's Cloud Run production container, calling `app.listen(port)` without a host defaults to binding on `::` (IPv6 wildcard). The sidecar health-check probe connects via IPv4 (`127.0.0.1`). If the kernel has `IPV6_V6ONLY` set the TCP SYN is refused and the probe never reaches Express — it reports "healthcheck / returned status 500" with zero pino-http request logs. The `server.address()` call in the startup log confirms the bound interface; a successful bind shows `"address":"0.0.0.0","family":"IPv4"`.

**How to apply:** Any new Express/HTTP server added to this monorepo that will be deployed must use the three-arg listen form. Add `const server = app.listen(port, "0.0.0.0", () => { const addr = server.address(); logger.info({ port, addr }, "Server listening"); })` — the explicit addr log is the production-side evidence that the fix is in place.
