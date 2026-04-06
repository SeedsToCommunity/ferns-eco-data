import { db } from "@workspace/db";
import { sourceRelationshipsTable } from "@workspace/db";
import { SOURCE_RELATIONSHIPS } from "./metadata.js";
import { logger } from "../../lib/logger.js";
import { or, eq } from "drizzle-orm";

let seeded = false;

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
