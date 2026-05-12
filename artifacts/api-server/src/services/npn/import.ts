// Scrapes nativeplant.com (Greg Vaclavek), uploads images to Cloudinary,
// and populates npn_species + npn_name_aliases.
// Triggered via POST /api/ann-arbor-npn/import (admin) or auto-runs at startup.
import { db, npnSpeciesTable, npnNameAliasesTable, type NpnImage } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] ?? "dqe2vv0fo";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];

const NPN_BASE_URL = "http://nativeplant.com";
// Actual URL structure discovered from live site:
//   List page:   /plants/list_plants  (links are relative: plant_page_template?Acronym=ACHMIL)
//   Detail page: /plants/plant_page_template?Acronym=ACHMIL
const NPN_SPECIES_LIST_URL = `${NPN_BASE_URL}/plants/list_plants`;
const NPN_DETAIL_BASE_URL = `${NPN_BASE_URL}/plants/plant_page_template?Acronym=`;

const DELAY_MIN_MS = 300;
const DELAY_RANGE_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Returns null if fetch fails, content is not JPEG (magic FFD8FF), or size < 512 bytes.
async function fetchAndValidateJpeg(url: string): Promise<Buffer | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      logger.warn({ url, status: res.status }, "Image fetch failed");
      return null;
    }
    const bytes = Buffer.from(await res.arrayBuffer());
    if (bytes.length < 512) {
      logger.warn({ url, size: bytes.length }, "Image too small — skipping");
      return null;
    }
    // JPEG magic bytes: 0xFF 0xD8 0xFF
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
      logger.warn(
        { url, header: bytes.slice(0, 4).toString("hex") },
        "Image is not a JPEG (magic-byte check failed) — skipping",
      );
      return null;
    }
    return bytes;
  } catch (err) {
    logger.warn({ url, err }, "Image fetch threw — skipping");
    return null;
  }
}

