export function ProvenanceFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 py-3 px-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 mt-auto">
      <div className="flex items-center gap-2 flex-wrap">
        <span>
          Flora data from{" "}
          <a
            href="https://michiganflora.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Michigan Flora Online (University of Michigan)
          </a>
          .
        </span>
        <span>
          Reznicek, Voss & Walters (2011). For educational and research use with attribution.
        </span>
      </div>
      <span className="text-border hidden sm:inline">FERNS Data Layer · Source #4</span>
    </footer>
  );
}
