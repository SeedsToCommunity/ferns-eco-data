import { Router, type IRouter } from "express";
import { HealthCheckResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/healthz", (_req, res) => {
  // Smoke-test consumer of the FernsEnvelope OpenAPI component (task #162).
  // Constructed as a literal envelope rather than via @workspace/api-envelope's
  // buildEnvelope() because health is not a registered FERNS source — it has
  // no ferns_sources row to look up. Per-route migration to the shared builder
  // is tracked separately in the "Migrate all routes to shared envelope" task.
  const data = HealthCheckResponse.parse({
    found: true,
    permission_granted: true,
    pagination: null,
    provenance: {
      source_id: "health",
      source_url: null,
      method: "computed",
      cache_status: "bypass",
      queried_at: new Date(),
      derived_from: null,
      license: "unknown",
      rights: "FERNS internal health check; not a registered source.",
    },
    data: { status: "ok" },
  });
  res.json(data);
});

export default router;
