import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";

export const natureserveSpeciesCacheTable = pgTable("natureserve_species_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  upstream_response: jsonb("upstream_response"),
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
  upstream_response: jsonb("upstream_response"),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("natureserve"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const natureserveTaxonCacheTable = pgTable("natureserve_taxon_cache", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  upstream_response: jsonb("upstream_response").notNull(),
  upstream_url: text("upstream_url").notNull(),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("natureserve"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
