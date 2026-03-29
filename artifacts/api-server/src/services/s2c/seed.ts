import { db, fernsSourcesTable } from "@workspace/db";
import { S2C_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureS2CRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(S2C_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: S2C_REGISTRY_ENTRY.name,
          status: S2C_REGISTRY_ENTRY.status,
          description: S2C_REGISTRY_ENTRY.description,
          input_summary: S2C_REGISTRY_ENTRY.input_summary,
          output_summary: S2C_REGISTRY_ENTRY.output_summary,
          update_frequency: S2C_REGISTRY_ENTRY.update_frequency,
          known_limitations: S2C_REGISTRY_ENTRY.known_limitations,
          metadata_url: S2C_REGISTRY_ENTRY.metadata_url,
          explorer_url: S2C_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Seeds to Community Washtenaw registry entry");
  }
}
