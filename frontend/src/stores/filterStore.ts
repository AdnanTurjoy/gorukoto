import { create } from 'zustand';
import type { CrowdLevel, PriceLevel } from '@/types';

export type SortKey = 'newest' | 'nearby' | 'cheapest';

interface FilterState {
  division?: string;
  district?: string;
  priceLevel?: PriceLevel;
  crowdLevel?: CrowdLevel;
  radiusKm?: number;
  sort: SortKey;
  q?: string;
  set: (patch: Partial<FilterState>) => void;
  reset: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  sort: 'newest',
  set: (patch) => set(patch),
  reset: () => set({ division: undefined, district: undefined, priceLevel: undefined, crowdLevel: undefined, radiusKm: undefined, sort: 'newest', q: undefined }),
}));
