# MNFI element_id Verification

**Date**: 2026-06-29
**Species used**: *Cirsium pitcheri* (Pitcher's thistle)
**County tested**: Antrim County (ID 4)

## Result

County feed ELEMENT_ID: 13485
Species-page URL id: 13485
Match: **YES**

## Implication

The `ELEMENT_ID` returned by the MNFI county feed (`/resources/countyQuery?county={id}`) is identical to the numeric id embedded in species-page URLs (`/species/description/{id}/...`). This means a fast integer join on `element_id` is reliable as the primary key across the `county_species`, `community_rare_species`, and `rare_species` tables. Scientific name may still be stored as a human-readable fallback, but it does not need to serve as the join key; the integer `element_id` is sufficient and unambiguous.

## Method

1. Fetched the county species feed for Antrim County (ID 4): `GET https://mnfi.anr.msu.edu/resources/countyQuery?county=4`. The response contained 64 rows as a JSON array of objects. *Cirsium pitcheri* was present with `ELEMENT_ID: 13485`.
2. Fetched the rare-species plants roster: `GET https://mnfi.anr.msu.edu/species/plants` (server-rendered HTML, 194 KB). Located 902 `/species/description/{id}/...` href links. The link for *Cirsium pitcheri* resolved to `/species/description/13485/cirsium-pitcheri`, giving URL id **13485**.
3. Both values are **13485** — an exact match.
