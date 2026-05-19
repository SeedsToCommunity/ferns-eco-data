-- Add raw_response column to gbif_name_matches for verbatim GBIF pass-through
ALTER TABLE gbif_name_matches ADD COLUMN IF NOT EXISTS raw_response jsonb;
