/**
 * Minnesota Wildflowers importer.
 * Parses minnesotawildflowers.info/page/plants-by-name and upserts entries
 * into the botanical_species_lists table.
 *
 * Link format: <a href="/category/common-name-slug">Scientific Name</a>
 * URL pattern: https://www.minnesotawildflowers.info/{category}/{common-name-slug}
 * where category is flower, tree, grass-sedge-rush, fern, shrub, vine, etc.
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../../lib/logger.js";
import { MINNESOTA_WILDFLOWERS_SOURCE_ID } from "../../minnesota-wildflowers/metadata.js";

const LIST_URL = "https://www.minnesotawildflowers.info/page/plants-by-name";
const BASE_URL = "https://www.minnesotawildflowers.info";
const SITE_ID = MINNESOTA_WILDFLOWERS_SOURCE_ID;

const KNOWN_CATEGORIES = new Set([
  "flower", "tree", "shrub", "fern", "grass-sedge-rush", "vine",
  "aquatic", "cactus", "clubmoss", "horsetail",
]);

interface ParsedEntry {
  scientific_name: string;
  url: string;
}

function parseSpeciesList(html: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const seen = new Set<string>();

  const linkPattern = /<a\s+href="\/([^"/]+)\/([^"]+)"[^>]*>([A-Z][^<]+)<\/a>/g;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(html)) !== null) {
    const category = m[1];
    const slug = m[2];
    const text = m[3].trim();

    if (!KNOWN_CATEGORIES.has(category)) continue;
    if (!text || !/^[A-Z][a-z]+\s+[a-z]/.test(text)) continue;

    const url = `${BASE_URL}/${category}/${slug}`;
    const key = `${text}||${url}`;
    if (seen.has(key)) continue;
    seen.add(key);

    entries.push({ scientific_name: text, url });
  }
  return entries;
}

export interface MinnesotaWildflowersImportResult {
  fetched: number;
  upserted: number;
  errors: string[];
}

export async function importMinnesotaWildflowers(): Promise<MinnesotaWildflowersImportResult> {
  const errors: string[] = [];

  logger.info({ url: LIST_URL }, "Fetching Minnesota Wildflowers species list");
  let html: string;
  try {
    const resp = await fetch(LIST_URL, {
      headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} from ${LIST_URL}`);
    html = await resp.text();
  } catch (err) {
    const msg = `Failed to fetch Minnesota Wildflowers list: ${String(err)}`;
    errors.push(msg);
    logger.error({ err }, msg);
    return { fetched: 0, upserted: 0, errors };
  }

  const entries = parseSpeciesList(html);
  logger.info({ count: entries.length }, "Minnesota Wildflowers: parsed species entries");

  let upserted = 0;
  const BATCH = 100;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH).map((e) => ({
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

  logger.info({ upserted }, "Minnesota Wildflowers import complete");
  return { fetched: entries.length, upserted, errors };
}

export async function autoImportMinnesotaWildflowersIfEmpty(): Promise<void> {
  try {
    const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
    if (Number(count) > 0) {
      logger.info({ count }, "Minnesota Wildflowers: species list already populated, skipping auto-import");
      return;
    }
    logger.info("Minnesota Wildflowers: table empty — triggering auto-import");
    await importMinnesotaWildflowers();
  } catch (err) {
    logger.error({ err }, "Minnesota Wildflowers auto-import check failed");
  }
}
