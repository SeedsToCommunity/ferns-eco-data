ALTER TABLE "universal_fqa_databases" ADD COLUMN IF NOT EXISTS "upstream_response" jsonb NOT NULL DEFAULT '{}';
ALTER TABLE "universal_fqa_databases" ADD COLUMN IF NOT EXISTS "upstream_url" text NOT NULL DEFAULT '';
ALTER TABLE "universal_fqa_databases" ADD COLUMN IF NOT EXISTS "fetched_at" timestamptz NOT NULL DEFAULT now();
