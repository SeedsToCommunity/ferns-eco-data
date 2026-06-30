# Upstream API Snapshots

Snapshots of upstream API specs taken at validation time. Each snapshot is the
raw spec file as published by the upstream service, accompanied by a `.meta.json`
sidecar recording when it was fetched, why, and what EC paths were validated
against it.

## Purpose

- Provides a fixed reference for what the upstream API looked like when EC's
  implementation was validated against it.
- Enables future drift detection: diff a freshly fetched spec against the
  snapshot to see what the upstream changed.
- Not used at runtime — these are documentation and audit artifacts only.

## Files

| Snapshot | Upstream | Fetched |
|---|---|---|
| `inat-swagger.json` | iNaturalist API v1 (Swagger 2.0) | 2026-06-30 |

## Drift detection

To check for drift against iNat's current published spec, fetch fresh and diff:

```bash
curl -s https://api.inaturalist.org/v1/swagger.json -o /tmp/inat-current.json
python3 - << 'EOF'
import json, sys

saved  = json.load(open('lib/api-spec/upstream-snapshots/inat-swagger.json'))
current = json.load(open('/tmp/inat-current.json'))

ec_paths = [
    '/places/autocomplete', '/observations/histogram',
    '/observations/popular_field_values', '/observations',
    '/observations/species_counts', '/controlled_terms',
    '/controlled_terms/for_taxon', '/taxa/autocomplete',
    '/taxa/{id}', '/places/{id}', '/places/nearby',
    '/observations/{id}/taxon_summary', '/identifications/similar_species',
    '/identifications/species_counts', '/identifications/recent_taxa',
    '/identifications', '/identifications/{id}',
]

def param_names(path_obj, method='get'):
    names = {p['name'] for p in (path_obj.get('parameters') or []) if 'name' in p}
    op = path_obj.get(method) or {}
    names |= {p['name'] for p in (op.get('parameters') or []) if 'name' in p}
    return names

for path in ec_paths:
    old_params = param_names(saved['paths'].get(path, {}))
    new_params = param_names(current['paths'].get(path, {}))
    added   = new_params - old_params
    removed = old_params - new_params
    if added:   print(f"ADDED   {path}: {sorted(added)}")
    if removed: print(f"REMOVED {path}: {sorted(removed)}")

added_paths   = set(current['paths']) - set(saved['paths'])
removed_paths = set(saved['paths']) - set(current['paths'])
if added_paths:   print(f"\nNew iNat paths:     {sorted(added_paths)}")
if removed_paths: print(f"Removed iNat paths: {sorted(removed_paths)}")
EOF
```
