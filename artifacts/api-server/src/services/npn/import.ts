// ---------------------------------------------------------------------------
// NPN DATA IMPORT TOOL
// Scrapes nativeplant.com (Greg Vaclavek's Michigan Native Plants Database),
// uploads images to Cloudinary, and populates npn_species + npn_name_aliases.
//
// Run manually via: POST /api/ann-arbor-npn/import  (requires admin auth)
// Auto-runs at startup when npn_species is empty.
// ---------------------------------------------------------------------------
import { db, npnSpeciesTable, npnNameAliasesTable, type NpnImage } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] ?? "dqe2vv0fo";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];

const NPN_BASE_URL = "https://nativeplant.com";
const NPN_SPECIES_LIST_URL = `${NPN_BASE_URL}/species`;

// ---------------------------------------------------------------------------
// Cloudinary helpers
// ---------------------------------------------------------------------------

async function uploadToCloudinary(
  imageUrl: string,
  publicId: string,
  caption: string,
): Promise<string | null> {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn("Cloudinary credentials not set — skipping image upload");
    return imageUrl;
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");

  const formData = new URLSearchParams();
  formData.append("file", imageUrl);
  formData.append("public_id", publicId);
  formData.append("overwrite", "true");
  formData.append("context", `caption=${encodeURIComponent(caption)}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    logger.error({ status: res.status, publicId, text }, "Cloudinary upload failed");
    return null;
  }

  const data = (await res.json()) as { secure_url?: string };
  return data.secure_url ?? null;
}

// ---------------------------------------------------------------------------
// Image kind inference
// ---------------------------------------------------------------------------

function inferImageKind(caption: string): "photograph" | "drawing" {
  const lower = caption.toLowerCase();
  if (lower.includes("pen & ink") || lower.includes("drawing")) {
    return "drawing";
  }
  return "photograph";
}

// ---------------------------------------------------------------------------
// Alias computation
// ---------------------------------------------------------------------------

function buildAliases(
  acronym: string,
  latinName: string,
  latinSynonymGreg: string | null | undefined,
  commonName: string,
): string[] {
  const aliases = new Set<string>();

  aliases.add(acronym.toLowerCase());
  aliases.add(latinName.toLowerCase());

  if (latinSynonymGreg) {
    aliases.add(latinSynonymGreg.toLowerCase());
  }

  // Split common names on ; and , — each segment trimmed
  const commonParts = commonName
    .split(/[;,]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  for (const part of commonParts) {
    aliases.add(part);
  }

  return [...aliases];
}

// ---------------------------------------------------------------------------
// Scraping helpers
// ---------------------------------------------------------------------------

interface RawSpeciesListItem {
  acronym: string;
  detail_url: string;
}

interface RawSpeciesDetail {
  acronym: string;
  latin_name: string;
  latin_synonym_greg: string | null;
  common_name: string;
  light: string | null;
  moisture: string | null;
  height: string | null;
  flowering_time: string | null;
  habitat: string | null;
  notes: string | null;
  range_michigan: string[];
  npn_price_sizes: string | null;
  raw_images: Array<{ position: number; src: string; caption: string }>;
  source_url: string;
}

/**
 * Fetch and parse the NPN species list page.
 * Returns a list of {acronym, detail_url} entries.
 */
async function fetchSpeciesList(): Promise<RawSpeciesListItem[]> {
  const res = await fetch(NPN_SPECIES_LIST_URL, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch NPN species list: HTTP ${res.status}`);
  }
  const html = await res.text();

  // Parse species links — nativeplant.com lists species as /species/{acronym} links
  const items: RawSpeciesListItem[] = [];
  const linkPattern = /href="(\/species\/([A-Z0-9]+))"/g;
  let match: RegExpExecArray | null;
  const seen = new Set<string>();

  while ((match = linkPattern.exec(html)) !== null) {
    const path = match[1]!;
    const acronym = match[2]!;
    if (!seen.has(acronym)) {
      seen.add(acronym);
      items.push({ acronym, detail_url: `${NPN_BASE_URL}${path}` });
    }
  }

  logger.info({ count: items.length }, "NPN species list parsed");
  return items;
}

/**
 * Extract a labeled field value from an HTML block.
 * Looks for a row/cell containing the label text and returns the adjacent value.
 */
