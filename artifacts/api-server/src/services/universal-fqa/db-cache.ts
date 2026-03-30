import {
  db,
  universalFqaDatabasesTable,
  universalFqaSpeciesTable,
} from "@workspace/db";
import { eq, and, ilike, sql } from "drizzle-orm";
import { fetchDatabase } from "./client.js";
import type { UniversalFqaDatabaseDetail, UniversalFqaSpeciesRecord } from "./client.js";
import { logger } from "../../lib/logger.js";

function rowToSpeciesRecord(row: {
  scientific_name: string;
  family: string;
  acronym: string;
  native: string;
  c: string | null;
  w: string | null;
  physiognomy: string;
  duration: string;
  common_name: string;
}): UniversalFqaSpeciesRecord {
  return {
    scientific_name: row.scientific_name,
    family: row.family,
    acronym: row.acronym,
    native: row.native,
    c: nullStrOrNum(row.c),
    w: nullStrOrNum(row.w),
    physiognomy: row.physiognomy,
    duration: row.duration,
    common_name: row.common_name,
  };
}

function nullStrOrNum(val: string | null): string | number | null {
  if (val === null || val === "") return null;
  const n = Number(val);
  if (!isNaN(n)) return n;
  return val;
}

function speciesRecordToC(sp: UniversalFqaSpeciesRecord): string | null {
  if (sp.c === null || sp.c === undefined) return null;
  return String(sp.c);
}

function speciesRecordToW(sp: UniversalFqaSpeciesRecord): string | null {
  if (sp.w === null || sp.w === undefined) return null;
  return String(sp.w);
}

export async function getOrFetchDatabase(
  databaseId: number
): Promise<{ detail: UniversalFqaDatabaseDetail; cache_hit: boolean }> {
  const rows = await db
    .select()
    .from(universalFqaDatabasesTable)
    .where(eq(universalFqaDatabasesTable.database_id, databaseId))
    .limit(1);

  if (rows.length > 0) {
    const dbRow = rows[0];
    const speciesRows = await db
      .select()
      .from(universalFqaSpeciesTable)
      .where(eq(universalFqaSpeciesTable.database_id, databaseId));

    const detail: UniversalFqaDatabaseDetail = {
      id: dbRow.database_id,
      region: dbRow.region,
      year: dbRow.year,
      citation: dbRow.citation,
      total_species: dbRow.total_species,
      native_species: dbRow.native_species,
      non_native_species: dbRow.non_native_species,
      total_mean_c: dbRow.total_mean_c ?? null,
      native_mean_c: dbRow.native_mean_c ?? null,
      species: speciesRows.map(rowToSpeciesRecord),
    };

    return { detail, cache_hit: true };
  }

  logger.info({ databaseId }, "Universal FQA: fetching database from upstream");
  const detail = await fetchDatabase(databaseId);

  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .insert(universalFqaDatabasesTable)
      .values({
        database_id: detail.id,
        region: detail.region,
        year: detail.year,
        citation: detail.citation,
        total_species: detail.total_species,
        native_species: detail.native_species,
        non_native_species: detail.non_native_species,
        total_mean_c: detail.total_mean_c ?? undefined,
        native_mean_c: detail.native_mean_c ?? undefined,
        cached_at: now,
      })
      .onConflictDoUpdate({
        target: universalFqaDatabasesTable.database_id,
        set: {
          region: detail.region,
          year: detail.year,
          citation: detail.citation,
          total_species: detail.total_species,
          native_species: detail.native_species,
          non_native_species: detail.non_native_species,
          total_mean_c: detail.total_mean_c ?? undefined,
          native_mean_c: detail.native_mean_c ?? undefined,
          cached_at: now,
        },
      });

    if (detail.species.length > 0) {
      const chunkSize = 500;
      for (let i = 0; i < detail.species.length; i += chunkSize) {
        const chunk = detail.species.slice(i, i + chunkSize);
        await tx
          .insert(universalFqaSpeciesTable)
          .values(
            chunk.map((sp) => ({
              database_id: detail.id,
              scientific_name: sp.scientific_name,
              family: sp.family,
              acronym: sp.acronym,
              native: sp.native,
              c: speciesRecordToC(sp),
              w: speciesRecordToW(sp),
              physiognomy: sp.physiognomy,
              duration: sp.duration,
              common_name: sp.common_name,
              cached_at: now,
            }))
          )
          .onConflictDoUpdate({
            target: [universalFqaSpeciesTable.database_id, universalFqaSpeciesTable.scientific_name],
            set: {
              family: sql`excluded.family`,
              acronym: sql`excluded.acronym`,
              native: sql`excluded.native`,
              c: sql`excluded.c`,
              w: sql`excluded.w`,
              physiognomy: sql`excluded.physiognomy`,
              duration: sql`excluded.duration`,
              common_name: sql`excluded.common_name`,
              cached_at: sql`excluded.cached_at`,
            },
          });
      }
      logger.info({ databaseId, count: detail.species.length }, "Universal FQA: species stored");
    }
  });

  return { detail, cache_hit: false };
}

export async function lookupSpeciesFromDb(
  databaseId: number,
  scientificName: string
): Promise<{ found: boolean; species: UniversalFqaSpeciesRecord | null; cache_hit: boolean }> {
  const { detail, cache_hit } = await getOrFetchDatabase(databaseId);

  const normalized = scientificName.toLowerCase().trim();
  const match = detail.species.find(
    (sp) => sp.scientific_name.toLowerCase() === normalized
  ) ?? null;

  return {
    found: match !== null,
    species: match,
    cache_hit,
  };
}
