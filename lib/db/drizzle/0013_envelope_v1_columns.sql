-- Envelope Contract v1 columns on ferns_sources.
-- Added by Task #160. See replit.md "FERNS Response Envelope Contract v1"
-- and "Endpoint Kinds" for column semantics.
--
-- `license` (text) — single most-restrictive license URI or the literal "unknown".
-- `rights` (text) — human-readable rights statement.
-- `website_url_patterns` (jsonb) — per-entity URL templates for the source's website.
-- `non_passthrough_endpoints` (jsonb) — PRIVATE; never exposed via /api/v1/sources.

ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS license text NOT NULL DEFAULT 'unknown';
ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS rights text NOT NULL DEFAULT '';
ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS website_url_patterns jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE ferns_sources ADD COLUMN IF NOT EXISTS non_passthrough_endpoints jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Explicit backfill for any rows that pre-date the DEFAULT (no-op if defaults already applied).
UPDATE ferns_sources SET license = 'unknown' WHERE license IS NULL;
UPDATE ferns_sources SET rights = '' WHERE rights IS NULL;
UPDATE ferns_sources SET website_url_patterns = '{}'::jsonb WHERE website_url_patterns IS NULL;
UPDATE ferns_sources SET non_passthrough_endpoints = '[]'::jsonb WHERE non_passthrough_endpoints IS NULL;
