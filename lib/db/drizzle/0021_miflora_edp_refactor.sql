ALTER TABLE "miflora_species_cache" DROP COLUMN IF EXISTS "general_summary";
ALTER TABLE "miflora_species_cache" DROP COLUMN IF EXISTS "technical_details";
ALTER TABLE "miflora_counties_cache" DROP COLUMN IF EXISTS "general_summary";
ALTER TABLE "miflora_counties_cache" DROP COLUMN IF EXISTS "technical_details";
ALTER TABLE "miflora_images_cache" DROP COLUMN IF EXISTS "general_summary";
ALTER TABLE "miflora_images_cache" DROP COLUMN IF EXISTS "technical_details";

CREATE TABLE IF NOT EXISTS "miflora_flora_search_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"upstream_url" text NOT NULL,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_flora_search_cache_cache_key_unique" UNIQUE("cache_key")
);

CREATE TABLE IF NOT EXISTS "miflora_spec_text_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"upstream_url" text NOT NULL,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_spec_text_cache_cache_key_unique" UNIQUE("cache_key")
);

CREATE TABLE IF NOT EXISTS "miflora_synonyms_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"upstream_url" text NOT NULL,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_synonyms_cache_cache_key_unique" UNIQUE("cache_key")
);

CREATE TABLE IF NOT EXISTS "miflora_pimage_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"upstream_url" text NOT NULL,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_pimage_cache_cache_key_unique" UNIQUE("cache_key")
);
