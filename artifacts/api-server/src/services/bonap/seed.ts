import { db, fernsSourcesTable } from "@workspace/db";
import { BONAP_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureBonapRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(BONAP_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: BONAP_REGISTRY_ENTRY.name,
          status: BONAP_REGISTRY_ENTRY.status,
          description: BONAP_REGISTRY_ENTRY.description,
          input_summary: BONAP_REGISTRY_ENTRY.input_summary,
          output_summary: BONAP_REGISTRY_ENTRY.output_summary,
          update_frequency: BONAP_REGISTRY_ENTRY.update_frequency,
          known_limitations: BONAP_REGISTRY_ENTRY.known_limitations,
          metadata_url: BONAP_REGISTRY_ENTRY.metadata_url,
          licenses: BONAP_REGISTRY_ENTRY.licenses ?? [],
          license_notes: BONAP_REGISTRY_ENTRY.license_notes ?? "",
          general_summary: BONAP_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: BONAP_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: BONAP_REGISTRY_ENTRY.permission_granted,
          non_passthrough_endpoints: BONAP_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          license: BONAP_REGISTRY_ENTRY.license,
          rights: BONAP_REGISTRY_ENTRY.rights,
          website_url_patterns: BONAP_REGISTRY_ENTRY.website_url_patterns ?? {},
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed BONAP registry entry");
  }
}
