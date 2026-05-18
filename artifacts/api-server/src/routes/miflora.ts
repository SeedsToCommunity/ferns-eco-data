import { Router, type IRouter } from "express";
import {
  buildCountiesCacheKey,
  buildImagesCacheKey,
  buildFloraSearchCacheKey,
  buildSpecTextCacheKey,
  buildSynonymsCacheKey,
  buildPImageCacheKey,
  fetchCounties,
  fetchImages,
  fetchFloraSearchSp,
  fetchSpecText,
  fetchSynonyms,
  fetchPImageInfo,
  type MifloraSpeciesRecord,
  type MifloraSynonymRecord,
} from "../services/miflora/connector.js";
import {
  lookupCounties,
  storeCounties,
  lookupImages,
  storeImages,
  lookupFloraSearch,
  storeFloraSearch,
  lookupSpecText,
  storeSpecText,
  lookupSynonyms,
  storeSynonyms,
  lookupPImage,
  storePImage,
} from "../services/miflora/cache.js";
import {
  MIFLORA_SOURCE_ID,
  MIFLORA_ATTRIBUTION,
  MIFLORA_LICENSES,
  MIFLORA_LICENSE_NOTES,
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

router.get("/miflora/flora_search_sp", async (req, res) => {
  const rawName = req.query.name;
  if (!rawName || typeof rawName !== "string" || rawName.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "name is required and must be a non-empty string" });
    return;
  }
  const name = rawName.trim();
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildFloraSearchCacheKey(name);

  if (!refresh) {
    const cached = await lookupFloraSearch(cacheKey);
    if (cached) {
      res.json(buildFloraSearchResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchFloraSearchSp(name);
    const stored = await storeFloraSearch(cacheKey, name, result);
    res.json(buildFloraSearchResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora flora_search_sp failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildFloraSearchResponse(
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
  cache_status: "hit" | "miss" | "bypassed" | "error",
  verbosity?: string,
) {
  const rawResponse = row.raw_response as { records: MifloraSpeciesRecord[] } | null;
  const records = rawResponse?.records ?? [];
  const first = records[0] ?? null;
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: {
      plant_id: row.plant_id ?? first?.plant_id ?? null,
      scientific_name: first?.scientific_name ?? null,
      family_name: first?.family_name ?? null,
      na: first?.na ?? null,
      c: first?.c ?? null,
      wet: first?.wet ?? null,
      phys: first?.phys ?? null,
      common_name: first?.common_name ?? [],
      records,
    },
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

router.get("/miflora/spec_text", async (req, res) => {
  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildSpecTextCacheKey(id);

  if (!refresh) {
    const cached = await lookupSpecText(cacheKey);
    if (cached) {
      res.json(buildSpecTextResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchSpecText(id);
    const stored = await storeSpecText(cacheKey, id, result);
    res.json(buildSpecTextResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora spec_text failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildSpecTextResponse(
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
  },
  cache_status: "hit" | "miss" | "bypassed" | "error",
  verbosity?: string,
) {
  const rawResponse = row.raw_response as { text: string | null } | null;
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: {
      plant_id: row.plant_id ?? null,
      text: rawResponse?.text ?? null,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/miflora/synonyms", async (req, res) => {
  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildSynonymsCacheKey(id);

  if (!refresh) {
    const cached = await lookupSynonyms(cacheKey);
    if (cached) {
      res.json(buildSynonymsResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchSynonyms(id);
    const stored = await storeSynonyms(cacheKey, id, result);
    res.json(buildSynonymsResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora synonyms failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildSynonymsResponse(
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
  },
  cache_status: "hit" | "miss" | "bypassed" | "error",
  verbosity?: string,
) {
  const rawResponse = row.raw_response as { synonyms: MifloraSynonymRecord[] } | null;
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: {
      plant_id: row.plant_id ?? null,
      synonyms: rawResponse?.synonyms ?? [],
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/miflora/pimage_info", async (req, res) => {
  const rawId = req.query.id;
  const id = rawId && typeof rawId === "string" ? parseInt(rawId, 10) : NaN;
  if (!Number.isInteger(id) || id < 1) {
    res.status(400).json({ error: "invalid_input", message: "id must be a positive integer (Michigan Flora plant_id)" });
    return;
  }
  const refresh = req.query.refresh === "true" || req.query.refresh === "1";
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  const cacheKey = buildPImageCacheKey(id);

  if (!refresh) {
    const cached = await lookupPImage(cacheKey);
    if (cached) {
      res.json(buildPImageResponse(cached, "hit", verbosity));
      return;
    }
  }

  try {
    const result = await fetchPImageInfo(id);
    const stored = await storePImage(cacheKey, id, result);
    res.json(buildPImageResponse(stored, refresh ? "bypassed" : "miss", verbosity));
  } catch (err) {
    req.log.error({ err }, "Michigan Flora pimage_info failed");
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildPImageResponse(
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
  },
  cache_status: "hit" | "miss" | "bypassed" | "error",
  verbosity?: string,
) {
  const rawResponse = row.raw_response as { image: unknown } | null;
  return {
    source_url: row.source_url ?? null,
    found: row.found,
    cache_status,
    queried_at: new Date(),
    data: {
      plant_id: row.plant_id ?? null,
      image: rawResponse?.image ?? null,
    },
    provenance: filterProvenance({
      source_id: row.source_id,
      fetched_at: row.fetched_at,
      method: row.method,
      upstream_url: row.upstream_url,
      general_summary: row.general_summary,
      technical_details: row.technical_details,
    }, verbosity),
  };
}

router.get("/miflora/metadata", async (req, res) => {
  await ensureMifloraRegistryEntry();
  const queriedAt = new Date();

  res.json(GetMifloraMetadataResponse.parse({
    service_id: MIFLORA_SOURCE_ID,
    service_name: MIFLORA_REGISTRY_ENTRY.name,
    licenses: MIFLORA_LICENSES,
    license_notes: MIFLORA_LICENSE_NOTES,
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
