// NatureServe routes — EDP-wired (Task #304).
// Envelope Contract v1: docs/data-layer-contract.md
// All routes use buildEnvelope(). Data is verbatim upstream JSON in all cache and live paths.

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  postNatureserveSpeciesSearch,
  postNatureserveSearch,
  getNatureserveTaxon,
  type NatureserveApiError as NatureserveApiErrorType,
} from "@workspace/external-data-providers/natureserve";
import {
  buildSpeciesCacheKey,
  buildSearchCacheKey,
} from "../services/natureserve/connector.js";
import {
  lookupSpeciesCache,
  storeSpeciesCache,
  lookupEcosystemsCache,
  storeEcosystemsCache,
  lookupTaxonCache,
  storeTaxonCache,
} from "../services/natureserve/cache.js";
import {
  NATURESERVE_SOURCE_ID,
  NATURESERVE_GENERAL_SUMMARY,
  NATURESERVE_TECHNICAL_DETAILS,
  NATURESERVE_REGISTRY_ENTRY,
} from "../services/natureserve/metadata.js";
import { ensureNatureserveRegistryEntry } from "../services/natureserve/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/natureserve/speciesSearch", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpeciesCacheKey(name);

  await ensureNatureserveRegistryEntry();

  if (!refresh) {
    const cached = await lookupSpeciesCache(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: NATURESERVE_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: (cached.raw as any)?.results?.length > 0,
          data: cached.raw,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const body = {
      criteriaType: "species",
      textCriteria: [{ paramType: "quickSearch", searchToken: name }],
      pagingOptions: { recordsPerPage: 5, page: 0 },
    };
    const result = await postNatureserveSpeciesSearch(body);
    const stored = await storeSpeciesCache(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: NATURESERVE_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: (stored.raw as any)?.results?.length > 0,
        data: stored.raw,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "NatureServe species fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

const VALID_RECORD_TYPES = ["ECOSYSTEM", "SPECIES", "COMMUNITY", "GROUP", "ASSOCIATION"] as const;

router.get("/natureserve/search", async (req, res) => {
  const rawQ = req.query.q;
  if (!rawQ || typeof rawQ !== "string" || rawQ.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "q is required and must be a non-empty string" });
    return;
  }
  const q = rawQ.trim();

  const rawRecordType = typeof req.query.recordType === "string" ? req.query.recordType.trim().toUpperCase() : "ECOSYSTEM";
  if (!(VALID_RECORD_TYPES as readonly string[]).includes(rawRecordType)) {
    res.status(400).json({ error: "invalid_input", message: `recordType must be one of: ${VALID_RECORD_TYPES.join(", ")}` });
    return;
  }

  const rawLimit = req.query.limit;
  const limit = typeof rawLimit === "string" ? Math.min(50, Math.max(1, parseInt(rawLimit, 10) || 10)) : 10;
  const rawPage = req.query.page;
  const page = typeof rawPage === "string" ? Math.max(0, parseInt(rawPage, 10) || 0) : 0;
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";

  const cacheKey = buildSearchCacheKey(q, rawRecordType, limit, page);

  await ensureNatureserveRegistryEntry();

  if (!refresh) {
    const cached = await lookupEcosystemsCache(cacheKey);
    if (cached) {
      const totalResults = (cached.raw as any)?.resultsSummary?.totalResults ?? 0;
      const results = (cached.raw as any)?.results ?? [];
      const envelope = await buildEnvelope(
        {
          sourceId: NATURESERVE_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: results.length > 0,
          data: cached.raw,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
          pagination: {
            has_more: results.length < totalResults,
            next: null,
            total: totalResults,
          },
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const body = {
      criteriaType: "combined",
      recordTypeCriteria: [{ paramType: "recordType", recordType: rawRecordType }],
      textCriteria: [{ paramType: "quickSearch", searchToken: q }],
      pagingOptions: { recordsPerPage: limit, page },
    };
    const result = await postNatureserveSearch(body);
    const stored = await storeEcosystemsCache(cacheKey, result);
    const totalResults = (stored.raw as any)?.resultsSummary?.totalResults ?? 0;
    const results = (stored.raw as any)?.results ?? [];
    const envelope = await buildEnvelope(
      {
        sourceId: NATURESERVE_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: results.length > 0,
        data: stored.raw,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
        pagination: {
          has_more: results.length < totalResults,
          next: null,
          total: totalResults,
        },
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "NatureServe search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

router.get("/natureserve/taxon/:uniqueId", async (req, res) => {
  const uniqueId = req.params.uniqueId;
  if (!uniqueId || uniqueId.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "uniqueId is required and must be a non-empty string" });
    return;
  }

  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = `natureserve:taxon:${uniqueId}`;

  await ensureNatureserveRegistryEntry();

  if (!refresh) {
    const cached = await lookupTaxonCache(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: NATURESERVE_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: true,
          data: cached.raw,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await getNatureserveTaxon(uniqueId);
    const stored = await storeTaxonCache(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: NATURESERVE_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.raw,
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err: unknown) {
    const nsErr = err as { name?: string; statusCode?: number };
    if (nsErr?.name === "NatureserveApiError" && nsErr?.statusCode === 404) {
      res.status(404).json({ error: "not_found", message: `NatureServe taxon not found: ${uniqueId}` });
      return;
    }
    req.log.error({ err }, "NatureServe taxon fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

router.get("/natureserve/metadata", async (req, res) => {
  await ensureNatureserveRegistryEntry();

  const speciesCountRow = await db.select({ count: count() }).from(natureserveSpeciesCacheTable);
  const speciesCacheCount = speciesCountRow[0]?.count ?? 0;

  const ecosystemsCountRow = await db.select({ count: count() }).from(natureserveEcosystemsCacheTable);
  const ecosystemsCacheCount = ecosystemsCountRow[0]?.count ?? 0;

  const envelope = await buildEnvelope(
    {
      sourceId: NATURESERVE_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        description: NATURESERVE_REGISTRY_ENTRY.description,
        general_summary: NATURESERVE_GENERAL_SUMMARY,
        technical_details: NATURESERVE_TECHNICAL_DETAILS,
        licenses: NATURESERVE_REGISTRY_ENTRY.licenses,
        license_notes: NATURESERVE_REGISTRY_ENTRY.license_notes,
        cache_stats: {
          species_cached: speciesCacheCount,
          ecosystems_cached: ecosystemsCacheCount,
          ttl_days: { species: 30, ecosystems: 7 },
        },
        metadata_url: resolveUrl(req, NATURESERVE_REGISTRY_ENTRY.metadata_url),
        website_url_patterns: NATURESERVE_REGISTRY_ENTRY.website_url_patterns,
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

export default router;
