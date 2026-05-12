import { pgTable, text, jsonb, timestamp } from "drizzle-orm/pg-core";
// note: range_michigan uses native text[] (not jsonb) — see migration 0009
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export interface NpnImage {
  position: number;
  url: string;
  caption: string;
  kind: "photograph" | "drawing";
}

export const npnSpeciesTable = pgTable("npn_species", {
  acronym: text("acronym").primaryKey(),
  latin_name: text("latin_name").notNull(),
  latin_synonym_greg: text("latin_synonym_greg"),
  common_name: text("common_name").notNull(),
  light: text("light"),
  moisture: text("moisture"),
  height: text("height"),
  flowering_time: text("flowering_time"),
  habitat: text("habitat"),
  notes: text("notes"),
  range_michigan: text("range_michigan").array(),
  npn_price_sizes: text("npn_price_sizes"),
  images: jsonb("images").notNull().$type<NpnImage[]>(),
  source_url: text("source_url").notNull(),
  scraped_at: timestamp("scraped_at", { withTimezone: true }).defaultNow().notNull(),
});

export const npnNameAliasesTable = pgTable("npn_name_aliases", {
  alias: text("alias").primaryKey(),
  acronym: text("acronym")
    .notNull()
    .references(() => npnSpeciesTable.acronym),
});

export const insertNpnSpeciesSchema = createInsertSchema(npnSpeciesTable).omit({ scraped_at: true });
export const selectNpnSpeciesSchema = createSelectSchema(npnSpeciesTable);
export const insertNpnNameAliasSchema = createInsertSchema(npnNameAliasesTable);
export const selectNpnNameAliasSchema = createSelectSchema(npnNameAliasesTable);

export type InsertNpnSpecies = z.infer<typeof insertNpnSpeciesSchema>;
export type NpnSpecies = typeof npnSpeciesTable.$inferSelect;
export type InsertNpnNameAlias = z.infer<typeof insertNpnNameAliasSchema>;
export type NpnNameAlias = typeof npnNameAliasesTable.$inferSelect;
