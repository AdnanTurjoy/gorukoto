import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Map as MapIcon,
  MapPin,
  Plus,
  Search,
  ShoppingBag,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GoruKoiLogo } from '@/components/ui/GoruKoiLogo';
import { SEO } from '@/components/common/SEO';
import { MarketCard } from '@/components/markets/MarketCard';
import { MarketFilters } from '@/components/markets/MarketFilters';
import { GoruKinchenDialog } from '@/components/markets/GoruKinchenDialog';
import { useMarkets, type MarketsQuery } from '@/hooks/useMarkets';
import { useFilterStore } from '@/stores/filterStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toBengaliNumerals } from '@/lib/utils';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const FEATURES = [
  {
    icon: MapPin,
    label: 'কাছাকাছি হাট',
    desc: 'আপনার অবস্থান থেকে কাছের সব হাট এক মানচিত্রে।',
    tint: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/15',
  },
  {
    icon: TrendingUp,
    label: 'লাইভ দাম',
    desc: 'কমিউনিটি আপডেট করা সর্বশেষ গরু ও ছাগলের দাম।',
    tint: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/15',
  },
  {
    icon: Star,
    label: 'রিভিউ ও অভিজ্ঞতা',
    desc: 'বাস্তব ক্রেতাদের রিভিউ পড়ুন, নিজেরটাও শেয়ার করুন।',
    tint: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-500/15',
  },
];

