import { useState } from "react";
import { Link } from "wouter";
import { useGetMifloraSpecies, useGetMifloraCounties } from "@workspace/api-client-react";
import { Leaf, Search, Loader2, AlertCircle, MapPin, ExternalLink, Database, Code, ChevronDown, ChevronUp, ArrowLeft, FileJson } from "lucide-react";
import { stripHtml } from "@/lib/utils";

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

export function MifloraPage() {
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
              <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-1">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">All Sources</span>
              </Link>
              <span className="text-muted-foreground/40">|</span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-display font-bold text-foreground leading-tight">
                  Michigan Flora Explorer
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
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5 bg-muted/50 hover:bg-muted"
            >
              <FileJson className="w-3 h-3" />
              API Metadata
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Quercus rubra, Trillium grandiflorum"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!nameInput.trim() || isLoading}
              className="px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Try:{" "}
            {["Quercus rubra", "Trillium grandiflorum", "Asclepias tuberosa"].map((name, i) => (
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
            <span>Error loading species data</span>
          </div>
        )}

        {hasResult && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              {primaryRecord && (
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-border bg-muted/30">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xl font-serif font-semibold italic text-foreground">
                          {String(primaryRecord.scientific_name ?? "")}
                        </p>
                        {primaryRecord.common_name && (
                          <p className="text-sm text-muted-foreground mt-0.5">{String(primaryRecord.common_name)}</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          <Database className="w-3 h-3" />
                          #{String(primaryRecord.plant_id ?? "")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {specText?.spec_text_html && (
                    <div className="p-5 text-sm text-foreground/80 leading-relaxed border-b border-border">
                      {stripHtml(String(specText.spec_text_html))}
                    </div>
                  )}

                  {pimageInfo && (
                    <div className="p-5 border-b border-border space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Primary Image Info</p>
                      {pimageInfo.image_url && (
                        <div className="flex flex-col gap-2">
                          <img
                            src={String(pimageInfo.image_url)}
                            alt={`Primary image for ${String(primaryRecord.scientific_name ?? "")}`}
                            className="rounded-lg max-h-48 object-cover border border-border"
                            loading="lazy"
                          />
                          {pimageInfo.image_attribution && (
                            <p className="text-xs text-muted-foreground">{String(pimageInfo.image_attribution)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {synonyms && Object.keys(synonyms).length > 0 && (
                    <div className="p-5 border-b border-border">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Synonyms / Related</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.keys(synonyms).slice(0, 8).map((syn) => (
                          <span key={syn} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground italic">
                            {syn}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex flex-wrap gap-3">
                    {primaryRecord.url && (
                      <a
                        href={String(primaryRecord.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Michigan Flora page
                      </a>
                    )}
                    {primaryRecord.map_url && (
                      <a
                        href={String(primaryRecord.map_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
                      >
                        <MapPin className="w-3 h-3" />
                        View map
                      </a>
                    )}
                  </div>
                </div>
              )}

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

              <RawPanel title="Raw species JSON" data={speciesRes} />
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    County Presence
                    {countiesLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                  </h3>
                </div>

                {countiesRes?.found && locations.length > 0 ? (
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
                ) : countiesRes && !countiesRes.found ? (
                  <div className="p-5 text-sm text-muted-foreground">No county records found.</div>
                ) : null}
              </div>

              <RawPanel title="Raw counties JSON" data={countiesRes} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MifloraPage;
