## FERNS Response Envelope Contract v1

This section is the authoritative definition of the response envelope every FERNS endpoint must produce. It is derived from `attached_assets/FERNS_Response_Envelope_Contract_v1_*.docx` and layered with seven planning refinements that were agreed during the envelope-rebuild planning round. If anything elsewhere in this document or in code contradicts this section, this section wins.

### The governing rule

The envelope holds only what is true of FERNS's act of obtaining the data. The `data` field holds only what the source produced. Nothing FERNS generates is ever placed inside `data`; nothing the source produced is ever lifted out of `data` into the envelope.

A simple test for any field: did the upstream source produce it, or did FERNS produce it? If the source produced it, it belongs in `data`. If FERNS produced it, it belongs in the envelope.

### Envelope shape

```json
{
  "found": true,
  "permission_granted": true,
  "pagination": { "has_more": false, "next": null, "total": null } | null,
  "provenance": {
    "source_id": "...",
    "source_url": "..." | null,
    "method": "...",
    "cache_status": "...",
    "queried_at": "...",
    "derived_from": [ { "source_id": "...", "queried_at": "..." } ] | null,
    "license": "..." | "unknown",
    "rights": "..."
  },
  "data": { ...verbatim from the source... }
}
```

### Top-level field definitions

- `found` (boolean) — Did the source have the thing that was asked for? `true` = data is present. `false` = the lookup ran correctly but the source holds no record for it. `false` is not an error; it is honest absence. Genuine failures are a separate condition (see "Open Questions").
- `permission_granted` (boolean) — Is the consumer cleared to use this data? Always present, per-endpoint (see "Permission Rules" below).
- `pagination` (object or `null`) — Object when the result is one page of a larger set that could continue; `null` when the response is inherently whole. When present: `has_more` (boolean), `next` (string or `null` token/cursor), `total` (integer or `null`).

### Provenance field definitions

- `source_id` (string) — Stable identifier of the registered FERNS source. Always present.
- `source_url` (string or `null`) — The exact upstream endpoint FERNS contacted. For an `in_memory` or `computed` source that contacts no external system, `null`. **Refinement #1: on a cache hit, `source_url` is the original fetch URL — not `null`.**
- `method` (string, fixed set) — `api_fetch`, `cache_hit`, or `computed`.
- `cache_status` (string, fixed set) — `hit`, `miss`, `stale`, or `bypass`.
- `queried_at` (string, ISO 8601) — When FERNS obtained this data. For a live fetch, the moment of the fetch. For a cache hit, the moment the cached copy was originally fetched (not served), so the consumer can judge data age. For a computed result, the moment the computation ran.
- `derived_from` (array or `null`) — For multi-source computed results, the list of contributing FERNS sources, each as `{ source_id, queried_at }`. `null` for all other source types.
- `license` (string — license URI, or the literal string `"unknown"`) — The single most restrictive license that applies to any part of `data`. For a computed source, the most restrictive across `derived_from`. **Refinement #3: populated from the source's registry entry (a most-restrictive summary). Per-element license info inside `data` stays untouched.**
- `rights` (string, free text) — Human-readable rights statement. Describes per-element license breakdowns where they exist, names rights holders, and states conditions the URI alone cannot express. When FERNS supplies a rights statement the source did not provide, that fact is stated in plain language. **Refinement #3 also applies: populated from the source's registry entry.**

### Data field

- `data` (object, array, or `null`) — The verbatim payload the source produced. Same field names, same structure, same content. FERNS adds nothing to it and removes nothing from it. If a source attaches its own license/rights to individual elements, that information stays inside `data`.
  - **Refinement #4: on `found: false`, `data` is the source's verbatim "not found" payload, or `null` when none exists. Never an invented placeholder, never an empty object dressed up to look like a hit.**
  - **Refinement #5: FERNS-injected fields are removed from envelopes. The following are forbidden inside `data` (they were injected by various older routes): `matched_input`, `inat_url`, `place_type_name`, `query`, `resolved_at`, and any duplicated `source_url`. If the upstream genuinely returns one of these names, it stays; the prohibition is on FERNS adding them.**

### Refinement #2 — `general_summary` and `technical_details` are not envelope fields

`general_summary` and `technical_details` are removed from per-response provenance. They live only in:
- the registry (`ferns_sources` table, surfaced by `/api/v1/sources` and inside the `data` payload of each `/metadata` endpoint as the source's own descriptive content);
- OpenAPI route descriptions; and
- MCP tool descriptions.

They never appear inside `provenance` on a per-response envelope.

### Refinement #6 — Composite routes are forbidden

A route that calls more than one upstream endpoint and merges the results into a single response is forbidden. Each FERNS route maps to exactly one upstream call (caching is the only permitted efficiency measure). The current USDA `/PlantSearch?species=` example — which internally fans out to multiple PLANTS endpoints — is to be split in a later task. If an experience requires data from multiple upstream calls, the application layer orchestrates them.

### Refinement #7 — `method` and `cache_status` are coupled

Only the following pairs are valid. Any other pair is a defective response.

| `method`   | `cache_status` | Meaning                                                           |
|------------|----------------|-------------------------------------------------------------------|
| `api_fetch`| `miss`         | Live upstream call; was not cached, now stored.                   |
| `cache_hit`| `hit`          | Served from cache, within freshness window.                       |
| `cache_hit`| `stale`        | Served from cache, past freshness window.                         |
| `computed` | `bypass`       | Computed result; caching does not apply.                          |
| `computed` | `hit`          | Computed result that is itself cached and was served from cache.  |

### How each source kind fills the envelope (quick reference)

| Source kind            | `method`             | `cache_status`             | `source_url`             | `derived_from`               |
|------------------------|----------------------|----------------------------|--------------------------|------------------------------|
| In-memory table        | `cache_hit`          | `hit`                      | `null`                   | `null`                       |
| Pure algorithm         | `computed`           | `bypass`                   | `null`                   | `null`                       |
| Single-source proxy    | `api_fetch`/`cache_hit` | `miss`/`hit`/`stale`    | Exact upstream URL (also on cache hit — refinement #1) | `null`                       |
| Multi-source algorithm | `computed`           | `bypass` (or `hit` if cached) | `null`                | List of contributing sources |

### Enumerations

- `method`: `api_fetch` · `cache_hit` · `computed`
- `cache_status`: `hit` · `miss` · `stale` · `bypass`
- `license`: a license URI, or the literal string `"unknown"` (open-ended with one defined escape value).
