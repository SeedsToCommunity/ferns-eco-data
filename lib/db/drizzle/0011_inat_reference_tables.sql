-- Migration 0011: add inat_controlled_terms and inat_taxon_by_id tables.
-- inat_controlled_terms: permanently cached reference table for annotation term IDs.
-- inat_taxon_by_id: 30-day cached full taxon records by numeric ID.

CREATE TABLE IF NOT EXISTS "inat_controlled_terms" (
  "id" serial PRIMARY KEY,
  "cache_key" text NOT NULL UNIQUE,
  "raw_response" jsonb NOT NULL DEFAULT '{}',
  "source_url" text NOT NULL,
  "found" boolean NOT NULL DEFAULT true,
  "expires_at" timestamptz,
  "source_id" text NOT NULL DEFAULT 'inaturalist',
  "fetched_at" timestamptz NOT NULL,
  "method" text NOT NULL DEFAULT 'api_fetch',
  "upstream_url" text NOT NULL,
  "general_summary" text NOT NULL,
  "technical_details" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "inat_taxon_by_id" (
  "id" serial PRIMARY KEY,
  "cache_key" text NOT NULL UNIQUE,
  "taxon_id" integer NOT NULL,
  "raw_response" jsonb NOT NULL DEFAULT '{}',
  "source_url" text NOT NULL,
  "found" boolean NOT NULL DEFAULT true,
  "expires_at" timestamptz,
  "source_id" text NOT NULL DEFAULT 'inaturalist',
  "fetched_at" timestamptz NOT NULL,
  "method" text NOT NULL DEFAULT 'api_fetch',
  "upstream_url" text NOT NULL,
  "general_summary" text NOT NULL,
  "technical_details" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
