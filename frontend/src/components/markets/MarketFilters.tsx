import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  CROWD_LEVEL_LABEL,
  DIVISIONS,
  PRICE_LEVEL_LABEL,
  SORT_OPTIONS,
} from '@/lib/constants';
import { useFilterStore } from '@/stores/filterStore';
import type { CrowdLevel, PriceLevel } from '@/types';

const ANY = '__any__';

export function MarketFilters() {
  const f = useFilterStore();

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder="হাট নাম খুঁজুন…"
        value={f.q ?? ''}
        onChange={(e) => f.set({ q: e.target.value || undefined })}
      />
      <Select
        value={f.division ?? ANY}
        onValueChange={(v) => f.set({ division: v === ANY ? undefined : v })}
      >
        <SelectTrigger><SelectValue placeholder="বিভাগ" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>সব বিভাগ</SelectItem>
          {DIVISIONS.map((d) => (
            <SelectItem key={d} value={d}>{d}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={f.priceLevel ?? ANY}
        onValueChange={(v) => f.set({ priceLevel: v === ANY ? undefined : (v as PriceLevel) })}
      >
        <SelectTrigger><SelectValue placeholder="দাম" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>সব দাম</SelectItem>
          {(Object.keys(PRICE_LEVEL_LABEL) as PriceLevel[]).map((k) => (
            <SelectItem key={k} value={k}>{PRICE_LEVEL_LABEL[k]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={f.crowdLevel ?? ANY}
        onValueChange={(v) => f.set({ crowdLevel: v === ANY ? undefined : (v as CrowdLevel) })}
      >
        <SelectTrigger><SelectValue placeholder="ভিড়" /></SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>সব ভিড়</SelectItem>
          {(Object.keys(CROWD_LEVEL_LABEL) as CrowdLevel[]).map((k) => (
            <SelectItem key={k} value={k}>{CROWD_LEVEL_LABEL[k]}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Select value={f.sort} onValueChange={(v) => f.set({ sort: v as typeof f.sort })}>
          <SelectTrigger><SelectValue placeholder="সাজান" /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={f.reset}>রিসেট</Button>
      </div>
    </div>
  );
}
