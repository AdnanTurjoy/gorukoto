import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, MapPin, Phone, TrendingUp, User, Users } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SEO } from '@/components/common/SEO';
import { GoruKoiLogo } from '@/components/ui/GoruKoiLogo';
import { useRegister } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';

const schema = z.object({
  name:     z.string().min(2),
  email:    z.string().email(),
  phone:    z.string().regex(/^\+?\d{10,15}$/, 'বৈধ ফোন নম্বর দিন').optional().or(z.literal('')),
  password: z.string().min(8),
});
type FormValues = z.infer<typeof schema>;

const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const PERKS = [
  { icon: TrendingUp, text: 'লাইভ দাম আপডেট করুন' },
  { icon: MapPin,     text: 'নতুন হাট যোগ করুন' },
  { icon: Users,      text: 'কমিউনিটির সাথে শেয়ার করুন' },
];

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const reg = useRegister();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await reg.mutateAsync({
        name:     values.name,
        email:    values.email,
        password: values.password,
        phone:    values.phone || undefined,
      });
      navigate('/');
    } catch (err) {
      toast({ title: 'রেজিস্ট্রেশন ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <>
      <SEO title="নিবন্ধন" canonical="/register" noIndex />
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl overflow-hidden rounded-3xl border shadow-2xl"
        >
          <div className="grid md:grid-cols-[1fr_1.1fr]">

            {/* ── Left panel ─────────────────────────────── */}
            <div
              className="relative hidden overflow-hidden p-8 md:flex md:flex-col md:justify-between"
              style={{ background: 'linear-gradient(145deg, #0b3420, #0f4a2a, #0c3a22)' }}
            >
              {/* Nakshi pattern */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
                <defs>
                  <pattern id="reg-nakshi" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M20 2 L38 20 L20 38 L2 20 Z" fill="none" stroke="#fff" strokeWidth="0.8"/>
                    <circle cx="20" cy="20" r="2" fill="#fff"/>
                    <circle cx="0"  cy="0"  r="1" fill="#fff"/>
                    <circle cx="40" cy="40" r="1" fill="#fff"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#reg-nakshi)"/>
              </svg>
              {/* Glow */}
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(circle, #16a34a, transparent 70%)' }}/>

              <div className="relative space-y-3">
                <div className="flex items-center gap-3">
                  <GoruKoiLogo size={48} />
                  <div>
                    <div className="font-display text-lg font-black text-white leading-tight">গরুকই</div>
                    <div className="text-[10px] font-medium tracking-widest text-white/40 uppercase">GoruKoi</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-white/55 pt-1">
                  বিনামূল্যে অ্যাকাউন্ট খুলুন এবং কমিউনিটিতে যোগ দিন।
                </p>
              </div>

              <div className="relative mt-8 space-y-3">
                {PERKS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10">
                      <Icon className="h-4 w-4 text-white/80" />
                    </span>
                    <span className="text-sm text-white/70">{text}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-8">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"/>
                  ঈদ-উল-আযহা ২০২৬
                </span>
              </div>
            </div>

            {/* ── Right / form panel ─────────────────────── */}
            <div className="bg-card p-8">
              {/* Mobile logo */}
              <div className="mb-6 flex items-center gap-2 md:hidden">
                <GoruKoiLogo size={36} />
                <span className="font-display text-base font-black">গরুকই</span>
              </div>

              <motion.div variants={fadeUp} initial="initial" animate="animate" className="space-y-5">
                <div>
                  <h1 className="font-display text-2xl font-black">অ্যাকাউন্ট তৈরি করুন</h1>
                  <p className="mt-1 text-sm text-muted-foreground">কমিউনিটিতে যোগ দিতে নিবন্ধন করুন।</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-3.5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <Label>নাম</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" placeholder="আপনার নাম" {...register('name')} />
                    </div>
                    {formState.errors.name && (
                      <p className="text-xs text-destructive">{formState.errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <Label>ইমেইল</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="email" className="pl-9" placeholder="you@example.com" {...register('email')} />
                    </div>
                    {formState.errors.email && (
                      <p className="text-xs text-destructive">{formState.errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <Label>
                      ফোন{' '}
                      <span className="text-xs font-normal text-muted-foreground">(ঐচ্ছিক)</span>
                    </Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" placeholder="+8801XXXXXXXXX" {...register('phone')} />
                    </div>
                    {formState.errors.phone && (
                      <p className="text-xs text-destructive">{formState.errors.phone.message}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <Label>পাসওয়ার্ড</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPw ? 'text' : 'password'}
                        autoComplete="new-password"
                        className="pl-9 pr-10"
                        placeholder="কমপক্ষে ৮ অক্ষর"
                        {...register('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formState.errors.password && (
                      <p className="text-xs text-destructive">{formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={reg.isPending}>
                    {reg.isPending ? 'অপেক্ষা করুন…' : 'অ্যাকাউন্ট তৈরি করুন'}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  ইতোমধ্যে অ্যাকাউন্ট আছে?{' '}
                  <Link to="/login" className="font-semibold text-primary hover:underline">
                    লগইন করুন
                  </Link>
                </p>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </>
  );
}
