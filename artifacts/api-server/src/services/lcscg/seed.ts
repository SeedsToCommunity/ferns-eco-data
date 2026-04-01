import { db, fernsSourcesTable } from "@workspace/db";
import { LCSCG_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureLcscgRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(LCSCG_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: LCSCG_REGISTRY_ENTRY.name,
          status: LCSCG_REGISTRY_ENTRY.status,
          description: LCSCG_REGISTRY_ENTRY.description,
          input_summary: LCSCG_REGISTRY_ENTRY.input_summary,
          output_summary: LCSCG_REGISTRY_ENTRY.output_summary,
          update_frequency: LCSCG_REGISTRY_ENTRY.update_frequency,
          known_limitations: LCSCG_REGISTRY_ENTRY.known_limitations,
          metadata_url: LCSCG_REGISTRY_ENTRY.metadata_url,
          explorer_url: LCSCG_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed LCSCG registry entry");
  }
}
