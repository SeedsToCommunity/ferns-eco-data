/**
 * Lady Bird Johnson Wildflower Center Source Interface
 *
 * Handles live external interaction with wildflower.org:
 * URL construction, HTTP existence checks (redirect:manual), and species
 * page HTML extraction.
 *
 * Does NOT read or write any database table — all cache reads and writes
 * remain in the REST Adapter layer.
 *
 * Input param is usda_symbol, not a species binomial.
 * URL: https://www.wildflower.org/plants/result.php?id_plant={SYMBOL}
 * Existence check: redirect:manual — 200=found; 3xx=not_found; 5xx=unverified.
 */

import type { BotanicalSpeciesInformation } from "../shared/types.js";

export type { BotanicalSpeciesInformation } from "../shared/types.js";

// ── Constants ──────────────────────────────────────────────────────────────────

const LBJ_PROFILE_BASE = "https://www.wildflower.org/plants/result.php";
const LBJ_BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Three-state model for LBJ URL existence check. */
export type LadyBirdJohnsonStatus = "found" | "not_found" | "unverified";

/**
 * The LBJ profile URL for a USDA symbol, plus existence status.
 * profileUrl is set only when the EDP confirmed a page exists (status=found).
 * null means no valid URL exists for this input (not_found or unverified).
 * The REST Adapter does NOT cache unverified results.
 */
export interface LadyBirdJohnsonUrlResult {
  found: boolean;
  profileUrl: string | null;
  status: LadyBirdJohnsonStatus;
  httpStatus: number | null; // null on network failure
}

/** Species information retrieved from an LBJ profile page. */
export type LadyBirdJohnsonSpeciesInformation = BotanicalSpeciesInformation;

// ── URL helper ────────────────────────────────────────────────────────────────

function buildLbjProfileUrl(usdaSymbol: string): string {
  return `${LBJ_PROFILE_BASE}?id_plant=${encodeURIComponent(usdaSymbol)}`;
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

// ── LBJ HTML extractor ────────────────────────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Lady Bird Johnson Wildflower Center — h3-delimited prose sections from the
 * species profile page at result.php?id_plant={SYMBOL}.
 * Skips "Find Seeds or Plants" and "Mr. Smarty Plants says".
 */
function extractLadyBirdJohnson(html: string): PageTextResult {
  const sections: Record<string, string> = {};
  const SKIP = new Set(["Find Seeds or Plants", "Mr. Smarty Plants says"]);

  const h3Pat = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = h3Pat.exec(html)) !== null) {
    const label = stripTags(m[1]).trim();
    if (!label || SKIP.has(label)) continue;
    const block = m[2];
    const paras: string[] = [];

    const pPat = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pPat.exec(block)) !== null) {
      const t = stripTags(pm[1]).trim();
      if (t) paras.push(t);
    }

    if (!paras.length) {
      const tdPat = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let tm: RegExpExecArray | null;
      while ((tm = tdPat.exec(block)) !== null) {
        const t = stripTags(tm[1]).trim();
        if (t && t.length > 2) paras.push(t);
      }
    }

    if (!paras.length) {
      const t = stripTags(block).trim();
      if (t) paras.push(t);
    }

    const text = paras.join("\n\n").trim();
    if (text) sections[label] = text;
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ───────────────────────────────────────────────────

/**
 * Returns the Lady Bird Johnson Wildflower Center profile URL for a
 * USDA Plants symbol.
 *
 * Checks whether a species profile exists on the LBJ site for the given
 * symbol. Uses redirect:manual: 200 = found; 3xx = not_found;
 * 5xx or timeout = unverified (result not cached by the REST Adapter).
 *
 * - `usdaSymbol`: normalized to uppercase internally
 * - Does NOT read or write any database table
 * - Never throws
 */
export async function getLadyBirdJohnsonUrl(
  usdaSymbol: string,
): Promise<LadyBirdJohnsonUrlResult> {
  const usdaSymbolUpper = usdaSymbol.toUpperCase();
  const profileUrl = buildLbjProfileUrl(usdaSymbolUpper);

  let status: LadyBirdJohnsonStatus = "unverified";
  let httpStatus: number | null = null;

  try {
    const resp = await fetch(profileUrl, {
      method: "GET",
      headers: { "User-Agent": LBJ_BROWSER_UA },
      redirect: "manual",
      signal: AbortSignal.timeout(10000),
    });
    httpStatus = resp.status;

    if (resp.status === 200) {
      status = "found";
    } else if (resp.status >= 300 && resp.status < 500) {
      status = "not_found";
    } else if (resp.status >= 500) {
      status = "unverified";
    }
  } catch {
    status = "unverified";
  }

  return {
    found: status === "found",
    profileUrl: status === "found" ? profileUrl : null,
    status,
    httpStatus,
  };
}

/**
 * Returns species information from the Lady Bird Johnson Wildflower Center
 * profile page for a given USDA Plants symbol.
 *
 * Constructs the canonical LBJ profile URL internally and retrieves the
 * botanical prose, extracted into labeled sections and as full text.
 * Uses redirect:manual; returns found: false when the page redirects
 * (not found) or fails.
 *
 * - `usdaSymbol`: USDA Plants symbol (e.g. "TRGI"); normalized to uppercase internally
 * - Does NOT read or write any database table
 * - Never throws
 */
export async function getLadyBirdJohnsonSpeciesInformation(
  usdaSymbol: string,
): Promise<LadyBirdJohnsonSpeciesInformation> {
  const profileUrl = buildLbjProfileUrl(usdaSymbol.toUpperCase());
  try {
    const resp = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "User-Agent": LBJ_BROWSER_UA,
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });

    if (resp.status === 200) {
      const html = await resp.text();
      const cleanHtml = removeNoiseBlocks(html);
      const extracted = extractLadyBirdJohnson(cleanHtml);
      const sections = Object.keys(extracted.sections).length ? extracted.sections : null;
      const fullText = extracted.fullText || null;
      return { found: true, url: profileUrl, sections, fullText, fetchError: null };
    }

    if (resp.status >= 300 && resp.status < 500) {
      return { found: false, url: profileUrl, sections: null, fullText: null, fetchError: null };
    }

    return {
      found: false,
      url: profileUrl,
      sections: null,
      fullText: null,
      fetchError: `HTTP ${resp.status}`,
    };
  } catch (err) {
    return {
      found: false,
      url: profileUrl,
      sections: null,
      fullText: null,
      fetchError: String(err),
    };
  }
}
