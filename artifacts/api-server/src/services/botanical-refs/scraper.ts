/**
 * Shared scraper for botanical reference species page text.
 *
 * Fetches each species page HTML, runs a site-specific extractor to pull
 * labeled prose sections, then stores the result in species_page_text_cache.
 * Cache is permanent (no TTL); use ?refresh=true to re-scrape.
 */

import { db, speciesPageTextCacheTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";

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
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

// ── Per-site extractors ───────────────────────────────────────────────────────

export interface PageTextResult {
  sections: Record<string, string>;
  full_text: string;
}

/**
 * Illinois Wildflowers — sections delimited by green-font bold labels.
 * Pages are ISO-8859-1; charset is handled by the fetch helper below.
 * Skips "Photographic Location" (camera/copyright text only).
 */
function extractIllinoisWildflowers(html: string): PageTextResult {
  const sections: Record<string, string> = {};
  const SKIP = new Set(["Photographic Location"]);

  // <b><font color="#33cc33">Label:</font></b> ... text ... (until next such label)
  const labelPat =
    /<b>\s*<font[^>]*color=["']?#33cc33["']?[^>]*>\s*([^<:]+):?\s*<\/font>\s*<\/b>([\s\S]*?)(?=<b>\s*<font[^>]*color=["']?#33cc33["']?|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = labelPat.exec(html)) !== null) {
    const label = m[1].trim();
    if (SKIP.has(label)) continue;
    const text = stripTags(m[2]).trim();
    if (text) sections[label] = text;
  }

  const full_text = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, full_text };
}

/**
 * Missouri Plants — `<p class="norm">` paragraphs, each optionally led by a `<b>Label</b>`.
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

  const full_text = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, full_text };
}

/**
 * Minnesota Wildflowers — quick-facts table (`<th scope="row">`) plus
 * prose sections under `<h4>` headings inside the article.
 */
function extractMinnesotaWildflowers(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  // Quick facts
  const rowPat =
    /<th[^>]*scope=["']row["'][^>]*>([\s\S]*?)<\/th>\s*<td[^>]*>([\s\S]*?)<\/td>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowPat.exec(html)) !== null) {
    const label = stripTags(m[1]).trim();
    const val = stripTags(m[2]).trim();
    if (label && val) sections[label] = val;
  }

  // Prose sections under <h4> headings
  const h4Pat =
    /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|<\/article|$)/gi;
  while ((m = h4Pat.exec(html)) !== null) {
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

  const full_text = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, full_text };
}

/**
 * GoBotany — pulls Facts, Habitat, and Characteristics sections from the
 * Native Plant Trust species detail page.
 */
