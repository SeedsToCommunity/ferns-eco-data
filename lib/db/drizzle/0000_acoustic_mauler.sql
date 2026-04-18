CREATE TABLE "bonap_maps" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"genus" text NOT NULL,
	"species" text,
	"map_type" text NOT NULL,
	"species_stripped" boolean DEFAULT false NOT NULL,
	"map_url" text,
	"source_url" text,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'bonap-napa' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bonap_maps_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "ferns_sources" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id" text NOT NULL,
	"name" text NOT NULL,
	"knowledge_type" text NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"description" text,
	"input_summary" text,
	"output_summary" text,
	"dependencies" text[],
	"update_frequency" text,
	"known_limitations" text,
	"metadata_url" text,
	"explorer_url" text,
	"permission_granted" boolean,
	"permission_status" text,
	"general_summary" text,
	"technical_details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ferns_sources_source_id_unique" UNIQUE("source_id")
);
--> statement-breakpoint
CREATE TABLE "source_relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"source_id_a" text NOT NULL,
	"source_id_b" text NOT NULL,
	"relationship_type" text NOT NULL,
	"scope" text NOT NULL,
	"severity" text NOT NULL,
	"description" text NOT NULL,
	"technical_note" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "source_relationships_pair_scope_unique" UNIQUE("source_id_a","source_id_b","scope")
);
--> statement-breakpoint
CREATE TABLE "gbif_name_matches" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"canonical_name" text,
	"scientific_name" text,
	"usage_key" integer,
	"accepted_usage_key" integer,
	"accepted_canonical_name" text,
	"rank" text,
	"status" text,
	"confidence" integer,
	"match_type" text NOT NULL,
	"kingdom" text,
	"phylum" text,
	"class_" text,
	"order_" text,
	"family" text,
	"genus" text,
	"species" text,
	"kingdom_key" integer,
	"phylum_key" integer,
	"class_key" integer,
	"order_key" integer,
	"family_key" integer,
	"genus_key" integer,
	"species_key" integer,
	"source_url" text,
	"matched_input" text NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'gbif' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gbif_name_matches_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "gbif_occurrences" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"usage_key" integer NOT NULL,
	"geography_mode" text NOT NULL,
	"geography_params" text NOT NULL,
	"occurrence_count" integer DEFAULT 0 NOT NULL,
	"occurrence_count_us" integer,
	"recent_occurrences" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"source_url" text,
	"occurrence_last_fetched" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'gbif' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gbif_occurrences_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "gbif_synonyms" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"usage_key" integer NOT NULL,
	"synonyms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"synonym_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'gbif' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gbif_synonyms_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "gbif_vernacular_names" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"usage_key" integer NOT NULL,
	"vernacular_names" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"vernacular_name_primary" text,
	"vernacular_name_count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'gbif' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "gbif_vernacular_names_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "inat_field_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"taxon_id" integer NOT NULL,
	"place_ids" integer[] DEFAULT '{}' NOT NULL,
	"verifiable" boolean DEFAULT true NOT NULL,
	"raw_response" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_url" text NOT NULL,
	"found" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'inaturalist' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inat_field_values_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "inat_histogram" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"taxon_id" integer NOT NULL,
	"place_ids" integer[] DEFAULT '{}' NOT NULL,
	"raw_response" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"source_url" text NOT NULL,
	"found" boolean DEFAULT true NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'inaturalist' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inat_histogram_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "inat_places" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"query" text NOT NULL,
	"results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"found" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'inaturalist' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inat_places_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "inat_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"inat_taxon_id" integer,
	"inat_name" text,
	"match_type" text,
	"preferred_common_name" text,
	"common_names" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"wikipedia_summary" text,
	"wikipedia_url" text,
	"default_photo_url" text,
	"conservation_status" jsonb,
	"native_status" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"observations_count" integer,
	"source_url" text,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'inaturalist' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inat_species_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "miflora_counties_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"queried_name" text DEFAULT '' NOT NULL,
	"plant_id" integer,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"source_url" text,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_counties_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "miflora_images_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"queried_name" text NOT NULL,
	"plant_id" integer,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"source_url" text,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_images_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "miflora_species_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"queried_name" text NOT NULL,
	"plant_id" integer,
	"raw_response" jsonb,
	"found" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'michigan-flora' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"source_url" text,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "miflora_species_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "universal_fqa_databases" (
	"database_id" integer PRIMARY KEY NOT NULL,
	"region" text DEFAULT '' NOT NULL,
	"year" text DEFAULT '' NOT NULL,
	"citation" text DEFAULT '' NOT NULL,
	"total_species" integer DEFAULT 0 NOT NULL,
	"native_species" integer DEFAULT 0 NOT NULL,
	"non_native_species" integer DEFAULT 0 NOT NULL,
	"total_mean_c" real,
	"native_mean_c" real,
	"cached_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "universal_fqa_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"database_id" integer NOT NULL,
	"scientific_name" text NOT NULL,
	"family" text DEFAULT '' NOT NULL,
	"acronym" text DEFAULT '' NOT NULL,
	"native" text DEFAULT '' NOT NULL,
	"c" text,
	"w" text,
	"physiognomy" text DEFAULT '' NOT NULL,
	"duration" text DEFAULT '' NOT NULL,
	"common_name" text DEFAULT '' NOT NULL,
	"cached_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lcscg_guides" (
	"guide_id" integer PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text NOT NULL,
	"season" text NOT NULL,
	"habitat_type" text NOT NULL,
	"authors" text NOT NULL,
	"license" text NOT NULL,
	"attribution_text" text NOT NULL,
	"harvest_notes" text NOT NULL,
	"version" text NOT NULL,
	"field_museum_url" text NOT NULL,
	"cloudinary_folder" text NOT NULL,
	"status" text DEFAULT 'live' NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lcscg_species" (
	"id" serial PRIMARY KEY NOT NULL,
	"guide_id" integer NOT NULL,
	"species_id" text NOT NULL,
	"scientific_name" text NOT NULL,
	"common_name" text NOT NULL,
	"family" text NOT NULL,
	"photo_date" text NOT NULL,
	"description" text NOT NULL,
	"seed_group_names" jsonb NOT NULL,
	"seed_group_details" jsonb NOT NULL,
	"image_filenames" jsonb NOT NULL,
	"image_urls" jsonb NOT NULL,
	"page_number" integer NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lcscg_species_guide_species_unique" UNIQUE("guide_id","species_id")
);
--> statement-breakpoint
CREATE TABLE "mnfi_communities" (
	"community_id" integer PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"community_class" text NOT NULL,
	"community_group" text NOT NULL,
	"global_rank" text NOT NULL,
	"state_rank" text NOT NULL,
	"overview" text,
	"landscape_context" text,
	"soils_description" text,
	"natural_processes" text,
	"vegetation" text,
	"similar_communities" jsonb,
	"management_notes" text,
	"mnfi_url" text NOT NULL,
	"county_map_url" text,
	"description_fetched_at" timestamp with time zone,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mnfi_communities_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mnfi_community_plants" (
	"id" serial PRIMARY KEY NOT NULL,
	"community_id" integer NOT NULL,
	"life_form" text NOT NULL,
	"common_name" text NOT NULL,
	"scientific_names" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mnfi_county_elements" (
	"id" serial PRIMARY KEY NOT NULL,
	"county" text NOT NULL,
	"element_id" integer,
	"element_name" text NOT NULL,
	"element_type" text NOT NULL,
	"scientific_name" text,
	"common_name" text,
	"federal_status" text,
	"state_status" text,
	"global_rank" text,
	"state_rank" text,
	"g_rank_description" text,
	"s_rank_description" text,
	"species_category" text,
	"occurrences_in_county" integer,
	"last_observed" text,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "natureserve_ecosystems_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"results" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"result_count" text,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'natureserve' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "natureserve_ecosystems_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "natureserve_species_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"cache_key" text NOT NULL,
	"scientific_name" text,
	"common_name" text,
	"global_rank" text,
	"rounded_global_rank" text,
	"national_rank" text,
	"rounded_national_rank" text,
	"state_code" text,
	"state_rank" text,
	"rounded_state_rank" text,
	"iucn_category" text,
	"iucn_description" text,
	"federal_status" text,
	"federal_status_description" text,
	"state_status" text,
	"cites_description" text,
	"cosewic_code" text,
	"cosewic_description" text,
	"natureserve_url" text,
	"element_global_id" text,
	"raw_summary" jsonb DEFAULT '{}'::jsonb,
	"expires_at" timestamp with time zone,
	"source_id" text DEFAULT 'natureserve' NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL,
	"method" text DEFAULT 'api_fetch' NOT NULL,
	"upstream_url" text NOT NULL,
	"general_summary" text NOT NULL,
	"technical_details" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "natureserve_species_cache_cache_key_unique" UNIQUE("cache_key")
);
--> statement-breakpoint
CREATE TABLE "botanical_species_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"scientific_name" text NOT NULL,
	"url" text NOT NULL,
	"section" text DEFAULT '' NOT NULL,
	"imported_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "botanical_species_lists_site_name_section_uniq" UNIQUE("site_id","scientific_name","section")
);
--> statement-breakpoint
CREATE TABLE "botanical_web_refs_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_id" text NOT NULL,
	"scientific_name" text NOT NULL,
	"url" text,
	"found" boolean NOT NULL,
	"validation_method" text NOT NULL,
	"cached_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "botanical_web_refs_cache_site_name_uniq" UNIQUE("site_id","scientific_name")
);
--> statement-breakpoint
ALTER TABLE "source_relationships" ADD CONSTRAINT "source_relationships_source_id_a_ferns_sources_source_id_fk" FOREIGN KEY ("source_id_a") REFERENCES "public"."ferns_sources"("source_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_relationships" ADD CONSTRAINT "source_relationships_source_id_b_ferns_sources_source_id_fk" FOREIGN KEY ("source_id_b") REFERENCES "public"."ferns_sources"("source_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lcscg_species" ADD CONSTRAINT "lcscg_species_guide_id_lcscg_guides_guide_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."lcscg_guides"("guide_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mnfi_community_plants" ADD CONSTRAINT "mnfi_community_plants_community_id_mnfi_communities_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."mnfi_communities"("community_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "universal_fqa_species_db_name_idx" ON "universal_fqa_species" USING btree ("database_id","scientific_name");--> statement-breakpoint
CREATE UNIQUE INDEX "mnfi_county_element_unique" ON "mnfi_county_elements" USING btree ("county","element_type","element_name");