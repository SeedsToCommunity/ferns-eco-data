-- Migration 0010: add flower_color and physiography to npn_species.
-- These fields are available from the Zope/MySQL report endpoint
-- (nativeplant.com/plants/search/report) but not from individual species pages.
-- Using IF NOT EXISTS so it is safe to re-run.

ALTER TABLE "npn_species" ADD COLUMN IF NOT EXISTS "flower_color" text;
ALTER TABLE "npn_species" ADD COLUMN IF NOT EXISTS "physiography" text;
