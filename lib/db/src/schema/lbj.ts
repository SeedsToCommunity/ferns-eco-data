import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lbjUrlCacheTable = pgTable("lbj_url_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  usda_symbol: text("usda_symbol").notNull(),
  profile_url: text("profile_url"),
  source_url: text("source_url"),
  upstream_url: text("upstream_url"),
  status: text("status").notNull(),
  found: boolean("found"),
  http_status: integer("http_status"),
  method: text("method"),
  verified_at: timestamp("verified_at", { withTimezone: true }),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertLbjUrlCacheSchema = createInsertSchema(lbjUrlCacheTable).omit({ id: true });
export const selectLbjUrlCacheSchema = createSelectSchema(lbjUrlCacheTable);

export type InsertLbjUrlCache = z.infer<typeof insertLbjUrlCacheSchema>;
export type LbjUrlCache = typeof lbjUrlCacheTable.$inferSelect;
