export type Role = 'USER' | 'ADMIN';
export type PriceLevel = 'CHEAP' | 'FAIR' | 'EXPENSIVE';
export type CrowdLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'PACKED';
export type MarketSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'XLARGE';
export type CattleType = 'COW' | 'BUFFALO' | 'GOAT' | 'SHEEP' | 'CAMEL';
export type ReactionType = 'HELPFUL' | 'NOT_HELPFUL';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: Role;
  createdAt: string;
}

export interface Market {
  id: string;
  name: string;
  description: string | null;
  area: string;
  district: string;
  division: string;
  lat: number;
  lng: number;
  marketSize: MarketSize;
  crowdLevel: CrowdLevel;
  priceLevel: PriceLevel;
  minPrice: number | null;
  maxPrice: number | null;
  startsOn: string | null;
  endsOn: string | null;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: { id: string; name: string; avatarUrl: string | null };
  distanceKm?: number;
  _count?: { reviews: number; priceUpdates: number; comments?: number; purchases?: number };
}

export interface Review {
  id: string;
  marketId: string;
  priceTag: PriceLevel;
  comment: string;
  createdAt: string;
  author: { id: string; name: string; avatarUrl: string | null };
  helpful: number;
  notHelpful: number;
}

export interface PriceUpdate {
  id: string;
  marketId: string;
  cattleType: CattleType;
  minPrice: number;
  maxPrice: number;
  note: string | null;
  createdAt: string;
  reporter: { id: string; name: string; avatarUrl: string | null };
}

export interface Purchase {
  id: string;
  marketId: string;
  cattleType: CattleType;
  price: number;
  imageUrl: string;
  note: string | null;
  createdAt: string;
  buyer: { id: string | null; name: string; avatarUrl: string | null };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
