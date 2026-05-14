import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CattleType, Paginated, PriceUpdate } from '@/types';

export function usePriceUpdates(marketId: string | undefined) {
  return useQuery({
    queryKey: ['price-updates', marketId],
    enabled: !!marketId,
    queryFn: async () => {
      const { data } = await api.get<Paginated<PriceUpdate>>(
        `/markets/${marketId}/price-updates`,
      );
      return data;
    },
  });
}

export interface CreatePricePayload {
  cattleType: CattleType;
  minPrice: number;
  maxPrice: number;
  note?: string;
}

export function useCreatePriceUpdate(marketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePricePayload) => {
      const { data } = await api.post<PriceUpdate>(
        `/markets/${marketId}/price-updates`,
        payload,
      );
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['price-updates', marketId] }),
  });
}
