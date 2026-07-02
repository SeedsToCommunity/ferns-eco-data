/**
 * DEVELOPER-ONLY ONE-TIME SCRIPT
 * Resolves Cloudinary URLs for seed_group_details[].images filenames and
 * writes them back into lib/internal-data-providers/src/lcscg/species-data.ts.
 *
 * Run: pnpm exec tsx src/services/lcscg/resolve-seed-group-image-urls.ts
 *
 * Requires: CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET env vars.
 * Safe to re-run — idempotent if URLs are already present.
 */

import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];
const CLOUD_NAME = "dqe2vv0fo";

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
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be set");
  }
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
      error?: { message: string };
    };
    if (data.error) throw new Error(`Cloudinary error: ${data.error.message}`);

    for (const r of data.resources ?? []) {
      if (r.resource_type !== "image") continue;
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

function filenameToStem(filename: string): string {
  return filename.replace(/\.[^.]+$/, "").toLowerCase();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log("Indexing Cloudinary folders for seed-group images...");

  const guideMaps = new Map<number, Map<string, string>>();
  for (const [guideIdStr, folder] of Object.entries(GUIDE_FOLDERS)) {
    const guideId = Number(guideIdStr);
    process.stdout.write(`  Indexing ${folder} ... `);
    const map = await indexFolder(folder);
    guideMaps.set(guideId, map);
    console.log(`${map.size} images`);
  }

  // -------------------------------------------------------------------------
  // Read and parse species-data.ts
  // -------------------------------------------------------------------------
  const __dir = dirname(fileURLToPath(import.meta.url));
  const dataPath = resolve(__dir, "../../../../../lib/internal-data-providers/src/lcscg/species-data.ts");
  const src = readFileSync(dataPath, "utf8");

  // Extract the interface block and the JSON array separately.
  // The file has the form:
  //   export interface LcscgSpeciesRecord { ... }
  //   export const LCSCG_SPECIES: LcscgSpeciesRecord[] = [ ... ];
  const interfaceMatch = src.match(/export interface LcscgSpeciesRecord \{[\s\S]*?\}/);
  if (!interfaceMatch) throw new Error("Could not find LcscgSpeciesRecord interface");

  // Parse the LCSCG_SPECIES array by extracting the JSON portion.
  // The array starts after "= [" and ends at the final "];"
  const arrayStart = src.indexOf("= [") + 2;
  const arrayEnd = src.lastIndexOf("];") + 1;
  const jsonText = src.slice(arrayStart, arrayEnd);

  type SeedGroupDetail = { name: string; description: string; images: string[]; image_urls?: (string | null)[] };
  type SpeciesRecord = {
    guide_id: number;
    species_id: string;
    scientific_name: string;
    common_name: string;
    family: string;
    photo_date: string;
    description: string;
    seed_group_names: string[];
    seed_group_details: SeedGroupDetail[];
    image_filenames: string[];
    image_urls: (string | null)[];
    page_number: number;
  };

  const species: SpeciesRecord[] = JSON.parse(jsonText);

  let resolved = 0;
  let unresolved = 0;

  for (const sp of species) {
    const map = guideMaps.get(sp.guide_id);
    if (!map) { console.warn(`No map for guide ${sp.guide_id}`); continue; }

    for (const sg of sp.seed_group_details) {
      sg.image_urls = sg.images.map((filename) => {
        const stem = filenameToStem(filename);
        const url = map.get(stem) ?? null;
        if (url) resolved++; else unresolved++;
        return url;
      });
    }
  }

  console.log(`\nResolved: ${resolved}  Unresolved: ${unresolved}`);
  if (unresolved > 0) {
    console.warn("WARNING: Some seed-group images could not be matched. Their image_urls will be null.");
  }

  // -------------------------------------------------------------------------
  // Update the type interface to add image_urls inside seed_group_details
  // -------------------------------------------------------------------------
  const updatedInterface = interfaceMatch[0].replace(
    /seed_group_details: Array<\{[^}]*\}>/,
    "seed_group_details: Array<{ name: string; description: string; images: string[]; image_urls: (string | null)[] }>"
  );

  // -------------------------------------------------------------------------
  // Rebuild the file
  // -------------------------------------------------------------------------
  const updatedArray = JSON.stringify(species, null, 2);

  const newSrc =
    `${updatedInterface}\n\n` +
    `  export const LCSCG_SPECIES: LcscgSpeciesRecord[] = ${updatedArray};\n`;

  // Preserve the original wrapping (the file may have a namespace/module wrapper).
  // Check if the original had a wrapper by looking for lines before the interface.
  const beforeInterface = src.slice(0, src.indexOf("export interface"));
  const afterArray = src.slice(arrayEnd + 1).trim();

  const finalSrc = beforeInterface + updatedInterface + "\n\n  export const LCSCG_SPECIES: LcscgSpeciesRecord[] = " + updatedArray + ";\n" + (afterArray ? "\n" + afterArray + "\n" : "");

  writeFileSync(dataPath, finalSrc, "utf8");
  console.log(`\nWrote updated species-data.ts (${finalSrc.length} bytes)`);
  process.exit(0);
}
