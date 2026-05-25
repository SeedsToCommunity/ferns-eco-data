-- GBIF cache re-architecture (Task #164).
-- Approach: TRUNCATE all existing GBIF cache tables (rows cannot be migrated to upstream_response).
-- New columns require NOT NULL; existing decomposed columns cannot reconstruct verbatim upstream JSON.

TRUNCATE TABLE gbif_name_matches;
TRUNCATE TABLE gbif_synonyms;
TRUNCATE TABLE gbif_vernacular_names;
TRUNCATE TABLE gbif_occurrences;

--> statement-breakpoint
-- gbif_name_matches: drop general_summary/technical_details/source_url, add upstream_response
ALTER TABLE gbif_name_matches DROP COLUMN IF EXISTS general_summary;
--> statement-breakpoint
ALTER TABLE gbif_name_matches DROP COLUMN IF EXISTS technical_details;
--> statement-breakpoint
ALTER TABLE gbif_name_matches DROP COLUMN IF EXISTS source_url;
--> statement-breakpoint
ALTER TABLE gbif_name_matches ADD COLUMN upstream_response jsonb NOT NULL;

--> statement-breakpoint
-- gbif_synonyms: drop general_summary/technical_details/synonyms/synonym_count, add upstream_response
ALTER TABLE gbif_synonyms DROP COLUMN IF EXISTS general_summary;
--> statement-breakpoint
ALTER TABLE gbif_synonyms DROP COLUMN IF EXISTS technical_details;
--> statement-breakpoint
ALTER TABLE gbif_synonyms DROP COLUMN IF EXISTS synonyms;
--> statement-breakpoint
ALTER TABLE gbif_synonyms DROP COLUMN IF EXISTS synonym_count;
--> statement-breakpoint
ALTER TABLE gbif_synonyms ADD COLUMN upstream_response jsonb NOT NULL;

--> statement-breakpoint
-- gbif_vernacular_names: drop general_summary/technical_details/vernacular fields, add upstream_response
ALTER TABLE gbif_vernacular_names DROP COLUMN IF EXISTS general_summary;
--> statement-breakpoint
ALTER TABLE gbif_vernacular_names DROP COLUMN IF EXISTS technical_details;
--> statement-breakpoint
ALTER TABLE gbif_vernacular_names DROP COLUMN IF EXISTS vernacular_names;
--> statement-breakpoint
ALTER TABLE gbif_vernacular_names DROP COLUMN IF EXISTS vernacular_name_primary;
--> statement-breakpoint
ALTER TABLE gbif_vernacular_names DROP COLUMN IF EXISTS vernacular_name_count;
--> statement-breakpoint
ALTER TABLE gbif_vernacular_names ADD COLUMN upstream_response jsonb NOT NULL;

--> statement-breakpoint
-- gbif_occurrences: drop all domain-specific columns, add upstream_response
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS usage_key;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS geography_mode;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS geography_params;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS occurrence_count;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS occurrence_count_us;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS recent_occurrences;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS source_url;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS occurrence_last_fetched;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS general_summary;
--> statement-breakpoint
ALTER TABLE gbif_occurrences DROP COLUMN IF EXISTS technical_details;
--> statement-breakpoint
ALTER TABLE gbif_occurrences ADD COLUMN upstream_response jsonb NOT NULL;

--> statement-breakpoint
-- New table: gbif_species (passthrough cache for GET /species/{usageKey})
CREATE TABLE IF NOT EXISTS gbif_species (
  id serial PRIMARY KEY,
  cache_key text NOT NULL UNIQUE,
  upstream_response jsonb NOT NULL,
  upstream_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  expires_at timestamptz,
  source_id text NOT NULL DEFAULT 'gbif',
  method text NOT NULL DEFAULT 'api_fetch',
  created_at timestamptz NOT NULL DEFAULT now()
);

--> statement-breakpoint
-- New table: gbif_species_searches (passthrough cache for GET /species/search)
CREATE TABLE IF NOT EXISTS gbif_species_searches (
  id serial PRIMARY KEY,
  cache_key text NOT NULL UNIQUE,
  upstream_response jsonb NOT NULL,
  upstream_url text NOT NULL,
  fetched_at timestamptz NOT NULL,
  expires_at timestamptz,
  source_id text NOT NULL DEFAULT 'gbif',
  method text NOT NULL DEFAULT 'api_fetch',
  created_at timestamptz NOT NULL DEFAULT now()
);
