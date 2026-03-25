import { pgTable, serial, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inatPlacesTable = pgTable("inat_places", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  query: text("query").notNull(),
  results: jsonb("results").notNull().default([]),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("inaturalist"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inatSpeciesTable = pgTable("inat_species", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  inat_taxon_id: integer("inat_taxon_id"),
  inat_name: text("inat_name"),
  match_type: text("match_type"),
  preferred_common_name: text("preferred_common_name"),
  common_names: jsonb("common_names").notNull().default([]),
  wikipedia_summary: text("wikipedia_summary"),
  wikipedia_url: text("wikipedia_url"),
  default_photo_url: text("default_photo_url"),
  conservation_status: jsonb("conservation_status"),
  native_status: jsonb("native_status").notNull().default([]),
  observations_count: integer("observations_count"),
  source_url: text("source_url"),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("inaturalist"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inatPhenologyTable = pgTable("inat_phenology", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  taxon_id: integer("taxon_id").notNull(),
  place_ids: integer("place_ids").array().notNull().default([]),
  observations_by_month: jsonb("observations_by_month").notNull().default({}),
  phenology_by_month: jsonb("phenology_by_month").notNull().default({}),
  phenology_stages_available: text("phenology_stages_available").array().notNull().default([]),
  peak_observation_month: integer("peak_observation_month"),
  annotations_available: boolean("annotations_available").notNull().default(false),
  source_url: text("source_url").notNull(),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("inaturalist"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertInatPlaceSchema = createInsertSchema(inatPlacesTable).omit({ id: true });
export const selectInatPlaceSchema = createSelectSchema(inatPlacesTable);
export const insertInatSpeciesSchema = createInsertSchema(inatSpeciesTable).omit({ id: true });
export const selectInatSpeciesSchema = createSelectSchema(inatSpeciesTable);
export const insertInatPhenologySchema = createInsertSchema(inatPhenologyTable).omit({ id: true });
export const selectInatPhenologySchema = createSelectSchema(inatPhenologyTable);

export type InsertInatPlace = z.infer<typeof insertInatPlaceSchema>;
export type InatPlace = typeof inatPlacesTable.$inferSelect;
export type InsertInatSpecies = z.infer<typeof insertInatSpeciesSchema>;
export type InatSpecies = typeof inatSpeciesTable.$inferSelect;
export type InsertInatPhenology = z.infer<typeof insertInatPhenologySchema>;
export type InatPhenology = typeof inatPhenologyTable.$inferSelect;
