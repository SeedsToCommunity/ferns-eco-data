import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  USDA_PLANTS_SOURCE_ID,
  USDA_PLANTS_REGISTRY_ENTRY,
} from "../services/usda-plants/metadata.js";
import { ensureUsdaPlantsRegistryEntry } from "../services/usda-plants/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { lookupByName, fetchProfile, searchPlants } from "../services/usda-plants/connector.js";
import {
  buildNameMatchCacheKey,
  buildProfileCacheKey,
  lookupNameMatch,
  storeNameMatch,
  lookupProfile,
  storeProfile,
} from "../services/usda-plants/cache.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/usda-plants/metadata", async (req, res) => {
  try {
    await ensureUsdaPlantsRegistryEntry();
    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "in-memory",
        found: true,
        data: {
          ...USDA_PLANTS_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, USDA_PLANTS_REGISTRY_ENTRY.metadata_url),
        },
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: null,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: String(err) });
  }
});

router.get("/usda-plants/PlantSearch", async (req, res) => {
  // VIOLATION: composite route — calls PlantSearch then PlantProfile. Known violation deferred to plan 18 (audit triage). Do not "fix" this without plan 18.
  try {
    await ensureUsdaPlantsRegistryEntry();

    const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
    if (!speciesParam) {
      res.status(400).json({
        error: "invalid_input",
        message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
      });
      return;
    }

    const forceRefresh = req.query["refresh"] === "true";
    const nameCacheKey = buildNameMatchCacheKey(speciesParam);

    let nameMatch = forceRefresh ? null : await lookupNameMatch(nameCacheKey);
    const nameCacheStatus: "hit" | "miss" = nameMatch ? "hit" : "miss";

    if (!nameMatch) {
      let lookupResult;
      try {
        lookupResult = await lookupByName(speciesParam);
      } catch (upstreamErr) {
        res.status(502).json({
          error: "upstream_error",
          message: `USDA PLANTS API name lookup failed: ${String(upstreamErr)}`,
        });
        return;
      }
      nameMatch = await storeNameMatch(nameCacheKey, lookupResult);
    }

    if (!nameMatch.found || !nameMatch.symbol) {
      const envelope = await buildEnvelope(
        {
          sourceId: USDA_PLANTS_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: false,
          data: {},
          method: nameCacheStatus === "hit" ? "cache_hit" : "api_fetch",
          cacheStatus: nameCacheStatus,
          sourceUrl: nameMatch.upstream_url,
          queriedAt: new Date().toISOString(),
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }

    const symbol = nameMatch.symbol;
    const profileCacheKey = buildProfileCacheKey(symbol);

    let profileRow = forceRefresh ? null : await lookupProfile(profileCacheKey);
    const profileCacheStatus: "hit" | "miss" = profileRow ? "hit" : "miss";

    if (!profileRow) {
      const profileUpstreamUrl = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${encodeURIComponent(symbol)}`;
      let rawProfile;
      try {
        rawProfile = await fetchProfile(symbol);
      } catch (upstreamErr) {
        res.status(502).json({
          error: "upstream_error",
          message: `USDA PLANTS API profile fetch failed: ${String(upstreamErr)}`,
        });
        return;
      }
      profileRow = await storeProfile(profileCacheKey, symbol, rawProfile, profileUpstreamUrl);
    }

    const profile = profileRow.profile as Record<string, unknown>;

    const effectiveCacheStatus: "hit" | "miss" =
      nameCacheStatus === "hit" && profileCacheStatus === "hit" ? "hit" : "miss";

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: {
          symbol,
          canonical_name: nameMatch.canonical_name,
          common_name: nameMatch.common_name,
          rank: nameMatch.rank,
          usda_id: nameMatch.usda_id,
          native_statuses: profile["NativeStatuses"] ?? null,
          wetland_data: profile["WetlandData"] ?? null,
          legal_statuses: profile["LegalStatuses"] ?? null,
          durations: profile["Durations"] ?? null,
          growth_habits: profile["GrowthHabits"] ?? null,
          group: profile["Group"] ?? null,
          ancestors: profile["Ancestors"] ?? null,
          synonyms: profile["Synonyms"] ?? null,
          fact_sheet_urls: profile["FactSheetUrls"] ?? [],
          plant_guide_urls: profile["PlantGuideUrls"] ?? [],
          other_common_names: profile["OtherCommonNames"] ?? null,
          profile_image_filename: profile["ProfileImageFilename"] ?? null,
        },
        method: effectiveCacheStatus === "hit" ? "cache_hit" : "api_fetch",
        cacheStatus: effectiveCacheStatus,
        sourceUrl: nameMatch.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: String(err) });
  }
});

router.get("/usda-plants/PlantProfile", async (req, res) => {
  try {
    await ensureUsdaPlantsRegistryEntry();

    const symbolParam = typeof req.query["symbol"] === "string" ? req.query["symbol"].trim().toUpperCase() : null;
    if (!symbolParam) {
      res.status(400).json({
        error: "invalid_input",
        message: "symbol query parameter is required (e.g. ?symbol=ASTU)",
      });
      return;
    }

    const forceRefresh = req.query["refresh"] === "true";
    const cacheKey = buildProfileCacheKey(symbolParam);

    let profileRow = forceRefresh ? null : await lookupProfile(cacheKey);
    const cacheStatus: "hit" | "miss" = profileRow ? "hit" : "miss";

    if (!profileRow) {
      const upstreamUrl = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${encodeURIComponent(symbolParam)}`;
      let rawProfile;
      try {
        rawProfile = await fetchProfile(symbolParam);
      } catch (upstreamErr) {
        res.status(502).json({
          error: "upstream_error",
          message: `USDA PLANTS API profile fetch failed: ${String(upstreamErr)}`,
        });
        return;
      }
      profileRow = await storeProfile(cacheKey, symbolParam, rawProfile, upstreamUrl);
    }

    const profile = profileRow.profile as Record<string, unknown>;
    const hasData = profile && typeof profile["Id"] === "number";

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: hasData,
        data: {
          symbol: symbolParam,
          profile,
        },
        method: cacheStatus === "hit" ? "cache_hit" : "api_fetch",
        cacheStatus,
        sourceUrl: profileRow.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: String(err) });
  }
});

router.get("/usda-plants/plants-search-results", async (req, res) => {
  try {
    await ensureUsdaPlantsRegistryEntry();

    const q = typeof req.query["q"] === "string" ? req.query["q"].trim() : null;
    if (!q) {
      res.status(400).json({
        error: "invalid_input",
        message: "q query parameter is required (e.g. ?q=Trillium)",
      });
      return;
    }

    const validFields = ["Scientific Name", "Common Name", "Symbol", "Family"];
    const fieldParam = typeof req.query["field"] === "string" ? req.query["field"] : "Scientific Name";
    const field = validFields.includes(fieldParam) ? fieldParam : "Scientific Name";

    const pageParam = typeof req.query["page"] === "string" ? parseInt(req.query["page"], 10) : 1;
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    let searchResult;
    try {
      searchResult = await searchPlants(q, field, page);
    } catch (upstreamErr) {
      res.status(502).json({
        error: "upstream_error",
        message: `USDA PLANTS API search failed: ${String(upstreamErr)}`,
      });
      return;
    }

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: searchResult.total > 0,
        data: {
          total: searchResult.total,
          results: searchResult.results,
        },
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: searchResult.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    res.status(500).json({ error: "internal_error", message: String(err) });
  }
});

export default router;
