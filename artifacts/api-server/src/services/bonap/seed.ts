import { db, fernsSourcesTable } from "@workspace/db";
import { BONAP_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureBonapRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(BONAP_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: BONAP_REGISTRY_ENTRY.name,
          status: BONAP_REGISTRY_ENTRY.status,
          description: BONAP_REGISTRY_ENTRY.description,
          input_summary: BONAP_REGISTRY_ENTRY.input_summary,
          output_summary: BONAP_REGISTRY_ENTRY.output_summary,
          update_frequency: BONAP_REGISTRY_ENTRY.update_frequency,
          known_limitations: BONAP_REGISTRY_ENTRY.known_limitations,
          metadata_url: BONAP_REGISTRY_ENTRY.metadata_url,
          explorer_url: BONAP_REGISTRY_ENTRY.explorer_url,
          permission_granted: BONAP_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: BONAP_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: BONAP_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: BONAP_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed BONAP registry entry");
  }
}
