import { Router, type IRouter } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  ANN_ARBOR_NPN_SOURCE_ID,
  ANN_ARBOR_NPN_REGISTRY_ENTRY,
  ANN_ARBOR_NPN_LICENSES,
  ANN_ARBOR_NPN_LICENSE_NOTES,
} from "../services/ann-arbor-npn/metadata.js";
import { ensureAnnArborNpnRegistryEntry } from "../services/ann-arbor-npn/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { buildEnvelope } from "@workspace/api-envelope";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";
import {
  getAnnArborNpnSpecies,
  listAnnArborNpnSpecies,
  listAnnArborNpnNameGroups,
  ANN_ARBOR_NPN_SNAPSHOT_DATE,
} from "@workspace/internal-data-providers/ann-arbor-npn";

const router: IRouter = Router();

// import.meta.url in an esbuild ESM bundle refers to the output bundle file at runtime.
// The dev script also builds to dist/ first, so import.meta.url always points to dist/index.mjs.
// From dist/index.mjs → up one level → artifacts/api-server/ → src/services/ann-arbor-npn/...
const DOCUMENTATION_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/services/ann-arbor-npn/ANN_ARBOR_NPN_SOURCE_DOCUMENTATION.md",
);
const DOCUMENTATION_CONTENT = readFileSync(DOCUMENTATION_PATH, "utf-8");

// ── GET /api/ann-arbor-npn/metadata ──────────────────────────────────────────

router.get("/ann-arbor-npn/metadata", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();
  const species = listAnnArborNpnSpecies();
  const speciesCount = species.length;

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "in-memory",
      sourceUrl: null,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        service_id: ANN_ARBOR_NPN_SOURCE_ID,
        service_name: ANN_ARBOR_NPN_REGISTRY_ENTRY.name,
        licenses: ANN_ARBOR_NPN_LICENSES,
        license_notes: ANN_ARBOR_NPN_LICENSE_NOTES,
        species_count: speciesCount,
        snapshot_date: ANN_ARBOR_NPN_SNAPSHOT_DATE,
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
// Returns all 130 species from the IDP (bulk).

router.get("/ann-arbor-npn/species", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const species = listAnnArborNpnSpecies();

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "in-memory",
      sourceUrl: null,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: species.length > 0,
      data: {
        species_count: species.length,
        species,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/species/:key ───────────────────────────────────────
// Accepts any name flavor: acronym, Latin name, Latin synonym, or common name.
// Resolves via the IDP alias index (case-insensitive).
// Returns 404 with found=false when the key is not found.

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

  const species = getAnnArborNpnSpecies(normalizedKey);

  if (!species) {
    const envelope = await buildEnvelope(
      {
        sourceId: ANN_ARBOR_NPN_SOURCE_ID,
        sourceKind: "in-memory",
        sourceUrl: null,
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
      sourceKind: "in-memory",
      sourceUrl: null,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: true,
      data: species,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/species/:key/source-url ───────────────────────────
// Returns the per-species nativeplant.com URL for a given key.

router.get("/ann-arbor-npn/species/:key/source-url", async (req, res) => {
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

  const species = getAnnArborNpnSpecies(normalizedKey);

  if (!species) {
    const envelope = await buildEnvelope(
      {
        sourceId: ANN_ARBOR_NPN_SOURCE_ID,
        sourceKind: "in-memory",
        sourceUrl: null,
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
      sourceKind: "in-memory",
      sourceUrl: null,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        acronym: species.acronym,
        source_url: species.source_url,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/alias-index ────────────────────────────────────────
// Returns all 130 species with every accepted lookup alias.
// Replaces the old /names route.

router.get("/ann-arbor-npn/alias-index", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const nameGroups = listAnnArborNpnNameGroups();

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "in-memory",
      sourceUrl: null,
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

// ── GET /api/ann-arbor-npn/documentation ─────────────────────────────────────
// Serves ANN_ARBOR_NPN_SOURCE_DOCUMENTATION.md as data.markdown in a FERNS envelope.

router.get("/ann-arbor-npn/documentation", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const envelope = await buildEnvelope(
    {
      sourceId: ANN_ARBOR_NPN_SOURCE_ID,
      sourceKind: "in-memory",
      sourceUrl: null,
      method: "cache_hit",
      cacheStatus: "hit",
      queriedAt: new Date().toISOString(),
      found: true,
      data: {
        markdown: DOCUMENTATION_CONTENT,
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
