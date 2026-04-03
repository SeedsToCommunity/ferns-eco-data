import { useState } from "react";
import { useGetInatObservations, getGetInatObservationsQueryKey } from "@workspace/api-client-react";
import { Eye, Search, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

export function ObservationsTab() {
  const [taxonIdInput, setTaxonIdInput] = useState("");
  const [placeIdInput, setPlaceIdInput] = useState("");
  const [submittedTaxonId, setSubmittedTaxonId] = useState<number | undefined>(undefined);
  const [submittedPlaceId, setSubmittedPlaceId] = useState<number | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);

  const enabled = submitted;
  const obsParams = { taxon_id: submittedTaxonId, place_id: submittedPlaceId };
  const { data, isLoading, isError, error } = useGetInatObservations(
    obsParams,
    { query: { enabled, queryKey: getGetInatObservationsQueryKey(obsParams) } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const taxId = taxonIdInput.trim() ? Number(taxonIdInput.trim()) : undefined;
    const plId = placeIdInput.trim() ? Number(placeIdInput.trim()) : undefined;
    setSubmittedTaxonId(taxId);
    setSubmittedPlaceId(plId);
    setSubmitted(true);
  }

  function runSearch(taxonId: string, placeId: string) {
    const taxId = taxonId ? Number(taxonId) : undefined;
    const plId = placeId ? Number(placeId) : undefined;
    setTaxonIdInput(taxonId);
    setPlaceIdInput(placeId);
    setSubmittedTaxonId(taxId);
    setSubmittedPlaceId(plId);
    setSubmitted(true);
  }

  const obsData = data?.data as Record<string, unknown> | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Observations</h2>
            <p className="text-xs text-muted-foreground">Build iNaturalist observation URLs by taxon and place ID</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                placeholder="e.g. 2423"
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Build URLs
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          <button
            onClick={() => runSearch("54327", "2423")}
            className="underline text-primary hover:no-underline"
          >
            Red oak (54327) in Washtenaw County (2423)
          </button>
          {" • "}
          <button
            onClick={() => runSearch("57623", "10")}
            className="underline text-primary hover:no-underline"
          >
            Trillium (57623) in Michigan (10)
          </button>
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Failed to build URLs"}</span>
        </div>
      )}

      {data && obsData && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-sm">iNaturalist Observation Links</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Use these URLs to explore observations directly on iNaturalist
              </p>
            </div>

            <div className="p-6 space-y-4">
              {obsData.taxon_id !== null && (
                <ObsLink
                  label="Observations by Species"
                  url={obsData.observations_by_species_url as string}
                  description={`All observations of taxon ID ${obsData.taxon_id}`}
                />
              )}
              {obsData.place_id !== null && (
                <ObsLink
                  label="Observations by Place"
                  url={obsData.observations_by_place_url as string}
                  description={`All observations in place ID ${obsData.place_id}`}
                />
              )}
              {obsData.taxon_id !== null && obsData.place_id !== null && (
                <ObsLink
                  label="Combined Filter"
                  url={data.source_url ?? ""}
                  description={`Taxon ${obsData.taxon_id} in place ${obsData.place_id}`}
                  featured
                />
              )}
              <div className="border-t border-border pt-4">
                <ObsLink
                  label="API Endpoint"
                  url={obsData.api_observations_endpoint as string}
                  description="iNaturalist API v1 observations endpoint"
                  mono
                />
              </div>
            </div>
          </div>

          <RawJsonPanel title="iNat Observations" data={data} />
        </div>
      )}
    </div>
  );
}

function ObsLink({
  label,
  url,
  description,
  featured,
  mono,
}: {
  label: string;
  url: string;
  description: string;
  featured?: boolean;
  mono?: boolean;
}) {
  if (!url) return null;
  return (
    <div className={`rounded-lg p-4 border ${featured ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${featured ? "text-primary" : "text-foreground"}`}>{label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          <p className={`text-xs mt-1 break-all ${mono ? "font-mono text-muted-foreground" : "text-muted-foreground"}`}>
            {url}
          </p>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
