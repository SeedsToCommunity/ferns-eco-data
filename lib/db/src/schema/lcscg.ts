import { pgTable, serial, text, integer, jsonb, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const lcscgGuidesTable = pgTable("lcscg_guides", {
  guide_id: integer("guide_id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  season: text("season").notNull(),
  habitat_type: text("habitat_type").notNull(),
  authors: text("authors").notNull(),
  license: text("license").notNull(),
  attribution_text: text("attribution_text").notNull(),
  harvest_notes: text("harvest_notes").notNull(),
  version: text("version").notNull(),
  field_museum_url: text("field_museum_url").notNull(),
  cloudinary_folder: text("cloudinary_folder").notNull(),
  status: text("status").notNull().default("live"),
  imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
});

export const lcscgSpeciesTable = pgTable(
  "lcscg_species",
  {
    id: serial("id").primaryKey(),
    guide_id: integer("guide_id")
      .notNull()
      .references(() => lcscgGuidesTable.guide_id),
    species_id: text("species_id").notNull(),
    scientific_name: text("scientific_name").notNull(),
    common_name: text("common_name").notNull(),
    family: text("family").notNull(),
    photo_date: text("photo_date").notNull(),
    description: text("description").notNull(),
    seed_group_names: jsonb("seed_group_names").notNull().$type<string[]>(),
    seed_group_details: jsonb("seed_group_details")
      .notNull()
      .$type<Array<{ name: string; description: string; images: string[] }>>(),
    image_filenames: jsonb("image_filenames").notNull().$type<string[]>(),
    image_urls: jsonb("image_urls").notNull().$type<(string | null)[]>(),
    page_number: integer("page_number").notNull(),
    imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("lcscg_species_guide_species_unique").on(t.guide_id, t.species_id)],
);

export const insertLcscgGuideSchema = createInsertSchema(lcscgGuidesTable).omit({ imported_at: true });
export const selectLcscgGuideSchema = createSelectSchema(lcscgGuidesTable);
export const insertLcscgSpeciesSchema = createInsertSchema(lcscgSpeciesTable).omit({ id: true, imported_at: true });
export const selectLcscgSpeciesSchema = createSelectSchema(lcscgSpeciesTable);

export type InsertLcscgGuide = z.infer<typeof insertLcscgGuideSchema>;
export type LcscgGuide = typeof lcscgGuidesTable.$inferSelect;
export type InsertLcscgSpecies = z.infer<typeof insertLcscgSpeciesSchema>;
export type LcscgSpecies = typeof lcscgSpeciesTable.$inferSelect;
