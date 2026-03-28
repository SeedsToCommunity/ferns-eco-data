import { useState } from "react";
import { Leaf, MapPin, Database } from "lucide-react";
import { SpeciesTab } from "@/components/SpeciesTab";
import { CountiesTab } from "@/components/CountiesTab";
import { MetadataTab } from "@/components/MetadataTab";

type Tab = "species" | "counties" | "metadata";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("species");
  const [selectedPlantId, setSelectedPlantId] = useState<number | null>(null);
  const [selectedPlantName, setSelectedPlantName] = useState<string>("");

  function handlePlantIdSelected(plantId: number, name: string) {
    setSelectedPlantId(plantId);
    setSelectedPlantName(name);
    setActiveTab("counties");
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "species", label: "Species", icon: <Leaf className="w-4 h-4" /> },
    { id: "counties", label: "Counties", icon: <MapPin className="w-4 h-4" /> },
    { id: "metadata", label: "Source Info", icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
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
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors -mb-px border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "species" && (
          <SpeciesTab onPlantIdSelected={handlePlantIdSelected} />
        )}
        {activeTab === "counties" && (
          <CountiesTab
            initialPlantId={selectedPlantId ?? undefined}
            initialPlantName={selectedPlantName || undefined}
          />
        )}
        {activeTab === "metadata" && <MetadataTab />}
      </div>
    </div>
  );
}
