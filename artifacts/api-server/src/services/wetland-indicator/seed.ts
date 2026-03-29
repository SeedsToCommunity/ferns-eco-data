import { db, fernsSourcesTable } from "@workspace/db";
import { WETLAND_INDICATOR_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureWetlandIndicatorRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(WETLAND_INDICATOR_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: WETLAND_INDICATOR_REGISTRY_ENTRY.name,
          status: WETLAND_INDICATOR_REGISTRY_ENTRY.status,
          description: WETLAND_INDICATOR_REGISTRY_ENTRY.description,
          input_summary: WETLAND_INDICATOR_REGISTRY_ENTRY.input_summary,
          output_summary: WETLAND_INDICATOR_REGISTRY_ENTRY.output_summary,
          update_frequency: WETLAND_INDICATOR_REGISTRY_ENTRY.update_frequency,
          known_limitations: WETLAND_INDICATOR_REGISTRY_ENTRY.known_limitations,
          metadata_url: WETLAND_INDICATOR_REGISTRY_ENTRY.metadata_url,
          explorer_url: WETLAND_INDICATOR_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Wetland Indicator Status registry entry");
  }
}
