import { useState } from "react";
import { Link } from "wouter";
import { useBonapExplorer } from "@/hooks/use-bonap";
import { SourceMetadataPanel } from "@/components/SourceMetadataPanel";
import { PermissionModal } from "@/components/bonap/PermissionModal";
import { SearchForm } from "@/components/bonap/SearchForm";
import { ResultDisplay } from "@/components/bonap/ResultDisplay";
import { motion } from "framer-motion";
import { ArrowLeft, Leaf, FileJson } from "lucide-react";

export function BonapPage() {
  const [acknowledged, setAcknowledged] = useState(false);
  const { handleSearch, mapQuery, metadataQuery } = useBonapExplorer();

  const permissionGranted = metadataQuery.data?.permission_granted ?? false;
  const permissionStatus = metadataQuery.data?.permission_status ?? "Checking permission status…";

  const canAccess = permissionGranted || acknowledged;

  if (!canAccess) {
    return (
      <PermissionModal
        permissionGranted={permissionGranted}
        permissionStatus={permissionStatus}
        onAcknowledge={() => setAcknowledged(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary pb-24">
      <div
        className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/botanical-bg.png)`, backgroundSize: "cover", backgroundPosition: "center" }}
      />

      <header className="relative z-10 border-b bg-card/80 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Sources</span>
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <div className="flex items-center gap-2 text-primary">
              <Leaf className="w-5 h-5" />
              <h1 className="font-serif font-bold text-lg text-foreground">BONAP Explorer</h1>
            </div>
          </div>
          <a
            href="/source/bonap/metadata"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-md px-2.5 py-1.5 bg-muted/50 hover:bg-muted"
          >
            <FileJson className="w-3 h-3" />
            API Metadata
          </a>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground tracking-tight mb-4">
            North American Plant Atlas
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Search county-level and state/continental vascular plant distribution maps compiled from nearly four million vouchered herbarium specimens.
          </p>
        </motion.div>

        <section>
          <SearchForm
            onSearch={handleSearch}
            isLoading={mapQuery.isPending && mapQuery.fetchStatus !== "idle"}
          />
        </section>

        <section className="pt-4">
          <ResultDisplay
            isLoading={mapQuery.isPending && mapQuery.fetchStatus !== "idle"}
            error={mapQuery.error}
            response={mapQuery.data}
          />
        </section>

        <section className="border-t border-border mt-12 pt-10 pb-12">
          <h2 className="text-xl font-bold text-foreground mb-6">About This Source</h2>
          <SourceMetadataPanel metadataApiPath="/api/bonap/metadata" />
        </section>
      </main>
    </div>
  );
}

export default BonapPage;
