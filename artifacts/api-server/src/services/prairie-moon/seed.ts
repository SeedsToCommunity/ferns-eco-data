import { db, fernsSourcesTable } from "@workspace/db";
import { PRAIRIE_MOON_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensurePrairieMoonRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(PRAIRIE_MOON_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: PRAIRIE_MOON_REGISTRY_ENTRY.name,
          status: PRAIRIE_MOON_REGISTRY_ENTRY.status,
          description: PRAIRIE_MOON_REGISTRY_ENTRY.description,
          input_summary: PRAIRIE_MOON_REGISTRY_ENTRY.input_summary,
          output_summary: PRAIRIE_MOON_REGISTRY_ENTRY.output_summary,
          update_frequency: PRAIRIE_MOON_REGISTRY_ENTRY.update_frequency,
          known_limitations: PRAIRIE_MOON_REGISTRY_ENTRY.known_limitations,
          metadata_url: PRAIRIE_MOON_REGISTRY_ENTRY.metadata_url,
          explorer_url: PRAIRIE_MOON_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Prairie Moon registry entry");
  }
}
