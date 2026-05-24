import { jsonb, pgTable, serial, text, timestamp, unique } from "drizzle-orm/pg-core";
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
  licenses: text("licenses").array().notNull().default([]),
  license_notes: text("license_notes").notNull().default(""),
  general_summary: text("general_summary"),
  technical_details: text("technical_details"),
  // Envelope Contract v1 columns (added by Task #160 — see replit.md "FERNS Response Envelope Contract v1").
  license: text("license").notNull().default("unknown"),
  rights: text("rights").notNull().default(""),
  website_url_patterns: jsonb("website_url_patterns").notNull().default({}),
  // PRIVATE — never exposed via /api/v1/sources. See replit.md "Endpoint Kinds".
  non_passthrough_endpoints: jsonb("non_passthrough_endpoints").notNull().default([]),
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
    source_id_a: text("source_id_a").notNull(),
    source_id_b: text("source_id_b").notNull(),
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
