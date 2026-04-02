/**
 * MNFI scraper — fetches community descriptions and plant lists from mnfi.anr.msu.edu.
 * All pages are server-rendered Drupal HTML; no JavaScript execution required.
 */

const BASE = "https://mnfi.anr.msu.edu";
const RATE_LIMIT_MS = 400;

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

/** Extract all paragraph text between two h2 headings */
function extractSection(html: string, sectionName: string): string | null {
  const escapedName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Match <h2 ...>SectionName</h2> then capture everything until the next </div> that closes the section block or the next <h2
  const pattern = new RegExp(
    `<h2[^>]*>${escapedName}<\\/h2>([\\s\\S]*?)(?=<h2|<\\/div>\\s*<div|$)`,
    "i",
  );
  const m = html.match(pattern);
  if (!m) return null;
  const inner = m[1];
  // Collect all <p> text
  const paras: string[] = [];
  const pPattern = /<p>([\s\S]*?)<\/p>/gi;
  let pm: RegExpExecArray | null;
  while ((pm = pPattern.exec(inner)) !== null) {
    const text = stripTags(pm[1]).trim();
    if (text) paras.push(text);
  }
  return paras.length ? paras.join("\n\n") : null;
}

/** Extract similar communities list */
function extractSimilarCommunities(html: string): string[] | null {
  const m = html.match(/<h2[^>]*>Similar Natural Communities<\/h2>([\s\S]*?)(?=<h2|$)/i);
  if (!m) return null;
  const inner = m[1];
  const names: string[] = [];
  // Links like <a href="/communities/description/...">Name</a>
  const linkPattern = /<a\s+href="\/communities\/description\/[^"]*">([^<]+)<\/a>/g;
  let lm: RegExpExecArray | null;
  while ((lm = linkPattern.exec(inner)) !== null) {
    names.push(lm[1].trim());
  }
  // Also check plain list items without links
  if (!names.length) {
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let li: RegExpExecArray | null;
    while ((li = liPattern.exec(inner)) !== null) {
      const text = stripTags(li[1]).trim();
      if (text) names.push(text);
    }
  }
  return names.length ? names : null;
}

export interface CommunityDescription {
  community_id: number;
  slug: string;
  overview: string | null;
  landscape_context: string | null;
  soils_description: string | null;
  natural_processes: string | null;
  vegetation: string | null;
  management_notes: string | null;
  similar_communities: string[] | null;
}

