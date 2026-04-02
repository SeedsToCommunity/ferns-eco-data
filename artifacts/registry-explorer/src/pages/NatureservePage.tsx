import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Shield,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Code,
  Leaf,
  Globe,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = `${BASE_URL}/api`;

type Tab = "species" | "ecosystems";

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
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 p-3">
          <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-all overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function RankBadge({ rank, label }: { rank: string | null; label: string }) {
  if (!rank) return null;
  const color =
    rank.startsWith("G1") || rank.startsWith("S1") || rank.startsWith("N1")
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      : rank.startsWith("G2") || rank.startsWith("S2") || rank.startsWith("N2")
      ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      : rank.startsWith("G3") || rank.startsWith("S3") || rank.startsWith("N3")
      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      : rank.startsWith("G4") || rank.startsWith("S4") || rank.startsWith("N4")
      ? "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300"
      : rank.startsWith("G5") || rank.startsWith("S5") || rank.startsWith("N5")
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-muted text-muted-foreground";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={cn("font-bold text-lg px-3 py-1 rounded-lg", color)}>{rank}</span>
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

interface SpeciesData {
  scientific_name: string | null;
  common_name: string | null;
  global_rank: string | null;
  rounded_global_rank: string | null;
  national_rank: string | null;
  rounded_national_rank: string | null;
  state_code: string;
  state_rank: string | null;
  rounded_state_rank: string | null;
  iucn_category: string | null;
  iucn_description: string | null;
  federal_status: string | null;
  federal_status_description: string | null;
  state_status: string | null;
  cites_description: string | null;
  cosewic_code: string | null;
  cosewic_description: string | null;
  natureserve_url: string | null;
  element_global_id: string | null;
  cache_status: string;
}

interface SpeciesEnvelope {
  source_url: string | null;
  found: boolean;
  attribution: string;
  data: SpeciesData;
  provenance: {
    source_id: string;
    fetched_at: string;
    method: string;
    upstream_url: string;
    derivation_summary: string;
    derivation_scientific: string;
  };
}

interface CharacteristicSpecies {
  scientific_name: string;
  stratum: string | null;
  constancy_percent: number | null;
  cover_class_percent: number | null;
}

interface EcosystemItem {
  system_name: string;
  global_rank: string | null;
  rounded_global_rank: string | null;
  us_national_rank: string | null;
  rounded_us_national_rank: string | null;
  description_excerpt: string | null;
  national_distribution: string | null;
  characteristic_species: CharacteristicSpecies[];
  natureserve_url: string | null;
  element_global_id: string;
  record_type: string;
}

interface EcosystemsEnvelope {
  source_url: string | null;
  found: boolean;
  attribution: string;
  data: {
    ecosystems: EcosystemItem[];
    result_count: number;
    total_results: number;
    cache_status: string;
  };
  provenance: {
    source_id: string;
    fetched_at: string;
    method: string;
    upstream_url: string;
    derivation_summary: string;
    derivation_scientific: string;
  };
}

function SpeciesResultPanel({ result }: { result: SpeciesEnvelope }) {
  const d = result.data;
  if (!result.found || !d.scientific_name) {
    return (
      <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No NatureServe record found for this name.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground italic">{d.scientific_name}</h2>
            {d.common_name && <p className="text-muted-foreground mt-0.5">{d.common_name}</p>}
          </div>
          {d.natureserve_url && (
            <a
              href={d.natureserve_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-primary hover:underline shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              NatureServe Explorer
            </a>
          )}
        </div>

        <div className="flex flex-wrap gap-6 mb-6">
          <RankBadge rank={d.global_rank} label="Global Rank" />
          <RankBadge rank={d.national_rank} label="US National" />
          <RankBadge rank={d.state_rank} label={`${d.state_code} State`} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {d.iucn_category && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">IUCN Red List</div>
              <div className="font-bold text-foreground">{d.iucn_category}</div>
              {d.iucn_description && <div className="text-xs text-muted-foreground mt-0.5">{d.iucn_description}</div>}
            </div>
          )}
          {d.federal_status && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">US ESA Status</div>
              <div className="font-bold text-foreground">{d.federal_status}</div>
              {d.federal_status_description && <div className="text-xs text-muted-foreground mt-0.5">{d.federal_status_description}</div>}
            </div>
          )}
          {d.state_status && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">{d.state_code} State Status</div>
              <div className="text-sm text-foreground font-medium">{d.state_status}</div>
            </div>
          )}
          {d.cites_description && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">CITES</div>
              <div className="text-sm text-foreground font-medium">{d.cites_description}</div>
            </div>
          )}
          {d.cosewic_code && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">COSEWIC (Canada)</div>
              <div className="font-bold text-foreground">{d.cosewic_code}</div>
              {d.cosewic_description && <div className="text-xs text-muted-foreground mt-0.5">{d.cosewic_description}</div>}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground italic">{result.attribution}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Cache: {d.cache_status} · Fetched: {new Date(result.provenance.fetched_at).toLocaleString()}
          </p>
        </div>
      </div>

      <RawPanel title="Raw API response" data={result} />
    </div>
  );
}

