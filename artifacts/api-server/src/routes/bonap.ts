import { Router, type IRouter } from "express";
import { GetBonapMapQueryParams, GetBonapMapResponse, GetBonapMetadataResponse } from "@workspace/api-zod";
import { normalizeInput, verifyMapExists, buildCacheKey, buildProvenance } from "../services/bonap/connector.js";
import { lookupCache, storeCache } from "../services/bonap/cache.js";
import {
  BONAP_ATTRIBUTION,
  BONAP_COLOR_KEY,
  BONAP_COLOR_KEY_IMAGE_URL,
  BONAP_COLOR_KEY_URL,
  BONAP_DATA_VINTAGE,
  BONAP_PERMISSION_GRANTED,
  BONAP_PERMISSION_STATUS,
  BONAP_SOURCE_ID,
} from "../services/bonap/metadata.js";
import { ensureBonapRegistryEntry } from "../services/bonap/seed.js";

const router: IRouter = Router();

router.get("/bonap/map", async (req, res) => {
  const rawGenus = req.query.genus;
  if (!rawGenus || typeof rawGenus !== "string" || rawGenus.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "genus is required and must be a non-empty string" });
    return;
  }

  const rawRefresh = req.query.refresh;
  if (rawRefresh !== undefined && rawRefresh !== "true" && rawRefresh !== "false" && rawRefresh !== "1" && rawRefresh !== "0") {
    res.status(400).json({ error: "invalid_input", message: "refresh must be 'true', 'false', '1', or '0' if provided" });
    return;
  }

  const rawQuery = {
    ...req.query,
    refresh: rawRefresh === "true" || rawRefresh === "1" ? true : undefined,
  };
  const parsed = GetBonapMapQueryParams.safeParse(rawQuery);
  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_input",
      message: parsed.error.issues.map((i) => i.message).join("; "),
    });
    return;
  }

  const { genus, species, map_type, refresh } = parsed.data;

  if (!species || species.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "species is required for all map types" });
    return;
  }

  const normalized = normalizeInput(genus, species, map_type);
  const cacheKey = buildCacheKey(normalized);

  if (!refresh) {
    const cached = await lookupCache(cacheKey);
    if (cached) {
      const response = GetBonapMapResponse.parse(buildMapResponse(cached, "hit"));
      res.json(response);
      return;
    }
  }

  const result = await verifyMapExists(normalized);
  const provenance = buildProvenance(result);
  const stored = await storeCache(cacheKey, result, provenance);
  const response = GetBonapMapResponse.parse(buildMapResponse(stored, refresh ? "bypassed" : "miss"));
  res.json(response);
});

function buildMapResponse(
  row: {
    map_url: string | null;
    source_url: string | null;
    map_type: string;
    genus: string;
    species: string | null;
    species_stripped: boolean;
    status: string;
    source_id: string;
    fetched_at: Date;
    method: string;
    upstream_url: string;
    derivation_summary: string;
    derivation_scientific: string;
  },
  cache_status: "hit" | "miss" | "bypassed",
) {
  return {
    source_url: row.source_url,
    found: row.status === "found",
    data: {
      map_url: row.map_url ?? null,
      map_type_served: row.map_type as "county_species" | "state_species",
      genus: row.genus,
      species: row.species ?? null,
      species_stripped: row.species_stripped,
      status: row.status as "found" | "not_found" | "unverified",
      color_key_url: BONAP_COLOR_KEY_URL,
      color_key_image_url: BONAP_COLOR_KEY_IMAGE_URL,
      color_key: BONAP_COLOR_KEY,
      data_vintage: BONAP_DATA_VINTAGE,
      permission_granted: BONAP_PERMISSION_GRANTED,
      permission_status: BONAP_PERMISSION_STATUS,
      attribution: BONAP_ATTRIBUTION,
      cache_status,
      queried_at: new Date(),
      note: row.status === "unverified"
        ? "Map URL could not be verified during cache population — BONAP's server did not return a definitive response. The map may or may not exist. Retry with ?refresh=true to attempt re-verification."
        : null,
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/bonap/metadata", async (_req, res) => {
  await ensureBonapRegistryEntry();

  const payload = GetBonapMetadataResponse.parse({
    service_id: BONAP_SOURCE_ID,
    service_name: "BONAP North American Plant Atlas — Distribution Maps",
    data_vintage: BONAP_DATA_VINTAGE,
    permission_granted: BONAP_PERMISSION_GRANTED,
    permission_status: BONAP_PERMISSION_STATUS,
    attribution: BONAP_ATTRIBUTION,
    color_key: BONAP_COLOR_KEY,
    color_key_url: BONAP_COLOR_KEY_URL,
    color_key_image_url: BONAP_COLOR_KEY_IMAGE_URL,
    queried_at: new Date(),
  });
  res.json(payload);
});

export default router;
