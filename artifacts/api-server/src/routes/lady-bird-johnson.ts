import { Router, type IRouter } from "express";
import {
  LADY_BIRD_JOHNSON_SOURCE_ID,
  LADY_BIRD_JOHNSON_DERIVATION_SUMMARY,
  LADY_BIRD_JOHNSON_DERIVATION_SCIENTIFIC,
  LADY_BIRD_JOHNSON_REGISTRY_ENTRY,
  LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
  LADY_BIRD_JOHNSON_PERMISSION_STATUS,
} from "../services/lady-bird-johnson/metadata.js";
import { ensureLadyBirdJohnsonRegistryEntry } from "../services/lady-bird-johnson/seed.js";
import { resolveUrl } from "../lib/resolve-url.js";

const router: IRouter = Router();

const LBJ_BASE = "https://www.wildflower.org/plants/search.php";

function buildProvenance(req: Parameters<typeof resolveUrl>[0]) {
  return {
    source_id: LADY_BIRD_JOHNSON_SOURCE_ID,
    fetched_at: new Date(),
    method: "direct_construction",
    upstream_url: resolveUrl(req, "/api/lady-bird-johnson/metadata"),
    derivation_summary: LADY_BIRD_JOHNSON_DERIVATION_SUMMARY,
    derivation_scientific: LADY_BIRD_JOHNSON_DERIVATION_SCIENTIFIC,
  };
}

function buildSearchUrl(speciesParam: string): string {
  const parts = speciesParam.trim().split(/\s+/);
  const genus = parts[0] ?? "";
  const species = parts[1] ?? "";
  const params = new URLSearchParams({ search_field: "genus" });
  if (genus) params.set("genus", genus);
  if (species) params.set("species", species);
  return `${LBJ_BASE}?${params.toString()}`;
}

router.get("/lady-bird-johnson/metadata", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();
  res.json({
    service_id: LADY_BIRD_JOHNSON_SOURCE_ID,
    service_name: LADY_BIRD_JOHNSON_REGISTRY_ENTRY.name,
    permission_granted: LADY_BIRD_JOHNSON_PERMISSION_GRANTED,
    permission_status: LADY_BIRD_JOHNSON_PERMISSION_STATUS,
    url_strategy: "direct_construction",
    url_pattern: `${LBJ_BASE}?search_field=genus&genus={Genus}&species={species}`,
    validation: "none",
    registry_entry: {
      ...LADY_BIRD_JOHNSON_REGISTRY_ENTRY,
      metadata_url: resolveUrl(req, LADY_BIRD_JOHNSON_REGISTRY_ENTRY.metadata_url),
      explorer_url: resolveUrl(req, LADY_BIRD_JOHNSON_REGISTRY_ENTRY.explorer_url),
    },
    queried_at: new Date(),
    provenance: buildProvenance(req),
  });
});

router.get("/lady-bird-johnson", async (req, res) => {
  await ensureLadyBirdJohnsonRegistryEntry();

  const speciesParam = typeof req.query["species"] === "string" ? req.query["species"].trim() : null;
  if (!speciesParam) {
    res.status(400).json({
      error: "invalid_input",
      message: "species query parameter is required (e.g. ?species=Acer+rubrum)",
    });
    return;
  }

  const searchUrl = buildSearchUrl(speciesParam);

  res.json({
    found: false,
    queried_at: new Date(),
    source_url: resolveUrl(req, "/api/lady-bird-johnson"),
    provenance: { ...buildProvenance(req), matched_input: speciesParam },
    data: {
      species: speciesParam,
      url: null,
      search_url: searchUrl,
      validation_method: "not_resolvable",
      note: "Species profile URLs require an internal LBJWC plant ID that cannot be derived from the scientific name. FERNS provides a search URL instead; the profile URL is not available.",
    },
  });
});

export default router;