function EcosystemCard({ item }: { item: EcosystemItem }) {
  const [expanded, setExpanded] = useState(false);
  const [showSpecies, setShowSpecies] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-snug italic">{item.system_name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{item.element_global_id}</p>
        </div>
        {item.natureserve_url && (
          <a
            href={item.natureserve_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-primary hover:underline shrink-0"
          >
            <ExternalLink className="w-3 h-3" />
            Explorer
          </a>
        )}
      </div>

      <div className="flex gap-4 mb-3">
        <RankBadge rank={item.global_rank} label="Global" />
        <RankBadge rank={item.us_national_rank} label="US" />
      </div>

      {item.description_excerpt && (
        <div className="mb-2">
          <p className={cn("text-xs text-muted-foreground leading-relaxed", !expanded && "line-clamp-3")}>
            {item.description_excerpt}
          </p>
          {item.description_excerpt.length > 200 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary hover:underline mt-1"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      )}

      {item.national_distribution && (
        <div className="mb-2 border-t border-border/30 pt-2">
          <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">National Distribution</div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{item.national_distribution}</p>
        </div>
      )}

      {item.characteristic_species && item.characteristic_species.length > 0 && (
        <div className="border-t border-border/30 pt-2">
          <button
            onClick={() => setShowSpecies(!showSpecies)}
            className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors mb-1"
          >
            {showSpecies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            Characteristic Species ({item.characteristic_species.length})
          </button>
          {showSpecies && (
            <ul className="space-y-0.5 mt-1">
              {item.characteristic_species.slice(0, 12).map((s, i) => (
                <li key={i} className="flex items-baseline gap-2 text-xs">
                  <span className="italic text-foreground">{s.scientific_name}</span>
                  {s.stratum && <span className="text-muted-foreground text-[10px]">{s.stratum}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function EcosystemsResultPanel({ result }: { result: EcosystemsEnvelope }) {
  const d = result.data;
  if (!result.found || d.ecosystems.length === 0) {
    return (
      <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
        <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-muted-foreground">No ecological systems found for this query.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Found {d.result_count} ecological system{d.result_count !== 1 ? "s" : ""} · Cache: {d.cache_status}
      </p>
      <div className="grid gap-3">
        {d.ecosystems.map((item, i) => (
          <EcosystemCard key={i} item={item} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground italic">{result.attribution}</p>
      <RawPanel title="Raw API response" data={result} />
    </div>
  );
}

export function NatureservePage() {
  const [activeTab, setActiveTab] = useState<Tab>("species");
  const [nameInput, setNameInput] = useState("");
  const [stateInput, setStateInput] = useState("MI");

  const [speciesQuery, setSpeciesQuery] = useState<{ name: string; state: string } | null>(null);
  const [ecosystemsQuery, setEcosystemsQuery] = useState<string | null>(null);

  const [speciesResult, setSpeciesResult] = useState<SpeciesEnvelope | null>(null);
  const [ecosystemsResult, setEcosystemsResult] = useState<EcosystemsEnvelope | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;

    setLoading(true);
    setError(null);
    setSpeciesResult(null);
    setEcosystemsResult(null);

    try {
      if (activeTab === "species") {
        const state = stateInput.trim().toUpperCase() || "MI";
        setSpeciesQuery({ name, state });
        const url = `${API_BASE}/natureserve/species?name=${encodeURIComponent(name)}&state=${encodeURIComponent(state)}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        const data = (await r.json()) as SpeciesEnvelope;
        setSpeciesResult(data);
      } else {
        setEcosystemsQuery(name);
        const url = `${API_BASE}/natureserve/ecosystems?name=${encodeURIComponent(name)}`;
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
        const data = (await r.json()) as EcosystemsEnvelope;
        setEcosystemsResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <header className="bg-gradient-to-b from-primary/10 to-background pt-6 pb-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Sources</span>
            </Link>
          </div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg shadow-primary/20">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground">NatureServe Explorer</h1>
                <p className="text-primary font-medium flex items-center gap-2 mt-1">
                  <Globe className="w-4 h-4" /> Conservation Status &amp; Ecological Systems
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/source/natureserve/metadata"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5 bg-muted/50 hover:bg-muted"
              >
                <ExternalLink className="w-3 h-3" />
                API Metadata
              </Link>
              <a
                href="https://explorer.natureserve.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">NatureServe Explorer</span>
              </a>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            NatureServe is the authoritative global conservation status authority for species and ecosystems across
            the Americas. Data from 80+ Natural Heritage Programs. G-ranks, N-ranks, S-ranks, IUCN Red List,
            and US ESA status for species; global ecological systems classification for natural communities.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
          <button
            onClick={() => { setActiveTab("species"); setNameInput(""); setError(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "species" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Leaf className="w-4 h-4" />
              Species Status
            </span>
          </button>
          <button
            onClick={() => { setActiveTab("ecosystems"); setNameInput(""); setError(null); }}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "ecosystems" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Ecological Systems
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder={activeTab === "species" ? "e.g. Platanthera leucophaea" : "e.g. lakeplain prairie"}
              className="h-11"
            />
          </div>
          {activeTab === "species" && (
            <Input
              value={stateInput}
              onChange={(e) => setStateInput(e.target.value)}
              placeholder="State (e.g. MI)"
              className="h-11 w-24"
              maxLength={2}
            />
          )}
          <Button type="submit" disabled={loading || !nameInput.trim()} className="h-11 px-6">
            <Search className="w-4 h-4 mr-2" />
            {loading ? "Searching…" : "Search"}
          </Button>
        </form>

        {activeTab === "species" && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["Platanthera leucophaea", "Lupinus perennis", "Cirsium pitcheri"].map((name) => (
              <button
                key={name}
                onClick={() => { setNameInput(name); }}
                className="px-2.5 py-1 bg-muted/60 hover:bg-muted rounded-full border border-border/50 text-foreground/70 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {activeTab === "ecosystems" && (
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            {["lakeplain prairie", "Great Lakes marsh", "oak savanna"].map((name) => (
              <button
                key={name}
                onClick={() => { setNameInput(name); }}
                className="px-2.5 py-1 bg-muted/60 hover:bg-muted rounded-full border border-border/50 text-foreground/70 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {speciesResult && activeTab === "species" && (
          <div>
            {speciesQuery && (
              <p className="text-xs text-muted-foreground mb-3">
                Results for <strong className="italic">{speciesQuery.name}</strong> · State: {speciesQuery.state}
              </p>
            )}
            <SpeciesResultPanel result={speciesResult} />
          </div>
        )}

        {ecosystemsResult && activeTab === "ecosystems" && (
          <div>
            {ecosystemsQuery && (
              <p className="text-xs text-muted-foreground mb-3">
                Ecosystems matching <strong>"{ecosystemsQuery}"</strong>
              </p>
            )}
            <EcosystemsResultPanel result={ecosystemsResult} />
          </div>
        )}

        {!loading && !speciesResult && !ecosystemsResult && !error && (
          <div className="text-center py-16 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {activeTab === "species"
                ? "Search a species to see its global, national, and state conservation status from NatureServe."
                : "Search for ecological systems / natural communities by name."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
