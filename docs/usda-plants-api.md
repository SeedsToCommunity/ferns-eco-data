# USDA PLANTS Database API

Reverse-engineered from the Angular frontend at `https://plants.usda.gov/home`
(which redirects to `https://plants.sc.egov.usda.gov/`).

---

## How This Was Discovered

### Step 1 — Follow the redirect

`https://plants.usda.gov/home` issues an HTTP redirect to `https://plants.sc.egov.usda.gov/`. All further work targets that domain.

### Step 2 — Identify the JavaScript bundle

The homepage HTML loads four scripts:

```
./assets/js/json2csv.js
./assets/js/uswds-init.min.js
runtime.js
polyfills.js
main.js        ← Angular application bundle
```

The application is a full Angular SPA. The single bundle of interest is `main.js` at `https://plants.sc.egov.usda.gov/main.js`.

### Step 3 — Find the config file

Searching `main.js` for JSON asset references revealed:

```
assets/config.json
```

### Step 4 — Read the config file

`GET https://plants.sc.egov.usda.gov/assets/config.json` returns:

```json
{
  "env": { "name": "Prod" },
  "gtmId": "GTM-WHWMP8S4",
  "serviceUrls": {
    "mapServerUrl": "https://apps.geo.fpac.usda.gov/nrcs-geodata/rest/services/land_use_land_cover/plants/MapServer",
    "mapBoundaryUrl": "https://apps.geo.fpac.usda.gov/nrcs-geodata/rest/services/government_units/plants_boundaries/MapServer",
    "plantsServicesUrl": "https://plantsservices.sc.egov.usda.gov/api/",
    "plantsUrl": "https://plants.sc.egov.usda.gov",
    "imageLibraryUrl": "https://plants.sc.egov.usda.gov/ImageLibrary",
    "plantGuideUrl": "https://plants.sc.egov.usda.gov/DocumentLibrary/plantguide/",
    "basemapUrl": "https://services.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer",
    "printServiceUrl": "https://intranet.geo.fpac.usda.gov/nrcs-gp/rest/services/geoprocess/plants_export_web_map/GPServer/plants_export_web_map",
    "healthCheckUrl": "https://plantsservices.sc.egov.usda.gov/healthcheck"
  },
  "featureFlags": {}
}
```

This gives the backend API base: `https://plantsservices.sc.egov.usda.gov/api/`

### Step 5 — Trace the search service

Searching `main.js` for `serviceUrl` and `plants-search-results` revealed:

- `serviceUrl = this.appConfig.getPlantsAPIUrl()` — resolves to `plantsServicesUrl`
- The search call: `this.http.post(url, requestBody, { headers })` — **a POST**, not a GET

Attempting GET calls to the search endpoint returned empty responses; POST with the correct JSON body returns full results.

### Step 6 — Reconstruct the data models

The Angular bundle contains the compiled TypeScript source of the data models (`SearchCriteria`, `BasicSearchCriteria`) and enums (`SearchResultType`, `SearchType`) as readable class and function bodies in the webpack output. These were extracted directly.

---

## Base URL

```
https://plantsservices.sc.egov.usda.gov/api/
```

No authentication required. No API key. No rate-limit documentation available.

---

## Endpoints

### `GET /healthcheck`

Service health check. Returns the string `Health Check Succeeded` on HTTP 200.

---

### `POST /plants-search-results`

Main plant search. Returns paginated results.

**Headers:** `Content-Type: application/json`

**Request body** (`SearchCriteria` object):

| Field | Type | Notes |
|---|---|---|
| `Text` | string | Search text |
| `Field` | string | One of `"Scientific Name"`, `"Common Name"`, `"Symbol"`, `"Family"` |
| `SortBy` | string | e.g. `"sortSciName"` |
| `Offset` | number | Use `-1` for no offset |
| `FilterOptions` | object \| null | Filter object from a prior search response, or `null` |
| `UnfilteredPlantIds` | array \| null | Used when re-running with filters |
| `Type` | string | `SearchResultType` value (see enum below) |
| `TaxonSearchCriteria` | object \| null | `null` for basic text search |
| `MasterId` | number | `-1` for basic searches |
| `pageNumber` | number | 1-based page number |
| `allData` | number | `0` = paginated, `1` = return all records |
| `Locations` | array \| null | State/region filter (for state search) |
| `Groups` | array \| null | Taxonomic group filter |
| `Durations` | array \| null | e.g. `["Annual"]`, `["Perennial"]` |
| `GrowthHabits` | array \| null | e.g. `["Tree"]`, `["Forb/herb"]` |
| `WetlandRegions` | array \| null | |
| `NoxiousLocations` | array \| null | |
| `InvasiveLocations` | array \| null | |

Minimum working body for a basic scientific name search:

