## FERNS Response Envelope Contract v1

This section is the authoritative definition of the response envelope that Ecological Commons Data Source endpoints must produce. If anything elsewhere in this document or in code contradicts this section, this section wins.

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
- `source_url` (string or `null`) — The exact upstream endpoint FERNS contacted. For an `in_memory` or `computed` source that contacts no external system, `null`. On a cache hit, `source_url` is the original fetch URL — not `null`.
- `method` (string, fixed set) — `api_fetch`, `cache_hit`, or `computed`.
- `cache_status` (string, fixed set) — `hit`, `miss`, `stale`, or `bypass`.
- `queried_at` (string, ISO 8601) — When FERNS obtained this data. For a live fetch, the moment of the fetch. For a cache hit, the moment the cached copy was originally fetched (not served), so the consumer can judge data age. For a computed result, the moment the computation ran.
- `derived_from` (array or `null`) — For multi-source computed results, the list of contributing FERNS sources, each as `{ source_id, queried_at }`. `null` for all other source types.
- `license` (string — license URI, or the literal string `"unknown"`) — The single most restrictive license that applies to any part of `data`. For a computed source, the most restrictive across `derived_from`. Populated from the source's registry entry (a most-restrictive summary). Per-element license info inside `data` stays untouched.
- `rights` (string, free text) — Human-readable rights statement. Describes per-element license breakdowns where they exist, names rights holders, and states conditions the URI alone cannot express. When FERNS supplies a rights statement the source did not provide, that fact is stated in plain language. Populated from the source's registry entry.

### Data field

- `data` (object, array, or `null`) — The verbatim payload the source produced. Same field names, same structure, same content. FERNS adds nothing to it and removes nothing from it. If a source attaches its own license/rights to individual elements, that information stays inside `data`.
  - On `found: false`, `data` is the source's verbatim "not found" payload, or `null` when none exists. Never an invented placeholder, never an empty object dressed up to look like a hit.
  - Fields the data layer generates must not be injected into data. In particular, the following names are reserved and must not be added by the data layer: `matched_input`, `query`, `resolved_at`, and any duplicated `source_url`. If an upstream source genuinely returns one of these names, it stays; the prohibition is only on the data layer adding them.

### `general_summary` and `technical_details` are not envelope fields

