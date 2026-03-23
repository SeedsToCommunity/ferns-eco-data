import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const registryEntriesTable = pgTable("registry_entries", {
  id: serial("id").primaryKey(),
  service_id: text("service_id").notNull().unique(),
  service_name: text("service_name").notNull(),
  knowledge_type: text("knowledge_type").notNull(),
  input_summary: text("input_summary"),
  output_summary: text("output_summary"),
  data_lineage: text("data_lineage"),
  update_frequency: text("update_frequency"),
  geographic_scope: text("geographic_scope"),
  taxonomic_scope: text("taxonomic_scope"),
  permission_status: text("permission_status"),
  known_limitations: text("known_limitations"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertRegistryEntrySchema = createInsertSchema(registryEntriesTable).omit({ id: true });
export const selectRegistryEntrySchema = createSelectSchema(registryEntriesTable);

export type InsertRegistryEntry = z.infer<typeof insertRegistryEntrySchema>;
export type RegistryEntry = typeof registryEntriesTable.$inferSelect;