```json
{
  "Text": "Trillium",
  "Field": "Scientific Name",
  "SortBy": "sortSciName",
  "Offset": -1,
  "FilterOptions": null,
  "UnfilteredPlantIds": null,
  "Type": "Basic",
  "TaxonSearchCriteria": null,
  "MasterId": -1,
  "pageNumber": 1,
  "allData": 0
}
```

**Response object:**

| Field | Type | Notes |
|---|---|---|
| `PlantResults` | array | Array of `PlantResult` objects (see below) |
| `TotalResults` | number | Total matching records across all pages |
| `TotalImageCount` | number | Total images in result set |
| `Offset` | number | Current offset |
| `ResultId` | string (UUID) | Server-side session ID for the result set; passed as query param when navigating to `/basic-search-results` |
| `FilterOptions` | object | Available filters for the result set (for refining search) |
| `SelectedFilters` | object | Currently applied filters |
| `Sources` | array | Data source references |

**`PlantResult` object:**

| Field | Type | Notes |
|---|---|---|
| `Id` | number | Internal plant ID |
| `AcceptedId` | number | Accepted taxon ID |
| `IsSynonym` | boolean | Whether this record is a synonym |
| `Symbol` | string | PLANTS symbol (e.g. `"TRGR4"`) |
| `AcceptedSymbol` | string | Accepted taxon symbol |
| `ScientificName` | string | With HTML `<i>` tags around genus/species |
| `ScientificNameWithoutAuthor` | string | Clean scientific name |
| `CommonName` | string | Primary common name |
| `FamilyName` | string | e.g. `"Liliaceae"` |
| `NumImages` | number | Images for this taxon specifically |
| `TotalImageCount` | number | Total images in the result set |
| `TotalRowCount` | number | Total result count (same value on every record in the page) |
| `ProfileImageFilename` | string | Filename relative to `imageLibraryUrl` |
| `Synonyms` | array \| null | Inline synonym records (same shape, `Synonyms` field is `null`) |
| `FactSheetUrls` | array | |
| `PlantGuideUrls` | array | |
| `LegalStatuses` | array | |
| `WetlandData` | array | |
| `InvasiveStatuses` | array | |
| `NoxiousStatuses` | array | |

---

### `GET /PlantSearch?searchText={text}`

Autocomplete / typeahead search. Returns an array of lightweight match objects used to populate the search suggestions dropdown. Each item has `Text` (the display HTML string with `<i>` tags) and a nested `Plant` object with the full plant fields listed in the `PlantProfile` section below (most fields are `null` in this lightweight response).

Example:
```
GET /PlantSearch?searchText=Trillium+grandiflorum
```

---

### `GET /PlantProfile?symbol={symbol}`

Full plant profile for a given PLANTS symbol. Also accepts an optional `searchName` parameter:

```
GET /PlantProfile?symbol=TRGR4
GET /PlantProfile?symbol=TRGR4&searchName=Trillium+grandiflorum
```

**Response fields:**

| Field | Type | Notes |
|---|---|---|
| `Id` | number | Internal ID |
| `Symbol` | string | PLANTS symbol |
| `ScientificName` | string | With `<i>` HTML tags |
| `ScientificNameWithoutAuthor` | string | |
| `ScientificNameComponents` | object \| null | |
| `CommonName` | string | |
| `OtherCommonNames` | array | |
| `Group` | string | e.g. `"Monocot"` |
| `Rank` | string | e.g. `"Species"`, `"Genus"` |
| `RankId` | number | Numeric rank code |
| `Durations` | array | e.g. `["Perennial"]` |
| `GrowthHabits` | array | e.g. `["Forb/herb"]` |
| `NativeStatuses` | array | Objects with `Region`, `Status` (`"N"` or `"I"`), `Type` (`"Native"` or `"Introduced"`) |
| `MapCoordinates` | array | Bounding boxes per region (`StateAbbr`, `XMin`, `YMin`, `XMax`, `YMax`) |
| `PlantsDistributionResults` | object \| null | State-level distribution data |
| `AcceptedId` | number | |
| `AcceptedSymbol` | string | |
| `AcceptedScientificName` | string | |
| `AcceptedCommonName` | string | |
| `HasSynonyms` | boolean | |
| `Synonyms` | array \| null | Populated when `HasSynonyms` is true |
| `Ancestors` | array | Full taxonomic hierarchy (Kingdom → Species), each item is a full plant object |
| `HasSubordinateTaxa` | boolean | |
| `SubordinateTaxa` | array \| null | |
| `HasWildlife` | boolean | |
| `Wildlife` | object \| null | |
| `HasWetlandData` | boolean | |
| `WetlandData` | object \| null | |
| `WetlandDataString` | string \| null | Human-readable wetland indicator summary |
| `HasImages` | boolean | |
| `NumImages` | number | |
| `ProfileImageFilename` | string \| null | |
| `ImageId` | number | |
| `HasRelatedLinks` | boolean | |
| `RelatedLinks` | array \| null | |
| `HasLegalStatuses` | boolean | |
| `LegalStatuses` | array \| null | |
| `HasNoxiousStatuses` | boolean | |
| `NoxiousStatuses` | array \| null | |
| `NoxiousInvasiveDataString` | string \| null | |
| `HasInvasiveStatuses` | boolean | |
| `InvasiveStatuses` | array \| null | |
| `ProtectedStatuses` | array \| null | |
| `HasDocumentation` | boolean | |
| `HasDistributionData` | boolean | |
| `Documentation` | object \| null | |
| `PlantNotes` | string \| null | |
| `HasCharacteristics` | boolean | |
| `Characteristics` | object \| null | Morphological / ecological characteristics |
| `HasEthnobotany` | boolean | |
| `Ethnobotanies` | array \| null | |
| `HasPollinator` | boolean | |
| `RarityDataString` | string \| null | |
| `PlantGuideUrls` | array \| null | |
| `FactSheetUrls` | array \| null | |
| `PlantLocationId` | number | |
| `FipsCode` | string \| null | |

