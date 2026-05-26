import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  WETLAND_INDICATOR_SOURCE_ID,
  WETLAND_INDICATOR_GENERAL_SUMMARY,
  WETLAND_INDICATOR_TECHNICAL_DETAILS,
  WETLAND_INDICATOR_REGISTRY_ENTRY,
  WETLAND_INDICATOR_LICENSES,
  WETLAND_INDICATOR_LICENSE_NOTES,
} from "../services/wetland-indicator/metadata.js";
import {
  WETLAND_INDICATOR_DATA,
  lookupByCode,
  lookupByW,
} from "../services/wetland-indicator/data.js";
import { ensureWetlandIndicatorRegistryEntry } from "../services/wetland-indicator/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/wetland-indicator", async (req, res) => {
  const code = req.query["code"];
  if (typeof code !== "string" || code.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "code query parameter is required (OBL, FACW, FAC, FACU, or UPL)" });
    return;
  }

  await ensureWetlandIndicatorRegistryEntry();
  const entry = lookupByCode(code.trim());
  const found = entry !== undefined;

  const envelope = await buildEnvelope(
    {
      sourceId: WETLAND_INDICATOR_SOURCE_ID,
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

router.get("/wetland-indicator/w", async (req, res) => {
  const rawValue = req.query["value"];
  if (typeof rawValue !== "string" || rawValue.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "value query parameter is required (-5, -3, 0, 3, or 5)" });
    return;
  }

  const w = parseInt(rawValue.trim(), 10);
  if (isNaN(w)) {
    res.status(400).json({ error: "invalid_input", message: "value must be a numeric W-value (-5, -3, 0, 3, or 5)" });
    return;
  }

  await ensureWetlandIndicatorRegistryEntry();
  const entry = lookupByW(w);
  const found = entry !== undefined;

  const envelope = await buildEnvelope(
    {
      sourceId: WETLAND_INDICATOR_SOURCE_ID,
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

router.get("/wetland-indicator/all", async (req, res) => {
  await ensureWetlandIndicatorRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: WETLAND_INDICATOR_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: WETLAND_INDICATOR_DATA,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wetland-indicator/metadata", async (req, res) => {
  await ensureWetlandIndicatorRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: WETLAND_INDICATOR_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: WETLAND_INDICATOR_SOURCE_ID,
        name: WETLAND_INDICATOR_REGISTRY_ENTRY.name,
        knowledge_type: WETLAND_INDICATOR_REGISTRY_ENTRY.knowledge_type,
        status: WETLAND_INDICATOR_REGISTRY_ENTRY.status,
        description: WETLAND_INDICATOR_REGISTRY_ENTRY.description,
        input_summary: WETLAND_INDICATOR_REGISTRY_ENTRY.input_summary,
        output_summary: WETLAND_INDICATOR_REGISTRY_ENTRY.output_summary,
        dependencies: WETLAND_INDICATOR_REGISTRY_ENTRY.dependencies,
        update_frequency: WETLAND_INDICATOR_REGISTRY_ENTRY.update_frequency,
        known_limitations: WETLAND_INDICATOR_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, WETLAND_INDICATOR_REGISTRY_ENTRY.metadata_url),
        explorer_url: resolveUrl(req, WETLAND_INDICATOR_REGISTRY_ENTRY.explorer_url),
        licenses: WETLAND_INDICATOR_LICENSES,
        license_notes: WETLAND_INDICATOR_LICENSE_NOTES,
        general_summary: WETLAND_INDICATOR_GENERAL_SUMMARY,
        technical_details: WETLAND_INDICATOR_TECHNICAL_DETAILS,
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
