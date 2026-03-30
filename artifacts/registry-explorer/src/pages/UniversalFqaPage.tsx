import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  useGetUniversalFqaDatabases,
  useGetUniversalFqaDatabase,
  getGetUniversalFqaDatabaseQueryKey,
  useGetUniversalFqaSpecies,
  getGetUniversalFqaSpeciesQueryKey,
  useGetUniversalFqaAssessments,
  getGetUniversalFqaAssessmentsQueryKey,
  useGetUniversalFqaAssessment,
  getGetUniversalFqaAssessmentQueryKey,
  type UniversalFqaDatabaseEntry,
  type UniversalFqaAssessmentSummary,
  type UniversalFqaSpeciesRecord,
} from "@workspace/api-client-react";
import {
  ArrowLeft,
  Database,
  ChevronDown,
  ChevronUp,
  Code,
  ExternalLink,
  Search,
  Leaf,
  ClipboardList,
  FileText,
  ChevronRight,
} from "lucide-react";

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

function MetricRow({ label, value }: { label: string; value: unknown }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex items-center justify-between py-1 border-b border-border/40 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium text-foreground tabular-nums">
        {String(value)}
      </span>
    </div>
  );
}

type TabId = "databases" | "species" | "assessments";

function DatabaseDropdown({
  databases,
  value,
  onChange,
  placeholder,
}: {
  databases: UniversalFqaDatabaseEntry[];
  value: number | null;
  onChange: (id: number | null) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => {
    if (!filter.trim()) return databases;
    const q = filter.trim().toLowerCase();
    return databases.filter(
      (d) =>
        d.region.toLowerCase().includes(q) ||
        d.citation.toLowerCase().includes(q) ||
        String(d.id).includes(q)
    );
  }, [databases, filter]);

  const selected = databases.find((d) => d.id === value) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm bg-background border border-border rounded-lg hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
      >
        <span
          className={
            selected ? "text-foreground font-medium" : "text-muted-foreground"
          }
        >
          {selected
            ? `DB ${selected.id} — ${selected.region} (${selected.year})`
            : (placeholder ?? "Select a database…")}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Filter databases…"
                className="w-full pl-7 pr-2 py-1.5 text-xs bg-background border border-border rounded-lg focus:outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                No databases match
              </div>
            )}
            {filtered.map((db) => (
              <button
                key={db.id}
                type="button"
                onClick={() => {
                  onChange(db.id);
                  setOpen(false);
                  setFilter("");
                }}
                className={`w-full text-left px-3 py-2.5 text-xs hover:bg-muted/50 transition-colors border-b border-border/30 last:border-0 ${
                  db.id === value ? "bg-emerald-50 dark:bg-emerald-900/10" : ""
                }`}
              >
                <span className="font-medium text-foreground">
                  DB {db.id}
                </span>
                <span className="mx-1.5 text-muted-foreground">·</span>
                <span className="text-foreground">{db.region}</span>
                <span className="mx-1.5 text-muted-foreground">·</span>
                <span className="text-muted-foreground">{db.year}</span>
                <div className="text-muted-foreground mt-0.5 truncate">
                  {db.citation.slice(0, 90)}
                  {db.citation.length > 90 ? "…" : ""}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function UniversalFqaPage() {
  const [activeTab, setActiveTab] = useState<TabId>("databases");
  const [dbFilter, setDbFilter] = useState("");

  const [selectedDbId, setSelectedDbId] = useState<number | null>(null);
  const [speciesName, setSpeciesName] = useState("");
  const [speciesQuery, setSpeciesQuery] = useState("");
  const [speciesDbId, setSpeciesDbId] = useState<number | null>(null);

  const [assessmentsDbId, setAssessmentsDbId] = useState<number | null>(null);
  const [assessmentsLoaded, setAssessmentsLoaded] = useState<number | null>(null);
  const [assessmentFilter, setAssessmentFilter] = useState("");
  const [viewingAssessment, setViewingAssessment] = useState<number | null>(null);

  const [browseDbLoaded, setBrowseDbLoaded] = useState<number | null>(null);
  const [browseSpeciesFilter, setBrowseSpeciesFilter] = useState("");

  const { data: dbsRes, isLoading: dbsLoading } = useGetUniversalFqaDatabases();
  const databases = useMemo(() => dbsRes?.data?.databases ?? [], [dbsRes]);

  const filteredDbs = useMemo(() => {
    if (!dbFilter.trim()) return databases;
    const q = dbFilter.trim().toLowerCase();
    return databases.filter(
      (d) =>
        d.region.toLowerCase().includes(q) ||
        d.citation.toLowerCase().includes(q) ||
        String(d.id).includes(q)
    );
  }, [databases, dbFilter]);

  const speciesParams = { name: speciesQuery, database_id: speciesDbId ?? 0 };
  const { data: speciesRes, isLoading: speciesLoading, error: speciesError } =
    useGetUniversalFqaSpecies(
      speciesParams,
      {
        query: {
          queryKey: getGetUniversalFqaSpeciesQueryKey(speciesParams),
          enabled: !!speciesQuery && speciesDbId !== null,
        },
      }
    );

  const assessmentsParams = { database_id: assessmentsLoaded ?? 0 };
  const { data: assessmentsRes, isLoading: assessmentsLoading } =
    useGetUniversalFqaAssessments(
      assessmentsParams,
      {
        query: {
          queryKey: getGetUniversalFqaAssessmentsQueryKey(assessmentsParams),
          enabled: assessmentsLoaded !== null,
        },
      }
    );

  const allAssessments = useMemo(
    () => assessmentsRes?.data?.assessments ?? [],
    [assessmentsRes]
  );

  const filteredAssessments = useMemo(() => {
    if (!assessmentFilter.trim()) return allAssessments;
    const q = assessmentFilter.trim().toLowerCase();
    return allAssessments.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.site.toLowerCase().includes(q) ||
        a.practitioner.toLowerCase().includes(q)
    );
  }, [allAssessments, assessmentFilter]);

  const assessmentId = viewingAssessment ?? 0;
  const { data: assessmentDetailRes, isLoading: detailLoading } =
    useGetUniversalFqaAssessment(
      assessmentId,
      {
        query: {
          queryKey: getGetUniversalFqaAssessmentQueryKey(assessmentId),
          enabled: viewingAssessment !== null,
        },
      }
    );

  const assessmentDetail = assessmentDetailRes?.data;

  const browseDbId = browseDbLoaded ?? 0;
  const { data: browseDbRes, isLoading: browseDbLoading } =
    useGetUniversalFqaDatabase(
      browseDbId,
      {
        query: {
          queryKey: getGetUniversalFqaDatabaseQueryKey(browseDbId),
          enabled: browseDbLoaded !== null,
        },
      }
    );

  const browseDbDetail = browseDbRes?.data;

  const filteredBrowseSpecies = useMemo(() => {
    const species = browseDbDetail?.species ?? [];
    if (!browseSpeciesFilter.trim()) return species;
    const q = browseSpeciesFilter.trim().toLowerCase();
    return species.filter(
      (sp) =>
        sp.scientific_name.toLowerCase().includes(q) ||
        (sp.common_name ?? "").toLowerCase().includes(q) ||
        (sp.family ?? "").toLowerCase().includes(q)
    );
  }, [browseDbDetail, browseSpeciesFilter]);

  const apiBase = import.meta.env.BASE_URL.replace(/\/$/, "");

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: "databases", label: "Databases", icon: <Database className="w-3.5 h-3.5" /> },
    { id: "species", label: "Species Lookup", icon: <Leaf className="w-3.5 h-3.5" /> },
    { id: "assessments", label: "Assessments", icon: <ClipboardList className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Sources</span>
        </Link>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Universal FQA
            </h1>
          </div>
          <p className="text-sm text-muted-foreground pl-12">
            93 regional FQA databases · per-species C &amp; W values · public site assessments
          </p>
          <div className="pl-12 flex items-center gap-3">
            <a
              href={`${apiBase}/api/universal-fqa/metadata`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Raw metadata
            </a>
            <a
              href="https://universalfqa.org"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              universalfqa.org
            </a>
          </div>
        </div>

        <div className="flex gap-1 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "databases" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {databases.length > 0 ? `${databases.length} databases` : "Loading…"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Select a database to explore species or assessments
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={dbFilter}
                  onChange={(e) => setDbFilter(e.target.value)}
                  placeholder="Filter by region, citation, or ID…"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                />
              </div>

              {dbsLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Fetching database list from universalfqa.org…
                </div>
              )}

              {!dbsLoading && filteredDbs.length > 0 && (
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="max-h-[480px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm border-b border-border">
                        <tr>
                          <th className="text-left px-3 py-2.5 font-semibold text-foreground w-14">
                            ID
                          </th>
                          <th className="text-left px-3 py-2.5 font-semibold text-foreground w-20">
                            Year
                          </th>
                          <th className="text-left px-3 py-2.5 font-semibold text-foreground">
                            Region
                          </th>
                          <th className="text-left px-3 py-2.5 font-semibold text-foreground hidden lg:table-cell">
                            Citation (excerpt)
                          </th>
                          <th className="text-right px-3 py-2.5 font-semibold text-foreground w-20">
                            Use
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDbs.map((db, i) => (
                          <tr
                            key={db.id}
                            className={`border-b border-border last:border-0 ${
                              selectedDbId === db.id
                                ? "bg-emerald-50 dark:bg-emerald-900/10"
                                : i % 2 === 0
                                ? ""
                                : "bg-muted/20"
                            }`}
                          >
                            <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                              {db.id}
                            </td>
                            <td className="px-3 py-2 text-xs text-muted-foreground">
                              {db.year}
                            </td>
                            <td className="px-3 py-2 font-medium text-foreground text-xs">
                              {db.region}
                            </td>
                            <td className="px-3 py-2 text-xs text-muted-foreground hidden lg:table-cell max-w-xs truncate">
                              {db.citation.slice(0, 80)}
                              {db.citation.length > 80 ? "…" : ""}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                onClick={() => {
                                  setSelectedDbId(db.id);
                                  setSpeciesDbId(db.id);
                                  setAssessmentsDbId(db.id);
                                }}
                                className={`text-xs px-2 py-1 rounded border transition-colors ${
                                  selectedDbId === db.id
                                    ? "bg-emerald-600 text-white border-emerald-600"
                                    : "bg-card text-foreground border-border hover:border-emerald-400"
                                }`}
                              >
                                Select
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!dbsLoading && selectedDbId !== null && (
                <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-2">
                  {(() => {
                    const db = databases.find((d) => d.id === selectedDbId);
                    if (!db) return null;
                    return (
                      <>
                        <p className="text-xs font-semibold text-foreground">
                          Selected: DB {db.id} — {db.region} ({db.year})
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {db.citation}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <button
                            onClick={() => setActiveTab("species")}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                          >
                            <Leaf className="w-3 h-3" />
                            Look up species in DB {db.id}
                          </button>
                          <button
                            onClick={() => {
                              setAssessmentsLoaded(db.id);
                              setActiveTab("assessments");
                            }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:border-emerald-400 transition-colors"
                          >
                            <ClipboardList className="w-3 h-3" />
                            Browse assessments for DB {db.id}
                          </button>
                          <button
                            onClick={() => {
                              setBrowseDbLoaded(db.id);
                              setBrowseSpeciesFilter("");
                            }}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-card text-foreground hover:border-emerald-400 transition-colors"
                          >
                            <Database className="w-3 h-3" />
                            Browse all species in DB {db.id}
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
            <RawPanel title="Raw API response — /api/universal-fqa/databases" data={dbsRes} />
          </div>
        )}

        {activeTab === "databases" && browseDbLoaded !== null && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Species List — DB {browseDbLoaded}
                  {browseDbDetail && (
                    <span className="ml-2 normal-case font-normal text-foreground">
                      {browseDbDetail.region} ({browseDbDetail.year})
                    </span>
                  )}
                </p>
                <button
                  onClick={() => { setBrowseDbLoaded(null); setBrowseSpeciesFilter(""); }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Dismiss
                </button>
              </div>

              {browseDbLoading && (
                <p className="text-xs text-muted-foreground animate-pulse">
                  Loading database from universalfqa.org (first load may take ~5–10 s)…
                </p>
              )}

              {!browseDbLoading && browseDbDetail && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-muted/40 rounded-lg p-3 space-y-0.5">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Total species</p>
                      <p className="text-sm font-semibold">{browseDbDetail.total_species}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 space-y-0.5">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Native</p>
                      <p className="text-sm font-semibold">{browseDbDetail.native_species}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 space-y-0.5">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Non-native</p>
                      <p className="text-sm font-semibold">{browseDbDetail.non_native_species}</p>
                    </div>
                    <div className="bg-muted/40 rounded-lg p-3 space-y-0.5">
                      <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Mean C (native)</p>
                      <p className="text-sm font-semibold">
                        {browseDbDetail.native_mean_c != null ? browseDbDetail.native_mean_c.toFixed(2) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                    <input
                      type="text"
                      value={browseSpeciesFilter}
                      onChange={(e) => setBrowseSpeciesFilter(e.target.value)}
                      placeholder="Filter by scientific name, common name, or family…"
                      className="w-full pl-7 pr-3 py-2 text-xs bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                    />
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Showing {filteredBrowseSpecies.length.toLocaleString()} of {browseDbDetail.species.length.toLocaleString()} species
                    {browseDbRes?.cache_status && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        cache: {browseDbRes.cache_status}
                      </span>
                    )}
                  </p>

                  <div className="overflow-x-auto rounded-lg border border-border/50">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-muted/40 border-b border-border">
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Scientific name</th>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Common name</th>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Family</th>
                          <th className="text-center px-3 py-2 text-muted-foreground font-medium">C</th>
                          <th className="text-center px-3 py-2 text-muted-foreground font-medium">W</th>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Native</th>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Physiognomy</th>
                          <th className="text-left px-3 py-2 text-muted-foreground font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBrowseSpecies.slice(0, 500).map((sp, i) => (
                          <tr
                            key={`${sp.scientific_name}-${i}`}
                            className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                          >
                            <td className="px-3 py-1.5 italic">{sp.scientific_name}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">{sp.common_name ?? "—"}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">{sp.family ?? "—"}</td>
                            <td className="px-3 py-1.5 text-center font-mono">
                              {sp.c != null ? String(sp.c) : "—"}
                            </td>
                            <td className="px-3 py-1.5 text-center font-mono">
                              {sp.w != null ? String(sp.w) : "—"}
                            </td>
                            <td className="px-3 py-1.5 text-muted-foreground">{sp.native ?? "—"}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">{sp.physiognomy ?? "—"}</td>
                            <td className="px-3 py-1.5 text-muted-foreground">{sp.duration ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredBrowseSpecies.length > 500 && (
                      <p className="text-[10px] text-muted-foreground text-center py-2 border-t border-border/40">
                        Showing first 500 of {filteredBrowseSpecies.length.toLocaleString()} matching records. Use the filter to narrow results.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
            <RawPanel title="Raw API response — /api/universal-fqa/databases/:id" data={browseDbRes} />
          </div>
        )}

        {activeTab === "species" && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Species C-value Lookup
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Scientific name
                  </label>
                  <input
                    type="text"
                    value={speciesName}
                    onChange={(e) => setSpeciesName(e.target.value)}
                    placeholder="e.g. Lobelia cardinalis"
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && speciesName.trim() && speciesDbId !== null) {
                        setSpeciesQuery(speciesName.trim());
                      }
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Database
                    {selectedDbId !== null && speciesDbId === selectedDbId && (
                      <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                        (DB {selectedDbId} selected from Databases tab)
                      </span>
                    )}
                  </label>
                  <DatabaseDropdown
                    databases={databases}
                    value={speciesDbId}
                    onChange={setSpeciesDbId}
                    placeholder="Select a database…"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (speciesName.trim() && speciesDbId !== null) {
                    setSpeciesQuery(speciesName.trim());
                  }
                }}
                disabled={!speciesName.trim() || speciesDbId === null}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Look up species
              </button>

              {speciesLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  Loading database and searching…
                </div>
              )}

              {speciesError && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Failed to look up species. The database may be unavailable or malformed on universalfqa.org.
                  </p>
                </div>
              )}

              {!speciesLoading && speciesRes && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${speciesRes.found ? "bg-emerald-500" : "bg-amber-500"}`}
                    />
                    <p className="text-sm font-medium text-foreground">
                      {speciesRes.found
                        ? `Found in database ${speciesRes.data?.database_id}`
                        : `"${speciesRes.data?.queried_name}" not found in database ${speciesRes.data?.database_id}`}
                    </p>
                    <span className="text-xs text-muted-foreground ml-auto">
                      cache: {speciesRes.cache_status}
                    </span>
                  </div>

                  {speciesRes.found && speciesRes.data?.species && (
                    <div className="border border-border rounded-xl overflow-hidden overflow-x-auto">
                      <table className="w-full text-sm min-w-[700px]">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border">
                            {[
                              "Scientific Name",
                              "Family",
                              "Acronym",
                              "Native",
                              "C",
                              "W",
                              "Physiognomy",
                              "Duration",
                              "Common Name",
                            ].map((h) => (
                              <th
                                key={h}
                                className="text-left px-3 py-2 text-xs font-semibold text-foreground whitespace-nowrap"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-3 py-2.5 text-xs font-medium italic text-foreground">
                              {speciesRes.data.species.scientific_name}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-foreground">
                              {speciesRes.data.species.family}
                            </td>
                            <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground">
                              {speciesRes.data.species.acronym}
                            </td>
                            <td className="px-3 py-2.5 text-xs">
                              <span
                                className={
                                  speciesRes.data.species.native === "native"
                                    ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                    : "text-amber-700 dark:text-amber-400"
                                }
                              >
                                {speciesRes.data.species.native}
                              </span>
                            </td>
                            <td className="px-3 py-2.5 text-xs font-bold tabular-nums text-foreground">
                              {speciesRes.data.species.c !== null && speciesRes.data.species.c !== undefined ? String(speciesRes.data.species.c) : "—"}
                            </td>
                            <td className="px-3 py-2.5 text-xs tabular-nums text-foreground">
                              {speciesRes.data.species.w !== null && speciesRes.data.species.w !== undefined ? String(speciesRes.data.species.w) : "—"}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-foreground">
                              {speciesRes.data.species.physiognomy}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-foreground">
                              {speciesRes.data.species.duration}
                            </td>
                            <td className="px-3 py-2.5 text-xs text-muted-foreground">
                              {speciesRes.data.species.common_name}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {!speciesRes.found && (
                    <p className="text-sm text-muted-foreground">
                      This species is not in the selected database. Try a different database,
                      or check the name spelling.
                    </p>
                  )}
                </div>
              )}
            </div>
            <RawPanel
              title="Raw API response — /api/universal-fqa/species"
              data={speciesRes}
            />
          </div>
        )}

        {activeTab === "assessments" && (
          <div className="space-y-4">
            {viewingAssessment === null ? (
              <>
                <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Browse Public Site Assessments
                  </p>

                  <div className="flex gap-3 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Database
                        {selectedDbId !== null && assessmentsDbId === selectedDbId && (
                          <span className="ml-2 text-emerald-600 dark:text-emerald-400">
                            (DB {selectedDbId} selected from Databases tab)
                          </span>
                        )}
                      </label>
                      <DatabaseDropdown
                        databases={databases}
                        value={assessmentsDbId}
                        onChange={setAssessmentsDbId}
                        placeholder="Select a database…"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (assessmentsDbId !== null) {
                          setAssessmentsLoaded(assessmentsDbId);
                          setAssessmentFilter("");
                        }
                      }}
                      disabled={assessmentsDbId === null}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Load
                    </button>
                  </div>

                  {assessmentsLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Fetching assessment list from universalfqa.org…
                    </div>
                  )}

                  {!assessmentsLoading && allAssessments.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                          <input
                            type="text"
                            value={assessmentFilter}
                            onChange={(e) => setAssessmentFilter(e.target.value)}
                            placeholder="Filter by name, site, or practitioner…"
                            className="w-full pl-8 pr-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {filteredAssessments.length} of {allAssessments.length}
                        </p>
                      </div>

                      <div className="border border-border rounded-xl overflow-hidden">
                        <div className="max-h-[480px] overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm border-b border-border">
                              <tr>
                                <th className="text-left px-3 py-2.5 font-semibold text-foreground">
                                  Name
                                </th>
                                <th className="text-left px-3 py-2.5 font-semibold text-foreground hidden sm:table-cell">
                                  Site
                                </th>
                                <th className="text-left px-3 py-2.5 font-semibold text-foreground hidden sm:table-cell">
                                  Date
                                </th>
                                <th className="text-left px-3 py-2.5 font-semibold text-foreground hidden md:table-cell">
                                  Practitioner
                                </th>
                                <th className="text-right px-3 py-2.5 font-semibold text-foreground w-20">
                                  Detail
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredAssessments.map((a, i) => (
                                <tr
                                  key={a.id}
                                  className={`border-b border-border last:border-0 ${
                                    i % 2 === 0 ? "" : "bg-muted/20"
                                  }`}
                                >
                                  <td className="px-3 py-2 text-xs font-medium text-foreground">
                                    {a.name || `Assessment #${a.id}`}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground hidden sm:table-cell">
                                    {a.site}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground hidden sm:table-cell">
                                    {a.date}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground hidden md:table-cell">
                                    {a.practitioner}
                                  </td>
                                  <td className="px-3 py-2 text-right">
                                    <button
                                      onClick={() => setViewingAssessment(a.id)}
                                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border bg-card hover:border-emerald-400 transition-colors"
                                    >
                                      View
                                      <ChevronRight className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <RawPanel
                  title="Raw API response — /api/universal-fqa/assessments"
                  data={assessmentsRes}
                />
              </>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setViewingAssessment(null)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to assessments
                </button>

                {detailLoading && (
                  <div className="bg-card border border-border rounded-xl p-8 flex items-center gap-3 text-muted-foreground">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span>Loading assessment detail…</span>
                  </div>
                )}

                {!detailLoading && assessmentDetail && (
                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground">
                            {assessmentDetail.site_name ||
                              `Assessment #${assessmentDetail.id}`}
                          </h2>
                          <p className="text-xs text-muted-foreground">
                            {[
                              assessmentDetail.date,
                              assessmentDetail.city,
                              assessmentDetail.county
                                ? `${assessmentDetail.county} County`
                                : null,
                              assessmentDetail.state,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          {assessmentDetail.practitioner && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Practitioner:</span>{" "}
                              {assessmentDetail.practitioner}
                            </p>
                          )}
                          {assessmentDetail.community_type && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">
                                Community type:
                              </span>{" "}
                              {assessmentDetail.community_type}
                            </p>
                          )}
                          {assessmentDetail.fqa_db && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">FQA DB:</span>{" "}
                              {assessmentDetail.fqa_db.region} ({assessmentDetail.fqa_db.year})
                            </p>
                          )}
                          {assessmentDetail.visibility && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Visibility:</span>{" "}
                              {assessmentDetail.visibility}
                            </p>
                          )}
                        </div>
                        <div className="space-y-1">
                          {assessmentDetail.weather_notes && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Weather:</span>{" "}
                              {assessmentDetail.weather_notes}
                            </p>
                          )}
                          {assessmentDetail.other_notes && (
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium text-foreground">Notes:</span>{" "}
                              {assessmentDetail.other_notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          FQI Metrics
                        </p>
                        <MetricRow label="Total FQI" value={assessmentDetail.metrics.total_fqi} />
                        <MetricRow label="Native FQI" value={assessmentDetail.metrics.native_fqi} />
                        <MetricRow label="Adjusted FQI" value={assessmentDetail.metrics.adjusted_fqi} />
                        <MetricRow label="Total Mean C" value={assessmentDetail.metrics.total_mean_c} />
                        <MetricRow label="Native Mean C" value={assessmentDetail.metrics.native_mean_c} />
                        <MetricRow label="Mean Wetness" value={assessmentDetail.metrics.mean_wetness} />
                        <MetricRow label="Native Mean Wetness" value={assessmentDetail.metrics.native_mean_wetness} />
                      </div>

                      <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Species Richness
                        </p>
                        <MetricRow label="Total species" value={assessmentDetail.metrics.total_species} />
                        <MetricRow label="Native species" value={
                          assessmentDetail.metrics.native_species !== null
                            ? `${assessmentDetail.metrics.native_species}${assessmentDetail.metrics.native_species_pct !== null ? ` (${assessmentDetail.metrics.native_species_pct}%)` : ""}`
                            : null
                        } />
                        <MetricRow label="Non-native species" value={
                          assessmentDetail.metrics.non_native_species !== null
                            ? `${assessmentDetail.metrics.non_native_species}${assessmentDetail.metrics.non_native_species_pct !== null ? ` (${assessmentDetail.metrics.non_native_species_pct}%)` : ""}`
                            : null
                        } />
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-3 mb-1">
                          C-value Distribution
                        </p>
                        <MetricRow label="% C = 0" value={assessmentDetail.metrics.pct_c0 !== null ? `${assessmentDetail.metrics.pct_c0}%` : null} />
                        <MetricRow label="% C 1–3" value={assessmentDetail.metrics.pct_c1_3 !== null ? `${assessmentDetail.metrics.pct_c1_3}%` : null} />
                        <MetricRow label="% C 4–6" value={assessmentDetail.metrics.pct_c4_6 !== null ? `${assessmentDetail.metrics.pct_c4_6}%` : null} />
                        <MetricRow label="% C 7–10" value={assessmentDetail.metrics.pct_c7_10 !== null ? `${assessmentDetail.metrics.pct_c7_10}%` : null} />
                      </div>

                      <div className="bg-card border border-border rounded-xl p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          Physiognomy
                        </p>
                        {(
                          [
                            ["Tree", assessmentDetail.metrics.tree_count, assessmentDetail.metrics.tree_pct],
                            ["Shrub", assessmentDetail.metrics.shrub_count, assessmentDetail.metrics.shrub_pct],
                            ["Vine", assessmentDetail.metrics.vine_count, assessmentDetail.metrics.vine_pct],
                            ["Forb", assessmentDetail.metrics.forb_count, assessmentDetail.metrics.forb_pct],
                            ["Grass", assessmentDetail.metrics.grass_count, assessmentDetail.metrics.grass_pct],
                            ["Sedge", assessmentDetail.metrics.sedge_count, assessmentDetail.metrics.sedge_pct],
                            ["Rush", assessmentDetail.metrics.rush_count, assessmentDetail.metrics.rush_pct],
                            ["Fern", assessmentDetail.metrics.fern_count, assessmentDetail.metrics.fern_pct],
                            ["Bryophyte", assessmentDetail.metrics.bryophyte_count, assessmentDetail.metrics.bryophyte_pct],
                          ] as [string, number | null, number | null][]
                        )
                          .filter(([, count]) => count !== null && count > 0)
                          .map(([label, count, pct]) => (
                            <MetricRow
                              key={label}
                              label={label}
                              value={`${count}${pct !== null ? ` (${pct}%)` : ""}`}
                            />
                          ))}
                      </div>
                    </div>

                    {assessmentDetail.species.length > 0 && (
                      <div className="bg-card border border-border rounded-xl overflow-hidden">
                        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">
                            Observed Species ({assessmentDetail.species.length})
                          </p>
                          <a
                            href={`${apiBase}/api/universal-fqa/assessment/${assessmentDetail.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Raw JSON
                          </a>
                        </div>
                        <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                          <table className="w-full text-sm min-w-[750px]">
                            <thead className="sticky top-0 z-10 bg-muted/90 backdrop-blur-sm border-b border-border">
                              <tr>
                                {[
                                  "Scientific Name",
                                  "Family",
                                  "Acronym",
                                  "Native",
                                  "C",
                                  "W",
                                  "Physiognomy",
                                  "Duration",
                                  "Common Name",
                                ].map((h) => (
                                  <th
                                    key={h}
                                    className="text-left px-3 py-2 text-xs font-semibold text-foreground whitespace-nowrap"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {assessmentDetail.species.map((sp, i) => (
                                <tr
                                  key={sp.scientific_name + i}
                                  className={`border-b border-border last:border-0 ${
                                    i % 2 === 0 ? "" : "bg-muted/20"
                                  }`}
                                >
                                  <td className="px-3 py-2 text-xs font-medium italic text-foreground whitespace-nowrap">
                                    {sp.scientific_name}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-foreground whitespace-nowrap">
                                    {sp.family}
                                  </td>
                                  <td className="px-3 py-2 text-xs font-mono text-muted-foreground">
                                    {sp.acronym}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-center">
                                    <span
                                      className={
                                        sp.native === "native"
                                          ? "text-emerald-700 dark:text-emerald-400 font-medium"
                                          : "text-amber-700 dark:text-amber-400"
                                      }
                                    >
                                      {sp.native === "native" ? "N" : "NN"}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 text-xs font-bold tabular-nums text-foreground text-center">
                                    {sp.c !== null && sp.c !== undefined ? String(sp.c) : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-xs tabular-nums text-foreground text-center">
                                    {sp.w !== null && sp.w !== undefined ? String(sp.w) : "—"}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                                    {sp.physiognomy}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground">
                                    {sp.duration}
                                  </td>
                                  <td className="px-3 py-2 text-xs text-muted-foreground whitespace-nowrap">
                                    {sp.common_name}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <RawPanel
                  title={`Raw API response — /api/universal-fqa/assessment/${viewingAssessment}`}
                  data={assessmentDetailRes}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UniversalFqaPage;