---

### `GET /PlantSpotlight`

Returns the current featured plant (used on the homepage hero). Same shape as a `PlantProfile` response.

---

### `POST /characteristicSearchResults`

Morphological / ecological characteristic search. Same POST pattern as `/plants-search-results` but with `Type: "Characteristics"` and relevant characteristic filter arrays populated on the request body.

---

### `POST /characteristicSearchFilterResults`

Returns updated filter counts for a characteristic search in progress (used for the filter sidebar).

---

### `POST /plants-search-results/download`
### `POST /characteristicSearchResultsDownload`

CSV export variants of the respective search endpoints. Same request body; response is a CSV file.

---

### `GET /imageSearch/getResultFilter`

Returns available filter options for image search.

---

### `GET /plantsDownload/GetGSATStateList`

Returns the list of US states available for the state-level GSAT (Grasses, Sedges, and other terrestrial plants) download tool.

---

### `GET /plantsDownload/GetGSATByState?state={stateAbbr}`

Returns GSAT data for a given state abbreviation.

---

### `GET /plantsDownload/GetUnkownSymbolCSV`

Returns a CSV of plant records whose symbols could not be resolved.

---

### `GET /common/getCoverCropPlants?orderBy={field}`

Returns the list of plants designated as cover crops, ordered by the specified field.

---

### `GET /common/getCulturallySignificantPlants`

Returns the list of plants flagged as culturally significant.

---

## Enums (from source)

### `SearchResultType` (the `Type` field on POST bodies)

| Key | Wire value |
|---|---|
| `Basic` | `"Basic"` |
| `Characteristics` | `"Characteristics"` |
| `Duration` | `"Duration"` |
| `FactSheetPlantGuide` | `"Documents"` |
| `Group` | `"Group"` |
| `GrowthHabit` | `"Growth Habit"` |
| `Image` | `"Images"` |
| `Invasive` | `"Invasive"` |
| `Noxious` | `"Noxious"` |
| `Rarity` | `"Rarity"` |
| `State` | `"State"` |
| `Wetland` | `"Wetland"` |

### `SearchType` (internal Angular routing enum, not sent on the wire)

`CharacteristicsSearch`, `BasicSearch`, `DurationSearch`, `FactSheetPlantGuideSearch`, `GrowthHabitSearch`, `GroupSearch`, `ImageSearch`, `NoxiousInvasiveSearch`, `RaritySearch`, `StateSearch`

### `Field` values for basic search

`"Scientific Name"`, `"Common Name"`, `"Symbol"`, `"Family"`

---

## Image URL pattern

Profile images are served from:

```
https://plants.sc.egov.usda.gov/ImageLibrary/{ProfileImageFilename}
```

Example: `ProfileImageFilename: "trgr4_1ht.jpg"` →
`https://plants.sc.egov.usda.gov/ImageLibrary/trgr4_1ht.jpg`

---

## Notes

- No public API documentation exists. The API is undocumented and unofficial.
- No authentication or API key is required as of April 2026.
- The `ResultId` UUID in the search response is a server-side session token for the result set. It is used by the Angular frontend as a `?resultId=` query parameter to navigate to the results page, but is not required to call the API directly — results are returned inline in the POST response.
- `ScientificName` fields include HTML `<i>` tags; strip or parse as needed.
- `TotalRowCount` is repeated on every record in a page response rather than being a top-level field. Use `TotalResults` from the response envelope instead.
