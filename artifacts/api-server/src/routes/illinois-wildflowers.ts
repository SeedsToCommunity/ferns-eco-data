import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  ILLINOIS_WILDFLOWERS_SOURCE_ID,
  ILLINOIS_WILDFLOWERS_GENERAL_SUMMARY,
  ILLINOIS_WILDFLOWERS_TECHNICAL_DETAILS,
  ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY,
  ILLINOIS_WILDFLOWERS_PERMISSION_GRANTED,
  ILLINOIS_WILDFLOWERS_PERMISSION_STATUS,
} from "../services/illinois-wildflowers/metadata.js";
import { ensureIllinoisWildflowersRegistryEntry } from "../services/illinois-wildflowers/seed.js";
import { importIllinoisWildflowers } from "../services/botanical-refs/importers/illinois-wildflowers.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();
const SITE_ID = ILLINOIS_WILDFLOWERS_SOURCE_ID;

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: SITE_ID,
    fetched_at: new Date(),
    method: "species_list_lookup",
    upstream_url: resolveUrl(req, "/api/illinois-wildflowers/metadata"),
    general_summary: ILLINOIS_WILDFLOWERS_GENERAL_SUMMARY,
    technical_details: ILLINOIS_WILDFLOWERS_TECHNICAL_DETAILS,
  };
}

router.get("/illinois-wildflowers/metadata", async (req, res) => {
  await ensureIllinoisWildflowersRegistryEntry();
  const totalCount = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
  const sectionCounts = await db
    .select({
      section: botanicalSpeciesListsTable.section,
      count: sql<number>`count(*)::int`,
    })
    .from(botanicalSpeciesListsTable)
    .where(eq(botanicalSpeciesListsTable.site_id, SITE_ID))
    .groupBy(botanicalSpeciesListsTable.section)
    .orderBy(botanicalSpeciesListsTable.section);

  res.json({
    service_id: SITE_ID,
    service_name: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.name,
    permission_granted: ILLINOIS_WILDFLOWERS_PERMISSION_GRANTED,
    permission_status: ILLINOIS_WILDFLOWERS_PERMISSION_STATUS,
    url_strategy: "species_list_scrape",
    indexed_entries_count: Number(totalCount),
    sections: sectionCounts,
    list_sources: [
      "https://www.illinoiswildflowers.info/prairie/plant_index.htm",
      "https://www.illinoiswildflowers.info/savanna/savanna_index.htm",
      "https://www.illinoiswildflowers.info/woodland/woodland_index.htm",
      "https://www.illinoiswildflowers.info/wetland/wetland_index.htm",
      "https://www.illinoiswildflowers.info/weeds/weed_index.htm",
      "https://www.illinoiswildflowers.info/grasses/grass_index.htm",
      "https://www.illinoiswildflowers.info/trees/tree_index.htm",
      "https://www.illinoiswildflowers.info/mosses/moss_index.html",
    ],
    registry_entry: {
      ...ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/illinois-wildflowers", async (req, res) => {
  await ensureIllinoisWildflowersRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const rows = await db
    .select()
    .from(botanicalSpeciesListsTable)
    .where(
      and(
        eq(botanicalSpeciesListsTable.site_id, SITE_ID),
        ilike(botanicalSpeciesListsTable.scientific_name, speciesParam),
      ),
    )
    .orderBy(botanicalSpeciesListsTable.section);

  const found = rows.length > 0;
  res.json({
    found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/illinois-wildflowers"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: found
      ? {
          species: rows[0].scientific_name,
          result_count: rows.length,
          results: rows.map((r) => ({
            url: r.url,
            section: r.section,
            imported_at: r.imported_at,
          })),
          validation_method: "species_list_lookup",
        }
      : null,
  });
});

router.post("/illinois-wildflowers/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureIllinoisWildflowersRegistryEntry();
    const result = await importIllinoisWildflowers();
    res.json({
      success: result.sections_failed.length === 0,
      queried_at: new Date(),
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "import_failed", message: String(err) });
  }
});

export default router;
