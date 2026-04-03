import { db, fernsSourcesTable } from "@workspace/db";
import { LADY_BIRD_JOHNSON_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureLadyBirdJohnsonRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(LADY_BIRD_JOHNSON_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.name,
          status: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.status,
          description: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.description,
          input_summary: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.input_summary,
          output_summary: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.output_summary,
          update_frequency: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.update_frequency,
          known_limitations: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.known_limitations,
          metadata_url: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.metadata_url,
          explorer_url: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.explorer_url,
          permission_granted: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.permission_granted ?? null,
          permission_status: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.permission_status ?? null,
          general_summary: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.technical_details ?? null,
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Lady Bird Johnson registry entry");
  }
}
