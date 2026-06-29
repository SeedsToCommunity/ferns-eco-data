-- Migration 0025: Drop stale flat-struct columns from NatureServe cache tables.
--
-- These columns were added in 0016 to store FERNS-extracted fields from the
-- upstream NatureServe response. Task B (EDP rewire) switched both tables to
-- store the verbatim upstream_response (jsonb) instead. The flat-struct columns
-- are no longer written by the route handlers or cache service, and querying
-- them returns NULL for all rows inserted after Task B. They are removed here
-- to eliminate the misleading dead schema surface.
--
-- natureserve_species_cache: drops 20 stale columns (scientific_name,
-- common_name, global_rank, rounded_global_rank, national_rank,
-- rounded_national_rank, state_code, state_rank, rounded_state_rank,
-- iucn_category, iucn_description, federal_status, federal_status_description,
-- state_status, cites_description, cosewic_code, cosewic_description,
-- natureserve_url, element_global_id, raw_summary).
--
-- natureserve_ecosystems_cache: drops 2 stale columns (results, result_count).
-- The results array is now stored in upstream_response (jsonb).
--
-- DROP COLUMN IF EXISTS guards make every statement idempotent.

ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "scientific_name";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "common_name";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "global_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "rounded_global_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "national_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "rounded_national_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "state_code";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "state_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "rounded_state_rank";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "iucn_category";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "iucn_description";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "federal_status";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "federal_status_description";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "state_status";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "cites_description";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "cosewic_code";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "cosewic_description";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "natureserve_url";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "element_global_id";
--> statement-breakpoint
ALTER TABLE "natureserve_species_cache" DROP COLUMN IF EXISTS "raw_summary";
--> statement-breakpoint
ALTER TABLE "natureserve_ecosystems_cache" DROP COLUMN IF EXISTS "results";
--> statement-breakpoint
ALTER TABLE "natureserve_ecosystems_cache" DROP COLUMN IF EXISTS "result_count";
