import { pgTable, serial, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mifloraSpeciesCacheTable = pgTable("miflora_species_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  queried_name: text("queried_name").notNull(),
  plant_id: integer("plant_id"),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  source_url: text("source_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraCountiesCacheTable = pgTable("miflora_counties_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  queried_name: text("queried_name").notNull().default(""),
  plant_id: integer("plant_id"),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  source_url: text("source_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraImagesCacheTable = pgTable("miflora_images_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  queried_name: text("queried_name").notNull(),
  plant_id: integer("plant_id"),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  source_url: text("source_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraFloraSearchCacheTable = pgTable("miflora_flora_search_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  upstream_url: text("upstream_url").notNull(),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraSpecTextCacheTable = pgTable("miflora_spec_text_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  upstream_url: text("upstream_url").notNull(),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraSynonymsCacheTable = pgTable("miflora_synonyms_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  upstream_url: text("upstream_url").notNull(),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mifloraPImageCacheTable = pgTable("miflora_pimage_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  raw_response: jsonb("raw_response"),
  found: boolean("found").notNull().default(false),
  upstream_url: text("upstream_url").notNull(),
  source_id: text("source_id").notNull().default("miflora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertMifloraSpeciesSchema = createInsertSchema(mifloraSpeciesCacheTable).omit({ id: true });
export const selectMifloraSpeciesSchema = createSelectSchema(mifloraSpeciesCacheTable);
export const insertMifloraCountiesSchema = createInsertSchema(mifloraCountiesCacheTable).omit({ id: true });
export const selectMifloraCountiesSchema = createSelectSchema(mifloraCountiesCacheTable);
export const insertMifloraImagesSchema = createInsertSchema(mifloraImagesCacheTable).omit({ id: true });
export const selectMifloraImagesSchema = createSelectSchema(mifloraImagesCacheTable);
export const insertMifloraFloraSearchSchema = createInsertSchema(mifloraFloraSearchCacheTable).omit({ id: true });
export const selectMifloraFloraSearchSchema = createSelectSchema(mifloraFloraSearchCacheTable);
export const insertMifloraSpecTextSchema = createInsertSchema(mifloraSpecTextCacheTable).omit({ id: true });
export const selectMifloraSpecTextSchema = createSelectSchema(mifloraSpecTextCacheTable);
export const insertMifloraSynonymsSchema = createInsertSchema(mifloraSynonymsCacheTable).omit({ id: true });
export const selectMifloraSynonymsSchema = createSelectSchema(mifloraSynonymsCacheTable);
export const insertMifloraPImageSchema = createInsertSchema(mifloraPImageCacheTable).omit({ id: true });
export const selectMifloraPImageSchema = createSelectSchema(mifloraPImageCacheTable);

export type InsertMifloraSpecies = z.infer<typeof insertMifloraSpeciesSchema>;
export type MifloraSpecies = typeof mifloraSpeciesCacheTable.$inferSelect;
export type InsertMifloraCounties = z.infer<typeof insertMifloraCountiesSchema>;
export type MifloraCounties = typeof mifloraCountiesCacheTable.$inferSelect;
export type InsertMifloraImages = z.infer<typeof insertMifloraImagesSchema>;
export type MifloraImages = typeof mifloraImagesCacheTable.$inferSelect;
export type InsertMifloraFloraSearch = z.infer<typeof insertMifloraFloraSearchSchema>;
export type MifloraFloraSearch = typeof mifloraFloraSearchCacheTable.$inferSelect;
export type InsertMifloraSpecText = z.infer<typeof insertMifloraSpecTextSchema>;
export type MifloraSpecText = typeof mifloraSpecTextCacheTable.$inferSelect;
export type InsertMifloraSynonyms = z.infer<typeof insertMifloraSynonymsSchema>;
export type MifloraSynonyms = typeof mifloraSynonymsCacheTable.$inferSelect;
export type InsertMifloraPImage = z.infer<typeof insertMifloraPImageSchema>;
export type MifloraPImage = typeof mifloraPImageCacheTable.$inferSelect;
