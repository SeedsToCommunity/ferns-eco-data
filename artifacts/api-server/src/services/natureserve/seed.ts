import { db, fernsSourcesTable } from "@workspace/db";
import { NATURESERVE_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureNatureserveRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(NATURESERVE_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: NATURESERVE_REGISTRY_ENTRY.name,
          status: NATURESERVE_REGISTRY_ENTRY.status,
          description: NATURESERVE_REGISTRY_ENTRY.description,
          input_summary: NATURESERVE_REGISTRY_ENTRY.input_summary,
          output_summary: NATURESERVE_REGISTRY_ENTRY.output_summary,
          update_frequency: NATURESERVE_REGISTRY_ENTRY.update_frequency,
          known_limitations: NATURESERVE_REGISTRY_ENTRY.known_limitations,
          metadata_url: NATURESERVE_REGISTRY_ENTRY.metadata_url,
          explorer_url: NATURESERVE_REGISTRY_ENTRY.explorer_url,
          permission_granted: NATURESERVE_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: NATURESERVE_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: NATURESERVE_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: NATURESERVE_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed NatureServe registry entry");
  }
}
