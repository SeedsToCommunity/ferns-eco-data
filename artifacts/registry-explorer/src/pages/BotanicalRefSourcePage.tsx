import { useState } from "react";
import { useLocation } from "wouter";
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
  Info,
  RefreshCw,
  Clock,
  Database,
} from "lucide-react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

// These sources have a /species-text endpoint that scrapes and caches full
// page text. All others use the base /{sourceId}?species= lookup.
const SPECIES_TEXT_SOURCES = new Set([
  "gobotany",
  "illinois-wildflowers",
  "minnesota-wildflowers",
  "missouri-plants",
  "prairie-moon",
]);

// ── Response type interfaces ──────────────────────────────────────────────────

interface StandardResult {
  species: string;
  url: string;
  validation_method: string;
  http_status?: number;
  cache_hit?: boolean;
}

interface SearchOnlyResult {
  species: string;
  url: null;
  search_url: string;
  validation_method: string;
  note?: string;
}

interface SectionResult {
  url: string;
  section: string;
  imported_at: string;
}

interface MultiSectionResult {
  species: string;
  result_count: number;
  results: SectionResult[];
  validation_method: string;
}

interface SpeciesTextData {
  species: string;
  url: string;
  sections: Record<string, string> | null;
  full_text: string | null;
}

interface FernsResponse {
  found: boolean;
  queried_at?: string;
  data?: StandardResult | SearchOnlyResult | MultiSectionResult | null;
  provenance?: Record<string, unknown>;
}

interface SpeciesTextResponse {
  found: boolean;
  cache_status: "hit" | "miss" | "not_in_species_list";
  scraped_at?: string;
  fetch_error?: string;
  queried_at?: string;
  data?: SpeciesTextData | null;
  provenance?: Record<string, unknown>;
}

// ── Shared sub-components ─────────────────────────────────────────────────────

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

// ── Result display for base-endpoint sources ──────────────────────────────────

