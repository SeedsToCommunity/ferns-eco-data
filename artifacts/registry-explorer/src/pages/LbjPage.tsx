import { useState } from "react";
import { useGetSourcesIndex, getGetSourcesIndexQueryKey } from "@workspace/api-client-react";
import {
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  CheckCircle2,
  XCircle,
  Loader2,
  BookOpen,
  RefreshCw,
  Clock,
  Database,
  AlertTriangle,
} from "lucide-react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

// ── Response type interfaces ──────────────────────────────────────────────────

interface LbjUrlCheckData {
  symbol: string;
  profile_url: string | null;
  status: "found" | "not_found" | "unverified";
  http_status: number | null;
  validation_method: string;
  cache_hit: boolean;
}

interface LbjUrlCheckResponse {
  found: boolean;
  queried_at?: string;
  data?: LbjUrlCheckData;
  provenance?: Record<string, unknown>;
}

interface LbjSpeciesTextData {
  symbol: string;
  url: string | null;
  sections: Record<string, string> | null;
  full_text: string | null;
}

interface LbjSpeciesTextResponse {
  found: boolean;
  cache_status: "hit" | "miss";
  scraped_at?: string;
  fetch_error?: string;
  queried_at?: string;
  data?: LbjSpeciesTextData | null;
  provenance?: Record<string, unknown>;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function RawPanel({ data }: { data: unknown }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          Raw API response
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="border-t border-border/50 p-3">
          <pre className="text-[10px] font-mono leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: LbjUrlCheckData["status"] }) {
  if (status === "found") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-600 border border-green-500/20">
        <CheckCircle2 className="w-2.5 h-2.5" />
        found
      </span>
    );
  }
  if (status === "not_found") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-muted-foreground border border-border/40">
        <XCircle className="w-2.5 h-2.5" />
        not found
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
      <AlertTriangle className="w-2.5 h-2.5" />
      unverified
    </span>
  );
}

function CacheHitBadge({ hit }: { hit: boolean }) {
  if (hit) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
        <Database className="w-2.5 h-2.5" />
        cached
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
      <RefreshCw className="w-2.5 h-2.5" />
      live fetch
    </span>
  );
}

function UrlCheckResult({ result }: { result: LbjUrlCheckResponse }) {
  const data = result.data;
  if (!data) return null;

  const resultBg =
    data.status === "found"
      ? "bg-green-500/5 border-green-500/20"
      : data.status === "unverified"
      ? "bg-amber-500/5 border-amber-500/20"
      : "bg-muted/30 border-border/40";

  return (
    <div className={`rounded-xl border p-4 space-y-3 ${resultBg}`}>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={data.status} />
        <CacheHitBadge hit={data.cache_hit} />
        {data.http_status !== null && (
          <span className="text-[10px] text-muted-foreground font-mono">
            HTTP {data.http_status}
          </span>
        )}
      </div>

      {data.status === "found" && data.profile_url && (
        <a
          href={data.profile_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {data.profile_url}
        </a>
      )}

      {data.status === "not_found" && (
        <p className="text-sm text-muted-foreground">
          Symbol <span className="font-mono font-medium">{data.symbol}</span> was not found on
          the Lady Bird Johnson Wildflower Center site (redirect response — no profile page exists).
        </p>
      )}

      {data.status === "unverified" && (
        <p className="text-sm text-muted-foreground">
          Could not verify — upstream returned a server error or the request timed out.
          Result was not cached; retry to attempt a fresh verification.
        </p>
      )}
    </div>
  );
}

function TextCacheStatusBadge({ status }: { status: LbjSpeciesTextResponse["cache_status"] }) {
  if (status === "hit") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
        <Database className="w-2.5 h-2.5" />
        cached
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
      <RefreshCw className="w-2.5 h-2.5" />
      live scrape
    </span>
  );
}

