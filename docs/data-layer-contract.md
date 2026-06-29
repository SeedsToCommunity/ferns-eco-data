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
  - Fields a Data Adapter generates must not be injected into data. In particular, the following names are reserved and must not be added by an Adapter: `matched_input`, `query`, `resolved_at`, and any duplicated `source_url`. If an upstream Source genuinely returns one of these names, it stays; the prohibition is only on the Adapter adding them.

### HTTP status conventions

Two rules govern how FERNS routes map outcomes to HTTP status codes.

**200 for all well-formed envelopes.** Every response that produces a valid envelope — whether `found: true` or `found: false` — returns HTTP 200. `found: false` is honest absence, not an error; the source was reached, the query was valid, and the answer is simply "nothing matched." 404 is reserved for routes or paths that do not exist on the server.

**400 with a bare error object for invalid client input.** When a request is rejected before any source lookup is attempted — a missing required parameter, an unrecognized enum value, a malformed key — the route returns HTTP 400 with a bare JSON object: `{ "error": "<machine_code>", "message": "<human_readable>" }`. No envelope wraps this response, because no source was queried and there is no provenance to record. The `error` value is a stable, machine-readable code (e.g. `invalid_input`) that clients can branch on without parsing the human-readable `message`.

### `general_summary` and `technical_details` are not envelope fields

