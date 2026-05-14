import { motion } from 'framer-motion';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PRICE_LEVEL_COLOR, PRICE_LEVEL_LABEL } from '@/lib/constants';
import { timeAgoBn, toBengaliNumerals } from '@/lib/utils';
import { useReactReview } from '@/hooks/useReviews';
import { useAuthStore } from '@/stores/authStore';
import type { Review } from '@/types';

export function ReviewItem({ marketId, review }: { marketId: string; review: Review }) {
  const react = useReactReview(marketId);
  const token = useAuthStore((s) => s.token);
  const variant = review.priceTag.toLowerCase() as 'cheap' | 'fair' | 'expensive';
  const tint = PRICE_LEVEL_COLOR[review.priceTag];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-xl border bg-muted/20"
    >
      {/* Left accent stripe keyed to price opinion */}
      <div
        className="absolute inset-y-0 left-0 w-[3px] rounded-l-xl"
        style={{ background: tint }}
      />

      <div className="p-4 pl-5">
        {/* Author row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Avatar className="h-9 w-9 ring-2 ring-border">
              <AvatarImage src={review.author.avatarUrl ?? undefined} />
              <AvatarFallback className="text-sm font-semibold">
                {review.author.name.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold leading-tight">{review.author.name}</div>
              <div className="text-xs text-muted-foreground">{timeAgoBn(review.createdAt)}</div>
            </div>
          </div>
          <Badge variant={variant}>{PRICE_LEVEL_LABEL[review.priceTag]}</Badge>
        </div>

        {/* Comment */}
        <p className="mt-3 text-sm leading-relaxed text-foreground/85">{review.comment}</p>

        {/* Reactions */}
        <div className="mt-3 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!token || react.isPending}
            onClick={() => react.mutate({ reviewId: review.id, type: 'HELPFUL' })}
            className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {toBengaliNumerals(review.helpful)} সহায়ক
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!token || react.isPending}
            onClick={() => react.mutate({ reviewId: review.id, type: 'NOT_HELPFUL' })}
            className="h-8 gap-1.5 rounded-lg px-3 text-xs text-muted-foreground hover:text-foreground"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            {toBengaliNumerals(review.notHelpful)}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
