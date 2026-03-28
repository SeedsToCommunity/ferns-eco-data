import { Router, type IRouter } from "express";
import {
  buildSpeciesCacheKey,
  buildCountiesCacheKey,
  fetchSpecies,
  fetchCounties,
} from "../services/miflora/connector.js";
import {
  lookupSpecies,
  storeSpecies,
  lookupCounties,
  storeCounties,
} from "../services/miflora/cache.js";
import {
  MIFLORA_SOURCE_ID,
  MIFLORA_ATTRIBUTION,
  MIFLORA_PERMISSION_GRANTED,
  MIFLORA_PERMISSION_STATUS,
  MIFLORA_DERIVATION_SUMMARY,
  MIFLORA_DERIVATION_SCIENTIFIC,
  MIFLORA_REGISTRY_ENTRY,
} from "../services/miflora/metadata.js";
import { ensureMifloraRegistryEntry } from "../services/miflora/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import {
  GetMifloraSpeciesQueryParams,
  GetMifloraSpeciesResponse,
  GetMifloraCountiesQueryParams,
  GetMifloraCountiesResponse,
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
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
  }
});

function buildSpeciesResponse(
  row: {
    found: boolean;
    source_url: string | null;
    raw_response: unknown;
    fetched_at: Date;
    upstream_url: string;
    source_id: string;
    method: string;
    derivation_summary: string;
    derivation_scientific: string;
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
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
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
    res.status(502).json({ error: "upstream_error", message: "Failed to fetch from Michigan Flora API" });
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
    derivation_summary: string;
    derivation_scientific: string;
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
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
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
      derivation_summary: MIFLORA_DERIVATION_SUMMARY,
      derivation_scientific: MIFLORA_DERIVATION_SCIENTIFIC,
    },
  }));
});

export default router;
