import { db, fernsSourcesTable } from "@workspace/db";
import { logger } from "../../lib/logger.js";

let seeded = false;

const REGISTRY_ENTRY = {
  source_id: "ferns-registry",
  name: "FERNS Source Registry",
  knowledge_type: "system",
  status: "live",
  description:
    "The discovery layer for the FERNS Data Layer. Lists all registered FERNS Knowledge Services with enough detail to make a routing decision. This is the starting point for any developer, researcher, or application that wants to know what FERNS knows.",
  input_summary: "No input required — the index returns all registered services",
  output_summary:
    "Array of SourceSummary objects, one per registered service, each with identity, description, input/output summary, dependencies, and links to full metadata and Source Explorer",
  dependencies: [] as string[],
  update_frequency: "Live — reflects registered services at time of request",
  known_limitations:
    "Reports what is registered; does not evaluate data quality, trust tier, or methodological soundness of registered services. Those are application-layer concerns.",
  metadata_url: "/api/v1/sources/metadata",
  explorer_url: "/",
  permission_granted: true,
  permission_status:
    "OPEN — FERNS is a self-hosted internal system. " +
    "The registry endpoint is unauthenticated and intended for use by FERNS consumers and agents.",
  general_summary:
    "FERNS Source Registry — live catalog of all registered FERNS Knowledge Services. " +
    "Reflects current registration state at time of request. Populated at service startup.",
  technical_details:
    "FERNS Knowledge Registry. Source: internal ferns_sources table. " +
    "Entries are written at service build time by each source's seed function. " +
    "The registry reads from this table without caching. " +
    "It does not perform taxonomy reconciliation, trust tier assignment, or cross-source synthesis — " +
    "those are application-layer concerns. " +
    "Method: system (internal DB read, no upstream HTTP call).",
};

export async function ensureRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(REGISTRY_ENTRY)
      .onConflictDoUpdate({
        target: fernsSourcesTable.source_id,
        set: {
          name: REGISTRY_ENTRY.name,
          status: REGISTRY_ENTRY.status,
          description: REGISTRY_ENTRY.description,
          input_summary: REGISTRY_ENTRY.input_summary,
          output_summary: REGISTRY_ENTRY.output_summary,
          update_frequency: REGISTRY_ENTRY.update_frequency,
          known_limitations: REGISTRY_ENTRY.known_limitations,
          metadata_url: REGISTRY_ENTRY.metadata_url,
          explorer_url: REGISTRY_ENTRY.explorer_url,
          permission_granted: REGISTRY_ENTRY.permission_granted,
          permission_status: REGISTRY_ENTRY.permission_status,
          general_summary: REGISTRY_ENTRY.general_summary,
          technical_details: REGISTRY_ENTRY.technical_details,
          updated_at: new Date(),
        },
      });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed FERNS registry entry");
  }
}
