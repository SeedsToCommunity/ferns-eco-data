import { db, fernsSourcesTable } from "@workspace/db";
import { LCSCG_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let registrySeeded = false;

export async function ensureLcscgRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

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
          licenses: LCSCG_REGISTRY_ENTRY.licenses ?? [],
          license_notes: LCSCG_REGISTRY_ENTRY.license_notes ?? "",
          license: LCSCG_REGISTRY_ENTRY.license,
          rights: LCSCG_REGISTRY_ENTRY.rights,
          website_url_patterns: LCSCG_REGISTRY_ENTRY.website_url_patterns ?? {},
          general_summary: LCSCG_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: LCSCG_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: LCSCG_REGISTRY_ENTRY.permission_granted,
          non_passthrough_endpoints: LCSCG_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    registrySeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed LCSCG registry entry");
  }
}
