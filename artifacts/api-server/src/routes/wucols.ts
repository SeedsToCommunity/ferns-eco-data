import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  WUCOLS_WATER_USE_SOURCE_ID,
  WUCOLS_WATER_USE_GENERAL_SUMMARY,
  WUCOLS_WATER_USE_TECHNICAL_DETAILS,
  WUCOLS_WATER_USE_REGISTRY_ENTRY,
  WUCOLS_WATER_USE_LICENSES,
  WUCOLS_WATER_USE_LICENSE_NOTES,
} from "../services/wucols/metadata.js";
import { getWucolsWaterUse, listWucolsWaterUse } from "@workspace/internal-data-providers/wucols-water-use";
import { ensureWucolsWaterUseRegistryEntry } from "../services/wucols/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/wucols", async (req, res) => {
  const code = req.query["code"];
  if (typeof code !== "string" || code.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "code query parameter is required (VL, L, M, or H)" });
    return;
  }

  await ensureWucolsWaterUseRegistryEntry();
  const entry = getWucolsWaterUse(code.trim());
  const found = entry !== undefined;

  const envelope = await buildEnvelope(
    {
      sourceId: WUCOLS_WATER_USE_SOURCE_ID,
      sourceKind: "in-memory",
      found,
      data: found ? entry : null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wucols/all", async (req, res) => {
  await ensureWucolsWaterUseRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: WUCOLS_WATER_USE_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: listWucolsWaterUse(),
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wucols/metadata", async (req, res) => {
  await ensureWucolsWaterUseRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: WUCOLS_WATER_USE_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: WUCOLS_WATER_USE_SOURCE_ID,
        name: WUCOLS_WATER_USE_REGISTRY_ENTRY.name,
        knowledge_type: WUCOLS_WATER_USE_REGISTRY_ENTRY.knowledge_type,
        status: WUCOLS_WATER_USE_REGISTRY_ENTRY.status,
        description: WUCOLS_WATER_USE_REGISTRY_ENTRY.description,
        input_summary: WUCOLS_WATER_USE_REGISTRY_ENTRY.input_summary,
        output_summary: WUCOLS_WATER_USE_REGISTRY_ENTRY.output_summary,
        dependencies: WUCOLS_WATER_USE_REGISTRY_ENTRY.dependencies,
        update_frequency: WUCOLS_WATER_USE_REGISTRY_ENTRY.update_frequency,
        known_limitations: WUCOLS_WATER_USE_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, WUCOLS_WATER_USE_REGISTRY_ENTRY.metadata_url),
        licenses: WUCOLS_WATER_USE_LICENSES,
        license_notes: WUCOLS_WATER_USE_LICENSE_NOTES,
        general_summary: WUCOLS_WATER_USE_GENERAL_SUMMARY,
        technical_details: WUCOLS_WATER_USE_TECHNICAL_DETAILS,
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
