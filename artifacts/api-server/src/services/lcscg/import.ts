import { ReplitConnectors } from "@replit/connectors-sdk";
import { fileURLToPath } from "url";
import { db, lcscgGuidesTable, lcscgSpeciesTable } from "@workspace/db";
import { sql } from "drizzle-orm";
import { GUIDE_METADATA, DRIVE_FOLDER_IDS } from "./metadata.js";
import { logger } from "../../lib/logger.js";

const CLOUDINARY_CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"] ?? "dqe2vv0fo";
const CLOUDINARY_API_KEY = process.env["CLOUDINARY_API_KEY"];
const CLOUDINARY_API_SECRET = process.env["CLOUDINARY_API_SECRET"];

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  format: string;
}

interface CloudinarySearchResult {
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count?: number;
}

interface PerSpeciesJson {
  attribution: {
    title: string;
    subTitle: string;
    version: string;
    authors: string;
    location: string;
    organization: string;
    license: string;
    attributionText: string;
  };
  family: string;
  seedGroups: Array<{ name: string; description: string; images: string[] }> | null;
  species: {
    id: string;
    commonName: string;
    scientificName: string;
    photoDate: string;
    description: string;
    images: string[];
    pageNumber: number;
  };
}

interface GuideLevelJson {
  id: string;
  fileName: string;
  status: string;
  header: {
    title: string;
    subTitle: string;
    version: string;
    authors: string;
    location: string;
    organization: string;
    license: string;
    attributionText: string;
  };
  intro: {
    harvestNotes: string;
    seedGroups: Array<{ name: string; description: string; images: string[] }>;
  };
  species: Array<unknown>;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

function buildCloudinaryUrl(cloudName: string, folder: string, filename: string): string {
  const stem = filename.replace(/\.[^.]+$/, "");
  return `https://res.cloudinary.com/${cloudName}/image/upload/${folder}/${stem}`;
}

async function fetchCloudinaryImages(folder: string): Promise<Map<string, string>> {
  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    logger.warn("Cloudinary credentials not set — image URLs will be empty");
    return new Map();
  }

  const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64");
  const urlMap = new Map<string, string>();
  let nextCursor: string | undefined;

  do {
    const body: Record<string, unknown> = {
      expression: `folder:${folder}`,
      max_results: 500,
      fields: ["public_id", "secure_url", "format"],
    };
    if (nextCursor) body["next_cursor"] = nextCursor;

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/search`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      logger.error({ status: res.status, folder }, "Cloudinary search failed");
      break;
    }

    const data = (await res.json()) as CloudinarySearchResult;
    for (const resource of data.resources ?? []) {
      const parts = resource.public_id.split("/");
      const stem = parts[parts.length - 1];
      const filename = `${stem}.${resource.format}`;
      urlMap.set(filename, resource.secure_url);
    }

    nextCursor = data.next_cursor;
  } while (nextCursor);

  return urlMap;
}

async function fetchDriveFolder(connectors: ReplitConnectors, folderId: string): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and mimeType = 'application/json' and trashed = false`);
  const fields = encodeURIComponent("files(id, name, mimeType)");
  const res = await connectors.proxy("google-drive", `/drive/v3/files?q=${q}&fields=${fields}&pageSize=500`, {
    method: "GET",
  });
  const data = (await res.json()) as { files: DriveFile[] };
  return data.files ?? [];
}

async function fetchDriveJson(connectors: ReplitConnectors, fileId: string): Promise<unknown> {
  const res = await connectors.proxy("google-drive", `/drive/v3/files/${fileId}?alt=media`, { method: "GET" });
  return res.json();
}

