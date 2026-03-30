import { db, fernsSourcesTable } from "@workspace/db";
import { UNIVERSAL_FQA_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureUniversalFqaRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(UNIVERSAL_FQA_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: UNIVERSAL_FQA_REGISTRY_ENTRY.name,
          status: UNIVERSAL_FQA_REGISTRY_ENTRY.status,
          description: UNIVERSAL_FQA_REGISTRY_ENTRY.description,
          input_summary: UNIVERSAL_FQA_REGISTRY_ENTRY.input_summary,
          output_summary: UNIVERSAL_FQA_REGISTRY_ENTRY.output_summary,
          update_frequency: UNIVERSAL_FQA_REGISTRY_ENTRY.update_frequency,
          known_limitations: UNIVERSAL_FQA_REGISTRY_ENTRY.known_limitations,
          metadata_url: UNIVERSAL_FQA_REGISTRY_ENTRY.metadata_url,
          explorer_url: UNIVERSAL_FQA_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Universal FQA registry entry");
  }
}
