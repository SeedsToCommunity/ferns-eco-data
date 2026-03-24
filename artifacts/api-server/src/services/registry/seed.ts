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
};

export async function ensureRegistryEntry(): Promise<void> {
  if (seeded) return;

  try {
    await db
      .insert(fernsSourcesTable)
      .values(REGISTRY_ENTRY)
      .onConflictDoNothing({ target: fernsSourcesTable.source_id });

    seeded = true;
  } catch (err) {
    logger.error({ err }, "Failed to seed FERNS registry entry");
  }
}
