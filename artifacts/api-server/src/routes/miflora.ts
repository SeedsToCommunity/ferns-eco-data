import { Router, type IRouter } from "express";
import {
  buildCountiesCacheKey,
  buildImagesCacheKey,
  buildFloraSearchCacheKey,
  buildSpecTextCacheKey,
  buildSynonymsCacheKey,
  buildPImageCacheKey,
  fetchCounties,
  fetchImages,
  fetchFloraSearchSp,
  fetchSpecText,
  fetchSynonyms,
  fetchPImageInfo,
  type MifloraSpeciesRecord,
  type MifloraSynonymRecord,
} from "../services/miflora/connector.js";
import {
  lookupCounties,
  storeCounties,
  lookupImages,
  storeImages,
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
} from "@workspace/api-zod";
import { buildEnvelope, type Method, type CacheStatus } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

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

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildCountiesCacheKey(name);

  if (!refresh) {
    const cached = await lookupCounties(cacheKey);
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
    const result = await fetchCounties(name);
    const stored = await storeCounties(cacheKey, name, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: stored.raw_response ?? null,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora counties lookup failed");
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

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildImagesCacheKey(name);

  if (!refresh) {
    const cached = await lookupImages(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: cached.found ? (cached.raw_response ?? null) : null,
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await fetchImages(name);
    const stored = await storeImages(cacheKey, name, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: stored.found ? (stored.raw_response ?? null) : null,
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora images lookup failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

router.get("/miflora/flora_search_sp", async (req, res) => {
  await ensureMifloraRegistryEntry();

  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }
  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildFloraSearchCacheKey(name);

  if (!refresh) {
    const cached = await lookupFloraSearch(cacheKey);
    if (cached) {
      const { method, cacheStatus } = hitPair();
      res.json(await buildEnvelope({
        sourceId: MIFLORA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: cached.found,
        data: buildFloraSearchData(cached),
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await fetchFloraSearchSp(name);
    const stored = await storeFloraSearch(cacheKey, name, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: buildFloraSearchData(stored),
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora flora_search_sp failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildFloraSearchData(row: {
  plant_id?: number | null;
  raw_response: unknown;
}) {
  const rawResponse = row.raw_response as { records: MifloraSpeciesRecord[] } | null;
  const records = rawResponse?.records ?? [];
  const first = records[0] ?? null;
  return {
    plant_id: row.plant_id ?? first?.plant_id ?? null,
    scientific_name: first?.scientific_name ?? null,
    family_name: first?.family_name ?? null,
    na: first?.na ?? null,
    c: first?.c ?? null,
    wet: first?.wet ?? null,
    phys: first?.phys ?? null,
    common_name: first?.common_name ?? [],
    records,
  };
}

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
        data: buildSpecTextData(cached),
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
    const result = await fetchSpecText(id);
    const stored = await storeSpecText(cacheKey, id, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: buildSpecTextData(stored),
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
      permissionGranted: false,
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora spec_text failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildSpecTextData(row: {
  plant_id?: number | null;
  raw_response: unknown;
}) {
  const rawResponse = row.raw_response as { text: string | null } | null;
  return {
    plant_id: row.plant_id ?? null,
    text: rawResponse?.text ?? null,
  };
}

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
        data: buildSynonymsData(cached),
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await fetchSynonyms(id);
    const stored = await storeSynonyms(cacheKey, id, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: buildSynonymsData(stored),
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora synonyms failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildSynonymsData(row: {
  plant_id?: number | null;
  raw_response: unknown;
}) {
  const rawResponse = row.raw_response as { synonyms: MifloraSynonymRecord[] } | null;
  return {
    plant_id: row.plant_id ?? null,
    synonyms: rawResponse?.synonyms ?? [],
  };
}

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
        data: buildPImageData(cached),
        method,
        cacheStatus,
        sourceUrl: cached.upstream_url,
        queriedAt: cached.fetched_at.toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }
  }

  try {
    const result = await fetchPImageInfo(id);
    const stored = await storePImage(cacheKey, id, result);
    const { method, cacheStatus } = missPair();
    res.json(await buildEnvelope({
      sourceId: MIFLORA_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: stored.found,
      data: buildPImageData(stored),
      method,
      cacheStatus,
      sourceUrl: stored.upstream_url,
      queriedAt: stored.fetched_at.toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora pimage_info failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildPImageData(row: {
  plant_id?: number | null;
  raw_response: unknown;
}) {
  const rawResponse = row.raw_response as { image: unknown } | null;
  return {
    plant_id: row.plant_id ?? null,
    image: rawResponse?.image ?? null,
  };
}

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
        explorer_url: resolveUrl(req, MIFLORA_REGISTRY_ENTRY.explorer_url),
      },
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt,
  }, { registry: dbRegistryAccessor }));
});

export default router;
