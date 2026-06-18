import { Router, type IRouter, type Request, type Response } from "express";
import { db, mnfiCommunitiesTable, mnfiCountyElementsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  MNFI_SOURCE_ID,
  MNFI_GENERAL_SUMMARY,
  MNFI_TECHNICAL_DETAILS,
  MNFI_REGISTRY_ENTRY,
  MNFI_LICENSES,
  MNFI_LICENSE_NOTES,
} from "../services/mnfi/metadata.js";
import { ensureMnfiRegistryEntry, ensureMnfiCommunities } from "../services/mnfi/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { importAllDescriptions, importAllPlantLists } from "../services/mnfi/scraper.js";
import { importAllCountyElements } from "../services/mnfi/county-import.js";
import { mnfiCommunityPlantsTable } from "@workspace/db";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

async function checkAdmin(req: Request, res: Response): Promise<boolean> {
  const secret = process.env["ADMIN_SECRET"];
  const isProd = process.env["NODE_ENV"] === "production";
  if (!secret) {
    if (isProd) {
      res.status(503).json(await buildEnvelope({
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "in-memory",
        found: false,
        data: { error: "misconfigured", message: "ADMIN_SECRET must be set in production to use import endpoints." },
        method: "computed",
        cacheStatus: "bypass",
        sourceUrl: null,
        queriedAt: new Date().toISOString(),
      }, { registry: dbRegistryAccessor }));
      return false;
    }
    return true;
  }
  const auth = req.headers["authorization"] ?? "";
  if (auth === `Bearer ${secret}`) return true;
  res.status(401).json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "in-memory",
    found: false,
    data: { error: "unauthorized", message: "Valid Authorization: Bearer <ADMIN_SECRET> header required." },
    method: "computed",
    cacheStatus: "bypass",
    sourceUrl: null,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
  return false;
}

async function ensureAll() {
  await Promise.all([ensureMnfiRegistryEntry(), ensureMnfiCommunities()]);
}

function groupPlantsByLifeForm(plants: Array<{ life_form: string; common_name: string; scientific_names: unknown }>) {
  const byLifeForm: Record<string, Array<{ common_name: string; scientific_names: string[] }>> = {};
  for (const p of plants) {
    if (!byLifeForm[p.life_form]) byLifeForm[p.life_form] = [];
    byLifeForm[p.life_form].push({ common_name: p.common_name, scientific_names: p.scientific_names as string[] });
  }
  return byLifeForm;
}

router.get("/mnfi/metadata", async (req, res) => {
  await ensureAll();

  const queriedAt = new Date().toISOString();

  const [communityCount, countyElementCount, plantCount] = await Promise.all([
    db.$count(mnfiCommunitiesTable),
    db.$count(mnfiCountyElementsTable),
    db.$count(mnfiCommunityPlantsTable),
  ]);

  const classRows = await db
    .select({
      community_class: mnfiCommunitiesTable.community_class,
      count: sql<number>`count(*)::int`,
    })
    .from(mnfiCommunitiesTable)
    .groupBy(mnfiCommunitiesTable.community_class)
    .orderBy(mnfiCommunitiesTable.community_class);

  const countyRows = await db
    .select({ county: mnfiCountyElementsTable.county })
    .from(mnfiCountyElementsTable)
    .groupBy(mnfiCountyElementsTable.county)
    .orderBy(mnfiCountyElementsTable.county);

  const descriptionsFetched = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(mnfiCommunitiesTable)
    .where(sql`description_fetched_at is not null`);

  res.json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "single-source-proxy",
    found: true,
    data: {
      service_id: MNFI_SOURCE_ID,
      service_name: MNFI_REGISTRY_ENTRY.name,
      licenses: MNFI_LICENSES,
      license_notes: MNFI_LICENSE_NOTES,
      community_count: Number(communityCount),
      descriptions_fetched: Number(descriptionsFetched[0]?.count ?? 0),
      plant_record_count: Number(plantCount),
      county_element_count: Number(countyElementCount),
      counties_with_data: countyRows.map((r) => r.county),
      community_classes: classRows,
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
  }, { registry: dbRegistryAccessor }));
});

