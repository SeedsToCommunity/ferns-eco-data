-- Migration 0001: fix schema carried over from earlier deployments
--
-- Safe to run in any state:
--   • Renames ferns_sources_source_id_key → ferns_sources_source_id_unique
--     (prevents Replit's DB sync from dropping+recreating it mid-transaction,
--      which would break foreign key creation for source_relationships)
--   • Adds columns that ferns_sources was missing in production
--   • Drops old derivation_summary / derivation_scientific columns from all
--     cache tables (they may have been renamed by Replit DB sync already)
--   • Drops the obsolete registry_entries table
--   • Creates source_relationships, botanical_species_lists,
--     botanical_web_refs_cache IF NOT EXISTS

-- 1. Rename the unique constraint on ferns_sources.source_id so its name
--    matches what Drizzle expects. Without this, Replit DB sync drops it
--    and recreates it in the same transaction as the FK addition, causing
--    "no unique constraint matching given keys" errors.
DO $$ BEGIN
  IF EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ferns_sources_source_id_key'
      AND conrelid = 'ferns_sources'::regclass
  ) AND NOT EXISTS(
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ferns_sources_source_id_unique'
      AND conrelid = 'ferns_sources'::regclass
  ) THEN
    ALTER TABLE ferns_sources RENAME CONSTRAINT ferns_sources_source_id_key TO ferns_sources_source_id_unique;
  END IF;
END $$;
--> statement-breakpoint

-- 2. Add columns that were missing from the original ferns_sources table
DO $$ BEGIN
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='ferns_sources' AND column_name='permission_granted') THEN
    ALTER TABLE ferns_sources ADD COLUMN permission_granted boolean;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='ferns_sources' AND column_name='permission_status') THEN
    ALTER TABLE ferns_sources ADD COLUMN permission_status text;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='ferns_sources' AND column_name='general_summary') THEN
    ALTER TABLE ferns_sources ADD COLUMN general_summary text;
  END IF;
  IF NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='ferns_sources' AND column_name='technical_details') THEN
    ALTER TABLE ferns_sources ADD COLUMN technical_details text;
  END IF;
END $$;
--> statement-breakpoint

-- 3. Drop old column names from cache tables (idempotent)
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bonap_maps' AND column_name='derivation_summary') THEN
    ALTER TABLE bonap_maps DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='bonap_maps' AND column_name='derivation_scientific') THEN
    ALTER TABLE bonap_maps DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_name_matches' AND column_name='derivation_summary') THEN
    ALTER TABLE gbif_name_matches DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_name_matches' AND column_name='derivation_scientific') THEN
    ALTER TABLE gbif_name_matches DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_occurrences' AND column_name='derivation_summary') THEN
    ALTER TABLE gbif_occurrences DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_occurrences' AND column_name='derivation_scientific') THEN
    ALTER TABLE gbif_occurrences DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_synonyms' AND column_name='derivation_summary') THEN
    ALTER TABLE gbif_synonyms DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_synonyms' AND column_name='derivation_scientific') THEN
    ALTER TABLE gbif_synonyms DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_vernacular_names' AND column_name='derivation_summary') THEN
    ALTER TABLE gbif_vernacular_names DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='gbif_vernacular_names' AND column_name='derivation_scientific') THEN
    ALTER TABLE gbif_vernacular_names DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_field_values' AND column_name='derivation_summary') THEN
    ALTER TABLE inat_field_values DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_field_values' AND column_name='derivation_scientific') THEN
    ALTER TABLE inat_field_values DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_histogram' AND column_name='derivation_summary') THEN
    ALTER TABLE inat_histogram DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_histogram' AND column_name='derivation_scientific') THEN
    ALTER TABLE inat_histogram DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_places' AND column_name='derivation_summary') THEN
    ALTER TABLE inat_places DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_places' AND column_name='derivation_scientific') THEN
    ALTER TABLE inat_places DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_species' AND column_name='derivation_summary') THEN
    ALTER TABLE inat_species DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='inat_species' AND column_name='derivation_scientific') THEN
    ALTER TABLE inat_species DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_counties_cache' AND column_name='derivation_summary') THEN
    ALTER TABLE miflora_counties_cache DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_counties_cache' AND column_name='derivation_scientific') THEN
    ALTER TABLE miflora_counties_cache DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_images_cache' AND column_name='derivation_summary') THEN
    ALTER TABLE miflora_images_cache DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_images_cache' AND column_name='derivation_scientific') THEN
    ALTER TABLE miflora_images_cache DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_species_cache' AND column_name='derivation_summary') THEN
    ALTER TABLE miflora_species_cache DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='miflora_species_cache' AND column_name='derivation_scientific') THEN
    ALTER TABLE miflora_species_cache DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='natureserve_ecosystems_cache' AND column_name='derivation_summary') THEN
    ALTER TABLE natureserve_ecosystems_cache DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='natureserve_ecosystems_cache' AND column_name='derivation_scientific') THEN
    ALTER TABLE natureserve_ecosystems_cache DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='natureserve_species_cache' AND column_name='derivation_summary') THEN
    ALTER TABLE natureserve_species_cache DROP COLUMN derivation_summary;
  END IF;
  IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='natureserve_species_cache' AND column_name='derivation_scientific') THEN
    ALTER TABLE natureserve_species_cache DROP COLUMN derivation_scientific;
  END IF;
END $$;
--> statement-breakpoint

-- 4. Drop the obsolete registry_entries table
DROP TABLE IF EXISTS "registry_entries";
--> statement-breakpoint

-- 5. Create new tables that may be missing from production (IF NOT EXISTS = safe no-op)
CREATE TABLE IF NOT EXISTS "source_relationships" (
        "id" serial PRIMARY KEY NOT NULL,
        "source_id_a" text NOT NULL,
        "source_id_b" text NOT NULL,
        "relationship_type" text NOT NULL,
        "scope" text NOT NULL,
        "severity" text NOT NULL,
        "description" text NOT NULL,
        "technical_note" text NOT NULL,
        "created_at" timestamp with time zone DEFAULT now() NOT NULL,
        "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "source_relationships_pair_scope_unique" UNIQUE("source_id_a","source_id_b","scope")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "botanical_species_lists" (
        "id" serial PRIMARY KEY NOT NULL,
        "site_id" text NOT NULL,
        "scientific_name" text NOT NULL,
        "url" text NOT NULL,
        "section" text DEFAULT '' NOT NULL,
        "imported_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "botanical_species_lists_site_name_section_uniq" UNIQUE("site_id","scientific_name","section")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "botanical_web_refs_cache" (
        "id" serial PRIMARY KEY NOT NULL,
        "site_id" text NOT NULL,
        "scientific_name" text NOT NULL,
        "url" text,
        "found" boolean NOT NULL,
        "validation_method" text NOT NULL,
        "cached_at" timestamp with time zone DEFAULT now() NOT NULL,
        CONSTRAINT "botanical_web_refs_cache_site_name_uniq" UNIQUE("site_id","scientific_name")
);
