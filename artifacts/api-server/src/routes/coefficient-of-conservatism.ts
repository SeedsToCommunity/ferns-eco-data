import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  COEFFICIENT_SOURCE_ID,
  COEFFICIENT_GENERAL_SUMMARY,
  COEFFICIENT_TECHNICAL_DETAILS,
  COEFFICIENT_REGISTRY_ENTRY,
  COEFFICIENT_LICENSES,
  COEFFICIENT_LICENSE_NOTES,
} from "../services/coefficient-of-conservatism/metadata.js";
import { getCoefficient, listCoefficients } from "@workspace/internal-data-providers/coefficient-of-conservatism";
import { ensureCoefficientRegistryEntry } from "../services/coefficient-of-conservatism/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/coefficient-of-conservatism", async (req, res) => {
  const value = req.query["value"];
  if (typeof value !== "string" || value.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "value query parameter is required" });
    return;
  }

  await ensureCoefficientRegistryEntry();
  const entry = getCoefficient(value.trim());
  const found = entry !== undefined;

  const envelope = await buildEnvelope(
    {
      sourceId: COEFFICIENT_SOURCE_ID,
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

router.get("/coefficient-of-conservatism/all", async (req, res) => {
  await ensureCoefficientRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: COEFFICIENT_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: listCoefficients(),
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/coefficient-of-conservatism/metadata", async (req, res) => {
  await ensureCoefficientRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: COEFFICIENT_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: COEFFICIENT_SOURCE_ID,
        name: COEFFICIENT_REGISTRY_ENTRY.name,
        knowledge_type: COEFFICIENT_REGISTRY_ENTRY.knowledge_type,
        status: COEFFICIENT_REGISTRY_ENTRY.status,
        description: COEFFICIENT_REGISTRY_ENTRY.description,
        input_summary: COEFFICIENT_REGISTRY_ENTRY.input_summary,
        output_summary: COEFFICIENT_REGISTRY_ENTRY.output_summary,
        dependencies: COEFFICIENT_REGISTRY_ENTRY.dependencies,
        update_frequency: COEFFICIENT_REGISTRY_ENTRY.update_frequency,
        known_limitations: COEFFICIENT_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, COEFFICIENT_REGISTRY_ENTRY.metadata_url),
        licenses: COEFFICIENT_LICENSES,
        license_notes: COEFFICIENT_LICENSE_NOTES,
        general_summary: COEFFICIENT_GENERAL_SUMMARY,
        technical_details: COEFFICIENT_TECHNICAL_DETAILS,
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