`general_summary` and `technical_details` are removed from per-response provenance. They live only in:
- the registry (`ferns_sources` table, surfaced by `/api/v1/sources` and inside the `data` payload of each `/metadata` endpoint as the source's own descriptive content);
- OpenAPI route descriptions; and
- MCP tool descriptions.

They never appear inside `provenance` on a per-response envelope.

### Source / Adapter / Source Interface

EC FERNS is organized as a parallel set of single-Source pipelines. Each registered Source — whether an **External Data Provider** (e.g. iNat, GBIF) reached over the network, or an **Internal Data Provider** (e.g. S2C, Coefficient of Conservatism, the name graph) held in-process inside EC FERNS — sits behind its own **Source Interface**. The Source Interface is whatever shape that Source naturally exposes: an HTTP REST API, a function-call API, a graph query interface, a static-data lookup. Source Interfaces vary by Source and are not normalized to a single shape.

For each Source there is exactly one **Data Adapter** that knows how to talk to that one Source's Source Interface. The Adapter calls the Source, takes the response data, and wraps it in the EC response envelope with all required metadata. The Adapter is the only thing in EC FERNS that knows the Source's specific interface; everything else in the system sees the Adapter's uniform output.

Each Source's Adapter exposes its routes on the **EC Data Interface** — the uniform REST/MCP surface that Applications and Users consume. The mapping is one-to-one at every layer: one Source ↔ one Source Interface ↔ one Data Adapter ↔ its dedicated routes on the EC Data Interface. A Source's routes are not shared with another Source's routes; an Adapter does not call another Adapter.

A Source is **opaque** to the rest of the system behind its Source Interface. What it does internally — whether it makes one upstream call or many, holds data in memory or in a database, runs an algorithm over its own graph — is the Source's own business. A Source may internally compose data from multiple inputs (a `computed` Source records its inputs in `derived_from`); that composition happens inside the Source, behind its interface, invisible to its Adapter and to everything above. The storage strategy and internal implementation of any Source may change without affecting its Adapter, provided its Source Interface stays stable.

**What EC FERNS itself never does is combine data across Sources.** A response on the EC Data Interface comes from exactly one Source. Cross-source orchestration — merging, joining, synthesizing across multiple registered Sources — is the application layer's job, never EC FERNS's. Caching remains the only permitted efficiency measure an Adapter applies on top of its Source.

> **Internal Data Provider location.** Internal Data Providers live in the `lib/internal-data-providers/` workspace package, with one subdirectory per Provider. Each subdirectory's `index.ts` defines that Source's Source Interface in code — the query functions an Adapter calls. Data files inside the subdirectory are package-internal and not exported. An Adapter imports its Provider via `@workspace/internal-data-providers/{source-id}` (or via the package barrel), never by reaching into a data file directly. This boundary is enforced by what the package exports. An Adapter imports exactly one Internal Data Provider, via that Provider's per-Source subpath. The Internal Data Providers package does not expose a barrel export; cross-Provider imports are forbidden — if an Adapter would need data from a second Source, that is a cross-Source orchestration concern and belongs in the application layer, not in the Adapter.
>
> **Source identifier consistency.** Every Source has one identifier — the `source_id` value used in its registry entry — and that identifier is used verbatim wherever the Source appears in the codebase: as the Internal Data Provider subdirectory name (when applicable), as the Adapter route file name, as the Adapter services subdirectory name, and as the route prefix on the EC Data Interface. No abbreviations, no aliases, no short forms. One name per Source, used everywhere.
>
> This rule also applies to module-level identifiers inside a Source's own code:
> - **SCREAMING_SNAKE_CASE constants** (module-level `const` exports) must use the full `source_id` as their prefix, with kebab-case segments joined by underscores. For example, the source `coefficient-of-conservatism` must use `COEFFICIENT_OF_CONSERVATISM_` as its constant prefix. The abbreviated form `COEFFICIENT_` is prohibited.
> - **camelCase identifiers** (functions, types, interfaces) must use the full source_id segments with each segment capitalized. For example, `coefficient-of-conservatism` → `CoefficientOfConservatism` as the identifier prefix/namespace. The abbreviated form `Coefficient` is prohibited when the source has a longer compound identifier.
>
> These rules apply within a Source's own code — its Internal Data Provider module and its Adapter services directory. They do not apply to OpenAPI schema names or generated types, which are codegen artifacts driven by the spec.
>
> **Action-name consistency across layers.** For every route beyond `/metadata`, the path segment(s) after the source prefix define the canonical **action name**. All three layers — IDP Source Interface, REST route, and MCP tool — derive their names from this anchor by mechanical transformation:
>
> | Layer | Derivation rule | `name-groups` example | `species-list` example |
> |---|---|---|---|
> | **REST route** | Verbatim path segment | `GET /api/{source-id}/name-groups` | `GET /api/{source-id}/species-list` |
> | **MCP tool** | `{source_id_underscored}__{action_underscored}` | `{source}__name_groups` | `{source}__species_list` |
> | **IDP method (collection)** | `get{SourceName}{ActionPascalCase}()` | `getAnnArborNpnNameGroups()` | `getAnnArborNpnSpeciesList()` |
> | **IDP method (single lookup)** | `get{SourceName}{ActionPascalCase}(key)` | — | `getAnnArborNpnSpecies(key)` |
>
> PascalCase action: each hyphen-separated segment capitalized and joined (`name-groups` → `NameGroups`, `species-list` → `SpeciesList`).
>
> **Bulk vs. single disambiguation:** When a resource has both a bulk endpoint (`GET /{action}`) and a single-lookup endpoint (`GET /{action}/:key`), the MCP tool for the bulk form appends `_list` (`{source}__{action}_list`); the single form carries no suffix (`{source}__{action}`). For IDP methods, both collection and single-record forms use the `get` prefix; the collection method takes no key argument and the single-record method takes a `key` argument.
>
> **Sub-resource routes** (`GET /{action}/:key/{sub}`) map to MCP tool `{source}__{action}_{sub}` (path slashes dropped, hyphens → underscores) and IDP method `get{Source}{ActionPascalCase}{SubPascalCase}(key)`. A dedicated IDP method SHOULD be provided for every route, including sub-resource projections — the Adapter should call the IDP method rather than extracting the field from the parent method result directly.
>
> **`/metadata` is exempt.** The `/metadata` route is served by the Adapter's services directory (`metadata.ts`), not by the IDP. It has no IDP method counterpart.
>
> This rule applies to all new Sources. Existing Sources that predate this rule are brought into alignment as part of their IDP conformance task.
>
> Note: External Data Providers are physically separated from their Adapters by the network. Internal Data Providers are separated from their Adapters by the Source Interface as a code boundary — they live in their own part of the code, distinct from the Adapter that wraps them. The physical segregation of Internal Data Providers in the codebase is the target architecture; not every existing internal source meets it today. Bringing the existing internal sources into alignment is tracked as separate implementation work, sequenced behind pristine examples of the pattern.

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

These rules formalize "Source Fidelity" for **`passthrough`-kind routes** — routes whose Adapter mirrors a single upstream API endpoint from an External Data Provider. They are testable assertions. They do not govern a Source's internal implementation (see "Source / Adapter / Source Interface" above); a `computed` or `in_memory` Source is not bound by verbatim-path or single-upstream-call rules because its Adapter is not mirroring an external upstream endpoint. These rules apply wherever a route's kind is `passthrough`.

1. **Verbatim path after the source prefix.** Everything after `/api/{source-id}/` must match the upstream's own path character-for-character. No renaming, no camelCase↔snake_case conversion, no omitted path segments.
2. **Single upstream endpoint per route.** Each FERNS route maps to exactly one upstream call. No fan-out, no merging of two upstream responses into one.
3. **Argument-name parity with the upstream's parameter names.** Query string parameters keep the upstream's exact spelling and case. If the upstream uses `taxon_id`, FERNS uses `taxon_id` — not `taxonId`, not `id`. If the upstream accepts parameters as a POST body rather than query params, FERNS uses the upstream's body field names verbatim as its own query params — the principle is name parity, not transport parity.
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

EC FERNS sits between **Sources** (External Data Providers and Internal Data Providers) and the **Applications and Users** that consume their data. Each Source's Data Adapter wraps that Source's responses in the EC envelope and exposes them on the EC Data Interface. This repository is the EC FERNS codebase.

**Core Architectural Pattern (Per Source):**

Every external data source integrated follows a consistent four-component pattern:

1.  **Connector**: Ingests data from the source. This data could be remote or could be held within this application.
2.  **Database**: Stores source data in dedicated tables, each record including provenance fields.
3.  **Knowledge API**: The uniform REST and MCP surface — the **EC Data Interface** — that Applications consume. For `passthrough`-kind routes, every route path after the source identifier prefix MUST use the upstream Source's own path verbatim — this is a non-negotiable prohibition — and each such route maps to exactly one upstream endpoint on its External Data Provider, with caching the only permitted efficiency measure. EC FERNS itself never combines data across Sources; cross-source orchestration is the application layer's job. A Source's internal implementation is opaque to its Adapter and to the rest of the system (see "Source / Adapter / Source Interface"): a `computed` or `in_memory` Source may do whatever it needs within its own boundary and is not bound by verbatim-path or single-upstream rules. Any deviation from upstream path structure for a `passthrough` route requires explicit user approval and must be documented; it is not permitted for cosmetic or convenience reasons.
4.  **Registry Entry**: Declares the service's exposed data and dependencies within the FERNS Registry.

**Key Design Principles and Features:**

-   **Provenance Tracking**: Every API response carries a `provenance` object as defined by FERNS Response Envelope Contract v1 (see the dedicated section below): `source_id`, `source_url`, `method`, `cache_status`, `queried_at`, `derived_from`, `license`, `rights`. Per-response provenance does NOT include `general_summary` or `technical_details` — those live in the registry only. Database cache tables record their own ingestion-time provenance fields (e.g. `fetched_at`, `upstream_url`); those are storage-level columns, not envelope fields, and are mapped into the envelope at response time.
-   **API Response Envelope**: All API responses are wrapped in the FERNS Response Envelope Contract v1.
-   **Source Fidelity**: For `passthrough`-kind routes — those whose Adapter mirrors a single upstream endpoint on an External Data Provider — route paths after the source identifier prefix MUST be verbatim copies of the upstream Source's own paths, and each route maps to exactly one upstream endpoint, with caching the only permitted efficiency measure. EC FERNS never combines data across Sources; cross-source orchestration is the application layer's job. A Source's own internals are opaque behind its Source Interface and unconstrained (see "Source / Adapter / Source Interface"). Any deviation for a passthrough route requires explicit user approval and must be documented. Field values and response structure from the Source are preserved unchanged.
-   **Source Descriptions**: Every source has three structured description fields — `description`, `general_summary`, and `technical_details` — that together serve as a complete self-contained reference for any reader. Standards and examples are defined in the Source Onboarding Playbook below.
-   **No Normalization**: FERNS preserves the distinctness of each source; it does not collapse sources into a common data model or imply equivalence.
-   **Fat Registry Index**: The `/api/v1/sources` endpoint is the single source of truth for all source metadata. Each `SourceSummary` in the sources array includes the full set of identity, description, permission, and capability fields: `source_id`, `name`, `knowledge_type`, `status`, `description`, `input_summary`, `output_summary`, `dependencies`, `update_frequency`, `known_limitations`, `metadata_url`, `permission_granted`, `permission_status`, `general_summary`, and `technical_details`. These are persisted to the `ferns_sources` DB table via each source's `seed.ts` `onConflictDoUpdate` and read back on every registry request. An agent or application can make a single call to `/api/v1/sources` and have enough information to make a fully informed routing decision without calling any individual `/metadata` endpoint.
-   **Self-Describing Registry**: All `metadata_url` and `source_url` fields in registry and metadata responses must be absolute URLs.
-   **Metadata response structure**: Every source's `/metadata` endpoint returns the standard envelope (see "FERNS Response Envelope Contract v1" below). The `description`, `general_summary`, and `technical_details` text lives inside `data` — it is the source's own descriptive payload — and is NOT placed in `provenance`. `provenance` is reserved for FERNS-produced provenance fields (see the contract). Some existing metadata routes still nest `general_summary`/`technical_details` under `provenance`. New metadata routes must follow the contract.
-   **Description field completeness**: The `description`, `general_summary`, and `technical_details` fields in every source's registry metadata must be fully self-contained. Together they must give any reader — general user, developer, researcher — a complete understanding of the source without consulting any external documentation. For sources with encoded fields (e.g. coded values like `OBL`, `C5`, `FACW`), `technical_details` must enumerate every possible value and its meaning. If a consumer cannot interpret the data from these fields alone, the registry entry is incomplete.
-   **Disambiguation requirement**: A source's `general_summary` and `technical_details` must fully describe the source's own data fields — including the name, scale, authority, and disambiguation of any vocabulary-defined datatype that the source actually returns. For example, a source that returns a C-value field must describe what a C-value is, its 0–10 scale, its authority (Swink & Wilhelm), and how it differs from superficially similar metrics (Coefficient of Wetness, WUCOLS ratings). This is field-level documentation of the source's own output and is always required. What does NOT belong in individual source metadata is cross-source routing guidance: naming other FERNS sources, recommending which source to use for a given need, or describing how two FERNS sources interact. That belongs exclusively in the `source_relationships` table.
-   **Clarity for humans and agents**: All metadata, description text, and documentation must be written to be understood by both human readers and AI agents. Avoid unexplained abbreviations. Spell out acronyms on first use. Prefer complete sentences over terse field lists.
-   **Dedicated vocabulary sources**: If a data type (such as the Coefficient of Conservatism) is a standalone, well-defined standard with a published authority and a use across multiple FERNS sources, it may have its own registry entry and API so that its definition is authoritative and centrally queryable. This is a design option to consider, not a mandatory pattern — the user decides whether a given metric warrants a standalone source. Cross-source relationship information — how two FERNS sources overlap, conflict, complement each other, or where one supersedes another — lives in the `source_relationships` table and is accessible via `GET /api/v1/source-relationships`. Individual source metadata does not duplicate this information.
-   **Non-standard conventions**: When a data field uses a convention that is not backed by a published standard (e.g., a 1–10 numeric wetness scale used by some nursery databases), document it explicitly as a non-standard convention. State that different publishers may implement it differently, and that FERNS does not treat it as authoritative.

## Approved Exceptions

This section records explicit user-approved exceptions to the rules above. Each entry must name the rule it relaxes, the endpoint or surface it applies to, and the date / context of the approval. The audit reads this section to know which findings have been pre-approved and should not be flagged.

- none yet

## Open Questions

1. ~~**HTTP status code for `found: false` responses.**~~ **Resolved.** `found: false` returns HTTP 200. Honest absence is not an error; 404 is reserved for routes or paths that do not exist. See [HTTP status conventions](#http-status-conventions).
2. **Final per-endpoint response behavior when `permission_granted: false`** at launch. Prototype mode returns `data`; launch behavior is undecided (withhold `data` entirely / return a citation stub / return partial fields / return data with a stronger machine-checkable warning).
3. **Whether a request/trace ID belongs in the envelope.** A top-level `request_id` would help debugging and audit correlation. Not added yet because it slightly expands the envelope; pending user decision.
4. **Whether `provenance.license` should be derived from per-element rights inside `data`** (more accurate, but means FERNS interprets source-specific structures) or asserted from the source's registered site-wide policy (simpler, less accurate). The current contract adopts the latter (registry-asserted). This question is whether to revisit that choice.
5. **Whether the FERNS-asserted nature of a supplied `rights` statement should also be carried as a separate machine-checkable flag**, in addition to being stated in plain language inside `rights`.
6. **The error condition for genuine upstream and processing failures** — how a timeout, a 5xx from an External Data Provider, or a parse failure on an otherwise-valid response is reported. Invalid client input is now resolved (HTTP 400 with a bare error object; see [HTTP status conventions](#http-status-conventions)). What remains open is the shape of the failure envelope when a source was reached or attempted but the result cannot be trusted — its own piece of work.