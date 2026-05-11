import { db, fernsSourcesTable, trustGroupsTable, trustTiersTable, trustTierMembersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const DEFAULT_SLUG = "default";
const DEFAULT_NAME = "Default (All Sources)";
const DEFAULT_TIER_NAME = "All Sources";
const DEFAULT_TIER_POSITION = 1;

export async function ensureDefaultTrustGroup(): Promise<void> {
  try {
    const [group] = await db
      .insert(trustGroupsTable)
      .values({
        slug: DEFAULT_SLUG,
        name: DEFAULT_NAME,
        owner_email: null,
        geographic_region: null,
        domain: null,
        description: "System-defined group containing every registered FERNS source.",
      })
      .onConflictDoUpdate({
        target: trustGroupsTable.slug,
        set: {
          name: DEFAULT_NAME,
          owner_email: null,
          geographic_region: null,
          domain: null,
          description: "System-defined group containing every registered FERNS source.",
          updated_at: new Date(),
        },
      })
      .returning({ group_id: trustGroupsTable.group_id });

    const groupId = group.group_id;

    const [tier] = await db
      .insert(trustTiersTable)
      .values({
        group_id: groupId,
        position: DEFAULT_TIER_POSITION,
        name: DEFAULT_TIER_NAME,
      })
      .onConflictDoUpdate({
        target: [trustTiersTable.group_id, trustTiersTable.position],
        set: { name: DEFAULT_TIER_NAME },
      })
      .returning({ tier_id: trustTiersTable.tier_id });

    const tierId = tier.tier_id;

    const sources = await db
      .select({ source_id: fernsSourcesTable.source_id })
      .from(fernsSourcesTable);

    if (sources.length > 0) {
      await db
        .insert(trustTierMembersTable)
        .values(sources.map((s) => ({ tier_id: tierId, source_id: s.source_id })))
        .onConflictDoNothing();
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed default trust group");
  }
}
