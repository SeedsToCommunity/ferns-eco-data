import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const bonapMapsTable = pgTable("bonap_maps", {
  id: serial("id").primaryKey(),
  cache_key: text("cache_key").notNull().unique(),
  genus: text("genus").notNull(),
  species: text("species"),
  map_type: text("map_type").notNull(),
  species_stripped: boolean("species_stripped").notNull().default(false),
  map_url: text("map_url"),
  source_url: text("source_url"),
  status: text("status").notNull(),
  expires_at: timestamp("expires_at", { withTimezone: true }),
  source_id: text("source_id").notNull().default("bonap-napa"),
  fetched_at: timestamp("fetched_at", { withTimezone: true }).notNull(),
  method: text("method").notNull().default("api_fetch"),
  upstream_url: text("upstream_url").notNull(),
  general_summary: text("general_summary").notNull(),
  technical_details: text("technical_details").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertBonapMapSchema = createInsertSchema(bonapMapsTable).omit({ id: true });
export const selectBonapMapSchema = createSelectSchema(bonapMapsTable);

export type InsertBonapMap = z.infer<typeof insertBonapMapSchema>;
export type BonapMap = typeof bonapMapsTable.$inferSelect;
