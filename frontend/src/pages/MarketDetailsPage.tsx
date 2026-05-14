import { useParams } from 'react-router-dom';
import {
  Activity,
  BadgeCheck,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Users,
  Wallet,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useMarket } from '@/hooks/useMarkets';
import { useReviews } from '@/hooks/useReviews';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CATTLE_TYPE_LABEL,
  CROWD_LEVEL_LABEL,
  MARKET_SIZE_LABEL,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import { formatBdt, priceRange, timeAgoBn, toBengaliNumerals } from '@/lib/utils';
import { MapView } from '@/components/map/MapView';
import { ReviewItem } from '@/components/reviews/ReviewItem';
import { PriceUpdateForm } from '@/components/markets/PriceUpdateForm';
import { PurchaseList } from '@/components/markets/PurchaseList';
import { PurchaseForm } from '@/components/markets/PurchaseForm';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export default function MarketDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: market, isLoading } = useMarket(id);
  const { data: reviews } = useReviews(id);
  const { data: prices } = usePriceUpdates(id);
  const { data: purchases } = usePurchases(id);
  const token = useAuthStore((s) => s.token);

  if (isLoading || !market) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  const priceTint = PRICE_LEVEL_COLOR[market.priceLevel];

  return (
    <div className="space-y-6">
      {/* Map banner */}
      <section className="relative h-56 overflow-hidden rounded-2xl border shadow-sm sm:h-72">
        <MapView markets={[market]} center={{ lat: market.lat, lng: market.lng }} zoom={14} />
      </section>

      {/* Info hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-sm">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-10 select-none text-[8rem] leading-none opacity-[0.06]"
        >
          🐄
        </div>

        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{market.name}</h1>
              {market.verified && (
                <span title="যাচাইকৃত">
                  <BadgeCheck className="h-6 w-6 text-primary" />
                </span>
              )}
            </div>
            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {market.area}, {market.district} <span className="opacity-60">·</span>{' '}
                {market.division}
              </span>
            </div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${priceTint}22`, color: priceTint }}
          >
            {PRICE_LEVEL_LABEL[market.priceLevel]}
          </span>
        </div>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" /> {CROWD_LEVEL_LABEL[market.crowdLevel]}
          </Badge>
          <Badge variant="outline">আকার: {MARKET_SIZE_LABEL[market.marketSize]}</Badge>
        </div>

        <div className="relative mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <StatTile
            icon={Wallet}
            label="দামের পরিসর"
            value={priceRange(market.minPrice, market.maxPrice)}
          />
          <StatTile
            icon={ShoppingBag}
            label="কিনেছেন"
            value={toBengaliNumerals(market._count?.purchases ?? 0)}
          />
          <StatTile
            icon={Activity}
            label="লাইভ আপডেট"
            value={toBengaliNumerals(market._count?.priceUpdates ?? 0)}
          />
          <StatTile
            icon={MessageSquare}
            label="রিভিউ"
            value={toBengaliNumerals(market._count?.reviews ?? 0)}
          />
        </div>

        {market.description && (
          <p className="relative mt-5 rounded-md border-l-4 border-primary/40 bg-muted/40 px-3 py-2 text-sm leading-relaxed">
            {market.description}
          </p>
        )}
      </section>

      {/* Content grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Section title="লাইভ আপডেট" icon={Activity}>
            {prices?.items.length ? (
              <ul className="space-y-3">
                {prices.items.map((p) => (
                  <li key={p.id} className="rounded-lg bg-muted/40 p-3 text-sm">
                    <div className="flex flex-wrap justify-between gap-2">
                      <span className="font-medium">
                        {CATTLE_TYPE_LABEL[p.cattleType]} — {formatBdt(p.minPrice)} –{' '}
                        {formatBdt(p.maxPrice)}
                      </span>
                      <span className="text-muted-foreground">{timeAgoBn(p.createdAt)}</span>
                    </div>
                    {p.note && <p className="mt-1 text-muted-foreground">{p.note}</p>}
                    <p className="mt-1 text-xs text-muted-foreground">— {p.reporter.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty text="এখনো কোনো আপডেট নেই।" />
            )}
          </Section>

          <Section
            title="গরু কিনছেন?"
            icon={ShoppingBag}
            subtitle={`${toBengaliNumerals(purchases?.total ?? 0)} জন শেয়ার করেছেন`}
          >
            <PurchaseList items={purchases?.items ?? []} />
          </Section>

          <Section title={`রিভিউ (${toBengaliNumerals(reviews?.total ?? 0)})`} icon={MessageSquare}>
            <div className="divide-y">
              {reviews?.items.map((r) => <ReviewItem key={r.id} marketId={market.id} review={r} />)}
            </div>
            {!reviews?.items.length && <Empty text="এখনো কেউ রিভিউ লেখেননি।" />}
          </Section>
        </div>

        <aside className="space-y-4">
          {token ? (
            <>
              <PurchaseForm marketId={market.id} />
              <PriceUpdateForm marketId={market.id} />
            </>
          ) : (
            <div className="rounded-xl border bg-muted/40 p-4 text-sm">
              দাম আপডেট ও কেনা গরু শেয়ার করতে অনুগ্রহ করে লগইন করুন।
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

function StatTile({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card/60 p-3 backdrop-blur transition-colors hover:bg-card">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: Icon;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </h2>
        {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-md bg-muted/30 px-3 py-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}
