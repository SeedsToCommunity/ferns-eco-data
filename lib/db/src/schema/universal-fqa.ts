import { pgTable, serial, text, integer, real, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const universalFqaDatabasesTable = pgTable("universal_fqa_databases", {
  database_id: integer("database_id").primaryKey(),
  region: text("region").notNull().default(""),
  year: text("year").notNull().default(""),
  citation: text("citation").notNull().default(""),
  total_species: integer("total_species").notNull().default(0),
  native_species: integer("native_species").notNull().default(0),
  non_native_species: integer("non_native_species").notNull().default(0),
  total_mean_c: real("total_mean_c"),
  native_mean_c: real("native_mean_c"),
  cached_at: timestamp("cached_at", { withTimezone: true }).notNull(),
});

export const universalFqaSpeciesTable = pgTable(
  "universal_fqa_species",
  {
    id: serial("id").primaryKey(),
    database_id: integer("database_id").notNull(),
    scientific_name: text("scientific_name").notNull(),
    family: text("family").notNull().default(""),
    acronym: text("acronym").notNull().default(""),
    native: text("native").notNull().default(""),
    c: text("c"),
    w: text("w"),
    physiognomy: text("physiognomy").notNull().default(""),
    duration: text("duration").notNull().default(""),
    common_name: text("common_name").notNull().default(""),
    cached_at: timestamp("cached_at", { withTimezone: true }).notNull(),
  },
  (table) => [
    uniqueIndex("universal_fqa_species_db_name_idx").on(
      table.database_id,
      table.scientific_name
    ),
  ]
);

export const insertUniversalFqaDatabaseSchema = createInsertSchema(universalFqaDatabasesTable);
export const selectUniversalFqaDatabaseSchema = createSelectSchema(universalFqaDatabasesTable);
export const insertUniversalFqaSpeciesSchema = createInsertSchema(universalFqaSpeciesTable).omit({ id: true });
export const selectUniversalFqaSpeciesSchema = createSelectSchema(universalFqaSpeciesTable);

export type InsertUniversalFqaDatabase = z.infer<typeof insertUniversalFqaDatabaseSchema>;
export type UniversalFqaDatabase = typeof universalFqaDatabasesTable.$inferSelect;
export type InsertUniversalFqaSpecies = z.infer<typeof insertUniversalFqaSpeciesSchema>;
export type UniversalFqaSpeciesRow = typeof universalFqaSpeciesTable.$inferSelect;
