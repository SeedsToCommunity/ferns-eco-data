ALTER TABLE "natureserve_species_cache" ADD COLUMN IF NOT EXISTS "upstream_response" jsonb;
--> statement-breakpoint
ALTER TABLE "natureserve_ecosystems_cache" ADD COLUMN IF NOT EXISTS "upstream_response" jsonb;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "natureserve_taxon_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"upstream_response" jsonb NOT NULL,
	"upstream_url" text NOT NULL,
	"fetched_at" timestamptz NOT NULL,
	"expires_at" timestamptz,
	"source_id" text NOT NULL DEFAULT 'natureserve',
	"created_at" timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT "natureserve_taxon_cache_cache_key_unique" UNIQUE("cache_key")
);
