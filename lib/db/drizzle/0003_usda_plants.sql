CREATE TABLE IF NOT EXISTS "usda_plants_name_matches" (
  "id" serial PRIMARY KEY NOT NULL,
  "cache_key" text NOT NULL,
  "input_name" text NOT NULL,
  "found" boolean DEFAULT false NOT NULL,
  "symbol" text,
  "canonical_name" text,
  "common_name" text,
  "rank" text,
  "usda_id" integer,
  "expires_at" timestamp with time zone,
  "source_id" text DEFAULT 'usda-plants' NOT NULL,
  "fetched_at" timestamp with time zone NOT NULL,
  "method" text DEFAULT 'api_fetch' NOT NULL,
  "upstream_url" text NOT NULL,
  "general_summary" text NOT NULL,
  "technical_details" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "usda_plants_name_matches_cache_key_unique" UNIQUE("cache_key")
);

CREATE TABLE IF NOT EXISTS "usda_plants_profiles" (
  "id" serial PRIMARY KEY NOT NULL,
  "cache_key" text NOT NULL,
  "symbol" text NOT NULL,
  "profile" jsonb NOT NULL,
  "expires_at" timestamp with time zone,
  "source_id" text DEFAULT 'usda-plants' NOT NULL,
  "fetched_at" timestamp with time zone NOT NULL,
  "method" text DEFAULT 'api_fetch' NOT NULL,
  "upstream_url" text NOT NULL,
  "general_summary" text NOT NULL,
  "technical_details" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "usda_plants_profiles_cache_key_unique" UNIQUE("cache_key"),
  CONSTRAINT "usda_plants_profiles_symbol_unique" UNIQUE("symbol")
);
