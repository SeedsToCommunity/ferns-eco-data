-- Add individual data columns to natureserve_species_cache.
-- The table was originally created with raw_response (jsonb) for the full species payload.
-- The schema was later refactored to individual columns; this migration applies that change.
ALTER TABLE "natureserve_species_cache"
  ADD COLUMN IF NOT EXISTS "scientific_name" text,
  ADD COLUMN IF NOT EXISTS "common_name" text,
  ADD COLUMN IF NOT EXISTS "global_rank" text,
  ADD COLUMN IF NOT EXISTS "rounded_global_rank" text,
  ADD COLUMN IF NOT EXISTS "national_rank" text,
  ADD COLUMN IF NOT EXISTS "rounded_national_rank" text,
  ADD COLUMN IF NOT EXISTS "state_code" text,
  ADD COLUMN IF NOT EXISTS "state_rank" text,
  ADD COLUMN IF NOT EXISTS "rounded_state_rank" text,
  ADD COLUMN IF NOT EXISTS "iucn_category" text,
  ADD COLUMN IF NOT EXISTS "iucn_description" text,
  ADD COLUMN IF NOT EXISTS "federal_status" text,
  ADD COLUMN IF NOT EXISTS "federal_status_description" text,
  ADD COLUMN IF NOT EXISTS "state_status" text,
  ADD COLUMN IF NOT EXISTS "cites_description" text,
  ADD COLUMN IF NOT EXISTS "cosewic_code" text,
  ADD COLUMN IF NOT EXISTS "cosewic_description" text,
  ADD COLUMN IF NOT EXISTS "natureserve_url" text,
  ADD COLUMN IF NOT EXISTS "element_global_id" text,
  ADD COLUMN IF NOT EXISTS "raw_summary" jsonb DEFAULT '{}'::jsonb;
