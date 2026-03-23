export function ColorKey() {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold text-foreground">Interpretation Key</h3>
      <div className="overflow-x-auto">
        <img
          src="http://www.bonap.org/Help/elements/Color%20Key.gif"
          alt="BONAP map color key showing all status categories: native, exotic, present, rare, adventive, waif, noxious, eradicated, extirpated, questionable, and not present"
          className="max-w-full rounded border shadow-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground/80">
        Source: <a href="http://www.bonap.org/MapKey.html" target="_blank" rel="noreferrer" className="text-primary hover:underline">bonap.org/MapKey.html</a> — BONAP's authoritative color key.
      </p>
    </div>
  );
}
