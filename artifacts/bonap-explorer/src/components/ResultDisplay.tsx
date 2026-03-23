import { motion } from "framer-motion";
import { AlertCircle, ExternalLink, Leaf, Map as MapIcon } from "lucide-react";
import type { BonapMapResponse, GetBonapMapQueryError } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { ColorKey } from "./ColorKey";
import { ProvenancePanel } from "./ProvenancePanel";

interface ResultDisplayProps {
  isLoading: boolean;
  error: GetBonapMapQueryError | null;
  response?: BonapMapResponse;
}

export function ResultDisplay({ isLoading, error, response }: ResultDisplayProps) {
  if (isLoading) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-muted-foreground animate-pulse">
        <Leaf className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-lg">Querying BONAP archives...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 md:p-8"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-destructive mb-1">Query Failed</h3>
            <p className="text-destructive/80">
              {error.message || "An error occurred while contacting the BONAP service."}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!response) return null;

  const { found, data, source_url } = response;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-foreground">
          Result for <span className="italic text-primary">{data?.genus} {data?.species}</span>
        </h2>
        {source_url && (
          <Button variant="outline" asChild className="hover-elevate">
            <a href={source_url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
              View this species on BONAP's website <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>

      {/* Warning Banner */}
      {data?.data_vintage && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3 text-amber-900 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium leading-relaxed">
            BONAP distribution data was last updated December 15, 2014. Distribution records reflect knowledge as of that date.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        {found && data?.map_url ? (
          <div className="p-2 md:p-6 bg-secondary/10 flex justify-center">
            {/* The Map Image */}
            <div className="relative rounded-xl overflow-hidden shadow-md border bg-white max-w-4xl w-full">
              <img 
                src={data.map_url} 
                alt={`BONAP distribution map for ${data.genus} ${data.species || ''}`} 
                className="w-full h-auto object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-muted-foreground">
              <MapIcon className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">No BONAP map found</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              No map was found for <span className="italic">{data?.genus} {data?.species}</span>. 
              This species may not be in the North American Plant Atlas, or may be listed under a different name.
            </p>
          </div>
        )}

        {/* Color Key */}
        {data?.color_key_url && (
          <div className="p-6 md:p-8 border-t bg-background">
            <ColorKey pageUrl={data.color_key_url} />
          </div>
        )}
      </div>

      {/* Provenance */}
      <ProvenancePanel response={response} />

      {/* Raw API Response */}
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-semibold text-foreground">Raw API Response</h3>
        <pre className="bg-secondary/30 border rounded-2xl p-6 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all text-foreground/80">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
      
    </motion.div>
  );
}
