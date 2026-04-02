import { db, fernsSourcesTable, mnfiCommunitiesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { MNFI_REGISTRY_ENTRY } from "./metadata.js";
import { MNFI_COMMUNITIES } from "./communities-data.js";
import { logger } from "../../lib/logger.js";

let registrySeeded = false;
let communitiesSeeded = false;

export async function ensureMnfiRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(MNFI_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MNFI_REGISTRY_ENTRY.name,
          status: MNFI_REGISTRY_ENTRY.status,
          description: MNFI_REGISTRY_ENTRY.description,
          input_summary: MNFI_REGISTRY_ENTRY.input_summary,
          output_summary: MNFI_REGISTRY_ENTRY.output_summary,
          update_frequency: MNFI_REGISTRY_ENTRY.update_frequency,
          known_limitations: MNFI_REGISTRY_ENTRY.known_limitations,
          metadata_url: MNFI_REGISTRY_ENTRY.metadata_url,
          explorer_url: MNFI_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    registrySeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed MNFI registry entry");
  }
}

export async function ensureMnfiCommunities(): Promise<{ inserted: number; skipped: number }> {
  if (communitiesSeeded) {
    return { inserted: 0, skipped: MNFI_COMMUNITIES.length };
  }

  try {
    await db
      .insert(mnfiCommunitiesTable)
      .values(MNFI_COMMUNITIES)
      .onConflictDoUpdate({
        target: mnfiCommunitiesTable.community_id,
        set: {
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          community_class: sql`excluded.community_class`,
          community_group: sql`excluded.community_group`,
          global_rank: sql`excluded.global_rank`,
          state_rank: sql`excluded.state_rank`,
          mnfi_url: sql`excluded.mnfi_url`,
          county_map_url: sql`excluded.county_map_url`,
        },
      });

    communitiesSeeded = true;
    logger.info({ count: MNFI_COMMUNITIES.length }, "MNFI communities seeded");
    return { inserted: MNFI_COMMUNITIES.length, skipped: 0 };
  } catch (err) {
    logger.error({ err }, "Failed to seed MNFI communities");
    throw err;
  }
}
