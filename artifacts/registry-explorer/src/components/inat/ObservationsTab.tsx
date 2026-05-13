import { useState } from "react";
import {
  useGetInatObservationSummary,
  getGetInatObservationSummaryQueryKey,
  type GetInatObservationSummaryParams,
} from "@workspace/api-client-react";
import { Eye, Search, Loader2, AlertCircle, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

const QUALITY_GRADES = [
  { value: "", label: "Any" },
  { value: "research", label: "Research grade" },
  { value: "needs_id", label: "Needs ID" },
  { value: "casual", label: "Casual" },
];

const QUALITY_COLORS: Record<string, string> = {
  research: "bg-green-100 text-green-800 border-green-200",
  needs_id: "bg-yellow-100 text-yellow-800 border-yellow-200",
  casual:   "bg-gray-100 text-gray-600 border-gray-200",
};

export function ObservationsTab() {
  const [taxonIdInput, setTaxonIdInput]     = useState("");
  const [placeIdInput, setPlaceIdInput]     = useState("");
  const [qualityGrade, setQualityGrade]     = useState("");
  const [page, setPage]                     = useState(1);

  const [submitted, setSubmitted]           = useState(false);
  const [committedTaxonId, setCommittedTaxonId] = useState<number | undefined>(undefined);
  const [committedPlaceId, setCommittedPlaceId] = useState<number | undefined>(undefined);
  const [committedQuality, setCommittedQuality] = useState<string | undefined>(undefined);
  const [committedPage, setCommittedPage]   = useState(1);

  const params: GetInatObservationSummaryParams = {
    taxon_id:      committedTaxonId,
    place_id:      committedPlaceId,
    quality_grade: (committedQuality || undefined) as GetInatObservationSummaryParams["quality_grade"],
    per_page:      30,
    page:          committedPage,
  };

  const { data, isLoading, isError, error } = useGetInatObservationSummary(
    params,
    { query: { enabled: submitted, queryKey: getGetInatObservationSummaryQueryKey(params) } },
  );

  function commit(taxId: number | undefined, plId: number | undefined, quality: string, pg: number) {
    setCommittedTaxonId(taxId);
    setCommittedPlaceId(plId);
    setCommittedQuality(quality || undefined);
    setCommittedPage(pg);
    setSubmitted(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const taxId = taxonIdInput.trim() ? Number(taxonIdInput.trim()) : undefined;
    const plId  = placeIdInput.trim()  ? Number(placeIdInput.trim())  : undefined;
    setPage(1);
    commit(taxId, plId, qualityGrade, 1);
  }

  function runExample(taxon: string, place: string) {
    setTaxonIdInput(taxon);
    setPlaceIdInput(place);
    setQualityGrade("research");
    setPage(1);
    const taxId = taxon ? Number(taxon) : undefined;
    const plId  = place ? Number(place) : undefined;
    commit(taxId, plId, "research", 1);
  }

  function goToPage(pg: number) {
    setPage(pg);
    commit(committedTaxonId, committedPlaceId, committedQuality ?? "", pg);
  }

  const obsData  = data?.data;
  const results  = obsData?.results ?? [];
  const total    = obsData?.total_results ?? 0;
  const totalPgs = obsData?.total_pages ?? 0;

  return (
    <div className="space-y-6">
      {/* Query form */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Observation Summary</h2>
            <p className="text-xs text-muted-foreground">
              Live paged records from iNaturalist — curated field subset, no cache.
              Follow any observation link for the full record.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Taxon ID</label>
              <input
                type="number"
                value={taxonIdInput}
                onChange={(e) => setTaxonIdInput(e.target.value)}
                placeholder="e.g. 54327"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Place ID (optional)</label>
              <input
                type="number"
                value={placeIdInput}
                onChange={(e) => setPlaceIdInput(e.target.value)}
                placeholder="e.g. 10"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Quality grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {QUALITY_GRADES.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Fetch observations
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-3">
          Try:{" "}
          <button onClick={() => runExample("54327", "10")} className="underline text-primary hover:no-underline">
            Red oak (54327) in Michigan (10)
          </button>
          {" · "}
          <button onClick={() => runExample("47219", "24")} className="underline text-primary hover:no-underline">
            Trillium grandiflorum (47219) in Washtenaw Co (24)
          </button>
        </p>
      </div>

      {/* Error */}
      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Failed to fetch observations"}</span>
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Results */}
      {!isLoading && data && obsData && (
        <div className="space-y-4">
          {/* Pagination header */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {total.toLocaleString()} total observations · showing page {committedPage} of {totalPgs}
              {total > 10000 && (
                <span className="ml-1 text-xs">(iNat caps at 10,000 accessible)</span>
              )}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(committedPage - 1)}
                disabled={committedPage <= 1 || isLoading}
                className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs px-2 text-muted-foreground">{committedPage} / {totalPgs}</span>
              <button
                onClick={() => goToPage(committedPage + 1)}
                disabled={committedPage >= totalPgs || isLoading}
                className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cards */}
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">No observations found.</div>
          ) : (
            <div className="space-y-2">
              {results.map((obs) => (
                <ObservationCard key={obs.id} obs={obs} />
              ))}
            </div>
          )}

          {/* Bottom pagination */}
          {totalPgs > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => goToPage(committedPage - 1)}
                disabled={committedPage <= 1 || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <span className="text-xs text-muted-foreground">Page {committedPage} of {totalPgs}</span>
              <button
                onClick={() => goToPage(committedPage + 1)}
                disabled={committedPage >= totalPgs || isLoading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <RawJsonPanel title="Raw API — /api/inat/observation-summary" data={data} />
        </div>
      )}
    </div>
  );
}

type ObsRecord = {
  id: number;
  uri: string;
  observed_on?: string | null;
  quality_grade?: string | null;
  taxon_name?: string | null;
  common_name?: string | null;
  place_guess?: string | null;
  location?: string | null;
  observer?: string | null;
  photo_url?: string | null;
  photo_attribution?: string | null;
};

function ObservationCard({ obs }: { obs: ObsRecord }) {
  const qgClass = obs.quality_grade ? (QUALITY_COLORS[obs.quality_grade] ?? "bg-muted text-muted-foreground border-border") : "";

  return (
    <div className="flex gap-3 bg-card border border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
      {/* Photo */}
      <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border">
        {obs.photo_url ? (
          <img
            src={obs.photo_url}
            alt={obs.taxon_name ?? "observation"}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Eye className="w-5 h-5 text-muted-foreground/40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate italic">
              {obs.taxon_name ?? "Unknown taxon"}
            </p>
            {obs.common_name && (
              <p className="text-xs text-muted-foreground not-italic truncate">{obs.common_name}</p>
            )}
          </div>
          <a
            href={obs.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
            title="View full record on iNaturalist"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
          {obs.observed_on && <span>{obs.observed_on}</span>}
          {obs.observer    && <span>by {obs.observer}</span>}
          {obs.place_guess && <span className="truncate max-w-[180px]">{obs.place_guess}</span>}
        </div>

        {obs.quality_grade && (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${qgClass}`}>
            {obs.quality_grade.replace("_", " ")}
          </span>
        )}

        {obs.photo_attribution && (
          <p className="text-[10px] text-muted-foreground/60 truncate">{obs.photo_attribution}</p>
        )}
      </div>
    </div>
  );
}
