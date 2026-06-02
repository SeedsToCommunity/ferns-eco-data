// Imports nativeplant.com (Greg Vaclavek) data into npn_species + npn_name_aliases.
//
// Data strategy (discovered from live-site exploration):
//   PRIMARY:  GET /plants/search/report  — Zope/MySQL report endpoint returns all
//             130 species in ONE request with: latin name, common name, light,
//             moisture, height, bloom time, flower color, growth_form (physiography),
//             C/W/S ecological scores, notes, Michigan range, and price.
//   SECONDARY: GET /plants/plant_page_template?Acronym=XXX (one per species) —
//             used ONLY for images (full-size URLs) and Greg's latin synonyms
//             (a.k.a. entries). All other fields come from the report.
//
// Column mapping confirmed from live site (report has 17 th headers but 15 td per row
// because Light and Moisture are merged into one cell in tds[5]):
//   tds[0]:  availability (*)
//   tds[1]:  thumbnail link  → contains Acronym=XXX
//   tds[2]:  acronym text
//   tds[3]:  latin name
//   tds[4]:  common name
//   tds[5]:  light + moisture combined (header says "Light" but cell merges both)
//   tds[6]:  height
//   tds[7]:  flowering time
//   tds[8]:  flower color
//   tds[9]:  growth_form (Forb / Grass / Sedge / Shrub / Tree / Vine)
//   tds[10]: conservatism_coefficient (C)
//   tds[11]: wetness_coefficient (W) — can be negative
//   tds[12]: shade_coefficient (S) — can be negative
//   tds[13]: notes
//   tds[14]: range_michigan (SE,SW,NL,UP)
//   tds[15]: price (always empty for all 130 species)
//
// light and moisture are parsed separately from the detail page since the report merges them.
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
  // light and moisture are merged in the report (tds[5]); they are parsed
  // separately from the detail page in fetchDetailData().
  light_moisture_combined: string | null;
  height: string | null;
  flowering_time: string | null;
  flower_color: string | null;
  growth_form: string | null;
  conservatism_coefficient: string | null;
  wetness_coefficient: string | null;
  shade_coefficient: string | null;
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
// The report has 17 <th> header columns but only 15 <td> per data row because
// the site renders Light and Moisture into a single merged cell (tds[5]).
// Correct td-to-field mapping (confirmed from live site):
//   tds[5]  → light+moisture combined (split via detail page)
//   tds[6]  → height
//   tds[7]  → flowering_time
//   tds[8]  → flower_color
//   tds[9]  → growth_form
//   tds[10] → conservatism_coefficient (C)
//   tds[11] → wetness_coefficient (W) — signed integer, can be negative
//   tds[12] → shade_coefficient (S) — signed integer, can be negative
//   tds[13] → notes
//   tds[14] → range_michigan
//   tds[15] → price (always empty)
function parseReportHtml(html: string): ReportSpeciesRow[] {
  const rows: ReportSpeciesRow[] = [];

  const rowPattern = /<tr[\s\S]*?<\/tr>/gi;
  let rowMatch: RegExpExecArray | null;

  while ((rowMatch = rowPattern.exec(html)) !== null) {
    const row = rowMatch[0]!;

    const acronymInLink = /Acronym=([A-Z0-9]+)/.exec(row);
    if (!acronymInLink) continue;
    const acronym = acronymInLink[1]!;

    const tds: string[] = [];
    const tdPattern = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch: RegExpExecArray | null;
    while ((tdMatch = tdPattern.exec(row)) !== null) {
      tds.push(tdText(tdMatch[1]!));
    }

    if (tds.length < 15) continue;

    const lightMoistureCombined = nullIfEmpty(tds[5]  ?? "");
    const height                = nullIfEmpty(tds[6]  ?? "");
    const bloomTime             = nullIfEmpty(tds[7]  ?? "");
    const flowerColor           = nullIfEmpty(tds[8]  ?? "");
    const growthForm            = nullIfEmpty(tds[9]  ?? "");
    const conservatism          = nullIfEmpty(tds[10] ?? "");
    const wetness               = nullIfEmpty(tds[11] ?? "");
    const shade                 = nullIfEmpty(tds[12] ?? "");
    const notes                 = nullIfEmpty(tds[13] ?? "");
    const regionRaw             = tds[14] ?? "";
    const priceRaw              = tds[15] ?? "";

    const rangeMichigan = regionRaw
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter(Boolean);

    rows.push({
      acronym,
      latin_name: nullIfEmpty(tds[3] ?? "") ?? acronym,
      common_name: nullIfEmpty(tds[4] ?? "") ?? acronym,
      light_moisture_combined: lightMoistureCombined,
      height,
      flowering_time: bloomTime,
      flower_color: flowerColor,
      growth_form: growthForm,
      conservatism_coefficient: conservatism,
      wetness_coefficient: wetness,
      shade_coefficient: shade,
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

// ─── Individual page parser (images + synonym + light/moisture) ───────────────

interface DetailData {
  latin_synonym_greg: string | null;
  light: string | null;
  moisture: string | null;
  raw_images: Array<{ position: number; src: string; caption: string }>;
}

// Extracts full-size plant images from nativeplant.com detail pages.
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

// Parse a labeled field like "<b>Light:</b> sun -light shade" from detail page HTML.
function parseDetailField(html: string, label: string): string | null {
  const pattern = new RegExp(`<b>${label}:</b>\\s*([^<]+)`, "i");
  const m = pattern.exec(html);
  if (!m) return null;
  const val = m[1]!
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  return val || null;
}

// Fetches an individual species page to extract images, Greg's latin synonym,
// and separate light + moisture values (which the report merges into one cell).
async function fetchDetailData(
  acronym: string,
  detailUrl: string,
): Promise<DetailData | null> {
  const res = await fetch(detailUrl, {
    headers: { "User-Agent": "FERNS-Botanical-Data-Aggregator/1.0 (ecologicalcommons.org)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) {
    logger.warn({ acronym, status: res.status }, "Failed to fetch NPN species detail page");
    return null;
  }
  const html = await res.text();

  // Latin synonym from <h3>(a.k.a. Symphyotrichum cordifolium)</h3>
  // GENAND has "Closed Gentian" here (common name, not taxonomic) — indexed anyway.
  const h3Match = /<h3>\s*\(a\.k\.a\.\s*([^)<]+)\)/i.exec(html);
  const latin_synonym_greg = h3Match ? h3Match[1]!.trim() : null;

  // Light and moisture are separate labeled fields on the detail page.
  const light = parseDetailField(html, "Light");
  const moisture = parseDetailField(html, "Moisture");

  const raw_images = extractImages(html);

  return { latin_synonym_greg, light, moisture, raw_images };
}

// ─── Main import ──────────────────────────────────────────────────────────────

export interface AnnArborNpnImportResult {
  speciesUpserted: number;
  aliasesUpserted: number;
  imagesUploaded: number;
  imagesSkipped: number;
  errors: Array<{ acronym: string; error: string }>;
}

export async function importNpn(
  filterAcronyms?: string[],
): Promise<AnnArborNpnImportResult> {
  const result: AnnArborNpnImportResult = {
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

  // Step 2: for each species, fetch individual page for images + synonym + light/moisture
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;

    if (i > 0) {
      await sleep(DELAY_MIN_MS + Math.floor(Math.random() * DELAY_RANGE_MS));
    }

    try {
      logger.info(
        { acronym: row.acronym, progress: `${i + 1}/${rows.length}` },
        "NPN import: processing species",
      );

      const detail = await fetchDetailData(row.acronym, row.detail_url);

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
      const light = detail?.light ?? null;
      const moisture = detail?.moisture ?? null;

      await db
        .insert(npnSpeciesTable)
        .values({
          acronym: row.acronym,
          latin_name: row.latin_name,
          latin_synonym_greg: latinSynonymGreg ?? undefined,
          common_name: row.common_name,
          light: light ?? undefined,
          moisture: moisture ?? undefined,
          height: row.height ?? undefined,
          flowering_time: row.flowering_time ?? undefined,
          flower_color: row.flower_color ?? undefined,
          growth_form: row.growth_form ?? undefined,
          conservatism_coefficient: row.conservatism_coefficient ?? undefined,
          wetness_coefficient: row.wetness_coefficient ?? undefined,
          shade_coefficient: row.shade_coefficient ?? undefined,
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
            light: light,
            moisture: moisture,
            height: row.height ?? null,
            flowering_time: row.flowering_time ?? null,
            flower_color: row.flower_color ?? null,
            growth_form: row.growth_form ?? null,
            conservatism_coefficient: row.conservatism_coefficient ?? null,
            wetness_coefficient: row.wetness_coefficient ?? null,
            shade_coefficient: row.shade_coefficient ?? null,
            notes: row.notes ?? null,
            range_michigan: row.range_michigan.length > 0 ? row.range_michigan : null,
            npn_price_sizes: row.npn_price_sizes ?? null,
            images,
            source_url: row.detail_url,
            scraped_at: sql`now()`,
          },
        });

      result.speciesUpserted++;

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

export async function autoImportAnnArborNpnIfEmpty(): Promise<void> {
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
