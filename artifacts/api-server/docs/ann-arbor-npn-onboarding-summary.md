# Post-Task Summary: Ann Arbor Native Plant Nursery (NPN)

source_id: `ann-arbor-npn` | Playbook Step 13

## 1. What Was Built

Added The Native Plant Nursery (nativeplant.com, Greg Vaclavek, Ann Arbor MI) as a new
FERNS data source. Covers approximately 130 Michigan native plant species with ecological
attributes (light, moisture, height, flowering time, habitat, Michigan range), nursery
pricing/size information, and species images (photographs and pen-and-ink drawings).

A scraper/importer fetches Greg's pages, validates images (JPEG magic-byte check),
uploads valid images to Cloudinary CDN, and caches everything in PostgreSQL. Lookup
works by acronym (e.g. LOBSIP), Latin name, Latin synonym, or any common name.
Three MCP tools were added. A Registry Explorer page at `/source/ann-arbor-npn` lets a
user browse and search the full inventory with a provenance panel, Michigan range legend,
and an image grid. Audit health checks with strict known-value assertions were added
to `lib/ferns-audit`.

## 2. Verbatim `general_summary`

> The Native Plant Nursery (NPN), Ann Arbor, Michigan — operated by Greg Vaclavek —
> maintains a curated database of Michigan native plants available at nativeplant.com.
> The dataset covers approximately 130 species with ecological attributes (light, moisture,
> height, flowering time, habitat, range within Michigan) and nursery availability/pricing.
> Each species record is identified by a short acronym (e.g. ANDCAN for Andropogon canadensis)
> and includes common and Latin names, an optional Latin synonym, and a series of images
> with captions — photographs and pen-and-ink drawings.
> FERNS imports the full inventory into a local PostgreSQL database and serves it via
> structured API endpoints, enabling lookup by acronym, Latin name, Latin synonym, or any
> common name. A name-groups endpoint returns all species organized by accepted key for
> cross-source reconciliation. Images are hosted on Cloudinary CDN
> (folder: ann-arbor-npn/{acronym}/{position}).

## 3. Verbatim `technical_details`

> Primary source: nativeplant.com — Greg Vaclavek's Michigan Native Plants Database.
> Import method: admin-gated POST /api/ann-arbor-npn/import; auto-import at startup if
> table is empty. DB tables: npn_species (PK: acronym text; fields: latin_name,
> latin_synonym_greg, common_name, light, moisture, height, flowering_time, habitat, notes,
> range_michigan text[] (migration 0009 — was jsonb in 0008), npn_price_sizes, images jsonb
> array of {position, url, caption, kind}, source_url, scraped_at);
> npn_name_aliases (PK: alias text; FK: acronym → npn_species).
> Alias index: acronym + latin_name + latin_synonym_greg (where present) + common names
> (split on ; and ,). Image kind inference: caption containing 'pen & ink' or 'drawing'
> → 'drawing'; else 'photograph'.
> Images uploaded to Cloudinary (cloud: dqe2vv0fo, folder: ann-arbor-npn/{acronym}/{position}).
> Only JPEG-validated images (magic FFD8FF, ≥512 bytes) that upload successfully to
> Cloudinary are stored; non-JPEG or upload failures are skipped (imagesSkipped++).
> Carex species use CX prefix instead of CAR (e.g. CXSTRI for Carex stricta).
> Lookup endpoint (GET /api/ann-arbor-npn/species/:key) accepts any name flavor and resolves
> via alias table. Bulk endpoint (GET /api/ann-arbor-npn/species) returns all 130 species.
> Names endpoint (GET /api/ann-arbor-npn/names) returns name groups with all_accepted_keys
> for reconciliation.
> Known quirk: GENAND (Gentiana andrewsii) has 'Closed Gentian' in the synonym slot
> (common name, not taxonomic) — indexed anyway.
> HIEVEN (Hieracium venosum) is a stub record with empty light/moisture/height/range fields.

## 4. Architectural Decisions

- **PostgreSQL cache**: Greg's ~130-page site takes ~2 minutes to scrape. Caching in
  PostgreSQL means subsequent API calls return instantly. Tradeoff: stale until re-import.
- **JPEG-only images + Cloudinary strict**: Only JPEG images that pass magic-byte validation
  and upload successfully to Cloudinary are stored. Non-JPEG and failed uploads are omitted
  from the images array entirely. Tradeoff: some images may be absent after import if
  nativeplant.com serves non-JPEG formats or if Cloudinary is unavailable.
- **300–500 ms inter-request jitter**: Polite scraping delay. Full import takes ~1–2 min.
- **Alias table (npn_name_aliases)**: All name variants pre-indexed at import time for O(1)
  lookup. Rebuilt on re-import.
- **`range_michigan` as `text[]`**: Migration 0009 corrected from jsonb (0008).
- **`permission_granted: false`**: No formal agreement with Greg Vaclavek.
- **Cloudinary CDN**: Images mirrored from nativeplant.com; out of sync until re-import.
- **Auto-import at startup when empty**: In Replit sandbox, nativeplant.com is unreachable;
  auto-import fails silently (logged at warn level) — expected in development.

## 5. What Was NOT Done

- **No real import has been run**: nativeplant.com is not reachable from the Replit sandbox.
  All audit checks for species records (LOBSIP, ASTCOR, bulk count 130) report `found=false`
  (gap) until a re-import is run from a network that can reach the site.
- **No permission request sent to Greg Vaclavek**: `permission_granted` remains `false`.
- **Service directory uses `services/npn/` not `services/ann-arbor-npn/`**: Functional but
  diverges from the specified naming convention.

## 6. What the User Should Decide or Review

- **Run the import** from a machine that can reach nativeplant.com:
  `POST /api/ann-arbor-npn/import` with `Authorization: Bearer <ADMIN_SECRET>`.
- **Permission status**: Contact Greg Vaclavek to formalize data sharing if desired.
- **Verify `general_summary`, `technical_details`, and `description`** content (verbatim
  text above).
- **LOBSIP Latin name**: Audit uses `"Lobelia siphilitica"` as the known value. Verify
  against Greg's actual site listing after first import.