function ResultDisplay({
  sourceId,
  sourceName,
  result,
}: {
  sourceId: string;
  sourceName: string;
  result: FernsResponse;
}) {
  const data = result.data;

  // Multi-section result (Illinois Wildflowers base endpoint)
  if (data && "results" in data && Array.isArray(data.results)) {
    const multiData = data as MultiSectionResult;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium">
            Found <span className="italic">{multiData.species}</span> in {multiData.result_count} habitat section{multiData.result_count !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-2">
          {multiData.results.map((r, i) => (
            <div key={i} className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-muted/40 border border-border/40">
              <span className="text-xs font-medium capitalize text-muted-foreground">{r.section}</span>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                View on {sourceName}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Search-only result (USDA Plants, Lady Bird Johnson)
  if (data && "search_url" in data && data.search_url) {
    const searchData = data as SearchOnlyResult;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <span className="text-sm font-medium">
            Direct profile URL not available for <span className="italic">{searchData.species}</span>
          </span>
        </div>
        {searchData.note && (
          <p className="text-xs text-muted-foreground leading-relaxed">{searchData.note}</p>
        )}
        <a
          href={searchData.search_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Search {sourceName} for this species
        </a>
      </div>
    );
  }

  // Standard found result
  if (result.found && data && "url" in data && data.url) {
    const stdData = data as StandardResult;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium">
            Found <span className="italic">{stdData.species}</span> on {sourceName}
          </span>
        </div>
        <a
          href={stdData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
        >
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
          {stdData.url}
        </a>
        {result.provenance && "cache_hit" in result.provenance && result.provenance.cache_hit === true && (
          <p className="text-xs text-muted-foreground">Result served from cache.</p>
        )}
      </div>
    );
  }

  // Not found
  const speciesName = data && "species" in data ? (data as StandardResult).species : "Species";
  return (
    <div className="flex items-center gap-2">
      <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground">
        <span className="italic">{speciesName}</span> was not found on {sourceName}.
      </span>
    </div>
  );
}

// ── Result display for species-text sources ───────────────────────────────────

function CacheStatusBadge({ status }: { status: SpeciesTextResponse["cache_status"] }) {
  if (status === "hit") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
        <Database className="w-2.5 h-2.5" />
        cached
      </span>
    );
  }
  if (status === "miss") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
        <RefreshCw className="w-2.5 h-2.5" />
        live scrape
      </span>
    );
  }
  return null;
}

function SpeciesTextDisplay({
  sourceName,
  result,
}: {
  sourceName: string;
  result: SpeciesTextResponse;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  function toggleSection(key: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Not in species list
  if (result.cache_status === "not_in_species_list") {
    return (
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">
          Species not found in the imported species list for {sourceName}. No page was scraped.
        </span>
      </div>
    );
  }

  // Fetch error (transient — not cached)
  if (result.fetch_error) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <XCircle className="w-4 h-4 text-destructive shrink-0" />
          <span className="text-sm font-medium text-destructive">Upstream fetch failed</span>
        </div>
        <p className="text-xs text-muted-foreground">{result.fetch_error}</p>
        <p className="text-xs text-muted-foreground">This result was not cached — retrying will attempt a fresh scrape.</p>
      </div>
    );
  }

  // Not found (404 on the source site)
  if (!result.found) {
    return (
      <div className="flex items-center gap-2">
        <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-muted-foreground">
          Species page not found on {sourceName}.
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
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span className="text-sm font-medium">
            Found <span className="italic">{data.species}</span> on {sourceName}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <CacheStatusBadge status={result.cache_status} />
          {scrapedAt && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-2.5 h-2.5" />
              scraped {scrapedAt}
            </span>
          )}
        </div>
      </div>

      {/* Link to source page */}
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
      >
        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        {data.url}
      </a>

      {/* Named sections */}
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

      {/* Fallback: no sections, show full_text */}
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
    </div>
  );
}

// ── Page component ────────────────────────────────────────────────────────────

export default function BotanicalRefSourcePage() {
  const [location] = useLocation();
  const sourceId = location.split("/source/")[1]?.split("/")[0] ?? "";
  const { data: sourcesData } = useGetSourcesIndex({
    query: { queryKey: getGetSourcesIndexQueryKey() },
  });
  const sourceEntry = sourcesData?.data?.sources?.find((s) => s.source_id === sourceId);
  const sourceName = sourceEntry?.name ?? sourceId;

  const hasSpeciesText = SPECIES_TEXT_SOURCES.has(sourceId);

  const [species, setSpecies] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [result, setResult] = useState<FernsResponse | SpeciesTextResponse | null>(null);
  const [rawResult, setRawResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = species.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResult(null);
    try {
      const endpoint = hasSpeciesText
        ? `${API_BASE}/${sourceId}/species-text?species=${encodeURIComponent(trimmed)}${refresh ? "&refresh=true" : ""}`
        : `${API_BASE}/${sourceId}?species=${encodeURIComponent(trimmed)}`;
      const res = await fetch(endpoint);
      const json = await res.json();
      setRawResult(json);
      if (res.ok) {
        setResult(json as FernsResponse | SpeciesTextResponse);
      } else {
        setError((json as { message?: string }).message ?? `HTTP ${res.status}`);
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  const isSpeciesTextResult = (r: FernsResponse | SpeciesTextResponse): r is SpeciesTextResponse =>
    "cache_status" in r;

  const resultBg =
    result === null
      ? ""
      : result.found
      ? "bg-green-500/5 border-green-500/20"
      : !hasSpeciesText && result.data && "search_url" in (result.data as object)
      ? "bg-amber-500/5 border-amber-500/20"
      : hasSpeciesText && isSpeciesTextResult(result) && result.cache_status === "not_in_species_list"
      ? "bg-muted/30 border-border/40"
      : "bg-muted/30 border-border/40";

  return (
    <SourceExplorerLayout sourceId={sourceId}>
      <div className="space-y-8">

        {/* Species Lookup */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            Species Lookup
            {hasSpeciesText && (
              <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                <BookOpen className="w-2.5 h-2.5" />
                with page text
              </span>
            )}
          </h2>

          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
                placeholder="e.g. Asclepias tuberosa"
                className="flex-1 px-3 py-2 text-sm bg-muted/40 border border-border/60 rounded-lg focus:outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground/50"
              />
              <button
                type="submit"
                disabled={loading || !species.trim()}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {loading ? "Searching…" : "Search"}
              </button>
            </div>

            {hasSpeciesText && (
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

          {result && !loading && (
            <div className={`rounded-xl border p-4 ${resultBg}`}>
              {hasSpeciesText && isSpeciesTextResult(result) ? (
                <SpeciesTextDisplay sourceName={sourceName} result={result} />
              ) : (
                <ResultDisplay
                  sourceId={sourceId}
                  sourceName={sourceName}
                  result={result as FernsResponse}
                />
              )}
            </div>
          )}

          {!!rawResult && !loading && <RawPanel data={rawResult} />}
        </div>

      </div>
    </SourceExplorerLayout>
  );
}
