import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CattleType, Paginated, Purchase } from '@/types';

export function usePurchases(marketId: string | undefined) {
  return useQuery({
    queryKey: ['purchases', marketId],
    enabled: !!marketId,
    queryFn: async () => {
      const { data } = await api.get<Paginated<Purchase>>(`/markets/${marketId}/purchases`);
      return data;
    },
  });
}

export interface CreatePurchasePayload {
  cattleType: CattleType;
  price: number;
  imageUrl: string;
  note?: string;
}

export function useCreatePurchase(marketId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreatePurchasePayload) => {
      const { data } = await api.post<Purchase>(`/markets/${marketId}/purchases`, payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['purchases', marketId] });
      qc.invalidateQueries({ queryKey: ['market', marketId] });
    },
  });
}
