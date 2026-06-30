#!/usr/bin/env node
/**
 * MNFI scraper — manually invoked authoring tool.
 * DO NOT import this file from application code.
 * DO NOT wire into any build target or startup sequence.
 *
 * Run with:
 *   pnpm --filter @workspace/internal-data-providers exec tsx src/mnfi/scraper/index.ts
 *
 * Fetches all five MNFI data sources and writes TypeScript data files to
 * lib/internal-data-providers/src/mnfi/data/
 */

import { writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

const BASE = "https://mnfi.anr.msu.edu";
const RATE_LIMIT_COMMUNITY_MS = 400;
const RATE_LIMIT_COUNTY_MS = 250;

// ── Shared types ──────────────────────────────────────────────────────────────

interface CommunityStub {
  communityId: number;
  slug: string;
  name: string;
  communityClass: string;
  communityGroup: string;
  globalRank: string | null;
  stateRank: string | null;
}

interface CommunitySection {
  sectionName: string;
  text: string;
  sortOrder: number;
}

interface CharacteristicPlant {
  lifeForm: string;
  commonName: string;
  scientificNames: string[];
  sortOrder: number;
}

interface CommunityRareSpecies {
  kind: "plant" | "animal" | "aquatic_animal";
  scientificName: string;
  commonName: string | null;
  status: string | null;
  elementId: number | null;
  sortOrder: number;
}

interface SimilarCommunity {
  communityId: number;
  name: string;
}

interface CommunityExtras {
  communityId: number;
  placesToVisit: string[];
  literature: string[];
  photoUrl: string | null;
  countyMapUrl: string | null;
  ecoregionMapUrl: string | null;
  abstractPdfUrl: string | null;
  mnfiUrl: string;
}

interface SpeciesRecord {
  elementId: number | null;
  scientificName: string;
  commonName: string | null;
  kind: "plant" | "animal";
  category: string;
  federalStatus: string | null;
  stateStatus: string | null;
  globalRank: string | null;
  stateRank: string | null;
  speciesPageUrl: string | null;
}

interface CountySpeciesOccurrence {
  county: string;
  elementId: number | null;
  scientificName: string;
  commonName: string | null;
  category: string;
  federalStatus: string | null;
  stateStatus: string | null;
  globalRank: string | null;
  stateRank: string | null;
  lastObsYear: number | null;
}

interface CountyCommunityOccurrence {
  county: string;
  elementId: number | null;
  name: string;
  globalRank: string | null;
  stateRank: string | null;
  lastObsYear: number | null;
}

interface AbstractRecord {
  subjectType: "community" | "animal" | "plant" | "other";
  subjectKey: number | null;
  name: string;
  pdfUrl: string;
}

// ── Utility functions ─────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

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

/** Parse a plant list <li> entry like "big bluestem ( _Andropogon gerardii_ )" */
function parsePlantItem(li: string): { commonName: string; scientificNames: string[] } {
  // Extract italic/em content as scientific names
  const sciMatch = [...li.matchAll(/<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/gi)];
  const scientificNames = sciMatch
    .map((m) => stripTags(m[1]))
    .flatMap((s) =>
      s
        .split(/,\s*(?:and\s+)?|,\s+and\s+|;\s*|,?\s+and\s+/)
        .map((p) => p.replace(/^[A-Z]\.\s+/, "").trim())
        .filter((p) => p.length > 2),
    );

  const text = stripTags(li);
  const commonRaw = text.split(/\s*\(/)[0].trim();
  const commonName = commonRaw || text;

  return { commonName, scientificNames };
}

// ── Source 1 — Community list ─────────────────────────────────────────────────

async function fetchCommunityList(): Promise<CommunityStub[]> {
  const url = `${BASE}/communities/list`;
  console.log(`  Fetching community list: ${url}`);
  const resp = await fetch(url, {
    headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching community list`);
  const html = await resp.text();

  const communities: CommunityStub[] = [];
  const seen = new Set<number>();

  // ── Step 1: Parse the <table id="communities-table"> rows ─────────────────
  // Table has exactly 3 columns: Name (link), Global Rank (abbr), State Rank (abbr)
  // There is NO class or group column in the table — those come from the <ul> hierarchy below.
  const tableM = html.match(/<table[^>]*id="communities-table"[^>]*>([\s\S]*?)<\/table>/i);
  const tableHtml = tableM ? tableM[1] : html;

  const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowM: RegExpExecArray | null;
  while ((rowM = rowPattern.exec(tableHtml)) !== null) {
    const row = rowM[1];
    const linkM = row.match(/href="\/communities\/description\/(\d+)\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/i);
    if (!linkM) continue;
    const id = parseInt(linkM[1], 10);
    if (seen.has(id)) continue;
    seen.add(id);

    const slug = linkM[2];
    const name = stripTags(linkM[3]).trim();

    // cells[0] = name+link, cells[1] = globalRank, cells[2] = stateRank
    const cells: string[] = [];
    const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let cellM: RegExpExecArray | null;
    while ((cellM = cellPattern.exec(row)) !== null) {
      cells.push(stripTags(cellM[1]).trim());
    }
    const globalRank = cells[1] ? (cells[1].trim() || null) : null;
    const stateRank = cells[2] ? (cells[2].trim() || null) : null;

    // class/group filled in step 2
    communities.push({ communityId: id, slug, name, communityClass: "", communityGroup: "", globalRank, stateRank });
  }

  // ── Step 2: Parse the <ul id="community-groups"> hierarchy for class/group ─
  // Structure: Class <li> → Group <li> → community <li> (link to /communities/description/{id}/{slug})
  // Class links: /communities/{name}-class
  // Group links: /communities/{name}-group
  // Community links: /communities/description/{id}/{slug}
  const communityClassGroup = new Map<number, { communityClass: string; communityGroup: string }>();
  const groupsSectionM = html.match(/<ul[^>]*id="community-groups"[^>]*>([\s\S]*)/i);
  if (groupsSectionM) {
    const groupsHtml = groupsSectionM[1];
    let currentClass = "";
    let currentGroup = "";
    const linkPat = /<a[^>]+href="(\/communities\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let lm: RegExpExecArray | null;
    while ((lm = linkPat.exec(groupsHtml)) !== null) {
      const href = lm[1];
      const text = stripTags(lm[2]).trim();
      if (/\/communities\/[a-z0-9-]+-class$/.test(href)) {
        currentClass = text;
        currentGroup = "";
      } else if (/\/communities\/[a-z0-9-]+-group$/.test(href)) {
        currentGroup = text;
      } else {
        const descM = href.match(/\/communities\/description\/(\d+)/);
        if (descM) {
          communityClassGroup.set(parseInt(descM[1], 10), { communityClass: currentClass, communityGroup: currentGroup });
        }
      }
    }
  }

  // Merge class/group into communities
  for (const c of communities) {
    const cg = communityClassGroup.get(c.communityId);
    if (cg) {
      c.communityClass = cg.communityClass;
      c.communityGroup = cg.communityGroup;
    }
  }

  return communities;
}

// ── Source 2 — Community pages ────────────────────────────────────────────────

interface CommunityPageData {
  sections: CommunitySection[];
  plants: CharacteristicPlant[];
  rareSpecies: CommunityRareSpecies[];
  similarCommunities: SimilarCommunity[];
  placesToVisit: string[];
  literature: string[];
  photoUrl: string | null;
  countyMapUrl: string | null;
  ecoregionMapUrl: string | null;
  abstractPdfUrl: string | null;
}

function parseCommunityPage(html: string, communityId: number, slug: string): CommunityPageData {
  // ── Dynamic section discovery ──────────────────────────────────────────────
  // Find all <h2> headings and capture text until the next <h2>
  const PROSE_SECTION_SKIP = new Set([
    "similar natural communities",
    "plant lists",
    "rare plants",
    "rare animals",
    "rare aquatic animals",
    "places to visit",
    "literature",
  ]);

  const sections: CommunitySection[] = [];
  const h2Pattern = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/gi;
  let h2M: RegExpExecArray | null;
  let sectionSortOrder = 0;
  const allH2Blocks: Array<{ heading: string; body: string }> = [];

  while ((h2M = h2Pattern.exec(html)) !== null) {
    const heading = stripTags(h2M[1]).trim();
    const body = h2M[2];
    allH2Blocks.push({ heading, body });

    if (!heading || PROSE_SECTION_SKIP.has(heading.toLowerCase())) continue;

    const paras: string[] = [];
    const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pM: RegExpExecArray | null;
    while ((pM = pPattern.exec(body)) !== null) {
      const text = stripTags(pM[1]).trim();
      if (text) paras.push(text);
    }
    const text = paras.join("\n\n");
    if (text) {
      sections.push({ sectionName: heading, text, sortOrder: sectionSortOrder++ });
    }
  }

  // ── Plant list from description page ────────────────────────────────────────
  const plants: CharacteristicPlant[] = [];
  // Find "Plant Lists" h2 block
  const plantBlock = allH2Blocks.find((b) => b.heading.toLowerCase() === "plant lists");
  if (plantBlock) {
    let plantSortOrder = 0;
    const lifeFormPattern = /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|$)/gi;
    let lfm: RegExpExecArray | null;
    while ((lfm = lifeFormPattern.exec(plantBlock.body)) !== null) {
      const lifeForm = stripTags(lfm[1]).trim();
      if (!lifeForm) continue;
      const block = lfm[2];
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let lim: RegExpExecArray | null;
      while ((lim = liPattern.exec(block)) !== null) {
        const { commonName, scientificNames } = parsePlantItem(lim[1]);
        if (commonName) {
          plants.push({ lifeForm, commonName, scientificNames, sortOrder: plantSortOrder++ });
        }
      }
    }
  }

  // ── Rare species lists ───────────────────────────────────────────────────────
  const rareSpecies: CommunityRareSpecies[] = [];
  const RARE_SECTION_MAP: Record<string, "plant" | "animal" | "aquatic_animal"> = {
    "rare plants": "plant",
    "rare animals": "animal",
    "rare aquatic animals": "aquatic_animal",
  };

  for (const block of allH2Blocks) {
    const kindKey = block.heading.toLowerCase();
    const kind = RARE_SECTION_MAP[kindKey];
    if (!kind) continue;

    let rareSortOrder = 0;
    // Parse list items — each has link to /species/description/{id}/...
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let lim: RegExpExecArray | null;
    while ((lim = liPattern.exec(block.body)) !== null) {
      const liHtml = lim[1];
      // Extract elementId from href
      const hrefM = liHtml.match(/href="\/species\/description\/(\d+)\/[^"]*"/i);
      const elementId = hrefM ? parseInt(hrefM[1], 10) : null;

      const text = stripTags(liHtml).trim();
      if (!text) continue;

      // Format is typically "Scientific name (Common name) — Status" or similar
      // Try to parse: first italic or link text = scientificName
      const sciM = liHtml.match(/<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/i);
      const scientificName = sciM ? stripTags(sciM[1]).trim() : text.split(/[(\-–]/)[0].trim();

      // Common name in parens
      const commonM = text.match(/\(([^)]+)\)/);
      const commonName = commonM ? commonM[1].trim() : null;

      // Status after dash
      const statusM = text.match(/[—\-]\s*(.+)$/);
      const status = statusM ? statusM[1].trim() : null;

      if (scientificName) {
        rareSpecies.push({ kind, scientificName, commonName, status, elementId, sortOrder: rareSortOrder++ });
      }
    }
  }

  // ── Similar communities ───────────────────────────────────────────────────
  const similarCommunities: SimilarCommunity[] = [];
  const simBlock = allH2Blocks.find((b) => b.heading.toLowerCase() === "similar natural communities");
  if (simBlock) {
    // Links like /communities/description/{id}/{slug}
    const linkPattern = /<a\s+href="\/communities\/description\/(\d+)\/[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    let lm: RegExpExecArray | null;
    while ((lm = linkPattern.exec(simBlock.body)) !== null) {
      const simId = parseInt(lm[1], 10);
      const name = stripTags(lm[2]).trim();
      if (name) similarCommunities.push({ communityId: simId, name });
    }
    // Fallback: plain list items without links
    if (!similarCommunities.length) {
      const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let li: RegExpExecArray | null;
      while ((li = liPattern.exec(simBlock.body)) !== null) {
        const name = stripTags(li[1]).trim();
        if (name) similarCommunities.push({ communityId: 0, name });
      }
    }
  }

  // ── Places to visit ───────────────────────────────────────────────────────
  const placesToVisit: string[] = [];
  const placesBlock = allH2Blocks.find((b) => b.heading.toLowerCase() === "places to visit");
  if (placesBlock) {
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let li: RegExpExecArray | null;
    while ((li = liPattern.exec(placesBlock.body)) !== null) {
      const text = stripTags(li[1]).trim();
      if (text) placesToVisit.push(text);
    }
    if (!placesToVisit.length) {
      const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let p: RegExpExecArray | null;
      while ((p = pPattern.exec(placesBlock.body)) !== null) {
        const text = stripTags(p[1]).trim();
        if (text) placesToVisit.push(text);
      }
    }
  }

  // ── Literature ─────────────────────────────────────────────────────────────
  const literature: string[] = [];
  const litBlock = allH2Blocks.find((b) => b.heading.toLowerCase() === "literature");
  if (litBlock) {
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let li: RegExpExecArray | null;
    while ((li = liPattern.exec(litBlock.body)) !== null) {
      const text = stripTags(li[1]).trim();
      if (text) literature.push(text);
    }
    if (!literature.length) {
      const pPattern = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let p: RegExpExecArray | null;
      while ((p = pPattern.exec(litBlock.body)) !== null) {
        const text = stripTags(p[1]).trim();
        if (text) literature.push(text);
      }
    }
  }

  // ── Photo URL ─────────────────────────────────────────────────────────────
  const photoM = html.match(/<img[^>]+src="([^"]*\/sites\/default\/files\/[^"]*(?:jpg|jpeg|png|gif|webp))"[^>]*>/i);
  const photoUrl = photoM ? (photoM[1].startsWith("http") ? photoM[1] : `${BASE}${photoM[1]}`) : null;

  // ── County map PNG URL ─────────────────────────────────────────────────────
  const countyMapM = html.match(/href="([^"]*county[^"]*\.(?:png|jpg|gif))"/i)
    || html.match(/src="([^"]*county[^"]*\.(?:png|jpg|gif))"/i)
    || html.match(/<img[^>]+src="([^"]*\/county-map[^"]*)"[^>]*>/i);
  const countyMapUrl = countyMapM
    ? (countyMapM[1].startsWith("http") ? countyMapM[1] : `${BASE}${countyMapM[1]}`)
    : null;

  // ── Ecoregion map URL ──────────────────────────────────────────────────────
  const ecoM = html.match(/href="([^"]*ecoregion[^"]*\.pdf)"/i)
    || html.match(/href="([^"]*\/sites\/default\/files\/[^"]*ecoregion[^"]*)"/i);
  const ecoregionMapUrl = ecoM
    ? (ecoM[1].startsWith("http") ? ecoM[1] : `${BASE}${ecoM[1]}`)
    : null;

  // ── Abstract PDF URL ───────────────────────────────────────────────────────
  const abstractM = html.match(/href="([^"]*\/publications\/abstracts\/[^"]*\.pdf)"/i)
    || html.match(/href="([^"]*abstract[^"]*\.pdf)"/i);
  const abstractPdfUrl = abstractM
    ? (abstractM[1].startsWith("http") ? abstractM[1] : `${BASE}${abstractM[1]}`)
    : null;

  return {
    sections,
    plants,
    rareSpecies,
    similarCommunities,
    placesToVisit,
    literature,
    photoUrl,
    countyMapUrl,
    ecoregionMapUrl,
    abstractPdfUrl,
  };
}

async function fetchCommunityPage(communityId: number, slug: string): Promise<CommunityPageData> {
  const url = `${BASE}/communities/description/${communityId}/${slug}`;
  const resp = await fetch(url, {
    headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const html = await resp.text();
  return parseCommunityPage(html, communityId, slug);
}

// ── Source 3 — Rare species roster ───────────────────────────────────────────

async function fetchRareSpeciesRoster(): Promise<SpeciesRecord[]> {
  const records: SpeciesRecord[] = [];

  for (const kind of ["plant", "animal"] as const) {
    const endpoint = kind === "plant" ? "plants" : "animals";
    const url = `${BASE}/species/${endpoint}`;
    console.log(`  Fetching rare species roster (${kind}s): ${url}`);
    const resp = await fetch(url, {
      headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" },
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching species ${endpoint}`);
    const html = await resp.text();

    // Parse table rows — structure varies but links to /species/description/{id}/...
    // Look for table rows with species data
    const rowPattern = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowM: RegExpExecArray | null;
    let currentCategory = "";

    while ((rowM = rowPattern.exec(html)) !== null) {
      const row = rowM[1];

      // Category header rows (colspan or th-based)
      const thM = row.match(/<th[^>]*>([\s\S]*?)<\/th>/i);
      if (thM && !row.match(/<a\s+href="\/species\/description\//i)) {
        const catText = stripTags(thM[1]).trim();
        if (catText && catText.length < 100) {
          currentCategory = catText;
        }
        continue;
      }

      // Species rows: must have a link to /species/description/{id}/...
      const linkM = row.match(/href="\/species\/description\/(\d+)\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!linkM) continue;

      const elementId = parseInt(linkM[1], 10);
      const speciesSlug = linkM[2];
      const speciesPageUrl = `${BASE}/species/description/${elementId}/${speciesSlug}`;

      // Extract all cells
      const cells: string[] = [];
      const cellPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
      let cellM: RegExpExecArray | null;
      while ((cellM = cellPattern.exec(row)) !== null) {
        cells.push(stripTags(cellM[1]).trim());
      }

      // Try to get scientific name from the link text (italic typically)
      const sciInLink = row.match(/href="\/species\/description\/\d+\/[^"]*"[^>]*>[\s\S]*?<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/i);
      const scientificName = sciInLink
        ? stripTags(sciInLink[1]).trim()
        : (cells[0] || speciesSlug.replace(/-/g, " "));

      // Common name is typically in second cell, or parenthetical in first
      const commonName = cells[1] ? cells[1] : null;

      // Status columns vary: federal (col 2 or 3), state (col 3 or 4), ranks (col 4/5)
      const federalStatus = cells[2] ? (cells[2] || null) : null;
      const stateStatus = cells[3] ? (cells[3] || null) : null;
      const globalRank = cells[4] ? (cells[4] || null) : null;
      const stateRank = cells[5] ? (cells[5] || null) : null;

      if (scientificName && scientificName.length > 1) {
        records.push({
          elementId: isNaN(elementId) ? null : elementId,
          scientificName,
          commonName: commonName || null,
          kind,
          category: currentCategory || endpoint,
          federalStatus: federalStatus || null,
          stateStatus: stateStatus || null,
          globalRank: globalRank || null,
          stateRank: stateRank || null,
          speciesPageUrl,
        });
      }
    }
  }

  return records;
}

// ── Source 4 — County data ────────────────────────────────────────────────────

const MICHIGAN_COUNTIES: ReadonlyArray<string> = [
  "Alcona", "Alger", "Allegan", "Alpena", "Antrim", "Arenac", "Baraga", "Barry", "Bay", "Benzie",
  "Berrien", "Branch", "Calhoun", "Cass", "Charlevoix", "Cheboygan", "Chippewa", "Clare", "Clinton", "Crawford",
  "Delta", "Dickinson", "Eaton", "Emmet", "Genesee", "Gladwin", "Gogebic", "Grand Traverse", "Gratiot", "Hillsdale",
  "Houghton", "Huron", "Ingham", "Ionia", "Iosco", "Iron", "Isabella", "Jackson", "Kalamazoo", "Kalkaska",
  "Kent", "Keweenaw", "Lake", "Lapeer", "Leelanau", "Lenawee", "Livingston", "Luce", "Mackinac", "Macomb",
  "Manistee", "Marquette", "Mason", "Mecosta", "Menominee", "Midland", "Missaukee", "Monroe", "Montcalm", "Montmorency",
  "Muskegon", "Newaygo", "Oakland", "Oceana", "Ogemaw", "Ontonagon", "Osceola", "Oscoda", "Otsego", "Ottawa",
  "Presque Isle", "Roscommon", "Saginaw", "Sanilac", "Schoolcraft", "Shiawassee", "St. Clair", "St. Joseph",
  "Tuscola", "Van Buren", "Washtenaw", "Wayne", "Wexford",
] as const;

interface MnfiJsonResponse {
  COLUMNS: string[];
  DATA: Array<Array<string | number | null>>;
}

function rowToObj(columns: string[], row: Array<string | number | null>): Record<string, string | number | null> {
  const obj: Record<string, string | number | null> = {};
  columns.forEach((col, i) => { obj[col] = row[i] ?? null; });
  return obj;
}

function parseYear(val: string | number | null): number | null {
  if (val === null || val === "") return null;
  const n = typeof val === "number" ? val : parseInt(String(val), 10);
  return isNaN(n) ? null : n;
}

async function fetchCountySpecies(countyId: number, countyName: string): Promise<CountySpeciesOccurrence[]> {
  const url = `${BASE}/resources/countyQuery?county=${countyId}`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)",
      "Accept": "application/json, */*",
      "Referer": "https://mnfi.anr.msu.edu/resources/county-element-data",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const data = (await resp.json()) as MnfiJsonResponse;

  return data.DATA.map((row) => {
    const r = rowToObj(data.COLUMNS, row);
    const elementIdRaw = r["ELEMENT_ID"];
    const elementId = elementIdRaw !== null ? (typeof elementIdRaw === "number" ? elementIdRaw : parseInt(String(elementIdRaw), 10)) : null;
    return {
      county: countyName,
      elementId: elementId !== null && !isNaN(elementId) ? elementId : null,
      scientificName: stripTags((r["SCIENTIFIC_NAME"] as string | null) ?? (r["FORMATTED_SCIENTIFIC_NAME"] as string | null) ?? ""),
      commonName: r["COMMON_NAME"] as string | null,
      category: (r["SPECIES_CATEGORY"] as string | null) ?? "",
      federalStatus: r["US_STATUS"] as string | null,
      stateStatus: r["STATE_STATUS"] as string | null,
      globalRank: r["G_RANK"] as string | null,
      stateRank: r["S_RANK"] as string | null,
      lastObsYear: parseYear(r["LAST_OBS_YEAR"]),
    };
  });
}

async function fetchCountyCommunities(countyId: number, countyName: string): Promise<CountyCommunityOccurrence[]> {
  const url = `${BASE}/resources/countyCommunityQuery?county=${countyId}`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)",
      "Accept": "application/json, */*",
      "Referer": "https://mnfi.anr.msu.edu/resources/county-element-data",
    },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const data = (await resp.json()) as MnfiJsonResponse;

  return data.DATA.map((row) => {
    const r = rowToObj(data.COLUMNS, row);
    const elementIdRaw = r["ELEMENT_ID"];
    const elementId = elementIdRaw !== null ? (typeof elementIdRaw === "number" ? elementIdRaw : parseInt(String(elementIdRaw), 10)) : null;
    return {
      county: countyName,
      elementId: elementId !== null && !isNaN(elementId) ? elementId : null,
      name: (r["NAME"] as string | null) ?? "",
      globalRank: r["G_RANK"] as string | null,
      stateRank: r["S_RANK"] as string | null,
      lastObsYear: parseYear(r["LAST_OBS_DATE"]),
    };
  });
}

// ── Source 5 — Abstracts index ────────────────────────────────────────────────

async function fetchAbstracts(
  communityNameToId: Map<string, number>,
  speciesNameToElementId: Map<string, number>,
): Promise<AbstractRecord[]> {
  const url = `${BASE}/publications/abstracts`;
  console.log(`  Fetching abstracts index: ${url}`);
  const resp = await fetch(url, {
    headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" },
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching abstracts`);
  const html = await resp.text();

  const records: AbstractRecord[] = [];
  const seenUrls = new Set<string>();

  // The abstracts page has four tab sections that tell us the subject type.
  // Each tab's content div starts with <div id="tabs-{Kind}"> and contains rows
  // with two <td>s: scientific/community name (link, possibly <i>), common name (link).
  // Both <td>s link to the same PDF — we deduplicate by URL and extract:
  //   • scientific name: innerText of the first link in the row (strip <i> tags)
  //   • subject type: inferred from tab section
  //   • subjectKey: matched against communityNameToId or speciesNameToElementId

  const TABS: Array<{
    id: string;
    subjectType: "community" | "animal" | "plant" | "other";
  }> = [
    { id: "tabs-Animal", subjectType: "animal" },
    { id: "tabs-Plant", subjectType: "plant" },
    { id: "tabs-Community", subjectType: "community" },
    { id: "tabs-Other", subjectType: "other" },
  ];

  for (const tab of TABS) {
    // Extract tab section content (between <div id="tabs-X"> and the next <div id="tabs->)
    const tabPattern = new RegExp(
      `<div[^>]+id="${tab.id}"[^>]*>([\\s\\S]*?)(?=<div[^>]+id="tabs-|$)`,
      "i",
    );
    const tabM = html.match(tabPattern);
    if (!tabM) continue;
    const tabHtml = tabM[1];

    // Parse each <tr> row in this tab
    const rowPat = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rm: RegExpExecArray | null;
    while ((rm = rowPat.exec(tabHtml)) !== null) {
      const row = rm[1];

      // Find the PDF link — first occurrence gives us the primary name
      const linkM = row.match(/<a[^>]+href="([^"]*\.pdf)"[^>]*>([\s\S]*?)<\/a>/i);
      if (!linkM) continue;

      let pdfUrl = linkM[1];
      if (!pdfUrl.startsWith("http")) pdfUrl = `${BASE}${pdfUrl}`;
      if (seenUrls.has(pdfUrl)) continue;
      seenUrls.add(pdfUrl);

      // The primary name: strip tags from link text (removes <i> italic markers)
      const name = stripTags(linkM[2]).trim();
      if (!name) continue;

      let subjectType = tab.subjectType;
      let subjectKey: number | null = null;

      if (subjectType === "animal" || subjectType === "plant") {
        // Match scientific name (case-insensitive) against the rare species roster.
        // Downgrade to "other" when the name cannot be resolved to an elementId.
        const elementId = speciesNameToElementId.get(name.toLowerCase()) ?? null;
        if (elementId !== null) {
          subjectKey = elementId;
        } else {
          subjectType = "other";
        }
      } else if (subjectType === "community") {
        // Match community name (case-insensitive) against the community list.
        // Downgrade to "other" when the name cannot be resolved to a communityId.
        const communityId = communityNameToId.get(name.toLowerCase()) ?? null;
        if (communityId !== null) {
          subjectKey = communityId;
        } else {
          subjectType = "other";
        }
      }

      records.push({ subjectType, subjectKey, name, pdfUrl });
    }
  }

  return records;
}

// ── TypeScript file writers ───────────────────────────────────────────────────

function escapeString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

function toTsLiteral(val: unknown): string {
  if (val === null) return "null";
  if (typeof val === "string") return JSON.stringify(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "boolean") return String(val);
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    return `[\n${val.map((v) => "    " + toTsLiteral(v)).join(",\n")}\n  ]`;
  }
  if (typeof val === "object" && val !== null) {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return `{ ${entries.map(([k, v]) => `${k}: ${toTsLiteral(v)}`).join(", ")} }`;
  }
  return JSON.stringify(val);
}

