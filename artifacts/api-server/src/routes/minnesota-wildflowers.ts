import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { fetchAndCacheSpeciesText } from "../services/botanical-refs/scraper.js";
import {
  MINNESOTA_WILDFLOWERS_SOURCE_ID,
  MINNESOTA_WILDFLOWERS_GENERAL_SUMMARY,
  MINNESOTA_WILDFLOWERS_TECHNICAL_DETAILS,
  MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY,
  MINNESOTA_WILDFLOWERS_PERMISSION_GRANTED,
  MINNESOTA_WILDFLOWERS_PERMISSION_STATUS,
} from "../services/minnesota-wildflowers/metadata.js";
import { ensureMinnesotaWildflowersRegistryEntry } from "../services/minnesota-wildflowers/seed.js";
import { importMinnesotaWildflowers } from "../services/botanical-refs/importers/minnesota-wildflowers.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();
const SITE_ID = MINNESOTA_WILDFLOWERS_SOURCE_ID;

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: SITE_ID,
    fetched_at: new Date(),
    method: "species_list_lookup",
    upstream_url: resolveUrl(req, "/api/minnesota-wildflowers/metadata"),
    general_summary: MINNESOTA_WILDFLOWERS_GENERAL_SUMMARY,
    technical_details: MINNESOTA_WILDFLOWERS_TECHNICAL_DETAILS,
  };
}

router.get("/minnesota-wildflowers/metadata", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();
  const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));
  res.json({
    service_id: SITE_ID,
    service_name: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.name,
    permission_granted: MINNESOTA_WILDFLOWERS_PERMISSION_GRANTED,
    permission_status: MINNESOTA_WILDFLOWERS_PERMISSION_STATUS,
    url_strategy: "species_list_scrape",
    indexed_species_count: Number(count),
    list_source: "https://www.minnesotawildflowers.info/page/plants-by-name",
    registry_entry: {
      ...MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/minnesota-wildflowers", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

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
    source_url: resolveUrl(req, "/api/minnesota-wildflowers"),
    provenance: filterProvenance({ ...buildProvenance(req), matched_input: speciesParam }, verbosity),
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

router.get("/minnesota-wildflowers/species-text", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  const refresh = req.query["refresh"] === "true";

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
    .limit(1);

  const speciesUrl = rows.length > 0 ? rows[0].url : null;
  const cacheKey = speciesParam.toLowerCase();
  const result = await fetchAndCacheSpeciesText(SITE_ID, cacheKey, speciesUrl, refresh);

  res.json({
    found: result.found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/minnesota-wildflowers/species-text"),
    cache_status: result.cache_status,
    scraped_at: result.scraped_at,
    ...(result.fetch_error ? { fetch_error: result.fetch_error } : {}),
    provenance: filterProvenance({ ...buildProvenance(req), matched_input: speciesParam }, verbosity),
    data: result.found
      ? {
          species: speciesParam,
          url: result.url,
          sections: result.sections,
          full_text: result.full_text,
        }
      : null,
  });
});

router.post("/minnesota-wildflowers/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureMinnesotaWildflowersRegistryEntry();
    const result = await importMinnesotaWildflowers();
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
