---
name: Envelope contract must-reads
description: Three envelope contract rules that are easy to get wrong when migrating routes to buildEnvelope().
---

# Envelope Contract — Rules Easy to Get Wrong

Read `docs/data-layer-contract.md` before designing or modifying any API route.

## queried_at on cache hits
On a cache-hit path, `queriedAt` must be `cached.fetched_at.toISOString()` — the time the data was *originally fetched*, not the current serve time. The contract is explicit: "For a cache hit, the moment the cached copy was originally fetched (not served), so the consumer can judge data age." Using `new Date().toISOString()` on cache hits is a contract violation.

**How to apply:** Cache-hit path → `cached.fetched_at.toISOString()`. Fresh-fetch path → `stored.fetched_at.toISOString()`. In-memory/computed → `new Date().toISOString()` (correct — moment computation ran).

## source_url = upstream API URL
For single-source-proxy routes, `provenance.source_url` must be the actual upstream endpoint URL that was fetched — not a human-readable website URL. Miflora cache rows have both `upstream_url` (API call) and `source_url` (species page); the envelope gets `upstream_url`.

## Nothing FERNS generates goes inside `data`
The governing rule: "did the upstream source produce it, or did FERNS produce it? If FERNS produced it, it belongs in the envelope." FERNS-constructed fields (e.g. image URLs built from a formula) must NOT be placed in `data`. If a task instruction says to put them in `data` anyway, this is a conflict with the contract — surface it to the user per the discrepancy ownership policy.
