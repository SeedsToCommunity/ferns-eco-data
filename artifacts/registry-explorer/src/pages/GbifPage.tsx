import { useState, type FormEvent } from "react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { Search, Leaf } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScientificMatchPanel } from "@/components/gbif/ScientificMatchPanel";
import { CommonSearchPanel } from "@/components/gbif/CommonSearchPanel";

type Tab = "scientific" | "common";

export function GbifPage() {
  const [activeTab, setActiveTab] = useState<Tab>("scientific");
  const [inputValue, setInputValue] = useState("");
  const [scientificQuery, setScientificQuery] = useState("");
  const [commonQuery, setCommonQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) return;
    if (activeTab === "scientific") {
      setScientificQuery(val);
    } else {
      setCommonQuery(val);
    }
  };

  const handleSelectFromCommon = (canonicalName: string) => {
    setActiveTab("scientific");
    setInputValue(canonicalName);
    setScientificQuery(canonicalName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <SourceExplorerLayout sourceId="gbif">
      <div className="bg-card rounded-2xl shadow-sm border border-border/60 p-2 mb-8">
        <div className="flex gap-2 p-1 bg-muted/50 rounded-xl mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("scientific")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "scientific"
                ? "bg-card text-foreground shadow shadow-black/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Scientific Name Lookup
          </button>
          <button
            onClick={() => setActiveTab("common")}
            className={cn(
              "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === "common"
                ? "bg-card text-foreground shadow shadow-black/5"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            Common Name Search
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3 p-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={activeTab === "scientific" ? "e.g. Asclepias tuberosa" : "e.g. butterfly milkweed"}
              className="pl-12 h-14 text-lg bg-muted/30 border-transparent focus-visible:bg-background shadow-inner"
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8 text-lg shrink-0">
            Query GBIF
          </Button>
        </form>
      </div>

      <div className="min-h-[400px]">
        {activeTab === "scientific" && scientificQuery ? (
          <ScientificMatchPanel scientificName={scientificQuery} />
        ) : activeTab === "common" && commonQuery ? (
          <CommonSearchPanel query={commonQuery} onSelectCanonical={handleSelectFromCommon} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground opacity-50 py-20">
            <Leaf className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Enter a search query above to begin exploring GBIF data.</p>
          </div>
        )}
      </div>
    </SourceExplorerLayout>
  );
}

export default GbifPage;
