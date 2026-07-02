// WildType Native Plants — in-memory IDP routes.
// Admin/infra exemption: NOT applicable — wildtype-native-plants is a registered FERNS source
// (source_id: "wildtype-native-plants") and uses buildEnvelope().
// Envelope Contract v1: docs/data-layer-contract.md

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
  WILDTYPE_NATIVE_PLANTS_GENERAL_SUMMARY,
  WILDTYPE_NATIVE_PLANTS_TECHNICAL_DETAILS,
  WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY,
  WILDTYPE_NATIVE_PLANTS_LICENSES,
  WILDTYPE_NATIVE_PLANTS_LICENSE_NOTES,
} from "../services/wildtype-native-plants/metadata.js";
import {
  getWildTypeNativePlantsPlantGuide,
  getWildTypeNativePlantsPlantGuideByScientificName,
  getWildTypeNativePlantsNoteCodes,
  WILDTYPE_NATIVE_PLANTS_CATEGORIES,
} from "@workspace/internal-data-providers/wildtype-native-plants";
import { ensureWildTypeNativePlantsRegistryEntry } from "../services/wildtype-native-plants/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/wildtype-native-plants/plant-guide", async (req, res) => {
  await ensureWildTypeNativePlantsRegistryEntry();

  const categoryParam = req.query["category"];
  if (categoryParam !== undefined && categoryParam !== "") {
    const categoryStr = String(categoryParam).toLowerCase();
    const validCategories: string[] = WILDTYPE_NATIVE_PLANTS_CATEGORIES.map((c) =>
      c.toLowerCase(),
    );
    if (!validCategories.includes(categoryStr)) {
      res.status(400).json({
        error: "invalid_input",
        message:
          "Invalid category. Valid values: " +
          WILDTYPE_NATIVE_PLANTS_CATEGORIES.map((c) => JSON.stringify(c)).join(", "),
      });
      return;
    }
  }

  const category =
    categoryParam !== undefined && categoryParam !== "" ? String(categoryParam) : null;
  const result = getWildTypeNativePlantsPlantGuide(category);

  const envelope = await buildEnvelope(
    {
      sourceId: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: result,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wildtype-native-plants/plant-guide/:scientific_name", async (req, res) => {
  await ensureWildTypeNativePlantsRegistryEntry();

  const scientific_name = req.params["scientific_name"];
  if (!scientific_name || scientific_name.trim() === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "scientific_name path parameter is required.",
    });
    return;
  }

  const plant = getWildTypeNativePlantsPlantGuideByScientificName(scientific_name);

  const envelope = await buildEnvelope(
    {
      sourceId: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
      sourceKind: "in-memory",
      found: plant !== undefined,
      data: plant ?? null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wildtype-native-plants/note-codes", async (req, res) => {
  await ensureWildTypeNativePlantsRegistryEntry();

  const result = getWildTypeNativePlantsNoteCodes();

  const envelope = await buildEnvelope(
    {
      sourceId: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: result,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/wildtype-native-plants/metadata", async (req, res) => {
  await ensureWildTypeNativePlantsRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: WILDTYPE_NATIVE_PLANTS_SOURCE_ID,
        name: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.name,
        knowledge_type: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.knowledge_type,
        status: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.status,
        description: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.description,
        input_summary: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.input_summary,
        output_summary: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.output_summary,
        dependencies: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.dependencies,
        update_frequency: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.update_frequency,
        known_limitations: WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, WILDTYPE_NATIVE_PLANTS_REGISTRY_ENTRY.metadata_url),
        licenses: WILDTYPE_NATIVE_PLANTS_LICENSES,
        license_notes: WILDTYPE_NATIVE_PLANTS_LICENSE_NOTES,
        general_summary: WILDTYPE_NATIVE_PLANTS_GENERAL_SUMMARY,
        technical_details: WILDTYPE_NATIVE_PLANTS_TECHNICAL_DETAILS,
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
