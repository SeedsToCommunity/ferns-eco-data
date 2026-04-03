import { useState } from "react";
import { useGetInatSpecies, getGetInatSpeciesQueryKey } from "@workspace/api-client-react";
import { Leaf, Search, Loader2, AlertCircle, ExternalLink, AlertTriangle } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

interface InatConservationStatus {
  status_name?: string;
}

interface InatDefaultPhoto {
  medium_url?: string;
}

interface InatTaxon {
  id: number;
  name: string;
  preferred_common_name?: string | null;
  default_photo?: InatDefaultPhoto | null;
  observations_count?: number | null;
  conservation_status?: InatConservationStatus | string | null;
  wikipedia_url?: string | null;
  wikipedia_summary?: string | null;
}

interface SpeciesTabProps {
  onTaxonIdSelected?: (taxonId: number, taxonName: string) => void;
}

export function SpeciesTab({ onTaxonIdSelected }: SpeciesTabProps) {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;
  const speciesParams = { name: query };
  const { data: response, isLoading, isError, error } = useGetInatSpecies(
    speciesParams,
    { query: { enabled, queryKey: getGetInatSpeciesQueryKey(speciesParams) } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(nameInput.trim());
  }

  function runSearch(name: string) {
    setNameInput(name);
    setQuery(name);
  }

  const species = response?.data as InatTaxon | null | undefined;

  const inatTaxonId = species?.id ?? null;
  const inatName = species?.name ?? null;
  const defaultPhotoUrl = species?.default_photo?.medium_url ?? null;
  const isFallback = !!inatName && !!query && inatName.toLowerCase() !== query.toLowerCase();
  const cacheStatus = response?.cache_status;

  const conservationLabel = (() => {
    if (!species?.conservation_status) return null;
    if (typeof species.conservation_status === "string") return species.conservation_status;
    return species.conservation_status.status_name ?? null;
  })();

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Species Appearance</h2>
            <p className="text-xs text-muted-foreground">Photo, Wikipedia summary, and taxon metadata from iNaturalist</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Quercus rubra, Trillium grandiflorum"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={!nameInput.trim() || isLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-2">
          Try:{" "}
          {["Quercus rubra", "Trillium grandiflorum", "Asclepias tuberosa"].map((name, i) => (
            <span key={name}>
              {i > 0 && " • "}
              <button
                onClick={() => runSearch(name)}
                className="underline text-primary hover:no-underline"
              >
                {name}
              </button>
            </span>
          ))}
        </p>
      </div>

      {isError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{(error as Error)?.message ?? "Species not found"}</span>
        </div>
      )}

      {response && !response.found && (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border text-muted-foreground text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Not found in iNaturalist</span>
        </div>
      )}

      {response && response.found && species && (
        <div className="space-y-4">
          {isFallback && (
            <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-xl border border-warning/30 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0 text-warning-foreground mt-0.5" />
              <span className="text-warning-foreground">
                iNaturalist matched this to <strong>{inatName}</strong>, which differs from the name entered. Verify this is the correct species.
              </span>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {defaultPhotoUrl && (
                <div className="sm:w-64 shrink-0">
                  <img
                    src={defaultPhotoUrl}
                    alt={species.preferred_common_name ?? inatName ?? ""}
                    className="w-full h-52 sm:h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {species.preferred_common_name ?? inatName}
                  </h2>
                  <p className="text-sm italic text-muted-foreground">{inatName}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                    isFallback
                      ? "bg-warning/10 text-warning-foreground"
                      : "bg-primary/10 text-primary"
                  }`}>
                    {isFallback ? "fallback" : "exact"} match
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {inatTaxonId && (
                    <Stat label="Taxon ID" value={String(inatTaxonId)} />
                  )}
                  {species.observations_count != null && (
                    <Stat label="Observations" value={new Intl.NumberFormat().format(species.observations_count)} />
                  )}
                  {conservationLabel && (
                    <Stat label="Conservation" value={String(conservationLabel)} />
                  )}
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {response?.source_url && (
                    <a
                      href={response.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View on iNaturalist
                    </a>
                  )}
                  {species.wikipedia_url && (
                    <a
                      href={encodeURI(species.wikipedia_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Wikipedia
                    </a>
                  )}
                </div>

                {inatTaxonId && onTaxonIdSelected && (
                  <button
                    onClick={() => onTaxonIdSelected(inatTaxonId, inatName ?? String(inatTaxonId))}
                    className="text-xs px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium border border-primary/20"
                  >
                    Use taxon ID {inatTaxonId} in Phenology
                  </button>
                )}
              </div>
            </div>

            {species.wikipedia_summary && (
              <div className="px-6 pb-6 border-t border-border pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Wikipedia Summary{" "}
                  <span className="text-muted-foreground/60 normal-case font-normal">
                    — attributed to Wikipedia, not iNaturalist
                  </span>
                </h3>
                <div
                  className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: species.wikipedia_summary }}
                />
              </div>
            )}

          </div>

          {(response?.provenance?.fetched_at || cacheStatus) && (
            <p className="text-xs text-muted-foreground px-1">
              {response?.provenance?.fetched_at && (
                <>Cached: {new Date(response.provenance.fetched_at).toLocaleString()}</>
              )}
              {cacheStatus && (
                <span className="ml-2 capitalize px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  {cacheStatus}
                </span>
              )}
            </p>
          )}

          <RawJsonPanel title="iNat Species" data={response} />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
