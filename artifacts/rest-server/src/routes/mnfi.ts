import { Router, type IRouter, type Request, type Response } from "express";
import {
  getMnfiCommunityList,
  getMnfiCommunity,
  getMnfiCountyList,
  getMnfiCounty,
  MNFI_SCRAPED_AT,
  MICHIGAN_COUNTIES,
  type CommunityFilter,
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

function groupPlantsByLifeForm(
  plants: Array<{ lifeForm: string; commonName: string; scientificNames: string[] }>,
) {
  const byLifeForm: Record<string, Array<{ common_name: string; scientific_names: string[] }>> = {};
  for (const p of plants) {
    if (!byLifeForm[p.lifeForm]) byLifeForm[p.lifeForm] = [];
    byLifeForm[p.lifeForm].push({ common_name: p.commonName, scientific_names: p.scientificNames });
  }
  return byLifeForm;
}

function resolveCommunityParam(param: string) {
  const numericId = parseInt(param, 10);
  const isNumeric = !isNaN(numericId) && String(numericId) === param;
  if (isNumeric) {
    const stub = getMnfiCommunityList().find((c) => c.communityId === numericId);
    if (!stub) return null;
    return getMnfiCommunity(stub.slug);
  }
  return getMnfiCommunity(param);
}

async function notFoundEnvelope() {
  return buildEnvelope(
    {
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: false,
      data: null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: "https://mnfi.anr.msu.edu/communities/list",
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
}

router.get("/mnfi/metadata", async (req, res) => {
  await ensureMnfiRegistryEntry();
  const queriedAt = new Date().toISOString();

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
        sourceKind: "single-source-proxy",
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
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: "https://mnfi.anr.msu.edu/communities/classification",
        queriedAt,
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/communities", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const classFilter = typeof req.query["class"] === "string" ? req.query["class"] : undefined;
  const groupFilter = typeof req.query["group"] === "string" ? req.query["group"] : undefined;
  const nameFilter = typeof req.query["name"] === "string" ? req.query["name"] : undefined;

  const filter: CommunityFilter = {};
  if (classFilter) filter.communityClass = classFilter;
  if (groupFilter) filter.group = groupFilter;
  if (nameFilter) filter.nameText = nameFilter;

  const communities = getMnfiCommunityList(filter);

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: communities.length > 0,
        data: {
          community_count: communities.length,
          filters: { class: classFilter ?? null, group: groupFilter ?? null, name: nameFilter ?? null },
          communities,
        },
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: "https://mnfi.anr.msu.edu/communities/list",
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/communities/:id", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const param = req.params["id"] ?? "";
  const community = resolveCommunityParam(param);

  if (!community) {
    res.status(404).json(await notFoundEnvelope());
    return;
  }

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: true,
        data: {
          ...community,
          characteristic_plants: {
            total_entries: community.characteristicPlants.length,
            plant_list_url: `https://mnfi.anr.msu.edu/communities/plant-list/${community.communityId}/${community.slug}`,
            by_life_form: groupPlantsByLifeForm(community.characteristicPlants),
          },
        },
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: `https://mnfi.anr.msu.edu/communities/${community.communityId}/${community.slug}`,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/communities/:id/plants", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const param = req.params["id"] ?? "";
  const community = resolveCommunityParam(param);

  if (!community) {
    res.status(404).json(await notFoundEnvelope());
    return;
  }

  const plants = community.characteristicPlants;

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: plants.length > 0,
        data: {
          community_id: community.communityId,
          community_name: community.name,
          slug: community.slug,
          plant_list_url: `https://mnfi.anr.msu.edu/communities/plant-list/${community.communityId}/${community.slug}`,
          total_entries: plants.length,
          by_life_form: groupPlantsByLifeForm(plants),
        },
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: `https://mnfi.anr.msu.edu/communities/plant-list/${community.communityId}/${community.slug}`,
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

router.get("/mnfi/county-elements", async (req, res) => {
  await ensureMnfiRegistryEntry();

  const countyParam = typeof req.query["county"] === "string" ? req.query["county"].trim() : null;
  const elementType = typeof req.query["type"] === "string" ? req.query["type"].trim() : null;

  if (!countyParam) {
    res.status(400).json(
      await buildEnvelope(
        {
          sourceId: MNFI_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: false,
          data: {
            error: "invalid_input",
            message:
              "county query parameter is required (e.g. ?county=Washtenaw). All 83 Michigan county names accepted.",
          },
          method: "computed",
          cacheStatus: "bypass",
          sourceUrl: null,
          queriedAt: new Date().toISOString(),
        },
        { registry: dbRegistryAccessor },
      ),
    );
    return;
  }

  const canonicalCounty = MICHIGAN_COUNTIES.find(
    (c) => c.toLowerCase() === countyParam.toLowerCase(),
  );

  if (!canonicalCounty) {
    res.status(404).json(
      await buildEnvelope(
        {
          sourceId: MNFI_SOURCE_ID,
          sourceKind: "single-source-proxy",
          found: false,
          data: {
            error: "not_found",
            message: `County "${countyParam}" not found. Must be one of the 83 Michigan county names.`,
            valid_counties: getMnfiCountyList(),
          },
          method: "computed",
          cacheStatus: "bypass",
          sourceUrl: null,
          queriedAt: new Date().toISOString(),
        },
        { registry: dbRegistryAccessor },
      ),
    );
    return;
  }

  const occurrences = getMnfiCounty(canonicalCounty);
  const isSpeciesFilter = elementType === "animal" || elementType === "plant";
  const speciesResults = elementType === "community" ? [] : occurrences.species;
  const communityResults = isSpeciesFilter ? [] : occurrences.communities;
  const totalElements = speciesResults.length + communityResults.length;

  res.json(
    await buildEnvelope(
      {
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "single-source-proxy",
        found: totalElements > 0,
        data: {
          county: canonicalCounty,
          element_type_filter: elementType ?? null,
          species_count: speciesResults.length,
          community_count: communityResults.length,
          result_count: totalElements,
          species: elementType === "community" ? undefined : speciesResults,
          communities: isSpeciesFilter ? undefined : communityResults,
        },
        method: "cache_hit",
        cacheStatus: "hit",
        sourceUrl: "https://mnfi.anr.msu.edu/resources/county-element-data",
        queriedAt: new Date().toISOString(),
      },
      { registry: dbRegistryAccessor },
    ),
  );
});

export default router;
