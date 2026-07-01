import { db, fernsSourcesTable } from "@workspace/db";
import { GBIF_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureGbifRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(GBIF_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: GBIF_REGISTRY_ENTRY.name,
          status: GBIF_REGISTRY_ENTRY.status,
          description: GBIF_REGISTRY_ENTRY.description,
          input_summary: GBIF_REGISTRY_ENTRY.input_summary,
          output_summary: GBIF_REGISTRY_ENTRY.output_summary,
          update_frequency: GBIF_REGISTRY_ENTRY.update_frequency,
          known_limitations: GBIF_REGISTRY_ENTRY.known_limitations,
          metadata_url: GBIF_REGISTRY_ENTRY.metadata_url,
          licenses: GBIF_REGISTRY_ENTRY.licenses ?? [],
          license_notes: GBIF_REGISTRY_ENTRY.license_notes ?? "",
          license: GBIF_REGISTRY_ENTRY.license,
          rights: GBIF_REGISTRY_ENTRY.rights,
          website_url_patterns: GBIF_REGISTRY_ENTRY.website_url_patterns,
          general_summary: GBIF_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: GBIF_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: GBIF_REGISTRY_ENTRY.permission_granted,
          knowledge_type: GBIF_REGISTRY_ENTRY.knowledge_type,
          non_passthrough_endpoints: GBIF_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed GBIF registry entry");
  }
}
