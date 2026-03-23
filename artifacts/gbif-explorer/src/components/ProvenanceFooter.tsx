import { ExternalLink } from "lucide-react";

export function ProvenanceFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/80 backdrop-blur-md z-50 py-3 px-4 sm:px-6 text-center">
      <p className="text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>Data sourced from GBIF (Global Biodiversity Information Facility)</span>
        <span className="hidden sm:inline">&mdash;</span>
        <span>Licensed CC BY 4.0. Attribution required.</span>
        <a 
          href="https://www.gbif.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
        >
          gbif.org <ExternalLink className="w-3 h-3" />
        </a>
      </p>
    </footer>
  );
}
