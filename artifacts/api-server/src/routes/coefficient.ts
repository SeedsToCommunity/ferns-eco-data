import { Router, type IRouter } from "express";
import {
  COEFFICIENT_SOURCE_ID,
  COEFFICIENT_DERIVATION_SUMMARY,
  COEFFICIENT_DERIVATION_SCIENTIFIC,
  COEFFICIENT_REGISTRY_ENTRY,
  COEFFICIENT_PERMISSION_GRANTED,
  COEFFICIENT_PERMISSION_STATUS,
} from "../services/coefficient/metadata.js";
import { COEFFICIENT_DATA, lookupByValue } from "../services/coefficient/data.js";
import { ensureCoefficientRegistryEntry } from "../services/coefficient/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: COEFFICIENT_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/coefficient"),
    derivation_summary: COEFFICIENT_DERIVATION_SUMMARY,
    derivation_scientific: COEFFICIENT_DERIVATION_SCIENTIFIC,
  };
}

router.get("/coefficient", (req, res) => {
  const value = req.query["value"];
  if (typeof value !== "string" || value.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "value query parameter is required" });
    return;
  }

  const entry = lookupByValue(value.trim());
  const found = entry !== undefined;

  res.json({
    found,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/coefficient"),
    provenance: {
      ...buildProvenance(req),
      matched_input: value.trim(),
    },
    data: found ? entry : null,
  });
});

router.get("/coefficient/all", (req, res) => {
  res.json({
    found: true,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/coefficient/all"),
    provenance: buildProvenance(req),
    data: COEFFICIENT_DATA,
  });
});

router.get("/coefficient/metadata", async (req, res) => {
  await ensureCoefficientRegistryEntry();
  const queriedAt = new Date();

  res.json({
    service_id: COEFFICIENT_SOURCE_ID,
    service_name: COEFFICIENT_REGISTRY_ENTRY.name,
    permission_granted: COEFFICIENT_PERMISSION_GRANTED,
    permission_status: COEFFICIENT_PERMISSION_STATUS,
    registry_entry: {
      ...COEFFICIENT_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, COEFFICIENT_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, COEFFICIENT_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/coefficient/metadata"),
      method: "static_metadata",
    },
  });
});

export default router;
