-- Migration 0027: drop all iNat cache tables.
-- iNat is now called directly by MCP tools; the EC REST layer (routes, connector,
-- cache) has been removed. These tables are dead storage.
-- DROP TABLE IF EXISTS guards make every statement safe to re-run.

DROP TABLE IF EXISTS "inat_places";

DROP TABLE IF EXISTS "inat_species";

DROP TABLE IF EXISTS "inat_histogram";

DROP TABLE IF EXISTS "inat_field_values";

DROP TABLE IF EXISTS "inat_controlled_terms";

DROP TABLE IF EXISTS "inat_taxon_by_id";
