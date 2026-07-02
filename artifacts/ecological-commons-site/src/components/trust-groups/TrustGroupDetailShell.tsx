import { useEffect, useState } from "react";
import TrustGroupDetailApp from "./TrustGroupDetailApp";

// The detail page is served from a single static shell (see trust-groups/detail.astro)
// so it works under Astro's static output without per-slug build-time pages. The
// server (dev proxy + prod express route, see api-server/src/app.ts) rewrites any
// /trust-groups/<slug> request to this shell while leaving the address bar untouched,
// so we read the actual slug back out of the URL here on the client.
export default function TrustGroupDetailShell() {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const segments = window.location.pathname.split("/").filter(Boolean);
    const raw = segments.length >= 2 ? segments[segments.length - 1] : null;
    setSlug(raw && raw !== "detail" ? decodeURIComponent(raw) : null);
  }, []);

  if (slug === null) return null;

  return <TrustGroupDetailApp slug={slug} />;
}
