import { Router, type IRouter } from "express";
import {
  buildCountiesCacheKey,
  buildImagesCacheKey,
  buildFloraSearchCacheKey,
  buildSpecTextCacheKey,
  buildSynonymsCacheKey,
  buildPImageCacheKey,
} from "../services/miflora/connector.js";
import {
  lookupLocsSp,
  storeLocsSp,
  lookupAllimageInfo,
  storeAllimageInfo,
  lookupFloraSearch,
  storeFloraSearch,
  lookupSpecText,
  storeSpecText,
  lookupSynonyms,
  storeSynonyms,
  lookupPImage,
  storePImage,
} from "../services/miflora/cache.js";
import {
  MIFLORA_SOURCE_ID,
  MIFLORA_ATTRIBUTION,
  MIFLORA_LICENSES,
  MIFLORA_LICENSE_NOTES,
  MIFLORA_REGISTRY_ENTRY,
} from "../services/miflora/metadata.js";
import { ensureMifloraRegistryEntry } from "../services/miflora/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  GetMifloraCountiesQueryParams,
  GetMifloraImagesQueryParams,
  GetMifloraFloraSearchQueryParams,
} from "@workspace/api-zod";
import { buildEnvelope, type Method, type CacheStatus } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";
import {
  getMichiganFloraFloraSearchSp,
  getMichiganFloraLocsSp,
  getMichiganFloraAllimageInfo,
  getMichiganFloraSpecText,
  getMichiganFloraSynonyms,
  getMichiganFloraPimageInfo,
  MichiganFloraApiError,
} from "@workspace/external-data-providers/michigan-flora";

const router: IRouter = Router();

function hitPair(): { method: Method; cacheStatus: CacheStatus } {
  return { method: "cache_hit", cacheStatus: "hit" };
}

function missPair(): { method: Method; cacheStatus: CacheStatus } {
  return { method: "api_fetch", cacheStatus: "miss" };
}

router.get("/miflora/locs_sp", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const parsed = GetMifloraCountiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const plantId = parsed.data.id;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildCountiesCacheKey(plantId);

  if (!refresh) {
    const cached = await lookupLocsSp(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.raw_response ?? null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraLocsSp(plantId);
    const stored = await storeLocsSp(cacheKey, plantId, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: { locations: result.locations },
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora locs_sp failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/allimage_info", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const parsed = GetMifloraImagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const plantId = parsed.data.id;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildImagesCacheKey(plantId);

  if (!refresh) {
    const cached = await lookupAllimageInfo(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: Array.isArray(cached.raw_response) ? cached.raw_response : [],
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraAllimageInfo(plantId);
    const stored = await storeAllimageInfo(cacheKey, plantId, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: result.images,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora allimage_info failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/flora_search_sp", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const parsed = GetMifloraFloraSearchQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const scientificName = parsed.data.scientific_name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildFloraSearchCacheKey(scientificName);

  if (!refresh) {
    const cached = await lookupFloraSearch(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.raw_response ?? null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraFloraSearchSp(scientificName);
    const stored = await storeFloraSearch(cacheKey, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: result.records,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora flora_search_sp failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/spec_text", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpecTextCacheKey(id);

  if (!refresh) {
    const cached = await lookupSpecText(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.raw_response ?? null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
        permissionGranted: false,
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraSpecText(id);
    const stored = await storeSpecText(cacheKey, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: { text: result.text },
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
      permissionGranted: false,
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora spec_text failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/synonyms", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSynonymsCacheKey(id);

  if (!refresh) {
    const cached = await lookupSynonyms(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.raw_response ?? null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraSynonyms(id);
    const stored = await storeSynonyms(cacheKey, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: result.synonyms,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora synonyms failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/pimage_info", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildPImageCacheKey(id);

  if (!refresh) {
    const cached = await lookupPImage(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.raw_response ?? null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await getMichiganFloraPimageInfo(id);
    const stored = await storePImage(cacheKey, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: result.image,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    if (err instanceof MichiganFloraApiError) {
      res.status(502).json({ error: "upstream_error", message: err.message });
      return;
    }
    req.log.error({ err }, "Michigan Flora pimage_info failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/metadata", async (req, res) => {
  await ensureMifloraRegistryEntry();
  const queriedAt = new Date().toISOString();

  res.json(await buildEnvelope({
    sourceId: MIFLORA_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: {
      service_id: MIFLORA_SOURCE_ID,
      service_name: MIFLORA_REGISTRY_ENTRY.name,
      licenses: MIFLORA_LICENSES,
      license_notes: MIFLORA_LICENSE_NOTES,
      attribution: MIFLORA_ATTRIBUTION,
      registry_entry: {
        ...MIFLORA_REGISTRY_ENTRY,
        metadata_url: resolveUrl(req, MIFLORA_REGISTRY_ENTRY.metadata_url),
      },
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt,
  }, { registry: dbRegistryAccessor }));
});

export default router;
