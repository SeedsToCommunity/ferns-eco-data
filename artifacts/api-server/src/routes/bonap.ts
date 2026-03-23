import { Router, type IRouter } from "express";
import { z } from "zod";
import { normalizeInput, verifyMapExists, buildCacheKey, buildProvenance } from "../services/bonap/connector.js";
import { lookupCache, storeCache } from "../services/bonap/cache.js";
import {
  BONAP_ATTRIBUTION,
  BONAP_COLOR_KEY,
  BONAP_COLOR_KEY_URL,
  BONAP_DATA_VINTAGE,
  BONAP_PERMISSION_GRANTED,
  BONAP_PERMISSION_STATUS,
  BONAP_SOURCE_ID,
} from "../services/bonap/metadata.js";
import { ensureBonappRegistryEntry } from "../services/bonap/seed.js";

const router: IRouter = Router();

const mapQuerySchema = z.object({
  genus: z.string().min(1, "genus is required"),
  species: z.string().optional(),
  map_type: z.enum(["county_species", "state_species", "genus_county"]).default("county_species"),
  refresh: z
    .string()
    .optional()
    .transform((v: string | undefined) => v === "true" || v === "1"),
});

router.get("/bonap/map", async (req, res) => {
  const parsed = mapQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "invalid_input",
      message: parsed.error.issues.map((i: { message: string }) => i.message).join("; "),
    });
    return;
  }

  const { genus, species, map_type, refresh } = parsed.data;

  if (map_type === "state_species") {
    res.status(501).json({
      error: "not_implemented",
      message:
        "State/continental species maps are not yet implemented — the URL pattern could not be verified. Use county_species or genus_county.",
    });
    return;
  }

  const normalized = normalizeInput(genus, species, map_type);
  const cacheKey = buildCacheKey(normalized);

  if (!refresh) {
    const cached = await lookupCache(cacheKey);
    if (cached) {
      const response = buildMapResponse(cached, "hit");
      res.json(response);
      return;
    }
  }

  const result = await verifyMapExists(normalized);
  const provenance = buildProvenance(result);
  const stored = await storeCache(cacheKey, result, provenance);
  const response = buildMapResponse(stored, refresh ? "bypassed" : "miss");
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
    tdc_taxon_id: number | null;
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
      map_url: row.map_url,
      map_type_served: row.map_type,
      genus: row.genus,
      species: row.species,
      species_stripped: row.species_stripped,
      status: row.status,
      tdc_taxon_id: row.tdc_taxon_id,
      color_key_url: BONAP_COLOR_KEY_URL,
      color_key: BONAP_COLOR_KEY,
      data_vintage: BONAP_DATA_VINTAGE,
      permission_granted: BONAP_PERMISSION_GRANTED,
      attribution: BONAP_ATTRIBUTION,
      cache_status,
      queried_at: new Date().toISOString(),
    },
    provenance: {
      source_id: row.source_id,
      fetched_at: row.fetched_at.toISOString(),
      method: row.method,
      upstream_url: row.upstream_url,
      derivation_summary: row.derivation_summary,
      derivation_scientific: row.derivation_scientific,
    },
  };
}

router.get("/bonap/metadata", async (_req, res) => {
  await ensureBonappRegistryEntry();

  res.json({
    service_id: BONAP_SOURCE_ID,
    service_name: "BONAP North American Plant Atlas — Distribution Maps",
    data_vintage: BONAP_DATA_VINTAGE,
    permission_granted: BONAP_PERMISSION_GRANTED,
    permission_status: BONAP_PERMISSION_STATUS,
    attribution: BONAP_ATTRIBUTION,
    color_key: BONAP_COLOR_KEY,
    color_key_url: BONAP_COLOR_KEY_URL,
    queried_at: new Date().toISOString(),
  });
});

export default router;
