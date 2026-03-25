export function ProvenanceFooter() {
  return (
    <footer className="border-t border-border bg-muted/40 py-3 px-6 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2 mt-auto">
      <div className="flex items-center gap-2 flex-wrap">
        <span>
          Observations from{" "}
          <a
            href="https://www.inaturalist.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            iNaturalist (inaturalist.org)
          </a>
          .
        </span>
        <span>
          Species descriptions from{" "}
          <a
            href="https://www.wikipedia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            Wikipedia
          </a>
          .
        </span>
      </div>
      <span className="text-border hidden sm:inline">FERNS Data Layer · Source #3</span>
    </footer>
  );
}
