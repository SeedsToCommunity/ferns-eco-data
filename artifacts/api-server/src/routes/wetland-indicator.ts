import { Router, type IRouter } from "express";
import {
  WETLAND_INDICATOR_SOURCE_ID,
  WETLAND_INDICATOR_GENERAL_SUMMARY,
  WETLAND_INDICATOR_TECHNICAL_DETAILS,
  WETLAND_INDICATOR_REGISTRY_ENTRY,
  WETLAND_INDICATOR_PERMISSION_GRANTED,
  WETLAND_INDICATOR_PERMISSION_STATUS,
} from "../services/wetland-indicator/metadata.js";
import {
  WETLAND_INDICATOR_DATA,
  lookupByCode,
  lookupByW,
} from "../services/wetland-indicator/data.js";
import { ensureWetlandIndicatorRegistryEntry } from "../services/wetland-indicator/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: WETLAND_INDICATOR_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/wetland-indicator/all"),
    general_summary: WETLAND_INDICATOR_GENERAL_SUMMARY,
    technical_details: WETLAND_INDICATOR_TECHNICAL_DETAILS,
  };
}

router.get("/wetland-indicator", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const code = req.query["code"];
  if (typeof code !== "string" || code.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "code query parameter is required (OBL, FACW, FAC, FACU, or UPL)" });
    return;
  }

  const entry = lookupByCode(code.trim());
  const found = entry !== undefined;

  res.json({
    found,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/wetland-indicator/all"),
    provenance: filterProvenance({
      ...buildProvenance(req),
      matched_input: code.trim().toUpperCase(),
    }, verbosity),
    data: found ? entry : null,
  });
});

router.get("/wetland-indicator/w", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
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

  const entry = lookupByW(w);
  const found = entry !== undefined;

  res.json({
    found,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/wetland-indicator/all"),
    provenance: filterProvenance({
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/wetland-indicator/all"),
      matched_input: String(w),
    }, verbosity),
    data: found ? entry : null,
  });
});

router.get("/wetland-indicator/all", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  res.json({
    found: true,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/wetland-indicator/all"),
    provenance: filterProvenance({
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/wetland-indicator/all"),
    }, verbosity),
    data: WETLAND_INDICATOR_DATA,
  });
});

router.get("/wetland-indicator/metadata", async (req, res) => {
  await ensureWetlandIndicatorRegistryEntry();
  const queriedAt = new Date();

  res.json({
    service_id: WETLAND_INDICATOR_SOURCE_ID,
    service_name: WETLAND_INDICATOR_REGISTRY_ENTRY.name,
    permission_granted: WETLAND_INDICATOR_PERMISSION_GRANTED,
    permission_status: WETLAND_INDICATOR_PERMISSION_STATUS,
    registry_entry: {
      ...WETLAND_INDICATOR_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, WETLAND_INDICATOR_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, WETLAND_INDICATOR_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/wetland-indicator/metadata"),
      method: "static_metadata",
    },
  });
});

export default router;
