import { Router, type IRouter } from "express";
import {
  UNIVERSAL_FQA_SOURCE_ID,
  UNIVERSAL_FQA_GENERAL_SUMMARY,
  UNIVERSAL_FQA_TECHNICAL_DETAILS,
  UNIVERSAL_FQA_REGISTRY_ENTRY,
  UNIVERSAL_FQA_PERMISSION_GRANTED,
  UNIVERSAL_FQA_PERMISSION_STATUS,
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
  lookupSpeciesFromDb,
} from "../services/universal-fqa/db-cache.js";
import { ensureUniversalFqaRegistryEntry } from "../services/universal-fqa/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0], upstreamUrl: string) {
  return {
    source_id: UNIVERSAL_FQA_SOURCE_ID,
    fetched_at: new Date(),
    method: "api_fetch",
    upstream_url: upstreamUrl,
    general_summary: UNIVERSAL_FQA_GENERAL_SUMMARY,
    technical_details: UNIVERSAL_FQA_TECHNICAL_DETAILS,
  };
}

router.get("/universal-fqa/metadata", async (req, res) => {
  await ensureUniversalFqaRegistryEntry();

  res.json({
    source_id: UNIVERSAL_FQA_SOURCE_ID,
    name: UNIVERSAL_FQA_REGISTRY_ENTRY.name,
    permission_granted: UNIVERSAL_FQA_PERMISSION_GRANTED,
    permission_status: UNIVERSAL_FQA_PERMISSION_STATUS,
    attribution: UNIVERSAL_FQA_ATTRIBUTION,
    registry_entry: {
      ...UNIVERSAL_FQA_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, UNIVERSAL_FQA_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, UNIVERSAL_FQA_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: {
      ...buildProvenance(req, resolveUrl(req, "/api/universal-fqa/metadata")),
      method: "static_metadata",
    },
  });
});

router.get("/universal-fqa/databases", async (req, res) => {
  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/`;

  try {
    const databases = await fetchDatabaseList();

    res.json({
      found: true,
      cache_status: "miss",
      queried_at: new Date(),
      source_url: upstreamUrl,
      provenance: buildProvenance(req, upstreamUrl),
      data: { databases },
    });
  } catch (err) {
    logger.error({ err }, "Universal FQA: failed to fetch database list");
    res.status(502).json({
      error: "upstream_error",
      message: "Failed to fetch database list from universalfqa.org",
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/databases/:id", async (req, res) => {
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

  try {
    const { detail, cache_hit } = await getOrFetchDatabase(databaseId);

    res.json({
      found: true,
      cache_status: cache_hit ? "hit" : "miss",
      queried_at: new Date(),
      source_url: upstreamUrl,
      provenance: buildProvenance(req, upstreamUrl),
      data: detail,
    });
  } catch (err) {
    logger.error({ err, databaseId }, "Universal FQA: failed to fetch database");
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to load database ${databaseId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/species", async (req, res) => {
  const nameParam = req.query["name"];
  const dbIdParam = req.query["database_id"];

  if (!nameParam || nameParam === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "name query parameter is required",
    });
    return;
  }

  if (!dbIdParam || dbIdParam === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "database_id query parameter is required. Use /universal-fqa/databases to list available databases.",
    });
    return;
  }

  const databaseId = parseInt(String(dbIdParam), 10);
  if (isNaN(databaseId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "database_id must be a valid integer",
    });
    return;
  }

  const scientificName = String(nameParam);
  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/${databaseId}`;

  try {
    const result = await lookupSpeciesFromDb(databaseId, scientificName);

    res.json({
      found: result.found,
      cache_status: result.cache_hit ? "hit" : "miss",
      queried_at: new Date(),
      source_url: upstreamUrl,
      provenance: {
        ...buildProvenance(req, upstreamUrl),
        matched_input: scientificName,
      },
      data: {
        database_id: databaseId,
        queried_name: scientificName,
        found: result.found,
        species: result.species,
      },
    });
  } catch (err) {
    logger.error({ err, databaseId, scientificName }, "Universal FQA: failed to fetch species");
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to load database ${databaseId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/assessments", async (req, res) => {
  const dbIdParam = req.query["database_id"];

  if (!dbIdParam || dbIdParam === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "database_id query parameter is required",
    });
    return;
  }

  const databaseId = parseInt(String(dbIdParam), 10);
  if (isNaN(databaseId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "database_id must be a valid integer",
    });
    return;
  }

  const upstreamUrl = `${UNIVERSAL_FQA_API_BASE}/database/${databaseId}/inventory`;

  try {
    const assessments = await fetchAssessmentList(databaseId);

    res.json({
      found: true,
      cache_status: "miss",
      queried_at: new Date(),
      source_url: upstreamUrl,
      provenance: buildProvenance(req, upstreamUrl),
      data: {
        database_id: databaseId,
        assessments,
      },
    });
  } catch (err) {
    logger.error({ err, databaseId }, "Universal FQA: failed to fetch assessment list");
    res.status(502).json({
      error: "upstream_error",
      message: `Failed to fetch assessment list for database ${databaseId} from universalfqa.org`,
      upstream_url: upstreamUrl,
    });
  }
});

router.get("/universal-fqa/assessment/:id", async (req, res) => {
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

  try {
    const detail = await fetchAssessment(assessmentId);

    res.json({
      found: true,
      cache_status: "miss",
      queried_at: new Date(),
      source_url: upstreamUrl,
      provenance: buildProvenance(req, upstreamUrl),
      data: detail,
    });
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
