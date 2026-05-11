import { pgTable, text, integer, timestamp, uuid, primaryKey, unique } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trustGroupsTable = pgTable("trust_groups", {
  group_id: uuid("group_id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  owner_email: text("owner_email"),
  geographic_region: text("geographic_region"),
  domain: text("domain"),
  description: text("description"),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertTrustGroupSchema = createInsertSchema(trustGroupsTable).omit({ group_id: true });
export const selectTrustGroupSchema = createSelectSchema(trustGroupsTable);

export type InsertTrustGroup = z.infer<typeof insertTrustGroupSchema>;
export type TrustGroup = typeof trustGroupsTable.$inferSelect;

export const trustTiersTable = pgTable(
  "trust_tiers",
  {
    tier_id: uuid("tier_id").defaultRandom().primaryKey(),
    group_id: uuid("group_id")
      .notNull()
      .references(() => trustGroupsTable.group_id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    name: text("name").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [unique("trust_tiers_group_position_unique").on(t.group_id, t.position)],
);

export const insertTrustTierSchema = createInsertSchema(trustTiersTable).omit({ tier_id: true });
export const selectTrustTierSchema = createSelectSchema(trustTiersTable);

export type InsertTrustTier = z.infer<typeof insertTrustTierSchema>;
export type TrustTier = typeof trustTiersTable.$inferSelect;

export const trustTierMembersTable = pgTable(
  "trust_tier_members",
  {
    tier_id: uuid("tier_id")
      .notNull()
      .references(() => trustTiersTable.tier_id, { onDelete: "cascade" }),
    source_id: text("source_id").notNull(),
    added_at: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.tier_id, t.source_id] })],
);

export const insertTrustTierMemberSchema = createInsertSchema(trustTierMembersTable);
export const selectTrustTierMemberSchema = createSelectSchema(trustTierMembersTable);

export type InsertTrustTierMember = z.infer<typeof insertTrustTierMemberSchema>;
export type TrustTierMember = typeof trustTierMembersTable.$inferSelect;
