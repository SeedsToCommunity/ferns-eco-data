import { Router, type IRouter } from "express";
import {
  S2C_SOURCE_ID,
  S2C_GENERAL_SUMMARY,
  S2C_TECHNICAL_DETAILS,
  S2C_REGISTRY_ENTRY,
  S2C_PERMISSION_GRANTED,
  S2C_PERMISSION_STATUS,
} from "../services/s2c/metadata.js";
import {
  S2C_YEARS,
  S2C_AVAILABLE_YEARS,
  getYearData,
} from "../services/s2c/data.js";
import { ensureS2CRegistryEntry } from "../services/s2c/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";
import { filterProvenance } from "../lib/provenance.js";

const router: IRouter = Router();

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: S2C_SOURCE_ID,
    fetched_at: new Date(),
    method: "static_data",
    upstream_url: resolveUrl(req, "/api/s2c/years"),
    general_summary: S2C_GENERAL_SUMMARY,
    technical_details: S2C_TECHNICAL_DETAILS,
  };
}

router.get("/s2c/years", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
  res.json({
    found: true,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/s2c/years"),
    provenance: filterProvenance(buildProvenance(req), verbosity),
    data: {
      available_years: S2C_AVAILABLE_YEARS,
      years: S2C_YEARS.map((y) => ({
        year: y.year,
        species_count: y.species.length,
        source_note: y.source_note,
      })),
    },
  });
});

router.get("/s2c", (req, res) => {
  const verbosity = typeof req.query["provenance_verbosity"] === "string" ? req.query["provenance_verbosity"] : undefined;
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

  const yearData = getYearData(year);
  const found = yearData !== undefined;

  res.json({
    found,
    cache_status: "miss",
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/s2c/years"),
    provenance: filterProvenance({
      ...buildProvenance(req),
      matched_input: year,
    }, verbosity),
    data: found
      ? {
          year: yearData.year,
          species_count: yearData.species.length,
          source_note: yearData.source_note,
          species: yearData.species,
        }
      : null,
  });
});

router.get("/s2c/metadata", async (req, res) => {
  await ensureS2CRegistryEntry();
  const queriedAt = new Date();

  res.json({
    service_id: S2C_SOURCE_ID,
    service_name: S2C_REGISTRY_ENTRY.name,
    permission_granted: S2C_PERMISSION_GRANTED,
    permission_status: S2C_PERMISSION_STATUS,
    registry_entry: {
      ...S2C_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, S2C_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, S2C_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: queriedAt,
    provenance: {
      ...buildProvenance(req),
      upstream_url: resolveUrl(req, "/api/s2c/metadata"),
      method: "static_metadata",
    },
  });
});

export default router;
