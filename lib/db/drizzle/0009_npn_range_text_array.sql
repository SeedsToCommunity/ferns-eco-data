-- Migration 0009: change npn_species.range_michigan from jsonb to text[].
-- The table was empty when this migration was added (auto-import requires
-- live network access to nativeplant.com), so drop-and-add is safe.

ALTER TABLE "npn_species" DROP COLUMN IF EXISTS "range_michigan";
ALTER TABLE "npn_species" ADD COLUMN "range_michigan" text[];
