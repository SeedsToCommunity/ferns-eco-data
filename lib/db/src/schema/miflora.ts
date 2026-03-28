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
  source_id: text("source_id").notNull().default("michigan-flora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  source_url: text("source_url"),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
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
  source_id: text("source_id").notNull().default("michigan-flora"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  source_url: text("source_url"),
  derivation_summary: text("derivation_summary").notNull(),
  derivation_scientific: text("derivation_scientific").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertMifloraSpeciesSchema = createInsertSchema(mifloraSpeciesCacheTable).omit({ id: true });
export const selectMifloraSpeciesSchema = createSelectSchema(mifloraSpeciesCacheTable);
export const insertMifloraCountiesSchema = createInsertSchema(mifloraCountiesCacheTable).omit({ id: true });
export const selectMifloraCountiesSchema = createSelectSchema(mifloraCountiesCacheTable);

export type InsertMifloraSpecies = z.infer<typeof insertMifloraSpeciesSchema>;
export type MifloraSpecies = typeof mifloraSpeciesCacheTable.$inferSelect;
export type InsertMifloraCounties = z.infer<typeof insertMifloraCountiesSchema>;
export type MifloraCounties = typeof mifloraCountiesCacheTable.$inferSelect;
