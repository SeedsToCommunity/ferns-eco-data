# Draft Letter — MNFI Data Sharing Inquiry

**To:** Michigan Natural Features Inventory (MNFI), MSU Extension  
**From:** [Your name / organization]  
**Subject:** Data Sharing Inquiry — Non-sensitive Observational and Community Data for Open Research Platform

---

Dear MNFI Team,

I am writing to inquire about the possibility of a data sharing arrangement with MNFI for use in an open ecological data research platform I am developing. I have been working closely with MNFI's publicly available resources — including the Natural Community Classification, plant lists, and county element pages — and find the depth and quality of your data to be exceptional.

## What I Am Building

I am building FERNS (Federated Ecological Resource Network System), a federated ecological data API that aggregates, cross-references, and exposes publicly available ecological datasets through a unified API and explorer interface. The goal is to support ecological research, land stewardship planning, and public nature education in Michigan and the broader Great Lakes region.

FERNS currently integrates data from GBIF, iNaturalist, the USDA PLANTS database, Michigan Flora (University of Michigan Herbarium), the Floristic Quality Assessment for Michigan, USDA WUCOLS, Seeds to Community Washtenaw, and the Lake County Seed Collection Guides.

## Data I Am Requesting

I am specifically interested in the following non-sensitive data categories:

### 1. County Element Data (Species and Natural Communities by County)

Your county element pages at `https://mnfi.anr.msu.edu/resources/county-element-data` are publicly accessible, but the data is served through a JavaScript-rendered web interface that is not accessible via automated HTTP requests. I am requesting a direct data export — CSV, JSON, or any format you prefer — covering the elements listed on those public pages:

- Scientific name
- Common name
- Federal and state status codes
- Global and state ranks
- Occurrence count per county
- Year last observed in county

I have **no interest in rare, endangered, or protected species location data** beyond what is already published on your public county element pages. I would accept any restrictions you wish to place on which status categories are included.

### 2. Historical Observational Records

I am also interested in non-location-sensitive occurrence and observational records that could support application development — for example, phenological data, community association data, or watershed-level occurrence summaries. I understand you have subscription-based access to your web database and a Special Data Requests program for bulk data.

I would happily work within whatever scope and conditions you determine appropriate. My interest is in supporting public ecological understanding, not in exposing any data you consider sensitive.

### 3. Vegetation Circa 1800 GIS Layer

Your interactive map at `https://mnfi.anr.msu.edu/resources/vegetation-circa-1800` is a remarkable resource based on GLO survey records. I note that it is available as an interactive ArcGIS viewer and per-county PDFs, but not as a downloadable GIS dataset. If this layer is available for research use in GeoJSON, Shapefile, or GeoPackage format, I would appreciate the opportunity to integrate it. If not, I understand completely and will continue directing users to your interactive viewer.

## How the Data Would Be Used

- All data from MNFI would be attributed clearly and prominently, with links to MNFI pages for every record.
- No MNFI data would be resold or used commercially.
- The API would be open and publicly accessible, with MNFI credited as the authoritative source.
- I would be happy to link back to MNFI's information request and subscription services for users who need more detailed data.
- Any restrictions on sensitive species locations would be strictly honored.

## What I Have Already Integrated

From your publicly available pages, I have already imported:

- The complete Natural Community Classification (77 community types) with class/group/rank taxonomy
- Full community description text (overview, landscape context, soils, natural processes, vegetation, management notes, similar communities) scraped from your public description pages
- Characteristic plant species lists by life form for all 77 community types from your public plant-list pages

The county element data is the primary gap I am hoping to fill through this request.

## Contact

I would welcome a conversation about what data might be shareable and under what terms. Please feel free to reach out with questions or to discuss this further.

Thank you for the extraordinary work MNFI does documenting Michigan's natural heritage. I would be honored to help make your publicly available information more discoverable and accessible.

---

*This letter was drafted in connection with FERNS Task #34 (MNFI data integration). Circa 1800 GIS layer noted as not available for download; county element data noted as JavaScript-rendered with no public API. Both items raised in this letter.*
