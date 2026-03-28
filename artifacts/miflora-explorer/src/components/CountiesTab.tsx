import { useState } from "react";
import { useGetMifloraCounties } from "@workspace/api-client-react";
import { MapPin, Search, Loader2, AlertCircle } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

interface CountiesTabProps {
  initialPlantId?: number;
  initialPlantName?: string;
}

export function CountiesTab({ initialPlantId, initialPlantName }: CountiesTabProps) {
  const [plantIdInput, setPlantIdInput] = useState(initialPlantId ? String(initialPlantId) : "");
  const [query, setQuery] = useState<number | null>(initialPlantId ?? null);

  const enabled = query !== null && query > 0;
  const { data: response, isLoading, isError, error } = useGetMifloraCounties(
    { plant_id: query! },
    { query: { enabled } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = parseInt(plantIdInput.trim(), 10);
    if (!isNaN(id) && id > 0) setQuery(id);
  }

  const countyData = response?.data as Record<string, unknown> | null | undefined;
  const locations = Array.isArray(countyData?.locations) ? (countyData!.locations as string[]) : [];
  const cacheStatus = response?.cache_status as string | null | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">County Occurrence Records</h2>
            <p className="text-xs text-muted-foreground">Michigan county presence for a species (by plant_id)</p>
          </div>
        </div>

        {initialPlantName && query === initialPlantId && (
          <div className="mb-3 text-sm text-muted-foreground">
            Showing county data for:{" "}
            <span className="font-medium text-foreground italic">{initialPlantName}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            value={plantIdInput}
            onChange={(e) => setPlantIdInput(e.target.value)}
            placeholder="e.g. 163 (Asclepias tuberosa)"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            min="1"
          />
          <button
            type="submit"
            disabled={!plantIdInput.trim() || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Look Up
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-2">
          Use the plant_id from the Species tab. Try:{" "}
          {[
            { id: 163, name: "Asclepias tuberosa" },
            { id: 1024, name: "Quercus rubra" },
            { id: 1437, name: "Trillium grandiflorum" },
          ].map((item, i) => (
            <span key={item.id}>
              {i > 0 && " • "}
              <button
                onClick={() => { setPlantIdInput(String(item.id)); setQuery(item.id); }}
                className="underline text-primary hover:no-underline"
              >
                {item.id} ({item.name})
              </button>
            </span>
          ))}
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Lookup failed"}</span>
        </div>
      )}

      {response && !response.found && (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border text-muted-foreground text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>No county records found for plant_id {query}</span>
        </div>
      )}

      {response && response.found && locations.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground">
                {locations.length} {locations.length === 1 ? "county" : "counties"} with confirmed occurrence
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                plant_id: {query}
                {response.source_url && (
                  <>
                    {" "}·{" "}
                    <a href={response.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      View on Michigan Flora
                    </a>
                  </>
                )}
              </p>
            </div>
            {cacheStatus && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                cacheStatus === "hit" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {cacheStatus === "hit" ? "Cached" : "Fresh"}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {locations.sort().map((county) => (
              <span
                key={county}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
              >
                <MapPin className="w-3 h-3" />
                {county}
              </span>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Michigan has 83 counties.{" "}
            <span className="font-medium">
              {locations.length} of 83
            </span>{" "}
            ({Math.round((locations.length / 83) * 100)}%) show confirmed presence for this taxon.
          </p>
        </div>
      )}

      {response && (
        <RawJsonPanel title="Michigan Flora Counties Response" data={response} />
      )}
    </div>
  );
}
