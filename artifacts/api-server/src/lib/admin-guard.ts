import type { Request, Response } from "express";

export function requireAdmin(req: Request, res: Response): boolean {
  const secret = process.env["ADMIN_SECRET"];
  const isProd = process.env["NODE_ENV"] === "production";
  if (!secret) {
    if (isProd) {
      res.status(503).json({
        error: "misconfigured",
        message: "ADMIN_SECRET must be set in production to use import endpoints.",
      });
      return false;
    }
    return true;
  }
  const auth = req.headers["authorization"] ?? "";
  if (auth === `Bearer ${secret}`) return true;
  res.status(401).json({
    error: "unauthorized",
    message: "Valid Authorization: Bearer <ADMIN_SECRET> header required.",
  });
  return false;
}
