import { pgTable, serial, text, integer, timestamp, unique, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mnfiCommunitiesTable = pgTable("mnfi_communities", {
  community_id: integer("community_id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  community_class: text("community_class").notNull(),
  community_group: text("community_group").notNull(),
  global_rank: text("global_rank").notNull(),
  state_rank: text("state_rank").notNull(),
  overview: text("overview"),
  landscape_context: text("landscape_context"),
  soils_description: text("soils_description"),
  natural_processes: text("natural_processes"),
  vegetation: text("vegetation"),
  similar_communities: jsonb("similar_communities"),
  management_notes: text("management_notes"),
  mnfi_url: text("mnfi_url").notNull(),
  county_map_url: text("county_map_url"),
  description_fetched_at: timestamp("description_fetched_at", { withTimezone: true }),
  imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mnfiCommunityPlantsTable = pgTable("mnfi_community_plants", {
  id: serial("id").primaryKey(),
  community_id: integer("community_id").notNull().references(() => mnfiCommunitiesTable.community_id, { onDelete: "cascade" }),
  life_form: text("life_form").notNull(),
  common_name: text("common_name").notNull(),
  scientific_names: jsonb("scientific_names").notNull().default([]),
  sort_order: integer("sort_order").notNull().default(0),
  imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mnfiCountyElementsTable = pgTable(
  "mnfi_county_elements",
  {
    id: serial("id").primaryKey(),
    county: text("county").notNull(),
    element_id: integer("element_id"),
    element_name: text("element_name").notNull(),
    element_type: text("element_type").notNull(),
    scientific_name: text("scientific_name"),
    common_name: text("common_name"),
    federal_status: text("federal_status"),
    state_status: text("state_status"),
    global_rank: text("global_rank"),
    state_rank: text("state_rank"),
    g_rank_description: text("g_rank_description"),
    s_rank_description: text("s_rank_description"),
    species_category: text("species_category"),
    occurrences_in_county: integer("occurrences_in_county"),
    last_observed: text("last_observed"),
    imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("mnfi_county_element_unique").on(t.county, t.element_type, t.element_name)],
);

export const insertMnfiCommunitySchema = createInsertSchema(mnfiCommunitiesTable).omit({ imported_at: true });
export const selectMnfiCommunitySchema = createSelectSchema(mnfiCommunitiesTable);
export const insertMnfiCommunityPlantSchema = createInsertSchema(mnfiCommunityPlantsTable).omit({ id: true, imported_at: true });
export const selectMnfiCommunityPlantSchema = createSelectSchema(mnfiCommunityPlantsTable);
export const insertMnfiCountyElementSchema = createInsertSchema(mnfiCountyElementsTable).omit({ id: true, imported_at: true });
export const selectMnfiCountyElementSchema = createSelectSchema(mnfiCountyElementsTable);

export type InsertMnfiCommunity = z.infer<typeof insertMnfiCommunitySchema>;
export type MnfiCommunity = typeof mnfiCommunitiesTable.$inferSelect;
export type InsertMnfiCommunityPlant = z.infer<typeof insertMnfiCommunityPlantSchema>;
export type MnfiCommunityPlant = typeof mnfiCommunityPlantsTable.$inferSelect;
export type InsertMnfiCountyElement = z.infer<typeof insertMnfiCountyElementSchema>;
export type MnfiCountyElement = typeof mnfiCountyElementsTable.$inferSelect;
