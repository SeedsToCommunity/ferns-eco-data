/**
 * Illinois Wildflowers Source Interface
 *
 * URL lookup: reads botanicalSpeciesListsTable (internal FERNS data).
 * Species information: HTTP fetch + HTML extraction from illinoiswildflowers.info.
 *
 * A species can appear in multiple habitat sections (prairie, savanna,
 * woodland, etc.); getIllinoisWildflowersUrl returns all matching rows ordered
 * by section, while getIllinoisWildflowersSpeciesInformation uses the first
 * URL found.
 *
 * Does NOT read or write the species page text cache — all cache reads
 * and writes remain in the REST Adapter layer.
 */

import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import type {
  BotanicalSpeciesInformation,
  IllinoisWildflowersUrlResult,
} from "../shared/types.js";

export type {
  BotanicalSpeciesInformation,
  IllinoisWildflowersUrlResult,
} from "../shared/types.js";

/** Species information retrieved from an Illinois Wildflowers species page. */
export type IllinoisWildflowersSpeciesInformation = BotanicalSpeciesInformation;

// ── Constants ─────────────────────────────────────────────────────────────────

const SITE_ID = "illinois-wildflowers";
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

// ── Illinois Wildflowers HTML extractor ──────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Illinois Wildflowers — sections delimited by green-font bold labels inside
 * the <blockquote> content container. Pages use ISO-8859-1; charset is handled
 * by the fetch helper. Skips "Photographic Location" (camera/copyright text).
 */
function extractIllinoisWildflowers(html: string): PageTextResult {
  const sections: Record<string, string> = {};
  const SKIP = new Set(["Photographic Location"]);

  const bqMatch = html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
  const scope = bqMatch ? bqMatch[1] : html;

  const labelPat =
    /<b>\s*<font[^>]*color=["']?#33cc33["']?[^>]*>\s*([^<:]+):?\s*<\/font>\s*<\/b>([\s\S]*?)(?=<b>\s*<font[^>]*color=["']?#33cc33["']?|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = labelPat.exec(scope)) !== null) {
    const label = m[1].trim();
    if (SKIP.has(label)) continue;
    const text = stripTags(m[2]).trim();
    if (text) sections[label] = text;
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ──────────────────────────────────────────────────

/**
 * Returns the Illinois Wildflowers species page URL(s) for a scientific name.
 *
 * Reads botanicalSpeciesListsTable using a case-insensitive match. A species
 * can appear in more than one habitat section; all matching rows are returned,
 * ordered by section name. Returns found: false with an empty results array
 * when the species is not in the imported list.
 *
 * Does NOT make any live HTTP request.
 */
export async function getIllinoisWildflowersUrl(
  species: string,
): Promise<IllinoisWildflowersUrlResult> {
  const rows = await db
    .select()
    .from(botanicalSpeciesListsTable)
    .where(
      and(
        eq(botanicalSpeciesListsTable.site_id, SITE_ID),
        ilike(botanicalSpeciesListsTable.scientific_name, species.trim()),
      ),
    )
    .orderBy(botanicalSpeciesListsTable.section);

  if (rows.length === 0) {
    return { found: false, results: [] };
  }

  return {
    found: true,
    results: rows.map((r) => ({
      scientificName: r.scientific_name,
      url: r.url,
      section: r.section,
      importedAt: r.imported_at,
    })),
  };
}

/**
 * Returns species information from an Illinois Wildflowers species page.
 *
 * Looks up the species URL from botanicalSpeciesListsTable, then fetches
 * and extracts the botanical text from that page, organized into labeled
 * sections and as full text. When a species appears in multiple sections
 * the first URL (ordered by section) is used.
 *
 * Returns found: false with fetchError: null when the species is not in
 * the imported list (no live request is made in that case).
 *
 * Does NOT read or write the species page text cache — that remains in
 * the REST Adapter layer.
 */
export async function getIllinoisWildflowersSpeciesInformation(
  species: string,
): Promise<IllinoisWildflowersSpeciesInformation> {
  const urlResult = await getIllinoisWildflowersUrl(species);

  if (!urlResult.found || urlResult.results.length === 0) {
    return { found: false, url: null, sections: null, fullText: null, fetchError: null };
  }

  const url = urlResult.results[0].url;

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
      const contentType = resp.headers.get("content-type") ?? "";
      const charsetMatch = /charset=([^\s;]+)/i.exec(contentType);
      const charset = charsetMatch?.[1]?.toLowerCase() ?? "utf-8";
      const buf = await resp.arrayBuffer();
      const html = new TextDecoder(
        charset === "iso-8859-1" || charset === "latin1" ? "iso-8859-1" : "utf-8",
      ).decode(buf);

      const cleanHtml = removeNoiseBlocks(html);
      const extracted = extractIllinoisWildflowers(cleanHtml);
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
