import { useState } from "react";
import { useGetMifloraCounties, useGetMifloraImages, getGetMifloraCountiesQueryKey, getGetMifloraImagesQueryKey } from "@workspace/api-client-react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import { Search, Loader2, MapPin, ExternalLink, Code, ChevronDown, ChevronUp, Camera, ImageOff } from "lucide-react";
import type { MifloraImageRecord } from "@workspace/api-client-react";

function RawPanel({ title, data }: { title: string; data: unknown }) {
  const [open, setOpen] = useState(false);
  if (!data) return null;
  return (
    <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/30">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Code className="w-3.5 h-3.5" />
          {title}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="border-t border-border/50 p-3">
          <pre className="text-[10px] font-mono leading-relaxed bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg overflow-x-auto max-h-80 overflow-y-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ images, speciesName }: { images: MifloraImageRecord[]; speciesName: string }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [errored, setErrored] = useState<Set<string>>(new Set());

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
        <ImageOff className="w-8 h-8 opacity-40" />
        <p className="text-sm">No images available</p>
      </div>
    );
  }

  const selected = selectedIdx !== null ? images[selectedIdx] : null;

  return (
    <div className="space-y-3">
      {selected && (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden bg-muted/30 border border-border">
            {errored.has(selected.image_url) ? (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-xs gap-2">
                <ImageOff className="w-5 h-5" />
                Image unavailable
              </div>
            ) : (
              <img
                src={selected.image_url}
                alt={selected.image_name ?? speciesName}
                className="w-full max-h-72 object-contain"
                loading="lazy"
                onError={() => setErrored((prev) => new Set([...prev, selected.image_url]))}
              />
            )}
            <a
              href={selected.image_url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors border border-border/50"
              title="Open full size"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {(selected.caption || selected.photographer || selected.image_name) && (
            <div className="text-xs text-muted-foreground space-y-0.5 px-1">
              {selected.image_name && (
                <p className="font-medium text-foreground/70 italic">{selected.image_name}</p>
              )}
              {selected.caption && <p>{selected.caption}</p>}
              {selected.photographer && (
                <p className="flex items-center gap-1">
                  <Camera className="w-3 h-3" />
                  {selected.photographer}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-4 gap-1.5">
        {images.map((img, idx) => {
          const isSelected = selectedIdx === idx;
          const hasError = errored.has(img.thumbnail_url);
          return (
            <button
              key={String(img.image_id)}
              onClick={() => setSelectedIdx(isSelected ? null : idx)}
              className={`relative rounded-md overflow-hidden border-2 transition-all aspect-square bg-muted/30 ${
                isSelected ? "border-primary ring-1 ring-primary" : "border-transparent hover:border-border"
              }`}
              title={img.image_name ?? `Image ${idx + 1}`}
            >
              {hasError ? (
                <div className="flex items-center justify-center w-full h-full">
                  <ImageOff className="w-4 h-4 text-muted-foreground/40" />
                </div>
              ) : (
                <img
                  src={img.thumbnail_url}
                  alt={img.image_name ?? `Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setErrored((prev) => new Set([...prev, img.thumbnail_url]))}
                />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground px-1">
        {images.length} photo{images.length !== 1 ? "s" : ""} · Click thumbnail to preview · Click{" "}
        <ExternalLink className="inline w-3 h-3" /> for full size
      </p>
    </div>
  );
}

export function MifloraPage() {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;
  const mifloraParams = { name: query };

  const { data: countiesRes, isLoading: countiesLoading } = useGetMifloraCounties(
    mifloraParams,
    { query: { enabled, queryKey: getGetMifloraCountiesQueryKey(mifloraParams) } }
  );
  const { data: imagesRes, isLoading: imagesLoading } = useGetMifloraImages(
    mifloraParams,
    { query: { enabled, queryKey: getGetMifloraImagesQueryKey(mifloraParams) } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(nameInput.trim());
  }

  function runSearch(name: string) {
    setNameInput(name);
    setQuery(name);
  }

  const countyData = countiesRes?.data as Record<string, unknown> | null | undefined;
  const locations = Array.isArray(countyData?.locations) ? (countyData!.locations as string[]) : [];

  const images = (imagesRes?.data ?? []) as MifloraImageRecord[];

  const isLoading = countiesLoading || imagesLoading;
  const hasResult = !!countiesRes || !!imagesRes;

  return (
    <SourceExplorerLayout sourceId="michigan-flora">
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Quercus rubra, Trillium grandiflorum"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              disabled={!nameInput.trim() || isLoading}
              className="px-5 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Search
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3">
            Try:{" "}
            {["Quercus rubra", "Trillium grandiflorum", "Asclepias tuberosa"].map((name, i) => (
              <span key={name}>
                {i > 0 && " • "}
                <button onClick={() => runSearch(name)} className="underline text-primary hover:no-underline">
                  {name}
                </button>
              </span>
            ))}
          </p>
        </div>

        {hasResult && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    Photo Gallery
                    {imagesLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                    {!imagesLoading && imagesRes && (
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        {images.length} photo{images.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </h3>
                </div>
                <div className="p-4">
                  {imagesRes ? (
                    <ImageGallery images={images} speciesName={query} />
                  ) : imagesLoading ? null : (
                    <p className="text-sm text-muted-foreground">No photo data loaded.</p>
                  )}
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    County Presence
                    {countiesLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                  </h3>
                </div>

                {countiesRes?.found && locations.length > 0 ? (
                  <div className="p-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {locations.sort().map((county) => (
                        <span key={county} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                          <MapPin className="w-2.5 h-2.5" />
                          {county}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((locations.length / 83) * 100)}% of Michigan counties have confirmed presence.
                    </p>
                  </div>
                ) : countiesRes && !countiesRes.found ? (
                  <div className="p-5 text-sm text-muted-foreground">No county records found.</div>
                ) : null}
              </div>

            <RawPanel title="Raw images JSON" data={imagesRes} />
            <RawPanel title="Raw counties JSON" data={countiesRes} />
          </div>
        )}

      </div>
    </SourceExplorerLayout>
  );
}

export default MifloraPage;
