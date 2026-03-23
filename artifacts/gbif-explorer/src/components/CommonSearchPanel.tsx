import { useGetGbifSearch } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search, ChevronRight, AlertCircle } from "lucide-react";
import { RawJsonPanel } from "./RawJsonPanel";

interface CommonSearchPanelProps {
  query: string;
  onSelectCanonical: (name: string) => void;
}

export function CommonSearchPanel({ query, onSelectCanonical }: CommonSearchPanelProps) {
  const searchQuery = useGetGbifSearch({ q: query }, {
    query: { enabled: !!query, retry: false }
  });

  if (searchQuery.isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Searching GBIF vernacular names...</div>;
  }

  if (searchQuery.isError) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center gap-3">
        <AlertCircle className="w-5 h-5" />
        <div>
          <p className="font-semibold">Search Failed</p>
          <p className="text-sm opacity-80">{searchQuery.error?.message || "Unknown error"}</p>
        </div>
      </div>
    );
  }

  if (!searchQuery.data) return null;

  const results = searchQuery.data.data?.candidates || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          {results.length} results for "{query}"
        </h3>
      </div>

      {results.length === 0 ? (
        <Card className="border-border/50 bg-muted/20">
          <CardContent className="p-8 text-center text-muted-foreground">
            No matching common names found in the Plantae kingdom. Try a different variation.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {results.map((candidate, i) => (
            <Card key={`${candidate.usageKey}-${i}`} className="overflow-hidden hover:border-primary/40 transition-colors group">
              <CardContent className="p-0 flex flex-col sm:flex-row">
                <div className="flex-1 p-5 flex flex-col justify-center">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="text-xl font-bold text-foreground">
                      {candidate.vernacularName || "Unnamed"}
                    </h4>
                    <Badge variant={candidate.status === 'ACCEPTED' ? 'success' : 'secondary'} className="shrink-0 text-[10px]">
                      {candidate.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Canonical:</span>
                    <span className="italic font-medium text-primary">{candidate.canonicalName}</span>
                  </div>
                  
                  {candidate.family && (
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Family:</span>
                      <span>{candidate.family}</span>
                    </div>
                  )}
                </div>
                
                <div className="bg-muted/30 border-t sm:border-t-0 sm:border-l border-border/50 p-5 flex items-center justify-end sm:w-48 shrink-0">
                  <Button 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-md transition-all" 
                    variant="outline"
                    onClick={() => onSelectCanonical(candidate.canonicalName)}
                  >
                    Look Up
                    <ChevronRight className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <RawJsonPanel title="Vernacular Search Response" data={searchQuery.data} />
    </div>
  );
}
