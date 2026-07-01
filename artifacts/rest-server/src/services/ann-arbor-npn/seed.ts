import { db, fernsSourcesTable } from "@workspace/db";
import { ANN_ARBOR_NPN_REGISTRY_ENTRY } from "./metadata.js";
import { logger } from "../../lib/logger.js";

let seeded = false;

export async function ensureAnnArborNpnRegistryEntry(): Promise<void> {
  if (seeded) return;
  try {
    await db
      .insert(fernsSourcesTable)
      .values(ANN_ARBOR_NPN_REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: ANN_ARBOR_NPN_REGISTRY_ENTRY.name,
          status: ANN_ARBOR_NPN_REGISTRY_ENTRY.status,
          description: ANN_ARBOR_NPN_REGISTRY_ENTRY.description,
          input_summary: ANN_ARBOR_NPN_REGISTRY_ENTRY.input_summary,
          output_summary: ANN_ARBOR_NPN_REGISTRY_ENTRY.output_summary,
          update_frequency: ANN_ARBOR_NPN_REGISTRY_ENTRY.update_frequency,
          known_limitations: ANN_ARBOR_NPN_REGISTRY_ENTRY.known_limitations,
          metadata_url: ANN_ARBOR_NPN_REGISTRY_ENTRY.metadata_url,
          licenses: ANN_ARBOR_NPN_REGISTRY_ENTRY.licenses ?? [],
          license_notes: ANN_ARBOR_NPN_REGISTRY_ENTRY.license_notes ?? "",
          general_summary: ANN_ARBOR_NPN_REGISTRY_ENTRY.general_summary ?? null,
          technical_details: ANN_ARBOR_NPN_REGISTRY_ENTRY.technical_details ?? null,
          permission_granted: ANN_ARBOR_NPN_REGISTRY_ENTRY.permission_granted,
          knowledge_type: ANN_ARBOR_NPN_REGISTRY_ENTRY.knowledge_type,
          non_passthrough_endpoints: ANN_ARBOR_NPN_REGISTRY_ENTRY.non_passthrough_endpoints ?? [],
          license: ANN_ARBOR_NPN_REGISTRY_ENTRY.license,
          rights: ANN_ARBOR_NPN_REGISTRY_ENTRY.rights,
          website_url_patterns: ANN_ARBOR_NPN_REGISTRY_ENTRY.website_url_patterns ?? {},
          updated_at: new Date(),
        },
      });
    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed Ann Arbor NPN registry entry");
  }
}
