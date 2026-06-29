import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  USDA_PLANTS_SOURCE_ID,
  USDA_PLANTS_REGISTRY_ENTRY,
} from "../services/usda-plants/metadata.js";
import { ensureUsdaPlantsRegistryEntry } from "../services/usda-plants/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  getUsdaPlantsPlantSearch,
  getUsdaPlantsPlantProfile,
  getUsdaPlantsPlantsSearchResults,
  UsdaPlantsApiError,
} from "@workspace/external-data-providers/usda-plants";
import {
  buildProfileCacheKey,
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
  try {
    await ensureUsdaPlantsRegistryEntry();

    const searchText = typeof req.query["searchText"] === "string" ? req.query["searchText"].trim() : null;
    if (!searchText) {
      res.status(400).json({
        error: "invalid_input",
        message: "searchText query parameter is required (e.g. ?searchText=Acer+rubrum)",
      });
      return;
    }

    let result;
    try {
      result = await getUsdaPlantsPlantSearch(searchText);
    } catch (upstreamErr) {
      if (upstreamErr instanceof UsdaPlantsApiError) {
        res.status(502).json({
          error: "upstream_error",
          message: upstreamErr.message,
        });
        return;
      }
      throw upstreamErr;
    }

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: result.items.length > 0,
        data: result.items,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstreamUrl,
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
      let result;
      try {
        result = await getUsdaPlantsPlantProfile(symbolParam);
      } catch (upstreamErr) {
        if (upstreamErr instanceof UsdaPlantsApiError) {
          res.status(502).json({
            error: "upstream_error",
            message: upstreamErr.message,
          });
          return;
        }
        throw upstreamErr;
      }

      profileRow = await storeProfile(
        cacheKey,
        symbolParam,
        result.profile ?? {},
        result.upstreamUrl,
      );
    }

    const profile = profileRow.profile as Record<string, unknown>;
    const found = profile !== null && typeof profile["Id"] === "number";

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found,
        data: profile,
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

const VALID_FIELDS = ["Scientific Name", "Common Name", "Symbol", "Family"] as const;
type ValidField = (typeof VALID_FIELDS)[number];

router.get("/usda-plants/plants-search-results", async (req, res) => {
  try {
    await ensureUsdaPlantsRegistryEntry();

    const textParam = typeof req.query["Text"] === "string" ? req.query["Text"].trim() : null;
    if (!textParam) {
      res.status(400).json({
        error: "invalid_input",
        message: "Text query parameter is required (e.g. ?Text=Trillium)",
      });
      return;
    }

    const fieldParam = typeof req.query["Field"] === "string" ? req.query["Field"] : null;
    if (!fieldParam || !(VALID_FIELDS as readonly string[]).includes(fieldParam)) {
      res.status(400).json({
        error: "invalid_input",
        message: `Field query parameter is required and must be one of: ${VALID_FIELDS.join(", ")}`,
      });
      return;
    }

    const pageParam = typeof req.query["pageNumber"] === "string" ? parseInt(req.query["pageNumber"], 10) : 1;
    const pageNumber = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

    let result;
    try {
      result = await getUsdaPlantsPlantsSearchResults({
        Text: textParam,
        Field: fieldParam as ValidField,
        pageNumber,
      });
    } catch (upstreamErr) {
      if (upstreamErr instanceof UsdaPlantsApiError) {
        res.status(502).json({
          error: "upstream_error",
          message: upstreamErr.message,
        });
        return;
      }
      throw upstreamErr;
    }

    const envelope = await buildEnvelope(
      {
        sourceId: USDA_PLANTS_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: result.found,
        data: result.raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstreamUrl,
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
