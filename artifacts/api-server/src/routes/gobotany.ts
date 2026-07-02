import { Router, type IRouter } from "express";
import { db, botanicalWebRefsCacheTable, speciesPageTextCacheTable } from "@workspace/db";
import { and, eq, gt } from "drizzle-orm";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  getGobotanyUrl,
  getGobotanySpeciesInformation,
} from "@workspace/external-data-providers/gobotany";
import {
  GOBOTANY_SOURCE_ID,
  GOBOTANY_LICENSES,
  GOBOTANY_LICENSE_NOTES,
  GOBOTANY_REGISTRY_ENTRY,
} from "../services/gobotany/metadata.js";
import { ensureGobotanyRegistryEntry } from "../services/gobotany/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const router: IRouter = Router();

const GOBOTANY_BASE = "https://gobotany.nativeplanttrust.org";

function isValidBinomial(input: string): boolean {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return false;
  const genus = parts[0].toLowerCase();
  const species = parts[1].toLowerCase();
  return /^[a-z]+$/.test(genus) && /^[a-z]+$/.test(species);
}

router.get("/gobotany/metadata", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: GOBOTANY_SOURCE_ID,
        service_name: GOBOTANY_REGISTRY_ENTRY.name,
        licenses: GOBOTANY_LICENSES,
        license_notes: GOBOTANY_LICENSE_NOTES,
        url_strategy: "direct_construction",
        url_pattern: `${GOBOTANY_BASE}/species/{genus}/{species}/`,
        validation: "http_get",
        registry_entry: {
          ...GOBOTANY_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.metadata_url),
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

router.get("/gobotany/url", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const speciesParam =
    typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }
  if (!isValidBinomial(speciesParam)) {
    res.status(400).json({
      error: "invalid_input",
      message: "species must be a binomial name (genus + species epithet, e.g. Acer rubrum)",
    });
    return;
  }

  const cacheKey = speciesParam.toLowerCase();
  const cacheThreshold = new Date(Date.now() - CACHE_TTL_MS);

  const cached = await db
    .select()
    .from(botanicalWebRefsCacheTable)
    .where(
      and(
        eq(botanicalWebRefsCacheTable.site_id, GOBOTANY_SOURCE_ID),
        eq(botanicalWebRefsCacheTable.scientific_name, cacheKey),
        gt(botanicalWebRefsCacheTable.cached_at, cacheThreshold),
      ),
    )
    .limit(1);

  if (cached.length > 0) {
    const hit = cached[0];
    const envelope = await buildEnvelope(
      {
        sourceId: GOBOTANY_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: hit.found,
        data: hit.found ? { url: hit.url } : null,
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: hit.url ?? null,
        queriedAt: hit.cached_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
    return;
  }

  const result = await getGobotanyUrl(speciesParam);
  const found = result!.found;
  const url = result!.url;
  const fetchedAt = new Date();

  await db
    .insert(botanicalWebRefsCacheTable)
    .values({
      site_id: GOBOTANY_SOURCE_ID,
      scientific_name: cacheKey,
      url: found ? url : null,
      found,
      validation_method: "http_get",
    })
    .onConflictDoUpdate({
      target: [botanicalWebRefsCacheTable.site_id, botanicalWebRefsCacheTable.scientific_name],
      set: { url: found ? url : null, found, validation_method: "http_get", cached_at: fetchedAt },
    });

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found,
      data: found ? { url } : null,
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: url,
      queriedAt: fetchedAt.toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/gobotany/species-information", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const speciesParam =
    typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  const refresh = req.query["refresh"] === "true";

  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }
  if (!isValidBinomial(speciesParam)) {
    res.status(400).json({
      error: "invalid_input",
      message: "species must be a binomial name (genus + species epithet, e.g. Acer rubrum)",
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
          eq(speciesPageTextCacheTable.site_id, GOBOTANY_SOURCE_ID),
          eq(speciesPageTextCacheTable.scientific_name, cacheKey),
        ),
      )
      .limit(1);

    if (cached.length > 0) {
      const hit = cached[0];
      const envelope = await buildEnvelope(
        {
          sourceId: GOBOTANY_SOURCE_ID,
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

  const result = await getGobotanySpeciesInformation(speciesParam);
  const fetchedAt = new Date();

  if (result.found || result.fetchError === null) {
    await db
      .insert(speciesPageTextCacheTable)
      .values({
        site_id: GOBOTANY_SOURCE_ID,
        scientific_name: cacheKey,
        url: result.found ? result.url : null,
        found: result.found,
        sections: result.sections ?? null,
        full_text: result.fullText ?? null,
      })
      .onConflictDoUpdate({
        target: [speciesPageTextCacheTable.site_id, speciesPageTextCacheTable.scientific_name],
        set: {
          url: result.found ? result.url : null,
          found: result.found,
          sections: result.sections ?? null,
          full_text: result.fullText ?? null,
          scraped_at: fetchedAt,
        },
      });
  }

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
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

export default router;
