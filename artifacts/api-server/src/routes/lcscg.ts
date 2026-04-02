import { Router, type IRouter } from "express";
import { db, lcscgGuidesTable, lcscgSpeciesTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";
import {
  LCSCG_SOURCE_ID,
  LCSCG_DERIVATION_SUMMARY,
  LCSCG_DERIVATION_SCIENTIFIC,
  LCSCG_REGISTRY_ENTRY,
  LCSCG_PERMISSION_GRANTED,
  LCSCG_PERMISSION_STATUS,
} from "../services/lcscg/metadata.js";
import { ensureLcscgRegistryEntry } from "../services/lcscg/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: LCSCG_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/lcscg/guides"),
    derivation_summary: LCSCG_DERIVATION_SUMMARY,
    derivation_scientific: LCSCG_DERIVATION_SCIENTIFIC,
  };
}

router.get("/lcscg/metadata", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const [guideCount, speciesCount] = await Promise.all([
    db.$count(lcscgGuidesTable),
    db.$count(lcscgSpeciesTable),
  ]);

  res.json({
    service_id: LCSCG_SOURCE_ID,
    service_name: LCSCG_REGISTRY_ENTRY.name,
    permission_granted: LCSCG_PERMISSION_GRANTED,
    permission_status: LCSCG_PERMISSION_STATUS,
    guide_count: Number(guideCount),
    species_count: Number(speciesCount),
    registry_entry: {
      ...LCSCG_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, LCSCG_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, LCSCG_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/lcscg/metadata"),
      method: "static_metadata",
    },
  });
});

router.get("/lcscg/guides", async (req, res) => {
  const guides = await db.select().from(lcscgGuidesTable).orderBy(lcscgGuidesTable.guide_id);

  // Include per-guide species count for Explorer UI display
  const countRows = await db
    .select({ guide_id: lcscgSpeciesTable.guide_id, count: sql<number>`count(*)::int` })
    .from(lcscgSpeciesTable)
    .groupBy(lcscgSpeciesTable.guide_id);
  const countMap = new Map(countRows.map((r) => [r.guide_id, r.count]));

  const guidesWithCounts = guides.map((g) => ({
    ...g,
    species_count: countMap.get(g.guide_id) ?? 0,
  }));

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lcscg/guides"),
    provenance: buildProvenance(req),
    data: {
      guide_count: guides.length,
      guides: guidesWithCounts,
    },
  });
});

router.get("/lcscg/guide/:guideId", async (req, res) => {
  const rawId = parseInt(req.params["guideId"] ?? "", 10);

  if (isNaN(rawId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "guideId must be an integer between 1271 and 1282",
    });
    return;
  }

  const [guide] = await db
    .select()
    .from(lcscgGuidesTable)
    .where(eq(lcscgGuidesTable.guide_id, rawId))
    .limit(1);

  if (!guide) {
    res.json({
      found: false,
      queried_at: new Date(),
      source_url: resolveUrl(req, `/api/lcscg/guide/${rawId}`),
      provenance: { ...buildProvenance(req), matched_input: rawId },
      data: null,
    });
    return;
  }

  const species = await db
    .select()
    .from(lcscgSpeciesTable)
    .where(eq(lcscgSpeciesTable.guide_id, rawId))
    .orderBy(lcscgSpeciesTable.page_number, lcscgSpeciesTable.species_id);

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, `/api/lcscg/guide/${rawId}`),
    provenance: { ...buildProvenance(req), matched_input: rawId },
    data: {
      guide,
      species_count: species.length,
      species,
    },
  });
});

router.get("/lcscg/species", async (req, res) => {
  const nameParam = req.query["name"];

  if (!nameParam || typeof nameParam !== "string" || nameParam.trim() === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "name query parameter is required (scientific name, partial match supported)",
    });
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

  res.json({
    found: records.length > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, `/api/lcscg/species`),
    provenance: { ...buildProvenance(req), matched_input: name },
    data: {
      queried_name: name,
      result_count: records.length,
      records,
    },
  });
});

export default router;