function extractField(html: string, label: string): string | null {
  // Try to find table-row pattern: <td>Label</td><td>Value</td>
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tdPattern = new RegExp(
    `<td[^>]*>\\s*${escaped}\\s*</td>\\s*<td[^>]*>(.*?)</td>`,
    "is",
  );
  const tdMatch = tdPattern.exec(html);
  if (tdMatch) {
    return tdMatch[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
  }

  // Try definition list: <dt>Label</dt><dd>Value</dd>
  const dlPattern = new RegExp(
    `<dt[^>]*>\\s*${escaped}\\s*</dt>\\s*<dd[^>]*>(.*?)</dd>`,
    "is",
  );
  const dlMatch = dlPattern.exec(html);
  if (dlMatch) {
    return dlMatch[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
  }

  return null;
}

/**
 * Parse range_michigan as an array of county/region strings.
 */
function parseRange(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
}

/**
 * Fetch and parse a single species detail page.
 */
async function fetchSpeciesDetail(
  acronym: string,
  detailUrl: string,
): Promise<RawSpeciesDetail | null> {
  const res = await fetch(detailUrl, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
  });
  if (!res.ok) {
    logger.warn({ acronym, status: res.status }, "Failed to fetch NPN species detail page");
    return null;
  }
  const html = await res.text();

  // Extract main species data fields
  const latinName =
    extractField(html, "Latin Name") ??
    extractField(html, "Scientific Name") ??
    extractField(html, "Genus/Species") ??
    acronym;

  const latinSynonymGreg =
    extractField(html, "Latin Synonym") ??
    extractField(html, "Synonym") ??
    null;

  const commonName =
    extractField(html, "Common Name") ??
    extractField(html, "Common Names") ??
    acronym;

  const light = extractField(html, "Light");
  const moisture = extractField(html, "Moisture");
  const height = extractField(html, "Height");
  const floweringTime =
    extractField(html, "Flowering Time") ??
    extractField(html, "Bloom Time") ??
    extractField(html, "Flower Color/Bloom Time");
  const habitat = extractField(html, "Habitat");
  const notes = extractField(html, "Notes") ?? extractField(html, "Description");
  const rangeRaw =
    extractField(html, "Range") ??
    extractField(html, "Range in Michigan") ??
    extractField(html, "Michigan Range");
  const rangeMichigan = parseRange(rangeRaw);
  const npnPriceSizes =
    extractField(html, "Price/Sizes") ??
    extractField(html, "Availability") ??
    extractField(html, "Price");

  // Extract images: <img> tags within the species page
  const rawImages: Array<{ position: number; src: string; caption: string }> = [];
  const imgPattern = /<img[^>]+src="([^"]+)"[^>]*(?:alt="([^"]*)")?[^>]*>/gi;
  let imgMatch: RegExpExecArray | null;
  let position = 1;

  while ((imgMatch = imgPattern.exec(html)) !== null) {
    const src = imgMatch[1]!;
    const alt = imgMatch[2] ?? "";

    // Skip navigation/icon images — only species photos
    if (
      src.includes("/icons/") ||
      src.includes("/logo") ||
      src.includes("/nav") ||
      src.includes("favicon") ||
      alt.toLowerCase().includes("logo") ||
      alt.toLowerCase().includes("icon")
    ) {
      continue;
    }

    const absoluteSrc = src.startsWith("http") ? src : `${NPN_BASE_URL}${src}`;
    rawImages.push({ position, src: absoluteSrc, caption: alt });
    position++;
  }

  return {
    acronym,
    latin_name: latinName,
    latin_synonym_greg: latinSynonymGreg,
    common_name: commonName,
    light,
    moisture,
    height,
    flowering_time: floweringTime,
    habitat,
    notes,
    range_michigan: rangeMichigan,
    npn_price_sizes: npnPriceSizes,
    raw_images: rawImages,
    source_url: detailUrl,
  };
}

// ---------------------------------------------------------------------------
// Main import function
// ---------------------------------------------------------------------------

export interface NpnImportResult {
  speciesUpserted: number;
  aliasesUpserted: number;
  imagesUploaded: number;
  errors: Array<{ acronym: string; error: string }>;
}

