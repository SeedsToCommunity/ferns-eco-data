import { useBonapExplorer } from "@/hooks/use-bonap";
import { PermissionModal } from "@/components/PermissionModal";
import { SearchForm } from "@/components/SearchForm";
import { ResultDisplay } from "@/components/ResultDisplay";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export function Home() {
  const { handleSearch, mapQuery, metadataQuery } = useBonapExplorer();

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary pb-24">
      {/* Background Texture Element */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0" 
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/botanical-bg.png)`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      
      {/* Modals & Overlays — always rendered; defaults to blocking if metadata not yet loaded */}
      <PermissionModal 
        permissionGranted={metadataQuery.data?.permission_granted ?? false} 
        permissionStatus={metadataQuery.data?.permission_status ?? "Checking permission status…"} 
      />

      {/* Header */}
      <header className="relative z-10 border-b bg-card/80 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 text-primary">
            <Leaf className="w-6 h-6" />
            <h1 className="font-serif font-bold text-xl text-foreground">
              FERNS <span className="text-muted-foreground font-normal mx-2">|</span> BONAP Explorer
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
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
            Search county-level vascular plant distribution maps compiled from nearly four million vouchered herbarium specimens.
          </p>
        </motion.div>

        <section>
          <SearchForm 
            onSearch={handleSearch} 
            isLoading={mapQuery.isPending && mapQuery.fetchStatus !== 'idle'} 
          />
        </section>

        <section className="pt-4">
          <ResultDisplay 
            isLoading={mapQuery.isPending && mapQuery.fetchStatus !== 'idle'}
            error={mapQuery.error}
            response={mapQuery.data}
          />
        </section>
      </main>
    </div>
  );
}

export default Home;
