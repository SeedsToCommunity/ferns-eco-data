import { Router, type IRouter } from "express";
import { db, trustGroupsTable, trustTiersTable, trustTierMembersTable, fernsSourcesTable } from "@workspace/db";
import { eq, asc, and, max } from "drizzle-orm";
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

// ─── Write endpoints ──────────────────────────────────────────────────────────
// The `default` group rejects all write operations with 403.

const PROTECTED_SLUG = "default";

function rejectDefault(
  slug: string,
  res: Parameters<Parameters<typeof router.post>[1]>[1]
): boolean {
  if (slug === PROTECTED_SLUG) {
    res.status(403).json({ error: "The system default trust group cannot be modified." });
    return true;
  }
  return false;
}

async function requireGroup(slug: string): Promise<typeof trustGroupsTable.$inferSelect | null> {
  const [group] = await db
    .select()
    .from(trustGroupsTable)
    .where(eq(trustGroupsTable.slug, slug))
    .limit(1);
  return group ?? null;
}

async function requireTier(
  tierId: string,
  groupId: string
): Promise<typeof trustTiersTable.$inferSelect | null> {
  const [tier] = await db
    .select()
    .from(trustTiersTable)
    .where(and(eq(trustTiersTable.tier_id, tierId), eq(trustTiersTable.group_id, groupId)))
    .limit(1);
  return tier ?? null;
}

