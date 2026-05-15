import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, MapPin, ShoppingBag, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  CROWD_LEVEL_LABEL,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import { priceRange, toBengaliNumerals } from '@/lib/utils';
import { ShareBar } from '@/components/common/ShareBar';
import type { Market } from '@/types';

const CARD_GRADIENTS = [
  'linear-gradient(140deg, #3b82f6 0%, #1d4ed8 100%)',   // blue → cobalt
  'linear-gradient(140deg, #2dd4bf 0%, #0f766e 100%)',   // teal → dark teal
  'linear-gradient(140deg, #a78bfa 0%, #7c3aed 100%)',   // lavender → violet
  'linear-gradient(140deg, #fbbf24 0%, #d97706 100%)',   // amber → gold
  'linear-gradient(140deg, #38bdf8 0%, #0369a1 100%)',   // sky → blue
  'linear-gradient(140deg, #f472b6 0%, #be185d 100%)',   // pink → rose
  'linear-gradient(140deg, #4ade80 0%, #15803d 100%)',   // green → forest
  'linear-gradient(140deg, #fb923c 0%, #c2410c 100%)',   // orange → burnt
  'linear-gradient(140deg, #22d3ee 0%, #0e7490 100%)',   // cyan → ocean
  'linear-gradient(140deg, #818cf8 0%, #4338ca 100%)',   // indigo → deep indigo
  'linear-gradient(140deg, #34d399 0%, #047857 100%)',   // emerald → deep emerald
  'linear-gradient(140deg, #fb7185 0%, #be123c 100%)',   // rose → crimson
];

function idHash(id: string) {
  return id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function headerGradient(id: string): string {
  return CARD_GRADIENTS[idHash(id) % CARD_GRADIENTS.length];
}

const HOVER_SHADOW: Record<Market['priceLevel'], string> = {
  CHEAP:     '0 14px 36px -6px rgba(22,163,74,0.38)',
  FAIR:      '0 14px 36px -6px rgba(217,119,6,0.38)',
  EXPENSIVE: '0 14px 36px -6px rgba(220,38,38,0.38)',
};

const CARD_BG: Record<Market['priceLevel'], string> = {
  CHEAP:     'bg-emerald-50/60 dark:bg-emerald-950/25',
  FAIR:      'bg-amber-50/60 dark:bg-amber-950/25',
  EXPENSIVE: 'bg-rose-50/60 dark:bg-rose-950/25',
};

const CARD_BORDER: Record<Market['priceLevel'], string> = {
  CHEAP:     'border-emerald-200/70 dark:border-emerald-800/40',
  FAIR:      'border-amber-200/70 dark:border-amber-800/40',
  EXPENSIVE: 'border-red-200/70 dark:border-red-800/40',
};

const SIZE_LABEL: Record<Market['marketSize'], string> = {
  SMALL: 'ছোট', MEDIUM: 'মাঝারি', LARGE: 'বড়', XLARGE: 'খুব বড়',
};

const WATERMARK_ANIMALS = ['🐂', '🐐', '🐑', '🐪', '🐃'];

function animalWatermark(id: string): string {
  const hash = id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return WATERMARK_ANIMALS[hash % WATERMARK_ANIMALS.length];
}

export function MarketCard({ market }: { market: Market }) {
  const variant = market.priceLevel.toLowerCase() as 'cheap' | 'fair' | 'expensive';
  const tint = PRICE_LEVEL_COLOR[market.priceLevel];
  const shareUrl     = `${window.location.origin}/markets/${market.id}`;
  const shareTitle   = `${market.name} — গরুর হাট | GoruKoi`;
  const shareSummary = `${market.area}, ${market.district} | ${PRICE_LEVEL_LABEL[market.priceLevel]} দাম | কোরবানির ঈদে সেরা হাট খুঁজুন GoruKoi-তে।`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: HOVER_SHADOW[market.priceLevel] }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="h-full"
    >
      <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm ${CARD_BG[market.priceLevel]} ${CARD_BORDER[market.priceLevel]}`}>

        {/* ── Clickable area ───────────────────────────── */}
        <Link to={`/markets/${market.id}`} className="flex flex-1 flex-col">

          {/* Colored header */}
          <div
            className="relative overflow-hidden px-4 pb-4 pt-4"
            style={{ background: headerGradient(market.id) }}
          >
            <div aria-hidden className="pointer-events-none absolute -right-2 -top-2 select-none text-[5rem] leading-none opacity-[0.22]">
              {animalWatermark(market.id)}
            </div>
            <div className="mb-2 flex justify-end">
              <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-[0.9375rem]">
              {market.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-white/65">
              <MapPin className="h-3 w-3 shrink-0 text-white/70" />
              <span className="line-clamp-1 flex-1">{market.area}, {market.district}</span>
              {market.distanceKm != null && (
                <span className="shrink-0 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {toBengaliNumerals(market.distanceKm.toFixed(1))} কিমি
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
            <div className="flex flex-wrap gap-1.5">
              <Badge variant={variant}>{PRICE_LEVEL_LABEL[market.priceLevel]}</Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />
                {CROWD_LEVEL_LABEL[market.crowdLevel]}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {SIZE_LABEL[market.marketSize]}
              </Badge>
              {market._count?.purchases ? (
                <Badge variant="outline" className="gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {toBengaliNumerals(market._count.purchases)}
                </Badge>
              ) : null}
            </div>
            <div className="h-px bg-border" />
            <div className="mt-auto flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">দামের পরিসর</p>
                <p className="text-sm font-bold" style={{ color: tint }}>
                  {priceRange(market.minPrice, market.maxPrice)}
                </p>
              </div>
              {market._count?.reviews ? (
                <div className="text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">রিভিউ</p>
                  <p className="text-sm font-bold text-foreground">{toBengaliNumerals(market._count.reviews)}</p>
                </div>
              ) : null}
            </div>
          </div>
        </Link>

        {/* ── Share bar ────────────────────────────────── */}
        <ShareBar url={shareUrl} title={shareTitle} summary={shareSummary} compact />

      </div>
    </motion.div>
  );
}