export async function fetchCommunityDescription(
  id: number,
  slug: string,
): Promise<CommunityDescription> {
  const url = `${BASE}/communities/description/${id}/${slug}`;
  const resp = await fetch(url, { headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const html = await resp.text();

  return {
    community_id: id,
    slug,
    overview: extractSection(html, "Overview"),
    landscape_context: extractSection(html, "Landscape Context"),
    soils_description: extractSection(html, "Soils"),
    natural_processes: extractSection(html, "Natural Processes"),
    vegetation: extractSection(html, "Vegetation"),
    management_notes: extractSection(html, "Biodiversity Management Considerations"),
    similar_communities: extractSimilarCommunities(html),
  };
}

// ── Plant list parsing ────────────────────────────────────────────────────────

export interface PlantEntry {
  community_id: number;
  life_form: string;
  common_name: string;
  scientific_names: string[];
  sort_order: number;
}

/** Parse a plant list <li> entry like "big bluestem ( _Andropogon gerardii_ )" */
function parsePlantItem(li: string): { common_name: string; scientific_names: string[] } {
  const text = stripTags(li);
  // Extract italic/em content as scientific names
  const sciMatch = [...li.matchAll(/<(?:i|em)>([\s\S]*?)<\/(?:i|em)>/gi)];
  const scientific_names = sciMatch
    .map((m) => stripTags(m[1]))
    .flatMap((s) =>
      s
        .split(/,\s*(?:and\s+)?|,\s+and\s+|;\s*|,?\s+and\s+/)
        .map((p) => p.replace(/^[A-Z]\.\s+/, "").trim())
        .filter((p) => p.length > 2),
    );

  // Common name is text before the first "(" or the entire text if no parens
  const commonRaw = text.split(/\s*\(/)[0].trim();
  const common_name = commonRaw || text;

  return { common_name, scientific_names };
}

export async function fetchCommunityPlantList(id: number, slug: string): Promise<PlantEntry[]> {
  const url = `${BASE}/communities/plant-list/${id}/${slug}`;
  const resp = await fetch(url, { headers: { "User-Agent": "FERNS/1.0 (research; contact via mnfi.anr.msu.edu)" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  const html = await resp.text();

  const entries: PlantEntry[] = [];
  let sortOrder = 0;

  // Find the plant list section — starts after <h2 ...>Plant Lists</h2>
  const plantSection = html.match(/<h2[^>]*>Plant Lists<\/h2>([\s\S]*?)(?=<h2[^>]*>Noteworthy|<h2[^>]*>Rare|$)/i);
  const section = plantSection ? plantSection[1] : html;

  // Each life form is an <h4>LifeForm</h4> followed by <ul><li>...</ul>
  const lifeFormPattern = /<h4[^>]*>([\s\S]*?)<\/h4>([\s\S]*?)(?=<h4|$)/gi;
  let lfm: RegExpExecArray | null;
  while ((lfm = lifeFormPattern.exec(section)) !== null) {
    const life_form = stripTags(lfm[1]).trim();
    if (!life_form) continue;
    const block = lfm[2];
    // Extract list items
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let lim: RegExpExecArray | null;
    while ((lim = liPattern.exec(block)) !== null) {
      const { common_name, scientific_names } = parsePlantItem(lim[1]);
      if (common_name) {
        entries.push({ community_id: id, life_form, common_name, scientific_names, sort_order: sortOrder++ });
      }
    }
  }

  return entries;
}

// ── Batch import ──────────────────────────────────────────────────────────────

export interface CommunityStub {
  community_id: number;
  slug: string;
  name: string;
}

/** Fetch the list of all 77 communities from the MNFI community list page */
export async function fetchCommunityList(): Promise<CommunityStub[]> {
  const url = `${BASE}/communities/list`;
  const resp = await fetch(url, { headers: { "User-Agent": "FERNS/1.0" } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} fetching community list`);
  const html = await resp.text();

  const seen = new Set<number>();
  const communities: CommunityStub[] = [];
  const linkPattern = /href="\/communities\/description\/(\d+)\/([a-z0-9-]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = linkPattern.exec(html)) !== null) {
    const id = parseInt(m[1], 10);
    if (seen.has(id)) continue;
    seen.add(id);
    communities.push({ community_id: id, slug: m[2], name: stripTags(m[3]) });
  }
  return communities;
}

export interface ImportDescriptionsResult {
  total: number;
  succeeded: number;
  failed: Array<{ id: number; slug: string; error: string }>;
}

export interface ImportPlantListsResult {
  total: number;
  communities_succeeded: number;
  plants_inserted: number;
  failed: Array<{ id: number; slug: string; error: string }>;
}

/** Import all 77 community descriptions with rate limiting */
export async function importAllDescriptions(
  onProgress?: (done: number, total: number, name: string) => void,
): Promise<{ descriptions: CommunityDescription[]; result: ImportDescriptionsResult }> {
  const list = await fetchCommunityList();
  const result: ImportDescriptionsResult = { total: list.length, succeeded: 0, failed: [] };
  const descriptions: CommunityDescription[] = [];

  for (let i = 0; i < list.length; i++) {
    const { community_id, slug, name } = list[i];
    if (i > 0) await sleep(RATE_LIMIT_MS);
    try {
      const desc = await fetchCommunityDescription(community_id, slug);
      descriptions.push(desc);
      result.succeeded++;
      onProgress?.(i + 1, list.length, name);
    } catch (err) {
      result.failed.push({ id: community_id, slug, error: String(err) });
      onProgress?.(i + 1, list.length, `${name} (FAILED)`);
    }
  }

  return { descriptions, result };
}

/** Import all 77 community plant lists with rate limiting */
export async function importAllPlantLists(
  onProgress?: (done: number, total: number, name: string) => void,
): Promise<{ allPlants: PlantEntry[]; result: ImportPlantListsResult }> {
  const list = await fetchCommunityList();
  const result: ImportPlantListsResult = {
    total: list.length,
    communities_succeeded: 0,
    plants_inserted: 0,
    failed: [],
  };
  const allPlants: PlantEntry[] = [];

  for (let i = 0; i < list.length; i++) {
    const { community_id, slug, name } = list[i];
    if (i > 0) await sleep(RATE_LIMIT_MS);
    try {
      const plants = await fetchCommunityPlantList(community_id, slug);
      allPlants.push(...plants);
      result.communities_succeeded++;
      result.plants_inserted += plants.length;
      onProgress?.(i + 1, list.length, name);
    } catch (err) {
      result.failed.push({ id: community_id, slug, error: String(err) });
      onProgress?.(i + 1, list.length, `${name} (FAILED)`);
    }
  }

  return { allPlants, result };
}
