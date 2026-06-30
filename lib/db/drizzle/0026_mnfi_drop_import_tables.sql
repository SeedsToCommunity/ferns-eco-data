-- Drop MNFI import-loop tables in FK-dependency order.
-- Under the new architecture, MNFI data lives in TypeScript data files
-- committed to the repo; no DB tables are needed for MNFI content.
-- The registry entry (ferns_sources table) is unaffected.
DROP TABLE IF EXISTS mnfi_community_plants;
DROP TABLE IF EXISTS mnfi_county_elements;
DROP TABLE IF EXISTS mnfi_communities;
