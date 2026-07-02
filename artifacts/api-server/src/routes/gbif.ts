// GBIF — envelope-migrated routes (Task #164).
// Envelope Contract v1: docs/data-layer-contract.md
// All routes use buildEnvelope(). data = verbatim upstream GBIF JSON.

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  buildMatchCacheKey,
  buildOccurrenceParamsCacheKey,
  buildSynonymsCacheKey,
  buildVernacularNamesCacheKey,
  buildSpeciesCacheKey,
  buildSpeciesSearchCacheKey,
} from "../services/gbif/connector.js";
import {
  getGbifSpeciesMatch,
  getGbifSpeciesSearch,
  getGbifSpecies,
  getGbifSpeciesSynonyms,
  getGbifSpeciesVernacularNames,
  getGbifOccurrenceSearch,
} from "@workspace/external-data-providers/gbif";
import {
  lookupNameMatch,
  storeNameMatch,
  lookupOccurrences,
  storeOccurrences,
  lookupSynonyms,
  storeSynonyms,
  lookupVernacularNames,
  storeVernacularNames,
  lookupSpecies,
  storeSpecies,
  lookupSpeciesSearch,
  storeSpeciesSearch,
} from "../services/gbif/cache.js";
import {
  GBIF_SOURCE_ID,
  GBIF_ATTRIBUTION,
  GBIF_LICENSES,
  GBIF_LICENSE_NOTES,
  GBIF_VOCABULARIES,
  GBIF_GENERAL_SUMMARY,
  GBIF_TECHNICAL_DETAILS,
  GBIF_REGISTRY_ENTRY,
} from "../services/gbif/metadata.js";
import { ensureGbifRegistryEntry } from "../services/gbif/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/gbif/species/match", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }

  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildMatchCacheKey(name);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupNameMatch(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: (cached.match_type !== "NONE"),
          data: cached.upstream_response,
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
    const result = await getGbifSpeciesMatch(name, "Plantae");
    const stored = await storeNameMatch(cacheKey, name, result);
    const raw = stored.upstream_response as Record<string, unknown>;
    const matchType = (raw.matchType as string) || "NONE";
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: matchType !== "NONE",
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF match fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/species/search", async (req, res) => {
  const rawQ = req.query.q;
  if (!rawQ || typeof rawQ !== "string" || rawQ.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "q is required and must be a non-empty string" });
    return;
  }

  const q = rawQ.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpeciesSearchCacheKey(q);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupSpeciesSearch(cacheKey);
    if (cached) {
      const raw = cached.upstream_response as Record<string, unknown>;
      const results = Array.isArray(raw.results) ? raw.results as unknown[] : [];
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: results.length > 0,
          data: cached.upstream_response,
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
    const result = await getGbifSpeciesSearch({ q, qField: "VERNACULAR", rank: "SPECIES", kingdom: "Plantae", limit: 20 });
    const stored = await storeSpeciesSearch(cacheKey, result);
    const raw = stored.upstream_response as Record<string, unknown>;
    const results = Array.isArray(raw.results) ? raw.results as unknown[] : [];
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: results.length > 0,
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF vernacular search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/species/:usageKey/synonyms", async (req, res) => {
  const rawKey = req.params.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey must be a positive integer" });
    return;
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSynonymsCacheKey(usageKey, limit, offset);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupSynonyms(cacheKey);
    if (cached) {
      const raw = cached.upstream_response as Record<string, unknown>;
      const count = typeof raw.count === "number" ? raw.count : null;
      const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: true,
          data: cached.upstream_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
          pagination: { has_more: !endOfRecords, next: null, total: count },
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await getGbifSpeciesSynonyms(usageKey, limit, offset);
    const stored = await storeSynonyms(cacheKey, usageKey, result);
    const raw = stored.upstream_response as Record<string, unknown>;
    const count = typeof raw.count === "number" ? raw.count : null;
    const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
        pagination: { has_more: !endOfRecords, next: null, total: count },
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF synonyms fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/species/:usageKey/vernacularNames", async (req, res) => {
  const rawKey = req.params.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey must be a positive integer" });
    return;
  }

  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 1000);
  const offset = Math.max(Number(req.query.offset) || 0, 0);
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildVernacularNamesCacheKey(usageKey, limit, offset);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupVernacularNames(cacheKey);
    if (cached) {
      const raw = cached.upstream_response as Record<string, unknown>;
      const count = typeof raw.count === "number" ? raw.count : null;
      const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: true,
          data: cached.upstream_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
          pagination: { has_more: !endOfRecords, next: null, total: count },
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await getGbifSpeciesVernacularNames(usageKey, limit, offset);
    const stored = await storeVernacularNames(cacheKey, usageKey, result);
    const raw = stored.upstream_response as Record<string, unknown>;
    const count = typeof raw.count === "number" ? raw.count : null;
    const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
        pagination: { has_more: !endOfRecords, next: null, total: count },
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF vernacular names fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/species/:usageKey", async (req, res) => {
  const rawKey = req.params.usageKey;
  const usageKey = Number(rawKey);
  if (!rawKey || isNaN(usageKey) || usageKey <= 0) {
    res.status(400).json({ error: "invalid_input", message: "usageKey must be a positive integer" });
    return;
  }

  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildSpeciesCacheKey(usageKey);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupSpecies(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: true,
          data: cached.upstream_response,
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
    const result = await getGbifSpecies(usageKey);
    const stored = await storeSpecies(cacheKey, result);
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF species fetch failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/occurrence/search", async (req, res) => {
  const queryParams: Record<string, string | string[]> = {};
  for (const [k, v] of Object.entries(req.query)) {
    if (k === "refresh") continue;
    if (typeof v === "string") {
      queryParams[k] = v;
    } else if (Array.isArray(v)) {
      queryParams[k] = v.filter((x): x is string => typeof x === "string");
    }
  }

  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const cacheKey = buildOccurrenceParamsCacheKey(queryParams);

  await ensureGbifRegistryEntry();

  if (!refresh) {
    const cached = await lookupOccurrences(cacheKey);
    if (cached) {
      const raw = cached.upstream_response as Record<string, unknown>;
      const count = typeof raw.count === "number" ? raw.count : null;
      const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
      const envelope = await buildEnvelope(
        {
          sourceId: GBIF_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: true,
          data: cached.upstream_response,
          method: "cache_hit",
          cacheStatus: "hit",
          sourceUrl: cached.upstream_url,
          queriedAt: cached.fetched_at.toISOString(),
          pagination: { has_more: !endOfRecords, next: null, total: count },
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  try {
    const result = await getGbifOccurrenceSearch(queryParams);
    const stored = await storeOccurrences(cacheKey, result);
    const raw = stored.upstream_response as Record<string, unknown>;
    const count = typeof raw.count === "number" ? raw.count : null;
    const endOfRecords = typeof raw.endOfRecords === "boolean" ? raw.endOfRecords : true;
    const envelope = await buildEnvelope(
      {
        sourceId: GBIF_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.upstream_response,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
        pagination: { has_more: !endOfRecords, next: null, total: count },
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    req.log.error({ err }, "GBIF occurrence search failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from GBIF API" });
  }
});

router.get("/gbif/metadata", async (req, res) => {
  await ensureGbifRegistryEntry();
  const envelope = await buildEnvelope(
    {
      sourceId: GBIF_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        description: GBIF_REGISTRY_ENTRY.description,
        general_summary: GBIF_GENERAL_SUMMARY,
        technical_details: GBIF_TECHNICAL_DETAILS,
        licenses: GBIF_LICENSES,
        license_notes: GBIF_LICENSE_NOTES,
        attribution: GBIF_ATTRIBUTION,
        vocabularies: GBIF_VOCABULARIES,
        metadata_url: resolveUrl(req, GBIF_REGISTRY_ENTRY.metadata_url),
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
