// Lake County Savanna and Grassland Guide — thin route adapter.
// Internal Data Provider: @workspace/internal-data-providers/lcscg
// Envelope Contract v1: docs/data-layer-contract.md

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  LCSCG_SOURCE_ID,
  LCSCG_GENERAL_SUMMARY,
  LCSCG_TECHNICAL_DETAILS,
  LCSCG_REGISTRY_ENTRY,
  LCSCG_LICENSES,
  LCSCG_LICENSE_NOTES,
} from "../services/lcscg/metadata.js";
import { ensureLcscgRegistryEntry } from "../services/lcscg/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";
import {
  getLcscgGuides,
  getLcscgGuide,
  getLcscgSpecies,
} from "@workspace/internal-data-providers/lcscg";

const router: IRouter = Router();

router.get("/lcscg/metadata", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const queriedAt = new Date().toISOString();

  const guides = getLcscgGuides();
  const guideCount = guides.length;
  const speciesCount = guides.reduce((sum: number, g) => {
    const result = getLcscgGuide(g.guide_id);
    return sum + (result?.species.length ?? 0);
  }, 0);

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: {
      service_id: LCSCG_SOURCE_ID,
      service_name: LCSCG_REGISTRY_ENTRY.name,
      licenses: LCSCG_LICENSES,
      license_notes: LCSCG_LICENSE_NOTES,
      guide_count: guideCount,
      species_count: speciesCount,
      registry_entry: {
        ...LCSCG_REGISTRY_ENTRY,
        metadata_url: resolveUrl(req, LCSCG_REGISTRY_ENTRY.metadata_url),
      },
      general_summary: LCSCG_GENERAL_SUMMARY,
      technical_details: LCSCG_TECHNICAL_DETAILS,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt,
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/guides", async (req, res) => {
  await ensureLcscgRegistryEntry();

  const guides = getLcscgGuides();

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: { guides },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/guide/:guideId", async (req, res) => {
  const rawId = parseInt(req.params["guideId"] ?? "", 10);

  if (isNaN(rawId)) {
    res.status(400).json({
      error: "invalid_input",
      message: "guideId must be an integer between 1271 and 1282",
    });
    return;
  }

  await ensureLcscgRegistryEntry();

  const result = getLcscgGuide(rawId);

  if (!result) {
    res.json(await buildEnvelope({
      sourceId: LCSCG_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: true,
    data: { guide: result.guide, species: result.species },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/lcscg/species", async (req, res) => {
  const nameParam = req.query["name"];

  if (!nameParam || typeof nameParam !== "string" || nameParam.trim() === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "name query parameter is required (scientific name, partial match supported)",
    });
    return;
  }

  await ensureLcscgRegistryEntry();

  const records = getLcscgSpecies(nameParam.trim());

  res.json(await buildEnvelope({
    sourceId: LCSCG_SOURCE_ID,
    sourceKind: "in-memory",
    found: records.length > 0,
    data: { records },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

export default router;
