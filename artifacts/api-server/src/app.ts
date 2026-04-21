import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import http from "http";
import router from "./routes";
import mcpRouter from "./routes/mcp";
import { logger } from "./lib/logger";

const app: Express = express();
app.set("etag", false);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.options(/(.*)/, cors({ origin: "*" }));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(mcpRouter);

app.use("/api", (_req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use("/api", router);

// Unmatched /api/* routes should return 404, not fall through to the static
// site handler. Without this, a missing endpoint would serve index.html (200).
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Production-only: serve the appropriate static site based on the Host header.
// Requests reach here only if no /api route matched (non-API paths).
//
// data.ecologicalcommons.org  →  FERNS registry explorer
// ecologicalcommons.org (or any other host)  →  public website
//
// Development-only: proxy non-API requests to the Astro dev server so the
// Replit preview (which routes all traffic through this server) can serve
// the public site. In production the block below handles static files.
if (process.env.NODE_ENV !== "production") {
  const SITE_PORT = Number(process.env.ECOLOGICAL_COMMONS_PORT ?? "18478");
  app.use((req, res) => {
    const options = {
      hostname: "localhost",
      port: SITE_PORT,
      path: req.url,
      method: req.method,
      headers: { ...req.headers, host: `localhost:${SITE_PORT}` },
    };
    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers as Record<string, string>);
      proxyRes.pipe(res, { end: true });
    });
    proxy.on("error", () => {
      res.status(502).send("Astro dev server not available — start the ecological-commons-site workflow");
    });
    req.pipe(proxy, { end: true });
  });
}

// Production-only: serve the appropriate static site based on the Host header.
// Requests reach here only if no /api route matched (non-API paths).
//
// data.ecologicalcommons.org  →  FERNS registry explorer
// ecologicalcommons.org (or any other host)  →  public website
//
// In development each site runs its own Vite dev server; this block is skipped.
if (process.env.NODE_ENV === "production") {
  const dataExplorerDir = path.resolve(
    "artifacts/registry-explorer/dist/public",
  );
  const publicSiteDir = path.resolve(
    "artifacts/ecological-commons-site/dist/public",
  );

  app.use((req, res, next) => {
    const rawHost =
      (req.headers["x-forwarded-host"] as string | undefined) ??
      req.headers.host ??
      "";
    // Lowercase and take only the first value — X-Forwarded-Host can be
    // comma-separated when passing through multiple proxies.
    const host = rawHost.split(",")[0].trim().toLowerCase();
    const dir = host.startsWith("data.") ? dataExplorerDir : publicSiteDir;

    express.static(dir, { index: "index.html" })(req, res, () => {
      // SPA fallback: any unmatched path serves index.html so client-side
      // routing handles it rather than returning a 404.
      res.sendFile(path.join(dir, "index.html"));
    });
  });
}

export default app;