router.get("/mnfi/communities", async (req, res) => {
  await ensureAll();

  const classFilter = typeof req.query["class"] === "string" ? req.query["class"] : null;
  const groupFilter = typeof req.query["group"] === "string" ? req.query["group"] : null;
  const nameFilter = typeof req.query["name"] === "string" ? req.query["name"] : null;

  const conditions = [];
  if (classFilter) conditions.push(ilike(mnfiCommunitiesTable.community_class, `%${classFilter}%`));
  if (groupFilter) conditions.push(ilike(mnfiCommunitiesTable.community_group, `%${groupFilter}%`));
  if (nameFilter) conditions.push(ilike(mnfiCommunitiesTable.name, `%${nameFilter}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const communities = await db
    .select()
    .from(mnfiCommunitiesTable)
    .where(where)
    .orderBy(mnfiCommunitiesTable.community_class, mnfiCommunitiesTable.name);

  res.json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "single-source-proxy",
    found: communities.length > 0,
    data: {
      community_count: communities.length,
      filters: { class: classFilter, group: groupFilter, name: nameFilter },
      communities,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: "https://mnfi.anr.msu.edu/communities/list",
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/mnfi/communities/:id", async (req, res) => {
  await ensureAll();

  const param = req.params["id"] ?? "";
  const numericId = parseInt(param, 10);
  const isNumeric = !isNaN(numericId) && String(numericId) === param;

  const [community] = isNumeric
    ? await db
        .select()
        .from(mnfiCommunitiesTable)
        .where(eq(mnfiCommunitiesTable.community_id, numericId))
        .limit(1)
    : await db
        .select()
        .from(mnfiCommunitiesTable)
        .where(eq(mnfiCommunitiesTable.slug, param))
        .limit(1);

  if (!community) {
    res.status(404).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: false,
      data: null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: "https://mnfi.anr.msu.edu/communities/list",
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const plants = await db
    .select()
    .from(mnfiCommunityPlantsTable)
    .where(eq(mnfiCommunityPlantsTable.community_id, community.community_id))
    .orderBy(mnfiCommunityPlantsTable.sort_order);

  res.json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "single-source-proxy",
    found: true,
    data: {
      ...community,
      characteristic_plants: {
        total_entries: plants.length,
        plant_list_url: `https://mnfi.anr.msu.edu/communities/plant-list/${community.community_id}/${community.slug}`,
        by_life_form: groupPlantsByLifeForm(plants),
      },
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: `https://mnfi.anr.msu.edu/communities/${community.community_id}/${community.slug}`,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/mnfi/communities/:id/plants", async (req, res) => {
  await ensureAll();

  const param = req.params["id"] ?? "";
  const numericId = parseInt(param, 10);
  const isNumeric = !isNaN(numericId) && String(numericId) === param;

  const [community] = isNumeric
    ? await db.select().from(mnfiCommunitiesTable).where(eq(mnfiCommunitiesTable.community_id, numericId)).limit(1)
    : await db.select().from(mnfiCommunitiesTable).where(eq(mnfiCommunitiesTable.slug, param)).limit(1);

  if (!community) {
    res.status(404).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: false,
      data: null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: "https://mnfi.anr.msu.edu/communities/list",
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const plants = await db
    .select()
    .from(mnfiCommunityPlantsTable)
    .where(eq(mnfiCommunityPlantsTable.community_id, community.community_id))
    .orderBy(mnfiCommunityPlantsTable.sort_order);

  res.json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "single-source-proxy",
    found: plants.length > 0,
    data: {
      community_id: community.community_id,
      community_name: community.name,
      slug: community.slug,
      plant_list_url: `https://mnfi.anr.msu.edu/communities/plant-list/${community.community_id}/${community.slug}`,
      total_entries: plants.length,
      plants_imported: plants.length > 0,
      by_life_form: groupPlantsByLifeForm(plants),
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: `https://mnfi.anr.msu.edu/communities/plant-list/${community.community_id}/${community.slug}`,
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.get("/mnfi/county-elements", async (req, res) => {
  await ensureAll();

  const county = typeof req.query["county"] === "string" ? req.query["county"].trim() : null;
  const elementType = typeof req.query["type"] === "string" ? req.query["type"].trim() : null;

  if (!county) {
    res.status(400).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "single-source-proxy",
      found: false,
      data: { error: "invalid_input", message: "county query parameter is required (e.g. ?county=Washtenaw). All 83 Michigan county names accepted." },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
    return;
  }

  const conditions = [ilike(mnfiCountyElementsTable.county, county)];
  if (elementType === "species" || elementType === "community") {
    conditions.push(eq(mnfiCountyElementsTable.element_type, elementType));
  }

  const elements = await db
    .select()
    .from(mnfiCountyElementsTable)
    .where(and(...conditions))
    .orderBy(mnfiCountyElementsTable.element_type, mnfiCountyElementsTable.element_name);

  const totalImported = await db.$count(mnfiCountyElementsTable);

  res.json(await buildEnvelope({
    sourceId: MNFI_SOURCE_ID,
    sourceKind: "single-source-proxy",
    found: elements.length > 0,
    data: {
      county,
      element_type_filter: elementType,
      result_count: elements.length,
      total_imported_across_all_counties: totalImported,
      elements,
    },
    method: "cache_hit",
    cacheStatus: "hit",
    sourceUrl: "https://mnfi.anr.msu.edu/resources/county-element-data",
    queriedAt: new Date().toISOString(),
  }, { registry: dbRegistryAccessor }));
});

router.post("/mnfi/import-communities", async (req, res) => {
  if (!await checkAdmin(req, res)) return;
  try {
    await ensureMnfiRegistryEntry();
    const result = await ensureMnfiCommunities();
    res.json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: { message: "MNFI community classification imported successfully", ...result },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    res.status(500).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "import_failed", message: String(err) },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  }
});

router.post("/mnfi/import-descriptions", async (req, res) => {
  if (!await checkAdmin(req, res)) return;
  try {
    await ensureAll();
    const { descriptions, result } = await importAllDescriptions((done, total, name) => {
      process.stdout.write(`[MNFI descriptions] ${done}/${total}: ${name}\n`);
    });

    for (const d of descriptions) {
      await db
        .update(mnfiCommunitiesTable)
        .set({
          overview: d.overview ?? undefined,
          landscape_context: d.landscape_context ?? undefined,
          soils_description: d.soils_description ?? undefined,
          natural_processes: d.natural_processes ?? undefined,
          vegetation: d.vegetation ?? undefined,
          management_notes: d.management_notes ?? undefined,
          similar_communities: d.similar_communities ?? undefined,
          description_fetched_at: new Date(),
        })
        .where(eq(mnfiCommunitiesTable.community_id, d.community_id));
    }

    res.json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        message: `Scraped and imported ${result.succeeded}/${result.total} community descriptions`,
        ...result,
      },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    res.status(500).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "import_failed", message: String(err) },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  }
});

router.post("/mnfi/import-plant-lists", async (req, res) => {
  if (!await checkAdmin(req, res)) return;
  try {
    await ensureAll();
    const { allPlants, result } = await importAllPlantLists((done, total, name) => {
      process.stdout.write(`[MNFI plant lists] ${done}/${total}: ${name}\n`);
    });

    await db.delete(mnfiCommunityPlantsTable);
    if (allPlants.length > 0) {
      const BATCH = 200;
      for (let i = 0; i < allPlants.length; i += BATCH) {
        await db.insert(mnfiCommunityPlantsTable).values(allPlants.slice(i, i + BATCH));
      }
    }

    res.json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        message: `Scraped ${result.communities_succeeded}/${result.total} communities; imported ${result.plants_inserted} plant entries`,
        ...result,
      },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    res.status(500).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "import_failed", message: String(err) },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  }
});

