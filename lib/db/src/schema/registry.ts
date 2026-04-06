import { pgTable, serial, text, boolean, timestamp, unique } from "drizzle-orm/pg-core";
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
  permission_granted: boolean("permission_granted"),
  permission_status: text("permission_status"),
  general_summary: text("general_summary"),
  technical_details: text("technical_details"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertFernsSourceSchema = createInsertSchema(fernsSourcesTable).omit({ id: true });
export const selectFernsSourceSchema = createSelectSchema(fernsSourcesTable);

export type InsertFernsSource = z.infer<typeof insertFernsSourceSchema>;
export type FernsSource = typeof fernsSourcesTable.$inferSelect;

export const sourceRelationshipsTable = pgTable(
  "source_relationships",
  {
    id: serial("id").primaryKey(),
    source_id_a: text("source_id_a").notNull().references(() => fernsSourcesTable.source_id),
    source_id_b: text("source_id_b").notNull().references(() => fernsSourcesTable.source_id),
    relationship_type: text("relationship_type").notNull(),
    scope: text("scope").notNull(),
    severity: text("severity").notNull(),
    description: text("description").notNull(),
    technical_note: text("technical_note").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("source_relationships_pair_scope_unique").on(t.source_id_a, t.source_id_b, t.scope)],
);

export const insertSourceRelationshipSchema = createInsertSchema(sourceRelationshipsTable).omit({ id: true });
export const selectSourceRelationshipSchema = createSelectSchema(sourceRelationshipsTable);

export type InsertSourceRelationship = z.infer<typeof insertSourceRelationshipSchema>;
export type SourceRelationship = typeof sourceRelationshipsTable.$inferSelect;
