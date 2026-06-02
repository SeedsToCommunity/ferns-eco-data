import { Router, type IRouter } from "express";
import { db, npnSpeciesTable, npnNameAliasesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  ANN_ARBOR_NPN_SOURCE_ID,
  ANN_ARBOR_NPN_REGISTRY_ENTRY,
  ANN_ARBOR_NPN_LICENSES,
  ANN_ARBOR_NPN_LICENSE_NOTES,
} from "../services/ann-arbor-npn/metadata.js";
import { ensureAnnArborNpnRegistryEntry } from "../services/ann-arbor-npn/seed.js";
import { importNpn } from "../services/ann-arbor-npn/import.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

// ── GET /api/ann-arbor-npn/metadata ──────────────────────────────────────────

router.get("/ann-arbor-npn/metadata", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(npnSpeciesTable);
  const speciesCount = Number(row?.count ?? 0);

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: "https://www.nativeplant.com/",
      method: "computed",
      cacheStatus: "bypass",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        service_id: ANN_ARBOR_NPN_SOURCE_ID,
        service_name: ANN_ARBOR_NPN_REGISTRY_ENTRY.name,
        licenses: ANN_ARBOR_NPN_LICENSES,
        license_notes: ANN_ARBOR_NPN_LICENSE_NOTES,
        species_count: speciesCount,
        registry_entry: {
          ...ANN_ARBOR_NPN_REGISTRY_ENTRY,
          metadata_url: resolveUrl(req, ANN_ARBOR_NPN_REGISTRY_ENTRY.metadata_url),
        },
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/species ────────────────────────────────────────────
// Returns the full list of all NPN species (bulk).

router.get("/ann-arbor-npn/species", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const rows = await db
    .select()
    .from(npnSpeciesTable)
    .orderBy(npnSpeciesTable.latin_name);

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: "https://www.nativeplant.com/",
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: rows.length > 0,
      data: {
        species_count: rows.length,
        species: rows,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/species/:key ───────────────────────────────────────
// Accepts any name flavor: acronym, Latin name, Latin synonym, or common name.
// Resolves via the npn_name_aliases table (case-insensitive).
// Returns 404 with found=false when the key is not found in the alias index.

router.get("/ann-arbor-npn/species/:key", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const rawKey = req.params["key"] ?? "";
  const normalizedKey = rawKey.trim().toLowerCase();

  if (!normalizedKey) {
    res.status(400).json({
      error: "invalid_input",
      message: "key parameter is required",
    });
    return;
  }

  // Resolve alias → acronym
  const [aliasRow] = await db
    .select({ acronym: npnNameAliasesTable.acronym })
    .from(npnNameAliasesTable)
    .where(eq(npnNameAliasesTable.alias, normalizedKey))
    .limit(1);

  if (!aliasRow) {
    const envelope = await buildEnvelope(
      {
        sourceId: ANN_ARBOR_NPN_SOURCE_ID,
        sourceKind: "single-source-proxy",
        sourceUrl: "https://www.nativeplant.com/",
        method: "cache_hit",
        cacheStatus: "hit",
        queriedAt: new Date().toISOString(),
        found: false,
        data: null,
      },
      { registry: dbRegistryAccessor },
    );
    res.status(404).json(envelope);
    return;
  }

  const [species] = await db
    .select()
    .from(npnSpeciesTable)
    .where(eq(npnSpeciesTable.acronym, aliasRow.acronym))
    .limit(1);

  if (!species) {
    const envelope = await buildEnvelope(
      {
        sourceId: ANN_ARBOR_NPN_SOURCE_ID,
        sourceKind: "single-source-proxy",
        sourceUrl: "https://www.nativeplant.com/",
        method: "cache_hit",
        cacheStatus: "hit",
        queriedAt: new Date().toISOString(),
        found: false,
        data: null,
      },
      { registry: dbRegistryAccessor },
    );
    res.status(404).json(envelope);
    return;
  }

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: species.source_url,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: species.scraped_at.toISOString(),
      found: true,
      data: species,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/names ──────────────────────────────────────────────
// Returns all species organized into name groups with all_accepted_keys arrays.
// Each group includes common_names as a parsed string[] (split on ; and ,).
// Useful for cross-source name reconciliation.

router.get("/ann-arbor-npn/names", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const species = await db
    .select({
      acronym: npnSpeciesTable.acronym,
      latin_name: npnSpeciesTable.latin_name,
      latin_synonym_greg: npnSpeciesTable.latin_synonym_greg,
      common_name: npnSpeciesTable.common_name,
    })
    .from(npnSpeciesTable)
    .orderBy(npnSpeciesTable.latin_name);

  const aliases = await db
    .select({
      alias: npnNameAliasesTable.alias,
      acronym: npnNameAliasesTable.acronym,
    })
    .from(npnNameAliasesTable)
    .orderBy(npnNameAliasesTable.alias);

  // Build alias map: acronym → [aliases]
  const aliasMap = new Map<string, string[]>();
  for (const row of aliases) {
    const list = aliasMap.get(row.acronym) ?? [];
    list.push(row.alias);
    aliasMap.set(row.acronym, list);
  }

  const nameGroups = species.map((sp) => ({
    acronym: sp.acronym,
    latin_name: sp.latin_name,
    latin_synonym_greg: sp.latin_synonym_greg ?? null,
    common_names: sp.common_name
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean),
    all_accepted_keys: aliasMap.get(sp.acronym) ?? [],
  }));

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "single-source-proxy",
      sourceUrl: "https://www.nativeplant.com/",
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: nameGroups.length > 0,
      data: {
        species_count: nameGroups.length,
        name_groups: nameGroups,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── POST /api/ann-arbor-npn/import ────────────────────────────────────────────
// Admin-only: import / re-import NPN species from nativeplant.com.

router.post("/ann-arbor-npn/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const body = req.body as { acronyms?: string[] } | undefined;
  const filterAcronyms = Array.isArray(body?.acronyms) ? body.acronyms : undefined;

  try {
    await ensureAnnArborNpnRegistryEntry();
    const result = await importNpn(filterAcronyms);
    res.json({
      success: result.errors.length === 0,
      queried_at: new Date(),
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "import_failed",
      message: String(err),
    });
  }
});

export default router;
