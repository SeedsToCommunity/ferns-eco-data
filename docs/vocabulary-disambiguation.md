## Coefficient & Wetness Vocabulary Reference

The ecological/botanical domain contains several metrics whose names are superficially similar but measure entirely different things. This is a known source of confusion for both humans and agents. FERNS sources that use any of these metrics must disambiguate explicitly in their description fields.

| Metric | FERNS Source ID (planned) | Scale | Authority | Domain | What it is NOT |
|---|---|---|---|---|---|
| Coefficient of Conservatism (C-value) | `fqa-coefficient-of-conservatism` | 0–10 (integer string) or `"*"` for non-native | Swink & Wilhelm, Floristic Quality Assessment | Ecological fidelity of a native plant to intact, undisturbed communities | Not a wetness measure; not a watering guide; not the Coefficient of Wetness |
| Coefficient of Wetness (W) | `wetland-indicator-status` | −5 to +5 (five discrete values: −5, −3, 0, +3, +5) | Swink & Wilhelm, Floristic Quality Assessment | Numeric expression of a plant's wetland affinity; companion to WIS categorical codes | Not the C-value (Conservatism); not WUCOLS; the scale is −5 to +5, not 0–10 |
| Wetland Indicator Status (WIS) | `wetland-indicator-status` | Categorical: OBL / FACW / FAC / FACU / UPL | USDA National Wetland Plant List (NWPL) / U.S. Army Corps of Engineers | Probability that a plant species occurs in a wetland habitat | Not an irrigation guide; not a gardening watering recommendation |
| WUCOLS Water Use Classification | `wucols-water-use` | VL / L / M / H (percentage of reference evapotranspiration) | UC Cooperative Extension | Supplemental irrigation need of a species in managed landscape settings | Not an ecological wetness measure; not related to Swink & Wilhelm FQA |
| 1–10 Wetness Convention | *(no FERNS source — non-standard)* | 1–10 (mapping varies by publisher) | No single authority | Used by some nursery databases as a numeric approximation of WIS | Not a published standard; FERNS does not treat it as authoritative; different publishers implement it differently |

**Michigan Flora fields that use these metrics:**
- `c` — Coefficient of Conservatism (string, `"0"`–`"10"` or `"*"`)
- `w` — Coefficient of Wetness (numeric, one of: −5, −3, 0, 3, 5)
- `wet` — Wetland Indicator Status (string: `OBL`, `FACW`, `FAC`, `FACU`, `UPL`)