function writeDataFile(filename: string, header: string, exportName: string, typeAnnotation: string, data: unknown[]): void {
  const date = new Date().toISOString().slice(0, 10);
  const lines: string[] = [
    `// AUTO-GENERATED by lib/internal-data-providers/src/mnfi/scraper — do not edit manually.`,
    `// Scraped from https://mnfi.anr.msu.edu on ${date}.`,
    ``,
    header,
    ``,
    `export const ${exportName}: ${typeAnnotation} = [`,
  ];

  for (const item of data) {
    const entries = Object.entries(item as Record<string, unknown>);
    const fields = entries.map(([k, v]) => `    ${k}: ${toTsLiteral(v)}`).join(",\n");
    lines.push(`  {\n${fields}\n  },`);
  }

  lines.push(`];`);
  lines.push(``);

  writeFileSync(path.join(DATA_DIR, filename), lines.join("\n"), "utf-8");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  mkdirSync(DATA_DIR, { recursive: true });

  const scrapedAt = new Date().toISOString();
  const errors: string[] = [];

  // ── Source 1: Community list ─────────────────────────────────────────────
  console.log("\n[1/5] Fetching community list...");
  let communities: CommunityStub[] = [];
  try {
    communities = await fetchCommunityList();
    console.log(`  Found ${communities.length} communities.`);
  } catch (err) {
    console.error(`  FATAL: Could not fetch community list: ${err}`);
    process.exit(1);
  }

  if (communities.length === 0) {
    console.error("  FATAL: Community list is empty — aborting.");
    process.exit(1);
  }

  // Check failure threshold
  const expectedCommunities = 77;
  if (communities.length < expectedCommunities * 0.9) {
    console.error(`  FATAL: Only got ${communities.length} communities (expected ~${expectedCommunities}) — aborting.`);
    process.exit(1);
  }

  // ── Source 2: Community pages ─────────────────────────────────────────────
  console.log(`\n[2/5] Fetching ${communities.length} community pages (400ms rate limit)...`);

  const allSections: Array<{ communityId: number; sections: CommunitySection[] }> = [];
  const allPlants: Array<{ communityId: number; plants: CharacteristicPlant[] }> = [];
  const allRareSpecies: Array<{ communityId: number; rareSpecies: CommunityRareSpecies[] }> = [];
  const allSimilar: Array<{ communityId: number; similar: SimilarCommunity[] }> = [];
  const allExtras: CommunityExtras[] = [];

  for (let i = 0; i < communities.length; i++) {
    const comm = communities[i];
    if (i > 0) await sleep(RATE_LIMIT_COMMUNITY_MS);

    try {
      const page = await fetchCommunityPage(comm.communityId, comm.slug);
      allSections.push({ communityId: comm.communityId, sections: page.sections });
      allPlants.push({ communityId: comm.communityId, plants: page.plants });
      allRareSpecies.push({ communityId: comm.communityId, rareSpecies: page.rareSpecies });
      allSimilar.push({ communityId: comm.communityId, similar: page.similarCommunities });
      allExtras.push({
        communityId: comm.communityId,
        placesToVisit: page.placesToVisit,
        literature: page.literature,
        photoUrl: page.photoUrl,
        countyMapUrl: page.countyMapUrl,
        ecoregionMapUrl: page.ecoregionMapUrl,
        abstractPdfUrl: page.abstractPdfUrl,
        mnfiUrl: `${BASE}/communities/description/${comm.communityId}/${comm.slug}`,
      });
      process.stdout.write(`  [${i + 1}/${communities.length}] ${comm.name} — ${page.sections.length} sections, ${page.plants.length} plants\n`);
    } catch (err) {
      const msg = `Community ${comm.communityId} (${comm.slug}): ${err}`;
      errors.push(msg);
      console.error(`  ERROR: ${msg}`);
      // Push empty records so communityId is still present
      allSections.push({ communityId: comm.communityId, sections: [] });
      allPlants.push({ communityId: comm.communityId, plants: [] });
      allRareSpecies.push({ communityId: comm.communityId, rareSpecies: [] });
      allSimilar.push({ communityId: comm.communityId, similar: [] });
      allExtras.push({
        communityId: comm.communityId,
        placesToVisit: [],
        literature: [],
        photoUrl: null,
        countyMapUrl: null,
        ecoregionMapUrl: null,
        abstractPdfUrl: null,
        mnfiUrl: `${BASE}/communities/description/${comm.communityId}/${comm.slug}`,
      });
    }
  }

  // Check failure threshold (>10% is a hard stop)
  const communityFailures = errors.length;
  if (communityFailures > communities.length * 0.1) {
    console.error(`\nFATAL: ${communityFailures}/${communities.length} community pages failed (>${Math.round(communities.length * 0.1)} threshold) — aborting.`);
    process.exit(1);
  }

  // ── Source 3: Rare species roster ─────────────────────────────────────────
  console.log("\n[3/5] Fetching rare species roster...");
  let rareSpeciesRoster: SpeciesRecord[] = [];
  try {
    rareSpeciesRoster = await fetchRareSpeciesRoster();
    console.log(`  Found ${rareSpeciesRoster.length} species records.`);
  } catch (err) {
    console.error(`  ERROR fetching rare species roster: ${err}`);
    errors.push(`Species roster: ${err}`);
  }

  // Post-process: community pages list rare species as plain <em> text with NO
  // href links — there are no /species/description/{id}/... URLs on those pages.
  // Fill elementId by joining community rare species to the roster by scientificName
  // (case-insensitive). This populates the primary join key for getMnfiSpeciesCommunities.
  if (rareSpeciesRoster.length > 0) {
    const rosterByName = new Map(
      rareSpeciesRoster.map((s) => [s.scientificName.toLowerCase(), s.elementId]),
    );
    for (const entry of allRareSpecies) {
      for (const rs of entry.rareSpecies) {
        if (rs.elementId === null) {
          rs.elementId = rosterByName.get(rs.scientificName.toLowerCase()) ?? null;
        }
      }
    }
    const resolved = allRareSpecies.reduce((n, e) => n + e.rareSpecies.filter(r => r.elementId !== null).length, 0);
    const total = allRareSpecies.reduce((n, e) => n + e.rareSpecies.length, 0);
    console.log(`  Post-processed rare species elementId: ${resolved}/${total} resolved by name join.`);
  }

  // ── Source 4: County data ─────────────────────────────────────────────────
  console.log(`\n[4/5] Fetching county data (83 counties × 2 endpoints, 250ms rate limit)...`);

  const allCountySpecies: CountySpeciesOccurrence[] = [];
  const allCountyCommunities: CountyCommunityOccurrence[] = [];
  let countyFailures = 0;

  for (let i = 0; i < MICHIGAN_COUNTIES.length; i++) {
    const countyId = i + 1;
    const countyName = MICHIGAN_COUNTIES[i];
    if (i > 0) await sleep(RATE_LIMIT_COUNTY_MS);

    try {
      const [species, comms] = await Promise.all([
        fetchCountySpecies(countyId, countyName),
        fetchCountyCommunities(countyId, countyName),
      ]);
      allCountySpecies.push(...species);
      allCountyCommunities.push(...comms);
      process.stdout.write(`  [${countyId}/83] ${countyName}: ${species.length} species, ${comms.length} communities\n`);
    } catch (err) {
      const msg = `County ${countyId} (${countyName}): ${err}`;
      errors.push(msg);
      console.error(`  ERROR: ${msg}`);
      countyFailures++;
    }
  }

  if (countyFailures > MICHIGAN_COUNTIES.length * 0.1) {
    console.error(`\nFATAL: ${countyFailures}/${MICHIGAN_COUNTIES.length} counties failed — aborting.`);
    process.exit(1);
  }

  // ── Source 5: Abstracts ───────────────────────────────────────────────────
  console.log("\n[5/5] Fetching abstracts index...");
  // Build name→id lookup maps for subject resolution
  const communityNameToId = new Map<string, number>(
    communities.map((c) => [c.name.toLowerCase(), c.communityId]),
  );
  const speciesNameToElementId = new Map<string, number>(
    rareSpeciesRoster
      .filter((s) => s.elementId !== null)
      .map((s) => [s.scientificName.toLowerCase(), s.elementId as number]),
  );
  let abstracts: AbstractRecord[] = [];
  try {
    abstracts = await fetchAbstracts(communityNameToId, speciesNameToElementId);
    console.log(`  Found ${abstracts.length} abstract records.`);
  } catch (err) {
    console.error(`  ERROR fetching abstracts: ${err}`);
    errors.push(`Abstracts: ${err}`);
  }

  // ── Write data files ──────────────────────────────────────────────────────
  console.log("\nWriting data files...");

  // communities.ts
  writeDataFile(
    "communities.ts",
    `export interface CommunityStub {\n  communityId: number;\n  slug: string;\n  name: string;\n  communityClass: string;\n  communityGroup: string;\n  globalRank: string | null;\n  stateRank: string | null;\n}`,
    "MNFI_COMMUNITIES",
    "CommunityStub[]",
    communities,
  );
  console.log(`  communities.ts — ${communities.length} entries`);

  // community-sections.ts
  writeDataFile(
    "community-sections.ts",
    `export interface CommunitySection {\n  sectionName: string;\n  text: string;\n  sortOrder: number;\n}\nexport interface CommunitySections {\n  communityId: number;\n  sections: CommunitySection[];\n}`,
    "MNFI_COMMUNITY_SECTIONS",
    "CommunitySections[]",
    allSections,
  );
  const totalSections = allSections.reduce((s, e) => s + e.sections.length, 0);
  console.log(`  community-sections.ts — ${totalSections} sections across ${allSections.length} communities`);

  // community-plants.ts
  writeDataFile(
    "community-plants.ts",
    `export interface CharacteristicPlant {\n  lifeForm: string;\n  commonName: string;\n  scientificNames: string[];\n  sortOrder: number;\n}\nexport interface CommunityPlants {\n  communityId: number;\n  plants: CharacteristicPlant[];\n}`,
    "MNFI_COMMUNITY_PLANTS",
    "CommunityPlants[]",
    allPlants,
  );
  const totalPlants = allPlants.reduce((s, e) => s + e.plants.length, 0);
  console.log(`  community-plants.ts — ${totalPlants} plant entries across ${allPlants.length} communities`);

  // community-rare-species.ts
  writeDataFile(
    "community-rare-species.ts",
    `export interface CommunityRareSpecies {\n  kind: "plant" | "animal" | "aquatic_animal";\n  scientificName: string;\n  commonName: string | null;\n  status: string | null;\n  elementId: number | null;\n  sortOrder: number;\n}\nexport interface CommunityRareSpeciesList {\n  communityId: number;\n  rareSpecies: CommunityRareSpecies[];\n}`,
    "MNFI_COMMUNITY_RARE_SPECIES",
    "CommunityRareSpeciesList[]",
    allRareSpecies,
  );
  const totalRare = allRareSpecies.reduce((s, e) => s + e.rareSpecies.length, 0);
  console.log(`  community-rare-species.ts — ${totalRare} rare species entries`);

  // community-similar.ts
  writeDataFile(
    "community-similar.ts",
    `export interface SimilarCommunity {\n  communityId: number;\n  name: string;\n}\nexport interface CommunitySimilar {\n  communityId: number;\n  similar: SimilarCommunity[];\n}`,
    "MNFI_COMMUNITY_SIMILAR",
    "CommunitySimilar[]",
    allSimilar,
  );
  console.log(`  community-similar.ts — ${allSimilar.length} community entries`);

  // community-extras.ts
  writeDataFile(
    "community-extras.ts",
    `export interface CommunityExtras {\n  communityId: number;\n  placesToVisit: string[];\n  literature: string[];\n  photoUrl: string | null;\n  countyMapUrl: string | null;\n  ecoregionMapUrl: string | null;\n  abstractPdfUrl: string | null;\n  mnfiUrl: string;\n}`,
    "MNFI_COMMUNITY_EXTRAS",
    "CommunityExtras[]",
    allExtras,
  );
  console.log(`  community-extras.ts — ${allExtras.length} entries`);

  // rare-species.ts
  writeDataFile(
    "rare-species.ts",
    `export interface SpeciesRecord {\n  elementId: number | null;\n  scientificName: string;\n  commonName: string | null;\n  kind: "plant" | "animal";\n  category: string;\n  federalStatus: string | null;\n  stateStatus: string | null;\n  globalRank: string | null;\n  stateRank: string | null;\n  speciesPageUrl: string | null;\n}`,
    "MNFI_RARE_SPECIES",
    "SpeciesRecord[]",
    rareSpeciesRoster,
  );
  console.log(`  rare-species.ts — ${rareSpeciesRoster.length} entries`);

  // county-species.ts
  writeDataFile(
    "county-species.ts",
    `export interface CountySpeciesOccurrence {\n  county: string;\n  elementId: number | null;\n  scientificName: string;\n  commonName: string | null;\n  category: string;\n  federalStatus: string | null;\n  stateStatus: string | null;\n  globalRank: string | null;\n  stateRank: string | null;\n  lastObsYear: number | null;\n}`,
    "MNFI_COUNTY_SPECIES",
    "CountySpeciesOccurrence[]",
    allCountySpecies,
  );
  console.log(`  county-species.ts — ${allCountySpecies.length} entries`);

  // county-communities.ts
  writeDataFile(
    "county-communities.ts",
    `export interface CountyCommunityOccurrence {\n  county: string;\n  elementId: number | null;\n  name: string;\n  globalRank: string | null;\n  stateRank: string | null;\n  lastObsYear: number | null;\n}`,
    "MNFI_COUNTY_COMMUNITIES",
    "CountyCommunityOccurrence[]",
    allCountyCommunities,
  );
  console.log(`  county-communities.ts — ${allCountyCommunities.length} entries`);

  // abstracts.ts
  writeDataFile(
    "abstracts.ts",
    `export interface AbstractRecord {\n  subjectType: "community" | "animal" | "plant" | "other";\n  subjectKey: number | null;\n  name: string;\n  pdfUrl: string;\n}`,
    "MNFI_ABSTRACTS",
    "AbstractRecord[]",
    abstracts,
  );
  console.log(`  abstracts.ts — ${abstracts.length} entries`);

  // scraped-at.ts
  const scrapedAtDate = new Date().toISOString().slice(0, 10);
  const scrapedAtContent = [
    `// AUTO-GENERATED by lib/internal-data-providers/src/mnfi/scraper — do not edit manually.`,
    `// Scraped from https://mnfi.anr.msu.edu on ${scrapedAtDate}.`,
    ``,
    `export const MNFI_SCRAPED_AT = ${JSON.stringify(scrapedAt)};`,
    ``,
  ].join("\n");
  writeFileSync(path.join(DATA_DIR, "scraped-at.ts"), scrapedAtContent, "utf-8");
  console.log(`  scraped-at.ts — ${scrapedAt}`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════");
  console.log("MNFI Scraper Summary");
  console.log("═══════════════════════════════════════════════════");
  console.log(`Communities:         ${communities.length}`);
  console.log(`Community sections:  ${totalSections}`);
  console.log(`Plant entries:       ${totalPlants}`);
  console.log(`Rare species (comm): ${totalRare}`);
  console.log(`Rare species roster: ${rareSpeciesRoster.length}`);
  console.log(`County species:      ${allCountySpecies.length}`);
  console.log(`County communities:  ${allCountyCommunities.length}`);
  console.log(`Abstracts:           ${abstracts.length}`);
  console.log(`Scraped at:          ${scrapedAt}`);
  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    for (const e of errors) console.log(`  - ${e}`);
  } else {
    console.log("\nNo errors.");
  }
  console.log("═══════════════════════════════════════════════════");
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
