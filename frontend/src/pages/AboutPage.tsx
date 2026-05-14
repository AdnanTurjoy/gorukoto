import { Link } from 'react-router-dom';
import {
  Heart,
  Linkedin,
  Map,
  MessageSquare,
  Search,
  ShoppingBag,
  Timer,
  Users,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Map,
    title: 'লাইভ ম্যাপে হাট',
    body: 'বাংলাদেশের গরুর হাটগুলো OpenStreetMap-এ পিন আকারে দেখুন — দাম অনুযায়ী রঙ-কোডেড।',
  },
  {
    icon: Search,
    title: 'বিভাগ ও জেলা ভিত্তিক সার্চ',
    body: 'বিভাগ, জেলা, দাম, ভিড় — যেকোনো ফিল্টার দিয়ে আপনার সুবিধামতো হাট খুঁজুন।',
  },
  {
    icon: Users,
    title: 'কাছাকাছি হাট',
    body: 'আপনার বর্তমান অবস্থান থেকে নিকটতম হাটগুলো এক ক্লিকে দেখুন।',
  },
  {
    icon: Timer,
    title: 'লাইভ দাম আপডেট',
    body: 'হাটে যারা আছেন, তারা মুহূর্তের দাম জানাচ্ছেন — “৫ মিনিট আগে” টাইপ আপডেট সবার জন্য।',
  },
  {
    icon: ShoppingBag,
    title: 'গরু কিনছেন? শেয়ার করুন',
    body: 'কিনে ফেলেছেন? ছবি ও দাম দিয়ে অন্যদের জানান — কমিউনিটি প্রাইস ডেটা গড়ে তুলুন।',
  },
  {
    icon: MessageSquare,
    title: 'কমিউনিটি রিভিউ',
    body: 'কোন হাটে দাম স্বাভাবিক, কোথায় ভিড় বেশি — অন্যদের অভিজ্ঞতা পড়ুন, নিজেরটাও লিখুন।',
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-6">
      <header className="space-y-2 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground">
          গ
        </div>
        <h1 className="text-3xl font-bold">গরুকই সম্পর্কে</h1>
        <p className="mx-auto max-w-xl text-muted-foreground">
          কোরবানির ঈদে বাংলাদেশের গরুর হাট খুঁজে পাওয়া, লাইভ দাম জানা এবং অন্যদের অভিজ্ঞতা থেকে
          শেখা — সবকিছু এক জায়গায়, কমিউনিটি দ্বারা পরিচালিত।
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-xl font-semibold">এই অ্যাপে কী কী আছে?</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title}>
              <CardContent className="flex gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold leading-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-card p-5">
        <h2 className="text-xl font-semibold">যেভাবে কাজ করে</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
          <li>হোম পেজ বা ম্যাপ থেকে আপনার পছন্দের হাট বেছে নিন।</li>
          <li>হাটের বিস্তারিত পেজে লাইভ দাম, কে কী কিনেছেন, এবং রিভিউ দেখুন।</li>
          <li>আপনিও হাটে গেলে — আজকের দাম জানান, কেনা গরু শেয়ার করুন বা রিভিউ লিখুন।</li>
          <li>আপনার এলাকার কোনো হাট তালিকায় না থাকলে নিজেই যোগ করুন।</li>
        </ol>
      </section>

      <footer className="space-y-3 border-t pt-6 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          তৈরি করেছেন <Heart className="h-4 w-4 fill-destructive text-destructive" /> দিয়ে — Adnan
        </p>
        <a
          href="https://www.linkedin.com/in/adnan005/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-foreground transition-colors hover:bg-accent"
        >
          <Linkedin className="h-4 w-4 text-[#0a66c2]" />
          linkedin.com/in/adnan005
        </a>
        <p className="text-xs">
          <Link to="/" className="text-primary underline">
            হোমে ফিরে যান →
          </Link>
        </p>
      </footer>
    </div>
  );
}
