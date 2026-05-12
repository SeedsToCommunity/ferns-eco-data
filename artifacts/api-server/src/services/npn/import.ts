// Scrapes nativeplant.com (Greg Vaclavek), uploads images to Cloudinary,
// and populates npn_species + npn_name_aliases.
// Triggered via POST /api/ann-arbor-npn/import (admin) or auto-runs at startup.
import { db, npnSpeciesTable, npnNameAliasesTable, type NpnImage } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] ?? "dqe2vv0fo";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];

const NPN_BASE_URL = "https://nativeplant.com";
const NPN_SPECIES_LIST_URL = `${NPN_BASE_URL}/species`;

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

function extractField(html: string, label: string): string | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Table row pattern: <td>Label</td><td>Value</td>
  const tdPattern = new RegExp(
    `<td[^>]*>\\s*${escaped}\\s*</td>\\s*<td[^>]*>(.*?)</td>`,
    "is",
  );
  const tdMatch = tdPattern.exec(html);
  if (tdMatch) {
    return tdMatch[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || null;
  }

  // Definition list: <dt>Label</dt><dd>Value</dd>
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

function parseRange(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(/[,;]/)
    .map((s) => s.replace(/<[^>]+>/g, "").trim())
    .filter(Boolean);
}

// Prefers <figure>/<figcaption>; falls back to bare <img alt>. Skips nav/icon images.
function extractImages(
  html: string,
): Array<{ position: number; src: string; caption: string }> {
  const results: Array<{ position: number; src: string; caption: string }> = [];
  let position = 1;

  const figurePattern = /<figure[^>]*>([\s\S]*?)<\/figure>/gi;
  let figMatch: RegExpExecArray | null;
  const seenSrcs = new Set<string>();

  while ((figMatch = figurePattern.exec(html)) !== null) {
    const block = figMatch[1]!;
    const imgM = /<img[^>]+src="([^"]+)"[^>]*>/i.exec(block);
    const capM = /<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i.exec(block);
    if (!imgM) continue;

    const src = imgM[1]!;
    if (isNavImage(src, "")) continue;
    const absoluteSrc = src.startsWith("http") ? src : `${NPN_BASE_URL}${src}`;
    if (seenSrcs.has(absoluteSrc)) continue;
    seenSrcs.add(absoluteSrc);

    const caption = capM
      ? capM[1]!.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
      : "";
    results.push({ position: position++, src: absoluteSrc, caption });
  }

  const imgPattern = /<img[^>]+src="([^"]+)"(?:[^>]*alt="([^"]*)")?[^>]*>/gi;
  let imgMatch: RegExpExecArray | null;

  while ((imgMatch = imgPattern.exec(html)) !== null) {
    const src = imgMatch[1]!;
    const alt = imgMatch[2] ?? "";
    if (isNavImage(src, alt)) continue;
    const absoluteSrc = src.startsWith("http") ? src : `${NPN_BASE_URL}${src}`;
    if (seenSrcs.has(absoluteSrc)) continue;
    seenSrcs.add(absoluteSrc);
    results.push({ position: position++, src: absoluteSrc, caption: alt });
  }

  return results;
}

function isNavImage(src: string, alt: string): boolean {
  const srcL = src.toLowerCase();
  const altL = alt.toLowerCase();
  return (
    srcL.includes("/icons/") ||
    srcL.includes("/logo") ||
    srcL.includes("/nav") ||
    srcL.includes("favicon") ||
    srcL.includes("button") ||
    altL.includes("logo") ||
    altL.includes("icon") ||
    altL.includes("navigation")
  );
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
    habitat,
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

      // Upload images to Cloudinary — validate JPEG before upload
      const images: NpnImage[] = [];
      for (const raw of detail.raw_images) {
        const publicId = `ann-arbor-npn/${item.acronym.toLowerCase()}/${raw.position}`;
        const kind = inferImageKind(raw.caption);

        const imageBytes = await fetchAndValidateJpeg(raw.src);
        if (!imageBytes) {
          // Not a valid JPEG — record with original URL but no Cloudinary copy
          logger.warn({ acronym: item.acronym, src: raw.src }, "Skipping non-JPEG image");
          result.imagesSkipped++;
          images.push({ position: raw.position, url: raw.src, caption: raw.caption, kind });
          continue;
        }

        const cloudUrl = await uploadToCloudinary(imageBytes, publicId, raw.caption);
        // Fall back to source URL when Cloudinary credentials are absent (dev environment)
        // or the upload fails. The image is still included in the record so the species
        // entry is complete; the URL will be the nativeplant.com origin instead of CDN.
        images.push({
          position: raw.position,
          url: cloudUrl ?? raw.src,
          caption: raw.caption,
          kind,
        });
        if (cloudUrl) result.imagesUploaded++;
        else result.imagesSkipped++;
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
