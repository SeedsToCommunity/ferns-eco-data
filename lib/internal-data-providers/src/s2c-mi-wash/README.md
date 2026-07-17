# Seeds to Community Washtenaw — Data Sources

## `S2C_Species_Data_Main_20251207_1781820534496.csv`

This file is the master species spreadsheet from Seeds to Community Washtenaw, captured
2025-12-07. It is the authoritative source for `species-information-data.ts` and is kept
here for historical reference and auditability.

**This file is NOT imported by any code.** The data was transcribed into
`species-information-data.ts` at the time the file was ingested. To update the data,
re-run the ingestion script against a new CSV and regenerate `species-information-data.ts`.

### Rows excluded from `species-information-data.ts`

Seventeen rows from the CSV are omitted:

- **13 Old Name rows** (`S2C Lists = "Old Name"`): deprecated botanical names superseded
  by currently-accepted taxonomy.
- **4 Non-Native rows** (`S2C Lists = "Non-Native"` or `"NOT NATIVE"`): species outside
  the S2C program's Michigan-native scope.

All remaining ~215 species are included verbatim.
