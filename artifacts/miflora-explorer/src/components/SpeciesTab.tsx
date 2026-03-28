import { useState } from "react";
import { useGetMifloraSpecies } from "@workspace/api-client-react";
import { Leaf, Search, Loader2, AlertCircle, ExternalLink, MapPin, FileJson } from "lucide-react";
import { RawJsonPanel } from "@/components/RawJsonPanel";

interface SpeciesTabProps {
  onSpeciesFound?: (name: string) => void;
}

export function SpeciesTab({ onSpeciesFound }: SpeciesTabProps) {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;
  const { data: response, isLoading, isError, error } = useGetMifloraSpecies(
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

  const data = response?.data as Record<string, unknown> | null | undefined;
  const searchRecords = (data?.search_records as Record<string, unknown>[]) ?? [];
  const primaryRecord = searchRecords.find((r) =>
    String(r.scientific_name ?? "").toLowerCase().includes(query.toLowerCase().split(" ").slice(1).join(" "))
  ) ?? searchRecords[0] ?? null;
  const specText = data?.spec_text as Record<string, unknown> | null | undefined;
  const synonyms = data?.synonyms as Record<string, unknown> | null | undefined;
  const pimageInfo = data?.pimage_info as Record<string, unknown> | null | undefined;
  const plantId = primaryRecord ? (Number((primaryRecord as Record<string,unknown>)?.plant_id) || null) : null;

  const cacheStatus = response?.cache_status as string | null | undefined;

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Species Lookup</h2>
            <p className="text-xs text-muted-foreground">Taxonomic details, description, synonyms, and images from Michigan Flora</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="e.g. Asclepias tuberosa, Quercus rubra"
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
          {["Asclepias tuberosa", "Quercus rubra", "Trillium grandiflorum", "Carex pensylvanica"].map((name, i) => (
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
          <span>{(error as Error)?.message ?? "Lookup failed"}</span>
        </div>
      )}

      {response && !response.found && (
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border text-muted-foreground text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Not found in Michigan Flora</span>
        </div>
      )}

      {response && response.found && primaryRecord && (
        <div className="space-y-4">
          {cacheStatus && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`px-2 py-0.5 rounded-full font-medium ${
                cacheStatus === "hit" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {cacheStatus === "hit" ? "Cached" : "Fresh"}
              </span>
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-display font-bold text-foreground">
                    {String(primaryRecord.scientific_name ?? "")}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {primaryRecord.common_name && Array.isArray(primaryRecord.common_name) && primaryRecord.common_name.length > 0 && (
                      <span className="text-sm text-muted-foreground italic">
                        {(primaryRecord.common_name as string[]).join(", ")}
                      </span>
                    )}
                    {primaryRecord.family_name && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">
                        {String(primaryRecord.family_name)}
                      </span>
                    )}
                  </div>
                </div>
                {response.source_url && (
                  <a
                    href={response.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 text-xs text-primary hover:underline border border-primary/20 rounded-lg px-2.5 py-1.5 bg-primary/5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View on Michigan Flora
                  </a>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {primaryRecord.c !== undefined && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Coefficient of Conservatism</p>
                    <p className="text-lg font-bold text-foreground">
                      {String(primaryRecord.c) === "*" ? "* (non-native)" : `C${String(primaryRecord.c)}`}
                    </p>
                  </div>
                )}
                {primaryRecord.na && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Origin</p>
                    <p className="text-sm font-semibold text-foreground">
                      {String(primaryRecord.na) === "N" ? "Native" : String(primaryRecord.na) === "A" ? "Adventive" : String(primaryRecord.na)}
                    </p>
                  </div>
                )}
                {primaryRecord.wet && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Wetland Status</p>
                    <p className="text-sm font-semibold text-foreground">{String(primaryRecord.wet)}</p>
                  </div>
                )}
                {primaryRecord.phys && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Physiognomy</p>
                    <p className="text-sm font-semibold text-foreground">{String(primaryRecord.phys)}</p>
                  </div>
                )}
                {primaryRecord.author && (
                  <div className="bg-muted/50 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Author</p>
                    <p className="text-sm text-foreground italic">{String(primaryRecord.author)}</p>
                  </div>
                )}
              </div>

              {onSpeciesFound && query && (
                <button
                  onClick={() => onSpeciesFound(query)}
                  className="mt-4 flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  View county occurrence data →
                </button>
              )}
            </div>

            {pimageInfo && (pimageInfo as Record<string, unknown>).image_name && (
              <div className="border-t border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Primary Image</p>
                <a
                  href={`https://michiganflora.net/image/${(pimageInfo as Record<string,unknown>).image_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <FileJson className="w-4 h-4" />
                  {String((pimageInfo as Record<string,unknown>).image_name ?? "")}
                  {(pimageInfo as Record<string,unknown>).photographer && (
                    <span className="text-muted-foreground text-xs">
                      — photo by {String((pimageInfo as Record<string,unknown>).photographer)}
                    </span>
                  )}
                </a>
              </div>
            )}

            {specText && (specText as Record<string, unknown>).text && (
              <div className="border-t border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Description</p>
                <div
                  className="text-sm text-foreground leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: String((specText as Record<string,unknown>).text ?? "") }}
                />
              </div>
            )}

            {synonyms && Array.isArray((synonyms as Record<string,unknown>).synonyms) && (
              <div className="border-t border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Synonyms</p>
                <div className="flex flex-wrap gap-2">
                  {((synonyms as Record<string,unknown>).synonyms as Record<string,unknown>[]).map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground italic">
                      {String(s.syn_genus ?? "")} {String(s.syn_species ?? "")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {synonyms && (synonyms as Record<string,unknown>).message && (
              <div className="border-t border-border p-4">
                <p className="text-xs text-muted-foreground italic">{String((synonyms as Record<string,unknown>).message)}</p>
              </div>
            )}

            {searchRecords.length > 1 && (
              <div className="border-t border-border p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  {searchRecords.length} records in genus (showing primary match)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {searchRecords.slice(0, 12).map((r, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {String(r.scientific_name ?? "")}
                    </span>
                  ))}
                  {searchRecords.length > 12 && (
                    <span className="text-xs text-muted-foreground">+{searchRecords.length - 12} more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {response && (
        <RawJsonPanel title="Michigan Flora Species Response" data={response} />
      )}
    </div>
  );
}
