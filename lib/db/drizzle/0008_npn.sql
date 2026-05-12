-- Create NPN (Ann Arbor Native Plant Nursery) tables.
-- npn_species: primary species records keyed by acronym.
-- npn_name_aliases: alias index for name-flavor lookup (acronym, Latin, synonym, common names).

CREATE TABLE IF NOT EXISTS "npn_species" (
  "acronym" text PRIMARY KEY NOT NULL,
  "latin_name" text NOT NULL,
  "latin_synonym_greg" text,
  "common_name" text NOT NULL,
  "light" text,
  "moisture" text,
  "height" text,
  "flowering_time" text,
  "habitat" text,
  "notes" text,
  "range_michigan" jsonb,
  "npn_price_sizes" text,
  "images" jsonb NOT NULL,
  "source_url" text NOT NULL,
  "scraped_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "npn_name_aliases" (
  "alias" text PRIMARY KEY NOT NULL,
  "acronym" text NOT NULL REFERENCES "npn_species"("acronym")
);
