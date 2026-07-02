import { db, fernsSourcesTable } from "@workspace/db";
import { MNFI_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let registrySeeded = false;

export async function ensureMnfiRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(MNFI_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: MNFI_REGISTRY_ENTRY.name,
          status: MNFI_REGISTRY_ENTRY.status,
          description: MNFI_REGISTRY_ENTRY.description,
          input_summary: MNFI_REGISTRY_ENTRY.input_summary,
          output_summary: MNFI_REGISTRY_ENTRY.output_summary,
          update_frequency: MNFI_REGISTRY_ENTRY.update_frequency,
          known_limitations: MNFI_REGISTRY_ENTRY.known_limitations,
          metadata_url: MNFI_REGISTRY_ENTRY.metadata_url,
          licenses: MNFI_REGISTRY_ENTRY.licenses ?? [],
          license_notes: MNFI_REGISTRY_ENTRY.license_notes ?? "",
          license: MNFI_REGISTRY_ENTRY.license,
          rights: MNFI_REGISTRY_ENTRY.rights,
          website_url_patterns: MNFI_REGISTRY_ENTRY.website_url_patterns ?? {},
          general_summary: MNFI_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: MNFI_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: MNFI_REGISTRY_ENTRY.permission_granted,
          knowledge_type: MNFI_REGISTRY_ENTRY.knowledge_type,
          non_passthrough_endpoints: MNFI_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    registrySeeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed MNFI registry entry");
  }
}
