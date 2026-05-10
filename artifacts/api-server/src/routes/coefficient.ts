import { Router, type IRouter } from "express";
import {
  COEFFICIENT_SOURCE_ID,
  COEFFICIENT_GENERAL_SUMMARY,
  COEFFICIENT_TECHNICAL_DETAILS,
  COEFFICIENT_REGISTRY_ENTRY,
  COEFFICIENT_PERMISSION_GRANTED,
  COEFFICIENT_PERMISSION_STATUS,
} from "../services/coefficient/metadata.js";
import { COEFFICIENT_DATA, lookupByValue } from "../services/coefficient/data.js";
import { ensureCoefficientRegistryEntry } from "../services/coefficient/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: COEFFICIENT_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/coefficient-of-conservatism/all"),
    general_summary: COEFFICIENT_GENERAL_SUMMARY,
    technical_details: COEFFICIENT_TECHNICAL_DETAILS,
  };
}

router.get("/coefficient-of-conservatism", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
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
    source_url: resolveUrl(req, "/api/coefficient-of-conservatism/all"),
    provenance: filterProvenance({
      ...buildProvenance(req),
      matched_input: value.trim(),
    }, verbosity),
    data: found ? entry : null,
  });
});

router.get("/coefficient-of-conservatism/all", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  res.json({
    found: true,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/coefficient-of-conservatism/all"),
    provenance: filterProvenance(buildProvenance(req), verbosity),
    data: COEFFICIENT_DATA,
  });
});

router.get("/coefficient-of-conservatism/metadata", async (req, res) => {
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
      upstream_url: resolveUrl(req, "/api/coefficient-of-conservatism/metadata"),
      method: "static_metadata",
    },
  });
});

export default router;
