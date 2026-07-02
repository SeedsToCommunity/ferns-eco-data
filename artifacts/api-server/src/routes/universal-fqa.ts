import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  UNIVERSAL_FQA_SOURCE_ID,
  UNIVERSAL_FQA_GENERAL_SUMMARY,
  UNIVERSAL_FQA_TECHNICAL_DETAILS,
  UNIVERSAL_FQA_REGISTRY_ENTRY,
  UNIVERSAL_FQA_LICENSES,
  UNIVERSAL_FQA_LICENSE_NOTES,
  UNIVERSAL_FQA_ATTRIBUTION,
  UNIVERSAL_FQA_API_BASE,
} from "../services/universal-fqa/metadata.js";
import {
  getUniversalFqaDatabase,
  getUniversalFqaDatabaseById,
  getUniversalFqaDatabaseInventory,
  getUniversalFqaInventory,
  UniversalFqaApiError,
} from "@workspace/external-data-providers/universal-fqa";
import {
  lookupDatabase,
  storeDatabase,
} from "../services/universal-fqa/db-cache.js";
import { ensureUniversalFqaRegistryEntry } from "../services/universal-fqa/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { logger } from "../lib/logger.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/universal-fqa/metadata", async (req, res) => {
  await ensureUniversalFqaRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: UNIVERSAL_FQA_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: UNIVERSAL_FQA_SOURCE_ID,
        name: UNIVERSAL_FQA_REGISTRY_ENTRY.name,
        knowledge_type: UNIVERSAL_FQA_REGISTRY_ENTRY.knowledge_type,
        status: UNIVERSAL_FQA_REGISTRY_ENTRY.status,
        description: UNIVERSAL_FQA_REGISTRY_ENTRY.description,
        input_summary: UNIVERSAL_FQA_REGISTRY_ENTRY.input_summary,
        output_summary: UNIVERSAL_FQA_REGISTRY_ENTRY.output_summary,
        dependencies: UNIVERSAL_FQA_REGISTRY_ENTRY.dependencies,
        update_frequency: UNIVERSAL_FQA_REGISTRY_ENTRY.update_frequency,
        known_limitations: UNIVERSAL_FQA_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, UNIVERSAL_FQA_REGISTRY_ENTRY.metadata_url),
        licenses: UNIVERSAL_FQA_LICENSES,
        license_notes: UNIVERSAL_FQA_LICENSE_NOTES,
        attribution: UNIVERSAL_FQA_ATTRIBUTION,
        general_summary: UNIVERSAL_FQA_GENERAL_SUMMARY,
        technical_details: UNIVERSAL_FQA_TECHNICAL_DETAILS,
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

router.get("/universal-fqa/get/database", async (req, res) => {
  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/`;

  await ensureUniversalFqaRegistryEntry();

  try {
    const result = await getUniversalFqaDatabase();

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: result.raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    if (err instanceof UniversalFqaApiError) {
      logger.error({ err, upstream_url: err.upstream_url }, "Universal FQA: failed to fetch database list");
    } else {
      logger.error({ err }, "Universal FQA: failed to fetch database list");
    }
    res.status(502).json({
      error: "upstream_error",
      message: "Failed to fetch database list from universalfqa.org",
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/get/database/:id/inventory", async (req, res) => {
  const idParam = req.params.id;
  const databaseId = parseInt(idParam, 10);

  if (isNaN(databaseId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "database id must be a valid integer",
    });
    return;
  }

  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/${databaseId}/inventory`;

  await ensureUniversalFqaRegistryEntry();

  try {
    const result = await getUniversalFqaDatabaseInventory(databaseId);

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: result.raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    if (err instanceof UniversalFqaApiError) {
      logger.error({ err, databaseId, upstream_url: err.upstream_url }, "Universal FQA: failed to fetch assessment list");
    } else {
      logger.error({ err, databaseId }, "Universal FQA: failed to fetch assessment list");
    }
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to fetch assessment list for database ${databaseId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/get/database/:id", async (req, res) => {
  const idParam = req.params.id;
  const databaseId = parseInt(idParam, 10);

  if (isNaN(databaseId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "database id must be a valid integer",
    });
    return;
  }

  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/${databaseId}`;

  await ensureUniversalFqaRegistryEntry();

  try {
    const cached = await lookupDatabase(databaseId);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: UNIVERSAL_FQA_SOURCE_ID,
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

    const result = await getUniversalFqaDatabaseById(databaseId);
    const stored = await storeDatabase(databaseId, result);

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: stored.raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: stored.upstream_url,
        queriedAt: stored.fetched_at.toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    if (err instanceof UniversalFqaApiError) {
      logger.error({ err, databaseId, upstream_url: err.upstream_url }, "Universal FQA: failed to fetch database");
    } else {
      logger.error({ err, databaseId }, "Universal FQA: failed to fetch database");
    }
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to load database ${databaseId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/get/inventory/:id", async (req, res) => {
  const idParam = req.params.id;
  const assessmentId = parseInt(idParam, 10);

  if (isNaN(assessmentId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "Assessment id must be a valid integer",
    });
    return;
  }

  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/inventory/${assessmentId}`;

  await ensureUniversalFqaRegistryEntry();

  try {
    const result = await getUniversalFqaInventory(assessmentId);

    if ((result.raw as Record<string, unknown>).status === "error") {
      res.status(404).json({
        error: "not_found",
        message: `Assessment ${assessmentId} not found or not public`,
        upstream_url: upstreamUrl,
      });
      return;
    }

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: result.raw,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: result.upstream_url,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    if (err instanceof UniversalFqaApiError) {
      logger.error({ err, assessmentId, upstream_url: err.upstream_url }, "Universal FQA: failed to fetch assessment");
    } else {
      logger.error({ err, assessmentId }, "Universal FQA: failed to fetch assessment");
    }
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to fetch assessment ${assessmentId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

export default router;
