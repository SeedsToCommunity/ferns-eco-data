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
  fetchDatabaseList,
  fetchAssessmentList,
  fetchAssessment,
} from "../services/universal-fqa/client.js";
import {
  getOrFetchDatabase,
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
    const databases = await fetchDatabaseList();

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: { databases },
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: upstreamUrl,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    logger.error({ err }, "Universal FQA: failed to fetch database list");
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
    const assessments = await fetchAssessmentList(databaseId);

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: {
          database_id: databaseId,
          assessments,
        },
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: upstreamUrl,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    logger.error({ err, databaseId }, "Universal FQA: failed to fetch assessment list");
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
    const { detail, cache_hit } = await getOrFetchDatabase(databaseId);

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: detail,
        method: cache_hit ? "cache_hit" : "api_fetch",
        cacheStatus: cache_hit ? "hit" : "miss",
        sourceUrl: upstreamUrl,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err) {
    logger.error({ err, databaseId }, "Universal FQA: failed to fetch database");
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
    const detail = await fetchAssessment(assessmentId);

    const envelope = await buildEnvelope(
      {
        sourceId: UNIVERSAL_FQA_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: detail,
        method: "api_fetch",
        cacheStatus: "miss",
        sourceUrl: upstreamUrl,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("unavailable") || message.includes("not found")) {
      res.status(404).json({
        error: "not_found",
        message: `Assessment ${assessmentId} not found or not public`,
        upstream_url: upstreamUrl,
      });
    } else {
      logger.error({ err, assessmentId }, "Universal FQA: failed to fetch assessment");
      res.status(502).json({
        error: "upstream_error",
        message: `Failed to fetch assessment ${assessmentId} from universalfqa.org`,
        upstream_url: upstreamUrl,
      });
    }
  }
});

export default router;
