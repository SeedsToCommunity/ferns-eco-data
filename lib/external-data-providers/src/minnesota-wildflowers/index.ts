/**
 * Minnesota Wildflowers Source Interface
 *
 * URL lookup: reads botanicalSpeciesListsTable (internal FERNS data).
 * Species information: HTTP fetch + HTML extraction from minnesotawildflowers.info.
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

/** Species information retrieved from a Minnesota Wildflowers species page. */
export type MinnesotaWildflowersSpeciesInformation = BotanicalSpeciesInformation;

/** URL lookup result for a Minnesota Wildflowers species. */
export type MinnesotaWildflowersUrlResult = BotanicalSpeciesListResult;

// ── Constants ─────────────────────────────────────────────────────────────────

const SITE_ID = "minnesota-wildflowers";
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

// ── Minnesota Wildflowers HTML extractor ─────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Minnesota Wildflowers — quick-facts table inside <article id="content">
 * and h4-delimited prose sections within the same article container.
 */
function extractMinnesotaWildflowers(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  const articleMatch = html.match(/<article[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/article>/i);
  const scope = articleMatch ? articleMatch[1] : html;

  const rowPat =
    /<th[^>]*scope=["']row["'][^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowPat.exec(scope)) !== null) {
    const label = stripTags(m[1]).trim();
    const val = stripTags(m[2]).trim();
    if (label && val) sections[label] = val;
  }

  const h4Pat =
    /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|<\/article|$)/gi;
  while ((m = h4Pat.exec(scope)) !== null) {
    const label = stripTags(m[1]).trim();
    if (!label) continue;
    const block = m[2];
    const paras: string[] = [];
    const pPat = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pPat.exec(block)) !== null) {
      const t = stripTags(pm[1]).trim();
      if (t) paras.push(t);
    }
    if (paras.length) sections[label] = paras.join("\n\n");
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ──────────────────────────────────────────────────

/**
 * Returns the Minnesota Wildflowers species page URL for a scientific name.
 *
 * Reads botanicalSpeciesListsTable using a case-insensitive match.
 * Returns found: false when the species is not in the imported list.
 *
 * Does NOT make any live HTTP request.
 */
export async function getMinnesotaWildflowersUrl(
  species: string,
): Promise<MinnesotaWildflowersUrlResult> {
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
 * Returns species information from a Minnesota Wildflowers species page.
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
export async function getMinnesotaWildflowersSpeciesInformation(
  species: string,
): Promise<MinnesotaWildflowersSpeciesInformation> {
  const urlResult = await getMinnesotaWildflowersUrl(species);

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
      const extracted = extractMinnesotaWildflowers(cleanHtml);
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
