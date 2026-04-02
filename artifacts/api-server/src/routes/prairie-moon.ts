import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import {
  PRAIRIE_MOON_SOURCE_ID,
  PRAIRIE_MOON_DERIVATION_SUMMARY,
  PRAIRIE_MOON_DERIVATION_SCIENTIFIC,
  PRAIRIE_MOON_REGISTRY_ENTRY,
  PRAIRIE_MOON_PERMISSION_GRANTED,
  PRAIRIE_MOON_PERMISSION_STATUS,
} from "../services/prairie-moon/metadata.js";
import { ensurePrairieMoonRegistryEntry } from "../services/prairie-moon/seed.js";
import { importPrairieMoon } from "../services/botanical-refs/importers/prairie-moon.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();
const SITE_ID = PRAIRIE_MOON_SOURCE_ID;

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: SITE_ID,
    fetched_at: new Date(),
    method: "species_list_lookup",
    upstream_url: resolveUrl(req, "/api/prairie-moon/metadata"),
    derivation_summary: PRAIRIE_MOON_DERIVATION_SUMMARY,
    derivation_scientific: PRAIRIE_MOON_DERIVATION_SCIENTIFIC,
  };
}

router.get("/prairie-moon/metadata", async (req, res) => {
  await ensurePrairieMoonRegistryEntry();
  const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
  res.json({
    service_id: SITE_ID,
    service_name: PRAIRIE_MOON_REGISTRY_ENTRY.name,
    permission_granted: PRAIRIE_MOON_PERMISSION_GRANTED,
    permission_status: PRAIRIE_MOON_PERMISSION_STATUS,
    url_strategy: "sitemap_scrape",
    indexed_species_count: Number(count),
    sitemap_source: "https://www.prairiemoon.com/sitemap.xml",
    registry_entry: {
      ...PRAIRIE_MOON_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, PRAIRIE_MOON_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, PRAIRIE_MOON_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/prairie-moon", async (req, res) => {
  await ensurePrairieMoonRegistryEntry();

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
    .limit(5);

  const found = rows.length > 0;
  res.json({
    found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/prairie-moon"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: found
      ? {
          species: rows[0].scientific_name,
          url: rows[0].url,
          validation_method: "species_list_lookup",
          imported_at: rows[0].imported_at,
        }
      : null,
  });
});

router.post("/prairie-moon/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensurePrairieMoonRegistryEntry();
    const result = await importPrairieMoon();
    res.json({
      success: result.errors.length === 0,
      queried_at: new Date(),
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "import_failed", message: String(err) });
  }
});

export default router;
