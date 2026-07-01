import { db, fernsSourcesTable } from "@workspace/db";
import { WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureWildTypeNativePlantsRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.name,
          status: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.status,
          description: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.description,
          input_summary: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.input_summary,
          output_summary: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.output_summary,
          update_frequency: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.update_frequency,
          known_limitations: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.known_limitations,
          metadata_url: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.metadata_url,
          licenses: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.licenses ?? [],
          license_notes: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.license_notes ?? "",
          general_summary: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.permission_granted,
          non_passthrough_endpoints: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed WildType Native Plants registry entry");
  }
}
