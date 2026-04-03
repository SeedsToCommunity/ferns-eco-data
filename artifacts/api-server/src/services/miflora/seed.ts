import { db, fernsSourcesTable } from "@workspace/db";
import { MIFLORA_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureMifloraRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(MIFLORA_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MIFLORA_REGISTRY_ENTRY.name,
          status: MIFLORA_REGISTRY_ENTRY.status,
          description: MIFLORA_REGISTRY_ENTRY.description,
          input_summary: MIFLORA_REGISTRY_ENTRY.input_summary,
          output_summary: MIFLORA_REGISTRY_ENTRY.output_summary,
          update_frequency: MIFLORA_REGISTRY_ENTRY.update_frequency,
          known_limitations: MIFLORA_REGISTRY_ENTRY.known_limitations,
          metadata_url: MIFLORA_REGISTRY_ENTRY.metadata_url,
          explorer_url: MIFLORA_REGISTRY_ENTRY.explorer_url,
          permission_granted: MIFLORA_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: MIFLORA_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: MIFLORA_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: MIFLORA_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Michigan Flora registry entry");
  }
}
