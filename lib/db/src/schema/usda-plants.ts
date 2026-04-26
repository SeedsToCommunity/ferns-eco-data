import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usdaPlantsNameMatchesTable = pgTable("usda_plants_name_matches", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  input_name: text("input_name").notNull(),
  found: boolean("found").notNull().default(false),
  symbol: text("symbol"),
  canonical_name: text("canonical_name"),
  common_name: text("common_name"),
  rank: text("rank"),
  usda_id: integer("usda_id"),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("usda-plants"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const usdaPlantsProfilesTable = pgTable("usda_plants_profiles", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  symbol: text("symbol").notNull().unique(),
  profile: jsonb("profile").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("usda-plants"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUsdaPlantsNameMatchSchema = createInsertSchema(usdaPlantsNameMatchesTable).omit({ id: true });
export const selectUsdaPlantsNameMatchSchema = createSelectSchema(usdaPlantsNameMatchesTable);
export const insertUsdaPlantsProfileSchema = createInsertSchema(usdaPlantsProfilesTable).omit({ id: true });
export const selectUsdaPlantsProfileSchema = createSelectSchema(usdaPlantsProfilesTable);

export type InsertUsdaPlantsNameMatch = z.infer<typeof insertUsdaPlantsNameMatchSchema>;
export type UsdaPlantsNameMatch = typeof usdaPlantsNameMatchesTable.$inferSelect;
export type InsertUsdaPlantsProfile = z.infer<typeof insertUsdaPlantsProfileSchema>;
export type UsdaPlantsProfile = typeof usdaPlantsProfilesTable.$inferSelect;