`general_summary` and `technical_details` are removed from per-response provenance. They live only in:
- the registry (`ferns_sources` table, surfaced by `/api/v1/sources` and inside the `data` payload of each `/metadata` endpoint as the source's own descriptive content);
- OpenAPI route descriptions; and
- MCP tool descriptions.

They never appear inside `provenance` on a per-response envelope.

### Sources are opaque behind a data-only interface; the layer adds the envelope

A source presents to the data layer through a single internal interface: a query goes in, **data** comes out. That is all the layer sees. A source never constructs an envelope, never sees provenance fields, and never knows the envelope exists. Its only obligation is to return its payload.

The **data layer** wraps that payload in the envelope. Provenance is a fact about the layer's act of obtaining the data — `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `license`, `rights` are all produced on the layer side, uniformly, for every source. This is why every source's envelope has the same shape regardless of what the source did to produce its data.

Because the source is opaque behind this interface, the layer neither knows nor constrains what a source does internally. A source may make one upstream call, many upstream calls, run an algorithm over its own internally-held graph or dataset, or even consult other sources — all of that is inside the source's boundary and invisible to the layer. The source still presents as one source with one query interface.

**What the layer itself must never do is aggregate across sources.** Cross-source orchestration, merging, and synthesis are the application layer's job. The data layer composes only against the single-source interface: one route resolves to exactly one registered source. The prohibition is on the *layer* combining sources — never on a *source* doing work within its own boundary.

A source whose result is computed (rather than fetched from a single external endpoint) reports `method: computed` and records its contributing inputs in `derived_from`. Caching remains the only permitted efficiency measure the layer applies on top of a source.

> Note: the physical segregation of internal-source implementations behind this interface — where that code lives and how the interface is enforced in the codebase — is tracked as separate implementation work. This section states the contract; the code boundary is built to match it.

### `method` and `cache_status` are coupled

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
| Single-source proxy    | `api_fetch`/`cache_hit` | `miss`/`hit`/`stale`    | Exact upstream URL | `null`                       |
| Multi-source algorithm | `computed`           | `bypass` (or `hit` if cached) | `null`                | List of contributing sources |

### Enumerations

- `method`: `api_fetch` · `cache_hit` · `computed`
- `cache_status`: `hit` · `miss` · `stale` · `bypass`
- `license`: a license URI, or the literal string `"unknown"` (open-ended with one defined escape value).

## Pass-Through Rules (non-negotiable)

These rules formalize "Source Fidelity" for **`passthrough`-kind routes** — routes that mirror a single upstream API endpoint. They are testable assertions. They do not govern a source's internal implementation (see "Sources are opaque behind a data-only interface" above); a `computed` or `in_memory` source is not bound by verbatim-path or single-upstream-call rules because it is not mirroring an upstream endpoint. These rules apply wherever a route's kind is `passthrough`.

1. **Verbatim path after the source prefix.** Everything after `/api/{source-id}/` must match the upstream's own path character-for-character. No renaming, no camelCase↔snake_case conversion, no omitted path segments.
2. **Single upstream endpoint per route.** Each FERNS route maps to exactly one upstream call. No fan-out, no merging of two upstream responses into one.
3. **Argument-name parity with the upstream's parameter names.** Query string parameters keep the upstream's exact spelling and case. If the upstream uses `taxon_id`, FERNS uses `taxon_id` — not `taxonId`, not `id`.
4. **No FERNS-produced fields inside `data`.** Everything FERNS generates goes in the envelope. `data` is the upstream's verbatim payload.
5. **Absolute URLs in registry/metadata responses.** `source_url` and `metadata_url` are absolute. (This restates the existing "Self-Describing Registry" rule and applies it to envelope `source_url`.)
6. **Envelope shape conformance.** Every route returns the exact envelope defined in the contract above — no extra top-level keys, no missing required keys.

Any endpoint that cannot satisfy these rules must be declared as a non-passthrough endpoint kind (see "Endpoint Kinds" below) with its kind recorded in the source's `non_passthrough_endpoints` registry field.

## Endpoint Kinds

Every FERNS endpoint has one of seven kinds. The default is `passthrough`. Any endpoint that is neither `passthrough` nor explicitly declared in the source's `non_passthrough_endpoints` registry field is an audit hard-fail.

| Kind             | Purpose                                                                                                  |
|------------------|----------------------------------------------------------------------------------------------------------|
| `passthrough`    | One-to-one mirror of a single upstream API endpoint. Default if not declared.                            |
| `url_lookup`     | Returns a URL into the source's website for a given entity. No upstream API call required.               |
| `scraped_text`   | Returns text content scraped from the source's website (no structured upstream API exists).              |
| `in_memory`      | Serves data that lives permanently inside FERNS (e.g. a vocabulary table).                               |
| `admin`          | Server-side admin/management endpoint, auth-gated, not exposed in `/api/v1/sources` as a public surface. |
| `url_resolver`   | Resolves a website URL via a small computation (used by `website_url_patterns` resolver strategy).       |
| `metadata`       | The standard `/metadata` route per source, returning the registry entry inside the envelope's `data`.    |

Rules:

- Kind declarations live in a **server-side `non_passthrough_endpoints`** registry field. **This field is NOT exposed in `/api/v1/sources`** — it is an internal correctness contract between the route implementation and the audit, not a public capability advertisement.
- Convention rule: any endpoint with `text` in its path is `scraped_text` and must be declared as such (or moved off the `text` naming).
- Any endpoint that is neither declared in `non_passthrough_endpoints` nor matches a verbatim upstream path = audit hard-fail.

### `non_passthrough_endpoints` field shape

The field is a JSON array. Each element is an object with exactly two keys:

```json
[
  { "endpoint": "/api/{source-id}/path", "kind": "metadata" }
]
```

- `endpoint` — the full FERNS path (e.g. `"/api/gbif/metadata"`, `"/api/s2c/years"`). Must be an exact string match for the route path; no wildcards.
- `kind` — one of the six non-`passthrough` kinds: `metadata`, `in_memory`, `url_lookup`, `scraped_text`, `url_resolver`, `admin`. `passthrough` is the default and is never declared here.

Every source's `/metadata` endpoint must appear in this field with kind `metadata`.

## What Carries the Envelope

The response envelope is a provenance carrier. It exists to record what is true of FERNS's act of obtaining ecological data from a registered source. The test for any route is therefore a single question:

> **Does this response return data derived from a registered source?**

If yes, the route carries the full envelope. If no, it does not — because there is no provenance to carry. This is a rule about the *purpose* of the route, not about which list it appears on. An agent decides envelope-or-not by answering the question above, never by consulting an enumeration.

Routes that do **not** return source-derived data — administrative, infrastructure, health/status, trust-layer, and FERNS self-description routes — do not carry the envelope. `permission_granted` does not apply to them in the public-license sense; they are auth-gated at the transport layer where applicable.

The table below illustrates the current internal surface. It is an aid, not the rule — the rule is the question above. New routes are classified by answering the question, not by being added to this table.

| Route file | Paths | Reason |
|---|---|---|
| `routes/registry.ts` | `GET /api/v1/sources`, `GET /api/v1/sources/{source_id}` | FERNS self-description — the registry index, not a data source |
| `routes/source-relationships.ts` | `GET /api/v1/source-relationships` and related | Admin surface for inter-source relationship metadata |
| `routes/trust-groups.ts` | All trust-group CRUD paths | Admin management surface |
| `routes/health.ts` | `GET /health` | Liveness probe |
| `routes/spec.ts` | `GET /api/spec` (or similar) | OpenAPI YAML pass-through |
| `routes/mcp.ts` | MCP gateway transport paths | Agent transport, not a data source |

**Audit consequence**: the audit must skip these routes when checking envelope conformance. A route listed here that returns a non-envelope JSON shape is not a violation.

**The inverse rule — internal-data sources are still real sources**: a source whose data lives inside FERNS (rather than being fetched from an external API) is still a registered source. It gets a real `source_id`, a real registry row, and a real envelope. Its endpoint kind is `in_memory`. Example: `s2c`.

## Permission Rules

- `permission_granted` is **per-endpoint** and is returned in every response envelope.
- The source-level `permission_granted` field in the registry (`ferns_sources`) is the **most-restrictive** value across all of that source's endpoints. A source with three `true` endpoints and one `false` endpoint reports `false` at the source level.
- **Registry default + per-response override**: `buildEnvelope()` reads `permission_granted` from the source's registry row (`ferns_sources.permission_granted`) when the route handler does not supply a per-call value. The route handler may pass a per-call `permissionGranted` to override the registry default when the upstream response itself carries per-response permission information that supersedes the source-level summary. iNaturalist is the canonical example: individual observations carry their own `license_code` field, so the route handler computes a per-response value rather than using the source-level registry default. The source-level registry value remains the most-restrictive summary across all endpoints; the per-call override does not update it.
- Defaults by endpoint kind:
  - `url_lookup` → defaults to `true` (URLs into a public website are CC0-equivalent).
  - `metadata` → defaults to `true` (CC0; the registry describes FERNS's own metadata about a source).
  - `scraped_text` → defaults to `false` until permission is explicitly recorded for that source/endpoint.
  - `passthrough` → based on the source's published terms, recorded per endpoint.
  - `admin` → auth-gated; the public-permission question does not apply. The envelope still carries `permission_granted` but its value reflects the caller's authorization, not a public license decision.
- **Prototype-mode note (deliberate, will change at launch):** while FERNS is in prototype mode, `permission_granted: false` still returns the requested `data`. This is intentional during build-out so the team can see real responses while permission classifications are being worked out. The launch-time behavior — whether `data` is withheld, partially redacted, or replaced with a citation-only stub — is recorded in "Open Questions" below.

## Companion Website URL Patterns

Every source has both an upstream API (or scraped surface) and a human-readable companion website. The companion website is **not a separate FERNS source** — a source is the upstream organization, and its website is one of its forms. The registry declares per-entity URL templates for that website in a `website_url_patterns` field on the source.

Two forms:

1. **Trivial form** — a template string with `{...}` placeholders for entity fields:
   ```json
   "website_url_patterns": {
     "place": "https://www.inaturalist.org/places/{id}"
   }
   ```

2. **Resolver form** — when the URL cannot be reduced to a single template (e.g., the upstream slugifies a name, or the URL depends on a lookup table). A resolver descriptor names a FERNS endpoint that returns the URL:
   ```json
   "website_url_patterns": {
     "species": { "strategy": "url_resolver", "endpoint": "/api/{source}/website-resolver?entity=species&id={id}" }
   }
   ```
   The resolver endpoint must be declared as kind `url_resolver` in the source's `non_passthrough_endpoints`. The endpoint's response envelope follows the standard contract; the resolved URL lives in `data`.

## System Architecture

FERNS follows a three-layered architecture: External Sources, the FERNS Data Layer, and Applications. This repository focuses on the FERNS Data Layer.

**Core Architectural Pattern (Per Source):**

Every external data source integrated follows a consistent four-component pattern:

1.  **Connector**: Ingests data from the source. This data could be remote or could be held within this application.
2.  **Database**: Stores source data in dedicated tables, each record including provenance fields.
3.  **Knowledge API**: Provides programmatic access to the data. For `passthrough`-kind routes, every EC route path after the source identifier prefix MUST use the upstream source's own path verbatim — this is a non-negotiable prohibition — and each such route maps to exactly one upstream endpoint, with caching the only permitted efficiency measure. The data layer itself never aggregates across sources; cross-source orchestration is the application layer's job. A source's internal implementation is opaque to the layer (see "Sources are opaque behind a data-only interface"): a `computed` or `in_memory` source may do whatever it needs within its own boundary and is not bound by verbatim-path or single-upstream rules. Any deviation from upstream path structure for a `passthrough` route requires explicit user approval and must be documented; it is not permitted for cosmetic or convenience reasons.
4.  **Registry Entry**: Declares the service's exposed data and dependencies within the FERNS Registry.

**Key Design Principles and Features:**

-   **Provenance Tracking**: Every API response carries a `provenance` object as defined by FERNS Response Envelope Contract v1 (see the dedicated section below): `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `derived_from`, `license`, `rights`. Per-response provenance does NOT include `general_summary` or `technical_details` — those live in the registry only. Database cache tables record their own ingestion-time provenance fields (e.g. `fetched_at`, `upstream_url`); those are storage-level columns, not envelope fields, and are mapped into the envelope at response time.
-   **API Response Envelope**: All API responses are wrapped in the FERNS Response Envelope Contract v1.
-   **Permission Enforcement**: Source metadata includes a `permission_granted` flag, and Explorer UIs display blocking modals when permission is not granted.
-   **Source Fidelity**: For `passthrough`-kind routes, FERNS API route paths after the source identifier prefix MUST be verbatim copies of the upstream source's own paths — no renaming, no omission — and each route maps to exactly one upstream endpoint, with caching the only permitted efficiency measure. The data layer never aggregates across sources; cross-source orchestration is the application layer's job. A source's own internals are opaque to the layer and unconstrained (see "Sources are opaque behind a data-only interface"). Any deviation for a passthrough route requires explicit user approval and must be documented. Field values and response structure from the source are preserved unchanged.
-   **Source Descriptions**: Every source has three structured description fields — `description`, `general_summary`, and `technical_details` — that together serve as a complete self-contained reference for any reader. Standards and examples are defined in the Source Onboarding Playbook below.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Fat Registry Index**: The `/api/v1/sources` endpoint is the single source of truth for all source metadata. Each `SourceSummary` in the sources array includes the full set of identity, description, permission, and capability fields: `source_id`, `name`, `knowledge_type`, `status`, `description`, `input_summary`, `output_summary`, `dependencies`, `update_frequency`, `known_limitations`, `metadata_url`, `permission_granted`, `permission_status`, `general_summary`, and `technical_details`. These are persisted to the `ferns_sources` DB table via each source's `seed.ts` `onConflictDoUpdate` and read back on every registry request. An agent or application can make a single call to `/api/v1/sources` and have enough information to make a fully informed routing decision without calling any individual `/metadata` endpoint.
-   **Self-Describing Registry**: All `metadata_url` and `source_url` fields in registry and metadata responses must be absolute URLs.
-   **Metadata response structure**: Every source's `/metadata` endpoint returns the standard envelope (see "FERNS Response Envelope Contract v1" below). The `description`, `general_summary`, and `technical_details` text lives inside `data` — it is the source's own descriptive payload — and is NOT placed in `provenance`. `provenance` is reserved for FERNS-produced provenance fields (see the contract). Some existing metadata routes still nest `general_summary`/`technical_details` under `provenance`. New metadata routes must follow the contract.
-   **Description field completeness**: The `description`, `general_summary`, and `technical_details` fields in every source's registry metadata must be fully self-contained. Together they must give any reader — general user, developer, researcher — a complete understanding of the source without consulting any external documentation. For sources with encoded fields (e.g. coded values like `OBL`, `C5`, `FACW`), `technical_details` must enumerate every possible value and its meaning. If a consumer cannot interpret the data from these fields alone, the registry entry is incomplete.
-   **Disambiguation requirement**: A source's `general_summary` and `technical_details` must fully describe the source's own data fields — including the name, scale, authority, and disambiguation of any vocabulary-defined datatype that the source actually returns. For example, a source that returns a C-value field must describe what a C-value is, its 0–10 scale, its authority (Swink & Wilhelm), and how it differs from superficially similar metrics (Coefficient of Wetness, WUCOLS ratings). This is field-level documentation of the source's own output and is always required. What does NOT belong in individual source metadata is cross-source routing guidance: naming other FERNS sources, recommending which source to use for a given need, or describing how two FERNS sources interact. That belongs exclusively in the `source_relationships` table.
-   **Clarity for humans and agents**: All metadata, description text, and documentation must be written to be understood by both human readers and AI agents. Avoid unexplained abbreviations. Spell out acronyms on first use. Prefer complete sentences over terse field lists.
-   **Dedicated vocabulary sources**: If a data type (such as the Coefficient of Conservatism) is a standalone, well-defined standard with a published authority and a use across multiple FERNS sources, it may have its own registry entry, API, and explorer so that its definition is authoritative and centrally queryable. This is a design option to consider, not a mandatory pattern — the user decides whether a given metric warrants a standalone source. Cross-source relationship information — how two FERNS sources overlap, conflict, complement each other, or where one supersedes another — lives in the `source_relationships` table and is accessible via `GET /api/v1/source-relationships`. Individual source metadata does not duplicate this information.
-   **Non-standard conventions**: When a data field uses a convention that is not backed by a published standard (e.g., a 1–10 numeric wetness scale used by some nursery databases), document it explicitly as a non-standard convention. State that different publishers may implement it differently, and that FERNS does not treat it as authoritative.

## Approved Exceptions

This section records explicit user-approved exceptions to the rules above. Each entry must name the rule it relaxes, the endpoint or surface it applies to, and the date / context of the approval. The audit reads this section to know which findings have been pre-approved and should not be flagged.

- none yet

## Open Questions

1. **HTTP status code for `found: false` responses.** Currently a 200 in most routes, but no rule says it must be. Candidates: 200 with `found: false` (honest absence is not an error), 404 (REST-traditional), or per-source policy.
2. **Final per-endpoint response behavior when `permission_granted: false`** at launch. Prototype mode returns `data`; launch behavior is undecided (withhold `data` entirely / return a citation stub / return partial fields / return data with a stronger machine-checkable warning).
3. **Whether a request/trace ID belongs in the envelope.** A top-level `request_id` would help debugging and audit correlation. Not added yet because it slightly expands the envelope; pending user decision.
4. **Whether `provenance.license` should be derived from per-element rights inside `data`** (more accurate, but means FERNS interprets source-specific structures) or asserted from the source's registered site-wide policy (simpler, less accurate). The current contract adopts the latter (registry-asserted). This question is whether to revisit that choice.
5. **Whether the FERNS-asserted nature of a supplied `rights` statement should also be carried as a separate machine-checkable flag**, in addition to being stated in plain language inside `rights`.
6. **The error condition** — how a genuine failure is reported, as distinct from `found: false`. v1 covers success and absence; the failure envelope is its own piece of work.