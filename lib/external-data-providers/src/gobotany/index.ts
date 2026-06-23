/**
 * Gobotany Source Interface
 *
 * Handles live external interaction with gobotany.nativeplanttrust.org:
 * URL construction, HTTP existence checks, and species page HTML extraction.
 *
 * Does NOT read or write any database table — all cache reads and writes
 * remain in the REST Adapter layer.
 */

import type { BotanicalUrlResult, BotanicalSpeciesInformation } from "../shared/types.js";

export type { BotanicalUrlResult, BotanicalSpeciesInformation } from "../shared/types.js";

export type GobotanyUrlResult = BotanicalUrlResult;
export type GobotanySpeciesInformation = BotanicalSpeciesInformation;

// ── Constants ─────────────────────────────────────────────────────────────────

const GOBOTANY_BASE = "https://gobotany.nativeplanttrust.org";
const USER_AGENT = "FERNS/1.0 (ecological data aggregator; research use)";

// ── Input parsing ─────────────────────────────────────────────────────────────

/**
 * Returns { genus, species } or null if not a valid binomial.
 * Genus and species epithet must each be one or more ASCII lowercase letters.
 */
function parseSpecies(input: string): { genus: string; species: string } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const genus = parts[0].toLowerCase();
  const species = parts[1].toLowerCase();
  if (!/^[a-z]+$/.test(genus) || !/^[a-z]+$/.test(species)) return null;
  return { genus, species };
}

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
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h: string) => String.fromCharCode(parseInt(h, 16)));
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

// ── Gobotany HTML extractor ───────────────────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Extracts Facts, Habitat, and Characteristics sections from a GoBotany
 * Native Plant Trust species detail page.
 */
function extractGobotany(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  const factsM = html.match(/<h2[^>]*>\s*Facts\s*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (factsM) {
    const t = stripTags(factsM[1]).trim();
    if (t) sections["Facts"] = t;
  }

  const habitatM = html.match(/<h2[^>]*>\s*Habitat\s*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (habitatM) {
    const t = stripTags(habitatM[1]).trim();
    if (t) sections["Habitat"] = t;
  }

  const charM = html.match(
    /<div[^>]*class=["'][^"']*characteristics[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  if (charM) {
    const pairs: string[] = [];
    const dtddPat = /<dt[^>]*>([\s\S]*?)<\/dt>([\s\S]*?)(?=<dt|$)/gi;
    let cm: RegExpExecArray | null;
    while ((cm = dtddPat.exec(charM[1])) !== null) {
      const key = stripTags(cm[1]).trim();
      const ddM = cm[2].match(/<dd[^>]*>([\s\S]*?)<\/dd>/i);
      const val = ddM ? stripTags(ddM[1]).trim() : "";
      if (key) pairs.push(val ? `${key}: ${val}` : key);
    }
    if (pairs.length) sections["Characteristics"] = pairs.join("; ");
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ──────────────────────────────────────────────────

/**
 * Returns the gobotany species page URL for a binomial name.
 *
 * Constructs the canonical gobotany URL for the given species and checks
 * whether the page exists. Returns found: false when the page returns
 * non-200. Returns null when the name cannot be parsed as a valid binomial —
 * the caller should issue a bare 400 before calling this; this method never
 * throws on parse failure.
 *
 * Does NOT read or write any database table.
 */
export async function getGobotanyUrl(
  species: string,
): Promise<GobotanyUrlResult | null> {
  const parsed = parseSpecies(species);
  if (!parsed) return null;

  const { genus, species: epithet } = parsed;
  const url = `${GOBOTANY_BASE}/species/${genus}/${epithet}/`;

  let found = false;
  let httpStatus: number | null = null;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": USER_AGENT },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    httpStatus = resp.status;
    found = resp.status === 200;
  } catch {
    found = false;
    httpStatus = null;
  }

  return { found, url, httpStatus };
}

/**
 * Returns species information from the gobotany species page.
 *
 * Retrieves the full botanical information for a species from gobotany,
 * organized into labeled sections (Facts, Habitat, Characteristics)
 * and as a concatenated full-text string.
 *
 * Does NOT read or write any database table. The caller (REST Adapter) is
 * responsible for cache reads before calling and cache writes after.
 */
export async function getGobotanySpeciesInformation(
  species: string,
): Promise<GobotanySpeciesInformation> {
  const parsed = parseSpecies(species);

  const url = parsed
    ? `${GOBOTANY_BASE}/species/${parsed.genus}/${parsed.species}/`
    : `${GOBOTANY_BASE}/species/`;

  if (!parsed) {
    return {
      found: false,
      url,
      sections: null,
      fullText: null,
      fetchError: "Invalid binomial name",
    };
  }

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
      const extracted = extractGobotany(cleanHtml);
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
