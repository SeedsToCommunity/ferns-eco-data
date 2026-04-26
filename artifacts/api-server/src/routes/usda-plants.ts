import { Router, type IRouter } from "express";
import {
  USDA_PLANTS_SOURCE_ID,
  USDA_PLANTS_REGISTRY_ENTRY,
  USDA_PLANTS_PERMISSION_GRANTED,
  USDA_PLANTS_PERMISSION_STATUS,
} from "../services/usda-plants/metadata.js";
import { ensureUsdaPlantsRegistryEntry } from "../services/usda-plants/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { lookupByName, fetchProfile, searchPlants, buildProvenance } from "../services/usda-plants/connector.js";
import {
  buildNameMatchCacheKey,
  buildProfileCacheKey,
  lookupNameMatch,
  storeNameMatch,
  lookupProfile,
  storeProfile,
} from "../services/usda-plants/cache.js";

const router: IRouter = Router();

function profileUrl(symbol: string): string {
  return `https://plants.sc.egov.usda.gov/?symbol=${encodeURIComponent(symbol)}`;
}

router.get("/usda-plants/metadata", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();
  res.json({
    service_id: USDA_PLANTS_SOURCE_ID,
    service_name: USDA_PLANTS_REGISTRY_ENTRY.name,
    permission_granted: USDA_PLANTS_PERMISSION_GRANTED,
    permission_status: USDA_PLANTS_PERMISSION_STATUS,
    access_method: "api_fetch",
    api_base: "https://plantsservices.sc.egov.usda.gov/api/",
    registry_entry: {
      ...USDA_PLANTS_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, USDA_PLANTS_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, USDA_PLANTS_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(resolveUrl(req, "/api/usda-plants/metadata")),
  });
});

router.get("/usda-plants", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const forceRefresh = req.query["refresh"] === "true";
  const nameCacheKey = buildNameMatchCacheKey(speciesParam);

  let nameMatch = forceRefresh ? null : await lookupNameMatch(nameCacheKey);
  let cacheStatus = nameMatch ? "hit" : "miss";

  if (!nameMatch) {
    const lookupResult = await lookupByName(speciesParam);
    nameMatch = await storeNameMatch(nameCacheKey, lookupResult);
    cacheStatus = "miss";
  }

  if (!nameMatch.found || !nameMatch.symbol) {
    res.json({
      found: false,
      queried_at: new Date(),
      source_url: resolveUrl(req, "/api/usda-plants"),
      provenance: buildProvenance(nameMatch.upstream_url),
      data: {
        species: speciesParam,
        cache_status: cacheStatus,
      },
    });
    return;
  }

  const symbol = nameMatch.symbol;
  const profileCacheKey = buildProfileCacheKey(symbol);

  let profileRow = forceRefresh ? null : await lookupProfile(profileCacheKey);
  let profileCacheStatus = profileRow ? "hit" : "miss";

  if (!profileRow) {
    const profileUpstreamUrl = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${encodeURIComponent(symbol)}`;
    const rawProfile = await fetchProfile(symbol);
    profileRow = await storeProfile(profileCacheKey, symbol, rawProfile, profileUpstreamUrl);
    profileCacheStatus = "miss";
  }

  const profile = profileRow.profile as Record<string, unknown>;

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/usda-plants"),
    provenance: buildProvenance(nameMatch.upstream_url),
    data: {
      species: speciesParam,
      symbol,
      canonical_name: nameMatch.canonical_name,
      common_name: nameMatch.common_name,
      rank: nameMatch.rank,
      usda_id: nameMatch.usda_id,
      profile_url: profileUrl(symbol),
      native_statuses: profile["NativeStatuses"] ?? null,
      wetland_data: profile["WetlandData"] ?? null,
      legal_statuses: profile["LegalStatuses"] ?? null,
      durations: profile["Durations"] ?? null,
      growth_habits: profile["GrowthHabits"] ?? null,
      group: profile["Group"] ?? null,
      ancestors: profile["Ancestors"] ?? null,
      synonyms: profile["Synonyms"] ?? null,
      fact_sheet_urls: profile["FactSheetUrls"] ?? [],
      plant_guide_urls: profile["PlantGuideUrls"] ?? [],
      other_common_names: profile["OtherCommonNames"] ?? null,
      profile_image_filename: profile["ProfileImageFilename"] ?? null,
      cache_status: `name:${cacheStatus};profile:${profileCacheStatus}`,
    },
  });
});

router.get("/usda-plants/profile", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();

  const symbolParam = typeof req.query["symbol"] === "string" ? req.query["symbol"].trim().toUpperCase() : null;
  if (!symbolParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "symbol query parameter is required (e.g. ?symbol=ASTU)",
    });
    return;
  }

  const forceRefresh = req.query["refresh"] === "true";
  const cacheKey = buildProfileCacheKey(symbolParam);

  let profileRow = forceRefresh ? null : await lookupProfile(cacheKey);
  let cacheStatus = profileRow ? "hit" : "miss";

  if (!profileRow) {
    const upstreamUrl = `https://plantsservices.sc.egov.usda.gov/api/PlantProfile?symbol=${encodeURIComponent(symbolParam)}`;
    const rawProfile = await fetchProfile(symbolParam);
    profileRow = await storeProfile(cacheKey, symbolParam, rawProfile, upstreamUrl);
    cacheStatus = "miss";
  }

  const profile = profileRow.profile as Record<string, unknown>;
  const hasData = profile && typeof profile["Id"] === "number";

  res.json({
    found: hasData,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/usda-plants/profile"),
    provenance: buildProvenance(profileRow.upstream_url),
    data: {
      symbol: symbolParam,
      profile_url: profileUrl(symbolParam),
      profile,
      cache_status: cacheStatus,
    },
  });
});

router.get("/usda-plants/search", async (req, res) => {
  await ensureUsdaPlantsRegistryEntry();

  const q = typeof req.query["q"] === "string" ? req.query["q"].trim() : null;
  if (!q) {
    res.status(400).json({
      error: "invalid_input",
      message: "q query parameter is required (e.g. ?q=Trillium)",
    });
    return;
  }

  const validFields = ["Scientific Name", "Common Name", "Symbol", "Family"];
  const fieldParam = typeof req.query["field"] === "string" ? req.query["field"] : "Scientific Name";
  const field = validFields.includes(fieldParam) ? fieldParam : "Scientific Name";

  const pageParam = typeof req.query["page"] === "string" ? parseInt(req.query["page"], 10) : 1;
  const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const searchResult = await searchPlants(q, field, page);

  res.json({
    found: searchResult.total > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/usda-plants/search"),
    provenance: buildProvenance(searchResult.upstream_url),
    data: {
      query: q,
      field,
      page,
      total: searchResult.total,
      results: searchResult.results,
    },
  });
});

export default router;
