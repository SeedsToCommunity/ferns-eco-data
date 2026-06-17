# Ann Arbor Native Plant Nursery — Source Documentation

## What This Source Is

The **Ann Arbor Native Plant Nursery (NPN)** is a small Michigan nursery at [nativeplant.com](https://www.nativeplant.com), operated by **Greg Vaclavek**. Greg maintains a curated database of 130 Michigan native plant species on the site, each with detailed ecological attributes, Michigan range notes, nursery availability, and species photographs and pen-and-ink drawings.

Greg's site is the definitive record of what the nursery grows and what he knows about each species from a grower's perspective. The dataset is narrow (Michigan native focus, 130 species) but rich in detail and ecological grounding.

## Greg Vaclavek's Background

Greg Vaclavek is the proprietor of The Native Plant Nursery in Ann Arbor, Michigan. He has been growing and selling Michigan native plants for decades. His species records reflect practical nursery knowledge combined with ecological scoring — each species carries C, W, and S coefficients drawn from the Floristic Quality Assessment tradition.

## Static Snapshot

Greg's nativeplant.com site is **no longer actively updated**. FERNS captured a complete snapshot of all 130 species on **2026-06-01**. No further scrapes or re-imports will be performed. This snapshot is the permanent FERNS record for this source.

The data is held as an **Internal Data Provider (IDP)** — loaded in-process at server startup, with no database table, no TTL, and no cache layer. Every route response is served directly from memory.

## Data Contents

Each of the 130 species records contains:

| Field | Description |
|---|---|
| `acronym` | Short uppercase identifier (e.g. `ANDGER` for *Andropogon gerardii*). Carex species use `CX` prefix, not `CAR` (e.g. `CXPENS` for *Carex pensylvanica*). |
| `latin_name` | Accepted Latin binomial as Greg records it |
| `latin_synonym_greg` | Greg's alternate Latin name, where present. Reflects Greg's own taxonomy — may differ from GBIF or USDA PLANTS. One species (GENAND) carries a common name here by Greg's convention. |
| `common_name` | One or more common names, semicolon- or comma-delimited |
| `light` | Light requirement (e.g. `sun - light shade`, `full shade`) |
| `moisture` | Moisture requirement (e.g. `dry mesic`, `wet`) |
| `height` | Approximate mature height (e.g. `2-3 ft.`) |
| `flowering_time` | Season or months (e.g. `early summer`, `Aug-Sep`) |
| `flower_color` | Flower color description |
| `growth_form` | One of: Forb, Grass, Sedge, Shrub, Tree, Vine |
| `conservatism_coefficient` | C score (0–10) from the Floristic Quality Assessment framework |
| `wetness_coefficient` | W score — signed integer, can be negative (e.g. `-3` for upland, `+5` for obligate wetland) |
| `shade_coefficient` | S score — signed integer, can be negative |
| `notes` | Free-text ecological or growth notes |
| `range_michigan` | Array of Michigan region codes where the species occurs |
| `npn_price_sizes` | Nursery availability and pricing (may be null) |
| `images` | Array of image objects (see below) |
| `source_url` | Per-species URL on nativeplant.com |

## Michigan Range Vocabulary

The `range_michigan` field uses a four-region vocabulary:

| Code | Region |
|---|---|
| `SE` | Southeast Lower Peninsula |
| `SW` | Southwest Lower Peninsula |
| `NL` | Northern Lower Peninsula |
| `UP` | Upper Peninsula |

A species absent from a region simply does not appear in that region's array entry. Some species have empty or null range arrays — this indicates incomplete data in Greg's system, not necessarily statewide absence.

## Alias Index Construction

Every species is indexed by multiple lookup keys, all stored lowercase:

1. **Acronym** — e.g. `andger`
2. **Latin name** — e.g. `andropogon gerardii`
3. **Latin synonym (Greg's)** — where present (e.g. `symphyotrichum cordifolium` for ASTERCO)
4. **Common names** — each segment split on `;` and `,`, trimmed individually

The alias-index endpoint (`GET /api/ann-arbor-npn/alias-index`) returns the full alias set for each species as `all_accepted_keys`. The single-lookup endpoint (`GET /api/ann-arbor-npn/species/{key}`) resolves any alias case-insensitively.

## Images and Cloudinary Storage

During the 2026-06-01 capture, all species images were fetched from nativeplant.com and uploaded to **Cloudinary** (cloud name: `dqe2vv0fo`, folder: `ann-arbor-npn/{acronym}/{position}`). Each image object in the `images` array contains:

| Field | Description |
|---|---|
| `position` | Integer, 1-based ordering |
| `url` | Cloudinary CDN URL (HTTPS) |
| `caption` | Caption string from Greg's site |
| `kind` | `"photograph"` or `"drawing"` |

Kind inference: if the caption contains `"pen & ink"` or `"drawing"`, the image is classified as `"drawing"`; otherwise `"photograph"`. Greg's pen-and-ink botanical illustrations appear alongside photographs for many species.

**HIEVEN** (*Hieracium venosum*) has no height or notes — minimal data entry in Greg's system. This is expected and not an error.

## Known Species Notes

- **CLEVIR**, **HIEVEN**, and **LIASCA** were absent from early FERNS imports due to an HTML parser bug. They were corrected before the 2026-06-01 snapshot was taken and are present in the IDP.
- **GENAND** (*Gentiana andrewsii*) carries `"Closed Gentian"` in the latin_synonym_greg field rather than a Latin name. This is Greg's own convention and is indexed as-is.
- **Carex** species use the `CX` prefix (e.g. `CXPENS`) rather than `CAR`.

## Migration from DB-Backed to Static Snapshot

Earlier versions of FERNS scraped nativeplant.com on demand, storing results in PostgreSQL tables (`npn_species`, `npn_name_aliases`) and offering an admin-gated import endpoint. Because Greg's site is now defunct for updates, this approach was replaced with a static IDP snapshot:

- The PostgreSQL tables are no longer used by this source and will be dropped in a future migration.
- The `POST /api/ann-arbor-npn/import` admin endpoint has been removed.
- The `GET /api/ann-arbor-npn/names` endpoint has been replaced by `GET /api/ann-arbor-npn/alias-index`.
- All routes now serve data from in-memory IDP with `sourceKind: "in-memory"`.

## Attribution

Cite as: **Greg Vaclavek / The Native Plant Nursery (nativeplant.com)** when using this data. No formal data-sharing agreement has been established. All rights reserved by The Native Plant Nursery.
