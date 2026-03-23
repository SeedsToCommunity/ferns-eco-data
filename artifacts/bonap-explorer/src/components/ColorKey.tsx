import type { ColorKeyEntry } from "@workspace/api-client-react";

export function ColorKey({ items }: { items: ColorKeyEntry[] }) {
  if (!items || items.length === 0) return null;

  const countyFills = items.filter(i => i.layer === "county_fill");
  const stateBackgrounds = items.filter(i => i.layer === "state_background");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-serif text-lg font-semibold text-foreground">Interpretation Key</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">County Fills</h4>
          <div className="space-y-4">
            {countyFills.map(item => (
              <div key={item.code} className="flex gap-4 items-start group">
                <div 
                  className={`w-6 h-6 rounded border shadow-sm shrink-0 mt-0.5 ${item.code === 'questionable' ? 'bg-stripes' : ''}`}
                  style={item.code !== 'questionable' ? { backgroundColor: item.hex_approx } : { backgroundColor: '#bdbdbd', backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}
                  title={`Approximate Hex: ${item.hex_approx}`}
                />
                <div>
                  <h5 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{item.name}</h5>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">State Backgrounds</h4>
          <div className="space-y-4">
            {stateBackgrounds.map(item => (
              <div key={item.code} className="flex gap-4 items-start group">
                <div 
                  className="w-6 h-6 rounded border shadow-sm shrink-0 mt-0.5"
                  style={{ backgroundColor: item.hex_approx }}
                  title={`Approximate Hex: ${item.hex_approx}`}
                />
                <div>
                  <h5 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{item.name}</h5>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t text-xs text-muted-foreground/80">
        Note: Hex color values are approximate — refer to <a href="http://www.bonap.org/MapKey.html" target="_blank" rel="noreferrer" className="text-primary hover:underline">bonap.org/MapKey.html</a> for BONAP's authoritative key.
      </div>
    </div>
  );
}
