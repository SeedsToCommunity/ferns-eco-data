import { db, fernsSourcesTable } from "@workspace/db";
import { WUCOLS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureWucolsRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(WUCOLS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: WUCOLS_REGISTRY_ENTRY.name,
          status: WUCOLS_REGISTRY_ENTRY.status,
          description: WUCOLS_REGISTRY_ENTRY.description,
          input_summary: WUCOLS_REGISTRY_ENTRY.input_summary,
          output_summary: WUCOLS_REGISTRY_ENTRY.output_summary,
          update_frequency: WUCOLS_REGISTRY_ENTRY.update_frequency,
          known_limitations: WUCOLS_REGISTRY_ENTRY.known_limitations,
          metadata_url: WUCOLS_REGISTRY_ENTRY.metadata_url,
          explorer_url: WUCOLS_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed WUCOLS registry entry");
  }
}
