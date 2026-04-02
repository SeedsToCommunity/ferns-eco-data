import { Router, type IRouter } from "express";
import {
  searchSpecies,
  searchEcosystems,
  buildSpeciesCacheKey,
  buildEcosystemsCacheKey,
  buildProvenance,
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
  NATURESERVE_PERMISSION_GRANTED,
  NATURESERVE_PERMISSION_STATUS,
  NATURESERVE_DERIVATION_SUMMARY,
  NATURESERVE_DERIVATION_SCIENTIFIC,
  NATURESERVE_REGISTRY_ENTRY,
} from "../services/natureserve/metadata.js";
import { ensureNatureserveRegistryEntry } from "../services/natureserve/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { db, natureserveSpeciesCacheTable, natureserveEcosystemsCacheTable } from "@workspace/db";
import { count } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULT_STATE = "MI";

router.get("/natureserve/species", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const rawState = typeof req.query.state === "string" ? req.query.state.trim().toUpperCase() : DEFAULT_STATE;
  if (!/^[A-Z]{2}$/.test(rawState)) {
    res.status(400).json({ error: "invalid_input", message: "state must be a 2-letter US state code (e.g. MI, WI, OH)" });
    return;
  }
  const state = rawState;
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpeciesCacheKey(name, state);

  if (!refresh) {
    const cached = await lookupSpeciesCache(cacheKey);
    if (cached) {
      res.json(buildSpeciesResponse(cached, "hit"));
      return;
    }
  }

  try {
    const result = await searchSpecies(name, state);
    const stored = await storeSpeciesCache(cacheKey, result, result.search_upstream_url);
    res.json(buildSpeciesResponse(stored, refresh ? "bypassed" : "miss"));
  } catch (err) {
    req.log.error({ err }, "NatureServe species fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

function buildSpeciesResponse(
  row: typeof natureserveSpeciesCacheTable.$inferSelect,
  cache_status: "hit" | "miss" | "bypassed",
) {
  return {
    source_url: row.natureserve_url ?? null,
    found: row.scientific_name !== null,
    attribution: "NatureServe Explorer (https://explorer.natureserve.org). Attribution required per NatureServe Terms of Use.",
    data: {
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
      state_status_note: row.state_status ? "Derived from NatureServe S-rank; reflects rarity status, not a formal statutory state listing" : null,
      cites_description: row.cites_description ?? null,
      cosewic_code: row.cosewic_code ?? null,
      cosewic_description: row.cosewic_description ?? null,
      natureserve_url: row.natureserve_url ?? null,
      element_global_id: row.element_global_id ?? null,
      cache_status,
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/natureserve/ecosystems", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildEcosystemsCacheKey(name);

  if (!refresh) {
    const cached = await lookupEcosystemsCache(cacheKey);
    if (cached) {
      res.json(buildEcosystemsResponse(cached, "hit"));
      return;
    }
  }

  try {
    const result = await searchEcosystems(name);
    const stored = await storeEcosystemsCache(cacheKey, result);
    res.json(buildEcosystemsResponse(stored, refresh ? "bypassed" : "miss"));
  } catch (err) {
    req.log.error({ err }, "NatureServe ecosystems fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from NatureServe Explorer API" });
  }
});

function buildEcosystemsResponse(
  row: typeof natureserveEcosystemsCacheTable.$inferSelect,
  cache_status: "hit" | "miss" | "bypassed",
) {
  const items = Array.isArray(row.results) ? row.results : [];
  return {
    source_url: "https://explorer.natureserve.org",
    found: items.length > 0,
    attribution: "NatureServe Explorer (https://explorer.natureserve.org). Attribution required per NatureServe Terms of Use.",
    data: {
      ecosystems: items,
      result_count: items.length,
      total_ecosystem_results: items.length,
      total_results_all_types: row.result_count ? parseInt(row.result_count, 10) : items.length,
      cache_status,
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/natureserve/metadata", async (req, res) => {
  await ensureNatureserveRegistryEntry();
  const queriedAt = new Date();

  const [speciesCountRow, ecosystemsCountRow] = await Promise.all([
    db.select({ count: count() }).from(natureserveSpeciesCacheTable),
    db.select({ count: count() }).from(natureserveEcosystemsCacheTable),
  ]);

  const speciesCacheCount = speciesCountRow[0]?.count ?? 0;
  const ecosystemsCacheCount = ecosystemsCountRow[0]?.count ?? 0;

  res.json({
    found: true,
    source_url: resolveUrl(req, "/api/natureserve/metadata"),
    service_id: NATURESERVE_SOURCE_ID,
    service_name: "NatureServe Explorer — Species Conservation Status and Ecological Systems",
    permission_granted: NATURESERVE_PERMISSION_GRANTED,
    permission_status: NATURESERVE_PERMISSION_STATUS,
    attribution: NATURESERVE_ATTRIBUTION,
    cache_stats: {
      species_cached: speciesCacheCount,
      ecosystems_cached: ecosystemsCacheCount,
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
      derivation_summary: NATURESERVE_DERIVATION_SUMMARY,
      derivation_scientific: NATURESERVE_DERIVATION_SCIENTIFIC,
    },
  });
});

export default router;
