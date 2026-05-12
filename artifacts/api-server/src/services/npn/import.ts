// Imports nativeplant.com (Greg Vaclavek) data into npn_species + npn_name_aliases.
//
// Data strategy (discovered from live-site exploration):
//   PRIMARY:  GET /plants/search/report  — Zope/MySQL report endpoint returns all
//             130 species in ONE request with: latin name, common name, light,
//             moisture, height, bloom time, flower color, physiography (plant type),
//             numeric scores, notes, Michigan range, and price.
//   SECONDARY: GET /plants/plant_page_template?Acronym=XXX (one per species) —
//             used ONLY for images (full-size URLs) and Greg's latin synonyms
//             (a.k.a. entries). All other fields come from the report.
//
// This means ~131 total HTTP requests (1 + 130) vs ~260 before (130 list + 130 detail).
// Images are JPEG-validated and uploaded to Cloudinary; non-JPEG or failed uploads
// are omitted entirely (no source-URL fallback).
//
// Triggered via POST /api/ann-arbor-npn/import (admin) or auto-runs at startup.

import { db, npnSpeciesTable, npnNameAliasesTable, type NpnImage } from "@workspace/db";
import { sql } from "drizzle-orm";
import { logger } from "../../lib/logger.js";

const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] ?? "dqe2vv0fo";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];

const NPN_BASE_URL = "http://nativeplant.com";
const NPN_DETAIL_BASE_URL = `${NPN_BASE_URL}/plants/plant_page_template?Acronym=`;

// Zope/MySQL report endpoint — returns all NPN species in one structured HTML table.
// Parameters: check=1 (NPN plants only), all show_* flags enabled, no filters applied.
const NPN_REPORT_URL =
  `${NPN_BASE_URL}/plants/search/report` +
  `?check=1&sel_region=&sortkey=Scientific_Name&searchstr=&flower_color=` +
  `&Ssite=&Wsite=&C_Oper=gt&H_Oper=gt&W_Oper=gt&S_Oper=gt&HTSEL=0` +
  `&S=&W=&C=&bloom_time=&Origin=&butt_req=&gdn_req=&rain_req=` +
  `&show_height=1&show_region=1&show_price=1&show_Thumbs=0&Thumb_size=50` +
  `&show_color=1&show_notes=1&show_Phys=1&show_acronym=1&show_blooms=1` +
  `&show_common=1&show_latin=1&show_light=1&show_moisture=1&show_S=1&show_W=1&show_C=1`;

const DELAY_MIN_MS = 300;
const DELAY_RANGE_MS = 200;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Image utilities ──────────────────────────────────────────────────────────

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

// ─── Alias builder ────────────────────────────────────────────────────────────

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

// ─── Report endpoint parser ───────────────────────────────────────────────────

interface ReportSpeciesRow {
  acronym: string;
  latin_name: string;
  common_name: string;
  light: string | null;
  moisture: string | null;
  height: string | null;
  flowering_time: string | null;
  flower_color: string | null;
  physiography: string | null;
  notes: string | null;
  range_michigan: string[];
  npn_price_sizes: string | null;
  detail_url: string;
}

