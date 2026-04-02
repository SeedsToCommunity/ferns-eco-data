# External Reference URL Discovery — Design and Implementation

**Module**: `external-reference-urls`  
**Config**: `config/external-reference-urls.json`, `config/domain-extraction-config.json`  
**Source files**: `src/synthesis/process-external-reference-urls.js`, `src/utils/species-url-validator.js`, `src/utils/page-content-client.js`, `src/utils/serpapi-cache.js`, `src/utils/html-cache.js`  
**Cache directories**: `cache/ExternalReferences/`, `cache/SerpApi/`, `cache/PageContent/`, `cache/RawHTML/`  
**Last Verified**: December 2025

---

## What This System Does

For each plant species, this module discovers and validates a URL on each configured botanical reference website — confirming that the page actually covers that specific species, not a category page, search page, or unrelated result.

The output is a JSON object of site name → validated URL pairs, which flows through the pipeline and accumulates additions from later modules (Michigan Flora URL, Wikipedia URL from iNaturalist).

**Final output example** for *Acer rubrum*:
```json
{
  "Go Botany": "https://gobotany.nativeplanttrust.org/species/acer/rubrum/",
  "Google Images": "https://www.google.com/search?tbm=isch&q=Acer%20rubrum",
  "Illinois Wildflowers": "https://www.illinoiswildflowers.info/trees/plants/red_maple.html",
  "Minnesota Wildflowers": "https://www.minnesotawildflowers.info/tree/red-maple",
  "Tropicos": "https://www.tropicos.org/name/Search?name=Acer%20rubrum&exact=true"
}
```

---

## System Architecture: Four Layers

The system is composed of four sequential layers, each with its own cache:

```
1. Site registry (config) → what domains to search
2. SerpApi search         → which URLs exist for this species on that domain
3. URL validation         → does that page actually cover this species?
4. Page content extraction → extract and store the useful text for synthesis
```

Each layer has independent caching. A cache hit at any layer skips all subsequent work for that path.

---

## Layer 1: Site Registry

**File**: `config/external-reference-urls.json`

This config file defines which websites to search. Each entry has a human-readable `name` and the `baseUrl` of the domain.

```json
{
  "sites": [
    { "name": "Go Botany",                        "baseUrl": "gobotany.nativeplanttrust.org" },
    { "name": "Illinois Wildflowers",             "baseUrl": "illinoiswildflowers.info" },
    { "name": "Lady Bird Johnson Wildflower Center", "baseUrl": "wildflower.org" },
    { "name": "Prairie Moon Nursery",             "baseUrl": "prairiemoon.com" },
    { "name": "USDA PLANTS",                      "baseUrl": "plants.usda.gov" },
    { "name": "Missouri Native Plant Society",    "baseUrl": "www.missouriplants.com" },
    { "name": "Minnesota Wildflowers",            "baseUrl": "minnesotawildflowers.info" },
    { "name": "Google Images",                    "baseUrl": "google.com/search?tbm=isch", "useDirectUrl": true }
  ],
  "retrySettings": {
    "startDelayMs": 10,
    "maxDelayMs": 1000
  },
  "numSearchResults": 5
}
```

### The Special Case: `useDirectUrl`

Google Images is handled differently from all other sites. Instead of searching via SerpApi, the URL is **constructed directly** from the species name — no API call, no validation:

