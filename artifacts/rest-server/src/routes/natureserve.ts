// NatureServe routes — envelope-migrated (Task #178).
// Envelope Contract v1: docs/data-layer-contract.md
// All routes use buildEnvelope(). See VIOLATION comments for plan #148 regressions deferred to plans 16–18.

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  searchSpecies,
  buildSpeciesCacheKey,
  searchByRecordType,
  buildSearchCacheKey,
  type NatureserveSearchItem,
} from "../services/natureserve/connector.js";
import {
  lookupSpeciesCache,
  storeSpeciesCache,
  lookupEcosystemsCache,
  storeEcosystemsCache,
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

// VIOLATION: plan #148 regression — state scoping not supported by upstream speciesSearch endpoint.
// DEFAULT_STATE and the state query parameter add a FERNS-invented parameter with no upstream equivalent.
// Deferred to plans 16–18.
const DEFAULT_STATE = "MI";

router.get("/natureserve/speciesSearch", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  // VIOLATION: plan #148 regression — state scoping not supported by upstream speciesSearch endpoint.
  // Deferred to plans 16–18.
  const rawState = typeof req.query.state === "string" ? req.query.state.trim().toUpperCase() : DEFAULT_STATE;
  if (!/^[A-Z]{2}$/.test(rawState)) {
    res.status(400).json({ error: "invalid_input", message: "state must be a 2-letter US state code (e.g. MI, WI, OH)" });
    return;
  }
  const state = rawState;
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpeciesCacheKey(name, state);

  await ensureNatureserveRegistryEntry();

  if (!refresh) {
    const cached = await lookupSpeciesCache(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: NATURESERVE_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: cached.scientific_name !== null,
          // VIOLATION: plan #148 regression — flat struct rather than verbatim upstream JSON.
          // Cache stores extracted fields, not raw upstream JSON. Deferred to plans 16–18.
          data: buildSpeciesData(cached),
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
    const result = await searchSpecies(name, state);
    const stored = await storeSpeciesCache(cacheKey, result, result.search_upstream_url);
    const envelope = await buildEnvelope(
      {
        sourceId: NATURESERVE_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: stored.scientific_name !== null,
        // VIOLATION: plan #148 regression — flat struct rather than verbatim upstream JSON.
        // Cache stores extracted fields, not raw upstream JSON. Deferred to plans 16–18.
        data: buildSpeciesData(stored),
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

function buildSpeciesData(row: typeof natureserveSpeciesCacheTable.$inferSelect) {
  // VIOLATION: plan #148 regression — flat struct rather than verbatim upstream JSON.
  // state_status is derived by mapping S-rank values to labels inside the connector — not verbatim upstream data.
  // Deferred to plans 16–18.
  return {
    scientific_name: row.scientific_name ?? null,
    common_name: row.common_name ?? null,
    global_rank: row.global_rank ?? null,
    rounded_global_rank: row.rounded_global_rank ?? null,
    national_rank: row.national_rank ?? null,
    rounded_national_rank: row.rounded_national_rank ?? null,
    state_code: row.state_code,
    state_rank: row.state_rank ?? null,
    rounded_state_rank: row.rounded_state_rank ?? null,
    iucn_category: row.iucn_category ?? null,
    iucn_description: row.iucn_description ?? null,
    federal_status: row.federal_status ?? null,
    federal_status_description: row.federal_status_description ?? null,
    state_status: row.state_status ?? null,
    cites_description: row.cites_description ?? null,
    cosewic_code: row.cosewic_code ?? null,
    cosewic_description: row.cosewic_description ?? null,
    natureserve_url: row.natureserve_url ?? null,
    element_global_id: row.element_global_id ?? null,
  };
}

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
      const ecosystems = (cached.results as NatureserveSearchItem[]) ?? [];
      const totalResults = parseInt(cached.result_count ?? "0", 10) || ecosystems.length;
      const envelope = await buildEnvelope(
        {
          sourceId: NATURESERVE_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: ecosystems.length > 0,
          data: { ecosystems, total_results: totalResults },
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
          pagination: {
            has_more: ecosystems.length < totalResults,
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
    const result = await searchByRecordType(q, rawRecordType, limit, page);
    const stored = await storeEcosystemsCache(cacheKey, result.items, result.total_results, result.search_upstream_url);
    const ecosystems = (stored.results as NatureserveSearchItem[]) ?? [];
    const totalResults = parseInt(stored.result_count ?? "0", 10) || result.total_results;
    const envelope = await buildEnvelope(
      {
        sourceId: NATURESERVE_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: ecosystems.length > 0,
        data: { ecosystems, total_results: totalResults },
        method: refresh ? "computed" : "api_fetch",
        cacheStatus: refresh ? "bypass" : "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
        pagination: {
          has_more: ecosystems.length < totalResults,
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