// Strip all HTML tags and decode common entities from a raw td innerHTML string.
function tdText(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function nullIfEmpty(s: string): string | null {
  return s === "" || s.toLowerCase() === "n/a" ? null : s;
}

// Parse the Zope/MySQL report HTML table into structured species rows.
// Column order (confirmed from live site with all show_* flags on):
//   0: availability (*)
//   1: thumbnail link  → contains Acronym=XXX
//   2: acronym text
//   3: latin name link
//   4: common name
//   5: light
//   6: moisture
//   7: height
//   8: bloom time
//   9: flower color
//  10: physiography (Forb / Grass / Sedge / Shrub / Tree / Vine / Fern)
//  11: S  (numeric light score)
//  12: W  (numeric moisture score)
//  13: C  (numeric color/companion score)
//  14: notes
//  15: region (SE,SW,NL,UP…)
//  16: price (usually empty)
function parseReportHtml(html: string): ReportSpeciesRow[] {
  const rows: ReportSpeciesRow[] = [];

  // Each data row contains a plant_page_template link in column 1.
  // We split on <tr> and process rows that have an Acronym link.
  const rowPattern = /<tr[\s\S]*?<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const row = rowMatch[0]!;

    // Skip rows without a species link
    const acronymInLink = /Acronym=([A-Z0-9]+)/.exec(row);
    if (!acronymInLink) continue;
    const acronym = acronymInLink[1]!;

    // Extract all <td>…</td> contents in order
    const tds: string[] = [];
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdPattern.exec(row)) !== null) {
      tds.push(tdText(tdMatch[1]!));
    }

    // Require at least 16 columns (the price column may be absent in some rows)
    if (tds.length < 15) continue;

    const light     = nullIfEmpty(tds[5]  ?? "");
    const moisture  = nullIfEmpty(tds[6]  ?? "");
    const height    = nullIfEmpty(tds[7]  ?? "");
    const bloomTime = nullIfEmpty(tds[8]  ?? "");
    const flowerColor = nullIfEmpty(tds[9]  ?? "");
    const physiography = nullIfEmpty(tds[10] ?? "");
    const notes     = nullIfEmpty(tds[14] ?? "");
    const regionRaw = tds[15] ?? "";
    const priceRaw  = tds[16] ?? "";

    const rangeMichigan = regionRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    rows.push({
      acronym,
      latin_name: nullIfEmpty(tds[3] ?? "") ?? acronym,
      common_name: nullIfEmpty(tds[4] ?? "") ?? acronym,
      light,
      moisture,
      height,
      flowering_time: bloomTime,
      flower_color: flowerColor,
      physiography,
      notes,
      range_michigan: rangeMichigan,
      npn_price_sizes: nullIfEmpty(priceRaw),
      detail_url: `${NPN_DETAIL_BASE_URL}${acronym}`,
    });
  }

  return rows;
}

