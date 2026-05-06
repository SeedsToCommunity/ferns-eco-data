CREATE TABLE IF NOT EXISTS "lbj_url_cache" (
  "id" serial PRIMARY KEY NOT NULL,
  "cache_key" text NOT NULL,
  "symbol" text NOT NULL,
  "profile_url" text,
  "status" text NOT NULL,
  "http_status" integer,
  "expires_at" timestamp with time zone,
  "fetched_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "lbj_url_cache_cache_key_unique" UNIQUE("cache_key")
);
