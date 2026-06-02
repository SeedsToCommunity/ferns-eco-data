-- Correct NPN schema: drop unused habitat column, rename physiography → growth_form,
-- add three ecological score columns (conservatism C, wetness W, shade S).
-- All three scores are signed integers stored as text (W and S can be negative).

ALTER TABLE "npn_species" DROP COLUMN IF EXISTS "habitat";
ALTER TABLE "npn_species" RENAME COLUMN "physiography" TO "growth_form";
ALTER TABLE "npn_species" ADD COLUMN IF NOT EXISTS "conservatism_coefficient" text;
ALTER TABLE "npn_species" ADD COLUMN IF NOT EXISTS "wetness_coefficient" text;
ALTER TABLE "npn_species" ADD COLUMN IF NOT EXISTS "shade_coefficient" text;