// Fetch all NPN species in one request from the Zope/MySQL report endpoint.
async function fetchAllSpeciesFromReport(): Promise<ReportSpeciesRow[]> {
  const res = await fetch(NPN_REPORT_URL, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
    signal: AbortSignal.timeout(30000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch NPN report: HTTP ${res.status}`);
  }
  const html = await res.text();
  const rows = parseReportHtml(html);
  logger.info({ count: rows.length }, "NPN report parsed");
  return rows;
}

// ─── Individual page parser (images + synonym only) ───────────────────────────

interface ImageAndSynonymResult {
  latin_synonym_greg: string | null;
  raw_images: Array<{ position: number; src: string; caption: string }>;
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

// Fetches an individual species page to extract images and Greg's latin synonym.
// All other text data comes from the report endpoint.
async function fetchImagesAndSynonym(
  acronym: string,
  detailUrl: string,
): Promise<ImageAndSynonymResult | null> {
  const res = await fetch(detailUrl, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    logger.warn({ acronym, status: res.status }, "Failed to fetch NPN species detail page");
    return null;
  }
  const html = await res.text();

  // Latin synonym (Greg's nomenclature) from <h3>(a.k.a. Symphyotrichum cordifolium)</h3>
  // Note: GENAND has "Closed Gentian" here (common name, not taxonomic) — indexed anyway.
  const h3Match = /<h3>\s*\(a\.k\.a\.\s*([^)<]+)\)/i.exec(html);
  const latinSynonymGreg = h3Match ? h3Match[1]!.trim() : null;

  const raw_images = extractImages(html);

  return { latin_synonym_greg: latinSynonymGreg, raw_images };
}

// ─── Main import ──────────────────────────────────────────────────────────────

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

  // Step 1: one request for all species text data
  let rows = await fetchAllSpeciesFromReport();
  if (filterAcronyms && filterAcronyms.length > 0) {
    const filterSet = new Set(filterAcronyms.map((a) => a.toUpperCase()));
    rows = rows.filter((r) => filterSet.has(r.acronym));
  }

  // Step 2: for each species, fetch individual page for images + synonym only
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;

    // Polite inter-request delay (skip before first request)
    if (i > 0) {
      await sleep(DELAY_MIN_MS + Math.floor(Math.random() * DELAY_RANGE_MS));
    }

    try {
      logger.info(
        { acronym: row.acronym, progress: `${i + 1}/${rows.length}` },
        "NPN import: processing species",
      );

      const detail = await fetchImagesAndSynonym(row.acronym, row.detail_url);

      // Upload images to Cloudinary. Only images that pass JPEG validation AND upload
      // successfully are included in the record. Non-JPEG responses and failed uploads
      // are skipped entirely to avoid storing ephemeral source URLs.
      const images: NpnImage[] = [];
      const rawImages = detail?.raw_images ?? [];
      for (const raw of rawImages) {
        const publicId = `ann-arbor-npn/${row.acronym.toLowerCase()}/${raw.position}`;
        const kind = inferImageKind(raw.caption);

        const imageBytes = await fetchAndValidateJpeg(raw.src);
        if (!imageBytes) {
          logger.warn({ acronym: row.acronym, src: raw.src }, "Non-JPEG image skipped");
          result.imagesSkipped++;
          continue;
        }

        const cloudUrl = await uploadToCloudinary(imageBytes, publicId, raw.caption);
        if (!cloudUrl) {
          logger.warn({ acronym: row.acronym, src: raw.src }, "Cloudinary upload failed — image omitted");
          result.imagesSkipped++;
          continue;
        }

        images.push({ position: raw.position, url: cloudUrl, caption: raw.caption, kind });
        result.imagesUploaded++;
      }

      const latinSynonymGreg = detail?.latin_synonym_greg ?? null;

      // Upsert species record
      await db
        .insert(npnSpeciesTable)
        .values({
          acronym: row.acronym,
          latin_name: row.latin_name,
          latin_synonym_greg: latinSynonymGreg ?? undefined,
          common_name: row.common_name,
          light: row.light ?? undefined,
          moisture: row.moisture ?? undefined,
          height: row.height ?? undefined,
          flowering_time: row.flowering_time ?? undefined,
          flower_color: row.flower_color ?? undefined,
          physiography: row.physiography ?? undefined,
          notes: row.notes ?? undefined,
          range_michigan: row.range_michigan.length > 0 ? row.range_michigan : undefined,
          npn_price_sizes: row.npn_price_sizes ?? undefined,
          images,
          source_url: row.detail_url,
        })
        .onConflictDoUpdate({
          target: npnSpeciesTable.acronym,
          set: {
            latin_name: row.latin_name,
            latin_synonym_greg: latinSynonymGreg,
            common_name: row.common_name,
            light: row.light ?? null,
            moisture: row.moisture ?? null,
            height: row.height ?? null,
            flowering_time: row.flowering_time ?? null,
            flower_color: row.flower_color ?? null,
            physiography: row.physiography ?? null,
            notes: row.notes ?? null,
            range_michigan: row.range_michigan.length > 0 ? row.range_michigan : null,
            npn_price_sizes: row.npn_price_sizes ?? null,
            images,
            source_url: row.detail_url,
            scraped_at: sql`now()`,
          },
        });

      result.speciesUpserted++;

      // Build and upsert aliases
      const aliases = buildAliases(
        row.acronym,
        row.latin_name,
        latinSynonymGreg,
        row.common_name,
      );

      for (const alias of aliases) {
        await db
          .insert(npnNameAliasesTable)
          .values({ alias, acronym: row.acronym })
          .onConflictDoUpdate({
            target: npnNameAliasesTable.alias,
            set: { acronym: row.acronym },
          });
        result.aliasesUpserted++;
      }

      logger.info(
        { acronym: row.acronym, aliases: aliases.length, images: images.length },
        "NPN import: species complete",
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      logger.error({ err, acronym: row.acronym }, "NPN import: species failed");
      result.errors.push({ acronym: row.acronym, error: errMsg });
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
