// Seeds to Community Washtenaw — envelope-migrated routes.
// Admin/infra exemption: NOT applicable — s2c is a registered FERNS source
// (source_id: "seeds-to-community-washtenaw") and uses buildEnvelope().
// Envelope Contract v1: docs/data-layer-contract.md

import { Router, type IRouter } from "express";
import { buildEnvelope } from "@workspace/api-envelope";
import {
  S2C_SOURCE_ID,
  S2C_GENERAL_SUMMARY,
  S2C_TECHNICAL_DETAILS,
  S2C_REGISTRY_ENTRY,
  S2C_LICENSES,
  S2C_LICENSE_NOTES,
} from "../services/s2c/metadata.js";
import {
  S2C_YEARS,
  S2C_AVAILABLE_YEARS,
  getYearData,
} from "../services/s2c/data.js";
import { ensureS2CRegistryEntry } from "../services/s2c/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { dbRegistryAccessor } from "../lib/registry-accessor.js";

const router: IRouter = Router();

router.get("/s2c/years", async (req, res) => {
  await ensureS2CRegistryEntry();
  const envelope = await buildEnvelope(
    {
      sourceId: S2C_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        available_years: S2C_AVAILABLE_YEARS,
        years: S2C_YEARS.map((y) => ({
          year: y.year,
          species_count: y.species.length,
          source_note: y.source_note,
        })),
      },
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/s2c", async (req, res) => {
  const yearParam = req.query["year"];

  if (yearParam === undefined || yearParam === "") {
    res.status(400).json({
      error: "invalid_input",
      message: "year query parameter is required. Available years: " + S2C_AVAILABLE_YEARS.join(", "),
    });
    return;
  }

  const year = parseInt(String(yearParam), 10);
  if (isNaN(year)) {
    res.status(400).json({
      error: "invalid_input",
      message: "year must be a valid integer. Available years: " + S2C_AVAILABLE_YEARS.join(", "),
    });
    return;
  }

  await ensureS2CRegistryEntry();
  const yearData = getYearData(year);
  const found = yearData !== undefined;

  const envelope = await buildEnvelope(
    {
      sourceId: S2C_SOURCE_ID,
      sourceKind: "in-memory",
      found,
      data: found
        ? {
            year: yearData.year,
            species_count: yearData.species.length,
            source_note: yearData.source_note,
            species: yearData.species,
          }
        : null,
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

router.get("/s2c/metadata", async (req, res) => {
  await ensureS2CRegistryEntry();
  const envelope = await buildEnvelope(
    {
      sourceId: S2C_SOURCE_ID,
      sourceKind: "in-memory",
      found: true,
      data: {
        source_id: S2C_SOURCE_ID,
        name: S2C_REGISTRY_ENTRY.name,
        knowledge_type: S2C_REGISTRY_ENTRY.knowledge_type,
        status: S2C_REGISTRY_ENTRY.status,
        description: S2C_REGISTRY_ENTRY.description,
        input_summary: S2C_REGISTRY_ENTRY.input_summary,
        output_summary: S2C_REGISTRY_ENTRY.output_summary,
        dependencies: S2C_REGISTRY_ENTRY.dependencies,
        update_frequency: S2C_REGISTRY_ENTRY.update_frequency,
        known_limitations: S2C_REGISTRY_ENTRY.known_limitations,
        metadata_url: resolveUrl(req, S2C_REGISTRY_ENTRY.metadata_url),
        explorer_url: resolveUrl(req, S2C_REGISTRY_ENTRY.explorer_url),
        licenses: S2C_LICENSES,
        license_notes: S2C_LICENSE_NOTES,
        general_summary: S2C_GENERAL_SUMMARY,
        technical_details: S2C_TECHNICAL_DETAILS,
      },
      method: "cache_hit",
      cacheStatus: "hit",
      sourceUrl: null,
      queriedAt: new Date().toISOString(),
    },
    { registry: dbRegistryAccessor },
  );
  res.json(envelope);
});

export default router;
