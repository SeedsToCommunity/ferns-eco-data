import { Router, type IRouter } from "express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import yaml from "js-yaml";

// import.meta.url in an esbuild ESM bundle refers to the output bundle file at runtime.
// From dist/index.mjs → up 3 levels → workspace root → lib/api-spec/openapi.yaml
const specPath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../lib/api-spec/openapi.yaml",
);

const specYamlText = readFileSync(specPath, "utf-8");
const specJson = yaml.load(specYamlText);

const router: IRouter = Router();

router.get("/openapi.yaml", (_req, res) => {
  res.setHeader("Content-Type", "application/yaml; charset=utf-8");
  res.send(specYamlText);
});

router.get("/openapi.json", (_req, res) => {
  res.json(specJson);
});

export default router;