```javascript
const searchTerm = encodeURIComponent(`${genus} ${species}`);
url = `https://www.${site.baseUrl}&q=${searchTerm}`;
// → https://www.google.com/search?tbm=isch&q=Acer%20rubrum
```

This URL is always included in the output regardless of whether there are actually images. It's treated as a guaranteed entry point rather than a discovered resource.

All other sites go through SerpApi + validation.

### Partial Cache Strategy

On each run, the module reads the existing species cache and identifies **which sites are missing**. It only searches for and validates missing sites. If 5 of 8 sites are already cached, only the 3 remaining sites trigger any work. This means:
- A species that has been processed before will only incur new SerpApi costs for sites added to the registry after the initial run
- A site removed from the registry stays in the cache (it was discovered; removing it from config doesn't purge it from the cache)
- Adding a new site to the registry will trigger one SerpApi call per species the next time each species is processed

**To add a site**: add an entry to `config/external-reference-urls.json` and add a corresponding entry in `config/domain-extraction-config.json` with its validation and extraction config. Existing species caches will be updated incrementally on next run.

**To remove a site**: remove it from both config files. Existing cache entries for that site will remain in `cache/ExternalReferences/` but the module will not include them in future output (it only includes sites present in the current config). The cache key is the site's `name` string.

---

## Layer 2: SerpApi Search

### Why SerpApi

SerpApi is a third-party service that provides programmatic access to Google Search results. Direct scraping of Google Search is against Google's terms of service and technically unreliable. SerpApi handles headless browser execution, CAPTCHA bypass, and structured result parsing.

**API key**: stored in the `SERPAPI_API_KEY` environment variable. If not set, the module logs a warning and skips all SerpApi-backed sites (only Google Images, which uses `useDirectUrl`, will be included).

### The Search Query

For each site, the query is constructed using Google's `site:` operator:

```
site:gobotany.nativeplanttrust.org Acer rubrum
```

This restricts results to pages on that specific domain that mention the species name. The query is passed to SerpApi with `num: 5` (from `numSearchResults` in config), returning up to 5 organic search results.

### SerpApi Cache

**Every SerpApi call is expensive.** The cache is the primary cost control mechanism.

**Cache location**: `cache/SerpApi/`  
**Cache key**: MD5 hash of the query string (lowercased, trimmed)  
**Cache file naming**: `{md5hash}.json`

The cache stores the raw `organic_results` array from SerpApi, not the final validated URL:

```json
{
  "_meta": {
    "query": "site:gobotany.nativeplanttrust.org Acer rubrum",
    "cachedAt": "2025-12-11T14:08:48.000Z",
    "numResults": 3,
    "site": "Go Botany",
    "genus": "Acer",
    "species": "rubrum"
  },
  "results": [
    { "link": "https://gobotany.nativeplanttrust.org/species/acer/rubrum/", ... },
    { "link": "https://gobotany.nativeplanttrust.org/family/sapindaceae/", ... }
  ]
}
```

**Zero-result responses are also cached.** If a species is not on a given site, SerpApi returns an empty results array. That empty array is written to cache so the next run for that species+site pair does not trigger another paid API call. Only genuine API errors (HTTP failures, `result.error` in the response) are not cached — those can be retried on the next run.

**Cache lifetime**: permanent. SerpApi results do not expire automatically. To force a re-search for a species (e.g., after a site redesign or new species page has been published), delete the specific hash file from `cache/SerpApi/` or call `clearSerpCache()`.

### Retry Logic

If a live SerpApi call fails or returns an error:
- Delay doubles exponentially: 10ms → 20ms → 40ms → ... up to 1000ms max
- Once delay exceeds `maxDelayMs`, the site is abandoned for this run
- Rate limit errors (HTTP 429 or message containing "rate limit") trigger the same backoff

In practice, one or two attempts are typical. The retry loop is a safety net, not an expected code path.

### Cost Awareness

SerpApi pricing is per search query. With 7 SerpApi-backed sites (8 minus Google Images) and the `numSearchResults: 5` setting:
- **First time a species is processed**: up to 7 live API calls (one per site)
- **Subsequent runs of the same species**: 0 API calls (full cache hit)
- **A new site added to config**: 1 API call per species on next run (only missing entries are searched)

The most expensive scenario is processing a large batch of new species. A batch of 50 new species = up to 350 SerpApi calls. At standard SerpApi pricing, this is meaningful cost. Prefer to batch runs during non-critical periods and always verify the SerpApi cache is preserved across runs.

**Important**: Even cached runs still fetch and validate HTML from the actual websites. Only the Google Search step is behind SerpApi. The HTML fetching from gobotany.nativeplanttrust.org et al. is direct and unmetered, but also has its own cache (see Layer 3/4).

---

## Layer 3: URL Validation

This is the core quality control step. A Google search result for `site:gobotany.nativeplanttrust.org Acer rubrum` might return the genus index page, a family overview, or a related species. The validator confirms that the specific page actually covers the queried species.

The validator iterates through the SerpApi result URLs in order and returns the first one that passes. If none pass, the site is recorded as not found.

### Validation Check Order

For each candidate URL, the following checks run in order. The first to pass ends validation for that URL.

**Check 1: URL Path Analysis** (no HTTP fetch required)

The URL itself is checked for the genus and species strings. This is attempted first because it costs nothing — no network request.

Patterns matched (case-insensitive):
- Both genus and species appear separately: `.../acer/rubrum/`
- Combined without separator: `.../acerrubrum`
- Hyphenated: `.../acer-rubrum`
- Underscored: `.../acer_rubrum`

If the URL itself encodes the binomial, validation passes immediately without fetching the page.

**Check 2–4: HTML Fetch + DOM Inspection**

If URL path check fails, the page is fetched. The HTML is checked against the raw URL cache (`cache/RawHTML/`) first — if the page was already downloaded during this or a prior run, the cached HTML is used. Otherwise the page is fetched with a 10-second timeout using a browser-like User-Agent header.

Once HTML is available, three DOM checks are attempted:

**Check 2: Domain-Specific Selector** (primary)

Each domain in `domain-extraction-config.json` specifies a `primarySelector` — the CSS selector that contains the species name on that site's page layout:

| Domain | Primary Selector | Reason |
|--------|-----------------|--------|
| gobotany.nativeplanttrust.org | `h1` | Species name in standard H1 |
| illinoiswildflowers.info | `title` | H1 not reliable; title tag contains species name |
| wildflower.org | `h2` | Wildflower Center uses H2 (not H1) for species names |
| prairiemoon.com | `h1.product-title, h1` | E-commerce product page layout |
| plants.usda.gov | `h1` | Standard H1 |
| www.missouriplants.com | `h1` | Standard H1 |
| minnesotawildflowers.info | `h2.latin, h2` | Species name in H2 with `.latin` class |

The `selector === 'h1'` and `selector === 'title'` paths are special-cased in the validator; everything else is passed to `querySelectorAll(selector)` and compared.

**Fallback selectors**: Each domain also defines `fallbackSelectors` — a list of secondary selectors tried in order if the primary fails. Example: wildflower.org tries H2 first, then H3, then title.

**Check 3: Schema.org JSON-LD** (structured data)

If the domain-specific selector fails, the validator looks for `<script type="application/ld+json">` tags and checks for a `Taxon` type with a matching `scientificName` or `name`. This is a future-proofing check — few botanical sites currently use this structured data format, but it's a clean signal when present.

**Check 4: Generic Fallback** (for unconfigured domains)

If the URL's domain is not in `domain-extraction-config.json`, the validator falls back to checking the page `<title>` tag, then `<h1>`, then Schema.org — in that order.

### Validation Match Logic

All checks use the same case-insensitive, punctuation-stripped comparison:

```javascript
function normalizeForComparison(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function containsSpeciesName(text, genus, species) {
  const normalizedText = normalizeForComparison(text);
  return normalizedText.includes(normalizeForComparison(genus)) && 
         normalizedText.includes(normalizeForComparison(species));
}
```

Both the genus AND the species epithet must be present in the checked text. A page titled "Acer trees of North America" would not pass validation for *Acer rubrum* because the species epithet "rubrum" is absent.

### Validation Method Recorded

The method that produced a successful match is recorded:
- `url_path` — matched in URL itself, no HTML fetch
- `title` — matched in `<title>` tag
- `h1` — matched in H1 element
- `selector:h2.latin` — matched via custom CSS selector (shows the selector used)
- `schema_org` — matched via structured data

This method is stored in the PageContent cache alongside the content (see Layer 4) and is useful for debugging validation behavior per domain.

### Failed Validation

If all 5 SerpApi results fail validation for a site, that site produces no URL. The partial cache strategy means it is not retried automatically on subsequent runs — the SerpApi cache hit returns the same 5 results. To trigger a fresh search (e.g., the site published a new species page), delete the corresponding SerpApi cache file.

---

## Layer 4: Page Content Extraction

After a URL is validated, the page content is extracted and cached for use in 3-tier LLM synthesis prompts. This happens as a side effect of the URL discovery module — the HTML was already fetched during validation, so it's reused directly without a second network request.

### Content Extraction Strategy

Each domain in `domain-extraction-config.json` has an `extraction` config with two lists:

- **`captureSelectors`**: CSS selectors tried in order; the first matching element with >100 characters of text is used as the content
- **`excludeSelectors`**: elements removed from the DOM before extraction (navigation, sidebars, dropdowns, boilerplate)

**Exclusion happens first**, then capture. This prevents navigation text and site chrome from polluting the extracted content.

**Real domain extraction configs** (summarized):

| Domain | Capture Selectors | Key Exclusions |
|--------|------------------|----------------|
| gobotany.nativeplanttrust.org | `main`, `#content`, `article` | header, footer, nav, sidebar, form |
| illinoiswildflowers.info | `table[width='700'] td`, `body > table td` | index links, banner images, home links |
| wildflower.org | `main` | nav, header, footer, select/option, form, script |
| prairiemoon.com | `#product-info`, `.product-single`, `.product-description`, `.growing-info` | cart, reviews, breadcrumb, price, quantity |
| plants.usda.gov | `#main-content`, `.plant-profile`, `.characteristics` | header, footer, nav, sidebar, search form |
| www.missouriplants.com | `.entry-content`, `article`, `#content` | sidebar, widget, newsletter, comments |
| minnesotawildflowers.info | `article`, `#content`, `.content` | header, footer, nav, script, form |

**Illinois Wildflowers note**: This site uses a 1990s-era table-based layout. The capture selectors specifically target `table[width='700']` — the hardcoded-width table that contains species content on every page. No modern semantic HTML elements apply.

**Prairie Moon note**: Prairie Moon is an e-commerce nursery. The exclusion list specifically strips cart UI, add-to-cart buttons, price displays, quantity selectors, and product review sections — all of which are content noise for botanical synthesis purposes.

### Fallback: Mozilla Readability

If domain-specific extraction produces nothing (no capture selector matches, or the matched element has fewer than 100 characters), the system falls back to Mozilla Readability — a library designed to extract "article" content from arbitrary web pages. Readability uses heuristic scoring based on element density, class names, and content length. It's more robust than explicit selectors for pages not covered by the domain config, but produces more noise for sites with complex layouts.

Extraction method used is recorded in the cache (`"extractionMethod": "domain-specific"` or `"extractionMethod": "readability"`).

### Whitespace Normalization

Extracted text is normalized before storage:
- Collapse multiple consecutive spaces/tabs to a single space
- Trim leading/trailing whitespace from each line
- Collapse more than 2 consecutive newlines to exactly 2

This preserves paragraph structure (double newline = paragraph break) while removing decorative whitespace.

### Page Content Cache

**Location**: `cache/PageContent/`  
**File naming**: `{Genus}_{species}_{slugified_source}.json`  
**Example**: `Acer_rubrum_go_botany.json`

```json
{
  "_meta": {
    "genus": "Acer",
    "species": "rubrum",
    "source": "Go Botany",
    "url": "https://gobotany.nativeplanttrust.org/species/acer/rubrum/",
    "fetchedAt": "2025-12-11T14:08:48.125Z",
    "validatedBy": "url_path",
    "extractionMethod": "domain-specific"
  },
  "content": {
    "title": "Acer rubrum (red maple): Go Botany",
    "h1": "Acer rubrum — red maple",
    "schemaOrg": null,
    "excerpt": "",
    "textContent": "Acer rubrum\nred maple\n\nFamily: Sapindaceae\n..."
  }
}
```

The `textContent` field is what gets included in LLM synthesis prompts as a Tier 2 secondary source.

---

## Raw HTML Cache

**Location**: `cache/RawHTML/`  
**File naming**: `{md5_of_url}.json`  
**Content**: the raw HTML string from the HTTP response, plus the original URL and fetch timestamp

The HTML cache is URL-keyed, not species-keyed. If two species share the same URL (which shouldn't happen for species-specific pages but could for genus pages returned by mistake), they share the same raw HTML cache entry.

This cache is consulted before any HTTP fetch in the validation step. Because HTML is fetched during validation and reused during content extraction, each page URL is fetched at most once per URL — never twice in the same pipeline run or across runs.

**Current scale**: 208 raw HTML files cached (December 2025).

---

## Cache Summary

| Cache | Location | Key | What's Stored |
|-------|----------|-----|--------------|
| URL collection | `cache/ExternalReferences/` | `{genus}_{species}_refURLs.json` | Final validated site → URL mapping per species |
| SerpApi results | `cache/SerpApi/` | `{md5_of_query}.json` | Raw organic_results array per search query |
| Page content | `cache/PageContent/` | `{Genus}_{species}_{source}.json` | Extracted text content per species per site |
| Raw HTML | `cache/RawHTML/` | `{md5_of_url}.json` | Full HTML response per URL |

**Cascade**: On a full cache hit (species already in ExternalReferences cache), the module returns immediately — no SerpApi, no HTML, no page content work. On a partial cache hit (some sites cached), only missing sites trigger API + fetch work.

---

## Domain Extraction Config

**File**: `config/domain-extraction-config.json`

This file serves two separate purposes:
1. **Validation config** (`validation` key per domain): tells the URL validator which DOM element to look for the species name in
2. **Extraction config** (`extraction` key per domain): tells the page content extractor which elements to capture and which to remove

A domain entry is required only if the site needs non-default behavior. The `defaultExtraction` section applies to any domain not explicitly configured:

```json
"defaultExtraction": {
  "captureSelectors": ["main", "article", "#content", ".content", "body"],
  "excludeSelectors": ["header", "footer", "nav", "aside", ".sidebar", ".navigation",
                       ".menu", ".breadcrumb", "script", "style", "noscript", "iframe",
                       "form", "select", "option"]
}
```

There is no `defaultValidation` — unconfigured domains fall back to the hardcoded sequence: title → h1 → Schema.org.

### Tropicos: In Domain Config, Not in Site Registry

`tropicos.org` has an entry in `domain-extraction-config.json` but is **not** in `config/external-reference-urls.json`. This means:
- Tropicos pages that were discovered under an earlier version of the config are still validated and extracted correctly if the HTML was cached
- Tropicos will not be actively searched for in new species runs
- Some species in `cache/ExternalReferences/` still have a "Tropicos" key from when it was in the site registry

This is an example of the partial cache strategy's asymmetry: removing a site from the registry doesn't purge it from existing caches.

### Adding a New Domain

1. Add a site entry to `config/external-reference-urls.json` with `name` and `baseUrl`
2. Manually browse to a species page on the new domain and identify:
   - Which HTML element contains the species name (for `primarySelector`)
   - Whether the site uses H1, H2, a custom class, or the title tag
   - Which navigation/sidebar elements should be excluded from content extraction
3. Add a domain entry to `config/domain-extraction-config.json` with validation and extraction configs
4. Test by running `node test/test-domain-extraction.js` (validates the config against real pages)

---

## File Reference

| File | Purpose |
|------|---------|
| `config/external-reference-urls.json` | Site registry — which domains to search and how |
| `config/domain-extraction-config.json` | Per-domain validation selectors and content extraction rules |
| `src/synthesis/process-external-reference-urls.js` | Pipeline module — orchestrates discovery for all sites |
| `src/utils/species-url-validator.js` | URL validation — checks that a page covers the queried species |
| `src/utils/page-content-client.js` | Page fetching, content extraction, and PageContent caching |
| `src/utils/serpapi-cache.js` | SerpApi result caching (read/write/clear) |
| `src/utils/html-cache.js` | Raw HTML caching (read/write) — shared across the system |
| `cache/ExternalReferences/` | Per-species URL collection cache |
| `cache/SerpApi/` | Per-query SerpApi result cache (cost control) |
| `cache/PageContent/` | Per-species-per-site extracted text content |
| `cache/RawHTML/` | Per-URL raw HTML cache |

---

## End-to-End Flow for One Site, One Species

Tracing *Acer rubrum* on Go Botany end-to-end:

```
1. Load config → site: Go Botany, baseUrl: gobotany.nativeplanttrust.org

2. Read ExternalReferences cache for Acer rubrum
   → "Go Botany" key not present (first run), proceed

3. Build query: "site:gobotany.nativeplanttrust.org Acer rubrum"

4. Check SerpApi cache for MD5("site:gobotany.nativeplanttrust.org acer rubrum")
   → cache miss → call SerpApi live (costs money)

5. SerpApi returns 3 organic results, first being:
   https://gobotany.nativeplanttrust.org/species/acer/rubrum/

6. Write SerpApi results to cache/SerpApi/{md5}.json

7. Validate URL #1: https://gobotany.nativeplanttrust.org/species/acer/rubrum/
   → URL path check: URL contains "acer" and "rubrum" → PASS (validatedBy: "url_path")
   → No HTML fetch needed

8. Write result URL to ExternalReferences cache for Acer rubrum

9. Fetch and cache page content:
   → Check PageContent cache: miss
   → Check RawHTML cache for the URL: miss
   → Fetch HTML from gobotany.nativeplanttrust.org (direct HTTP, not SerpApi)
   → Write HTML to cache/RawHTML/{md5}.json
   → Apply domain-specific extraction (capture "main", exclude nav/footer/etc.)
   → Write extracted text to cache/PageContent/Acer_rubrum_go_botany.json

Next run for Acer rubrum on Go Botany:
   → ExternalReferences cache hit → return immediately, 0 API calls, 0 HTTP fetches
```

---

## Cost Reduction Options

Given that SerpApi costs were higher than expected, there are several levers available:

**1. Reduce `numSearchResults`** in `config/external-reference-urls.json`  
Currently `5`. Changing to `3` or `1` reduces tokens billed per search but also reduces the chances of finding a valid URL if the first results are category pages. For well-structured sites where the species page is always the top result (Go Botany, Minnesota Wildflowers), `1` is sufficient.

**2. Pre-populate caches from known URL patterns**  
Some sites have highly predictable URL structures. Go Botany, for example, always uses `https://gobotany.nativeplanttrust.org/species/{genus}/{species}/`. If a URL following the known pattern can be validated directly (URL path check passes), write it to the SerpApi cache as a synthetic hit with an empty `organic_results` array — but better, write it directly to the ExternalReferences cache with `validatedBy: "url_path"`, skipping SerpApi entirely. This is the most impactful optimization for sites with deterministic URL patterns.

**3. Remove sites that rarely return results**  
If a particular site consistently returns no results for the species you process, its SerpApi queries are wasted money. Review the SerpApi cache for zero-result entries and consider removing low-yield sites from the registry.

**4. Batch wisely**  
SerpApi has no per-day limits (only rate limits), but costs scale linearly with searches. Processing species in batches and preserving the cache between runs ensures each unique species+site pair is only searched once ever. The biggest risk is cache loss (accidental deletion, environment reset).

**5. Use the direct URL approach for predictable sites**  
The `useDirectUrl: true` flag (currently only on Google Images) can be applied to any site with deterministic URL patterns, skipping SerpApi entirely. This requires also writing the URL directly to the ExternalReferences cache with a validation step run independently.
