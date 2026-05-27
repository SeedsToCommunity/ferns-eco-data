import { Router, type IRouter } from "express";
import { db, botanicalWebRefsCacheTable } from "@workspace/db";
import { and, eq, gt } from "drizzle-orm";
import { buildEnvelope, type Method, type CacheStatus } from "@workspace/api-envelope";
import { fetchAndCacheSpeciesText } from "../services/botanical-refs/scraper.js";
import {
  GOBOTANY_SOURCE_ID,
  GOBOTANY_LICENSES,
  GOBOTANY_LICENSE_NOTES,
  GOBOTANY_REGISTRY_ENTRY,
} from "../services/gobotany/metadata.js";
import { ensureGobotanyRegistryEntry } from "../services/gobotany/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const router: IRouter = Router();

const GOBOTANY_BASE = "https://gobotany.nativeplanttrust.org";

function parseSpecies(input: string): { genus: string; species: string } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const genus = parts[0].toLowerCase();
  const species = parts[1].toLowerCase();
  if (!/^[a-z]+$/.test(genus) || !/^[a-z]+$/.test(species)) return null;
  return { genus, species };
}

function mapScrapeStatus(cs: "hit" | "miss" | "not_in_species_list"): [Method, CacheStatus] {
  if (cs === "hit") return ["cache_hit", "hit"];
  if (cs === "miss") return ["api_fetch", "miss"];
  return ["computed", "bypass"];
}

router.get("/gobotany/metadata", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        service_id: GOBOTANY_SOURCE_ID,
        service_name: GOBOTANY_REGISTRY_ENTRY.name,
        licenses: GOBOTANY_LICENSES,
        license_notes: GOBOTANY_LICENSE_NOTES,
        url_strategy: "direct_construction",
        url_pattern: `${GOBOTANY_BASE}/species/{genus}/{species}/`,
        validation: "http_get",
        registry_entry: {
          ...GOBOTANY_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.metadata_url),
          explorer_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.explorer_url),
        },
      },
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
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
  const cacheKey = speciesParam.trim().toLowerCase();
  const cacheThreshold = new Date(Date.now() - CACHE_TTL_MS);

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
    const envelope = await buildEnvelope(
      {
        sourceId: GOBOTANY_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: hit.found,
        data: hit.found
          ? { species: speciesParam, url: hit.url, validation_method: hit.validation_method }
          : null,
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: hit.url ?? null,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    );
    res.json(envelope);
    return;
  }

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

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found,
      data: found
        ? { species: speciesParam, url, validation_method: validationMethod, http_status: httpStatus }
        : null,
      method: "api_fetch",
      cacheStatus: "miss",
      sourceUrl: url,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
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

  const [method, cacheStatus] = mapScrapeStatus(result.cache_status);

  const envelope = await buildEnvelope(
    {
      sourceId: GOBOTANY_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: result.found,
      data: result.found
        ? {
            species: speciesParam,
            url: result.url,
            sections: result.sections,
            full_text: result.full_text,
            scraped_at: result.scraped_at instanceof Date
              ? result.scraped_at.toISOString()
              : String(result.scraped_at),
            ...(result.fetch_error ? { fetch_error: result.fetch_error } : {}),
          }
        : result.fetch_error
          ? { species: speciesParam, url: result.url, fetch_error: result.fetch_error }
          : null,
      method,
      cacheStatus,
      sourceUrl: result.url,
      queriedAt: new Date().toISOString(),
      permissionGranted: false,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
