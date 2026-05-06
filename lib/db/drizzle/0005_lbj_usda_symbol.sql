-- Align lbj_url_cache with required schema: rename symbol→usda_symbol, add verified_at, found, method columns.
ALTER TABLE "lbj_url_cache" RENAME COLUMN "symbol" TO "usda_symbol";
ALTER TABLE "lbj_url_cache" ADD COLUMN IF NOT EXISTS "verified_at" timestamp with time zone;
ALTER TABLE "lbj_url_cache" ADD COLUMN IF NOT EXISTS "found" boolean;
ALTER TABLE "lbj_url_cache" ADD COLUMN IF NOT EXISTS "method" text;
UPDATE "lbj_url_cache" SET
  "verified_at" = "fetched_at",
  "found" = ("status" = 'found'),
  "method" = 'http_get_manual_redirect'
WHERE "verified_at" IS NULL;
