import { Router, type IRouter } from "express";
import {
  searchSpecies,
  buildSpeciesCacheKey,
  buildProvenance,
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
  NATURESERVE_ATTRIBUTION,
  NATURESERVE_LICENSES,
  NATURESERVE_LICENSE_NOTES,
  NATURESERVE_GENERAL_SUMMARY,
  NATURESERVE_TECHNICAL_DETAILS,
  NATURESERVE_REGISTRY_ENTRY,
} from "../services/natureserve/metadata.js";
import { ensureNatureserveRegistryEntry } from "../services/natureserve/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

router.get("/natureserve/speciesSearch", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildSpeciesCacheKey(name);

  if (!refresh) {
    const cached = await lookupSpeciesCache(cacheKey);
    if (cached) {
      res.json(buildSpeciesResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await searchSpecies(name);
    const stored = await storeSpeciesCache(cacheKey, result);
    res.json(buildSpeciesResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "NatureServe species fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

function buildSpeciesResponse(
  row: typeof natureserveSpeciesCacheTable.$inferSelect,
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  const raw = row.raw_response as Record<string, unknown>;
  const results = raw.results as unknown[] | undefined;
  const found = !!(results && results.length > 0);

  return {
    source_url: "https://explorer.natureserve.org",
    found,
    attribution: "NatureServe Explorer (https://explorer.natureserve.org). Attribution required per NatureServe Terms of Use.",
    data: {
      raw_response: raw,
      cache_status,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
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
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  const cacheKey = buildSearchCacheKey(q, rawRecordType, limit, page);

  if (!refresh) {
    const cached = await lookupEcosystemsCache(cacheKey);
    if (cached) {
      res.json(buildSearchResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await searchByRecordType(q, rawRecordType, limit, page);
    const stored = await storeEcosystemsCache(cacheKey, result.items, result.total_results, result.search_upstream_url);
    res.json(buildSearchResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "NatureServe search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

function buildSearchResponse(
  row: typeof natureserveEcosystemsCacheTable.$inferSelect,
  cache_status: "hit" | "miss" | "bypassed",
  verbosity?: string,
) {
  const ecosystems = (row.results as NatureserveSearchItem[]) ?? [];
  return {
    source_url: null,
    found: ecosystems.length > 0,
    attribution: "NatureServe Explorer (https://explorer.natureserve.org). Attribution required per NatureServe Terms of Use.",
    data: {
      ecosystems,
      result_count: ecosystems.length,
      total_results: parseInt(row.result_count ?? "0", 10) || ecosystems.length,
      cache_status,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/natureserve/metadata", async (req, res) => {
  await ensureNatureserveRegistryEntry();
  const queriedAt = new Date();

  const speciesCountRow = await db.select({ count: count() }).from(natureserveSpeciesCacheTable);
  const speciesCacheCount = speciesCountRow[0]?.count ?? 0;

  res.json({
    found: true,
    source_url: resolveUrl(req, "/api/natureserve/metadata"),
    service_id: NATURESERVE_SOURCE_ID,
    service_name: "NatureServe Explorer — Species Conservation Status and Ecological Systems",
    licenses: NATURESERVE_LICENSES,
    license_notes: NATURESERVE_LICENSE_NOTES,
    attribution: NATURESERVE_ATTRIBUTION,
    cache_stats: {
      species_cached: speciesCacheCount,
      ttl_days: 30,
    },
    registry_entry: {
      ...NATURESERVE_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, NATURESERVE_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, NATURESERVE_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      source_id: NATURESERVE_SOURCE_ID,
      fetched_at: queriedAt,
      method: "static_metadata",
      upstream_url: resolveUrl(req, "/api/natureserve/metadata"),
      general_summary: NATURESERVE_GENERAL_SUMMARY,
      technical_details: NATURESERVE_TECHNICAL_DETAILS,
    },
  });
});

export default router;
