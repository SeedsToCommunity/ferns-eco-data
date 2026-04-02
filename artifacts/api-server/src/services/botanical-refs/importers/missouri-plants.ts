/**
 * Missouri Plants importer.
 * Parses missouriplants.com/All_Species_list.html and upserts entries
 * into the botanical_species_lists table.
 *
 * Link format: <a href="{path}">Scientific Name</a>
 * URL pattern: https://missouriplants.com/{Genus}_{species}_page.html
 * The href is authoritative — genus in the filename may be a synonym.
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../../lib/logger.js";
import { MISSOURI_PLANTS_SOURCE_ID } from "../../missouri-plants/metadata.js";

const LIST_URL = "https://missouriplants.com/All_Species_list.html";
const BASE_URL = "https://missouriplants.com";
const SITE_ID = MISSOURI_PLANTS_SOURCE_ID;

interface ParsedEntry {
  scientific_name: string;
  url: string;
}

function parseSpeciesList(html: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const linkPattern = /<a\s+href="([^"]+)"[^>]*>([A-Z][a-z]+\s+[a-z][^<]*?)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(html)) !== null) {
    const href = m[1].trim();
    const text = m[2].trim();
    if (!href || !text) continue;
    if (href.startsWith("http://") || href.startsWith("https://")) {
      entries.push({ scientific_name: text, url: href });
    } else {
      const base = href.startsWith("/") ? BASE_URL : BASE_URL + "/";
      entries.push({ scientific_name: text, url: base + href });
    }
  }
  return entries;
}

export interface MissouriPlantsImportResult {
  fetched: number;
  upserted: number;
  errors: string[];
}

export async function importMissouriPlants(): Promise<MissouriPlantsImportResult> {
  const errors: string[] = [];

  logger.info({ url: LIST_URL }, "Fetching Missouri Plants species list");
  let html: string;
  try {
    const resp = await fetch(LIST_URL, {
      headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} from ${LIST_URL}`);
    html = await resp.text();
  } catch (err) {
    const msg = `Failed to fetch Missouri Plants list: ${String(err)}`;
    errors.push(msg);
    logger.error({ err }, msg);
    return { fetched: 0, upserted: 0, errors };
  }

  const entries = parseSpeciesList(html);
  logger.info({ count: entries.length }, "Missouri Plants: parsed species entries");

  // Deduplicate by scientific_name globally (some species appear twice with synonym URLs)
  const seen = new Map<string, string>();
  for (const e of entries) {
    seen.set(e.scientific_name, e.url);
  }
  const deduped = Array.from(seen.entries()).map(([scientific_name, url]) => ({
    scientific_name,
    url,
  }));
  logger.info({ original: entries.length, deduped: deduped.length }, "Missouri Plants: after deduplication");

  let upserted = 0;
  const BATCH = 100;
  for (let i = 0; i < deduped.length; i += BATCH) {
    const batch = deduped.slice(i, i + BATCH).map((e) => ({
      site_id: SITE_ID,
      scientific_name: e.scientific_name,
      url: e.url,
      section: "",
    }));
    try {
      await db
        .insert(botanicalSpeciesListsTable)
        .values(batch)
        .onConflictDoUpdate({
          target: [
            botanicalSpeciesListsTable.site_id,
            botanicalSpeciesListsTable.scientific_name,
            botanicalSpeciesListsTable.section,
          ],
          set: {
            url: sql`excluded.url`,
            imported_at: new Date(),
          },
        });
      upserted += batch.length;
    } catch (err) {
      const msg = `Batch insert error at offset ${i}: ${String(err)}`;
      errors.push(msg);
      logger.error({ err }, msg);
    }
  }

  logger.info({ upserted }, "Missouri Plants import complete");
  return { fetched: entries.length, upserted, errors };
}

export async function autoImportMissouriPlantsIfEmpty(): Promise<void> {
  try {
    const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
    if (Number(count) > 0) {
      logger.info({ count }, "Missouri Plants: species list already populated, skipping auto-import");
      return;
    }
    logger.info("Missouri Plants: table empty — triggering auto-import");
    await importMissouriPlants();
  } catch (err) {
    logger.error({ err }, "Missouri Plants auto-import check failed");
  }
}
