import { db, fernsSourcesTable } from "@workspace/db";
import { COEFFICIENT_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureCoefficientRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(COEFFICIENT_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: COEFFICIENT_REGISTRY_ENTRY.name,
          status: COEFFICIENT_REGISTRY_ENTRY.status,
          description: COEFFICIENT_REGISTRY_ENTRY.description,
          input_summary: COEFFICIENT_REGISTRY_ENTRY.input_summary,
          output_summary: COEFFICIENT_REGISTRY_ENTRY.output_summary,
          update_frequency: COEFFICIENT_REGISTRY_ENTRY.update_frequency,
          known_limitations: COEFFICIENT_REGISTRY_ENTRY.known_limitations,
          metadata_url: COEFFICIENT_REGISTRY_ENTRY.metadata_url,
          explorer_url: COEFFICIENT_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Coefficient of Conservatism registry entry");
  }
}
