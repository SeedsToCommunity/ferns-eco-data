import { Router, type IRouter } from "express";
import {
  buildSpeciesCacheKey,
  buildCountiesCacheKey,
  buildImagesCacheKey,
  buildMifloraImageUrls,
  fetchSpecies,
  fetchCounties,
  fetchImages,
} from "../services/miflora/connector.js";
import {
  lookupSpecies,
  storeSpecies,
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
  GetMifloraSpeciesQueryParams,
  GetMifloraSpeciesResponse,
  GetMifloraCountiesQueryParams,
  GetMifloraCountiesResponse,
  GetMifloraImagesQueryParams,
  GetMifloraImagesResponse,
  GetMifloraMetadataResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/miflora/species", async (req, res) => {
  const parsed = GetMifloraSpeciesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildSpeciesCacheKey(name);

  if (!refresh) {
    const cached = await lookupSpecies(cacheKey);
    if (cached) {
      res.json(GetMifloraSpeciesResponse.parse(buildSpeciesResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchSpecies(name);
    const stored = await storeSpecies(cacheKey, name, result);
    res.json(GetMifloraSpeciesResponse.parse(buildSpeciesResponse(stored, "miss")));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora species lookup failed");
    res.status(502).json(buildSpeciesResponse({
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
    }, "error"));
  }
});

function enrichPimageInfo(
  rawResponse: unknown,
): unknown {
  if (!rawResponse || typeof rawResponse !== "object") return rawResponse;
  const resp = rawResponse as Record<string, unknown>;
  const pimageInfo = resp["pimage_info"];
  if (!pimageInfo || typeof pimageInfo !== "object") return rawResponse;

  const pimage = pimageInfo as Record<string, unknown>;
  const plantId = pimage["plant_id"];
  const imageId = pimage["image_id"];
  if (plantId == null || imageId == null) return rawResponse;

  const urls = buildMifloraImageUrls(Number(plantId), imageId as number | string);
  return {
    ...resp,
    pimage_info: {
      ...pimage,
      image_url: urls.image_url,
      thumbnail_url: urls.thumbnail_url,
    },
  };
}

function buildSpeciesResponse(
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
) {
  const enriched = row.found ? enrichPimageInfo(row.raw_response) : null;
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: enriched ?? null,
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      ...(row.queried_name ? { matched_input: row.queried_name } : {}),
    },
  };
}

router.get("/miflora/counties", async (req, res) => {
  const parsed = GetMifloraCountiesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildCountiesCacheKey(name);

  if (!refresh) {
    const cached = await lookupCounties(cacheKey);
    if (cached) {
      res.json(GetMifloraCountiesResponse.parse(buildCountiesResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchCounties(name);
    const stored = await storeCounties(cacheKey, name, result);
    res.json(GetMifloraCountiesResponse.parse(buildCountiesResponse(stored, "miss")));
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
    }, "error"));
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
) {
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.raw_response ?? null,
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      ...(row.queried_name ? { matched_input: row.queried_name } : {}),
    },
  };
}

router.get("/miflora/images", async (req, res) => {
  const parsed = GetMifloraImagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "invalid_input", message: parsed.error.errors[0]?.message ?? "Invalid query parameters" });
    return;
  }

  const name = parsed.data.name;
  const refresh = parsed.data.refresh ?? false;
  const cacheKey = buildImagesCacheKey(name);

  if (!refresh) {
    const cached = await lookupImages(cacheKey);
    if (cached) {
      res.json(GetMifloraImagesResponse.parse(buildImagesResponse(cached, "hit")));
      return;
    }
  }

  try {
    const result = await fetchImages(name);
    const stored = await storeImages(cacheKey, name, result);
    res.json(GetMifloraImagesResponse.parse(buildImagesResponse(stored, "miss")));
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
    }, "error"));
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
) {
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: row.found ? (row.raw_response ?? null) : null,
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
      ...(row.queried_name ? { matched_input: row.queried_name } : {}),
    },
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
