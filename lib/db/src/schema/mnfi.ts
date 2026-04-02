import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";
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
  mnfi_url: text("mnfi_url").notNull(),
  county_map_url: text("county_map_url"),
  imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
});

export const mnfiCountyElementsTable = pgTable(
  "mnfi_county_elements",
  {
    id: serial("id").primaryKey(),
    county: text("county").notNull(),
    element_name: text("element_name").notNull(),
    element_type: text("element_type").notNull(),
    scientific_name: text("scientific_name"),
    common_name: text("common_name"),
    federal_status: text("federal_status"),
    state_status: text("state_status"),
    global_rank: text("global_rank"),
    state_rank: text("state_rank"),
    occurrences_in_county: integer("occurrences_in_county"),
    last_observed: text("last_observed"),
    imported_at: timestamp("imported_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("mnfi_county_element_unique").on(t.county, t.element_type, t.element_name)],
);

export const insertMnfiCommunitySchema = createInsertSchema(mnfiCommunitiesTable).omit({ imported_at: true });
export const selectMnfiCommunitySchema = createSelectSchema(mnfiCommunitiesTable);
export const insertMnfiCountyElementSchema = createInsertSchema(mnfiCountyElementsTable).omit({ id: true, imported_at: true });
export const selectMnfiCountyElementSchema = createSelectSchema(mnfiCountyElementsTable);

export type InsertMnfiCommunity = z.infer<typeof insertMnfiCommunitySchema>;
export type MnfiCommunity = typeof mnfiCommunitiesTable.$inferSelect;
export type InsertMnfiCountyElement = z.infer<typeof insertMnfiCountyElementSchema>;
export type MnfiCountyElement = typeof mnfiCountyElementsTable.$inferSelect;