export default function HomePage() {
  const f = useFilterStore();
  const geo = useGeolocation(f.sort === 'nearby');
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const query: MarketsQuery = useMemo(
    () => ({
      division: f.division,
      district: f.district,
      priceLevel: f.priceLevel,
      crowdLevel: f.crowdLevel,
      q: f.q,
      sort: f.sort,
      lat: f.sort === 'nearby' ? geo.lat : undefined,
      lng: f.sort === 'nearby' ? geo.lng : undefined,
      radiusKm: f.sort === 'nearby' ? f.radiusKm ?? 50 : undefined,
      limit: 30,
    }),
    [f.division, f.district, f.priceLevel, f.crowdLevel, f.q, f.sort, f.radiusKm, geo.lat, geo.lng],
  );

  const { data, isLoading } = useMarkets(query);

  return (
    <div className="space-y-6">
      <SEO
        canonical="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'বাংলাদেশের গরুর হাট তালিকা',
          description: 'কোরবানির ঈদে বাংলাদেশের গরুর হাট — লাইভ দাম ও কমিউনিটি আপডেট।',
        }}
      />
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-3xl shadow-xl"
        style={{ background: 'linear-gradient(145deg, #0b3420 0%, #0f4a2a 45%, #0c3a22 100%)' }}
      >
        {/* Nakshi katha SVG diamond pattern */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-nakshi" x="0" y="0" width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M26 2 L50 26 L26 50 L2 26 Z" fill="none" stroke="rgba(212,168,23,0.14)" strokeWidth="1"/>
                <path d="M26 13 L39 26 L26 39 L13 26 Z" fill="none" stroke="rgba(212,168,23,0.08)" strokeWidth="0.75"/>
                <circle cx="26" cy="26" r="2" fill="rgba(212,168,23,0.12)"/>
                <circle cx="0"  cy="0"  r="1.5" fill="rgba(212,168,23,0.08)"/>
                <circle cx="52" cy="0"  r="1.5" fill="rgba(212,168,23,0.08)"/>
                <circle cx="0"  cy="52" r="1.5" fill="rgba(212,168,23,0.08)"/>
                <circle cx="52" cy="52" r="1.5" fill="rgba(212,168,23,0.08)"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-nakshi)"/>
          </svg>
        </div>

        {/* Glow orbs */}
        <div aria-hidden className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.22) 0%, transparent 70%)' }}/>
        <div aria-hidden className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.16) 0%, transparent 70%)' }}/>

        <div className="relative flex items-center gap-6 p-6 sm:p-8">
          {/* ── Left: content ───────────────────────────── */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="min-w-0 flex-1 space-y-4"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"/>
                ঈদ-উল-আযহা ২০২৬ · কমিউনিটি দ্বারা পরিচালিত
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <GoruKoiLogo size={52} />
              <div>
                <div className="font-display text-xl font-black text-white leading-tight tracking-tight">
                  গরুকই
                </div>
                <div className="text-xs font-medium text-white/40 tracking-widest uppercase">
                  GoruKoi
                </div>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-3xl font-black leading-tight text-white sm:text-4xl"
            >
              বাংলাদেশের{' '}
              <span className="text-gold">গরুর হাট,</span>
              <br/>এক জায়গায়।
            </motion.h1>

            <motion.p variants={fadeUp} className="text-sm leading-relaxed text-white/60 sm:text-base">
              লাইভ দাম, ভিড় ও কমিউনিটি রিভিউ — আপনার কাছাকাছি হাট খুঁজুন এবং
              কেনাকাটার অভিজ্ঞতা শেয়ার করুন।
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-2.5">
              <button
                onClick={() => setPurchaseOpen(true)}
                className="group inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-2.5 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-300 active:translate-y-0"
              >
                <ShoppingBag className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"/>
                গরু কিনছেন? শেয়ার করুন
              </button>
              <Link
                to="/map"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/18"
              >
                <MapIcon className="h-4 w-4"/>
                ম্যাপে দেখুন
              </Link>
              <Link
                to="/add"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/55 transition-all duration-200 hover:border-white/25 hover:text-white"
              >
                <Plus className="h-4 w-4"/>
                নতুন হাট
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Right: decorative cattle ring (sm+) ─────── */}
          <div className="hidden shrink-0 items-center justify-center sm:flex">
            <div className="relative flex h-44 w-44 items-center justify-center">
              {/* Slowly rotating outer dashed ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/25"
              />
              {/* Static mid ring */}
              <div className="absolute h-32 w-32 rounded-full border border-white/10 bg-white/[0.03]"/>
              {/* Dot accents on ring */}
              {[0, 72, 144, 216, 288].map((deg) => (
                <div
                  key={deg}
                  className="absolute rounded-full bg-amber-400/50"
                  style={{
                    width: 6, height: 6,
                    top:  `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 68}px - 3px)`,
                    left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 68}px - 3px)`,
                  }}
                />
              ))}
              {/* Center circle */}
              <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-green-700/20 ring-1 ring-amber-400/30">
                <span className="text-4xl leading-none">🐂</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature cards ───────────────────────────────────────── */}
      <section className="grid gap-3 sm:grid-cols-3">
        {FEATURES.map((feat, i) => (
          <motion.div
            key={feat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className={`group rounded-2xl border bg-card p-4 shadow-sm ring-1 ${feat.ring} transition-shadow hover:shadow-md`}
          >
            <div
              className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${feat.tint} transition-transform group-hover:scale-110`}
            >
              <feat.icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold sm:text-base">{feat.label}</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {feat.desc}
            </p>
          </motion.div>
        ))}
      </section>

      {/* ── Section heading + filters ──────────────────────────── */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold">জনপ্রিয় হাট</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? 'লোড হচ্ছে…'
                : `${toBengaliNumerals(data?.total ?? 0)} টি হাট পাওয়া গেছে`}
            </p>
          </div>
        </div>

        <MarketFilters />
      </section>

      {/* ── Grid / empty / loading ─────────────────────────────── */}
      {isLoading ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </section>
      ) : data?.items.length ? (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((m) => (
            <MarketCard key={m.id} market={m} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed bg-muted/30 p-10 text-center">
          <div aria-hidden className="mb-2 text-5xl">
            🔎
          </div>
          <p className="font-semibold">কোনো হাট পাওয়া যায়নি</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ফিল্টার পরিবর্তন করুন, অথবা আপনার এলাকার একটি হাট যোগ করুন।
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/add">
                <Plus className="mr-1 h-4 w-4" />
                হাট যোগ করুন
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={f.reset}>
              <Search className="mr-1 h-4 w-4" />
              ফিল্টার রিসেট
            </Button>
          </div>
        </section>
      )}

      <GoruKinchenDialog open={purchaseOpen} onOpenChange={setPurchaseOpen} />
    </div>
  );
}
