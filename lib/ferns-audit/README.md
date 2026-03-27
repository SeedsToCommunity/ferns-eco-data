# ferns-audit

FERNS Source Audit Tool — queries real source APIs (GBIF, iNaturalist, BONAP) and
compares their responses against the live FERNS API to surface passthrough violations.

## Run

```sh
# Against local dev server (auto-detected via REPLIT_DEV_DOMAIN)
pnpm --filter @workspace/ferns-audit run audit

# Against a specific FERNS instance
FERNS_BASE_URL=https://myapp.replit.app pnpm --filter @workspace/ferns-audit run audit

# JSON output
pnpm --filter @workspace/ferns-audit run audit --json
```

## What it checks

- **API docs** — `/api/openapi.yaml` and `/api/openapi.json` return HTTP 200
- **Source registry** — all source `metadata_url` and `explorer_url` fields are absolute and reachable
- **GBIF passthrough** — field-level diff of GBIF `/v1/species/match` vs FERNS `/api/gbif/match`
- **iNat passthrough** — field-level diff of iNat `/taxa/{id}` vs FERNS `/api/inat/species`
- **iNat phenology** — field-level diff of iNat histogram + field_values responses vs FERNS `/api/inat/phenology`
- **BONAP map URLs** — absolute, reachable, content-type `image/png`
- **URL audit** — every URL-named field in FERNS responses is collected and HEAD-checked

## Design

FERNS is a **passthrough**: all source fields must appear in `data` unchanged and with their
original field names. Only five fields may be added by FERNS:
`found`, `provenance`, `queried_at`, `cache_status`, `source_url`.

The audit surfaces three violation types:
- **GAPS** — source fields absent from FERNS `data`
- **ADDITION VIOLATIONS** — FERNS added fields not present in source or permitted envelope
- **VALUE MISMATCHES** — same field name, different values

The tool reports findings and does not pass or fail. Review the violations and decide what to fix.
