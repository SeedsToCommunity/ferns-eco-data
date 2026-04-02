import { useState } from "react";
import { Link, useParams } from "wouter";
import { useGetSourcesIndex } from "@workspace/api-client-react";
import {
  ArrowLeft,
  Search,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Code,
  BookOpen,
  ServerCrash,
} from "lucide-react";
import { SourceSummary } from "@/components/SourceSummary";
import { SourceMetadataPanel } from "@/components/SourceMetadataPanel";

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
          Raw JSON response
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

interface FernsResponse {
  found: boolean;
  queried_at?: string;
  data?: Record<string, unknown> | null;
  provenance?: Record<string, unknown>;
}

export default function GenericSourcePage() {
  const { sourceId } = useParams<{ sourceId: string }>();
  const { data: sourcesData, isLoading: sourcesLoading } = useGetSourcesIndex();
  const source = sourcesData?.data?.sources?.find((s) => s.source_id === sourceId);

  const [species, setSpecies] = useState("");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<FernsResponse | null>(null);
  const [rawResult, setRawResult] = useState<unknown>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metadataApiPath = source?.metadata_url
    ? (() => { try { return new URL(source.metadata_url).pathname; } catch { return source.metadata_url; } })()
    : undefined;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = species.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setRawResult(null);
    setQuery(trimmed);
    try {
      const res = await fetch(`/api/${sourceId}?species=${encodeURIComponent(trimmed)}`);
      const json = await res.json();
      setRawResult(json);
      if (res.ok) {
        setResult(json as FernsResponse);
      } else {
        setError((json as { message?: string }).message ?? `HTTP ${res.status}`);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  if (sourcesLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!source) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to registry
          </Link>
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-10 text-center">
            <ServerCrash className="w-10 h-10 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold text-destructive mb-2">Source not found</h2>
            <p className="text-muted-foreground">
              No source with ID <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{sourceId}</code> is registered in FERNS.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const resultUrl =
    result?.data?.url as string | undefined ??
    result?.data?.search_url as string | undefined;
  const isSearchOnly = !result?.data?.url && !!result?.data?.search_url;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to registry
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-2xl font-bold truncate">{source.name}</h1>
              </div>
              {metadataApiPath && (
                <SourceSummary
                  metadataApiPath={metadataApiPath}
                  className="text-sm text-muted-foreground"
                />
              )}
            </div>
            <Link
              href={`/source/${sourceId}/metadata`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border/60 hover:bg-muted/50 transition-colors shrink-0"
            >
              Full Metadata
            </Link>
          </div>
        </div>

        {/* Species Lookup */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            Species Lookup
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
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
              className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div
              className={`rounded-xl border p-4 space-y-3 ${
                result.found
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-muted/30 border-border/40"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.found ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="text-sm font-medium">
                  {result.found
                    ? isSearchOnly
                      ? `Search results for "${query}"`
                      : `Found "${query}"`
                    : `"${query}" not found on ${source.name}`}
                </span>
              </div>

              {resultUrl && (
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline break-all"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {isSearchOnly ? "View search results" : `View on ${source.name}`}
                </a>
              )}

              {isSearchOnly && (
                <p className="text-xs text-muted-foreground">
                  Direct species profile links are not available for this source — a search results page is provided instead.
                </p>
              )}

              {result.provenance?.cache_hit === true && (
                <p className="text-xs text-muted-foreground">Result served from cache.</p>
              )}
            </div>
          )}

          {rawResult && <RawPanel data={rawResult} />}
        </div>

        {/* Full metadata panel */}
        {metadataApiPath && (
          <SourceMetadataPanel metadataApiPath={metadataApiPath} />
        )}
      </div>
    </div>
  );
}
