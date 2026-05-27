import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import { buildEnvelope, type Method, type CacheStatus } from "@workspace/api-envelope";
import { fetchAndCacheSpeciesText } from "../services/botanical-refs/scraper.js";
import {
  ILLINOIS_WILDFLOWERS_SOURCE_ID,
  ILLINOIS_WILDFLOWERS_LICENSES,
  ILLINOIS_WILDFLOWERS_LICENSE_NOTES,
  ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY,
} from "../services/illinois-wildflowers/metadata.js";
import { ensureIllinoisWildflowersRegistryEntry } from "../services/illinois-wildflowers/seed.js";
import { importIllinoisWildflowers } from "../services/botanical-refs/importers/illinois-wildflowers.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();
const SITE_ID = ILLINOIS_WILDFLOWERS_SOURCE_ID;

function mapScrapeStatus(cs: "hit" | "miss" | "not_in_species_list"): [Method, CacheStatus] {
  if (cs === "hit") return ["cache_hit", "hit"];
  if (cs === "miss") return ["api_fetch", "miss"];
  return ["computed", "bypass"];
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

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: SITE_ID,
        service_name: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.name,
        licenses: ILLINOIS_WILDFLOWERS_LICENSES,
        license_notes: ILLINOIS_WILDFLOWERS_LICENSE_NOTES,
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
  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found,
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
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: found ? rows[0].url : null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/illinois-wildflowers/species-text", async (req, res) => {
  await ensureIllinoisWildflowersRegistryEntry();

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
