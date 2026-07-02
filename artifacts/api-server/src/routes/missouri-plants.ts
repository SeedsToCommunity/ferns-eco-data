import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable, speciesPageTextCacheTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  getMissouriPlantsUrl,
  getMissouriPlantsSpeciesInformation,
} from "@workspace/external-data-providers/missouri-plants";
import {
  MISSOURI_PLANTS_SOURCE_ID,
  MISSOURI_PLANTS_LICENSES,
  MISSOURI_PLANTS_LICENSE_NOTES,
  MISSOURI_PLANTS_REGISTRY_ENTRY,
} from "../services/missouri-plants/metadata.js";
import { ensureMissouriPlantsRegistryEntry } from "../services/missouri-plants/seed.js";
import { importMissouriPlants } from "../services/botanical-refs/importers/missouri-plants.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();
const SITE_ID = MISSOURI_PLANTS_SOURCE_ID;

router.get("/missouri-plants/metadata", async (req, res) => {
  await ensureMissouriPlantsRegistryEntry();
  const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: SITE_ID,
        service_name: MISSOURI_PLANTS_REGISTRY_ENTRY.name,
        licenses: MISSOURI_PLANTS_LICENSES,
        license_notes: MISSOURI_PLANTS_LICENSE_NOTES,
        url_strategy: "species_list_scrape",
        indexed_species_count: Number(count),
        list_source: "https://missouriplants.com/All_Species_list.html",
        registry_entry: {
          ...MISSOURI_PLANTS_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, MISSOURI_PLANTS_REGISTRY_ENTRY.metadata_url),
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

router.get("/missouri-plants/url", async (req, res) => {
  await ensureMissouriPlantsRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const result = await getMissouriPlantsUrl(speciesParam);

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "single-source-proxy",
      found: result.found,
      data: result.found ? { url: result.url } : null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: result.url,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/missouri-plants/species-information", async (req, res) => {
  await ensureMissouriPlantsRegistryEntry();

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

  const result = await getMissouriPlantsSpeciesInformation(speciesParam);

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

router.post("/missouri-plants/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureMissouriPlantsRegistryEntry();
    const result = await importMissouriPlants();
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
