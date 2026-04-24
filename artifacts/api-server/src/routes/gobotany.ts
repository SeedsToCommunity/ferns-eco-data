import { Router, type IRouter } from "express";
import { db, botanicalWebRefsCacheTable } from "@workspace/db";
import { and, eq, gt } from "drizzle-orm";
import { fetchAndCacheSpeciesText } from "../services/botanical-refs/scraper.js";
import {
  GOBOTANY_SOURCE_ID,
  GOBOTANY_GENERAL_SUMMARY,
  GOBOTANY_TECHNICAL_DETAILS,
  GOBOTANY_REGISTRY_ENTRY,
  GOBOTANY_PERMISSION_GRANTED,
  GOBOTANY_PERMISSION_STATUS,
} from "../services/gobotany/metadata.js";
import { ensureGobotanyRegistryEntry } from "../services/gobotany/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const router: IRouter = Router();

const GOBOTANY_BASE = "https://gobotany.nativeplanttrust.org";

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: GOBOTANY_SOURCE_ID,
    fetched_at: new Date(),
    method: "direct_construction",
    upstream_url: resolveUrl(req, "/api/gobotany/metadata"),
    general_summary: GOBOTANY_GENERAL_SUMMARY,
    technical_details: GOBOTANY_TECHNICAL_DETAILS,
  };
}

function parseSpecies(input: string): { genus: string; species: string } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const genus = parts[0].toLowerCase();
  const species = parts[1].toLowerCase();
  if (!/^[a-z]+$/.test(genus) || !/^[a-z]+$/.test(species)) return null;
  return { genus, species };
}

router.get("/gobotany/metadata", async (req, res) => {
  await ensureGobotanyRegistryEntry();
  res.json({
    service_id: GOBOTANY_SOURCE_ID,
    service_name: GOBOTANY_REGISTRY_ENTRY.name,
    permission_granted: GOBOTANY_PERMISSION_GRANTED,
    permission_status: GOBOTANY_PERMISSION_STATUS,
    url_strategy: "direct_construction",
    url_pattern: `${GOBOTANY_BASE}/species/{genus}/{species}/`,
    validation: "http_get",
    registry_entry: {
      ...GOBOTANY_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/gobotany", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const parsed = parseSpecies(speciesParam);
  if (!parsed) {
    res.status(400).json({
      error: "invalid_input",
      message: "species must be a binomial name (genus + species epithet, e.g. Acer rubrum)",
    });
    return;
  }

  const { genus, species } = parsed;
  const url = `${GOBOTANY_BASE}/species/${genus}/${species}/`;
  // Normalize for consistent cache key regardless of input casing/whitespace
  const cacheKey = speciesParam.trim().toLowerCase();
  const cacheThreshold = new Date(Date.now() - CACHE_TTL_MS);

  // Check cache first
  const cached = await db
    .select()
    .from(botanicalWebRefsCacheTable)
    .where(
      and(
        eq(botanicalWebRefsCacheTable.site_id, GOBOTANY_SOURCE_ID),
        eq(botanicalWebRefsCacheTable.scientific_name, cacheKey),
        gt(botanicalWebRefsCacheTable.cached_at, cacheThreshold),
      ),
    )
    .limit(1);

  if (cached.length > 0) {
    const hit = cached[0];
    res.json({
      found: hit.found,
      queried_at: new Date(),
      source_url: resolveUrl(req, "/api/gobotany"),
      provenance: { ...buildProvenance(req), matched_input: speciesParam, cache_hit: true, cached_at: hit.cached_at },
      data: hit.found
        ? { species: speciesParam, url: hit.url, validation_method: hit.validation_method, cache_hit: true }
        : null,
    });
    return;
  }

  // Cache miss — make live HTTP GET request
  let found = false;
  let validationMethod: string;
  let httpStatus: number | null = null;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
    httpStatus = resp.status;
    found = resp.status === 200;
    validationMethod = "http_get";
  } catch {
    validationMethod = "http_get_failed";
    found = false;
  }

  // Write to cache (using normalized key)
  await db
    .insert(botanicalWebRefsCacheTable)
    .values({
      site_id: GOBOTANY_SOURCE_ID,
      scientific_name: cacheKey,
      url: found ? url : null,
      found,
      validation_method: validationMethod,
    })
    .onConflictDoUpdate({
      target: [botanicalWebRefsCacheTable.site_id, botanicalWebRefsCacheTable.scientific_name],
      set: { url: found ? url : null, found, validation_method: validationMethod, cached_at: new Date() },
    });

  res.json({
    found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/gobotany"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam, cache_hit: false },
    data: found
      ? {
          species: speciesParam,
          url,
          validation_method: validationMethod,
          http_status: httpStatus,
        }
      : null,
  });
});

router.get("/gobotany/species-text", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  const refresh = req.query["refresh"] === "true";

  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const parsed = parseSpecies(speciesParam);
  if (!parsed) {
    res.status(400).json({
      error: "invalid_input",
      message: "species must be a binomial name (genus + species epithet, e.g. Acer rubrum)",
    });
    return;
  }

  const { genus, species } = parsed;
  const url = `${GOBOTANY_BASE}/species/${genus}/${species}/`;
  const cacheKey = speciesParam.trim().toLowerCase();
  const result = await fetchAndCacheSpeciesText(GOBOTANY_SOURCE_ID, cacheKey, url, refresh);

  res.json({
    found: result.found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/gobotany/species-text"),
    cache_status: result.cache_status,
    scraped_at: result.scraped_at,
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: result.found
      ? {
          species: speciesParam,
          url: result.url,
          sections: result.sections,
          full_text: result.full_text,
        }
      : null,
  });
});

export default router;