router.post("/mnfi/import-county-elements", async (req, res) => {
  if (!await checkAdmin(req, res)) return;
  try {
    await ensureAll();

    const { records, result } = await importAllCountyElements((done, total, county, sp, comm) => {
      process.stdout.write(
        `[MNFI county] ${done}/${total}: ${county} — ${sp} species, ${comm} communities\n`,
      );
    });

    if (records.length === 0) {
      res.json(await buildEnvelope({
        sourceId: MNFI_SOURCE_ID,
        sourceKind: "in-memory",
        found: false,
        data: { ...result, message: "No records to import." },
        method: "computed",
        cacheStatus: "bypass",
        sourceUrl: null,
        queriedAt: new Date().toISOString(),
      }, { registry: dbRegistryAccessor }));
      return;
    }

    await db.delete(mnfiCountyElementsTable);

    const BATCH = 500;
    for (let i = 0; i < records.length; i += BATCH) {
      const batch = records.slice(i, i + BATCH).map((r) => ({
        county: r.county,
        element_id: r.element_id,
        element_name: r.element_name,
        element_type: r.element_type,
        scientific_name: r.scientific_name,
        common_name: r.common_name,
        federal_status: r.federal_status,
        state_status: r.state_status,
        global_rank: r.global_rank,
        state_rank: r.state_rank,
        g_rank_description: r.g_rank_description,
        s_rank_description: r.s_rank_description,
        species_category: r.species_category,
        occurrences_in_county: r.occurrences_in_county,
        last_observed: r.last_observed,
      }));
      await db.insert(mnfiCountyElementsTable).values(batch);
    }

    res.json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        message: `Imported county element data for ${result.succeeded_counties}/${result.total_counties} counties`,
        total_records_imported: records.length,
        ...result,
      },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  } catch (err) {
    res.status(500).json(await buildEnvelope({
      sourceId: MNFI_SOURCE_ID,
      sourceKind: "in-memory",
      found: false,
      data: { error: "import_failed", message: String(err) },
      method: "computed",
      cacheStatus: "bypass",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    }, { registry: dbRegistryAccessor }));
  }
});

export default router;
