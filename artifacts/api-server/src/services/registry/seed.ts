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
    "FERNS Source Registry is a self-hosted system catalog maintained by the FERNS Data Layer deployment itself — not an external institution. " +
    "Data type: a real-time index of all registered FERNS Knowledge Services, one entry per source, including identity, description, input/output shape, permission status, and links to full metadata and Source Explorer. " +
    "Coverage: all 21 registered FERNS sources across ecological, taxonomic, distribution, phenological, vocabulary, and web-reference knowledge types; no geographic or taxonomic restriction. " +
    "FERNS reads directly from its internal source registry table at request time; no upstream API is called and no external data is fetched. " +
    "A query returns an array of SourceSummary objects, one per registered service, each including all identity and description fields. " +
    "The registry reflects the current registration state at the time of the request; entries are written at service startup by each source's seed function and are not cached separately from the database. " +
    "Limitation: the registry reports what is registered, not what is reliable — it does not evaluate data quality, trust tier, accuracy, or methodological soundness of any registered source. Those are application-layer concerns. " +
    "The registry does not overlap with any individual FERNS data source — it is the discovery catalog for all of them; use it as the first call in any FERNS integration to identify available sources and their capabilities.",
  technical_details:
    "FERNS Knowledge Registry. Source: internal ferns_sources table (PostgreSQL). " +
    "DB table: ferns_sources (key columns: source_id text PK, name text, knowledge_type text, status text, description text, " +
    "general_summary text, technical_details text, input_summary text, output_summary text, dependencies text[], " +
    "update_frequency text, known_limitations text, metadata_url text, explorer_url text, permission_granted boolean, " +
    "permission_status text, created_at timestamptz, updated_at timestamptz). " +
    "Entries are written at service startup by each source's seed.ts via onConflictDoUpdate (upsert on source_id). " +
    "The registry reads from this table without caching — every /api/v1/sources request queries the DB. " +
    "Coverage: 21 registered sources at current deployment; source count grows as new services are onboarded. " +
    "It does not perform taxonomy reconciliation, trust tier assignment, cross-source synthesis, or data quality assessment — " +
    "those are application-layer concerns. " +
    "Overlap: not applicable — the registry is a system catalog for all FERNS sources, not a data source that overlaps with others. " +
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
