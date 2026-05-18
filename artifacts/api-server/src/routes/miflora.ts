import { Router, type IRouter } from "express";
import {
  buildCountiesCacheKey,
  buildImagesCacheKey,
  fetchCounties,
  fetchImages,
} from "../services/miflora/connector.js";
import {
  lookupCounties,
  storeCounties,
  lookupImages,
  storeImages,
} from "../services/miflora/cache.js";
import {
  MIFLORA_SOURCE_ID,
  MIFLORA_ATTRIBUTION,
  MIFLORA_PERMISSION_GRANTED,
  MIFLORA_PERMISSION_STATUS,
  MIFLORA_GENERAL_SUMMARY,
  MIFLORA_TECHNICAL_DETAILS,
  MIFLORA_REGISTRY_ENTRY,
} from "../services/miflora/metadata.js";
import { ensureMifloraRegistryEntry } from "../services/miflora/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  GetMifloraCountiesQueryParams,
  GetMifloraCountiesResponse,
  GetMifloraImagesQueryParams,
  GetMifloraImagesResponse,
  GetMifloraMetadataResponse,
} from "@workspace/api-zod";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

router.get("/miflora/locs_sp", async (req, res) => {
  const parsed = GetMifloraCountiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildCountiesCacheKey(name);

  if (!refresh) {
    const cached = await lookupCounties(cacheKey);
    if (cached) {
      res.json(GetMifloraCountiesResponse.parse(buildCountiesResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchCounties(name);
    const stored = await storeCounties(cacheKey, name, result);
    res.json(GetMifloraCountiesResponse.parse(buildCountiesResponse(stored, "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora counties lookup failed");
    res.status(502).json(buildCountiesResponse({
      found: false,
      source_url: null,
      raw_response: null,
      fetched_at: new Date(),
      upstream_url: `https://michiganflora.net/api/v1.0/flora_search_sp?scientific_name=${encodeURIComponent(name)}`,
      source_id: MIFLORA_SOURCE_ID,
      method: "api_fetch",
      general_summary: MIFLORA_GENERAL_SUMMARY,
      technical_details: MIFLORA_TECHNICAL_DETAILS,
      queried_name: name,
    }, "error", verbosity));
  }
});

function buildCountiesResponse(
  row: {
    found: boolean;
    source_url: string | null;
    raw_response: unknown;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
    queried_name?: string;
  },
  cache_status: "hit" | "miss" | "error",
  verbosity?: string,
) {
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response ?? null,
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      ...(row.queried_name ? { matched_input: row.queried_name } : {}),
    }, verbosity),
  };
}

router.get("/miflora/allimage_info", async (req, res) => {
  const parsed = GetMifloraImagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildImagesCacheKey(name);

  if (!refresh) {
    const cached = await lookupImages(cacheKey);
    if (cached) {
      res.json(GetMifloraImagesResponse.parse(buildImagesResponse(cached, "hit", verbosity)));
      return;
    }
  }

  try {
    const result = await fetchImages(name);
    const stored = await storeImages(cacheKey, name, result);
    res.json(GetMifloraImagesResponse.parse(buildImagesResponse(stored, "miss", verbosity)));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora images lookup failed");
    res.status(502).json(buildImagesResponse({
      found: false,
      plant_id: null,
      source_url: null,
      raw_response: null,
      fetched_at: new Date(),
      upstream_url: `https://michiganflora.net/api/v1.0/flora_search_sp?scientific_name=${encodeURIComponent(name)}`,
      source_id: MIFLORA_SOURCE_ID,
      method: "api_fetch",
      general_summary: MIFLORA_GENERAL_SUMMARY,
      technical_details: MIFLORA_TECHNICAL_DETAILS,
      queried_name: name,
    }, "error", verbosity));
  }
});

function buildImagesResponse(
  row: {
    found: boolean;
    source_url: string | null;
    raw_response: unknown;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    general_summary: string;
    technical_details: string;
    plant_id?: number | null;
    queried_name?: string;
  },
  cache_status: "hit" | "miss" | "error",
  verbosity?: string,
) {
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.found ? (row.raw_response ?? null) : null,
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      ...(row.queried_name ? { matched_input: row.queried_name } : {}),
    }, verbosity),
  };
}

router.get("/miflora/metadata", async (req, res) => {
  await ensureMifloraRegistryEntry();
  const queriedAt = new Date();

  res.json(GetMifloraMetadataResponse.parse({
    service_id: MIFLORA_SOURCE_ID,
    service_name: MIFLORA_REGISTRY_ENTRY.name,
    permission_granted: MIFLORA_PERMISSION_GRANTED,
    permission_status: MIFLORA_PERMISSION_STATUS,
    attribution: MIFLORA_ATTRIBUTION,
    registry_entry: {
      ...MIFLORA_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, MIFLORA_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, MIFLORA_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      source_id: MIFLORA_SOURCE_ID,
      fetched_at: queriedAt,
      method: "static_metadata",
      upstream_url: resolveUrl(req, "/api/miflora/metadata"),
      general_summary: MIFLORA_GENERAL_SUMMARY,
      technical_details: MIFLORA_TECHNICAL_DETAILS,
    },
  }));
});

export default router;
