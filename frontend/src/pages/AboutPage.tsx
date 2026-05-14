import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Linkedin,
  Map,
  MessageSquare,
  Search,
  ShoppingBag,
  Timer,
  Users,
} from 'lucide-react';
import { GoruKoiLogo } from '@/components/ui/GoruKoiLogo';
import { SEO } from '@/components/common/SEO';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    icon: Map,
    title: 'লাইভ ম্যাপে হাট',
    body: 'বাংলাদেশের গরুর হাটগুলো OpenStreetMap-এ পিন আকারে দেখুন — দাম অনুযায়ী রঙ-কোডেড।',
    tint: '#16a34a',
    bg: '#dcfce7',
  },
  {
    icon: Search,
    title: 'বিভাগ ও জেলা ভিত্তিক সার্চ',
    body: 'বিভাগ, জেলা, দাম, ভিড় — যেকোনো ফিল্টার দিয়ে আপনার সুবিধামতো হাট খুঁজুন।',
    tint: '#0284c7',
    bg: '#e0f2fe',
  },
  {
    icon: Users,
    title: 'কাছাকাছি হাট',
    body: 'আপনার বর্তমান অবস্থান থেকে নিকটতম হাটগুলো এক ক্লিকে দেখুন।',
    tint: '#7c3aed',
    bg: '#ede9fe',
  },
  {
    icon: Timer,
    title: 'লাইভ দাম আপডেট',
    body: 'হাটে যারা আছেন তারা মুহূর্তের দাম জানাচ্ছেন — "৫ মিনিট আগে" টাইপ আপডেট সবার জন্য।',
    tint: '#f59e0b',
    bg: '#fef3c7',
  },
  {
    icon: ShoppingBag,
    title: 'গরু কিনছেন? শেয়ার করুন',
    body: 'কিনে ফেলেছেন? ছবি ও দাম দিয়ে অন্যদের জানান — কমিউনিটি প্রাইস ডেটা গড়ে তুলুন।',
    tint: '#dc2626',
    bg: '#fee2e2',
  },
  {
    icon: MessageSquare,
    title: 'কমিউনিটি রিভিউ',
    body: 'কোন হাটে দাম স্বাভাবিক, কোথায় ভিড় বেশি — অন্যদের অভিজ্ঞতা পড়ুন, নিজেরটাও লিখুন।',
    tint: '#0891b2',
    bg: '#cffafe',
  },
];

const steps = [
  { n: '১', text: 'হোম পেজ বা ম্যাপ থেকে আপনার পছন্দের হাট বেছে নিন।' },
  { n: '২', text: 'হাটের বিস্তারিত পেজে লাইভ দাম ও কে কী কিনেছেন দেখুন।' },
  { n: '৩', text: 'আপনিও হাটে গেলে — আজকের দাম জানান বা কেনা গরু শেয়ার করুন।' },
  { n: '৪', text: 'আপনার এলাকার কোনো হাট তালিকায় না থাকলে নিজেই যোগ করুন।' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <SEO
        title="গরুকই সম্পর্কে"
        description="গরুকই সম্পর্কে জানুন — বাংলাদেশের গরুর হাট কমিউনিটি প্ল্যাটফর্ম, কোরবানির ঈদে লাইভ দাম ও তথ্য।"
        canonical="/about"
      />

      {/* ── Hero ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl shadow-xl"
        style={{ background: 'linear-gradient(145deg, #0b3420, #0f4a2a, #0c3a22)' }}
      >
        {/* Nakshi SVG pattern */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden>
          <defs>
            <pattern id="about-nakshi" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke="#fff" strokeWidth="0.8"/>
              <circle cx="20" cy="20" r="2.5" fill="#fff"/>
              <circle cx="0"  cy="0"  r="1.2" fill="#fff"/>
              <circle cx="40" cy="0"  r="1.2" fill="#fff"/>
              <circle cx="0"  cy="40" r="1.2" fill="#fff"/>
              <circle cx="40" cy="40" r="1.2" fill="#fff"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-nakshi)"/>
        </svg>

        {/* Glow orb */}
        <div
          className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #16a34a, transparent 70%)' }}
        />

        <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <GoruKoiLogo size={64} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              ঈদ-উল-আযহা ২০২৬ · কমিউনিটি দ্বারা পরিচালিত
            </div>
            <h1 className="font-display text-3xl font-black text-white sm:text-4xl">
              গরুকই সম্পর্কে
            </h1>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-white/60 sm:text-base">
              কোরবানির ঈদে বাংলাদেশের গরুর হাট খুঁজে পাওয়া, লাইভ দাম জানা এবং
              কমিউনিটির অভিজ্ঞতা থেকে শেখা — সবকিছু এক জায়গায়।
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Features ──────────────────────────────────────── */}
      <section>
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 font-display text-xl font-black"
        >
          এই অ্যাপে কী কী আছে?
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="grid gap-3 sm:grid-cols-2"
        >
          {features.map(({ icon: Icon, title, body, tint, bg }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="relative overflow-hidden rounded-2xl border bg-card p-4 shadow-sm"
            >
              {/* Subtle tint wash */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-16 opacity-30"
                style={{ background: `linear-gradient(to bottom, ${bg}, transparent)` }}
              />
              <div className="relative flex gap-3">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: bg }}
                >
                  <Icon className="h-5 w-5" style={{ color: tint }} />
                </span>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold leading-snug">{title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div className="flex items-center gap-2 border-b bg-muted/20 px-5 py-3.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-xs font-black text-primary">?</span>
          </span>
          <h2 className="text-sm font-bold">যেভাবে কাজ করে</h2>
        </div>

        <div className="p-5">
          <ol className="space-y-0">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                {/* Step number + connector */}
                <div className="flex flex-col items-center">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-display text-sm font-black text-primary-foreground">
                    {step.n}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="my-1 w-px flex-1 bg-border" />
                  )}
                </div>
                <p className={`text-sm leading-relaxed text-muted-foreground ${i < steps.length - 1 ? 'pb-4' : ''}`}>
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      {/* ── Creator ───────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-2xl border bg-card shadow-sm"
      >
        <div
          className="px-6 py-8 text-center"
          style={{ background: 'linear-gradient(160deg, #f0fdf4, #fefce8, #f0fdf4)' }}
        >
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-700 font-display text-2xl font-black text-white shadow-lg">
            A
          </div>
          <h3 className="font-display text-lg font-black text-foreground">Adnan</h3>
          <p className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            তৈরি করেছেন
            <Heart className="mx-1 h-3.5 w-3.5 fill-red-500 text-red-500" />
            দিয়ে
          </p>
          <a
            href="https://www.linkedin.com/in/adnan005/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border bg-white/80 px-5 py-2 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Linkedin className="h-4 w-4 text-[#0a66c2]" />
            linkedin.com/in/adnan005
          </a>
        </div>
      </motion.section>

      {/* ── Back link ─────────────────────────────────────── */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          হোমে ফিরে যান
        </Link>
      </div>

    </div>
  );
}
