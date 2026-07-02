import { Router, type IRouter } from "express";
import {
  getMnfiCommunityList,
  getMnfiCommunity,
  getMnfiSpeciesList,
  getMnfiSpecies,
  getMnfiSpeciesCommunities,
  getMnfiSpeciesCounties,
  getMnfiCountyList,
  getMnfiCounty,
  MNFI_SCRAPED_AT,
  type CommunityFilter,
  type SpeciesFilter,
  type CountyFilter,
} from "@workspace/internal-data-providers/mnfi";
import {
  MNFI_SOURCE_ID,
  MNFI_GENERAL_SUMMARY,
  MNFI_TECHNICAL_DETAILS,
  MNFI_REGISTRY_ENTRY,
  MNFI_LICENSES,
  MNFI_LICENSE_NOTES,
} from "../services/mnfi/metadata.js";
import { ensureMnfiRegistryEntry } from "../services/mnfi/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

const IN_MEMORY_PROVENANCE = {
  sourceKind: "in-memory" as const,
  method: "cache_hit" as const,
  cacheStatus: "hit" as const,
  sourceUrl: null,
  queriedAt: MNFI_SCRAPED_AT,
};

router.get("/mnfi/metadata", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const communities = getMnfiCommunityList();
  const counties = getMnfiCountyList();

  const classCounts: Record<string, number> = {};
  for (const c of communities) {
    classCounts[c.communityClass] = (classCounts[c.communityClass] ?? 0) + 1;
  }
  const community_classes = Object.entries(classCounts)
    .map(([community_class, count]) => ({ community_class, count }))
    .sort((a, b) => a.community_class.localeCompare(b.community_class));

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: true,
        data: {
          service_id: MNFI_SOURCE_ID,
          service_name: MNFI_REGISTRY_ENTRY.name,
          licenses: MNFI_LICENSES,
          license_notes: MNFI_LICENSE_NOTES,
          community_count: communities.length,
          county_count: counties.length,
          scraped_at: MNFI_SCRAPED_AT,
          community_classes,
          registry_entry: {
            ...MNFI_REGISTRY_ENTRY,
            metadata_url: resolveUrl(req, MNFI_REGISTRY_ENTRY.metadata_url),
          },
          general_summary: MNFI_GENERAL_SUMMARY,
          technical_details: MNFI_TECHNICAL_DETAILS,
        },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/communities", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const classFilter = typeof req.query["class"] === "string" ? req.query["class"] : undefined;
  const groupFilter = typeof req.query["group"] === "string" ? req.query["group"] : undefined;
  const rankFilter = typeof req.query["rank"] === "string" ? req.query["rank"] : undefined;
  const nameFilter = typeof req.query["name"] === "string" ? req.query["name"] : undefined;

  const filter: CommunityFilter = {};
  if (classFilter) filter.communityClass = classFilter;
  if (groupFilter) filter.group = groupFilter;
  if (rankFilter) filter.rank = rankFilter;
  if (nameFilter) filter.nameText = nameFilter;

  const communities = getMnfiCommunityList(filter);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: communities.length > 0,
        data: { communities },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/communities/:slug", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const slug = decodeURIComponent(req.params["slug"] ?? "");
  const community = getMnfiCommunity(slug);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: community !== null,
        data: community,
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/species", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const rawLimit = req.query["limit"];
  const rawOffset = req.query["offset"];

  if (rawLimit !== undefined && (typeof rawLimit !== "string" || isNaN(Number(rawLimit)))) {
    res.status(400).json({ error: "invalid_input", message: "limit must be a non-negative integer" });
    return;
  }
  if (rawOffset !== undefined && (typeof rawOffset !== "string" || isNaN(Number(rawOffset)))) {
    res.status(400).json({ error: "invalid_input", message: "offset must be a non-negative integer" });
    return;
  }

  const limit = rawLimit !== undefined ? Math.min(Number(rawLimit), 200) : 50;
  const offset = rawOffset !== undefined ? Number(rawOffset) : 0;

  if (!Number.isInteger(limit) || limit < 0) {
    res.status(400).json({ error: "invalid_input", message: "limit must be a non-negative integer" });
    return;
  }
  if (!Number.isInteger(offset) || offset < 0) {
    res.status(400).json({ error: "invalid_input", message: "offset must be a non-negative integer" });
    return;
  }

  const nameFilter = typeof req.query["name"] === "string" ? req.query["name"] : undefined;
  const kindParam = typeof req.query["kind"] === "string" ? req.query["kind"] : undefined;
  const statusFilter = typeof req.query["status"] === "string" ? req.query["status"] : undefined;
  const rankFilter = typeof req.query["rank"] === "string" ? req.query["rank"] : undefined;
  const categoryFilter = typeof req.query["category"] === "string" ? req.query["category"] : undefined;

  const filter: SpeciesFilter = { limit, offset };
  if (nameFilter) filter.nameText = nameFilter;
  if (kindParam === "plant" || kindParam === "animal") filter.kind = kindParam;
  if (statusFilter) filter.status = statusFilter;
  if (rankFilter) filter.rank = rankFilter;
  if (categoryFilter) filter.category = categoryFilter;

  const page = getMnfiSpeciesList(filter);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: page.items.length > 0,
        data: { species: page.items },
        pagination: {
          has_more: page.offset + page.limit < page.total,
          next: null,
          total: page.total,
        },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/species/:name", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const name = decodeURIComponent(req.params["name"] ?? "");
  const result = getMnfiSpecies(name);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: result !== null,
        data: result,
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/species/:name/communities", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const name = decodeURIComponent(req.params["name"] ?? "");
  const communities = getMnfiSpeciesCommunities(name);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: communities.length > 0,
        data: { communities },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/species/:name/counties", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const name = decodeURIComponent(req.params["name"] ?? "");
  const counties = getMnfiSpeciesCounties(name);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: counties.length > 0,
        data: { counties },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/counties", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const counties = getMnfiCountyList();

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: true,
        data: { counties },
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/counties/:county", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const county = req.params["county"] ?? "";

  if (!county.trim()) {
    res.status(400).json({ error: "invalid_input", message: "county path parameter must not be blank" });
    return;
  }

  const kindParam = typeof req.query["kind"] === "string" ? req.query["kind"] : undefined;
  const statusFilter = typeof req.query["status"] === "string" ? req.query["status"] : undefined;
  const categoryFilter = typeof req.query["category"] === "string" ? req.query["category"] : undefined;

  const filter: CountyFilter = {};
  if (kindParam === "plant" || kindParam === "animal") filter.kind = kindParam;
  if (statusFilter) filter.status = statusFilter;
  if (categoryFilter) filter.category = categoryFilter;

  const result = getMnfiCounty(county, filter);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        found: result.species.length > 0 || result.communities.length > 0,
        data: result,
        ...IN_MEMORY_PROVENANCE,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

export default router;
