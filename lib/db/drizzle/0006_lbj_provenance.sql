-- Add provenance fields source_url and upstream_url to lbj_url_cache.
ALTER TABLE "lbj_url_cache" ADD COLUMN IF NOT EXISTS "source_url" text;
ALTER TABLE "lbj_url_cache" ADD COLUMN IF NOT EXISTS "upstream_url" text;
UPDATE "lbj_url_cache"
  SET "upstream_url" = 'https://www.wildflower.org/plants/result.php?id_plant=' || "usda_symbol"
WHERE "upstream_url" IS NULL;
