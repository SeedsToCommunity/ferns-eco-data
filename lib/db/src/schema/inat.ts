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

export const inatHistogramTable = pgTable("inat_histogram", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  taxon_id: integer("taxon_id").notNull(),
  place_ids: integer("place_ids").array().notNull().default([]),
  raw_response: jsonb("raw_response").notNull().default({}),
  source_url: text("source_url").notNull(),
  found: boolean("found").notNull().default(true),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("inaturalist"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const inatFieldValuesTable = pgTable("inat_field_values", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  taxon_id: integer("taxon_id").notNull(),
  place_ids: integer("place_ids").array().notNull().default([]),
  verifiable: boolean("verifiable").notNull().default(true),
  raw_response: jsonb("raw_response").notNull().default({}),
  source_url: text("source_url").notNull(),
  found: boolean("found").notNull().default(true),
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
export const insertInatHistogramSchema = createInsertSchema(inatHistogramTable).omit({ id: true });
export const selectInatHistogramSchema = createSelectSchema(inatHistogramTable);
export const insertInatFieldValuesSchema = createInsertSchema(inatFieldValuesTable).omit({ id: true });
export const selectInatFieldValuesSchema = createSelectSchema(inatFieldValuesTable);

export type InsertInatPlace = z.infer<typeof insertInatPlaceSchema>;
export type InatPlace = typeof inatPlacesTable.$inferSelect;
export type InsertInatSpecies = z.infer<typeof insertInatSpeciesSchema>;
export type InatSpecies = typeof inatSpeciesTable.$inferSelect;
export type InsertInatHistogram = z.infer<typeof insertInatHistogramSchema>;
export type InatHistogram = typeof inatHistogramTable.$inferSelect;
export type InsertInatFieldValues = z.infer<typeof insertInatFieldValuesSchema>;
export type InatFieldValues = typeof inatFieldValuesTable.$inferSelect;
