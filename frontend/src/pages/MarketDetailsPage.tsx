import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  BadgeCheck,
  MapPin,
  ShoppingBag,
  Users,
  Wallet,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { useMarket } from '@/hooks/useMarkets';
import { usePriceUpdates } from '@/hooks/usePriceUpdates';
import { usePurchases } from '@/hooks/usePurchases';
import { useAuthStore } from '@/stores/authStore';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CATTLE_TYPE_EMOJI,
  CATTLE_TYPE_LABEL,
  CROWD_LEVEL_LABEL,
  MARKET_SIZE_LABEL,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import { formatBdt, priceRange, timeAgoBn, toBengaliNumerals } from '@/lib/utils';
import { MapView } from '@/components/map/MapView';
import { PriceUpdateForm } from '@/components/markets/PriceUpdateForm';
import { PurchaseList } from '@/components/markets/PurchaseList';
import { PurchaseForm } from '@/components/markets/PurchaseForm';

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export default function MarketDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { data: market, isLoading } = useMarket(id);
  const { data: prices } = usePriceUpdates(id);
  const { data: purchases } = usePurchases(id);
  const token = useAuthStore((s) => s.token);

  if (isLoading || !market) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-56 w-full rounded-2xl sm:h-72" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const priceTint = PRICE_LEVEL_COLOR[market.priceLevel];
  const variant = market.priceLevel.toLowerCase() as 'cheap' | 'fair' | 'expensive';

  return (
    <div className="space-y-5">

      {/* ── Map banner ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative h-56 overflow-hidden rounded-2xl border shadow-sm sm:h-72"
      >
        <MapView markets={[market]} center={{ lat: market.lat, lng: market.lng }} zoom={14} />
      </motion.section>

      {/* ── Info hero card ─────────────────────────────── */}
      <motion.section
        {...fadeUp}
        className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"
        style={{ borderTopWidth: 3, borderTopColor: priceTint }}
      >
        {/* Subtle tint wash at top */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28"
          style={{ background: `linear-gradient(to bottom, ${priceTint}12, transparent)` }}
        />
        {/* 🐄 watermark */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 -top-2 select-none text-[8rem] leading-none opacity-[0.055]"
        >
          🐄
        </div>

        <div className="relative p-5 sm:p-6">
          {/* Name + verified + price level */}
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-black leading-tight sm:text-3xl">
                  {market.name}
                </h1>
                {market.verified && (
                  <span title="যাচাইকৃত">
                    <BadgeCheck className="h-6 w-6 shrink-0 text-primary" />
                  </span>
                )}
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: priceTint }} />
                <span>
                  {market.area}, {market.district}
                  <span className="opacity-50"> · </span>
                  {market.division}
                </span>
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-sm font-bold"
              style={{ background: `${priceTint}18`, color: priceTint }}
            >
              {PRICE_LEVEL_LABEL[market.priceLevel]}
            </span>
          </div>

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant={variant} className="gap-1">
              <Users className="h-3 w-3" />
              {CROWD_LEVEL_LABEL[market.crowdLevel]}
            </Badge>
            <Badge variant="outline">
              আকার: {MARKET_SIZE_LABEL[market.marketSize]}
            </Badge>
          </div>

          {/* Stat tiles */}
          <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
            <StatTile
              icon={Wallet}
              label="দামের পরিসর"
              value={priceRange(market.minPrice, market.maxPrice)}
              tint={priceTint}
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
          </div>

          {/* Description */}
          {market.description && (
            <div
              className="mt-4 rounded-xl bg-muted/40 px-4 py-3"
              style={{ borderLeft: `3px solid ${priceTint}` }}
            >
              <p className="text-sm leading-relaxed text-foreground/80">
                {market.description}
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── Content grid ───────────────────────────────── */}
      <section className="grid gap-5 lg:grid-cols-3">

        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">

          {/* Live price updates */}
          <Section title="লাইভ আপডেট" icon={Activity}
            subtitle={prices?.items.length ? `${toBengaliNumerals(prices.items.length)} টি আপডেট` : undefined}
          >
            {prices?.items.length ? (
              <ul className="space-y-3">
                {prices.items.map((p, i) => (
                  <motion.li
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="relative overflow-hidden rounded-xl border bg-muted/20"
                  >
                    {/* Left accent stripe */}
                    <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl bg-primary" />

                    <div className="p-3.5 pl-4">
                      <div className="flex items-start justify-between gap-3">
                        {/* Cattle type */}
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-xl shadow-sm ring-1 ring-border">
                            {CATTLE_TYPE_EMOJI[p.cattleType]}
                          </span>
                          <div>
                            <div className="text-sm font-semibold">
                              {CATTLE_TYPE_LABEL[p.cattleType]}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {p.reporter.name}
                            </div>
                          </div>
                        </div>
                        {/* Price + time */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-primary">
                            {formatBdt(p.minPrice)} – {formatBdt(p.maxPrice)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {timeAgoBn(p.createdAt)}
                          </div>
                        </div>
                      </div>
                      {p.note && (
                        <p className="mt-2.5 rounded-lg bg-card px-3 py-2 text-xs leading-relaxed text-muted-foreground ring-1 ring-border">
                          {p.note}
                        </p>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <Empty text="এখনো কোনো আপডেট নেই।" />
            )}
          </Section>

          {/* Purchase feed */}
          <Section
            title="গরু কিনছেন?"
            icon={ShoppingBag}
            subtitle={purchases?.total
              ? `${toBengaliNumerals(purchases.total)} জন শেয়ার করেছেন`
              : undefined}
          >
            <PurchaseList items={purchases?.items ?? []} />
          </Section>

        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          {token ? (
            <>
              <PurchaseForm marketId={market.id} />
              <PriceUpdateForm marketId={market.id} />
            </>
          ) : (
            <div className="rounded-2xl border bg-muted/30 p-5 text-center text-sm text-muted-foreground">
              <div className="mb-2 text-3xl">🔐</div>
              দাম আপডেট ও কেনা গরু শেয়ার করতে অনুগ্রহ করে লগইন করুন।
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function StatTile({
  icon: Icon,
  label,
  value,
  tint,
}: {
  icon: Icon;
  label: string;
  value: string;
  tint?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border bg-muted/25 p-3 sm:p-4">
      <div
        className="mb-2.5 flex h-8 w-8 items-center justify-center rounded-xl"
        style={{
          background: tint ? `${tint}18` : 'hsl(var(--muted))',
        }}
      >
        <Icon
          className="h-4 w-4"
          style={{ color: tint ?? 'hsl(var(--muted-foreground))' }}
        />
      </div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold sm:text-base">{value}</div>
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
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b bg-muted/20 px-5 py-3.5">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-3.5 w-3.5 text-primary" />
          </span>
          {title}
        </h2>
        {subtitle && (
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {subtitle}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-muted/30 py-8 text-center">
      <div className="mb-1.5 text-3xl opacity-40">📭</div>
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
