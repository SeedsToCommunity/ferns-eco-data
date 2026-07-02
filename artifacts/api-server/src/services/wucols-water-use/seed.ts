import { db, fernsSourcesTable } from "@workspace/db";
import { WUCOLS_WATER_USE_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureWucolsWaterUseRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(WUCOLS_WATER_USE_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: WUCOLS_WATER_USE_REGISTRY_ENTRY.name,
          status: WUCOLS_WATER_USE_REGISTRY_ENTRY.status,
          description: WUCOLS_WATER_USE_REGISTRY_ENTRY.description,
          input_summary: WUCOLS_WATER_USE_REGISTRY_ENTRY.input_summary,
          output_summary: WUCOLS_WATER_USE_REGISTRY_ENTRY.output_summary,
          update_frequency: WUCOLS_WATER_USE_REGISTRY_ENTRY.update_frequency,
          known_limitations: WUCOLS_WATER_USE_REGISTRY_ENTRY.known_limitations,
          metadata_url: WUCOLS_WATER_USE_REGISTRY_ENTRY.metadata_url,
          licenses: WUCOLS_WATER_USE_REGISTRY_ENTRY.licenses ?? [],
          license_notes: WUCOLS_WATER_USE_REGISTRY_ENTRY.license_notes ?? "",
          general_summary: WUCOLS_WATER_USE_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: WUCOLS_WATER_USE_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: WUCOLS_WATER_USE_REGISTRY_ENTRY.permission_granted,
          knowledge_type: WUCOLS_WATER_USE_REGISTRY_ENTRY.knowledge_type,
          license: WUCOLS_WATER_USE_REGISTRY_ENTRY.license,
          rights: WUCOLS_WATER_USE_REGISTRY_ENTRY.rights,
          website_url_patterns: WUCOLS_WATER_USE_REGISTRY_ENTRY.website_url_patterns ?? {},
          non_passthrough_endpoints: WUCOLS_WATER_USE_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed WUCOLS Water Use registry entry");
  }
}
