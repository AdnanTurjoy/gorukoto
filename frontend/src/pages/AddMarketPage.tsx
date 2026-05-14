import { useState } from 'react';
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
      <div className="lg:col-span-3 space-y-3">
        <h1 className="text-2xl font-bold">নতুন হাট যোগ করুন</h1>
        <p className="text-sm text-muted-foreground">
          ম্যাপে যে স্থানে হাটটি হচ্ছে সেখানে ক্লিক করুন। নিচের ফর্ম পূরণ করে সংরক্ষণ করুন।
        </p>
        <div className="h-[420px] overflow-hidden rounded-xl border">
          <MapView
            markets={[]}
            center={initialCenter}
            zoom={12}
            pinDraft={point}
            onMapClick={(ll) => setPoint(ll)}
          />
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
            <Label>এলাকা</Label>
            <Input {...register('area')} placeholder="Gabtoli" />
          </div>
          <div>
            <Label>জেলা</Label>
            <Input {...register('district')} placeholder="Dhaka" />
          </div>
        </div>
        <div>
          <Label>বিভাগ</Label>
          <Select
            value={watch('division')}
            onValueChange={(v) => setValue('division', v, { shouldValidate: true })}
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
