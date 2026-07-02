import { db, bonapMapsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { BonapNapaMapUrlResult } from "@workspace/external-data-providers/bonap-napa";
import type { BonapMap, InsertBonapMap } from "@workspace/db";
import { BONAP_SOURCE_ID } from "./metadata.js";

const NEGATIVE_TTL_DAYS = 30;

export async function lookupCache(cacheKey: string): Promise<BonapMap | null> {
  const rows = await db
    .select()
    .from(bonapMapsTable)
    .where(eq(bonapMapsTable.cache_key, cacheKey))
    .limit(1);

  if (rows.length === 0) return null;

  const row = rows[0];
  if (row.expires_at && row.expires_at < new Date()) {
    await db.delete(bonapMapsTable).where(eq(bonapMapsTable.cache_key, cacheKey));
    return null;
  }

  return row;
}

export async function storeCache(
  cacheKey: string,
  result: BonapNapaMapUrlResult,
  input: { genus: string; species: string },
): Promise<BonapMap> {
  const expiresAt = result.found
    ? null
    : new Date(Date.now() + NEGATIVE_TTL_DAYS * 24 * 60 * 60 * 1000);

  const insert: InsertBonapMap = {
    cache_key: cacheKey,
    genus: input.genus,
    species: input.species,
    map_type: result.mapTypeServed,
    species_stripped: false,
    map_url: result.mapUrl,
    upstream_url: result.upstreamUrl,
    status: result.found ? "found" : "not_found",
    expires_at: expiresAt,
    source_id: BONAP_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
  };

  const rows = await db
    .insert(bonapMapsTable)
    .values(insert)
    .onConflictDoUpdate({
      target: bonapMapsTable.cache_key,
      set: {
        map_url: insert.map_url,
        status: insert.status,
        fetched_at: insert.fetched_at,
        upstream_url: insert.upstream_url,
        expires_at: insert.expires_at,
        species_stripped: insert.species_stripped,
      },
    })
    .returning();

  return rows[0];
}
