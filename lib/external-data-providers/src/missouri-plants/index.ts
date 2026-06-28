/**
 * Missouri Plants Source Interface
 *
 * URL lookup: reads botanicalSpeciesListsTable (internal FERNS data).
 * Species information: HTTP fetch + HTML extraction from missouriplants.com.
 *
 * Does NOT read or write the species page text cache — all cache reads
 * and writes remain in the REST Adapter layer.
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import type {
  BotanicalSpeciesInformation,
  BotanicalSpeciesListResult,
} from "../shared/types.js";

export type {
  BotanicalSpeciesInformation,
  BotanicalSpeciesListResult,
} from "../shared/types.js";

/** Species information retrieved from a Missouri Plants species page. */
export type MissouriPlantsSpeciesInformation = BotanicalSpeciesInformation;

/** URL lookup result for a Missouri Plants species. */
export type MissouriPlantsUrlResult = BotanicalSpeciesListResult;

// ── Constants ─────────────────────────────────────────────────────────────────

const SITE_ID = "missouri-plants";
const USER_AGENT =
  "EcologicalCommons/1.0 (research aggregator; ecologicalcommons.org)";

// ── HTML utilities ────────────────────────────────────────────────────────────

function decodeEntities(html: string): string {
  return html
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&ldquo;/g, "\u201c")
    .replace(/&rdquo;/g, "\u201d")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "\u2013")
    .replace(/&mdash;/g, "\u2014")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) =>
      String.fromCharCode(parseInt(h, 16)),
    );
}

function removeNoiseBlocks(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<img[^>]*>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

// ── Missouri Plants HTML extractor ────────────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Missouri Plants — norm-class <p> paragraphs with optional bold label prefix,
 * plus the structured <div class="stats"> block (CC/CW/MOC values).
 */
function extractMissouriPlants(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  const normPat = /<p[^>]*class=["']norm["'][^>]*>([\s\S]*?)<\/p>/gi;
  let m: RegExpExecArray | null;
  while ((m = normPat.exec(html)) !== null) {
    const raw = m[1];
    const labelMatch = raw.match(/^\s*<b[^>]*>([\s\S]*?)<\/b>/i);
    if (labelMatch) {
      const label = stripTags(labelMatch[1]).replace(/:$/, "").trim();
      const rest = raw.slice(labelMatch[0].length);
      const text = stripTags(rest).trim();
      if (label && text) sections[label] = text;
    } else {
      const text = stripTags(raw).trim();
      if (text) {
        sections["Description"] = sections["Description"]
          ? sections["Description"] + "\n\n" + text
          : text;
      }
    }
  }

  const statsMatch = html.match(/<div[^>]*class=["']stats["'][^>]*>([\s\S]*?)<\/div>/i);
  if (statsMatch) {
    const statPat = /<b[^>]*>([\s\S]*?)<\/b>\s*:?\s*([^<]+)/gi;
    const statPairs: string[] = [];
    let sm: RegExpExecArray | null;
    while ((sm = statPat.exec(statsMatch[1])) !== null) {
      const key = stripTags(sm[1]).replace(/:$/, "").trim();
      const val = sm[2].trim();
      if (key && val) statPairs.push(`${key}: ${val}`);
    }
    if (statPairs.length) sections["Stats"] = statPairs.join("; ");
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ──────────────────────────────────────────────────

/**
 * Returns the Missouri Plants species page URL for a scientific name.
 *
 * Reads botanicalSpeciesListsTable using a case-insensitive match.
 * Returns found: false when the species is not in the imported list.
 *
 * Does NOT make any live HTTP request.
 */
export async function getMissouriPlantsUrl(
  species: string,
): Promise<MissouriPlantsUrlResult> {
  const rows = await db
    .select()
    .from(botanicalSpeciesListsTable)
    .where(
      and(
        eq(botanicalSpeciesListsTable.site_id, SITE_ID),
        ilike(botanicalSpeciesListsTable.scientific_name, species.trim()),
      ),
    )
    .limit(1);

  if (rows.length === 0) {
    return { found: false, scientificName: null, url: null, section: "", importedAt: null };
  }

  const r = rows[0];
  return {
    found: true,
    scientificName: r.scientific_name,
    url: r.url,
    section: r.section,
    importedAt: r.imported_at,
  };
}

/**
 * Returns species information from a Missouri Plants species page.
 *
 * Looks up the species URL from botanicalSpeciesListsTable, then fetches
 * and extracts the botanical text from that page, organized into labeled
 * sections and as full text.
 *
 * Returns found: false with url: null when the species is not in the
 * imported list (no live request is made in that case).
 *
 * Does NOT read or write the species page text cache — that remains in
 * the REST Adapter layer.
 */
export async function getMissouriPlantsSpeciesInformation(
  species: string,
): Promise<MissouriPlantsSpeciesInformation> {
  const urlResult = await getMissouriPlantsUrl(species);

  if (!urlResult.found || !urlResult.url) {
    return { found: false, url: null, sections: null, fullText: null, fetchError: null };
  }

  const url = urlResult.url;

  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });

    if (resp.ok) {
      const html = await resp.text();
      const cleanHtml = removeNoiseBlocks(html);
      const extracted = extractMissouriPlants(cleanHtml);
      const sections = Object.keys(extracted.sections).length ? extracted.sections : null;
      const fullText = extracted.fullText || null;
      return { found: true, url, sections, fullText, fetchError: null };
    }

    if (resp.status === 404) {
      return { found: false, url, sections: null, fullText: null, fetchError: null };
    }

    return {
      found: false,
      url,
      sections: null,
      fullText: null,
      fetchError: `HTTP ${resp.status}`,
    };
  } catch (err) {
    return {
      found: false,
      url,
      sections: null,
      fullText: null,
      fetchError: String(err),
    };
  }
}
