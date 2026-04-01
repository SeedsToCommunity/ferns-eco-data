/**
 * One-time script: fetch real Cloudinary image URLs for all LCSCG species
 * and update the image_urls column in lcscg_species.
 *
 * Run: pnpm exec tsx src/services/lcscg/reimport-images.ts
 */
import { fileURLToPath } from "url";
import { db, lcscgSpeciesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];
const CLOUD_NAME = "dqe2vv0fo";

// Exact folder names as they exist in Cloudinary
const GUIDE_FOLDERS: Record<number, string> = {
  1271: "1271_usa_illinois_lakecounty_summerwoodlandforbs_v2",
  1272: "1272_usa_illinois_lakecounty_woodyplantsv2",
  1273: "1273_usa_illinois_lakecounty_summerwetlandgrassesandkinv2",
  1274: "1274_usa_illinois_lakecounty_summerwetlandforbs_v2_1",
  1275: "1275_usa_illinois_lakecounty_summerprairieforbsv2",
  1276: "1276_usa_illinois_lakecounty_summergrassesandkin_v2",
  1277: "1277_usa_illinois_lakecounty_springwoodlandforbsv2_0",
  1278: "1278_usa_illinois_lakecounty_fallwoodlandforbsv2",
  1279: "1279_usa_illinois_lakecounty_fallwetlandforbsv2_1",
  1280: "1280_usa_illinois_lakecounty_fallgrassesandkinv2_1",
  1281: "1281_usa_illinois_lakecounty_astersgoldenodsv2_0",
  1282: "1282_usa_illinois_lakecounty_fallprairieforbsv2_0",
};

async function indexFolder(folder: string): Promise<Map<string, string>> {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) throw new Error("Cloudinary credentials not set");
  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");
  const urlMap = new Map<string, string>();
  let nextCursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      expression: `folder:${folder}`,
      max_results: 500,
      fields: ["public_id", "secure_url", "format", "resource_type"],
    };
    if (nextCursor) body["next_cursor"] = nextCursor;

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      resources?: Array<{ public_id: string; secure_url: string; format: string; resource_type: string }>;
      next_cursor?: string;
      total_count?: number;
      error?: { message: string };
    };
    if (data.error) throw new Error(`Cloudinary error: ${data.error.message}`);

    for (const r of data.resources ?? []) {
      if (r.resource_type !== "image") continue;
      // Two upload patterns in Cloudinary:
      //   (a) "stem_XXXXXX"            — no folder prefix, has 6-char random suffix
      //   (b) "folder/stem"            — includes folder prefix, no random suffix
      // Normalise to just the stem (filename without extension) by:
      //   1. Strip folder prefix (everything up to and including the last "/")
      //   2. Optionally strip trailing "_XXXXXX" (exactly 6 alphanumeric chars)
      const withoutFolder = r.public_id.includes("/")
        ? r.public_id.split("/").pop()!
        : r.public_id;
      const baseStem = withoutFolder.replace(/_[a-zA-Z0-9]{6}$/, "").toLowerCase();
      urlMap.set(baseStem, r.secure_url);
    }
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return urlMap;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = await db.select({
    id: lcscgSpeciesTable.id,
    guide_id: lcscgSpeciesTable.guide_id,
    image_filenames: lcscgSpeciesTable.image_filenames,
  }).from(lcscgSpeciesTable);

  console.log(`Loaded ${rows.length} species records`);

  const guideMaps = new Map<number, Map<string, string>>();
  for (const [guideIdStr, folder] of Object.entries(GUIDE_FOLDERS)) {
    const guideId = Number(guideIdStr);
    console.log(`Indexing Cloudinary folder: ${folder}`);
    const map = await indexFolder(folder);
    guideMaps.set(guideId, map);
    console.log(`  -> ${map.size} images indexed`);
  }

  let updated = 0;
  let totalMatched = 0;
  let totalNull = 0;

  for (const row of rows) {
    const map = guideMaps.get(row.guide_id);
    if (!map) { console.warn(`No Cloudinary map for guide ${row.guide_id}`); continue; }

    const filenames = row.image_filenames as string[];
    const newUrls = filenames.map((filename) => {
      const stem = filename.replace(/\.[^.]+$/, "").toLowerCase();
      return map.get(stem) ?? null;
    });

    const matched = newUrls.filter((u) => u !== null).length;
    const nulled = newUrls.filter((u) => u === null).length;
    totalMatched += matched;
    totalNull += nulled;

    await db.update(lcscgSpeciesTable)
      .set({ image_urls: newUrls as string[] })
      .where(eq(lcscgSpeciesTable.id, row.id));
    updated++;
  }

  console.log(`\nDone. Updated ${updated} rows.`);
  console.log(`Matched URLs: ${totalMatched}`);
  console.log(`Null (no match): ${totalNull}`);

  process.exit(0);
}
