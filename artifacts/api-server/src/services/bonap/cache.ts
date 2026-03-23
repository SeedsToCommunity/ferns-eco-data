import { db, bonapMapsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { VerificationResult } from "./connector.js";
import type { InsertBonappMap, BonappMap } from "@workspace/db";

const NEGATIVE_TTL_DAYS = 30;

export async function lookupCache(cacheKey: string): Promise<BonappMap | null> {
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
  result: VerificationResult,
  provenance: {
    source_id: string;
    fetched_at: Date;
    method: string;
    upstream_url: string;
    derivation_summary: string;
    derivation_scientific: string;
  },
): Promise<BonappMap> {
  const expiresAt =
    result.status === "not_found"
      ? new Date(Date.now() + NEGATIVE_TTL_DAYS * 24 * 60 * 60 * 1000)
      : null;

  const insert: InsertBonappMap = {
    cache_key: cacheKey,
    genus: result.normalized.genus,
    species: result.normalized.species,
    map_type: result.normalized.map_type,
    species_stripped: result.normalized.species_stripped,
    map_url: result.map_url,
    source_url: result.source_url,
    status: result.status,
    tdc_taxon_id: null,
    expires_at: expiresAt,
    source_id: provenance.source_id,
    fetched_at: provenance.fetched_at,
    method: provenance.method,
    upstream_url: provenance.upstream_url,
    derivation_summary: provenance.derivation_summary,
    derivation_scientific: provenance.derivation_scientific,
  };

  const rows = await db
    .insert(bonapMapsTable)
    .values(insert)
    .onConflictDoUpdate({
      target: bonapMapsTable.cache_key,
      set: {
        map_url: insert.map_url,
        source_url: insert.source_url,
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
