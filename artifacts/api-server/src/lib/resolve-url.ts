import type { Request } from "express";

export function resolveUrl(req: Request, path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const envBase = process.env["FERNS_API_BASE_URL"];
  if (envBase) {
    return `${envBase.replace(/\/$/, "")}${path}`;
  }
  const proto = req.get("x-forwarded-proto") ?? "http";
  const host = req.get("x-forwarded-host") ?? req.get("host") ?? "localhost:8080";
  return `${proto}://${host}${path}`;
}
