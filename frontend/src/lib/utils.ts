import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNowStrict } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumerals(input: string | number): string {
  return String(input).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

export function formatBdt(amount: number | null | undefined): string {
  if (amount == null) return '—';
  return `৳${toBengaliNumerals(amount.toLocaleString('en-US'))}`;
}

export function priceRange(min: number | null, max: number | null): string {
  if (min == null && max == null) return '—';
  if (min != null && max != null) return `${formatBdt(min)} – ${formatBdt(max)}`;
  return formatBdt(min ?? max);
}

// Bengali relative timestamps: "৫ মিনিট আগে"
const unitBn: Record<string, string> = {
  second: 'সেকেন্ড',
  seconds: 'সেকেন্ড',
  minute: 'মিনিট',
  minutes: 'মিনিট',
  hour: 'ঘণ্টা',
  hours: 'ঘণ্টা',
  day: 'দিন',
  days: 'দিন',
  month: 'মাস',
  months: 'মাস',
  year: 'বছর',
  years: 'বছর',
};

export function timeAgoBn(date: string | Date): string {
  const rel = formatDistanceToNowStrict(new Date(date));
  const [num, unit] = rel.split(' ');
  const bnUnit = unitBn[unit] ?? unit;
  return `${toBengaliNumerals(num)} ${bnUnit} আগে`;
}
