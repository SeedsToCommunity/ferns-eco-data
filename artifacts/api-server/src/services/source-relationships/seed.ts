import { db } from "@workspace/db";
import { sourceRelationshipsTable, fernsSourcesTable } from "@workspace/db";
import { SOURCE_RELATIONSHIPS } from "./metadata.js";
import { logger } from "../../lib/logger.js";
import { or, eq } from "drizzle-orm";

let seeded = false;
let registrySeeded = false;

const REGISTRY_ENTRY = {
  source_id: "ferns-source-relationships",
  name: "FERNS Source Relationships",
  knowledge_type: "system" as const,
  status: "live" as const,
  description:
    "Cross-source relationship graph cataloging how FERNS data sources interact — " +
    "their conflicts, overlaps, complementary coverage, and supersession relationships. " +
    "Used to surface context-sensitive warnings when combining sources in a workflow.",
  input_summary:
    "No input required for the full graph; optional filter by source_id returns relationships for a specific source",
  output_summary:
    "Array of relationship records, each with source pair, relationship_type (conflict/overlap/complements/supersedes), " +
    "scope, severity (blocking/cautionary/informational), description, and technical_note",
  dependencies: [] as string[],
  update_frequency:
    "Static — seeded at server startup from the source-relationships metadata module. " +
    "Updated when new FERNS sources are onboarded and their relationships are defined.",
  known_limitations:
    "Relationships are manually curated; coverage reflects known interactions between currently registered sources. " +
    "New sources added to FERNS may not immediately have all relationships documented.",
  metadata_url: "/api/v1/source-relationships",
  explorer_url: "/source-relationships",
  permission_granted: true,
  permission_status:
    "OPEN — FERNS is a self-hosted internal system. The source relationships endpoint is unauthenticated and intended for use by FERNS consumers and agents.",
  general_summary:
    "FERNS Source Relationships is a curated graph of cross-source interactions within the FERNS Data Layer. " +
    "It documents how any two FERNS sources relate to each other — whether they conflict (return contradictory data for the same concept), " +
    "overlap (index the same underlying data from different angles), complement (cover distinct aspects of the same query), " +
    "or where one supersedes another (a newer or more authoritative source replaces an older one). " +
    "Each relationship record carries a scope (the specific domain of interaction, e.g. taxonomy, occurrence_counts, c_values), " +
    "a severity (blocking, cautionary, or informational), a plain-English description, and a technical note with field-level detail. " +
    "Relationships are bidirectional — a single record covers both directions of a source pair. " +
    "This graph is the machine-readable form of knowledge that previously lived as prose guidance inside individual source metadata fields. " +
    "A query for all relationships returns the complete graph; a query filtered by source_id returns only the relationships involving that source. " +
    "This source is maintained as static reference data by FERNS — no upstream API call is made at query time.",
  technical_details:
    "Source: internal FERNS source-relationships metadata module. " +
    "DB table: ferns_source_relationships (columns: id serial PK, source_id_a text FK→ferns_sources.source_id, " +
    "source_id_b text FK→ferns_sources.source_id, relationship_type text, scope text, severity text, " +
    "description text, technical_note text, created_at timestamptz, updated_at timestamptz; " +
    "unique on (source_id_a, source_id_b, scope) with source_id_a < source_id_b enforced by pair() helper). " +
    "API endpoints: GET /api/v1/source-relationships (full graph), GET /api/v1/source-relationships?source_id={id} (filtered). " +
    "Relationship types: conflict (sources return contradictory values for the same concept), " +
    "overlap (sources index the same underlying data from different angles — combining counts double-counts), " +
    "complements (sources cover distinct aspects — combining adds value), " +
    "supersedes (source_id_a is the preferred source; source_id_b is older or less authoritative). " +
    "Severity levels: blocking (combining these sources without handling the relationship will produce incorrect results), " +
    "cautionary (combining is valid but requires awareness of the difference), " +
    "informational (no action required; noted for completeness). " +
    "Method: system (internal DB read, no upstream HTTP call). " +
    "Seeded at startup via ensureSourceRelationships(); records upserted on (source_id_a, source_id_b, scope).",
};

export async function ensureSourceRelationshipsRegistryEntry(): Promise<void> {
  if (registrySeeded) return;

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

  registrySeeded = true;
  logger.info("Source relationships registry entry seeded");
}

export async function ensureSourceRelationships(): Promise<void> {
  if (seeded) return;

  for (const rel of SOURCE_RELATIONSHIPS) {
    await db
      .insert(sourceRelationshipsTable)
      .values({
        source_id_a: rel.source_id_a,
        source_id_b: rel.source_id_b,
        relationship_type: rel.relationship_type,
        scope: rel.scope,
        severity: rel.severity,
        description: rel.description,
        technical_note: rel.technical_note,
      })
      .onConflictDoUpdate({
        target: [
          sourceRelationshipsTable.source_id_a,
          sourceRelationshipsTable.source_id_b,
          sourceRelationshipsTable.scope,
        ],
        set: {
          relationship_type: rel.relationship_type,
          severity: rel.severity,
          description: rel.description,
          technical_note: rel.technical_note,
          updated_at: new Date(),
        },
      });
  }

  seeded = true;
  logger.info({ count: SOURCE_RELATIONSHIPS.length }, "Source relationships seeded");
}

export async function querySourceRelationships(sourceId?: string) {
  if (sourceId) {
    return db
      .select()
      .from(sourceRelationshipsTable)
      .where(
        or(
          eq(sourceRelationshipsTable.source_id_a, sourceId),
          eq(sourceRelationshipsTable.source_id_b, sourceId),
        ),
      );
  }
  return db.select().from(sourceRelationshipsTable);
}
