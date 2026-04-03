import { db, fernsSourcesTable } from "@workspace/db";
import { ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureIllinoisWildflowersRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.name,
          status: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.status,
          description: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.description,
          input_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.input_summary,
          output_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.output_summary,
          update_frequency: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.update_frequency,
          known_limitations: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.known_limitations,
          metadata_url: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.metadata_url,
          explorer_url: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.explorer_url,
          permission_granted: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Illinois Wildflowers registry entry");
  }
}
