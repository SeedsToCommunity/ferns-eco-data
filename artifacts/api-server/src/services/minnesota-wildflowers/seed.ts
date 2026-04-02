import { db, fernsSourcesTable } from "@workspace/db";
import { MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureMinnesotaWildflowersRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.name,
          status: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.status,
          description: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.description,
          input_summary: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.input_summary,
          output_summary: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.output_summary,
          update_frequency: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.update_frequency,
          known_limitations: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.known_limitations,
          metadata_url: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.metadata_url,
          explorer_url: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Minnesota Wildflowers registry entry");
  }
}
