import { db, fernsSourcesTable } from "@workspace/db";
import { INAT_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureInatRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(INAT_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: INAT_REGISTRY_ENTRY.name,
          status: INAT_REGISTRY_ENTRY.status,
          description: INAT_REGISTRY_ENTRY.description,
          input_summary: INAT_REGISTRY_ENTRY.input_summary,
          output_summary: INAT_REGISTRY_ENTRY.output_summary,
          update_frequency: INAT_REGISTRY_ENTRY.update_frequency,
          known_limitations: INAT_REGISTRY_ENTRY.known_limitations,
          metadata_url: INAT_REGISTRY_ENTRY.metadata_url,
          explorer_url: INAT_REGISTRY_ENTRY.explorer_url,
          permission_granted: INAT_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: INAT_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: INAT_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: INAT_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed iNaturalist registry entry");
  }
}
