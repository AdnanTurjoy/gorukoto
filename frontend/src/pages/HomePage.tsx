import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map as MapIcon, Plus, Search, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MarketCard } from '@/components/markets/MarketCard';
import { MarketFilters } from '@/components/markets/MarketFilters';
import { GoruKinchenDialog } from '@/components/markets/GoruKinchenDialog';
import { useMarkets, type MarketsQuery } from '@/hooks/useMarkets';
import { useFilterStore } from '@/stores/filterStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toBengaliNumerals } from '@/lib/utils';

export default function HomePage() {
  const f = useFilterStore();
  const geo = useGeolocation(f.sort === 'nearby');
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const query: MarketsQuery = useMemo(
    () => ({
      division: f.division,
      district: f.district,
      priceLevel: f.priceLevel,
      crowdLevel: f.crowdLevel,
      q: f.q,
      sort: f.sort,
      lat: f.sort === 'nearby' ? geo.lat : undefined,
      lng: f.sort === 'nearby' ? geo.lng : undefined,
      radiusKm: f.sort === 'nearby' ? f.radiusKm ?? 50 : undefined,
      limit: 30,
    }),
    [f.division, f.district, f.priceLevel, f.crowdLevel, f.q, f.sort, f.radiusKm, geo.lat, geo.lng],
  );

  const { data, isLoading } = useMarkets(query);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 shadow-sm sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-12 select-none text-[12rem] leading-none opacity-[0.08]"
        >
          🐄
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -left-8 select-none text-[8rem] leading-none opacity-[0.05]"
        >
          🐐
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-2xl space-y-4"
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" />
            ঈদ-উল-আযহা · কমিউনিটি দ্বারা পরিচালিত
          </span>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            বাংলাদেশের গরুর হাট,<br className="hidden sm:block" /> এক জায়গায়।
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            লাইভ দাম, ভিড় ও কমিউনিটি রিভিউ — আপনার কাছাকাছি হাট খুঁজুন এবং কেনাকাটার অভিজ্ঞতা শেয়ার করুন।
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button size="lg" onClick={() => setPurchaseOpen(true)} className="shadow-md">
              <ShoppingBag className="mr-2 h-5 w-5" />
              গরু কিনছেন? শেয়ার করুন
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/map">
                <MapIcon className="mr-2 h-5 w-5" />
                ম্যাপে দেখুন
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link to="/add">
                <Plus className="mr-2 h-5 w-5" />
                নতুন হাট
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Section heading + filters */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">জনপ্রিয় হাট</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? 'লোড হচ্ছে…'
                : `${toBengaliNumerals(data?.total ?? 0)} টি হাট পাওয়া গেছে`}
            </p>
          </div>
        </div>

        <MarketFilters />
      </section>

      {/* Grid / empty / loading */}
      {isLoading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </section>
      ) : data?.items.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
          <div aria-hidden className="mb-2 text-5xl">
            🔎
          </div>
          <p className="font-semibold">কোনো হাট পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ফিল্টার পরিবর্তন করুন, অথবা আপনার এলাকার একটি হাট যোগ করুন।
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/add">
                <Plus className="mr-1 h-4 w-4" />
                হাট যোগ করুন
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={f.reset}>
              <Search className="mr-1 h-4 w-4" />
              ফিল্টার রিসেট
            </Button>
          </div>
        </section>
      )}

      <GoruKinchenDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </div>
  );
}