export async function importLcscg(filterGuideIds?: number[]): Promise<{ guidesUpserted: number; speciesUpserted: number }> {
  const connectors = new ReplitConnectors();
  let guidesUpserted = 0;
  let speciesUpserted = 0;

  const allGuideIds = Object.keys(DRIVE_FOLDER_IDS).map(Number);
  const guideIds = filterGuideIds ? allGuideIds.filter((id) => filterGuideIds.includes(id)) : allGuideIds;

  for (const guideId of guideIds) {
    const folderId = DRIVE_FOLDER_IDS[guideId];
    const meta = GUIDE_METADATA[guideId];

    if (!folderId || !meta) {
      logger.warn({ guideId }, "No folder ID or metadata for guide — skipping");
      continue;
    }

    logger.info({ guideId, folder: meta.cloudinary_folder }, "Importing guide...");

    const cloudinaryMap = await fetchCloudinaryImages(meta.cloudinary_folder);
    logger.info({ guideId, imageCount: cloudinaryMap.size }, "Cloudinary images indexed");

    const files = await fetchDriveFolder(connectors, folderId);
    const guideJsonFile = files.find((f) => !f.name.includes("_LakeCounty"));
    const speciesJsonFiles = files.filter((f) => f.name.includes("_LakeCounty"));

    logger.info({ guideId, speciesCount: speciesJsonFiles.length, hasGuideJson: !!guideJsonFile }, "Drive files found");

    let harvestNotes = "";
    let attributionText = `Lake County Seed Collection Guide | ${meta.title} | Lake County, Illinois, USA | Lake County Forest Preserve District | Authors: Kelly Schultz & Dale Shields | Photos by DJ Shields | License: CC BY-NC 4.0`;

    if (guideJsonFile) {
      try {
        const guideJson = (await fetchDriveJson(connectors, guideJsonFile.id)) as GuideLevelJson;
        harvestNotes = guideJson.intro?.harvestNotes ?? "";
        if (guideJson.header?.attributionText) {
          attributionText = guideJson.header.attributionText;
        }
      } catch (err) {
        logger.warn({ err, guideId }, "Failed to read guide-level JSON — using defaults");
      }
    }

    await db
      .insert(lcscgGuidesTable)
      .values({
        guide_id: guideId,
        title: meta.title,
        subtitle: meta.subtitle,
        season: meta.season,
        habitat_type: meta.habitat_type,
        authors: "Kelly Schultz; Dale Shields",
        license: "CC BY-NC 4.0",
        attribution_text: attributionText,
        harvest_notes: harvestNotes,
        version: "version 2",
        field_museum_url: `https://fieldguides.fieldmuseum.org/guides/guide/${guideId}`,
        cloudinary_folder: meta.cloudinary_folder,
        status: "live",
      })
      .onConflictDoUpdate({
        target: lcscgGuidesTable.guide_id,
        set: {
          title: meta.title,
          subtitle: meta.subtitle,
          season: meta.season,
          habitat_type: meta.habitat_type,
          harvest_notes: harvestNotes,
          attribution_text: attributionText,
          cloudinary_folder: meta.cloudinary_folder,
          imported_at: sql`now()`,
        },
      });

    guidesUpserted++;

    for (const spFile of speciesJsonFiles) {
      try {
        const spJson = (await fetchDriveJson(connectors, spFile.id)) as PerSpeciesJson;
        const sp = spJson.species;

        const seedGroupDetails = Array.isArray(spJson.seedGroups) ? spJson.seedGroups : [];
        const seedGroupNames = seedGroupDetails.map((g) => g.name);

        const imageFilenames = Array.isArray(sp.images) ? sp.images : [];
        const imageUrls = imageFilenames.map((filename) => {
          const url = cloudinaryMap.get(filename);
          if (url) return url;
          return buildCloudinaryUrl(CLOUDINARY_CLOUD_NAME, meta.cloudinary_folder, filename);
        });

        await db
          .insert(lcscgSpeciesTable)
          .values({
            guide_id: guideId,
            species_id: sp.id,
            scientific_name: sp.scientificName,
            common_name: sp.commonName,
            family: spJson.family ?? "",
            photo_date: sp.photoDate ?? "",
            description: sp.description ?? "",
            seed_group_names: seedGroupNames,
            seed_group_details: seedGroupDetails,
            image_filenames: imageFilenames,
            image_urls: imageUrls,
            page_number: sp.pageNumber ?? 0,
          })
          .onConflictDoUpdate({
            target: [lcscgSpeciesTable.guide_id, lcscgSpeciesTable.species_id],
            set: {
              scientific_name: sp.scientificName,
              common_name: sp.commonName,
              family: spJson.family ?? "",
              photo_date: sp.photoDate ?? "",
              description: sp.description ?? "",
              seed_group_names: seedGroupNames,
              seed_group_details: seedGroupDetails,
              image_filenames: imageFilenames,
              image_urls: imageUrls,
              page_number: sp.pageNumber ?? 0,
              imported_at: sql`now()`,
            },
          });

        speciesUpserted++;
      } catch (err) {
        logger.error({ err, file: spFile.name, guideId }, "Failed to import species record");
      }
    }

    logger.info({ guideId, speciesUpserted }, "Guide import complete");
  }

  return { guidesUpserted, speciesUpserted };
}

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  importLcscg()
    .then(({ guidesUpserted, speciesUpserted }) => {
      console.log(`LCSCG import complete: ${guidesUpserted} guides, ${speciesUpserted} species upserted`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Import failed:", err);
      process.exit(1);
    });
}