function SpeciesTextResult({ result }: { result: LbjSpeciesTextResponse }) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  if (result.fetch_error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-destructive shrink-0" />
          <span className="text-sm font-medium text-destructive">Upstream fetch failed</span>
        </div>
        <p className="text-xs text-muted-foreground">{result.fetch_error}</p>
        <p className="text-xs text-muted-foreground">
          This result was not cached — retrying will attempt a fresh scrape.
        </p>
      </div>
    );
  }

  if (!result.found) {
    return (
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">
          Symbol not found on the Lady Bird Johnson Wildflower Center site.
        </span>
      </div>
    );
  }

  const data = result.data;
  if (!data) return null;

  const sections = data.sections ? Object.entries(data.sections) : [];
  const scrapedAt = result.scraped_at
    ? new Date(result.scraped_at).toLocaleString()
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium">
            Found profile for <span className="font-mono">{data.symbol}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <TextCacheStatusBadge status={result.cache_status} />
          {scrapedAt && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              scraped {scrapedAt}
            </span>
          )}
        </div>
      </div>

      {data.url && (
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {data.url}
        </a>
      )}

      {sections.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Extracted text sections
          </p>
          {sections.map(([key, text]) => {
            const isOpen = expandedSections.has(key);
            return (
              <div key={key} className="border border-border/50 rounded-xl overflow-hidden bg-muted/20">
                <button
                  onClick={() => toggleSection(key)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/40 transition-colors text-left"
                >
                  <span className="text-sm font-medium">{key}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="border-t border-border/50 px-4 py-3">
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{text}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {sections.length === 0 && data.full_text && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Extracted text
          </p>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {data.full_text}
          </p>
        </div>
      )}

      {sections.length === 0 && !data.full_text && (
        <p className="text-xs text-muted-foreground">
          Page was found but no text sections were extracted.
        </p>
      )}
    </div>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function LbjPage() {
  const { data: sourcesData } = useGetSourcesIndex({
    query: { queryKey: getGetSourcesIndexQueryKey() },
  });
  const sourceEntry = sourcesData?.data?.sources?.find((s) => s.source_id === "lady-bird-johnson");
  const sourceName = sourceEntry?.name ?? "Lady Bird Johnson Wildflower Center";

  const [symbol, setSymbol] = useState("");
  const [mode, setMode] = useState<"url" | "text">("url");
  const [refresh, setRefresh] = useState(false);

  const [urlResult, setUrlResult] = useState<LbjUrlCheckResponse | null>(null);
  const [urlRaw, setUrlRaw] = useState<unknown>(null);
  const [textResult, setTextResult] = useState<LbjSpeciesTextResponse | null>(null);
  const [textRaw, setTextRaw] = useState<unknown>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setUrlResult(null);
    setUrlRaw(null);
    setTextResult(null);
    setTextRaw(null);

    try {
      if (mode === "url") {
        const res = await fetch(`${API_BASE}/lady-bird-johnson?symbol=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        setUrlRaw(json);
        if (res.ok) {
          setUrlResult(json as LbjUrlCheckResponse);
        } else {
          setError((json as { message?: string }).message ?? `HTTP ${res.status}`);
        }
      } else {
        const endpoint = `${API_BASE}/lady-bird-johnson/species-text?symbol=${encodeURIComponent(trimmed)}${refresh ? "&refresh=true" : ""}`;
        const res = await fetch(endpoint);
        const json = await res.json();
        setTextRaw(json);
        if (res.ok) {
          setTextResult(json as LbjSpeciesTextResponse);
        } else {
          setError((json as { message?: string }).message ?? `HTTP ${res.status}`);
        }
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const resultBg =
    mode === "url"
      ? urlResult === null
        ? ""
        : urlResult.found
        ? "bg-green-500/5 border-green-500/20"
        : urlResult.data?.status === "unverified"
        ? "bg-amber-500/5 border-amber-500/20"
        : "bg-muted/30 border-border/40"
      : textResult === null
      ? ""
      : textResult.found
      ? "bg-green-500/5 border-green-500/20"
      : "bg-muted/30 border-border/40";

  return (
    <SourceExplorerLayout sourceId="lady-bird-johnson">
      <div className="space-y-8">

        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              Symbol Lookup
            </h2>
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <button
                onClick={() => { setMode("url"); setUrlResult(null); setTextResult(null); setError(null); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  mode === "url"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                URL verify
              </button>
              <button
                onClick={() => { setMode("text"); setUrlResult(null); setTextResult(null); setError(null); }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  mode === "text"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <BookOpen className="w-3 h-3" />
                page text
              </button>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border/40 text-xs text-muted-foreground">
            Input a <span className="font-medium text-foreground">USDA Plants symbol</span> (e.g.{" "}
            <span className="font-mono text-foreground">TRGI</span> for <em>Trillium grandiflorum</em>,{" "}
            <span className="font-mono text-foreground">ACRU</span> for <em>Acer rubrum</em>).
            Obtain symbols via the USDA PLANTS lookup.
          </div>

          <form onSubmit={handleLookup} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                placeholder="e.g. TRGI"
                className="flex-1 px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50 font-mono uppercase"
              />
              <button
                type="submit"
                disabled={loading || !symbol.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {loading ? "Looking up…" : "Look up"}
              </button>
            </div>

            {mode === "text" && (
              <label className="flex items-center gap-2 cursor-pointer select-none w-fit">
                <input
                  type="checkbox"
                  checked={refresh}
                  onChange={(e) => setRefresh(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-primary"
                />
                <span className="text-xs text-muted-foreground">
                  Force re-scrape (bypass cache)
                </span>
              </label>
            )}
          </form>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
          )}

          {mode === "url" && urlResult && !loading && (
            <div className={`rounded-xl border p-4 ${resultBg}`}>
              <UrlCheckResult result={urlResult} />
            </div>
          )}

          {mode === "text" && textResult && !loading && (
            <div className={`rounded-xl border p-4 ${resultBg}`}>
              <SpeciesTextResult result={textResult} />
            </div>
          )}

          {!!(urlRaw || textRaw) && !loading && (
            <RawPanel data={urlRaw ?? textRaw} />
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            How it works
          </h2>
          <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
            <li>
              Accepts a <span className="font-medium text-foreground">USDA Plants symbol</span> — look up symbols
              via the USDA PLANTS source.
            </li>
            <li>
              Constructs <span className="font-mono text-foreground text-xs">result.php?id_plant=&#123;SYMBOL&#125;</span> and verifies
              via HTTP with a browser-like User-Agent (required — the site blocks generic agents).
            </li>
            <li>
              HTTP 200 → <span className="text-green-600 font-medium">found</span> (cached 90 days). Redirect → <span className="text-muted-foreground font-medium">not found</span> (cached 30 days).
            </li>
            <li>
              The <span className="font-medium text-foreground">page text</span> mode scrapes and permanently
              caches all botanical prose sections from the profile page.
            </li>
            <li>
              Lady Bird Johnson Wildflower Center covers thousands of native North American plant species
              with habitat, bloom time, growing conditions, and wildlife value data.
            </li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            About {sourceName}
          </h2>
          {sourceEntry?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {sourceEntry.description}
            </p>
          )}
          <a
            href="https://www.wildflower.org/plants/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            wildflower.org/plants
          </a>
        </div>

      </div>
    </SourceExplorerLayout>
  );
}
