interface ColorKeyProps {
  imageUrl: string;
  pageUrl: string;
}

export function ColorKey({ imageUrl, pageUrl }: ColorKeyProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg font-semibold text-foreground">Interpretation Key</h3>
      <div className="overflow-x-auto">
        <img
          src={imageUrl}
          alt="BONAP map color key showing all status categories: native, exotic, present, rare, adventive, waif, noxious, eradicated, extirpated, questionable, and not present"
          className="max-w-full rounded border shadow-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground/80">
        Source: <a href={pageUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">{pageUrl}</a> — BONAP's authoritative color key.
      </p>
    </div>
  );
}
