import { useState } from "react";
import { useGetInatSpecies } from "@workspace/api-client-react";
import { Leaf, Search, Loader2, AlertCircle, ExternalLink } from "lucide-react";
import { stripHtml } from "@/lib/utils";
import { RawJsonPanel } from "@/components/RawJsonPanel";

export function SpeciesTab() {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;
  const { data: response, isLoading, isError, error } = useGetInatSpecies(
    { name: query },
    { query: { enabled } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(nameInput.trim());
  }

  function runSearch(name: string) {
    setNameInput(name);
    setQuery(name);
  }

  const species = response?.data as Record<string, unknown> | undefined;

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

      {response && species && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {species.default_photo_url && (
                <div className="sm:w-64 shrink-0">
                  <img
                    src={species.default_photo_url as string}
                    alt={species.preferred_common_name as string ?? species.inat_name as string}
                    className="w-full h-52 sm:h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6 flex-1 space-y-4">
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    {(species.preferred_common_name as string) ?? (species.inat_name as string)}
                  </h2>
                  <p className="text-sm italic text-muted-foreground">{species.inat_name as string}</p>
                  {species.match_type && (
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs font-medium capitalize ${
                      species.match_type === "exact"
                        ? "bg-primary/10 text-primary"
                        : "bg-warning/10 text-warning-foreground"
                    }`}>
                      {species.match_type as string} match
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {species.inat_taxon_id && (
                    <Stat label="Taxon ID" value={String(species.inat_taxon_id)} />
                  )}
                  {species.observations_count !== null && species.observations_count !== undefined && (
                    <Stat label="Observations" value={new Intl.NumberFormat().format(species.observations_count as number)} />
                  )}
                  {species.conservation_status && (
                    <Stat label="Conservation" value={String((species.conservation_status as Record<string, unknown>)?.status_name ?? species.conservation_status)} />
                  )}
                </div>

                {species.wikipedia_url && (
                  <a
                    href={species.wikipedia_url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Wikipedia
                  </a>
                )}
              </div>
            </div>

            {species.wikipedia_summary && (
              <div className="px-6 pb-6 border-t border-border pt-4">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Wikipedia Summary</h3>
                <p className="text-sm text-foreground leading-relaxed line-clamp-6">
                  {stripHtml(species.wikipedia_summary as string)}
                </p>
              </div>
            )}
          </div>

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
