import { Router, type IRouter } from "express";
import { db, lcscgGuidesTable, lcscgSpeciesTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import {
  LCSCG_SOURCE_ID,
  LCSCG_GENERAL_SUMMARY,
  LCSCG_TECHNICAL_DETAILS,
  LCSCG_REGISTRY_ENTRY,
  LCSCG_LICENSES,
  LCSCG_LICENSE_NOTES,
} from "../services/lcscg/metadata.js";
import { ensureLcscgRegistryEntry } from "../services/lcscg/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/lcscg/metadata", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const queriedAt = new Date().toISOString();

  const [guideCount, speciesCount] = await Promise.all([
    db.$count(lcscgGuidesTable),
    db.$count(lcscgSpeciesTable),
  ]);

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: {
      service_id: LCSCG_SOURCE_ID,
      service_name: LCSCG_REGISTRY_ENTRY.name,
      licenses: LCSCG_LICENSES,
      license_notes: LCSCG_LICENSE_NOTES,
      guide_count: Number(guideCount),
      species_count: Number(speciesCount),
      registry_entry: {
        ...LCSCG_REGISTRY_ENTRY,
        metadata_url: resolveUrl(req, LCSCG_REGISTRY_ENTRY.metadata_url),
        explorer_url: resolveUrl(req, LCSCG_REGISTRY_ENTRY.explorer_url),
      },
      general_summary: LCSCG_GENERAL_SUMMARY,
      technical_details: LCSCG_TECHNICAL_DETAILS,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt,
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/guides", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const guides = await db.select().from(lcscgGuidesTable).orderBy(lcscgGuidesTable.guide_id);

  const countRows = await db
    .select({ guide_id: lcscgSpeciesTable.guide_id, count: sql<number>`count(*)::int` })
    .from(lcscgSpeciesTable)
    .groupBy(lcscgSpeciesTable.guide_id);
  const countMap = new Map(countRows.map((r) => [r.guide_id, r.count]));

  const guidesWithCounts = guides.map((g) => ({
    ...g,
    species_count: countMap.get(g.guide_id) ?? 0,
  }));

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: {
      guide_count: guides.length,
      guides: guidesWithCounts,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/guide/:guideId", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const rawId = parseInt(req.params["guideId"] ?? "", 10);

  if (isNaN(rawId)) {
    res.status(400).json(await buildEnvelope({
      sourceId: LCSCG_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "invalid_input", message: "guideId must be an integer between 1271 and 1282" },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const [guide] = await db
    .select()
    .from(lcscgGuidesTable)
    .where(eq(lcscgGuidesTable.guide_id, rawId))
    .limit(1);

  if (!guide) {
    res.json(await buildEnvelope({
      sourceId: LCSCG_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const species = await db
    .select()
    .from(lcscgSpeciesTable)
    .where(eq(lcscgSpeciesTable.guide_id, rawId))
    .orderBy(lcscgSpeciesTable.page_number, lcscgSpeciesTable.species_id);

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: {
      guide,
      species_count: species.length,
      species,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/species", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const nameParam = req.query["name"];

  if (!nameParam || typeof nameParam !== "string" || nameParam.trim() === "") {
    res.status(400).json(await buildEnvelope({
      sourceId: LCSCG_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "invalid_input", message: "name query parameter is required (scientific name, partial match supported)" },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const name = nameParam.trim();

  const records = await db
    .select({
      id: lcscgSpeciesTable.id,
      guide_id: lcscgSpeciesTable.guide_id,
      species_id: lcscgSpeciesTable.species_id,
      scientific_name: lcscgSpeciesTable.scientific_name,
      common_name: lcscgSpeciesTable.common_name,
      family: lcscgSpeciesTable.family,
      photo_date: lcscgSpeciesTable.photo_date,
      description: lcscgSpeciesTable.description,
      seed_group_names: lcscgSpeciesTable.seed_group_names,
      seed_group_details: lcscgSpeciesTable.seed_group_details,
      image_filenames: lcscgSpeciesTable.image_filenames,
      image_urls: lcscgSpeciesTable.image_urls,
      page_number: lcscgSpeciesTable.page_number,
      imported_at: lcscgSpeciesTable.imported_at,
      guide_title: lcscgGuidesTable.title,
      guide_season: lcscgGuidesTable.season,
      guide_habitat_type: lcscgGuidesTable.habitat_type,
      guide_cloudinary_folder: lcscgGuidesTable.cloudinary_folder,
    })
    .from(lcscgSpeciesTable)
    .innerJoin(lcscgGuidesTable, eq(lcscgSpeciesTable.guide_id, lcscgGuidesTable.guide_id))
    .where(
      or(
        ilike(lcscgSpeciesTable.scientific_name, `%${name}%`),
        ilike(lcscgSpeciesTable.common_name, `%${name}%`),
      ),
    )
    .orderBy(lcscgSpeciesTable.scientific_name);

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: records.length > 0,
    data: {
      queried_name: name,
      result_count: records.length,
      records,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

export default router;
