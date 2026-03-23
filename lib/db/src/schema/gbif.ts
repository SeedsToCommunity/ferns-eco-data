import { pgTable, serial, text, timestamp, integer, jsonb, real } from "drizzle-orm/pg-core";
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
  source_url: text("source_url"),
  matched_input: text("matched_input").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifSynonymsTable = pgTable("gbif_synonyms", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usage_key: integer("usage_key").notNull(),
  synonyms: jsonb("synonyms").notNull().default([]),
  synonym_count: integer("synonym_count").notNull().default(0),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifVernacularNamesTable = pgTable("gbif_vernacular_names", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usage_key: integer("usage_key").notNull(),
  vernacular_names: jsonb("vernacular_names").notNull().default([]),
  vernacular_name_primary: text("vernacular_name_primary"),
  vernacular_name_count: integer("vernacular_name_count").notNull().default(0),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const gbifOccurrencesTable = pgTable("gbif_occurrences", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usage_key: integer("usage_key").notNull(),
  geography_mode: text("geography_mode").notNull(),
  geography_params: text("geography_params").notNull(),
  occurrence_count: integer("occurrence_count").notNull().default(0),
  occurrence_count_us: integer("occurrence_count_us"),
  recent_occurrences: jsonb("recent_occurrences").notNull().default([]),
  source_url: text("source_url"),
  occurrence_last_fetched: timestamp("occurrence_last_fetched", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("gbif"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
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

export type InsertGbifNameMatch = z.infer<typeof insertGbifNameMatchSchema>;
export type GbifNameMatch = typeof gbifNameMatchesTable.$inferSelect;
export type InsertGbifSynonyms = z.infer<typeof insertGbifSynonymsSchema>;
export type GbifSynonyms = typeof gbifSynonymsTable.$inferSelect;
export type InsertGbifVernacularNames = z.infer<typeof insertGbifVernacularNamesSchema>;
export type GbifVernacularNames = typeof gbifVernacularNamesTable.$inferSelect;
export type InsertGbifOccurrences = z.infer<typeof insertGbifOccurrencesSchema>;
export type GbifOccurrences = typeof gbifOccurrencesTable.$inferSelect;
