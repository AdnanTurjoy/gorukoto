import type { CrowdLevel, PriceLevel, CattleType, MarketSize } from '@/types';

export const DHAKA_CENTER = { lat: 23.8103, lng: 90.4125 };
// Geographic center of Bangladesh — used as the default map view so the whole
// country fits at the default zoom on typical desktop viewports.
export const BANGLADESH_CENTER = { lat: 23.685, lng: 90.3563 };
export const BANGLADESH_ZOOM = 7;

export const DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Khulna',
  'Rajshahi',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

export const PRICE_LEVEL_LABEL: Record<PriceLevel, string> = {
  CHEAP: 'কম দাম',
  FAIR: 'স্বাভাবিক',
  EXPENSIVE: 'বেশি দাম',
};

export const PRICE_LEVEL_COLOR: Record<PriceLevel, string> = {
  CHEAP: '#16a34a',
  FAIR: '#f59e0b',
  EXPENSIVE: '#dc2626',
};

export const CROWD_LEVEL_LABEL: Record<CrowdLevel, string> = {
  LOW: 'কম ভিড়',
  MEDIUM: 'মাঝারি ভিড়',
  HIGH: 'বেশি ভিড়',
  PACKED: 'অত্যধিক ভিড়',
};

export const MARKET_SIZE_LABEL: Record<MarketSize, string> = {
  SMALL: 'ছোট',
  MEDIUM: 'মাঝারি',
  LARGE: 'বড়',
  XLARGE: 'খুব বড়',
};

export const CATTLE_TYPE_LABEL: Record<CattleType, string> = {
  COW: 'গরু',
  BUFFALO: 'মহিষ',
  GOAT: 'ছাগল',
  SHEEP: 'ভেড়া',
  CAMEL: 'উট',
};

export const CATTLE_TYPE_EMOJI: Record<CattleType, string> = {
  COW: '🐂',
  BUFFALO: '🐃',
  GOAT: '🐐',
  SHEEP: '🐑',
  CAMEL: '🐪',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'নতুন' },
  { value: 'nearby', label: 'কাছাকাছি' },
  { value: 'cheapest', label: 'কম দামের' },
] as const;
