import { useState, type ReactNode } from "react";
import { useGetGbifMatch, useGetGbifReconcile, getGetGbifMatchQueryKey, getGetGbifReconcileQueryKey, type GbifVernacularRecord, type GbifSynonymRecord, type GbifReconcileData } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Info, ExternalLink, Leaf } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";
import { OccurrencesPanel } from "./OccurrencesPanel";

function ExpandableSection({ title, count, icon, children, defaultOpen = false }: {
  title: string;
  count: number;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card>
      <button
        type="button"
        className="w-full text-left"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              {icon}
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{count}</Badge>
              {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>
        </CardHeader>
      </button>
      {open && (
        <CardContent className="pt-4">
          {children}
        </CardContent>
      )}
    </Card>
  );
}

function ReconcilePanels({ data }: { data: GbifReconcileData }) {
  return (
    <div className="space-y-4">
      {data.vernacular_name_primary && (
        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
          <Leaf className="w-5 h-5 text-primary flex-shrink-0" />
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide leading-none mb-1">Primary Common Name</div>
            <div className="text-base font-semibold">{data.vernacular_name_primary}</div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <ExpandableSection
          title="Common Names"
          count={data.vernacular_name_count}
          icon={<Leaf className="w-5 h-5 text-primary" />}
        >
          {data.vernacular_names.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No common names recorded.</p>
          ) : (
            <ul className="space-y-3">
              {data.vernacular_names.map((vn: GbifVernacularRecord, i: number) => (
                <li key={i} className="flex justify-between items-start border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <span className="font-medium text-sm">{vn.vernacularName}</span>
                  <div className="flex gap-2 ml-2 flex-shrink-0">
                    {vn.language && <Badge variant="outline" className="text-[10px]">{vn.language.toUpperCase()}</Badge>}
                    {vn.country && <Badge variant="outline" className="text-[10px] bg-muted">{vn.country}</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ExpandableSection>

        <ExpandableSection
          title="Synonyms"
          count={data.synonyms.length}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"/><path d="m15 9 6-6"/></svg>
          }
        >
          {data.synonyms.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No synonyms recorded.</p>
          ) : (
            <ul className="space-y-3">
              {data.synonyms.map((syn: GbifSynonymRecord, i: number) => (
                <li key={i} className="text-sm border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <div className="font-medium italic">{syn.canonicalName || syn.scientificName}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>{syn.taxonomicStatus}</span>
                    <span>•</span>
                    <span className="uppercase">{syn.rank}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ExpandableSection>
      </div>
    </div>
  );
}

interface ScientificMatchPanelProps {
  scientificName: string;
}

export function ScientificMatchPanel({ scientificName }: ScientificMatchPanelProps) {
  const matchQuery = useGetGbifMatch({ name: scientificName }, {
    query: { queryKey: getGetGbifMatchQueryKey({ name: scientificName }), enabled: !!scientificName }
  });

  const matchData = matchQuery.data?.data;
  const reconcileKey = matchData?.status === 'SYNONYM' ? matchData.accepted_usage_key : matchData?.usageKey;
  
  const reconcileQuery = useGetGbifReconcile({ usageKey: reconcileKey || 0 }, {
    query: { queryKey: getGetGbifReconcileQueryKey({ usageKey: reconcileKey || 0 }), enabled: !!reconcileKey }
  });

  if (matchQuery.isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Matching taxonomy...</div>;
  }

  if (matchQuery.isError) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center gap-3">
        <AlertTriangle className="w-5 h-5" />
        <div>
          <p className="font-semibold">Error connecting to GBIF</p>
          <p className="text-sm opacity-80">{matchQuery.error?.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  if (!matchQuery.data) return null;

  const isNotFound = !matchQuery.data.found || !matchData || matchData.matchType === "NONE";

  return (
    <div className="space-y-6">
      {isNotFound ? (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-8 text-center flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-warning" />
            <h3 className="text-lg font-bold text-foreground">No Match Found</h3>
            <p className="text-muted-foreground">GBIF backbone taxonomy returned no results for "{scientificName}".</p>
            <Badge variant="outline" className="mt-2">Cache: {matchData?.cache_status || 'miss'}</Badge>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-primary/20 shadow-lg shadow-primary/5">
            <CardHeader className="pb-4 bg-primary/5 rounded-t-2xl border-b border-border/50">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={matchData.matchType === 'EXACT' ? 'success' : 'warning'}>
                      {matchData.matchType} MATCH
                    </Badge>
                    {matchData.confidence && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {matchData.confidence}% Confidence
                      </span>
                    )}
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                      {matchData.cache_status}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl italic text-primary mt-2">
                    {matchData.canonicalName || matchData.scientificName}
                  </CardTitle>
                </div>
                {matchData.source_url && (
                  <a 
                    href={matchData.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-background border border-border hover:bg-muted transition-colors text-muted-foreground"
                    title="View on GBIF"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              
              {matchData.status === 'SYNONYM' && (
                <div className="mb-6 p-4 rounded-xl bg-secondary border border-secondary-foreground/10 flex items-start gap-3">
                  <Info className="w-5 h-5 text-secondary-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-secondary-foreground">This is a synonym.</p>
                    <p className="text-sm text-secondary-foreground/80 mt-1">
                      The currently accepted name is <span className="italic font-medium">{matchData.accepted_canonical_name}</span>. 
                      Subsequent data below is retrieved for the accepted taxon.
                    </p>
                  </div>
                </div>
              )}

              {matchData.status === 'DOUBTFUL' && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive">Doubtful Taxonomic Status</p>
                    <p className="text-sm text-destructive/80 mt-1">
                      This name exists in the backbone but its taxonomic standing is uncertain. Proceed with caution.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Rank</p>
                  <p className="font-medium text-foreground capitalize">{matchData.rank || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    {matchData.status === 'ACCEPTED' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    <span className="font-medium text-foreground capitalize">{matchData.status?.toLowerCase() || '-'}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Usage Key</p>
                  <p className="font-mono text-sm text-foreground bg-muted px-2 py-1 rounded inline-block">{matchData.usageKey}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Classification hierarchy</p>
                <div className="flex flex-wrap gap-2 text-sm">
                  {['kingdom', 'phylum', 'class', 'order', 'family', 'genus'].map((rank, i) => {
                    const val = matchData[rank as keyof typeof matchData];
                    if (!val) return null;
                    return (
                      <div key={rank} className="flex items-center gap-2">
                        {i > 0 && <span className="text-muted-foreground/40">›</span>}
                        <span className="px-2 py-1 rounded bg-muted/50 border border-border/50 text-foreground font-medium">
                          {String(val)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Reconcile Section */}
          {reconcileQuery.isLoading ? (
            <div className="h-32 rounded-2xl bg-muted animate-pulse" />
          ) : reconcileQuery.data?.data ? (
            <ReconcilePanels data={reconcileQuery.data.data} />
          ) : null}

          {reconcileKey && <OccurrencesPanel usageKey={reconcileKey} />}

          <RawJsonPanel title="Match Response" data={matchQuery.data} />
          {reconcileQuery.data && <RawJsonPanel title="Reconcile Response" data={reconcileQuery.data} />}
        </>
      )}
    </div>
  );
}
