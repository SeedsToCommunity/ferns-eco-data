import { useState } from "react";
import { useGetMifloraSpecies, useGetMifloraCounties } from "@workspace/api-client-react";
import { Leaf, Search, Loader2, AlertCircle, MapPin, ExternalLink, Database, Code, ChevronDown, ChevronUp } from "lucide-react";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function RawPanel({ title, data }: { title: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 p-3">
          <pre className="text-[10px] font-mono leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;

  const { data: speciesRes, isLoading: speciesLoading, isError: speciesError } = useGetMifloraSpecies(
    { name: query },
    { query: { enabled } }
  );
  const { data: countiesRes, isLoading: countiesLoading } = useGetMifloraCounties(
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

  const speciesData = speciesRes?.data as Record<string, unknown> | null | undefined;
  const searchRecords = (speciesData?.search_records as Record<string, unknown>[]) ?? [];
  const primaryRecord = searchRecords.find((r) =>
    String(r.scientific_name ?? "").toLowerCase().includes(
      query.toLowerCase().split(" ").slice(1).join(" ")
    )
  ) ?? searchRecords[0] ?? null;
  const specText = speciesData?.spec_text as Record<string, unknown> | null | undefined;
  const synonyms = speciesData?.synonyms as Record<string, unknown> | null | undefined;
  const pimageInfo = speciesData?.pimage_info as Record<string, unknown> | null | undefined;

  const countyData = countiesRes?.data as Record<string, unknown> | null | undefined;
  const locations = Array.isArray(countyData?.locations) ? (countyData!.locations as string[]) : [];

  const isLoading = speciesLoading || countiesLoading;
  const hasResult = !!speciesRes;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground leading-tight">
                  Michigan Flora Source Explorer
                </h1>
                <p className="text-xs text-muted-foreground">
                  FERNS passthrough API · michiganflora.net · University of Michigan
                </p>
              </div>
            </div>
            <a
              href="/api/miflora/metadata"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 bg-background"
            >
              <Database className="w-3.5 h-3.5" />
              Source Info
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter a scientific name, e.g. Asclepias tuberosa"
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
                <button onClick={() => runSearch(name)} className="underline text-primary hover:no-underline">
                  {name}
                </button>
              </span>
            ))}
          </p>
        </div>

        {speciesError && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Michigan Flora API error. Please try again.</span>
          </div>
        )}

        {hasResult && !speciesRes.found && (
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border text-muted-foreground text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>No records found for "{query}" in Michigan Flora.</span>
          </div>
        )}

        {hasResult && speciesRes.found && primaryRecord && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-border bg-primary/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Species Record</p>
                      <h2 className="text-xl font-display font-bold text-foreground italic">
                        {String(primaryRecord.scientific_name ?? "")}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1.5">
                        {Array.isArray(primaryRecord.common_name) && (primaryRecord.common_name as string[]).length > 0 && (
                          <span className="text-sm text-muted-foreground">
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
                    {speciesRes.source_url && (
                      <a
                        href={speciesRes.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Michigan Flora
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {primaryRecord.c !== undefined && (
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Coeff. of Conservatism</p>
                        <p className="text-base font-bold text-foreground">
                          {String(primaryRecord.c) === "*" ? "* (non-native)" : `C${String(primaryRecord.c)}`}
                        </p>
                      </div>
                    )}
                    {primaryRecord.na && (
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Origin</p>
                        <p className="text-sm font-semibold text-foreground">
                          {String(primaryRecord.na) === "N" ? "Native" : String(primaryRecord.na) === "A" ? "Adventive" : String(primaryRecord.na)}
                        </p>
                      </div>
                    )}
                    {primaryRecord.st && String(primaryRecord.st) !== "NULL" && (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
                        <p className="text-[10px] text-amber-700 mb-0.5">State Status</p>
                        <p className="text-sm font-bold text-amber-800">{String(primaryRecord.st)}</p>
                      </div>
                    )}
                    {primaryRecord.wet && (
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Wetland</p>
                        <p className="text-sm font-semibold text-foreground">{String(primaryRecord.wet)}</p>
                      </div>
                    )}
                    {primaryRecord.phys && (
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Physiognomy</p>
                        <p className="text-sm font-semibold text-foreground">{String(primaryRecord.phys)}</p>
                      </div>
                    )}
                    {primaryRecord.acronym && (
                      <div className="bg-muted/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-muted-foreground mb-0.5">Acronym</p>
                        <p className="text-sm font-mono font-semibold text-foreground">{String(primaryRecord.acronym)}</p>
                      </div>
                    )}
                  </div>

                  {primaryRecord.author && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Author</p>
                      <p className="text-sm text-foreground italic">{String(primaryRecord.author)}</p>
                    </div>
                  )}

                  {specText && (specText as Record<string,unknown>).text && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {stripHtml(String((specText as Record<string,unknown>).text ?? ""))}
                      </p>
                    </div>
                  )}

                  {synonyms && Array.isArray((synonyms as Record<string,unknown>).synonyms) && (synonyms as Record<string,unknown>).synonyms && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Synonyms</p>
                      <div className="flex flex-wrap gap-1.5">
                        {((synonyms as Record<string,unknown>).synonyms as Record<string,unknown>[]).map((s, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground italic">
                            {String(s.syn_genus ?? "")} {String(s.syn_species ?? "")}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {pimageInfo && (pimageInfo as Record<string,unknown>).image_name && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Primary Image</p>
                      <p className="text-xs text-muted-foreground italic">
                        {String((pimageInfo as Record<string,unknown>).image_name ?? "")}
                        {(pimageInfo as Record<string,unknown>).photographer && (
                          <span> — {String((pimageInfo as Record<string,unknown>).photographer)}</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <RawPanel title="Raw species JSON" data={speciesRes} />
            </div>

            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 pt-5 pb-4 border-b border-border bg-primary/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">County Distribution</p>
                      {countiesLoading ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading counties…
                        </div>
                      ) : countiesRes?.found ? (
                        <p className="text-xl font-display font-bold text-foreground">
                          {locations.length} of 83 counties
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">No county records found</p>
                      )}
                    </div>
                    {countiesRes?.source_url && (
                      <a href={countiesRes.source_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <MapPin className="w-3 h-3" />
                        View map
                      </a>
                    )}
                  </div>
                </div>

                {countiesRes?.found && locations.length > 0 && (
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {locations.sort().map((county) => (
                        <span key={county} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          <MapPin className="w-2.5 h-2.5" />
                          {county}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((locations.length / 83) * 100)}% of Michigan counties have confirmed presence.
                    </p>
                  </div>
                )}
              </div>

              {searchRecords.length > 1 && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    {searchRecords.length} records for this genus (showing primary match)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {searchRecords.slice(0, 10).map((r, i) => (
                      <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground italic">
                        {String(r.scientific_name ?? "")}
                      </span>
                    ))}
                    {searchRecords.length > 10 && (
                      <span className="text-xs text-muted-foreground">+{searchRecords.length - 10} more</span>
                    )}
                  </div>
                </div>
              )}

              <RawPanel title="Raw counties JSON" data={countiesRes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
