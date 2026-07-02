import { db, fernsSourcesTable } from "@workspace/db";
import { NATURESERVE_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureNatureserveRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(NATURESERVE_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: NATURESERVE_REGISTRY_ENTRY.name,
          status: NATURESERVE_REGISTRY_ENTRY.status,
          description: NATURESERVE_REGISTRY_ENTRY.description,
          input_summary: NATURESERVE_REGISTRY_ENTRY.input_summary,
          output_summary: NATURESERVE_REGISTRY_ENTRY.output_summary,
          update_frequency: NATURESERVE_REGISTRY_ENTRY.update_frequency,
          known_limitations: NATURESERVE_REGISTRY_ENTRY.known_limitations,
          metadata_url: NATURESERVE_REGISTRY_ENTRY.metadata_url,
          licenses: NATURESERVE_REGISTRY_ENTRY.licenses ?? [],
          license_notes: NATURESERVE_REGISTRY_ENTRY.license_notes ?? "",
          license: NATURESERVE_REGISTRY_ENTRY.license,
          rights: NATURESERVE_REGISTRY_ENTRY.rights,
          website_url_patterns: NATURESERVE_REGISTRY_ENTRY.website_url_patterns,
          general_summary: NATURESERVE_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: NATURESERVE_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: NATURESERVE_REGISTRY_ENTRY.permission_granted,
          knowledge_type: NATURESERVE_REGISTRY_ENTRY.knowledge_type,
          non_passthrough_endpoints: NATURESERVE_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed NatureServe registry entry");
  }
}
