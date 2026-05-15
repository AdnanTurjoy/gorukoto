import { useCallback, useEffect, useRef, useState } from 'react';
import type L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapView } from '@/components/map/MapView';
import { LocationSearch } from '@/components/map/LocationSearch';
import { useCreateMarket } from '@/hooks/useMarkets';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';
import {
  CROWD_LEVEL_LABEL,
  DHAKA_CENTER,
  DIVISIONS,
  MARKET_SIZE_LABEL,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import type { CrowdLevel, MarketSize, PriceLevel } from '@/types';
import { toBengaliNumerals } from '@/lib/utils';
import { SEO } from '@/components/common/SEO';

const schema = z
  .object({
    name: z.string().min(2).max(120),
    description: z.string().max(2000).optional().or(z.literal('')),
    area: z.string().min(2).max(120),
    district: z.string().min(2).max(80),
    division: z.string().min(2).max(80),
    marketSize: z.enum(['SMALL', 'MEDIUM', 'LARGE', 'XLARGE']),
    crowdLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'PACKED']),
    priceLevel: z.enum(['CHEAP', 'FAIR', 'EXPENSIVE']),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
  })
  .refine((d) => !d.minPrice || !d.maxPrice || d.minPrice <= d.maxPrice, {
    path: ['maxPrice'],
    message: 'min ≤ max',
  });

type FormValues = z.infer<typeof schema>;

export default function AddMarketPage() {
  const geo = useGeolocation(true);
  const initialCenter = geo.lat && geo.lng ? { lat: geo.lat, lng: geo.lng } : DHAKA_CENTER;
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [geocoding, setGeocoding] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const onMapReady = useCallback((m: L.Map) => { mapRef.current = m; }, []);
  const create = useCreateMarket();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      marketSize: 'MEDIUM',
      crowdLevel: 'MEDIUM',
      priceLevel: 'FAIR',
      division: 'Dhaka',
    },
  });

  useEffect(() => {
    if (!point) return;
    let cancelled = false;
    setGeocoding(true);
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${point.lat}&lon=${point.lng}&accept-language=en`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const addr = data.address ?? {};

        const area =
          addr.suburb ?? addr.village ?? addr.town ?? addr.city_district ?? addr.city ?? '';

        const rawDistrict = addr.county ?? addr.city ?? '';
        const district = rawDistrict.replace(/\s*(District|Zila|Jila)\s*/i, '').trim();

        const rawState = addr.state ?? '';
        const stateName = rawState.replace(/\s*Division\s*/i, '').trim();
        const division = DIVISIONS.find(
          (d) => d.toLowerCase() === stateName.toLowerCase(),
        ) ?? '';

        if (area)     setValue('area',     area,     { shouldValidate: true });
        if (district) setValue('district', district, { shouldValidate: true });
        if (division) setValue('division', division, { shouldValidate: true });
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setGeocoding(false); });

    return () => { cancelled = true; };
  }, [point]);

  const onSubmit = handleSubmit(async (values) => {
    if (!point) {
      toast({
        title: 'অবস্থান নির্বাচন করুন',
        description: 'ম্যাপে ক্লিক করে হাটের অবস্থান বেছে নিন।',
        variant: 'destructive',
      });
      return;
    }
    try {
      const market = await create.mutateAsync({
        ...values,
        description: values.description || undefined,
        lat: point.lat,
        lng: point.lng,
      });
      toast({ title: 'হাট যোগ হয়েছে' });
      navigate(`/markets/${market.id}`);
    } catch (err) {
      toast({ title: 'সংরক্ষণ ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <SEO title="নতুন হাট যোগ করুন" canonical="/add" noIndex />
      <div className="lg:col-span-3 space-y-3">
        <h1 className="text-2xl font-bold">নতুন হাট যোগ করুন</h1>
        <p className="text-sm text-muted-foreground">
          ম্যাপে যে স্থানে হাটটি হচ্ছে সেখানে ক্লিক করুন। নিচের ফর্ম পূরণ করে সংরক্ষণ করুন।
        </p>
        <div className="relative">
          {/* Location search — floats over the map */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[1000] p-2">
            <div className="pointer-events-auto">
              <LocationSearch mapRef={mapRef} onPick={setPoint} />
            </div>
          </div>
          <div className="h-[420px] overflow-hidden rounded-xl border">
            <MapView
              markets={[]}
              center={initialCenter}
              zoom={12}
              pinDraft={point}
              onMapClick={(ll) => setPoint(ll)}
              onReady={onMapReady}
            />
          </div>
        </div>
        {point && (
          <p className="text-xs text-muted-foreground">
            নির্বাচিত: {toBengaliNumerals(point.lat.toFixed(5))}, {toBengaliNumerals(point.lng.toFixed(5))}
          </p>
        )}
      </div>

      <form onSubmit={onSubmit} className="lg:col-span-2 space-y-3 rounded-xl border p-4">
        <div>
          <Label>হাটের নাম</Label>
          <Input {...register('name')} placeholder="যেমন: গাবতলী হাট" />
          {formState.errors.name && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="flex items-center gap-1.5">
              এলাকা
              {geocoding && <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
            </Label>
            <Input {...register('area')} placeholder="Gabtoli" disabled={geocoding} />
          </div>
          <div>
            <Label className="flex items-center gap-1.5">
              জেলা
              {geocoding && <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
            </Label>
            <Input {...register('district')} placeholder="Dhaka" disabled={geocoding} />
          </div>
        </div>
        <div>
          <Label className="flex items-center gap-1.5">
            বিভাগ
            {geocoding && <span className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />}
          </Label>
          <Select
            value={watch('division')}
            onValueChange={(v) => setValue('division', v, { shouldValidate: true })}
            disabled={geocoding}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIVISIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>আকার</Label>
            <Select
              value={watch('marketSize')}
              onValueChange={(v) => setValue('marketSize', v as MarketSize, { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(MARKET_SIZE_LABEL) as MarketSize[]).map((k) => (
                  <SelectItem key={k} value={k}>{MARKET_SIZE_LABEL[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ভিড়</Label>
            <Select
              value={watch('crowdLevel')}
              onValueChange={(v) => setValue('crowdLevel', v as CrowdLevel, { shouldValidate: true })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(CROWD_LEVEL_LABEL) as CrowdLevel[]).map((k) => (
                  <SelectItem key={k} value={k}>{CROWD_LEVEL_LABEL[k]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label>দাম</Label>
          <Select
            value={watch('priceLevel')}
            onValueChange={(v) => setValue('priceLevel', v as PriceLevel, { shouldValidate: true })}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {(Object.keys(PRICE_LEVEL_LABEL) as PriceLevel[]).map((k) => (
                <SelectItem key={k} value={k}>{PRICE_LEVEL_LABEL[k]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>সর্বনিম্ন দাম (টাকা)</Label>
            <Input type="number" inputMode="numeric" {...register('minPrice')} />
          </div>
          <div>
            <Label>সর্বোচ্চ দাম (টাকা)</Label>
            <Input type="number" inputMode="numeric" {...register('maxPrice')} />
          </div>
        </div>
        <div>
          <Label>বিবরণ</Label>
          <Textarea rows={3} placeholder="হাট সম্পর্কে কিছু লিখুন…" {...register('description')} />
        </div>

        <Button type="submit" className="w-full" disabled={create.isPending}>
          {create.isPending ? 'সংরক্ষণ হচ্ছে…' : 'সংরক্ষণ করুন'}
        </Button>
      </form>
    </div>
  );
}
