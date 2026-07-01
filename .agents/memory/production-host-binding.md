---
name: Production host binding for deployed HTTP servers
description: Deployed servers must use Node's default (dual-stack) listen, NOT an explicit 0.0.0.0 bind, or the prod app router can't reach them.
---

# Deployed HTTP servers: use the default (dual-stack) host bind

**Rule:** For any Express/HTTP server deployed in this monorepo, call
`app.listen(port, callback)` with **no host argument**. Do NOT pass an explicit
`"0.0.0.0"`.

**Why:** Replit's production deployment (autoscale, `router = "application"`)
reaches each artifact's backend over the **IPv6 loopback (`::1`)**. Node's default
listen (no host) binds the dual-stack IPv6 wildcard `::` when IPv6 is available,
which accepts BOTH IPv6 and IPv4 connections — so the router reaches it. An
explicit `app.listen(port, "0.0.0.0", ...)` binds IPv4-only; the router's `::1`
connection is refused, requests never reach Express, and the deploy fails the
startup probe with `healthcheck / returned status 500` and ZERO request
(pino-http) logs. Default dual-stack is strictly safer — it works whether the
router uses IPv4 or IPv6 loopback.

**Evidence (this repo):** the last known-good production deploy used the default
`app.listen(port, cb)` (dual-stack) together with a correct `.replit` manifest.
Observed failing combinations: default-bind + stale manifest FAILED; `"0.0.0.0"` +
corrected manifest FAILED. Each, compared against the known-good state, implicates
BOTH the IPv4-only bind and a stale manifest as independent deploy blockers (a
prior agent misdiagnosed the first failure and introduced the `"0.0.0.0"` bind).
The revert restores exact parity with the known-good state (default bind + correct
manifest); confirm green on the next deploy.

**Dev note:** the Replit dev sandbox has NO IPv6, so the default listen falls back
to `0.0.0.0` there (harmless — verified via `server.address()` logging
`family:"IPv4"` in dev). Do NOT "fix" a dev-side IPv4 address by hardcoding
`"0.0.0.0"`; that is what broke production.

**How to apply:** never diagnose a production zero-request-logs `healthcheck / 500`
as an IPv4-bind problem. It is the opposite — remove any explicit `"0.0.0.0"` host
and use the default bind.