export async function importNpn(
  filterAcronyms?: string[],
): Promise<NpnImportResult> {
  const result: NpnImportResult = {
    speciesUpserted: 0,
    aliasesUpserted: 0,
    imagesUploaded: 0,
    errors: [],
  };

  let items = await fetchSpeciesList();
  if (filterAcronyms && filterAcronyms.length > 0) {
    const filterSet = new Set(filterAcronyms.map((a) => a.toUpperCase()));
    items = items.filter((i) => filterSet.has(i.acronym));
  }

  for (const item of items) {
    try {
      logger.info({ acronym: item.acronym }, "NPN import: processing species");

      const detail = await fetchSpeciesDetail(item.acronym, item.detail_url);
      if (!detail) {
        result.errors.push({ acronym: item.acronym, error: "Failed to fetch detail page" });
        continue;
      }

      // Upload images to Cloudinary
      const images: NpnImage[] = [];
      for (const raw of detail.raw_images) {
        const publicId = `ann-arbor-npn/${item.acronym.toLowerCase()}/${raw.position}`;
        const cloudUrl = await uploadToCloudinary(raw.src, publicId, raw.caption);
        const kind = inferImageKind(raw.caption);
        images.push({
          position: raw.position,
          url: cloudUrl ?? raw.src,
          caption: raw.caption,
          kind,
        });
        if (cloudUrl) result.imagesUploaded++;
      }

      // Upsert species record
      await db
        .insert(npnSpeciesTable)
        .values({
          acronym: detail.acronym,
          latin_name: detail.latin_name,
          latin_synonym_greg: detail.latin_synonym_greg ?? undefined,
          common_name: detail.common_name,
          light: detail.light ?? undefined,
          moisture: detail.moisture ?? undefined,
          height: detail.height ?? undefined,
          flowering_time: detail.flowering_time ?? undefined,
          habitat: detail.habitat ?? undefined,
          notes: detail.notes ?? undefined,
          range_michigan: detail.range_michigan.length > 0 ? detail.range_michigan : undefined,
          npn_price_sizes: detail.npn_price_sizes ?? undefined,
          images,
          source_url: detail.source_url,
        })
        .onConflictDoUpdate({
          target: npnSpeciesTable.acronym,
          set: {
            latin_name: detail.latin_name,
            latin_synonym_greg: detail.latin_synonym_greg ?? null,
            common_name: detail.common_name,
            light: detail.light ?? null,
            moisture: detail.moisture ?? null,
            height: detail.height ?? null,
            flowering_time: detail.flowering_time ?? null,
            habitat: detail.habitat ?? null,
            notes: detail.notes ?? null,
            range_michigan: detail.range_michigan.length > 0 ? detail.range_michigan : null,
            npn_price_sizes: detail.npn_price_sizes ?? null,
            images,
            source_url: detail.source_url,
            scraped_at: sql`now()`,
          },
        });

      result.speciesUpserted++;

      // Build and upsert aliases
      const aliases = buildAliases(
        detail.acronym,
        detail.latin_name,
        detail.latin_synonym_greg,
        detail.common_name,
      );

      for (const alias of aliases) {
        await db
          .insert(npnNameAliasesTable)
          .values({ alias, acronym: detail.acronym })
          .onConflictDoUpdate({
            target: npnNameAliasesTable.alias,
            set: { acronym: detail.acronym },
          });
        result.aliasesUpserted++;
      }

      logger.info(
        { acronym: item.acronym, aliases: aliases.length, images: images.length },
        "NPN import: species complete",
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error({ err, acronym: item.acronym }, "NPN import: species failed");
      result.errors.push({ acronym: item.acronym, error: errMsg });
    }
  }

  logger.info(result, "NPN import complete");
  return result;
}

// ---------------------------------------------------------------------------
// Auto-import helper (startup)
// ---------------------------------------------------------------------------

export async function autoImportNpnIfEmpty(): Promise<void> {
  try {
    const [row] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(npnSpeciesTable);

    if (Number(row?.count ?? 0) > 0) {
      logger.info({ count: row?.count }, "NPN data already imported, skipping auto-import");
      return;
    }

    logger.info("NPN species table empty — starting background auto-import");
    const result = await importNpn();
    logger.info(result, "NPN auto-import complete");
  } catch (err) {
    logger.error({ err }, "NPN auto-import failed");
  }
}
