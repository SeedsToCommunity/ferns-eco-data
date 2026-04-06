import { useState, useMemo } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import {
  useGetS2CYears,
  useGetS2CSpeciesByYear,
  getGetS2CSpeciesByYearQueryKey,
  type GetS2CSpeciesByYearYear,
} from "@workspace/api-client-react";
import {
  Sprout,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  Search,
} from "lucide-react";

const AVAILABLE_YEARS: GetS2CSpeciesByYearYear[] = [2023, 2024, 2025, 2026];

function RawPanel({ title, data }: { title: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
      >
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          {title}
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
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

export function S2CPage() {
  const [selectedYear, setSelectedYear] =
    useState<GetS2CSpeciesByYearYear>(2026);
  const [nameFilter, setNameFilter] = useState("");
  const [onlyNeat, setOnlyNeat] = useState(false);
  const [onlySweet, setOnlySweet] = useState(false);

  const { data: yearsRes } = useGetS2CYears();
  const s2cParams = { year: selectedYear };
  const { data: speciesRes, isLoading } = useGetS2CSpeciesByYear(
    s2cParams,
    { query: { enabled: true, queryKey: getGetS2CSpeciesByYearQueryKey(s2cParams) } },
  );

  const yearSummaries = yearsRes?.data?.years ?? [];
  const speciesData = speciesRes?.data;
  const allSpecies = speciesData?.species ?? [];

  const hasNeat = allSpecies.some((s) => s.neat_and_tidy);
  const hasSweet = allSpecies.some((s) => s.sweet_and_simple);

  const filtered = useMemo(() => {
    let list = allSpecies;
    if (nameFilter.trim()) {
      const q = nameFilter.trim().toLowerCase();
      list = list.filter((s) => s.botanical_name.toLowerCase().includes(q));
    }
    if (onlyNeat) list = list.filter((s) => s.neat_and_tidy);
    if (onlySweet) list = list.filter((s) => s.sweet_and_simple);
    return list;
  }, [allSpecies, nameFilter, onlyNeat, onlySweet]);

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <SourceExplorerLayout sourceId="seeds-to-community-washtenaw">
      <div className="space-y-6">

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Program Year
            </p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_YEARS.map((year) => {
                const summary = yearSummaries.find((s) => s.year === year);
                const active = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(year);
                      setOnlyNeat(false);
                      setOnlySweet(false);
                      setNameFilter("");
                    }}
                    className={`flex flex-col items-center px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <span>{year}</span>
                    {summary && (
                      <span
                        className={`text-[10px] font-normal mt-0.5 ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {summary.species_count} spp
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading species list…
            </div>
          )}

          {!isLoading && speciesData && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-lg px-3 py-2">
                {speciesData.source_note}
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    placeholder="Filter by botanical name…"
                    className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                </div>
                {hasNeat && (
                  <button
                    onClick={() => setOnlyNeat((v) => !v)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                      onlyNeat
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-card text-foreground border-border hover:border-emerald-400"
                    }`}
                  >
                    Neat &amp; Tidy only
                  </button>
                )}
                {hasSweet && (
                  <button
                    onClick={() => setOnlySweet((v) => !v)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap ${
                      onlySweet
                        ? "bg-violet-600 text-white border-violet-600"
                        : "bg-card text-foreground border-border hover:border-violet-400"
                    }`}
                  >
                    Sweet &amp; Simple only
                  </button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                of {allSpecies.length} species
              </div>

              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-2.5 font-semibold text-foreground">
                        Botanical Name
                      </th>
                      {hasNeat && (
                        <th className="text-center px-3 py-2.5 font-semibold text-foreground w-24">
                          <span className="text-emerald-700 dark:text-emerald-400">
                            Neat
                          </span>
                        </th>
                      )}
                      {hasSweet && (
                        <th className="text-center px-3 py-2.5 font-semibold text-foreground w-24">
                          <span className="text-violet-700 dark:text-violet-400">
                            Sweet
                          </span>
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={1 + (hasNeat ? 1 : 0) + (hasSweet ? 1 : 0)}
                          className="px-4 py-6 text-center text-muted-foreground text-sm"
                        >
                          No species match the current filter.
                        </td>
                      </tr>
                    )}
                    {filtered.map((species, i) => (
                      <tr
                        key={species.botanical_name}
                        className={`border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}
                      >
                        <td className="px-4 py-2.5">
                          <span className="font-medium italic text-foreground">
                            {species.botanical_name}
                          </span>
                        </td>
                        {hasNeat && (
                          <td className="px-3 py-2.5 text-center">
                            {species.neat_and_tidy ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                            ) : null}
                          </td>
                        )}
                        {hasSweet && (
                          <td className="px-3 py-2.5 text-center">
                            {species.sweet_and_simple ? (
                              <span className="inline-block w-2 h-2 rounded-full bg-violet-500" />
                            ) : null}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <RawPanel title="Raw API response — /api/s2c?year=…" data={speciesRes} />
        <RawPanel title="Raw API response — /api/s2c/years" data={yearsRes} />

      </div>
    </SourceExplorerLayout>
  );
}

export default S2CPage;
