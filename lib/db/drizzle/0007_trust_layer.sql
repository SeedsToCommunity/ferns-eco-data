-- Create trust layer tables: trust_groups, trust_tiers, trust_tier_members.
-- The trust layer is a perspective filter over the source registry.
-- A trust group is a named, ordered set of tiers; each tier contains a set of FERNS sources.

CREATE TABLE IF NOT EXISTS "trust_groups" (
  "group_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "owner_email" text,
  "geographic_region" text,
  "domain" text,
  "description" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "trust_groups_slug_unique" UNIQUE("slug")
);

CREATE TABLE IF NOT EXISTS "trust_tiers" (
  "tier_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "group_id" uuid NOT NULL REFERENCES "trust_groups"("group_id") ON DELETE CASCADE,
  "position" integer NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "trust_tiers_group_position_unique" UNIQUE("group_id", "position")
);

CREATE TABLE IF NOT EXISTS "trust_tier_members" (
  "tier_id" uuid NOT NULL REFERENCES "trust_tiers"("tier_id") ON DELETE CASCADE,
  "source_id" text NOT NULL,
  "added_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "trust_tier_members_pkey" PRIMARY KEY("tier_id", "source_id")
);
