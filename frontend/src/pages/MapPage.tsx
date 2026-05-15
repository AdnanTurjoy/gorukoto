import { useCallback, useRef, useState } from 'react';
import { SEO } from '@/components/common/SEO';
import type L from 'leaflet';
import { LocateFixed, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MapView } from '@/components/map/MapView';
import { MarketFilters } from '@/components/markets/MarketFilters';
import { useMarkets } from '@/hooks/useMarkets';
import { useFilterStore } from '@/stores/filterStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import {
  BANGLADESH_CENTER,
  BANGLADESH_ZOOM,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import type { PriceLevel } from '@/types';
import { cn, toBengaliNumerals } from '@/lib/utils';

export default function MapPage() {
  const f = useFilterStore();
  const geo = useGeolocation(true); // request location, but don't auto-center
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasActiveFilters = !!(f.division || f.district || f.priceLevel || f.crowdLevel || f.q);
  const mapRef = useRef<L.Map | null>(null);

  const { data } = useMarkets({
    division: f.division,
    district: f.district,
    priceLevel: f.priceLevel,
    crowdLevel: f.crowdLevel,
    q: f.q,
    sort: f.sort,
    lat: geo.lat,
    lng: geo.lng,
    limit: 200,
  });

  const recenterToUser = useCallback(() => {
    if (geo.lat && geo.lng && mapRef.current) {
      mapRef.current.flyTo([geo.lat, geo.lng], 12, { duration: 0.8 });
    }
  }, [geo.lat, geo.lng]);

  const recenterToCountry = useCallback(() => {
    mapRef.current?.flyTo([BANGLADESH_CENTER.lat, BANGLADESH_CENTER.lng], BANGLADESH_ZOOM, {
      duration: 0.8,
    });
  }, []);

  const count = data?.total ?? 0;

  return (
    <div className="relative h-full">
      <SEO
        title="ম্যাপে হাট দেখুন"
        description="বাংলাদেশের সকল গরুর হাট ম্যাপে দেখুন — দামের রঙ-কোড, ফিল্টার ও লাইভ লোকেশন।"
        canonical="/map"
      />
      {/* Top floating filter panel + count chip */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[800] p-3">
        <div className="pointer-events-auto mx-auto max-w-5xl space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold shadow-sm ring-1 ring-border backdrop-blur">
              <MapPin className="h-3 w-3 text-primary" />
              {toBengaliNumerals(count)} হাট
            </span>
            {/* Mobile-only filter toggle */}
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ring-1 backdrop-blur transition-colors sm:hidden',
                filtersOpen
                  ? 'bg-primary text-primary-foreground ring-primary'
                  : cn(
                      'bg-background/95 ring-border',
                      hasActiveFilters && 'ring-primary/60 text-primary',
                    ),
              )}
            >
              <SlidersHorizontal className="h-3 w-3" />
              ফিল্টার{hasActiveFilters ? ' ●' : ''}
            </button>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              ম্যাপে ক্লিক করুন বা পিন দেখুন
            </span>
          </div>
          {/* Filter panel: toggle on mobile, always visible on sm+ */}
          <div className={cn(
            'rounded-2xl bg-background/95 p-3 shadow-md ring-1 ring-border backdrop-blur',
            filtersOpen ? '' : 'hidden sm:block',
          )}>
            <MarketFilters />
          </div>
        </div>
      </div>

      {/* Bottom-left legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-[800] sm:bottom-4 sm:left-4">
        <div className="pointer-events-auto rounded-xl bg-background/95 p-3 shadow-md ring-1 ring-border backdrop-blur">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            দামের মান
          </p>
          <div className="space-y-1 text-xs">
            {(['CHEAP', 'FAIR', 'EXPENSIVE'] as PriceLevel[]).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full ring-2 ring-white"
                  style={{ background: PRICE_LEVEL_COLOR[level] }}
                />
                {PRICE_LEVEL_LABEL[level]}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom-right floating action: locate me / country view */}
      <div className="pointer-events-none absolute bottom-3 right-3 z-[800] flex flex-col gap-2 sm:bottom-4 sm:right-4">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="pointer-events-auto h-10 w-10 rounded-full shadow-md ring-1 ring-border"
          onClick={recenterToCountry}
          aria-label="পুরো বাংলাদেশ দেখুন"
          title="পুরো বাংলাদেশ"
        >
          <span aria-hidden className="text-base">🇧🇩</span>
        </Button>
        <Button
          type="button"
          size="icon"
          className="pointer-events-auto h-11 w-11 rounded-full shadow-md"
          disabled={!geo.lat || !geo.lng}
          onClick={recenterToUser}
          aria-label="আমার অবস্থানে যান"
          title="আমার অবস্থানে যান"
        >
          <LocateFixed className="h-5 w-5" />
        </Button>
      </div>

      <div className="h-full w-full">
        <MapView
          markets={data?.items ?? []}
          center={BANGLADESH_CENTER}
          zoom={BANGLADESH_ZOOM}
          selectedId={selectedId}
          onSelect={setSelectedId}
          userLocation={geo.lat && geo.lng ? { lat: geo.lat, lng: geo.lng } : null}
          onReady={(m) => (mapRef.current = m)}
        />
      </div>
    </div>
  );
}
