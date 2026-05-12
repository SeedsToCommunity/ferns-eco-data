import { Router, type IRouter } from "express";
import { db, npnSpeciesTable, npnNameAliasesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  NPN_SOURCE_ID,
  NPN_GENERAL_SUMMARY,
  NPN_TECHNICAL_DETAILS,
  NPN_REGISTRY_ENTRY,
  NPN_PERMISSION_GRANTED,
  NPN_PERMISSION_STATUS,
} from "../services/npn/metadata.js";
import { ensureNpnRegistryEntry } from "../services/npn/seed.js";
import { importNpn } from "../services/npn/import.js";
import { requireAdmin } from "../lib/admin-guard.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: NPN_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/ann-arbor-npn/metadata"),
    general_summary: NPN_GENERAL_SUMMARY,
    technical_details: NPN_TECHNICAL_DETAILS,
  };
}

// ── GET /api/ann-arbor-npn/metadata ──────────────────────────────────────────

router.get("/ann-arbor-npn/metadata", async (req, res) => {
  await ensureNpnRegistryEntry();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(npnSpeciesTable);
  const speciesCount = Number(row?.count ?? 0);

  res.json({
    service_id: NPN_SOURCE_ID,
    service_name: NPN_REGISTRY_ENTRY.name,
    permission_granted: NPN_PERMISSION_GRANTED,
    permission_status: NPN_PERMISSION_STATUS,
    species_count: speciesCount,
    registry_entry: {
      ...NPN_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, NPN_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, NPN_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: {
      ...buildProvenance(req),
      method: "static_metadata",
    },
  });
});

// ── GET /api/ann-arbor-npn/species ────────────────────────────────────────────
// Returns the full list of all NPN species (bulk).

router.get("/ann-arbor-npn/species", async (req, res) => {
  await ensureNpnRegistryEntry();
  const verbosity =
    typeof req.query["provenance_verbosity"] === "string"
      ? req.query["provenance_verbosity"]
      : undefined;

  const rows = await db
    .select()
    .from(npnSpeciesTable)
    .orderBy(npnSpeciesTable.latin_name);

  res.json({
    found: rows.length > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/ann-arbor-npn/species"),
    provenance: filterProvenance(buildProvenance(req), verbosity),
    data: {
      species_count: rows.length,
      species: rows,
    },
  });
});

// ── GET /api/ann-arbor-npn/species/:key ───────────────────────────────────────
// Accepts any name flavor: acronym, Latin name, Latin synonym, or common name.
// Resolves via the npn_name_aliases table (case-insensitive).

router.get("/ann-arbor-npn/species/:key", async (req, res) => {
  await ensureNpnRegistryEntry();
  const verbosity =
    typeof req.query["provenance_verbosity"] === "string"
      ? req.query["provenance_verbosity"]
      : undefined;

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
    res.json({
      found: false,
      queried_at: new Date(),
      source_url: resolveUrl(req, `/api/ann-arbor-npn/species/${encodeURIComponent(rawKey)}`),
      provenance: filterProvenance(
        { ...buildProvenance(req), matched_input: rawKey },
        verbosity,
      ),
      data: null,
    });
    return;
  }

  const [species] = await db
    .select()
    .from(npnSpeciesTable)
    .where(eq(npnSpeciesTable.acronym, aliasRow.acronym))
    .limit(1);

  if (!species) {
    res.json({
      found: false,
      queried_at: new Date(),
      source_url: resolveUrl(req, `/api/ann-arbor-npn/species/${encodeURIComponent(rawKey)}`),
      provenance: filterProvenance(
        { ...buildProvenance(req), matched_input: rawKey },
        verbosity,
      ),
      data: null,
    });
    return;
  }

  res.json({
    found: true,
    queried_at: new Date(),
    source_url: resolveUrl(req, `/api/ann-arbor-npn/species/${encodeURIComponent(rawKey)}`),
    provenance: filterProvenance(
      { ...buildProvenance(req), matched_input: rawKey },
      verbosity,
    ),
    data: species,
  });
});

// ── GET /api/ann-arbor-npn/names ──────────────────────────────────────────────
// Returns all species organized into name groups with all_accepted_keys arrays.
// Useful for cross-source name reconciliation.

router.get("/ann-arbor-npn/names", async (req, res) => {
  await ensureNpnRegistryEntry();
  const verbosity =
    typeof req.query["provenance_verbosity"] === "string"
      ? req.query["provenance_verbosity"]
      : undefined;

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
    common_name: sp.common_name,
    all_accepted_keys: aliasMap.get(sp.acronym) ?? [],
  }));

  res.json({
    found: nameGroups.length > 0,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/ann-arbor-npn/names"),
    provenance: filterProvenance(buildProvenance(req), verbosity),
    data: {
      species_count: nameGroups.length,
      name_groups: nameGroups,
    },
  });
});

// ── POST /api/ann-arbor-npn/import ────────────────────────────────────────────
// Admin-only: import / re-import NPN species from nativeplant.com.

router.post("/ann-arbor-npn/import", async (req, res) => {
  if (!requireAdmin(req, res)) return;

  const body = req.body as { acronyms?: string[] } | undefined;
  const filterAcronyms = Array.isArray(body?.acronyms) ? body.acronyms : undefined;

  try {
    await ensureNpnRegistryEntry();
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
