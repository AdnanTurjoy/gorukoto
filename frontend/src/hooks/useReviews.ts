import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Paginated, PriceLevel, ReactionType, Review } from '@/types';

export function useReviews(marketId: string | undefined) {
  return useQuery({
    queryKey: ['reviews', marketId],
    enabled: !!marketId,
    queryFn: async () => {
      const { data } = await api.get<Paginated<Review>>(`/markets/${marketId}/reviews`);
      return data;
    },
  });
}

export interface CreateReviewPayload {
  priceTag: PriceLevel;
  comment: string;
}

export function useCreateReview(marketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateReviewPayload) => {
      const { data } = await api.post<Review>(`/markets/${marketId}/reviews`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', marketId] });
      qc.invalidateQueries({ queryKey: ['market', marketId] });
    },
  });
}

export function useReactReview(marketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ reviewId, type }: { reviewId: string; type: ReactionType }) => {
      const { data } = await api.post(`/reviews/${reviewId}/react`, { type });
      return data;
    },
    onMutate: async ({ reviewId, type }) => {
      await qc.cancelQueries({ queryKey: ['reviews', marketId] });
      const prev = qc.getQueryData<Paginated<Review>>(['reviews', marketId]);
      if (prev) {
        qc.setQueryData<Paginated<Review>>(['reviews', marketId], {
          ...prev,
          items: prev.items.map((r) =>
            r.id === reviewId
              ? {
                  ...r,
                  helpful: r.helpful + (type === 'HELPFUL' ? 1 : 0),
                  notHelpful: r.notHelpful + (type === 'NOT_HELPFUL' ? 1 : 0),
                }
              : r,
          ),
        });
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['reviews', marketId], ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['reviews', marketId] }),
  });
}
