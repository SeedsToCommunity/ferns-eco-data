import { useState } from "react";
import { Link } from "wouter";
import { useGetSourcesIndex, getGetSourcesIndexQueryKey } from "@workspace/api-client-react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FileJson,
  ExternalLink,
  Loader2,
  AlertTriangle,
} from "lucide-react";

function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-muted/30 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-5 py-4 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider w-44 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-foreground/80 flex-1 leading-relaxed">{value}</span>
    </div>
  );
}

interface SourceExplorerLayoutProps {
  sourceId: string;
  children: React.ReactNode;
}

export function SourceExplorerLayout({ sourceId, children }: SourceExplorerLayoutProps) {
  const { data: sourcesData, isLoading } = useGetSourcesIndex({
    query: { queryKey: getGetSourcesIndexQueryKey() },
  });
  const source = sourcesData?.data?.sources?.find((s) => s.source_id === sourceId);

  const metadataUrl = source?.metadata_url ?? null;
  const apiEndpointBase = metadataUrl ? metadataUrl.replace(/\/metadata$/, "") : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Section 1: Header — consistent across all source pages */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 h-14">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Sources</span>
            </Link>
            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              {source?.knowledge_type && (
                <span className="hidden md:inline text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 uppercase tracking-wide whitespace-nowrap">
                  {source.knowledge_type.replace(/_/g, " ")}
                </span>
              )}
              {source?.source_id && (
                <span className="hidden md:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border whitespace-nowrap">
                  {source.source_id}
                </span>
              )}
              {metadataUrl && (
                <a
                  href={metadataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1 bg-muted/50 hover:bg-muted whitespace-nowrap"
                >
                  <FileJson className="w-3 h-3" />
                  <span className="hidden sm:inline">API Metadata</span>
                </a>
              )}
              <a
                href="/api/openapi.json"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1 bg-muted/50 hover:bg-muted whitespace-nowrap"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="hidden sm:inline">OpenAPI</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading source…
        </div>
      )}

      {!isLoading && source && (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">
          {/* Permission warning banner */}
          {source.permission_granted === false && source.permission_status && (
            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-amber-50 border-amber-200 text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <span className="font-semibold">Permission required — </span>
                {source.permission_status}
              </div>
            </div>
          )}

          {/* Section 1b: Source name */}
          <div className="pt-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {source.name}
            </h1>
          </div>

          {/* Section 2: Description */}
          <div>
            <p className="text-xl text-foreground leading-relaxed max-w-3xl">
              {source.description}
            </p>
          </div>

          {/* Section 3: What you send / What you get */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                What you send
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{source.input_summary}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                What you get
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{source.output_summary}</p>
            </div>
          </div>

          {/* Section 4: Source details */}
          <CollapsibleSection title="Source Details" defaultOpen>
            <div>
              {source.update_frequency && (
                <MetaRow label="Update Frequency" value={source.update_frequency} />
              )}
              {source.known_limitations && (
                <MetaRow label="Known Limitations" value={source.known_limitations} />
              )}
              {source.status && (
                <MetaRow label="Status" value={source.status} />
              )}
              {source.permission_status && (
                <MetaRow label="Permission" value={source.permission_status} />
              )}
              {source.dependencies && source.dependencies.length > 0 && (
                <MetaRow label="Dependencies" value={source.dependencies.join(", ")} />
              )}
            </div>
          </CollapsibleSection>

          {/* Section 5: General Summary */}
          {source.general_summary && (
            <CollapsibleSection title="General Summary" defaultOpen>
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {source.general_summary}
              </p>
            </CollapsibleSection>
          )}

          {/* Section 6: Technical Details */}
          {source.technical_details && (
            <CollapsibleSection title="Technical Details">
              <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {source.technical_details}
              </p>
            </CollapsibleSection>
          )}

          {/* Section 7: API Reference */}
          <CollapsibleSection title="API Reference">
            <div className="space-y-4">
              {apiEndpointBase && (
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Endpoints
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-mono text-xs bg-muted px-3 py-2 rounded-lg">
                      <span className="text-primary font-semibold shrink-0">GET</span>
                      <a
                        href={apiEndpointBase}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors truncate"
                      >
                        {apiEndpointBase}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs bg-muted px-3 py-2 rounded-lg">
                      <span className="text-primary font-semibold shrink-0">GET</span>
                      <a
                        href={metadataUrl ?? undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors truncate"
                      >
                        {metadataUrl}
                      </a>
                    </div>
                  </div>
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Specification
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="/api/openapi.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs border border-border rounded-md px-3 py-1.5 bg-muted/50 hover:bg-muted hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    OpenAPI JSON
                  </a>
                  <a
                    href="/api/openapi.yaml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs border border-border rounded-md px-3 py-1.5 bg-muted/50 hover:bg-muted hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    OpenAPI YAML
                  </a>
                  <a
                    href="/api/v1/sources"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs border border-border rounded-md px-3 py-1.5 bg-muted/50 hover:bg-muted hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Sources Registry
                  </a>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Section 8: Source-specific explorer */}
          <div>
            <div className="flex items-baseline gap-3 border-t border-border pt-6 mb-5">
              <h2 className="text-lg font-bold text-foreground">Try It</h2>
              <p className="text-sm text-muted-foreground">
                Live queries through the {source.name} data source.
              </p>
            </div>
            {children}
          </div>
        </main>
      )}

      {!isLoading && !source && (
        <div className="max-w-5xl mx-auto px-4 py-24 text-center text-muted-foreground">
          <p>
            Source{" "}
            <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{sourceId}</code>{" "}
            not found in registry.
          </p>
        </div>
      )}
    </div>
  );
}

export default SourceExplorerLayout;
