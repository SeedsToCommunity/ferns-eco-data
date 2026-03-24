import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fernsSourcesTable = pgTable("ferns_sources", {
  id: serial("id").primaryKey(),
  source_id: text("source_id").notNull().unique(),
  name: text("name").notNull(),
  knowledge_type: text("knowledge_type").notNull(),
  status: text("status").notNull().default("live"),
  description: text("description"),
  input_summary: text("input_summary"),
  output_summary: text("output_summary"),
  dependencies: text("dependencies").array(),
  update_frequency: text("update_frequency"),
  known_limitations: text("known_limitations"),
  metadata_url: text("metadata_url"),
  explorer_url: text("explorer_url"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertFernsSourceSchema = createInsertSchema(fernsSourcesTable).omit({ id: true });
export const selectFernsSourceSchema = createSelectSchema(fernsSourcesTable);

export type InsertFernsSource = z.infer<typeof insertFernsSourceSchema>;
export type FernsSource = typeof fernsSourcesTable.$inferSelect;
