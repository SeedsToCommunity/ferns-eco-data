-- Migration 0002: add species_page_text_cache table
--
-- Caches scraped botanical prose text from five web reference sources
-- (illinois-wildflowers, missouri-plants, minnesota-wildflowers, gobotany, prairie-moon).
-- Safe to run in any state: uses IF NOT EXISTS throughout.

CREATE TABLE IF NOT EXISTS "species_page_text_cache" (
  "id" serial PRIMARY KEY NOT NULL,
  "site_id" text NOT NULL,
  "scientific_name" text NOT NULL,
  "url" text,
  "found" boolean NOT NULL,
  "sections" jsonb,
  "full_text" text,
  "scraped_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "species_page_text_cache_site_name_uniq" UNIQUE("site_id","scientific_name")
);
