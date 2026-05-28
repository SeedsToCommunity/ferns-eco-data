import { db, fernsSourcesTable } from "@workspace/db";
import { ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureIllinoisWildflowersRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.name,
          status: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.status,
          description: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.description,
          input_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.input_summary,
          output_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.output_summary,
          update_frequency: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.update_frequency,
          known_limitations: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.known_limitations,
          metadata_url: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.metadata_url,
          licenses: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.licenses ?? [],
          license_notes: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.license_notes ?? "",
          license: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.license,
          rights: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.rights,
          website_url_patterns: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.website_url_patterns,
          general_summary: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.permission_granted,
          non_passthrough_endpoints: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Illinois Wildflowers registry entry");
  }
}
