import { pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

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
