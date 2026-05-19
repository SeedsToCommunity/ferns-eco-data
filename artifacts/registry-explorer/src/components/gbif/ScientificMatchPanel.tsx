import { useState, type ReactNode } from "react";
import {
  useGetGbifMatch,
  getGetGbifMatchQueryKey,
  useGetGbifSpeciesSynonyms,
  getGetGbifSpeciesSynonymsQueryKey,
  useGetGbifSpeciesVernacularNames,
  getGetGbifSpeciesVernacularNamesQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, ChevronDown, ChevronRight, Info, ExternalLink, BookOpen, Languages } from "lucide-react";
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

interface ScientificMatchPanelProps {
  scientificName: string;
}

export function ScientificMatchPanel({ scientificName }: ScientificMatchPanelProps) {
  const matchQuery = useGetGbifMatch({ name: scientificName }, {
    query: { queryKey: getGetGbifMatchQueryKey({ name: scientificName }), enabled: !!scientificName }
  });

  const matchData = matchQuery.data?.data;
  const matchSourceUrl = matchQuery.data?.source_url;
  const reconcileKey = matchData?.status === 'SYNONYM' ? (matchData.acceptedUsageKey as number | undefined) : matchData?.usageKey;

  const synonymsQuery = useGetGbifSpeciesSynonyms(
    reconcileKey ?? 0,
    undefined,
    { query: { queryKey: getGetGbifSpeciesSynonymsQueryKey(reconcileKey ?? 0), enabled: !!reconcileKey } }
  );

  const vernacularQuery = useGetGbifSpeciesVernacularNames(
    reconcileKey ?? 0,
    undefined,
    { query: { queryKey: getGetGbifSpeciesVernacularNamesQueryKey(reconcileKey ?? 0), enabled: !!reconcileKey } }
  );

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

  const synonyms = synonymsQuery.data?.data?.results ?? [];
  const synonymCount = synonymsQuery.data?.data?.count ?? 0;
  const vernacularNames = vernacularQuery.data?.data?.results ?? [];
  const vernacularCount = vernacularQuery.data?.data?.count ?? 0;
  const enNames = vernacularNames.filter(v => v.language === "eng" || v.language === "en");

  return (
    <div className="space-y-6">
      {isNotFound ? (
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-8 text-center flex flex-col items-center gap-3">
            <Info className="w-8 h-8 text-warning" />
            <h3 className="text-lg font-bold text-foreground">No Match Found</h3>
            <p className="text-muted-foreground">GBIF backbone taxonomy returned no results for "{scientificName}".</p>
            <Badge variant="outline" className="mt-2">GBIF</Badge>
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
                  </div>
                  <CardTitle className="text-3xl italic text-primary mt-2">
                    {matchData.canonicalName || matchData.scientificName}
                  </CardTitle>
                </div>
                {matchSourceUrl && (
                  <a 
                    href={matchSourceUrl} 
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
                      Occurrence and synonym data below is retrieved for the accepted taxon.
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

              {reconcileKey && !vernacularQuery.isLoading && enNames.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Common Names (English)</p>
                  <div className="flex flex-wrap gap-2">
                    {enNames.slice(0, 8).map((v, i) => (
                      <Badge key={i} variant="outline" className="text-sm font-medium">
                        {v.vernacularName}
                      </Badge>
                    ))}
                    {enNames.length > 8 && (
                      <Badge variant="secondary" className="text-sm">+{enNames.length - 8} more</Badge>
                    )}
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {reconcileKey && <OccurrencesPanel usageKey={reconcileKey} />}

          {reconcileKey && (
            <ExpandableSection
              title="Synonyms"
              count={synonymsQuery.isLoading ? 0 : synonymCount}
              icon={<BookOpen className="w-5 h-5 text-primary/70" />}
              defaultOpen={false}
            >
              {synonymsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading synonyms…</p>
              ) : synonymsQuery.isError ? (
                <p className="text-sm text-destructive">Failed to load synonyms.</p>
              ) : synonyms.length === 0 ? (
                <p className="text-sm text-muted-foreground">No synonyms found in the GBIF backbone for this taxon.</p>
              ) : (
                <div className="space-y-2">
                  {synonyms.map((syn, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                      <div>
                        <span className="italic text-foreground font-medium">{syn.canonicalName || syn.scientificName}</span>
                        {syn.publishedIn && (
                          <span className="ml-2 text-xs text-muted-foreground">{syn.publishedIn}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">{syn.rank?.toLowerCase()}</Badge>
                        <Badge variant="secondary" className="text-xs">{syn.taxonomicStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ExpandableSection>
          )}

          {reconcileKey && (
            <ExpandableSection
              title="All Vernacular Names"
              count={vernacularQuery.isLoading ? 0 : vernacularCount}
              icon={<Languages className="w-5 h-5 text-primary/70" />}
              defaultOpen={false}
            >
              {vernacularQuery.isLoading ? (
                <p className="text-sm text-muted-foreground animate-pulse">Loading vernacular names…</p>
              ) : vernacularQuery.isError ? (
                <p className="text-sm text-destructive">Failed to load vernacular names.</p>
              ) : vernacularNames.length === 0 ? (
                <p className="text-sm text-muted-foreground">No vernacular names found in the GBIF backbone for this taxon.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {vernacularNames.map((v, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/40">
                      <span className="text-sm text-foreground font-medium">{v.vernacularName}</span>
                      <div className="flex items-center gap-1">
                        {v.language && <Badge variant="outline" className="text-xs uppercase">{v.language}</Badge>}
                        {v.country && <Badge variant="outline" className="text-xs uppercase">{v.country}</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ExpandableSection>
          )}

          <RawJsonPanel title="Match Response" data={matchQuery.data} />
        </>
      )}
    </div>
  );
}
