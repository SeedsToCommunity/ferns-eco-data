import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable, speciesPageTextCacheTable } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  getIllinoisWildflowersUrl,
  getIllinoisWildflowersSpeciesInformation,
} from "@workspace/external-data-providers/illinois-wildflowers";
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

router.get("/illinois-wildflowers/url", async (req, res) => {
  await ensureIllinoisWildflowersRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const result = await getIllinoisWildflowersUrl(speciesParam);

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found: result.found,
      data: result.found
        ? { results: result.results.map((r: { url: string; section: string }) => ({ url: r.url, section: r.section })) }
        : null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: result.found ? result.results[0].url : null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/illinois-wildflowers/species-information", async (req, res) => {
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

  const cacheKey = speciesParam.toLowerCase();

  if (!refresh) {
    const cached = await db
      .select()
      .from(speciesPageTextCacheTable)
      .where(
        and(
          eq(speciesPageTextCacheTable.site_id, SITE_ID),
          eq(speciesPageTextCacheTable.scientific_name, cacheKey),
        ),
      )
      .limit(1);

    if (cached.length > 0) {
      const hit = cached[0];
      const envelope = await buildEnvelope(
        {
          sourceId: SITE_ID,
          sourceKind: "single-source-proxy",
          found: hit.found,
          data: hit.found ? { sections: hit.sections, full_text: hit.full_text } : null,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: hit.url ?? null,
          queriedAt: hit.scraped_at.toISOString(),
          permissionGranted: false,
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  const result = await getIllinoisWildflowersSpeciesInformation(speciesParam);

  // Species not in imported list — no HTTP request was made, nothing to cache
  if (result.url === null) {
    const envelope = await buildEnvelope(
      {
        sourceId: SITE_ID,
        sourceKind: "single-source-proxy",
        found: false,
        data: null,
        method: "computed",
        cacheStatus: "bypass",
        sourceUrl: null,
        queriedAt: new Date().toISOString(),
        permissionGranted: false,
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
    return;
  }

  const fetchedAt = new Date();

  if (result.fetchError === null) {
    await db
      .insert(speciesPageTextCacheTable)
      .values({
        site_id: SITE_ID,
        scientific_name: cacheKey,
        url: result.url,
        found: result.found,
        sections: result.sections ?? null,
        full_text: result.fullText ?? null,
      })
      .onConflictDoUpdate({
        target: [speciesPageTextCacheTable.site_id, speciesPageTextCacheTable.scientific_name],
        set: {
          url: result.url,
          found: result.found,
          sections: result.sections ?? null,
          full_text: result.fullText ?? null,
          scraped_at: fetchedAt,
        },
      });
  }

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found: result.found,
      data: result.found ? { sections: result.sections, full_text: result.fullText } : null,
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: result.url,
      queriedAt: fetchedAt.toISOString(),
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
