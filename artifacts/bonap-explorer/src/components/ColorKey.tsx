interface ColorKeyProps {
  pageUrl: string;
}

export function ColorKey({ pageUrl }: ColorKeyProps) {
  const imgSrc = `${import.meta.env.BASE_URL}bonap-color-key.gif`;

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold text-foreground">Interpretation Key</h3>
      <div className="overflow-x-auto">
        <img
          src={imgSrc}
          alt="BONAP map color key showing all status categories: native, exotic, present, rare, adventive, waif, noxious, eradicated, extirpated, questionable, and not present"
          className="max-w-full rounded border shadow-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground/80">
        Source: <a href={pageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{pageUrl}</a> — BONAP's authoritative color key.
        <span className="ml-1">(Image cached locally — BONAP origin is HTTP-only.)</span>
      </p>
    </div>
  );
}
