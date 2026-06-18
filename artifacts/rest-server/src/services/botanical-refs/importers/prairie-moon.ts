/**
 * Prairie Moon Nursery importer.
 * Parses prairiemoon.com/sitemap.xml, filters for plant URLs,
 * infers scientific names from URL slugs, and upserts into botanical_species_lists.
 *
 * URL pattern: https://www.prairiemoon.com/{genus}-{species}-{common-name-slug}
 *              https://www.prairiemoon.com/{genus}-{species}-subsp-{subsp}-{common-name-slug}
 *              https://www.prairiemoon.com/{genus}-{species}-var-{var}-{common-name-slug}
 *
 * Scientific name inference:
 *   Parts[0] = genus (capitalize)
 *   Parts[1] = species epithet (lowercase)
 *   Parts[2] = "subsp" or "var" → trinomial with parts[3] as infraspecific epithet
 *   Otherwise → binomial
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { logger } from "../../../lib/logger.js";
import { PRAIRIE_MOON_SOURCE_ID } from "../../prairie-moon/metadata.js";

const SITEMAP_URL = "https://www.prairiemoon.com/sitemap.xml";
const SITE_ID = PRAIRIE_MOON_SOURCE_ID;

const NON_PLANT_SUFFIXES = new Set([
  "html", "plants", "prairie-patch", "plants/potted-plants",
]);

const NON_PLANT_KEYWORDS = [
  "login", "cart", "contact", "shipping", "privacy", "job", "gift",
  "catalog", "price-list", "sitemap", "customer", "checkout",
  "testimonial", "why-natives", "directions", "cancellation", "return",
  "guarantee", "meet-prairie-moon", "faqs", "about", "newsletter",
  "inoculum", "components", "mix-and-match", "tray",
];

interface ParsedEntry {
  scientific_name: string;
  url: string;
}

/**
 * Infer scientific name from a Prairie Moon URL slug.
 * Returns null if the slug doesn't look like a plant URL.
 */
function inferScientificName(slug: string): string | null {
  const clean = slug.replace(/\.html?$/, "");
  const parts = clean.split("-");

  if (parts.length < 2) return null;
  if (!/^[a-z]/.test(parts[0])) return null;
  if (!/^[a-z]/.test(parts[1])) return null;
  if (parts[1].length < 3) return null;

  const genus = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  const species = parts[1];

  if (parts.length > 2 && (parts[2] === "subsp" || parts[2] === "ssp") && parts[3]) {
    return `${genus} ${species} subsp. ${parts[3]}`;
  }
  if (parts.length > 2 && parts[2] === "var" && parts[3]) {
    return `${genus} ${species} var. ${parts[3]}`;
  }
  if (parts.length > 2 && parts[2] === "f" && parts[3]) {
    return `${genus} ${species} f. ${parts[3]}`;
  }

  return `${genus} ${species}`;
}

function parseSitemap(xml: string): ParsedEntry[] {
  const entries: ParsedEntry[] = [];
  const seen = new Set<string>();
  const locPattern = /<loc>(https:\/\/www\.prairiemoon\.com\/([^<]*))<\/loc>/g;
  let m: RegExpExecArray | null;

  while ((m = locPattern.exec(xml)) !== null) {
    const url = m[1].trim();
    const path = m[2].trim();

    if (path === "" || path.includes("/")) continue;
    if (NON_PLANT_KEYWORDS.some((kw) => path.includes(kw))) continue;
    if (NON_PLANT_SUFFIXES.has(path)) continue;
    if (!path.includes("-")) continue;

    const sciName = inferScientificName(path);
    if (!sciName) continue;

    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({ scientific_name: sciName, url });
  }

  return entries;
}

export interface PrairieMoonImportResult {
  sitemap_urls: number;
  plant_urls: number;
  upserted: number;
  errors: string[];
}

export async function importPrairieMoon(): Promise<PrairieMoonImportResult> {
  const errors: string[] = [];

  logger.info({ url: SITEMAP_URL }, "Fetching Prairie Moon sitemap");
  let xml: string;
  try {
    const resp = await fetch(SITEMAP_URL, {
      headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} from ${SITEMAP_URL}`);
    xml = await resp.text();
  } catch (err) {
    const msg = `Failed to fetch Prairie Moon sitemap: ${String(err)}`;
    errors.push(msg);
    logger.error({ err }, msg);
    return { sitemap_urls: 0, plant_urls: 0, upserted: 0, errors };
  }

  const locCount = (xml.match(/<loc>/g) ?? []).length;
  const entries = parseSitemap(xml);
  logger.info({ sitemap_urls: locCount, plant_urls: entries.length }, "Prairie Moon: parsed plant entries");

  // Deduplicate by scientific_name — keep last URL (canonical slug preferred over numeric ID URLs)
  // The sitemap contains both slug-format and numeric-ID-format URLs for the same species
  const seenNames = new Map<string, string>();
  for (const e of entries) {
    const existing = seenNames.get(e.scientific_name);
    // Prefer slug-format URLs (no numeric segment) over numeric-ID URLs
    if (!existing || /\d+\.html?$/.test(existing)) {
      seenNames.set(e.scientific_name, e.url);
    }
  }
  const deduped = Array.from(seenNames.entries()).map(([scientific_name, url]) => ({
    scientific_name,
    url,
  }));
  logger.info({ original: entries.length, deduped: deduped.length }, "Prairie Moon: after deduplication");

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

  logger.info({ upserted }, "Prairie Moon import complete");
  return { sitemap_urls: locCount, plant_urls: entries.length, upserted, errors };
}

export async function autoImportPrairieMoonIfEmpty(): Promise<void> {
  try {
    const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
    if (Number(count) > 0) {
      logger.info({ count }, "Prairie Moon: species list already populated, skipping auto-import");
      return;
    }
    logger.info("Prairie Moon: table empty — triggering auto-import");
    await importPrairieMoon();
  } catch (err) {
    logger.error({ err }, "Prairie Moon auto-import check failed");
  }
}
