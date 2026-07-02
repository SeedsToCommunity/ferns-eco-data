import {
  db,
  universalFqaDatabasesTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import type { UniversalFqaResult } from "@workspace/external-data-providers/universal-fqa";
import { logger } from "../../lib/logger.js";

export async function lookupDatabase(
  databaseId: number,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date } | null> {
  const rows = await db
    .select()
    .from(universalFqaDatabasesTable)
    .where(eq(universalFqaDatabasesTable.database_id, databaseId))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    raw: row.upstream_response,
    upstream_url: row.upstream_url,
    fetched_at: row.fetched_at,
  };
}

export async function storeDatabase(
  databaseId: number,
  result: UniversalFqaResult,
): Promise<{ raw: unknown; upstream_url: string; fetched_at: Date }> {
  const now = new Date();

  await db
    .insert(universalFqaDatabasesTable)
    .values({
      database_id: databaseId,
      upstream_response: result.raw as Record<string, unknown>,
      upstream_url: result.upstream_url,
      fetched_at: now,
      cached_at: now,
    })
    .onConflictDoUpdate({
      target: universalFqaDatabasesTable.database_id,
      set: {
        upstream_response: result.raw as Record<string, unknown>,
        upstream_url: result.upstream_url,
        fetched_at: now,
        cached_at: now,
      },
    });

  logger.info({ databaseId }, "Universal FQA: database stored in cache");

  return {
    raw: result.raw,
    upstream_url: result.upstream_url,
    fetched_at: now,
  };
}