async function uploadToCloudinary(
  imageBytes: Buffer,
  publicId: string,
  caption: string,
): Promise<string | null> {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn("Cloudinary credentials not set — skipping image upload");
    return null;
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");
  const dataUri = `data:image/jpeg;base64,${imageBytes.toString("base64")}`;

  const formData = new URLSearchParams();
  formData.append("file", dataUri);
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

function inferImageKind(caption: string): "photograph" | "drawing" {
  const lower = caption.toLowerCase();
  if (lower.includes("pen & ink") || lower.includes("drawing")) {
    return "drawing";
  }
  return "photograph";
}

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
    // Index the synonym as-is so /species/{synonym} resolves correctly.
    // GENAND quirk: synonym slot holds "Closed Gentian" (common name); it is
    // indexed anyway so the common-name path resolves to GENAND as well.
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

async function fetchSpeciesList(): Promise<RawSpeciesListItem[]> {
  const res = await fetch(NPN_SPECIES_LIST_URL, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch NPN species list: HTTP ${res.status}`);
  }
  const html = await res.text();

  // List page at /plants/list_plants uses relative links:
  //   href="plant_page_template?Acronym=ACHMIL"
  // Detail pages are at /plants/plant_page_template?Acronym=ACHMIL
  const items: RawSpeciesListItem[] = [];
  const linkPattern = /href="plant_page_template\?Acronym=([A-Z0-9]+)"/g;
  let match: RegExpExecArray | null;
  const seen = new Set<string>();

  while ((match = linkPattern.exec(html)) !== null) {
    const acronym = match[1]!;
    if (!seen.has(acronym)) {
      seen.add(acronym);
      items.push({ acronym, detail_url: `${NPN_DETAIL_BASE_URL}${acronym}` });
    }
  }

  logger.info({ count: items.length }, "NPN species list parsed");
  return items;
}

// Extracts value from inline bold-label pattern: <b>Label:</b>(?:&nbsp;)?\s*VALUE
// Returns null when absent, empty, or "n/a".
function extractInlineField(html: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Value runs to the next newline or tag
  const pattern = new RegExp(`<b>${escaped}:?<\\/b>(?:&nbsp;)?\\s*([^\\n<]+)`, "i");
  const m = pattern.exec(html);
  if (!m) return null;
  const val = m[1]!.replace(/&nbsp;/g, " ").trim();
  if (!val || val.toLowerCase() === "n/a") return null;
  return val;
}

function parseRange(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
}

// Extracts full-size plant images from nativeplant.com detail pages.
// Structure per image block:
//   <a href="/plant_images/ACRONYM/1.jpg" alt="image"><img src="...thumb.jpg" .../></a><br>
//   <small>caption text</small>   ← optional
// Full-size URL comes from the <a href>; caption from the <small> tag.
function extractImages(
  html: string,
): Array<{ position: number; src: string; caption: string }> {
  const results: Array<{ position: number; src: string; caption: string }> = [];
  let position = 1;
  const seenSrcs = new Set<string>();

  // Match each image block: <a href="/plant_images/...jpg">...<br>\n?<small>caption</small>
  const blockPattern =
    /<a href="(\/plant_images\/[^"]+\.jpg)"[^>]*>[\s\S]*?<\/a><br>\s*(?:<small>([^<]*)<\/small>)?/gi;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(html)) !== null) {
    const relPath = match[1]!;
    const caption = (match[2] ?? "").trim();
    const src = `${NPN_BASE_URL}${relPath}`;
    if (seenSrcs.has(src)) continue;
    seenSrcs.add(src);
    results.push({ position: position++, src, caption });
  }

  return results;
}


async function fetchSpeciesDetail(
  acronym: string,
  detailUrl: string,
): Promise<RawSpeciesDetail | null> {
  const res = await fetch(detailUrl, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    logger.warn({ acronym, status: res.status }, "Failed to fetch NPN species detail page");
    return null;
  }
  const html = await res.text();

  // Common name from <h1>Great Blue Lobelia </h1>
  const h1Match = /<h1>([^<]+)<\/h1>/i.exec(html);
  const commonName = h1Match ? h1Match[1]!.trim() : acronym;

  // Latin name from <h2><i>Lobelia siphilitica</h2>
  const h2Match = /<h2>(?:<i>)?([^<\n]+?)(?:<\/i>)?<\/h2>/i.exec(html);
  const latinName = h2Match ? h2Match[1]!.trim() : acronym;

  // Latin synonym (Greg's nomenclature) from <h3>(a.k.a. Symphyotrichum cordifolium)</h3>
  // Note: GENAND has a common name here ("Closed Gentian") — indexed anyway per task spec.
  const h3Match = /<h3>\s*\(a\.k\.a\.\s*([^)<]+)\)/i.exec(html);
  const latinSynonymGreg = h3Match ? h3Match[1]!.trim() : null;

  // Ecological fields — inline <b>Label:</b> value pattern
  const light = extractInlineField(html, "Light");
  const moisture = extractInlineField(html, "Moisture");
  const height = extractInlineField(html, "Height");
  const floweringTime = extractInlineField(html, "Flowering Time");
  const notes = extractInlineField(html, "Notes");

  // Range in Michigan: value appears on the next line after the <b> tag
  // Pattern: <b>Range in Michigan: </b>\n\nSE,SW,NL,UP
  const rangeMatch = /<b>Range in Michigan:\s*<\/b>\s*\n([\s\S]*?)(?:<\/p>|<br>|<b>)/i.exec(html);
  const rangeRaw = rangeMatch ? rangeMatch[1]!.trim() : null;
  const rangeMichigan = parseRange(rangeRaw);

  // NPN prices/sizes: value (if any) follows the label on same or next line
  // Most species show &nbsp; with no actual content — captured as null when empty.
  const npnPriceSizes = extractInlineField(html, "NPN prices/ sizes");

  const rawImages = extractImages(html);

  return {
    acronym,
    latin_name: latinName,
    latin_synonym_greg: latinSynonymGreg,
    common_name: commonName,
    light,
    moisture,
    height,
    flowering_time: floweringTime,
    habitat: null, // "Habitat:" is a section header on the page, not a data field
    notes,
    range_michigan: rangeMichigan,
    npn_price_sizes: npnPriceSizes,
    raw_images: rawImages,
    source_url: detailUrl,
  };
}

export interface NpnImportResult {
  speciesUpserted: number;
  aliasesUpserted: number;
  imagesUploaded: number;
  imagesSkipped: number;
  errors: Array<{ acronym: string; error: string }>;
}

export async function importNpn(
  filterAcronyms?: string[],
): Promise<NpnImportResult> {
  const result: NpnImportResult = {
    speciesUpserted: 0,
    aliasesUpserted: 0,
    imagesUploaded: 0,
    imagesSkipped: 0,
    errors: [],
  };

  let items = await fetchSpeciesList();
  if (filterAcronyms && filterAcronyms.length > 0) {
    const filterSet = new Set(filterAcronyms.map((a) => a.toUpperCase()));
    items = items.filter((i) => filterSet.has(i.acronym));
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i]!;

    // Polite inter-request delay (skip before first request)
    if (i > 0) {
      await sleep(DELAY_MIN_MS + Math.floor(Math.random() * DELAY_RANGE_MS));
    }

    try {
      logger.info({ acronym: item.acronym, progress: `${i + 1}/${items.length}` }, "NPN import: processing species");

      const detail = await fetchSpeciesDetail(item.acronym, item.detail_url);
      if (!detail) {
        result.errors.push({ acronym: item.acronym, error: "Failed to fetch detail page" });
        continue;
      }

      // Upload images to Cloudinary. Only images that pass JPEG validation AND upload
      // successfully are included in the record. Non-JPEG responses and failed uploads
      // are skipped entirely (imagesSkipped++) to avoid storing ephemeral source URLs.
      const images: NpnImage[] = [];
      for (const raw of detail.raw_images) {
        const publicId = `ann-arbor-npn/${item.acronym.toLowerCase()}/${raw.position}`;
        const kind = inferImageKind(raw.caption);

        const imageBytes = await fetchAndValidateJpeg(raw.src);
        if (!imageBytes) {
          logger.warn({ acronym: item.acronym, src: raw.src }, "Non-JPEG image skipped");
          result.imagesSkipped++;
          continue;
        }

        const cloudUrl = await uploadToCloudinary(imageBytes, publicId, raw.caption);
        if (!cloudUrl) {
          logger.warn({ acronym: item.acronym, src: raw.src }, "Cloudinary upload failed — image omitted");
          result.imagesSkipped++;
          continue;
        }

        images.push({ position: raw.position, url: cloudUrl, caption: raw.caption, kind });
        result.imagesUploaded++;
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
    const importResult = await importNpn();
    logger.info(importResult, "NPN auto-import complete");
  } catch (err) {
    logger.error({ err }, "NPN auto-import failed");
  }
}