function extractGobotany(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  // Facts
  const factsM = html.match(/<h2[^>]*>\s*Facts\s*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (factsM) {
    const t = stripTags(factsM[1]).trim();
    if (t) sections["Facts"] = t;
  }

  // Habitat
  const habitatM = html.match(/<h2[^>]*>\s*Habitat\s*<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (habitatM) {
    const t = stripTags(habitatM[1]).trim();
    if (t) sections["Habitat"] = t;
  }

  // Characteristics dl/dt/dd block
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

  const full_text = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, full_text };
}

/**
 * Prairie Moon Nursery — product description prose and structured details.
 */
function extractPrairieMoon(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  // Product description block (various class names across site versions)
  const descM = html.match(
    /<div[^>]*class=["'][^"']*(?:product[_-]?description|g-product-description)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  if (descM) {
    const paras: string[] = [];
    const pPat = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pm: RegExpExecArray | null;
    while ((pm = pPat.exec(descM[1])) !== null) {
      const t = stripTags(pm[1]).trim();
      if (t) paras.push(t);
    }
    if (paras.length) sections["Description"] = paras.join("\n\n");
  }

  // Structured details as dl/dt/dd
  const dlPat = /<dl[^>]*>([\s\S]*?)<\/dl>/gi;
  let dlM: RegExpExecArray | null;
  while ((dlM = dlPat.exec(html)) !== null) {
    const dtddPat = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
    let dm: RegExpExecArray | null;
    while ((dm = dtddPat.exec(dlM[1])) !== null) {
      const key = stripTags(dm[1]).replace(/:$/, "").trim();
      const val = stripTags(dm[2]).trim();
      if (key && val) sections[key] = val;
    }
  }

  const full_text = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, full_text };
}

const SITE_EXTRACTORS: Record<string, (html: string) => PageTextResult> = {
  "illinois-wildflowers": extractIllinoisWildflowers,
  "missouri-plants": extractMissouriPlants,
  "minnesota-wildflowers": extractMinnesotaWildflowers,
  gobotany: extractGobotany,
  "prairie-moon": extractPrairieMoon,
};

// ── Cache + fetch orchestration ───────────────────────────────────────────────

export interface SpeciesTextCacheEntry {
  found: boolean;
  url: string | null;
  sections: Record<string, string> | null;
  full_text: string | null;
  scraped_at: Date;
  cache_status: "hit" | "miss" | "not_in_species_list";
}

/**
 * Look up cached species text, or scrape + cache on a miss.
 *
 * @param site_id          Botanical-ref source identifier.
 * @param scientific_name  Normalized cache key (lowercase, trimmed).
 * @param url              Species page URL; null → not in species list.
 * @param refresh          Force re-scrape even when cached.
 */
export async function fetchAndCacheSpeciesText(
  site_id: string,
  scientific_name: string,
  url: string | null,
  refresh = false,
): Promise<SpeciesTextCacheEntry> {
  if (!url) {
    return {
      found: false,
      url: null,
      sections: null,
      full_text: null,
      scraped_at: new Date(),
      cache_status: "not_in_species_list",
    };
  }

  if (!refresh) {
    const cached = await db
      .select()
      .from(speciesPageTextCacheTable)
      .where(
        and(
          eq(speciesPageTextCacheTable.site_id, site_id),
          eq(speciesPageTextCacheTable.scientific_name, scientific_name),
        ),
      )
      .limit(1);

    if (cached.length > 0) {
      const hit = cached[0];
      return {
        found: hit.found,
        url: hit.url,
        sections: hit.sections as Record<string, string> | null,
        full_text: hit.full_text,
        scraped_at: hit.scraped_at,
        cache_status: "hit",
      };
    }
  }

  // Live fetch
  const extractor = SITE_EXTRACTORS[site_id];
  let found = false;
  let sections: Record<string, string> | null = null;
  let full_text: string | null = null;

  try {
    const resp = await fetch(url, {
      headers: {
        "User-Agent":
          "EcologicalCommons/1.0 (research aggregator; ecologicalcommons.org)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    });

    if (resp.ok) {
      // Honour the page's declared charset (Illinois Wildflowers uses ISO-8859-1)
      const contentType = resp.headers.get("content-type") ?? "";
      const charsetMatch = /charset=([^\s;]+)/i.exec(contentType);
      const charset = charsetMatch?.[1]?.toLowerCase() ?? "utf-8";
      const buf = await resp.arrayBuffer();
      const html = new TextDecoder(
        charset === "iso-8859-1" || charset === "latin1" ? "iso-8859-1" : "utf-8",
      ).decode(buf);

      if (extractor) {
        const extracted = extractor(html);
        sections = Object.keys(extracted.sections).length ? extracted.sections : null;
        full_text = extracted.full_text || null;
      } else {
        full_text = stripTags(html).slice(0, 20000) || null;
      }
      found = true;
    }
  } catch {
    found = false;
  }

  await db
    .insert(speciesPageTextCacheTable)
    .values({ site_id, scientific_name, url, found, sections, full_text })
    .onConflictDoUpdate({
      target: [speciesPageTextCacheTable.site_id, speciesPageTextCacheTable.scientific_name],
      set: { url, found, sections, full_text, scraped_at: new Date() },
    });

  return {
    found,
    url,
    sections,
    full_text,
    scraped_at: new Date(),
    cache_status: "miss",
  };
}
