import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { buildEnvelope, type Method, type CacheStatus } from "@workspace/api-envelope";
import { fetchAndCacheSpeciesText } from "../services/botanical-refs/scraper.js";
import {
  PRAIRIE_MOON_SOURCE_ID,
  PRAIRIE_MOON_LICENSES,
  PRAIRIE_MOON_LICENSE_NOTES,
  PRAIRIE_MOON_REGISTRY_ENTRY,
} from "../services/prairie-moon/metadata.js";
import { ensurePrairieMoonRegistryEntry } from "../services/prairie-moon/seed.js";
import { importPrairieMoon } from "../services/botanical-refs/importers/prairie-moon.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();
const SITE_ID = PRAIRIE_MOON_SOURCE_ID;

function mapScrapeStatus(cs: "hit" | "miss" | "not_in_species_list"): [Method, CacheStatus] {
  if (cs === "hit") return ["cache_hit", "hit"];
  if (cs === "miss") return ["api_fetch", "miss"];
  return ["computed", "bypass"];
}

router.get("/prairie-moon/metadata", async (req, res) => {
  await ensurePrairieMoonRegistryEntry();
  const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: SITE_ID,
        service_name: PRAIRIE_MOON_REGISTRY_ENTRY.name,
        licenses: PRAIRIE_MOON_LICENSES,
        license_notes: PRAIRIE_MOON_LICENSE_NOTES,
        url_strategy: "sitemap_scrape",
        indexed_species_count: Number(count),
        sitemap_source: "https://www.prairiemoon.com/sitemap.xml",
        registry_entry: {
          ...PRAIRIE_MOON_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, PRAIRIE_MOON_REGISTRY_ENTRY.metadata_url),
        },
      },
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
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
  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found,
      data: found
        ? {
            species: rows[0].scientific_name,
            url: rows[0].url,
            validation_method: "species_list_lookup",
            imported_at: rows[0].imported_at,
          }
        : null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: found ? rows[0].url : null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/prairie-moon/species-text", async (req, res) => {
  await ensurePrairieMoonRegistryEntry();

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

  const [method, cacheStatus] = mapScrapeStatus(result.cache_status);

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found: result.found,
      data: result.found
        ? {
            species: speciesParam,
            url: result.url,
            sections: result.sections,
            full_text: result.full_text,
            scraped_at: result.scraped_at instanceof Date
              ? result.scraped_at.toISOString()
              : String(result.scraped_at),
            ...(result.fetch_error ? { fetch_error: result.fetch_error } : {}),
          }
        : result.fetch_error
          ? { species: speciesParam, url: result.url, fetch_error: result.fetch_error }
          : null,
      method,
      cacheStatus,
      sourceUrl: result.url,
      queriedAt: new Date().toISOString(),
      permissionGranted: false,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
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
