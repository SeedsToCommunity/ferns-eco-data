-- Replace flat columns in natureserve_species_cache with raw_response jsonb.
-- Cache data is ephemeral; truncating is safe and avoids complex column-by-column migration.
TRUNCATE TABLE natureserve_species_cache;

ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS scientific_name;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS common_name;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS global_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS rounded_global_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS national_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS rounded_national_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS state_code;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS state_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS rounded_state_rank;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS iucn_category;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS iucn_description;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS federal_status;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS federal_status_description;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS state_status;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS cites_description;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS cosewic_code;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS cosewic_description;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS natureserve_url;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS element_global_id;
ALTER TABLE natureserve_species_cache DROP COLUMN IF EXISTS raw_summary;

ALTER TABLE natureserve_species_cache ADD COLUMN IF NOT EXISTS raw_response jsonb NOT NULL DEFAULT '{}';
