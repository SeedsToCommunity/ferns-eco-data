import { useState } from "react";
import { Link } from "wouter";
import { MapPin, Leaf, CalendarDays, Eye, Binoculars, FileJson, ArrowLeft } from "lucide-react";
import { SourceMetadataPanel } from "@/components/SourceMetadataPanel";
import { SourceSummary } from "@/components/SourceSummary";
import { PlaceLookupTab } from "@/components/inat/PlaceLookupTab";
import { SpeciesTab } from "@/components/inat/SpeciesTab";
import { PhenologyTab } from "@/components/inat/PhenologyTab";
import { ObservationsTab } from "@/components/inat/ObservationsTab";

const TABS = [
  { id: "place", label: "Place Lookup", icon: MapPin },
  { id: "species", label: "Species", icon: Leaf },
  { id: "phenology", label: "Phenology", icon: CalendarDays },
  { id: "observations", label: "Observations", icon: Eye },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function InatPage() {
  const [activeTab, setActiveTab] = useState<TabId>("species");

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>("");
  const [selectedPlaceName, setSelectedPlaceName] = useState<string>("");
  const [selectedTaxonId, setSelectedTaxonId] = useState<number | null>(null);
  const [selectedTaxonName, setSelectedTaxonName] = useState<string>("");

  function handlePlaceSelected(placeId: number, placeName: string) {
    setSelectedPlaceId(String(placeId));
    setSelectedPlaceName(placeName);
    setActiveTab("phenology");
  }

  function handleTaxonSelected(taxonId: number, taxonName: string) {
    setSelectedTaxonId(taxonId);
    setSelectedTaxonName(taxonName);
    setActiveTab("phenology");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mr-1">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Sources</span>
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Binoculars className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                iNaturalist Explorer
              </h1>
              <p className="text-xs text-muted-foreground">FERNS Data Layer · Source #3</p>
            </div>
            <a
              href="/source/inat/metadata"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5 bg-muted/50 hover:bg-muted"
            >
              <FileJson className="w-3 h-3" />
              API Metadata
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        <SourceSummary
          metadataApiPath="/api/inat/metadata"
          className="text-sm text-muted-foreground leading-relaxed mb-4"
        />
        {(selectedPlaceId || selectedTaxonId) && (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/60">Pinned for Phenology:</span>
            {selectedTaxonId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                Taxon: {selectedTaxonName || selectedTaxonId}
                <button
                  onClick={() => { setSelectedTaxonId(null); setSelectedTaxonName(""); }}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </span>
            )}
            {selectedPlaceId && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                Place: {selectedPlaceName || selectedPlaceId}
                <button
                  onClick={() => { setSelectedPlaceId(""); setSelectedPlaceName(""); }}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-card text-foreground shadow-sm border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="py-6">
          {activeTab === "place" && (
            <PlaceLookupTab onPlaceSelected={handlePlaceSelected} />
          )}
          {activeTab === "species" && (
            <SpeciesTab onTaxonIdSelected={handleTaxonSelected} />
          )}
          {activeTab === "phenology" && (
            <PhenologyTab
              preloadedTaxonId={selectedTaxonId}
              preloadedTaxonName={selectedTaxonName}
              preloadedPlaceId={selectedPlaceId}
              preloadedPlaceName={selectedPlaceName}
            />
          )}
          {activeTab === "observations" && <ObservationsTab />}
        </div>

        <div className="border-t border-border mt-12 pt-10 pb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">About This Source</h2>
          <SourceMetadataPanel metadataApiPath="/api/inat/metadata" />
        </div>
      </div>
    </div>
  );
}

export default InatPage;
