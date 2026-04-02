import { Router, type IRouter } from "express";
import {
  WUCOLS_SOURCE_ID,
  WUCOLS_DERIVATION_SUMMARY,
  WUCOLS_DERIVATION_SCIENTIFIC,
  WUCOLS_REGISTRY_ENTRY,
  WUCOLS_PERMISSION_GRANTED,
  WUCOLS_PERMISSION_STATUS,
} from "../services/wucols/metadata.js";
import { WUCOLS_DATA, lookupByCode } from "../services/wucols/data.js";
import { ensureWucolsRegistryEntry } from "../services/wucols/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: WUCOLS_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/wucols/all"),
    derivation_summary: WUCOLS_DERIVATION_SUMMARY,
    derivation_scientific: WUCOLS_DERIVATION_SCIENTIFIC,
  };
}

router.get("/wucols", (req, res) => {
  const code = req.query["code"];
  if (typeof code !== "string" || code.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "code query parameter is required (VL, L, M, or H)" });
    return;
  }

  const entry = lookupByCode(code.trim());
  const found = entry !== undefined;

  res.json({
    found,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/wucols"),
    provenance: {
      ...buildProvenance(req),
      matched_input: code.trim().toUpperCase(),
    },
    data: found ? entry : null,
  });
});

router.get("/wucols/all", (req, res) => {
  res.json({
    found: true,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/wucols/all"),
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/wucols/all"),
    },
    data: WUCOLS_DATA,
  });
});

router.get("/wucols/metadata", async (req, res) => {
  await ensureWucolsRegistryEntry();
  const queriedAt = new Date();

  res.json({
    service_id: WUCOLS_SOURCE_ID,
    service_name: WUCOLS_REGISTRY_ENTRY.name,
    permission_granted: WUCOLS_PERMISSION_GRANTED,
    permission_status: WUCOLS_PERMISSION_STATUS,
    registry_entry: {
      ...WUCOLS_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, WUCOLS_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, WUCOLS_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/wucols/metadata"),
      method: "static_metadata",
    },
  });
});

export default router;
