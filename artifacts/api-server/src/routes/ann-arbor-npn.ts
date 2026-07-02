import { Router, type IRouter } from "express";
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
  getAnnArborNpnSpeciesList,
  getAnnArborNpnNameGroups,
  getAnnArborNpnSpeciesSourceUrl,
  getAnnArborNpnDocumentation,
  ANN_ARBOR_NPN_SNAPSHOT_DATE,
} from "@workspace/internal-data-providers/ann-arbor-npn";

const router: IRouter = Router();

// ── GET /api/ann-arbor-npn/metadata ──────────────────────────────────────────

router.get("/ann-arbor-npn/metadata", async (req, res) => {
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
        service_id: ANN_ARBOR_NPN_SOURCE_ID,
        service_name: ANN_ARBOR_NPN_REGISTRY_ENTRY.name,
        licenses: ANN_ARBOR_NPN_LICENSES,
        license_notes: ANN_ARBOR_NPN_LICENSE_NOTES,
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

// ── GET /api/ann-arbor-npn/species-list ──────────────────────────────────────
// Returns all 130 species from the IDP (bulk).

router.get("/ann-arbor-npn/species-list", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const species = getAnnArborNpnSpeciesList();

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

  const result = getAnnArborNpnSpeciesSourceUrl(normalizedKey);

  if (!result) {
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
      data: result,
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

// ── GET /api/ann-arbor-npn/name-groups ────────────────────────────────────────
// Returns all 130 species with every accepted lookup alias.

router.get("/ann-arbor-npn/name-groups", async (req, res) => {
  await ensureAnnArborNpnRegistryEntry();

  const nameGroups = getAnnArborNpnNameGroups();

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
        markdown: getAnnArborNpnDocumentation(),
      },
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
