import { db, fernsSourcesTable } from "@workspace/db";
import { MISSOURI_PLANTS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureMissouriPlantsRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(MISSOURI_PLANTS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MISSOURI_PLANTS_REGISTRY_ENTRY.name,
          status: MISSOURI_PLANTS_REGISTRY_ENTRY.status,
          description: MISSOURI_PLANTS_REGISTRY_ENTRY.description,
          input_summary: MISSOURI_PLANTS_REGISTRY_ENTRY.input_summary,
          output_summary: MISSOURI_PLANTS_REGISTRY_ENTRY.output_summary,
          update_frequency: MISSOURI_PLANTS_REGISTRY_ENTRY.update_frequency,
          known_limitations: MISSOURI_PLANTS_REGISTRY_ENTRY.known_limitations,
          metadata_url: MISSOURI_PLANTS_REGISTRY_ENTRY.metadata_url,
          explorer_url: MISSOURI_PLANTS_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Missouri Plants registry entry");
  }
}
