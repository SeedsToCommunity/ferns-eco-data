import { Router, type IRouter } from "express";
import {
  USDA_PLANTS_SOURCE_ID,
  USDA_PLANTS_GENERAL_SUMMARY,
  USDA_PLANTS_TECHNICAL_DETAILS,
  USDA_PLANTS_REGISTRY_ENTRY,
  USDA_PLANTS_PERMISSION_GRANTED,
  USDA_PLANTS_PERMISSION_STATUS,
} from "../services/usda-plants/metadata.js";
import { ensureUsdaPlantsRegistryEntry } from "../services/usda-plants/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: USDA_PLANTS_SOURCE_ID,
    fetched_at: new Date(),
    method: "direct_construction",
    upstream_url: resolveUrl(req, "/api/usda-plants/metadata"),
    general_summary: USDA_PLANTS_GENERAL_SUMMARY,
    technical_details: USDA_PLANTS_TECHNICAL_DETAILS,
  };
}

router.get("/usda-plants/metadata", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();
  res.json({
    service_id: USDA_PLANTS_SOURCE_ID,
    service_name: USDA_PLANTS_REGISTRY_ENTRY.name,
    permission_granted: USDA_PLANTS_PERMISSION_GRANTED,
    permission_status: USDA_PLANTS_PERMISSION_STATUS,
    url_strategy: "direct_construction",
    url_pattern: "https://plants.usda.gov/home/basicSearchResults?nameSearch={scientific+name}",
    validation: "none",
    registry_entry: {
      ...USDA_PLANTS_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, USDA_PLANTS_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, USDA_PLANTS_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/usda-plants", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const searchUrl = `https://plants.usda.gov/home/basicSearchResults?nameSearch=${encodeURIComponent(speciesParam)}`;

  res.json({
    found: false,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/usda-plants"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: {
      species: speciesParam,
      url: null,
      search_url: searchUrl,
      validation_method: "not_resolvable",
      note: "Species profile URLs require a USDA symbol code (e.g. 'ASYT') that cannot be derived from the scientific name. FERNS provides a search URL instead; the profile URL is not available.",
    },
  });
});

export default router;
