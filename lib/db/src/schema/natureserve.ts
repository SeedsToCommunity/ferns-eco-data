import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const natureserveSpeciesCacheTable = pgTable("natureserve_species_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  raw_response: jsonb("raw_response").notNull().default({}),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("natureserve"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const natureserveEcosystemsCacheTable = pgTable("natureserve_ecosystems_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  results: jsonb("results").notNull().default([]),
  result_count: text("result_count"),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("natureserve"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
