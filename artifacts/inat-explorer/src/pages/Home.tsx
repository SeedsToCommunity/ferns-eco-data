import { useState } from "react";
import { MapPin, Leaf, CalendarDays, Eye, Binoculars } from "lucide-react";
import { PlaceLookupTab } from "@/components/PlaceLookupTab";
import { SpeciesTab } from "@/components/SpeciesTab";
import { PhenologyTab } from "@/components/PhenologyTab";
import { ObservationsTab } from "@/components/ObservationsTab";

const TABS = [
  { id: "place", label: "Place Lookup", icon: MapPin },
  { id: "species", label: "Species", icon: Leaf },
  { id: "phenology", label: "Phenology", icon: CalendarDays },
  { id: "observations", label: "Observations", icon: Eye },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("species");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Binoculars className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-foreground leading-tight">
                iNaturalist Source Explorer
              </h1>
              <p className="text-xs text-muted-foreground">FERNS Data Layer • Source #3</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
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
          {activeTab === "place" && <PlaceLookupTab />}
          {activeTab === "species" && <SpeciesTab />}
          {activeTab === "phenology" && <PhenologyTab />}
          {activeTab === "observations" && <ObservationsTab />}
        </div>
      </div>
    </div>
  );
}
