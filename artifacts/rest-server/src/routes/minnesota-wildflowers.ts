import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable, speciesPageTextCacheTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  getMinnesotaWildflowersUrl,
  getMinnesotaWildflowersSpeciesInformation,
} from "@workspace/external-data-providers/minnesota-wildflowers";
import {
  MINNESOTA_WILDFLOWERS_SOURCE_ID,
  MINNESOTA_WILDFLOWERS_LICENSES,
  MINNESOTA_WILDFLOWERS_LICENSE_NOTES,
  MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY,
} from "../services/minnesota-wildflowers/metadata.js";
import { ensureMinnesotaWildflowersRegistryEntry } from "../services/minnesota-wildflowers/seed.js";
import { importMinnesotaWildflowers } from "../services/botanical-refs/importers/minnesota-wildflowers.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();
const SITE_ID = MINNESOTA_WILDFLOWERS_SOURCE_ID;

router.get("/minnesota-wildflowers/metadata", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();
  const count = await db.$count(botanicalSpeciesListsTable, eq(botanicalSpeciesListsTable.site_id, SITE_ID));

  const envelope = await buildEnvelope(
    {
      sourceId: SITE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: SITE_ID,
        service_name: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.name,
        licenses: MINNESOTA_WILDFLOWERS_LICENSES,
        license_notes: MINNESOTA_WILDFLOWERS_LICENSE_NOTES,
        url_strategy: "species_list_scrape",
        indexed_species_count: Number(count),
        list_source: "https://www.minnesotawildflowers.info/page/plants-by-name",
        registry_entry: {
          ...MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.metadata_url),
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

router.get("/minnesota-wildflowers/url", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const result = await getMinnesotaWildflowersUrl(speciesParam);

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

router.get("/minnesota-wildflowers/species-information", async (req, res) => {
  await ensureMinnesotaWildflowersRegistryEntry();

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

  const result = await getMinnesotaWildflowersSpeciesInformation(speciesParam);

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
