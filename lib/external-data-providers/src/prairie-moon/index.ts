/**
 * Prairie Moon Nursery Source Interface
 *
 * URL lookup: reads botanicalSpeciesListsTable (internal FERNS data).
 * Species information: HTTP fetch + HTML extraction from prairiemoon.com,
 * excluding commercial metadata (pricing, availability, SKU, etc.).
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

/** Species information retrieved from a Prairie Moon Nursery species page. */
export type PrairieMoonSpeciesInformation = BotanicalSpeciesInformation;

/** URL lookup result for a Prairie Moon Nursery species. */
export type PrairieMoonUrlResult = BotanicalSpeciesListResult;

// ── Constants ─────────────────────────────────────────────────────────────────

const SITE_ID = "prairie-moon";
const USER_AGENT =
  "EcologicalCommons/1.0 (research aggregator; ecologicalcommons.org)";

// Keys that are commercial/catalog metadata, not ecological information.
// Excluded from Prairie Moon species text output.
const PRAIRIE_MOON_COMMERCE_KEYS = new Set([
  "Seeds/Packet",
  "Seeds/Ounce",
  "Price per Packet",
  "Price/Packet",
  "Price/lb",
  "Price/oz",
  "Availability",
  "SKU",
  "Item #",
  "Item Number",
  "Catalog Code",
  "Plug Size",
  "Plug Tray Size",
  "Plant Size",
  "Ship As",
  "Shipping",
  "Stock",
  "Add to Cart",
  "Quantity",
]);

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

// ── Prairie Moon HTML extractor ───────────────────────────────────────────────

interface PageTextResult {
  sections: Record<string, string>;
  fullText: string;
}

/**
 * Prairie Moon Nursery — product description prose and structured growing
 * details. Commerce fields (price, availability, SKU, etc.) are excluded.
 *
 * Current site design (2024+):
 *   - Description lives in a tabcordion panel with id="panel-descrip". Content
 *     is in nested <div> elements, not <p> tags. A shipping table may appear
 *     after the prose; it is stripped before extraction.
 *   - Growing details are individual <div class="g-product-details__item">
 *     blocks each containing a <dt class="g-product-details__item-term"> and
 *     <dd class="g-product-details__item-description[...]">. There is no
 *     enclosing <dl> in the inline layout.
 *
 * Older site design (kept as fallback):
 *   - Description in class="product-description" / "g-product-description" div
 *     with <p> tag content.
 *   - Details in <dl> inside class="g-product-details" / "product-details" div.
 */
function extractPrairieMoon(html: string): PageTextResult {
  const sections: Record<string, string> = {};

  // ── Description ─────────────────────────────────────────────────────────────
  const panelDescStart = html.indexOf('id="panel-descrip"');
  if (panelDescStart >= 0) {
    const tagEnd = html.indexOf('>', panelDescStart);
    const contentStart = tagEnd >= 0 ? tagEnd + 1 : panelDescStart + 18;
    const nextPanelRel = html.slice(contentStart).search(/<[^>]+id="panel-[^"]+"/);
    const panelContent = html.slice(
      contentStart,
      nextPanelRel >= 0 ? contentStart + nextPanelRel : undefined,
    );
    const cleanPanel = panelContent
      .replace(/<button[\s\S]*?<\/button>/gi, " ")
      .replace(/<table[\s\S]*?<\/table>/gi, " ");
    const panelText = stripTags(cleanPanel).trim();
    if (panelText) sections["Description"] = panelText;
  } else {
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
  }

  // ── Growing details ──────────────────────────────────────────────────────────
  const itemTermPat =
    /<dt[^>]*class=["'][^"']*g-product-details__item-term[^"']*["'][^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*class=["'][^"']*g-product-details__item-description[^"']*["'][^>]*>([\s\S]*?)<\/dd>/gi;
  let im: RegExpExecArray | null;
  let itemsFound = false;
  while ((im = itemTermPat.exec(html)) !== null) {
    const key = stripTags(im[1]).replace(/:$/, "").trim();
    const val = stripTags(im[2]).trim();
    if (key && val && !PRAIRIE_MOON_COMMERCE_KEYS.has(key)) {
      sections[key] = val;
      itemsFound = true;
    }
  }

  if (!itemsFound) {
    const detailsContainerM = html.match(
      /<div[^>]*class=["'][^"']*(?:g-product-details|product[_-]?details)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
    );
    const detailsScope = detailsContainerM ? detailsContainerM[1] : html;
    const dlPat = /<dl[^>]*>([\s\S]*?)<\/dl>/gi;
    let dlM: RegExpExecArray | null;
    while ((dlM = dlPat.exec(detailsScope)) !== null) {
      const dtddPat = /<dt[^>]*>([\s\S]*?)<\/dt>\s*<dd[^>]*>([\s\S]*?)<\/dd>/gi;
      let dm: RegExpExecArray | null;
      while ((dm = dtddPat.exec(dlM[1])) !== null) {
        const key = stripTags(dm[1]).replace(/:$/, "").trim();
        const val = stripTags(dm[2]).trim();
        if (key && val && !PRAIRIE_MOON_COMMERCE_KEYS.has(key)) {
          sections[key] = val;
        }
      }
    }
  }

  const fullText = Object.entries(sections)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n\n");
  return { sections, fullText };
}

// ── Source Interface methods ──────────────────────────────────────────────────

/**
 * Returns the Prairie Moon Nursery species page URL for a scientific name.
 *
 * Reads botanicalSpeciesListsTable using a case-insensitive match.
 * Returns found: false when the species is not in the imported list.
 *
 * Does NOT make any live HTTP request.
 */
export async function getPrairieMoonUrl(
  species: string,
): Promise<PrairieMoonUrlResult> {
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
 * Returns species information from a Prairie Moon Nursery species page.
 *
 * Looks up the species URL from botanicalSpeciesListsTable, then fetches
 * and extracts the botanical text from that page, organized into labeled
 * sections and as full text. Commercial metadata (price, availability, SKU,
 * etc.) is excluded from the output.
 *
 * Returns found: false with url: null when the species is not in the
 * imported list (no live request is made in that case).
 *
 * Does NOT read or write the species page text cache — that remains in
 * the REST Adapter layer.
 */
export async function getPrairieMoonSpeciesInformation(
  species: string,
): Promise<PrairieMoonSpeciesInformation> {
  const urlResult = await getPrairieMoonUrl(species);

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
      const extracted = extractPrairieMoon(cleanHtml);
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
