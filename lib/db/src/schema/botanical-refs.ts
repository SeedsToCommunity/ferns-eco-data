import { pgTable, serial, text, timestamp, boolean, jsonb, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

/**
 * Pre-scraped species lists for scrape-backed botanical reference sites.
 * Unique on (site_id, scientific_name, section) — Illinois Wildflowers uses
 * non-empty section values since a species may appear in multiple habitat sections.
 */
export const botanicalSpeciesListsTable = pgTable(
  "botanical_species_lists",
  {
    id: serial("id").primaryKey(),
    site_id: text("site_id").notNull(),
    scientific_name: text("scientific_name").notNull(),
    url: text("url").notNull(),
    section: text("section").notNull().default(""),
    imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique("botanical_species_lists_site_name_section_uniq").on(t.site_id, t.scientific_name, t.section),
  ],
);

export const insertBotanicalSpeciesListSchema = createInsertSchema(botanicalSpeciesListsTable).omit({ id: true });
export const selectBotanicalSpeciesListSchema = createSelectSchema(botanicalSpeciesListsTable);

export type InsertBotanicalSpeciesList = z.infer<typeof insertBotanicalSpeciesListSchema>;
export type BotanicalSpeciesList = typeof botanicalSpeciesListsTable.$inferSelect;

/**
 * Cache for dynamic per-query lookups (HTTP-validated and API-based sources).
 * Used by GoBotany (HTTP GET validation) and any future sources that query a
 * live endpoint per species name rather than maintaining a pre-scraped list.
 * Unique on (site_id, scientific_name) — one cached result per species per site.
 */
export const botanicalWebRefsCacheTable = pgTable(
  "botanical_web_refs_cache",
  {
    id: serial("id").primaryKey(),
    site_id: text("site_id").notNull(),
    scientific_name: text("scientific_name").notNull(),
    url: text("url"),
    found: boolean("found").notNull(),
    validation_method: text("validation_method").notNull(),
    cached_at: timestamp("cached_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique("botanical_web_refs_cache_site_name_uniq").on(t.site_id, t.scientific_name),
  ],
);

export const insertBotanicalWebRefsCacheSchema = createInsertSchema(botanicalWebRefsCacheTable).omit({ id: true });
export const selectBotanicalWebRefsCacheSchema = createSelectSchema(botanicalWebRefsCacheTable);

export type InsertBotanicalWebRefsCache = z.infer<typeof insertBotanicalWebRefsCacheSchema>;
export type BotanicalWebRefsCache = typeof botanicalWebRefsCacheTable.$inferSelect;

/**
 * Cache for scraped species page text from botanical web reference sites.
 * Stores structured sections + full text per (site_id, scientific_name).
 * First request fetches and caches; repeat requests return cached content.
 */
export const speciesPageTextCacheTable = pgTable(
  "species_page_text_cache",
  {
    id: serial("id").primaryKey(),
    site_id: text("site_id").notNull(),
    scientific_name: text("scientific_name").notNull(),
    url: text("url"),
    found: boolean("found").notNull(),
    sections: jsonb("sections").$type<Record<string, string> | null>(),
    full_text: text("full_text"),
    scraped_at: timestamp("scraped_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    unique("species_page_text_cache_site_name_uniq").on(t.site_id, t.scientific_name),
  ],
);

export const insertSpeciesPageTextCacheSchema = createInsertSchema(speciesPageTextCacheTable).omit({ id: true });
export const selectSpeciesPageTextCacheSchema = createSelectSchema(speciesPageTextCacheTable);

export type InsertSpeciesPageTextCache = z.infer<typeof insertSpeciesPageTextCacheSchema>;
export type SpeciesPageTextCache = typeof speciesPageTextCacheTable.$inferSelect;
