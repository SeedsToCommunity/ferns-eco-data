import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

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
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertUsdaPlantsProfileSchema = createInsertSchema(usdaPlantsProfilesTable).omit({ id: true });
export const selectUsdaPlantsProfileSchema = createSelectSchema(usdaPlantsProfilesTable);

export type InsertUsdaPlantsProfile = z.infer<typeof insertUsdaPlantsProfileSchema>;
export type UsdaPlantsProfile = typeof usdaPlantsProfilesTable.$inferSelect;
