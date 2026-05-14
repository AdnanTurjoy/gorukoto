import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PRICE_LEVEL_LABEL } from '@/lib/constants';
import { timeAgoBn, toBengaliNumerals } from '@/lib/utils';
import { useReactReview } from '@/hooks/useReviews';
import { useAuthStore } from '@/stores/authStore';
import type { Review } from '@/types';

export function ReviewItem({ marketId, review }: { marketId: string; review: Review }) {
  const react = useReactReview(marketId);
  const token = useAuthStore((s) => s.token);
  const variant = review.priceTag.toLowerCase() as 'cheap' | 'fair' | 'expensive';

  return (
    <div className="flex gap-3 border-b py-4 last:border-b-0">
      <Avatar className="h-9 w-9">
        <AvatarImage src={review.author.avatarUrl ?? undefined} />
        <AvatarFallback>{review.author.name.slice(0, 1).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{review.author.name}</span>
          <span className="text-xs text-muted-foreground">{timeAgoBn(review.createdAt)}</span>
          <Badge variant={variant} className="ml-auto">
            {PRICE_LEVEL_LABEL[review.priceTag]}
          </Badge>
        </div>
        <p className="text-sm leading-relaxed">{review.comment}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!token || react.isPending}
            onClick={() => react.mutate({ reviewId: review.id, type: 'HELPFUL' })}
          >
            <ThumbsUp className="mr-1 h-4 w-4" />
            {toBengaliNumerals(review.helpful)}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!token || react.isPending}
            onClick={() => react.mutate({ reviewId: review.id, type: 'NOT_HELPFUL' })}
          >
            <ThumbsDown className="mr-1 h-4 w-4" />
            {toBengaliNumerals(review.notHelpful)}
          </Button>
        </div>
      </div>
    </div>
  );
}
