import { db, fernsSourcesTable } from "@workspace/db";
import { NPN_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureNpnRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(NPN_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: NPN_REGISTRY_ENTRY.name,
          status: NPN_REGISTRY_ENTRY.status,
          description: NPN_REGISTRY_ENTRY.description,
          input_summary: NPN_REGISTRY_ENTRY.input_summary,
          output_summary: NPN_REGISTRY_ENTRY.output_summary,
          update_frequency: NPN_REGISTRY_ENTRY.update_frequency,
          known_limitations: NPN_REGISTRY_ENTRY.known_limitations,
          metadata_url: NPN_REGISTRY_ENTRY.metadata_url,
          explorer_url: NPN_REGISTRY_ENTRY.explorer_url,
          permission_granted: NPN_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: NPN_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: NPN_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: NPN_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed NPN registry entry");
  }
}
