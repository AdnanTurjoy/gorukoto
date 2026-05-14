import { useMemo, useState } from 'react';
import { MapView } from '@/components/map/MapView';
import { MarketFilters } from '@/components/markets/MarketFilters';
import { useMarkets } from '@/hooks/useMarkets';
import { useFilterStore } from '@/stores/filterStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { DHAKA_CENTER } from '@/lib/constants';

export default function MapPage() {
  const f = useFilterStore();
  const geo = useGeolocation(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data } = useMarkets({
    division: f.division,
    district: f.district,
    priceLevel: f.priceLevel,
    crowdLevel: f.crowdLevel,
    q: f.q,
    sort: f.sort,
    lat: geo.lat,
    lng: geo.lng,
    limit: 100,
  });

  const center = useMemo(
    () => (geo.lat && geo.lng ? { lat: geo.lat, lng: geo.lng } : DHAKA_CENTER),
    [geo.lat, geo.lng],
  );

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-3">
        <div className="pointer-events-auto rounded-xl bg-background/95 p-3 shadow-md backdrop-blur">
          <MarketFilters />
        </div>
      </div>
      <div className="h-full w-full">
        <MapView
          markets={data?.items ?? []}
          center={center}
          zoom={11}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
