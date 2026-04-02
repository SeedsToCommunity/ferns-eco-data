import { Router, type IRouter } from "express";
import { db, mnfiCommunitiesTable, mnfiCountyElementsTable } from "@workspace/db";
import { eq, ilike, and, sql } from "drizzle-orm";
import {
  MNFI_SOURCE_ID,
  MNFI_DERIVATION_SUMMARY,
  MNFI_DERIVATION_SCIENTIFIC,
  MNFI_REGISTRY_ENTRY,
} from "../services/mnfi/metadata.js";
import { ensureMnfiRegistryEntry, ensureMnfiCommunities } from "../services/mnfi/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: MNFI_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/mnfi"),
    derivation_summary: MNFI_DERIVATION_SUMMARY,
    derivation_scientific: MNFI_DERIVATION_SCIENTIFIC,
  };
}

async function ensureAll() {
  await Promise.all([ensureMnfiRegistryEntry(), ensureMnfiCommunities()]);
}

router.get("/mnfi/metadata", async (req, res) => {
  await ensureAll();

  const [communityCount, countyElementCount] = await Promise.all([
    db.$count(mnfiCommunitiesTable),
    db.$count(mnfiCountyElementsTable),
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

  res.json({
    service_id: MNFI_SOURCE_ID,
    service_name: MNFI_REGISTRY_ENTRY.name,
    community_count: Number(communityCount),
    county_element_count: Number(countyElementCount),
    counties_with_data: countyRows.map((r) => r.county),
    community_classes: classRows,
    registry_entry: {
      ...MNFI_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, MNFI_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, MNFI_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/mnfi/metadata"),
      method: "static_metadata",
    },
  });
});

router.get("/mnfi/communities", async (req, res) => {
  await ensureAll();

  const classFilter = typeof req.query["class"] === "string" ? req.query["class"] : null;
  const groupFilter = typeof req.query["group"] === "string" ? req.query["group"] : null;

  const conditions = [];
  if (classFilter) conditions.push(ilike(mnfiCommunitiesTable.community_class, `%${classFilter}%`));
  if (groupFilter) conditions.push(ilike(mnfiCommunitiesTable.community_group, `%${groupFilter}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const communities = await db
    .select()
    .from(mnfiCommunitiesTable)
    .where(where)
    .orderBy(mnfiCommunitiesTable.community_class, mnfiCommunitiesTable.name);

  res.json({
    found: communities.length > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/mnfi/communities"),
    provenance: buildProvenance(req),
    data: {
      community_count: communities.length,
      filters: { class: classFilter, group: groupFilter },
      communities,
    },
  });
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
    res.status(404).json({
      found: false,
      queried_at: new Date(),
      source_url: resolveUrl(req, `/api/mnfi/communities/${param}`),
      provenance: buildProvenance(req),
      data: null,
      error: `No community found with id/slug '${param}'`,
    });
    return;
  }

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, `/api/mnfi/communities/${param}`),
    provenance: buildProvenance(req),
    data: community,
  });
});

router.get("/mnfi/county-elements", async (req, res) => {
  await ensureAll();

  const county = typeof req.query["county"] === "string" ? req.query["county"].trim() : null;
  const elementType = typeof req.query["type"] === "string" ? req.query["type"].trim() : null;

  if (!county) {
    res.status(400).json({
      error: "invalid_input",
      message: "county query parameter is required (e.g. ?county=Washtenaw). All 83 Michigan county names accepted.",
    });
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

  res.json({
    found: elements.length > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/mnfi/county-elements"),
    provenance: {
      ...buildProvenance(req),
      upstream_url: "https://mnfi.anr.msu.edu/resources/county-element-data",
    },
    data: {
      county,
      element_type_filter: elementType,
      result_count: elements.length,
      data_loaded: totalImported > 0,
      note:
        totalImported === 0
          ? "County element data has not been imported yet. MNFI serves this only through a dynamic web UI " +
            "without a public bulk-download API. Contact MNFI via their Special Data Requests program for bulk county data."
          : null,
      elements,
    },
  });
});

router.post("/mnfi/import-communities", async (_req, res) => {
  try {
    await ensureMnfiRegistryEntry();
    const result = await ensureMnfiCommunities();
    res.json({
      success: true,
      queried_at: new Date(),
      data: { message: "MNFI community classification imported successfully", ...result },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "import_failed", message: String(err) });
  }
});

export default router;
