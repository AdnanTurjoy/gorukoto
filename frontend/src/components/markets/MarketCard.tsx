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
import type { Market } from '@/types';

const HEADER_BG: Record<Market['priceLevel'], string> = {
  CHEAP:     'linear-gradient(140deg, #16a34a 0%, #14532d 100%)',
  FAIR:      'linear-gradient(140deg, #d97706 0%, #78350f 100%)',
  EXPENSIVE: 'linear-gradient(140deg, #dc2626 0%, #7f1d1d 100%)',
};

const HOVER_SHADOW: Record<Market['priceLevel'], string> = {
  CHEAP:     '0 14px 36px -6px rgba(22,163,74,0.38)',
  FAIR:      '0 14px 36px -6px rgba(217,119,6,0.38)',
  EXPENSIVE: '0 14px 36px -6px rgba(220,38,38,0.38)',
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: HOVER_SHADOW[market.priceLevel] }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="h-full"
    >
      <Link to={`/markets/${market.id}`} className="group block h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">

          {/* ── Colored header ───────────────────────────── */}
          <div
            className="relative overflow-hidden px-4 pb-4 pt-4"
            style={{ background: HEADER_BG[market.priceLevel] }}
          >
            {/* animal watermark */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-2 -top-2 select-none text-[5rem] leading-none opacity-[0.22]"
            >
              {animalWatermark(market.id)}
            </div>

            {/* Arrow icon */}
            <div className="mb-2 flex justify-end">
              <ArrowUpRight className="h-4 w-4 text-white/40 transition-all duration-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>

            {/* Name */}
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white sm:text-[0.9375rem]">
              {market.name}
            </h3>

            {/* Location */}
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

          {/* ── Body ─────────────────────────────────────── */}
          <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">

            {/* Badges */}
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

            {/* Separator */}
            <div className="h-px bg-border" />

            {/* Price + reviews — pushed to bottom */}
            <div className="mt-auto flex items-end justify-between gap-2">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  দামের পরিসর
                </p>
                <p className="text-sm font-bold" style={{ color: tint }}>
                  {priceRange(market.minPrice, market.maxPrice)}
                </p>
              </div>
              {market._count?.reviews ? (
                <div className="text-right">
                  <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    রিভিউ
                  </p>
                  <p className="text-sm font-bold text-foreground">
                    {toBengaliNumerals(market._count.reviews)}
                  </p>
                </div>
              ) : null}
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
}