// POST /api/v1/trust-groups
// Create a new trust group.
router.post("/v1/trust-groups", async (req, res) => {
  const { slug, name, owner_email, geographic_region, domain, description } = req.body ?? {};

  if (!slug || typeof slug !== "string" || !name || typeof name !== "string") {
    res.status(400).json({ error: "slug and name are required strings" });
    return;
  }
  if (slug === PROTECTED_SLUG) {
    res.status(400).json({ error: "The slug 'default' is reserved for the system group" });
    return;
  }

  try {
    const [group] = await db
      .insert(trustGroupsTable)
      .values({
        slug: slug.trim(),
        name: name.trim(),
        owner_email: owner_email ?? null,
        geographic_region: geographic_region ?? null,
        domain: domain ?? null,
        description: description ?? null,
      })
      .returning();
    res.status(201).json({ found: true, data: { group } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate") || msg.includes("already exists")) {
      res.status(409).json({ error: `A trust group with slug '${slug}' already exists` });
      return;
    }
    throw err;
  }
});

// PUT /api/v1/trust-groups/:slug
// Update trust group metadata.
router.put("/v1/trust-groups/:slug", async (req, res) => {
  const { slug } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const { name, owner_email, geographic_region, domain, description } = req.body ?? {};
  const updates: Record<string, unknown> = { updated_at: new Date() };
  if (name !== undefined) updates["name"] = String(name);
  if (owner_email !== undefined) updates["owner_email"] = owner_email || null;
  if (geographic_region !== undefined) updates["geographic_region"] = geographic_region || null;
  if (domain !== undefined) updates["domain"] = domain || null;
  if (description !== undefined) updates["description"] = description || null;

  const [updated] = await db
    .update(trustGroupsTable)
    .set(updates)
    .where(eq(trustGroupsTable.slug, slug))
    .returning();

  res.json({ found: true, data: { group: updated } });
});

// DELETE /api/v1/trust-groups/:slug
// Delete a trust group (cascades to tiers and members).
router.delete("/v1/trust-groups/:slug", async (req, res) => {
  const { slug } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  await db.delete(trustGroupsTable).where(eq(trustGroupsTable.slug, slug));
  res.json({ found: true, data: { deleted: true } });
});

// POST /api/v1/trust-groups/:slug/tiers
// Add a new tier to a group. Position is auto-assigned as max + 1.
router.post("/v1/trust-groups/:slug/tiers", async (req, res) => {
  const { slug } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const { name } = req.body ?? {};
  if (!name || typeof name !== "string") {
    res.status(400).json({ error: "name is required" });
    return;
  }

  const [maxRow] = await db
    .select({ maxPos: max(trustTiersTable.position) })
    .from(trustTiersTable)
    .where(eq(trustTiersTable.group_id, group.group_id));

  const nextPosition = (maxRow?.maxPos ?? 0) + 1;

  const [tier] = await db
    .insert(trustTiersTable)
    .values({ group_id: group.group_id, name: name.trim(), position: nextPosition })
    .returning();

  res.status(201).json({ found: true, data: { tier } });
});

// PUT /api/v1/trust-groups/:slug/tiers/:tierId
// Rename and/or reorder a tier. Reorder swaps positions with the tier currently
// at the requested position to maintain the unique (group_id, position) constraint.
router.put("/v1/trust-groups/:slug/tiers/:tierId", async (req, res) => {
  const { slug, tierId } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const tier = await requireTier(tierId, group.group_id);
  if (!tier) { res.status(404).json({ error: `No tier '${tierId}' in group '${slug}'` }); return; }

  const { name, position } = req.body ?? {};

  if (position === undefined) {
    const [updated] = await db
      .update(trustTiersTable)
      .set({ name: name !== undefined ? String(name).trim() : tier.name })
      .where(eq(trustTiersTable.tier_id, tierId))
      .returning();
    res.json({ found: true, data: { tier: updated } });
    return;
  }

  const newPosition = Number(position);
  if (!Number.isInteger(newPosition) || newPosition < 1) {
    res.status(400).json({ error: "position must be a positive integer" });
    return;
  }

  if (newPosition === tier.position) {
    const tierWithName = name !== undefined
      ? (await db.update(trustTiersTable).set({ name: String(name).trim() }).where(eq(trustTiersTable.tier_id, tierId)).returning())[0]
      : tier;
    res.json({ found: true, data: { tier: tierWithName } });
    return;
  }

  const [otherTier] = await db
    .select()
    .from(trustTiersTable)
    .where(and(eq(trustTiersTable.group_id, group.group_id), eq(trustTiersTable.position, newPosition)))
    .limit(1);

  // Swap positions via transaction using a temporary sentinel value to avoid
  // violating the UNIQUE(group_id, position) constraint mid-transaction.
  const TEMP = -9999;
  await db.transaction(async (tx) => {
    await tx.update(trustTiersTable).set({ position: TEMP }).where(eq(trustTiersTable.tier_id, tierId));
    if (otherTier) {
      await tx.update(trustTiersTable).set({ position: tier.position }).where(eq(trustTiersTable.tier_id, otherTier.tier_id));
    }
    const finalSet: Record<string, unknown> = { position: newPosition };
    if (name !== undefined) finalSet["name"] = String(name).trim();
    await tx.update(trustTiersTable).set(finalSet).where(eq(trustTiersTable.tier_id, tierId));
  });

  const [updated] = await db
    .select()
    .from(trustTiersTable)
    .where(eq(trustTiersTable.tier_id, tierId))
    .limit(1);

  res.json({ found: true, data: { tier: updated } });
});

// DELETE /api/v1/trust-groups/:slug/tiers/:tierId
// Delete a tier — only allowed if the tier has no source members.
router.delete("/v1/trust-groups/:slug/tiers/:tierId", async (req, res) => {
  const { slug, tierId } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const tier = await requireTier(tierId, group.group_id);
  if (!tier) { res.status(404).json({ error: `No tier '${tierId}' in group '${slug}'` }); return; }

  const [member] = await db
    .select()
    .from(trustTierMembersTable)
    .where(eq(trustTierMembersTable.tier_id, tierId))
    .limit(1);

  if (member) {
    res.status(409).json({ error: "Cannot delete a tier that contains sources. Remove all sources first." });
    return;
  }

  await db.delete(trustTiersTable).where(eq(trustTiersTable.tier_id, tierId));
  res.json({ found: true, data: { deleted: true } });
});

// POST /api/v1/trust-groups/:slug/tiers/:tierId/members
// Add a source to a tier.
router.post("/v1/trust-groups/:slug/tiers/:tierId/members", async (req, res) => {
  const { slug, tierId } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const tier = await requireTier(tierId, group.group_id);
  if (!tier) { res.status(404).json({ error: `No tier '${tierId}' in group '${slug}'` }); return; }

  const { source_id } = req.body ?? {};
  if (!source_id || typeof source_id !== "string") {
    res.status(400).json({ error: "source_id is required" });
    return;
  }

  const [source] = await db
    .select()
    .from(fernsSourcesTable)
    .where(eq(fernsSourcesTable.source_id, source_id))
    .limit(1);

  if (!source) {
    res.status(404).json({ error: `No registered source with id '${source_id}'` });
    return;
  }

  // A source may only belong to one tier per group. Reject if it already
  // appears in any tier of this group (including the current one).
  const [alreadyInGroup] = await db
    .select({ tier_id: trustTierMembersTable.tier_id })
    .from(trustTierMembersTable)
    .innerJoin(trustTiersTable, eq(trustTierMembersTable.tier_id, trustTiersTable.tier_id))
    .where(
      and(
        eq(trustTiersTable.group_id, group.group_id),
        eq(trustTierMembersTable.source_id, source_id),
      )
    )
    .limit(1);

  if (alreadyInGroup) {
    res.status(409).json({
      error: `Source '${source_id}' is already assigned to a tier in group '${slug}'. A source may only appear in one tier per group.`,
    });
    return;
  }

  await db
    .insert(trustTierMembersTable)
    .values({ tier_id: tierId, source_id })
    .onConflictDoNothing();

  res.status(201).json({ found: true, data: { added: true, tier_id: tierId, source_id } });
});

// DELETE /api/v1/trust-groups/:slug/tiers/:tierId/members/:sourceId
// Remove a source from a tier.
router.delete("/v1/trust-groups/:slug/tiers/:tierId/members/:sourceId", async (req, res) => {
  const { slug, tierId, sourceId } = req.params;
  if (rejectDefault(slug, res)) return;

  const group = await requireGroup(slug);
  if (!group) { res.status(404).json({ error: `No trust group with slug '${slug}'` }); return; }

  const tier = await requireTier(tierId, group.group_id);
  if (!tier) { res.status(404).json({ error: `No tier '${tierId}' in group '${slug}'` }); return; }

  await db
    .delete(trustTierMembersTable)
    .where(and(eq(trustTierMembersTable.tier_id, tierId), eq(trustTierMembersTable.source_id, sourceId)));

  res.json({ found: true, data: { removed: true } });
});

export default router;

