import { useState } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { MapPin, Leaf, CalendarDays, Eye } from "lucide-react";
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
    <SourceExplorerLayout sourceId="inaturalist">
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

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border mb-6">
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

      <div className="py-2">
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
    </SourceExplorerLayout>
  );
}

export default InatPage;
