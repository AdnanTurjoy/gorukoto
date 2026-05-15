import { useRef, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import type L from 'leaflet';

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface Props {
  mapRef: React.RefObject<L.Map | null>;
  onPick?: (point: { lat: number; lng: number }) => void;
}

export function LocationSearch({ mapRef, onPick }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function search(q: string) {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&countrycodes=bd&limit=6&accept-language=bn,en`,
        );
        const data: NominatimResult[] = await res.json();
        setResults(data);
        setOpen(data.length > 0);
      } catch {
        // ignore network errors
      } finally {
        setLoading(false);
      }
    }, 400);
  }

  function pick(r: NominatimResult) {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    mapRef.current?.flyTo([lat, lng], 16, { duration: 0.8 });
    onPick?.({ lat, lng });
    setQuery(r.display_name.split(',')[0].trim());
    setOpen(false);
  }

  function clear() {
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl bg-background/95 px-3 py-2.5 shadow-md ring-1 ring-border backdrop-blur">
        {loading ? (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => search(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="এলাকা বা হাটের নাম দিয়ে খুঁজুন…"
          className="min-w-0 flex-1 bg-transparent font-bengali text-sm outline-none placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="shrink-0 rounded-full p-0.5 transition-colors hover:bg-muted"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl bg-background shadow-lg ring-1 ring-border">
          {results.map((r) => (
            <li key={r.place_id} className="border-b last:border-b-0">
              <button
                type="button"
                onMouseDown={() => pick(r)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
              >
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="line-clamp-2 font-bengali leading-snug">{r.display_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
