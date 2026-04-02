import { db, fernsSourcesTable } from "@workspace/db";
import { GOOGLE_IMAGES_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureGoogleImagesRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(GOOGLE_IMAGES_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: GOOGLE_IMAGES_REGISTRY_ENTRY.name,
          status: GOOGLE_IMAGES_REGISTRY_ENTRY.status,
          description: GOOGLE_IMAGES_REGISTRY_ENTRY.description,
          input_summary: GOOGLE_IMAGES_REGISTRY_ENTRY.input_summary,
          output_summary: GOOGLE_IMAGES_REGISTRY_ENTRY.output_summary,
          update_frequency: GOOGLE_IMAGES_REGISTRY_ENTRY.update_frequency,
          known_limitations: GOOGLE_IMAGES_REGISTRY_ENTRY.known_limitations,
          metadata_url: GOOGLE_IMAGES_REGISTRY_ENTRY.metadata_url,
          explorer_url: GOOGLE_IMAGES_REGISTRY_ENTRY.explorer_url,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Google Images registry entry");
  }
}
