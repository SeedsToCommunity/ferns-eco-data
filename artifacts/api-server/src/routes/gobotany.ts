import { Router, type IRouter } from "express";
import {
  GOBOTANY_SOURCE_ID,
  GOBOTANY_DERIVATION_SUMMARY,
  GOBOTANY_DERIVATION_SCIENTIFIC,
  GOBOTANY_REGISTRY_ENTRY,
  GOBOTANY_PERMISSION_GRANTED,
  GOBOTANY_PERMISSION_STATUS,
} from "../services/gobotany/metadata.js";
import { ensureGobotanyRegistryEntry } from "../services/gobotany/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

const GOBOTANY_BASE = "https://gobotany.nativeplanttrust.org";

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: GOBOTANY_SOURCE_ID,
    fetched_at: new Date(),
    method: "direct_construction",
    upstream_url: resolveUrl(req, "/api/gobotany/metadata"),
    derivation_summary: GOBOTANY_DERIVATION_SUMMARY,
    derivation_scientific: GOBOTANY_DERIVATION_SCIENTIFIC,
  };
}

function parseSpecies(input: string): { genus: string; species: string } | null {
  const parts = input.trim().split(/\s+/);
  if (parts.length < 2) return null;
  const genus = parts[0].toLowerCase();
  const species = parts[1].toLowerCase();
  if (!/^[a-z]+$/.test(genus) || !/^[a-z]+$/.test(species)) return null;
  return { genus, species };
}

router.get("/gobotany/metadata", async (req, res) => {
  await ensureGobotanyRegistryEntry();
  res.json({
    service_id: GOBOTANY_SOURCE_ID,
    service_name: GOBOTANY_REGISTRY_ENTRY.name,
    permission_granted: GOBOTANY_PERMISSION_GRANTED,
    permission_status: GOBOTANY_PERMISSION_STATUS,
    url_strategy: "direct_construction",
    url_pattern: `${GOBOTANY_BASE}/species/{genus}/{species}/`,
    validation: "http_get",
    registry_entry: {
      ...GOBOTANY_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, GOBOTANY_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/gobotany", async (req, res) => {
  await ensureGobotanyRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const parsed = parseSpecies(speciesParam);
  if (!parsed) {
    res.status(400).json({
      error: "invalid_input",
      message: "species must be a binomial name (genus + species epithet, e.g. Acer rubrum)",
    });
    return;
  }

  const { genus, species } = parsed;
  const url = `${GOBOTANY_BASE}/species/${genus}/${species}/`;

  let found = false;
  let validationMethod: string;
  let httpStatus: number | null = null;

  try {
    const resp = await fetch(url, {
      method: "GET",
      headers: { "User-Agent": "FERNS/1.0 (ecological data aggregator; research use)" },
      redirect: "follow",
    });
    httpStatus = resp.status;
    found = resp.status === 200;
    validationMethod = "http_get";
  } catch {
    validationMethod = "http_get_failed";
    found = false;
  }

  res.json({
    found,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/gobotany"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: found
      ? {
          species: speciesParam,
          url,
          validation_method: validationMethod,
          http_status: httpStatus,
        }
      : null,
  });
});

export default router;
