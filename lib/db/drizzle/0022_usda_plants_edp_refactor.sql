DROP TABLE IF EXISTS "usda_plants_name_matches";
ALTER TABLE "usda_plants_profiles" DROP COLUMN IF EXISTS "general_summary";
ALTER TABLE "usda_plants_profiles" DROP COLUMN IF EXISTS "technical_details";
