import { Router, type IRouter } from "express";
import {
  GOOGLE_IMAGES_SOURCE_ID,
  GOOGLE_IMAGES_GENERAL_SUMMARY,
  GOOGLE_IMAGES_TECHNICAL_DETAILS,
  GOOGLE_IMAGES_REGISTRY_ENTRY,
  GOOGLE_IMAGES_PERMISSION_GRANTED,
  GOOGLE_IMAGES_PERMISSION_STATUS,
} from "../services/google-images/metadata.js";
import { ensureGoogleImagesRegistryEntry } from "../services/google-images/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: GOOGLE_IMAGES_SOURCE_ID,
    fetched_at: new Date(),
    method: "direct_construction",
    upstream_url: resolveUrl(req, "/api/google-images/metadata"),
    general_summary: GOOGLE_IMAGES_GENERAL_SUMMARY,
    technical_details: GOOGLE_IMAGES_TECHNICAL_DETAILS,
  };
}

router.get("/google-images/metadata", async (req, res) => {
  await ensureGoogleImagesRegistryEntry();
  res.json({
    service_id: GOOGLE_IMAGES_SOURCE_ID,
    service_name: GOOGLE_IMAGES_REGISTRY_ENTRY.name,
    permission_granted: GOOGLE_IMAGES_PERMISSION_GRANTED,
    permission_status: GOOGLE_IMAGES_PERMISSION_STATUS,
    url_strategy: "direct_construction",
    url_pattern: "https://www.google.com/search?tbm=isch&q={scientific+name}",
    validation: "none",
    registry_entry: {
      ...GOOGLE_IMAGES_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, GOOGLE_IMAGES_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, GOOGLE_IMAGES_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/google-images", async (req, res) => {
  await ensureGoogleImagesRegistryEntry();

  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(speciesParam)}`;

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/google-images"),
    provenance: filterProvenance({ ...buildProvenance(req), matched_input: speciesParam }, verbosity),
    data: {
      species: speciesParam,
      url,
      validation_method: "direct_construction",
    },
  });
});

export default router;
