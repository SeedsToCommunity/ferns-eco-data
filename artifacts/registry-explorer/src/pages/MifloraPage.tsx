import { useState } from "react";
import {
  useGetMifloraCounties,
  useGetMifloraImages,
  useGetMifloraFloraSearch,
  useGetMifloraSpecText,
  useGetMifloraSynonyms,
  useGetMifloraPImageInfo,
  getGetMifloraCountiesQueryKey,
  getGetMifloraImagesQueryKey,
} from "@workspace/api-client-react";
import { SourceExplorerLayout } from "@/components/SourceExplorerLayout";
import {
  Search, Loader2, MapPin, ExternalLink, Code, ChevronDown, ChevronUp,
  Camera, ImageOff, BookOpen, GitMerge, Leaf
} from "lucide-react";
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

function MetaBadge({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function MifloraPage() {
  const [nameInput, setNameInput] = useState("");
  const [query, setQuery] = useState("");

  const enabled = !!query;
  const nameParams = { name: query };

  const { data: floraRes, isLoading: floraLoading } = useGetMifloraFloraSearch(
    nameParams,
    { query: { enabled } }
  );

  const plantId = floraRes?.data?.plant_id ?? null;
  const plantIdEnabled = enabled && plantId != null;
  const idParams = { id: plantId ?? 0 };

  const { data: specTextRes, isLoading: specTextLoading } = useGetMifloraSpecText(
    idParams,
    { query: { enabled: plantIdEnabled } }
  );
  const { data: synonymsRes, isLoading: synonymsLoading } = useGetMifloraSynonyms(
    idParams,
    { query: { enabled: plantIdEnabled } }
  );
  const { data: pimageRes, isLoading: pimageLoading } = useGetMifloraPImageInfo(
    idParams,
    { query: { enabled: plantIdEnabled } }
  );
  const { data: countiesRes, isLoading: countiesLoading } = useGetMifloraCounties(
    nameParams,
    { query: { enabled, queryKey: getGetMifloraCountiesQueryKey(nameParams) } }
  );
  const { data: imagesRes, isLoading: imagesLoading } = useGetMifloraImages(
    nameParams,
    { query: { enabled, queryKey: getGetMifloraImagesQueryKey(nameParams) } }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(nameInput.trim());
  }

  function runSearch(name: string) {
    setNameInput(name);
    setQuery(name);
  }

  const speciesData = floraRes?.data;
  const countyData = countiesRes?.data as Record<string, unknown> | null | undefined;
  const locations = Array.isArray(countyData?.locations) ? (countyData!.locations as string[]) : [];
  const images = (imagesRes?.data ?? []) as MifloraImageRecord[];
  const synonyms = synonymsRes?.data?.synonyms ?? [];
  const specText = specTextRes?.data?.text ?? null;
  const primaryImage = pimageRes?.data?.image ?? null;

  const isLoading = floraLoading || countiesLoading || imagesLoading;
  const hasResult = !!floraRes || !!countiesRes || !!imagesRes;

  const naLabel = speciesData?.na === "N" ? "Native" : speciesData?.na === "A" ? "Adventive (non-native)" : speciesData?.na ?? null;

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

            {/* Species metadata */}
            {(floraRes || floraLoading) && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    Species Overview
                    {floraLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                    {speciesData?.plant_id && (
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        plant_id: {speciesData.plant_id}
                      </span>
                    )}
                  </h3>
                </div>
                {speciesData ? (
                  <div className="p-5 space-y-4">
                    {/* Primary image inline */}
                    {(primaryImage || pimageLoading) && (
                      <div className="flex gap-4">
                        {pimageLoading ? (
                          <div className="w-28 h-28 rounded-lg bg-muted/40 flex items-center justify-center flex-shrink-0">
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : primaryImage ? (
                          <div className="flex-shrink-0">
                            <a href={primaryImage.image_url} target="_blank" rel="noopener noreferrer" title="Open full size">
                              <img
                                src={primaryImage.thumbnail_url}
                                alt={primaryImage.image_name ?? query}
                                className="w-28 h-28 object-cover rounded-lg border border-border shadow-sm hover:opacity-90 transition-opacity"
                              />
                            </a>
                            {primaryImage.photographer && (
                              <p className="text-[10px] text-muted-foreground mt-1 text-center truncate w-28">
                                © {primaryImage.photographer}
                              </p>
                            )}
                          </div>
                        ) : null}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-3 flex-1">
                          <MetaBadge label="Family" value={speciesData.family_name} />
                          <MetaBadge label="Native Status" value={naLabel} />
                          <MetaBadge label="C-value" value={speciesData.c} />
                          <MetaBadge label="Wetland Indicator" value={speciesData.wet} />
                          <MetaBadge label="Physiognomy" value={speciesData.phys} />
                          <MetaBadge label="Acronym" value={(floraRes?.data?.records?.[0] as { acronym?: string | null } | undefined)?.acronym} />
                        </div>
                      </div>
                    )}
                    {(!primaryImage && !pimageLoading) && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
                        <MetaBadge label="Family" value={speciesData.family_name} />
                        <MetaBadge label="Native Status" value={naLabel} />
                        <MetaBadge label="C-value" value={speciesData.c} />
                        <MetaBadge label="Wetland Indicator" value={speciesData.wet} />
                        <MetaBadge label="Physiognomy" value={speciesData.phys} />
                      </div>
                    )}
                    {speciesData.common_name && speciesData.common_name.length > 0 && (
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Common Names</p>
                        <p className="text-sm text-foreground">{speciesData.common_name.join(", ")}</p>
                      </div>
                    )}
                    {floraRes?.source_url && (
                      <a
                        href={floraRes.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on Michigan Flora
                      </a>
                    )}
                  </div>
                ) : floraRes && !floraRes.found ? (
                  <div className="p-5 text-sm text-muted-foreground">Species not found in Michigan Flora.</div>
                ) : null}
              </div>
            )}

            {/* Botanical description */}
            {(specTextRes || specTextLoading) && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Botanical Description
                    {specTextLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                  </h3>
                </div>
                {specText ? (
                  <div
                    className="p-5 prose prose-sm max-w-none text-sm text-foreground/90 [&_p]:mb-2 [&_b]:font-semibold [&_i]:italic"
                    dangerouslySetInnerHTML={{ __html: specText }}
                  />
                ) : specTextRes && !specTextRes.found ? (
                  <div className="p-5 text-sm text-muted-foreground">No description available.</div>
                ) : null}
              </div>
            )}

            {/* Synonyms */}
            {(synonymsRes || synonymsLoading) && (
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-primary" />
                    Taxonomic Synonyms
                    {synonymsLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground ml-auto" />}
                    {!synonymsLoading && synonymsRes && (
                      <span className="ml-auto text-xs font-normal text-muted-foreground">
                        {synonyms.length} {synonyms.length === 1 ? "synonym" : "synonyms"}
                      </span>
                    )}
                  </h3>
                </div>
                {synonymsRes && synonyms.length > 0 ? (
                  <div className="p-5">
                    <ul className="space-y-1">
                      {synonyms.map((s, i) => (
                        <li key={i} className="text-sm text-foreground/90">
                          <span className="italic">{s.synonym}</span>
                          {s.author && <span className="text-muted-foreground ml-1.5 text-xs">{s.author}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : synonymsRes && !synonymsRes.found ? (
                  <div className="p-5 text-sm text-muted-foreground">No synonyms on record.</div>
                ) : null}
              </div>
            )}

            {/* Photo gallery */}
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

            {/* County presence */}
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

            <RawPanel title="Raw flora_search_sp JSON" data={floraRes} />
            <RawPanel title="Raw spec_text JSON" data={specTextRes} />
            <RawPanel title="Raw synonyms JSON" data={synonymsRes} />
            <RawPanel title="Raw pimage_info JSON" data={pimageRes} />
            <RawPanel title="Raw images JSON" data={imagesRes} />
            <RawPanel title="Raw counties JSON" data={countiesRes} />
          </div>
        )}

      </div>
    </SourceExplorerLayout>
  );
}
