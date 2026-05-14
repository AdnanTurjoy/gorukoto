import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Market, Paginated } from '@/types';

export interface MarketsQuery {
  division?: string;
  district?: string;
  priceLevel?: string;
  crowdLevel?: string;
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export function useMarkets(query: MarketsQuery) {
  return useQuery({
    queryKey: ['markets', query],
    queryFn: async () => {
      const { data } = await api.get<Paginated<Market>>('/markets', { params: query });
      return data;
    },
  });
}

export function useMarket(id: string | undefined) {
  return useQuery({
    queryKey: ['market', id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get<Market>(`/markets/${id}`);
      return data;
    },
  });
}

export interface CreateMarketPayload {
  name: string;
  description?: string;
  area: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  marketSize: Market['marketSize'];
  crowdLevel: Market['crowdLevel'];
  priceLevel: Market['priceLevel'];
  minPrice?: number;
  maxPrice?: number;
}

export function useCreateMarket() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateMarketPayload) => {
      const { data } = await api.post<Market>('/markets', payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['markets'] }),
  });
}
