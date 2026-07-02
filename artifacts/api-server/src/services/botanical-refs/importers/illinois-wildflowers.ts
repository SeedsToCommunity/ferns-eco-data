/**
 * Illinois Wildflowers importer.
 * Aggregates 8 habitat section indexes and upserts entries into botanical_species_lists.
 *
 * Sections and their index pages:
 *   prairie   → prairie/plant_index.htm     (links under plantx/)
 *   savanna   → savanna/savanna_index.htm
 *   woodland  → woodland/woodland_index.htm  (links under plants/)
 *   wetland   → wetland/wetland_index.htm
 *   weeds     → weeds/weed_index.htm
 *   grasses   → grasses/grass_index.htm
 *   trees     → trees/tree_index.htm
 *   mosses    → mosses/moss_index.html
 *
 * Link text format: "Scientific Name (Common Name)" or just "Scientific Name"
 * Relative hrefs are resolved against the section base URL.
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { logger } from "../../../lib/logger.js";
import { ILLINOIS_WILDFLOWERS_SOURCE_ID } from "../../illinois-wildflowers/metadata.js";

const SITE_BASE = "https://www.illinoiswildflowers.info";
const SITE_ID = ILLINOIS_WILDFLOWERS_SOURCE_ID;

interface SectionConfig {
  name: string;
  indexPath: string;
}

const SECTIONS: SectionConfig[] = [
  { name: "prairie",  indexPath: "prairie/plant_index.htm" },
  { name: "savanna",  indexPath: "savanna/savanna_index.htm" },
  { name: "woodland", indexPath: "woodland/woodland_index.htm" },
  { name: "wetland",  indexPath: "wetland/wetland_index.htm" },
  { name: "weeds",    indexPath: "weeds/weed_index.htm" },
  { name: "grasses",  indexPath: "grasses/grass_index.htm" },
  { name: "trees",    indexPath: "trees/tree_index.htm" },
  { name: "mosses",   indexPath: "mosses/moss_index.html" },
];

interface ParsedEntry {
  scientific_name: string;
  url: string;
  section: string;
}

/**
 * Parse scientific name from link text.
 * Format options:
 *   "Acer rubrum (Red Maple)"  → "Acer rubrum"
 *   "Acer rubrum"              → "Acer rubrum"
 *   HTML entities decoded.
 */
function parseScientificName(text: string): string | null {
  const decoded = text
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
  const withoutCommon = decoded.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (!/^[A-Z][a-z]+\s+[a-z]/.test(withoutCommon)) return null;
  return withoutCommon;
}

/**
 * Resolve a relative href against a section base URL.
 * e.g. sectionBase = "https://www.illinoiswildflowers.info/prairie/"
 *       href = "plantx/btf_milkweedx.htm"
 * → "https://www.illinoiswildflowers.info/prairie/plantx/btf_milkweedx.htm"
 */
function resolveHref(sectionBase: string, href: string): string | null {
  if (!href) return null;
  if (href.startsWith("http://") || href.startsWith("https://")) return href;
  if (href.startsWith("../")) return null; // skip parent navigation
  if (href.startsWith("/")) return SITE_BASE + href;
  return sectionBase + href;
}

async function fetchSectionEntries(section: SectionConfig): Promise<ParsedEntry[]> {
  const indexUrl = `${SITE_BASE}/${section.indexPath}`;
  const sectionDir = section.indexPath.split("/").slice(0, -1).join("/");
  const sectionBase = `${SITE_BASE}/${sectionDir}/`;

  const resp = await fetch(indexUrl, {
    headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} from ${indexUrl}`);
  const html = await resp.text();

  const entries: ParsedEntry[] = [];
  const seen = new Set<string>();

  // Two-pass: first grab the full anchor (allows nested tags), then strip inner tags
  // Pattern handles both <a href="...">Plain text</a>
  // and <a href="..."><span ...>Scientific Name (Common)</span></a>
  const linkPattern = /<a\s+href="([^"#][^"]*\.html?)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(html)) !== null) {
    const href = m[1].trim();
    const innerHtml = m[2];
    if (!href || !innerHtml) continue;
    // Strip all HTML tags and decode basic entities to get plain text
    const text = innerHtml
      .replace(/<[^>]+>/g, "")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const sciName = parseScientificName(text);
    if (!sciName) continue;
    const url = resolveHref(sectionBase, href);
    if (!url) continue;
    const key = `${sciName}||${section.name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    entries.push({ scientific_name: sciName, url, section: section.name });
  }
  return entries;
}

export interface IllinoisWildflowersImportResult {
  sections_fetched: number;
  sections_failed: Array<{ section: string; error: string }>;
  total_entries: number;
  upserted: number;
  errors: string[];
}

export async function importIllinoisWildflowers(): Promise<IllinoisWildflowersImportResult> {
  const result: IllinoisWildflowersImportResult = {
    sections_fetched: 0,
    sections_failed: [],
    total_entries: 0,
    upserted: 0,
    errors: [],
  };

  const allEntries: ParsedEntry[] = [];

  for (const section of SECTIONS) {
    try {
      const entries = await fetchSectionEntries(section);
      logger.info({ section: section.name, count: entries.length }, "Illinois Wildflowers: section fetched");
      allEntries.push(...entries);
      result.sections_fetched++;
    } catch (err) {
      const msg = String(err);
      result.sections_failed.push({ section: section.name, error: msg });
      result.errors.push(`${section.name}: ${msg}`);
      logger.warn({ section: section.name, err }, "Illinois Wildflowers: section fetch failed");
    }
  }

  result.total_entries = allEntries.length;

  const BATCH = 100;
  for (let i = 0; i < allEntries.length; i += BATCH) {
    const batch = allEntries.slice(i, i + BATCH).map((e) => ({
      site_id: SITE_ID,
      scientific_name: e.scientific_name,
      url: e.url,
      section: e.section,
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
      result.upserted += batch.length;
    } catch (err) {
      const msg = `Batch insert error at offset ${i}: ${String(err)}`;
      result.errors.push(msg);
      logger.error({ err }, msg);
    }
  }

  logger.info(result, "Illinois Wildflowers import complete");
  return result;
}

export async function autoImportIllinoisWildflowersIfEmpty(): Promise<void> {
  try {
    const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
    if (Number(count) > 0) {
      logger.info({ count }, "Illinois Wildflowers: species list already populated, skipping auto-import");
      return;
    }
    logger.info("Illinois Wildflowers: table empty — triggering auto-import");
    await importIllinoisWildflowers();
  } catch (err) {
    logger.error({ err }, "Illinois Wildflowers auto-import check failed");
  }
}
