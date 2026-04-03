import { db, fernsSourcesTable } from "@workspace/db";
import { GOBOTANY_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureGobotanyRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(GOBOTANY_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: GOBOTANY_REGISTRY_ENTRY.name,
          status: GOBOTANY_REGISTRY_ENTRY.status,
          description: GOBOTANY_REGISTRY_ENTRY.description,
          input_summary: GOBOTANY_REGISTRY_ENTRY.input_summary,
          output_summary: GOBOTANY_REGISTRY_ENTRY.output_summary,
          update_frequency: GOBOTANY_REGISTRY_ENTRY.update_frequency,
          known_limitations: GOBOTANY_REGISTRY_ENTRY.known_limitations,
          metadata_url: GOBOTANY_REGISTRY_ENTRY.metadata_url,
          explorer_url: GOBOTANY_REGISTRY_ENTRY.explorer_url,
          permission_granted: GOBOTANY_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: GOBOTANY_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: GOBOTANY_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: GOBOTANY_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Go Botany registry entry");
  }
}
