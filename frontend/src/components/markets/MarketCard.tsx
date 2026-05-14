import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, ShoppingBag, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CROWD_LEVEL_LABEL,
  PRICE_LEVEL_COLOR,
  PRICE_LEVEL_LABEL,
} from '@/lib/constants';
import { priceRange, toBengaliNumerals } from '@/lib/utils';
import type { Market } from '@/types';

export function MarketCard({ market }: { market: Market }) {
  const variant = market.priceLevel.toLowerCase() as 'cheap' | 'fair' | 'expensive';
  const tint = PRICE_LEVEL_COLOR[market.priceLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <Link to={`/markets/${market.id}`} className="group block h-full">
        <Card className="relative h-full overflow-hidden transition-shadow hover:shadow-lg">
          {/* Price-tier accent stripe */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1.5"
            style={{ background: tint }}
          />
          <CardContent className="space-y-2 p-4 pl-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-base font-semibold">{market.name}</h3>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <div className="flex items-start gap-1 text-xs text-muted-foreground">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              <span>{market.area}, {market.district} <span className="opacity-60">·</span> {market.division}</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Badge variant={variant}>{PRICE_LEVEL_LABEL[market.priceLevel]}</Badge>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" /> {CROWD_LEVEL_LABEL[market.crowdLevel]}
              </Badge>
              {market._count?.purchases ? (
                <Badge variant="outline" className="gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {toBengaliNumerals(market._count.purchases)}
                </Badge>
              ) : null}
              {market.distanceKm != null && (
                <span className="text-xs text-muted-foreground">
                  · {toBengaliNumerals(market.distanceKm.toFixed(1))} কিমি
                </span>
              )}
            </div>
            <div className="pt-1 text-sm font-semibold" style={{ color: tint }}>
              {priceRange(market.minPrice, market.maxPrice)}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
