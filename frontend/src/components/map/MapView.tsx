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
}

function priceMarkerIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'gorukoi-marker',
    html: `<div style="background:${color};border:2px solid white;width:36px;height:36px;border-radius:9999px;display:grid;place-items:center;color:white;font-weight:700;font-size:12px;box-shadow:0 4px 8px rgba(0,0,0,.25)">৳</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -32],
  });
}

const draftIcon = L.divIcon({
  className: 'gorukoi-marker',
  html: `<div style="width:18px;height:18px;border-radius:9999px;background:hsl(142 71% 36%);box-shadow:0 0 0 6px hsla(142,71%,36%,.25);"></div>`,
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

export function MapView({
  markets,
  center,
  zoom = 11,
  onMapClick,
  pinDraft,
  selectedId,
  onSelect,
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
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {center && <Recenter center={center} zoom={zoom} />}
      <ClickHandler onClick={onMapClick} />

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
    </MapContainer>
  );
}
