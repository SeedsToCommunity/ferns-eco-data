import type { Request } from "express";

export function resolveUrl(req: Request, path: string): string {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const proto = req.get("x-forwarded-proto") ?? "https";
  const host = req.get("x-forwarded-host") ?? req.get("host") ?? "";
  return `${proto}://${host}${path}`;
}
