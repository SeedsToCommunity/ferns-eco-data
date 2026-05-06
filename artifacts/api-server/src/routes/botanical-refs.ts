/**
 * /api/botanical-refs — cross-source bundle endpoint.
 * Fans out a species query to all configured botanical reference sources
 * and returns a unified response.
 */

import { Router, type IRouter } from "express";
import { db, botanicalSpeciesListsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { resolveUrl } from "../lib/resolve-url.js";

import { GOBOTANY_SOURCE_ID, GOBOTANY_REGISTRY_ENTRY } from "../services/gobotany/metadata.js";
import { GOOGLE_IMAGES_SOURCE_ID, GOOGLE_IMAGES_REGISTRY_ENTRY } from "../services/google-images/metadata.js";
import { MISSOURI_PLANTS_SOURCE_ID, MISSOURI_PLANTS_REGISTRY_ENTRY } from "../services/missouri-plants/metadata.js";
import { MINNESOTA_WILDFLOWERS_SOURCE_ID, MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY } from "../services/minnesota-wildflowers/metadata.js";
import { ILLINOIS_WILDFLOWERS_SOURCE_ID, ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY } from "../services/illinois-wildflowers/metadata.js";
import { PRAIRIE_MOON_SOURCE_ID, PRAIRIE_MOON_REGISTRY_ENTRY } from "../services/prairie-moon/metadata.js";

const router: IRouter = Router();

const BOTANICAL_REFS_SOURCE_ID = "botanical-refs";

const SITES = [
  { id: GOBOTANY_SOURCE_ID, name: GOBOTANY_REGISTRY_ENTRY.name, strategy: "direct_construction" },
  { id: GOOGLE_IMAGES_SOURCE_ID, name: GOOGLE_IMAGES_REGISTRY_ENTRY.name, strategy: "direct_construction" },
  { id: MISSOURI_PLANTS_SOURCE_ID, name: MISSOURI_PLANTS_REGISTRY_ENTRY.name, strategy: "species_list_scrape" },
  { id: MINNESOTA_WILDFLOWERS_SOURCE_ID, name: MINNESOTA_WILDFLOWERS_REGISTRY_ENTRY.name, strategy: "species_list_scrape" },
  { id: ILLINOIS_WILDFLOWERS_SOURCE_ID, name: ILLINOIS_WILDFLOWERS_REGISTRY_ENTRY.name, strategy: "species_list_scrape" },
  { id: PRAIRIE_MOON_SOURCE_ID, name: PRAIRIE_MOON_REGISTRY_ENTRY.name, strategy: "sitemap_scrape" },
];

function buildGobotanyUrl(genus: string, species: string): string {
  return `https://gobotany.nativeplanttrust.org/species/${genus.toLowerCase()}/${species.toLowerCase()}/`;
}

function buildGoogleImagesUrl(speciesName: string): string {
  return `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(speciesName)}`;
}

async function lookupScrapeSite(siteId: string, speciesName: string) {
  const rows = await db
    .select()
    .from(botanicalSpeciesListsTable)
    .where(
      and(
        eq(botanicalSpeciesListsTable.site_id, siteId),
        ilike(botanicalSpeciesListsTable.scientific_name, speciesName),
      ),
    )
    .limit(10);

  if (rows.length === 0) return { found: false, url: null, results: [] };

  if (siteId === ILLINOIS_WILDFLOWERS_SOURCE_ID) {
    return {
      found: true,
      url: rows[0].url,
      results: rows.map((r) => ({ url: r.url, section: r.section })),
    };
  }
  return { found: true, url: rows[0].url, results: [] };
}

router.get("/botanical-refs/sites", (req, res) => {
  res.json({
    source_id: BOTANICAL_REFS_SOURCE_ID,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/botanical-refs/sites"),
    data: {
      site_count: SITES.length,
      sites: SITES.map((s) => ({
        ...s,
        query_url: resolveUrl(req, `/api/${s.id}`),
        metadata_url: resolveUrl(req, `/api/${s.id}/metadata`),
      })),
    },
  });
});

router.get("/botanical-refs", async (req, res) => {
  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const parts = speciesParam.split(/\s+/);
  const genus = parts[0] ?? "";
  const species = parts[1] ?? "";

  const results: Record<string, unknown> = {};

  const lookups = await Promise.allSettled([
    // GoBotany — direct construction + HTTP validation
    (async () => {
      const url = buildGobotanyUrl(genus, species);
      let found = false;
      let httpStatus: number | null = null;
      try {
        const resp = await fetch(url, {
          method: "GET",
          headers: { "User-Agent": "FERNS/1.0" },
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
        });
        httpStatus = resp.status;
        found = resp.status === 200;
      } catch {}
      return { siteId: GOBOTANY_SOURCE_ID, found, url: found ? url : null, http_status: httpStatus, validation: "http_get" };
    })(),

    // Google Images — always found
    (async () => ({
      siteId: GOOGLE_IMAGES_SOURCE_ID,
      found: true,
      url: buildGoogleImagesUrl(speciesParam),
      validation: "direct_construction",
    }))(),

    // Missouri Plants — DB lookup
    lookupScrapeSite(MISSOURI_PLANTS_SOURCE_ID, speciesParam).then((r) => ({
      siteId: MISSOURI_PLANTS_SOURCE_ID,
      ...r,
      validation: "species_list_lookup",
    })),

    // Minnesota Wildflowers — DB lookup
    lookupScrapeSite(MINNESOTA_WILDFLOWERS_SOURCE_ID, speciesParam).then((r) => ({
      siteId: MINNESOTA_WILDFLOWERS_SOURCE_ID,
      ...r,
      validation: "species_list_lookup",
    })),

    // Illinois Wildflowers — DB lookup (may return multiple sections)
    lookupScrapeSite(ILLINOIS_WILDFLOWERS_SOURCE_ID, speciesParam).then((r) => ({
      siteId: ILLINOIS_WILDFLOWERS_SOURCE_ID,
      ...r,
      validation: "species_list_lookup",
    })),

    // Prairie Moon — DB lookup
    lookupScrapeSite(PRAIRIE_MOON_SOURCE_ID, speciesParam).then((r) => ({
      siteId: PRAIRIE_MOON_SOURCE_ID,
      ...r,
      validation: "species_list_lookup",
    })),
  ]);

  for (const outcome of lookups) {
    if (outcome.status === "fulfilled") {
      const { siteId, ...rest } = outcome.value as { siteId: string; [key: string]: unknown };
      results[siteId] = rest;
    }
  }

  const foundCount = Object.values(results).filter((r: unknown) => (r as { found: boolean }).found).length;

  res.json({
    found: foundCount > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/botanical-refs"),
    provenance: {
      source_id: BOTANICAL_REFS_SOURCE_ID,
      fetched_at: new Date(),
      method: "aggregation",
      sites_queried: SITES.length,
    },
    data: {
      species: speciesParam,
      sites_found: foundCount,
      sites_total: SITES.length,
      results,
    },
  });
});

export default router;
