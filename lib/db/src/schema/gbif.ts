import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gbifNameMatchesTable = pgTable("gbif_name_matches", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  canonical_name: text("canonical_name"),
  scientific_name: text("scientific_name"),
  usage_key: integer("usage_key"),
  accepted_usage_key: integer("accepted_usage_key"),
  accepted_canonical_name: text("accepted_canonical_name"),
  rank: text("rank"),
  status: text("status"),
  confidence: integer("confidence"),
  match_type: text("match_type").notNull(),
  kingdom: text("kingdom"),
  phylum: text("phylum"),
  class_: text("class_"),
  order_: text("order_"),
  family: text("family"),
  genus: text("genus"),
  species: text("species"),
  kingdom_key: integer("kingdom_key"),
  phylum_key: integer("phylum_key"),
  class_key: integer("class_key"),
  order_key: integer("order_key"),
  family_key: integer("family_key"),
  genus_key: integer("genus_key"),
  species_key: integer("species_key"),
  matched_input: text("matched_input").notNull(),
  upstream_response: jsonb("upstream_response").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifSynonymsTable = pgTable("gbif_synonyms", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usage_key: integer("usage_key").notNull(),
  upstream_response: jsonb("upstream_response").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifVernacularNamesTable = pgTable("gbif_vernacular_names", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usage_key: integer("usage_key").notNull(),
  upstream_response: jsonb("upstream_response").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifOccurrencesTable = pgTable("gbif_occurrences", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  upstream_response: jsonb("upstream_response").notNull(),
  upstream_url: text("upstream_url").notNull(),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  method: text("method").notNull().default("api_fetch"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifSpeciesTable = pgTable("gbif_species", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  upstream_response: jsonb("upstream_response").notNull(),
  upstream_url: text("upstream_url").notNull(),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  method: text("method").notNull().default("api_fetch"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifSpeciesSearchesTable = pgTable("gbif_species_searches", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  upstream_response: jsonb("upstream_response").notNull(),
  upstream_url: text("upstream_url").notNull(),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  method: text("method").notNull().default("api_fetch"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertGbifNameMatchSchema = createInsertSchema(gbifNameMatchesTable).omit({ id: true });
export const selectGbifNameMatchSchema = createSelectSchema(gbifNameMatchesTable);
export const insertGbifSynonymsSchema = createInsertSchema(gbifSynonymsTable).omit({ id: true });
export const selectGbifSynonymsSchema = createSelectSchema(gbifSynonymsTable);
export const insertGbifVernacularNamesSchema = createInsertSchema(gbifVernacularNamesTable).omit({ id: true });
export const selectGbifVernacularNamesSchema = createSelectSchema(gbifVernacularNamesTable);
export const insertGbifOccurrencesSchema = createInsertSchema(gbifOccurrencesTable).omit({ id: true });
export const selectGbifOccurrencesSchema = createSelectSchema(gbifOccurrencesTable);
export const insertGbifSpeciesSchema = createInsertSchema(gbifSpeciesTable).omit({ id: true });
export const selectGbifSpeciesSchema = createSelectSchema(gbifSpeciesTable);
export const insertGbifSpeciesSearchesSchema = createInsertSchema(gbifSpeciesSearchesTable).omit({ id: true });
export const selectGbifSpeciesSearchesSchema = createSelectSchema(gbifSpeciesSearchesTable);

export type InsertGbifNameMatch = z.infer<typeof insertGbifNameMatchSchema>;
export type GbifNameMatch = typeof gbifNameMatchesTable.$inferSelect;
export type InsertGbifSynonyms = z.infer<typeof insertGbifSynonymsSchema>;
export type GbifSynonyms = typeof gbifSynonymsTable.$inferSelect;
export type InsertGbifVernacularNames = z.infer<typeof insertGbifVernacularNamesSchema>;
export type GbifVernacularNames = typeof gbifVernacularNamesTable.$inferSelect;
export type InsertGbifOccurrences = z.infer<typeof insertGbifOccurrencesSchema>;
export type GbifOccurrences = typeof gbifOccurrencesTable.$inferSelect;
export type InsertGbifSpecies = z.infer<typeof insertGbifSpeciesSchema>;
export type GbifSpecies = typeof gbifSpeciesTable.$inferSelect;
export type InsertGbifSpeciesSearches = z.infer<typeof insertGbifSpeciesSearchesSchema>;
export type GbifSpeciesSearches = typeof gbifSpeciesSearchesTable.$inferSelect;
