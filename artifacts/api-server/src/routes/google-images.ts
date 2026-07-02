// Google Images URL lookup — envelope-migrated routes.
// Admin/infra exemption: NOT applicable — google-images is a registered FERNS
// source (source_id: "google-images") and uses buildEnvelope().
// Envelope Contract v1: docs/data-layer-contract.md

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  GOOGLE_IMAGES_SOURCE_ID,
  GOOGLE_IMAGES_GENERAL_SUMMARY,
  GOOGLE_IMAGES_TECHNICAL_DETAILS,
  GOOGLE_IMAGES_REGISTRY_ENTRY,
  GOOGLE_IMAGES_LICENSES,
  GOOGLE_IMAGES_LICENSE_NOTES,
} from "../services/google-images/metadata.js";
import { ensureGoogleImagesRegistryEntry } from "../services/google-images/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";
import { getGoogleImagesSearchUrl } from "@workspace/internal-data-providers/google-images";

const router: IRouter = Router();

router.get("/google-images/search", async (req, res) => {
  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    await ensureGoogleImagesRegistryEntry();
    const envelope = await buildEnvelope(
      {
        sourceId: GOOGLE_IMAGES_SOURCE_ID,
        sourceKind: "in-memory",
        found: false,
        data: {
          error: "invalid_input",
          message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
        },
        method: "computed",
        cacheStatus: "bypass",
        sourceUrl: null,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.status(400).json(envelope);
    return;
  }

  await ensureGoogleImagesRegistryEntry();

  const result = getGoogleImagesSearchUrl(speciesParam);

  const envelope = await buildEnvelope(
    {
      sourceId: GOOGLE_IMAGES_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: result,
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/google-images/metadata", async (req, res) => {
  await ensureGoogleImagesRegistryEntry();
  const envelope = await buildEnvelope(
    {
      sourceId: GOOGLE_IMAGES_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: GOOGLE_IMAGES_SOURCE_ID,
        name: GOOGLE_IMAGES_REGISTRY_ENTRY.name,
        knowledge_type: GOOGLE_IMAGES_REGISTRY_ENTRY.knowledge_type,
        status: GOOGLE_IMAGES_REGISTRY_ENTRY.status,
        description: GOOGLE_IMAGES_REGISTRY_ENTRY.description,
        input_summary: GOOGLE_IMAGES_REGISTRY_ENTRY.input_summary,
        output_summary: GOOGLE_IMAGES_REGISTRY_ENTRY.output_summary,
        dependencies: GOOGLE_IMAGES_REGISTRY_ENTRY.dependencies,
        update_frequency: GOOGLE_IMAGES_REGISTRY_ENTRY.update_frequency,
        known_limitations: GOOGLE_IMAGES_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, GOOGLE_IMAGES_REGISTRY_ENTRY.metadata_url),
        licenses: GOOGLE_IMAGES_LICENSES,
        license_notes: GOOGLE_IMAGES_LICENSE_NOTES,
        general_summary: GOOGLE_IMAGES_GENERAL_SUMMARY,
        technical_details: GOOGLE_IMAGES_TECHNICAL_DETAILS,
      },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
