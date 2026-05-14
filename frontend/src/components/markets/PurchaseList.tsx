import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CATTLE_TYPE_EMOJI, CATTLE_TYPE_LABEL } from '@/lib/constants';
import { formatBdt, timeAgoBn } from '@/lib/utils';
import type { Purchase } from '@/types';

export function PurchaseList({ items }: { items: Purchase[] }) {
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        এখনো কেউ এই হাট থেকে কেনা গরু শেয়ার করেনি। আপনিই প্রথম হয়ে যান!
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-xl border bg-card"
        >
          <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
            <img
              src={p.imageUrl}
              alt={`${CATTLE_TYPE_LABEL[p.cattleType]} - ${p.buyer.name}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <span>{CATTLE_TYPE_EMOJI[p.cattleType]}</span>
                <span>{CATTLE_TYPE_LABEL[p.cattleType]}</span>
              </div>
              <span className="text-sm font-bold text-primary">{formatBdt(p.price)}</span>
            </div>
            {p.note && <p className="text-sm text-muted-foreground line-clamp-2">{p.note}</p>}
            <div className="flex items-center gap-2 pt-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={p.buyer.avatarUrl ?? undefined} />
                <AvatarFallback>{p.buyer.name.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {p.buyer.name} · {timeAgoBn(p.createdAt)}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
