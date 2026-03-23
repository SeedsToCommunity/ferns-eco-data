import { useState, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Rectangle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface BboxValues {
  minLat: string;
  minLon: string;
  maxLat: string;
  maxLon: string;
}

interface BboxMapPickerProps {
  bbox: BboxValues;
  onChange: (bbox: BboxValues) => void;
}

type LayerId = "osm" | "esri-imagery" | "esri-topo";

const LAYERS: { id: LayerId; label: string; url: string; attribution: string }[] = [
  {
    id: "osm",
    label: "OSM",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  {
    id: "esri-imagery",
    label: "Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  },
  {
    id: "esri-topo",
    label: "Topo",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
  },
];

function parseBbox(bbox: BboxValues): [[number, number], [number, number]] | null {
  const minLat = parseFloat(bbox.minLat);
  const minLon = parseFloat(bbox.minLon);
  const maxLat = parseFloat(bbox.maxLat);
  const maxLon = parseFloat(bbox.maxLon);
  if ([minLat, minLon, maxLat, maxLon].some(isNaN)) return null;
  if (minLat >= maxLat || minLon >= maxLon) return null;
  return [
    [minLat, minLon],
    [maxLat, maxLon],
  ];
}

function DrawHandler({ onDraw }: { onDraw: (sw: L.LatLng, ne: L.LatLng) => void }) {
  const corner1 = useRef<L.LatLng | null>(null);

  useMapEvents({
    mousedown(e) {
      e.originalEvent.preventDefault();
      e.target.dragging.disable();
      corner1.current = e.latlng;
    },
    mouseup(e) {
      e.target.dragging.enable();
      if (corner1.current) {
        const c1 = corner1.current;
        const c2 = e.latlng;
        const sw = L.latLng(Math.min(c1.lat, c2.lat), Math.min(c1.lng, c2.lng));
        const ne = L.latLng(Math.max(c1.lat, c2.lat), Math.max(c1.lng, c2.lng));
        if (Math.abs(sw.lat - ne.lat) > 0.01 && Math.abs(sw.lng - ne.lng) > 0.01) {
          onDraw(sw, ne);
        }
        corner1.current = null;
      }
    },
  });

  return null;
}

export function BboxMapPicker({ bbox, onChange }: BboxMapPickerProps) {
  const [activeLayer, setActiveLayer] = useState<LayerId>("osm");
  const layer = LAYERS.find((l) => l.id === activeLayer)!;
  const bounds = parseBbox(bbox);

  const handleDraw = useCallback(
    (sw: L.LatLng, ne: L.LatLng) => {
      onChange({
        minLat: sw.lat.toFixed(4),
        minLon: sw.lng.toFixed(4),
        maxLat: ne.lat.toFixed(4),
        maxLon: ne.lng.toFixed(4),
      });
    },
    [onChange],
  );

  const center: [number, number] = bounds
    ? [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2]
    : [38.5, -96.0];

  return (
    <div className="space-y-2">
      {/* Layer Toggle */}
      <div className="flex items-center gap-1 flex-wrap">
        <span className="text-xs text-muted-foreground mr-1">Base layer:</span>
        {LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setActiveLayer(l.id)}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
              activeLayer === l.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-muted"
            }`}
          >
            {l.label}
          </button>
        ))}
        <span className="text-[10px] text-muted-foreground ml-2 italic">
          Click and drag on the map to draw a bounding box
        </span>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-border" style={{ height: 280 }}>
        <MapContainer
          center={center}
          zoom={3}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer url={layer.url} attribution={layer.attribution} key={layer.id} />
          {bounds && (
            <Rectangle
              bounds={bounds}
              pathOptions={{ color: "hsl(var(--primary, 200 100% 40%))", weight: 2, fillOpacity: 0.15 }}
            />
          )}
          <DrawHandler onDraw={handleDraw} />
        </MapContainer>
      </div>
    </div>
  );
}
