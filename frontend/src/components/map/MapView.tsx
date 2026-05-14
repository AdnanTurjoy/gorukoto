import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import type { Market } from '@/types';
import { DHAKA_CENTER, PRICE_LEVEL_COLOR, PRICE_LEVEL_LABEL } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { priceRange } from '@/lib/utils';

interface MapViewProps {
  markets: Market[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (latLng: { lat: number; lng: number }) => void;
  pinDraft?: { lat: number; lng: number } | null;
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /** User's current location — rendered as a blue pulsing dot if provided. */
  userLocation?: { lat: number; lng: number } | null;
  /** Optional ref-like callback so a parent can recenter the map programmatically. */
  onReady?: (map: L.Map) => void;
}

// Pin-shape SVG marker with the taka glyph in a white circle.
function priceMarkerIcon(color: string): L.DivIcon {
  const svg = `
    <svg viewBox="0 0 36 46" xmlns="http://www.w3.org/2000/svg" width="36" height="46">
      <defs>
        <filter id="s" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="rgba(0,0,0,0.35)"/>
        </filter>
      </defs>
      <path filter="url(#s)" d="M18 0 C8 0 0 8 0 18 C0 30 18 46 18 46 S36 30 36 18 C36 8 28 0 18 0 Z"
            fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="7.5" fill="white"/>
      <text x="18" y="22.5" text-anchor="middle" fill="${color}" font-size="13" font-weight="700"
            font-family="system-ui, sans-serif">৳</text>
    </svg>`;
  return L.divIcon({
    className: 'gorukoi-marker',
    html: svg,
    iconSize: [36, 46],
    iconAnchor: [18, 46],
    popupAnchor: [0, -42],
  });
}

const draftIcon = L.divIcon({
  className: 'gorukoi-marker',
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:hsl(142 71% 36%);box-shadow:0 0 0 6px hsla(142,71%,36%,.25);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const userLocationIcon = L.divIcon({
  className: 'gorukoi-user-location',
  html: `
    <div style="position:relative;width:18px;height:18px;">
      <div style="position:absolute;inset:0;border-radius:50%;background:#2563eb;border:2.5px solid white;box-shadow:0 1px 4px rgba(0,0,0,.35);"></div>
      <div class="gorukoi-pulse" style="position:absolute;inset:-10px;border-radius:50%;background:rgba(37,99,235,.25);"></div>
    </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickHandler({ onClick }: { onClick?: MapViewProps['onMapClick'] }) {
  useMapEvents({
    click(e) {
      onClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function Recenter({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom);
  }, [center.lat, center.lng, zoom, map]);
  return null;
}

function ExposeMap({ onReady }: { onReady?: (m: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady?.(map);
  }, [map, onReady]);
  return null;
}

export function MapView({
  markets,
  center,
  zoom = 11,
  onMapClick,
  pinDraft,
  selectedId,
  onSelect,
  userLocation,
  onReady,
}: MapViewProps) {
  const navigate = useNavigate();
  const initial = center ?? DHAKA_CENTER;

  const iconFor = useMemo(() => {
    const cache: Record<string, L.DivIcon> = {};
    return (color: string) => (cache[color] ??= priceMarkerIcon(color));
  }, []);

  return (
    <MapContainer
      center={[initial.lat, initial.lng]}
      zoom={zoom}
      scrollWheelZoom
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      {/* CartoDB Voyager — softer, cleaner tiles than vanilla OSM. */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
        maxZoom={19}
      />
      {center && <Recenter center={center} zoom={zoom} />}
      <ClickHandler onClick={onMapClick} />
      {onReady && <ExposeMap onReady={onReady} />}

      {markets.map((m) => {
        const variant = m.priceLevel.toLowerCase() as 'cheap' | 'fair' | 'expensive';
        return (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={iconFor(PRICE_LEVEL_COLOR[m.priceLevel])}
            eventHandlers={{
              click: () => onSelect?.(m.id),
              popupclose: () => {
                if (selectedId === m.id) onSelect?.(null);
              },
            }}
          >
            <Popup>
              <div className="space-y-1 font-bengali text-sm">
                <div className="font-semibold">{m.name}</div>
                <div className="text-muted-foreground">
                  {m.area}, {m.district}
                </div>
                <Badge variant={variant}>{PRICE_LEVEL_LABEL[m.priceLevel]}</Badge>
                <div className="text-xs">{priceRange(m.minPrice, m.maxPrice)}</div>
                <button
                  className="mt-1 text-xs font-medium text-primary underline"
                  onClick={() => navigate(`/markets/${m.id}`)}
                >
                  বিস্তারিত দেখুন →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {pinDraft && <Marker position={[pinDraft.lat, pinDraft.lng]} icon={draftIcon} />}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon} interactive={false} />
      )}
    </MapContainer>
  );
}
