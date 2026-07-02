import { Router, type IRouter } from "express";
import { GetBonapMapQueryParams } from "@workspace/api-zod";
import {
  getBonapNapaMapUrl,
  BonapNapaNetworkError,
} from "@workspace/external-data-providers/bonap-napa";
import { buildCacheKey, type MapType } from "../services/bonap/connector.js";
import { lookupCache, storeCache } from "../services/bonap/cache.js";
import {
  BONAP_ATTRIBUTION,
  BONAP_COLOR_KEY,
  BONAP_COLOR_KEY_IMAGE_URL,
  BONAP_COLOR_KEY_URL,
  BONAP_DATA_VINTAGE,
  BONAP_LICENSES,
  BONAP_LICENSE_NOTES,
  BONAP_REGISTRY_ENTRY,
  BONAP_SOURCE_ID,
} from "../services/bonap/metadata.js";
import { ensureBonapRegistryEntry } from "../services/bonap/seed.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";
import { resolveUrl } from "../lib/resolve-url.js";

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

  const { genus, species, map_type: mapType, refresh } = parsed.data;

  if (!species || species.trim() === "") {
    res.status(400).json({ error: "invalid_input", message: "species is required for all map types" });
    return;
  }

  if (/\s/.test(species.trim())) {
    res.status(400).json({
      error: "invalid_input",
      message:
        "species must be a single base epithet (e.g. rubrum). BONAP does not publish subspecies-level maps — do not include subspecies, variety, or other infraspecific qualifiers.",
    });
    return;
  }

  await ensureBonapRegistryEntry();

  const normalizedGenus = genus.trim().charAt(0).toUpperCase() + genus.trim().slice(1).toLowerCase();
  const normalizedSpecies = species.trim().toLowerCase();
  const resolvedMapType = (mapType ?? "county_species") as MapType;

  const cacheKey = buildCacheKey(normalizedGenus, normalizedSpecies, resolvedMapType);

  if (!refresh) {
    const cached = await lookupCache(cacheKey);
    if (cached) {
      const envelope = await buildEnvelope(
        {
          sourceId: BONAP_SOURCE_ID,
          sourceKind: "single-source-proxy",
          sourceUrl: cached.upstream_url,
          method: "cache_hit",
          cacheStatus: "hit",
          queriedAt: cached.fetched_at.toISOString(),
          found: cached.status === "found",
          data: {
            map_url: cached.status === "found" ? cached.map_url : null,
            map_type_served: cached.map_type as MapType,
            genus: normalizedGenus,
            species: normalizedSpecies,
          },
        },
        { registry: dbRegistryAccessor },
      );
      res.json(envelope);
      return;
    }
  }

  let result;
  try {
    result = await getBonapNapaMapUrl(normalizedGenus, normalizedSpecies, resolvedMapType);
  } catch (err: unknown) {
    if (err instanceof BonapNapaNetworkError) {
      res.status(503).json({ error: "upstream_unavailable", message: err.message });
      return;
    }
    throw err;
  }

  await storeCache(cacheKey, result, { genus: normalizedGenus, species: normalizedSpecies });

  const envelope = await buildEnvelope(
    {
      sourceId: BONAP_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: result.upstreamUrl,
      method: "api_fetch",
      cacheStatus: "miss",
      queriedAt: new Date().toISOString(),
      found: result.found,
      data: {
        map_url: result.found ? result.mapUrl : null,
        map_type_served: result.mapTypeServed,
        genus: normalizedGenus,
        species: normalizedSpecies,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/bonap/metadata", async (req, res) => {
  await ensureBonapRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: BONAP_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: "https://bonap.net/",
      method: "computed",
      cacheStatus: "bypass",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        service_id: BONAP_SOURCE_ID,
        service_name: BONAP_REGISTRY_ENTRY.name,
        data_vintage: BONAP_DATA_VINTAGE,
        licenses: BONAP_LICENSES,
        license_notes: BONAP_LICENSE_NOTES,
        attribution: BONAP_ATTRIBUTION,
        color_key: BONAP_COLOR_KEY,
        color_key_url: BONAP_COLOR_KEY_URL,
        color_key_image_url: BONAP_COLOR_KEY_IMAGE_URL,
        registry_entry: {
          ...BONAP_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, BONAP_REGISTRY_ENTRY.metadata_url),
        },
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
