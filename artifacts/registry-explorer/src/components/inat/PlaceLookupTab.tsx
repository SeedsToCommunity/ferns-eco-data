import { useState } from "react";
import { useGetInatPlace, getGetInatPlaceQueryKey } from "@workspace/api-client-react";
import { MapPin, Search, Loader2, AlertCircle, ExternalLink, CheckCircle } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

interface PlaceResult {
  id: number;
  display_name: string;
  place_type: number;
  place_type_name: string;
  inat_url: string;
}

interface PlaceLookupTabProps {
  onPlaceSelected?: (placeId: number, placeName: string) => void;
}

export function PlaceLookupTab({ onPlaceSelected }: PlaceLookupTabProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const enabled = !!query;
  const placeParams = { q: query };
  const { data: response, isLoading, isError, error } = useGetInatPlace(
    placeParams,
    { query: { enabled, queryKey: getGetInatPlaceQueryKey(placeParams) } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSelectedId(null);
    setQuery(searchInput.trim());
  }

  function runSearch(q: string) {
    setSearchInput(q);
    setSelectedId(null);
    setQuery(q);
  }

  function handleSelect(place: PlaceResult) {
    setSelectedId(place.id);
    onPlaceSelected?.(place.id, place.display_name);
  }

  const placeData = response?.data as { query: string; results: PlaceResult[] } | undefined;
  const results = placeData?.results ?? [];

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Place Lookup</h2>
            <p className="text-xs text-muted-foreground">Search for iNaturalist places by name to get their numeric ID</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="e.g. Washtenaw County, Michigan"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!searchInput.trim() || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Lookup
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button onClick={() => runSearch("Washtenaw County")} className="underline text-primary hover:no-underline">Washtenaw County</button>
          {" • "}
          <button onClick={() => runSearch("Michigan")} className="underline text-primary hover:no-underline">Michigan</button>
          {" • "}
          <button onClick={() => runSearch("Sleeping Bear Dunes")} className="underline text-primary hover:no-underline">Sleeping Bear Dunes</button>
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Failed to load place"}</span>
        </div>
      )}

      {response && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-center justify-between gap-4">
            <h3 className="font-semibold text-sm">
              {results.length > 0
                ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${placeData?.query}"`
                : `No results for "${placeData?.query}"`}
            </h3>
            {onPlaceSelected && results.length > 0 && (
              <p className="text-xs text-muted-foreground">Select a place to use in Phenology</p>
            )}
          </div>

          {results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((place) => {
                const isSelected = selectedId === place.id;
                return (
                  <div
                    key={place.id}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      isSelected ? "bg-primary/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{place.display_name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground font-mono">ID: {place.id}</span>
                        {place.place_type_name && (
                          <>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground capitalize">{place.place_type_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {onPlaceSelected && (
                        <button
                          onClick={() => handleSelect(place)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                          } flex items-center gap-1.5`}
                        >
                          {isSelected ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </button>
                      )}
                      <a
                        href={place.inat_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
                        title="View on iNaturalist"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No places found matching your query
            </div>
          )}

          <RawJsonPanel title="iNat Place" data={response} />
        </div>
      )}
    </div>
  );
}
