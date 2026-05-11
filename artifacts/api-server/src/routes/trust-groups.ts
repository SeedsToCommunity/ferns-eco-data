import { Router, type IRouter } from "express";
import { db, trustGroupsTable, trustTiersTable, trustTierMembersTable, fernsSourcesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { resolveUrl } from "../lib/resolve-url.js";
import { ensureDefaultTrustGroup } from "../services/trust/seed.js";

const router: IRouter = Router();

// Ensure the default group exists exactly once per process. Trust-group endpoints
// are independent of the registry route, so seeding may not have happened yet.
let defaultGroupSeeded = false;
async function ensureSeeded(): Promise<void> {
  if (defaultGroupSeeded) return;
  await ensureDefaultTrustGroup();
  defaultGroupSeeded = true;
}

const GENERAL_SUMMARY_LIST =
  "FERNS Trust Groups — catalog of all named trust perspectives registered in this FERNS instance. " +
  "Each group defines an ordered set of source tiers for context-specific queries.";

const TECHNICAL_DETAILS_LIST =
  "FERNS Trust Layer. Source: internal trust_groups table. " +
  "Trust groups are written at service startup (default group) or via the management UI (user groups). " +
  "This endpoint reads group metadata only — tier and source membership are available on the /{slug} and /{slug}/sources endpoints. " +
  "Method: system (internal DB read, no upstream HTTP call).";

const GENERAL_SUMMARY_DETAIL =
  "FERNS Trust Group detail — metadata and ordered tier list for a single trust perspective.";

const TECHNICAL_DETAILS_DETAIL =
  "FERNS Trust Layer. Source: internal trust_groups and trust_tiers tables joined on group_id. " +
  "Tier source membership counts are not included here — use /{slug}/sources for the full source roster. " +
  "Method: system (internal DB read, no upstream HTTP call).";

const GENERAL_SUMMARY_SOURCES =
  "FERNS Trust Group sources — all sources belonging to a trust group, organized by tier position. " +
  "Each source object is identical in shape to entries from GET /api/v1/sources.";

const TECHNICAL_DETAILS_SOURCES =
  "FERNS Trust Layer. Source: trust_groups → trust_tiers → trust_tier_members → ferns_sources (four-table join). " +
  "Sources are grouped by tier position (ascending). Within each tier, sources appear in registration order. " +
  "Source objects carry the same field set as GET /api/v1/sources, with metadata_url and explorer_url resolved to absolute URLs. " +
  "Method: system (internal DB read, no upstream HTTP call).";

function mapSourceRow(
  req: Parameters<typeof resolveUrl>[0],
  r: typeof fernsSourcesTable.$inferSelect
) {
  return {
    source_id: r.source_id,
    name: r.name,
    knowledge_type: r.knowledge_type,
    status: r.status,
    description: r.description ?? "",
    input_summary: r.input_summary ?? "",
    output_summary: r.output_summary ?? "",
    dependencies: r.dependencies ?? [],
    update_frequency: r.update_frequency ?? "",
    known_limitations: r.known_limitations ?? "",
    metadata_url: resolveUrl(req, r.metadata_url ?? ""),
    explorer_url: resolveUrl(req, r.explorer_url ?? ""),
    permission_granted: r.permission_granted ?? null,
    permission_status: r.permission_status ?? "",
    general_summary: r.general_summary ?? "",
    technical_details: r.technical_details ?? "",
  };
}

// GET /api/v1/trust-groups
// Returns all trust groups with metadata (no tier or source details).
router.get("/v1/trust-groups", async (req, res) => {
  await ensureSeeded();

  const rows = await db
    .select()
    .from(trustGroupsTable)
    .orderBy(asc(trustGroupsTable.created_at));

  const groups = rows.map((g) => ({
    group_id: g.group_id,
    slug: g.slug,
    name: g.name,
    owner_email: g.owner_email ?? null,
    geographic_region: g.geographic_region ?? null,
    domain: g.domain ?? null,
    description: g.description ?? null,
    created_at: g.created_at,
    updated_at: g.updated_at,
  }));

  res.json({
    source_url: resolveUrl(req, "/api/v1/trust-groups"),
    found: true,
    data: { groups },
    provenance: {
      source_id: "ferns-trust-layer",
      fetched_at: new Date(),
      method: "system",
      upstream_url: "internal:trust_groups",
      general_summary: GENERAL_SUMMARY_LIST,
      technical_details: TECHNICAL_DETAILS_LIST,
    },
  });
});

// GET /api/v1/trust-groups/:slug
// Returns group metadata and its ordered tier list.
router.get("/v1/trust-groups/:slug", async (req, res) => {
  await ensureSeeded();

  const { slug } = req.params;

  const [group] = await db
    .select()
    .from(trustGroupsTable)
    .where(eq(trustGroupsTable.slug, slug))
    .limit(1);

  if (!group) {
    res.status(404).json({
      source_url: resolveUrl(req, `/api/v1/trust-groups/${slug}`),
      found: false,
      data: null,
      message: `No trust group found with slug '${slug}'.`,
      provenance: {
        source_id: "ferns-trust-layer",
        fetched_at: new Date(),
        method: "system",
        upstream_url: "internal:trust_groups",
        general_summary: GENERAL_SUMMARY_DETAIL,
        technical_details: TECHNICAL_DETAILS_DETAIL,
      },
    });
    return;
  }

  const tiers = await db
    .select()
    .from(trustTiersTable)
    .where(eq(trustTiersTable.group_id, group.group_id))
    .orderBy(asc(trustTiersTable.position));

  res.json({
    source_url: resolveUrl(req, `/api/v1/trust-groups/${slug}`),
    found: true,
    data: {
      group: {
        group_id: group.group_id,
        slug: group.slug,
        name: group.name,
        owner_email: group.owner_email ?? null,
        geographic_region: group.geographic_region ?? null,
        domain: group.domain ?? null,
        description: group.description ?? null,
        created_at: group.created_at,
        updated_at: group.updated_at,
      },
      tiers: tiers.map((t) => ({
        tier_id: t.tier_id,
        position: t.position,
        name: t.name,
        created_at: t.created_at,
      })),
    },
    provenance: {
      source_id: "ferns-trust-layer",
      fetched_at: new Date(),
      method: "system",
      upstream_url: "internal:trust_groups+trust_tiers",
      general_summary: GENERAL_SUMMARY_DETAIL,
      technical_details: TECHNICAL_DETAILS_DETAIL,
    },
  });
});

// GET /api/v1/trust-groups/:slug/sources
// Returns all sources in the group, organized by tier position.
// Each source object is identical in shape to GET /api/v1/sources entries.
router.get("/v1/trust-groups/:slug/sources", async (req, res) => {
  await ensureSeeded();

  const { slug } = req.params;

  const [group] = await db
    .select()
    .from(trustGroupsTable)
    .where(eq(trustGroupsTable.slug, slug))
    .limit(1);

  if (!group) {
    res.status(404).json({
      source_url: resolveUrl(req, `/api/v1/trust-groups/${slug}/sources`),
      found: false,
      data: null,
      message: `No trust group found with slug '${slug}'.`,
      provenance: {
        source_id: "ferns-trust-layer",
        fetched_at: new Date(),
        method: "system",
        upstream_url: "internal:trust_groups",
        general_summary: GENERAL_SUMMARY_SOURCES,
        technical_details: TECHNICAL_DETAILS_SOURCES,
      },
    });
    return;
  }

  // Fetch tiers ordered by position.
  const tiers = await db
    .select()
    .from(trustTiersTable)
    .where(eq(trustTiersTable.group_id, group.group_id))
    .orderBy(asc(trustTiersTable.position));

  // Fetch all members with their source rows via a join.
  // Order by tier position first, then by source registration id so intra-tier
  // ordering is deterministic (matches registration order in ferns_sources).
  const memberRows = await db
    .select({
      tier_id: trustTierMembersTable.tier_id,
      source: fernsSourcesTable,
    })
    .from(trustTierMembersTable)
    .innerJoin(fernsSourcesTable, eq(trustTierMembersTable.source_id, fernsSourcesTable.source_id))
    .innerJoin(trustTiersTable, eq(trustTierMembersTable.tier_id, trustTiersTable.tier_id))
    .where(eq(trustTiersTable.group_id, group.group_id))
    .orderBy(asc(trustTiersTable.position), asc(fernsSourcesTable.id));

  // Group member rows by tier_id for fast lookup.
  const sourcesByTierId = new Map<string, ReturnType<typeof mapSourceRow>[]>();
  for (const row of memberRows) {
    const mapped = mapSourceRow(req, row.source);
    const bucket = sourcesByTierId.get(row.tier_id);
    if (bucket) {
      bucket.push(mapped);
    } else {
      sourcesByTierId.set(row.tier_id, [mapped]);
    }
  }

  const tiersWithSources = tiers.map((t) => ({
    tier_id: t.tier_id,
    position: t.position,
    name: t.name,
    sources: sourcesByTierId.get(t.tier_id) ?? [],
  }));

  res.json({
    source_url: resolveUrl(req, `/api/v1/trust-groups/${slug}/sources`),
    found: true,
    data: {
      group: {
        group_id: group.group_id,
        slug: group.slug,
        name: group.name,
      },
      tiers: tiersWithSources,
    },
    provenance: {
      source_id: "ferns-trust-layer",
      fetched_at: new Date(),
      method: "system",
      upstream_url: "internal:trust_groups+trust_tiers+trust_tier_members+ferns_sources",
      general_summary: GENERAL_SUMMARY_SOURCES,
      technical_details: TECHNICAL_DETAILS_SOURCES,
    },
  });
});

export default router;
