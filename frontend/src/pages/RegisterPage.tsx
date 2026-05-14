import { Link, useNavigate } from 'react-router-dom';
import { SEO } from '@/components/common/SEO';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().regex(/^\+?\d{10,15}$/, 'বৈধ ফোন নম্বর দিন').optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const reg = useRegister();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await reg.mutateAsync({
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone || undefined,
      });
      navigate('/');
    } catch (err) {
      toast({ title: 'রেজিস্ট্রেশন ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <div className="mx-auto max-w-md space-y-6 py-10">
      <SEO title="নিবন্ধন" canonical="/register" noIndex />
      <h1 className="text-2xl font-bold">রেজিস্টার করুন</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label>নাম</Label>
          <Input {...register('name')} />
          {formState.errors.name && <p className="text-xs text-destructive">{formState.errors.name.message}</p>}
        </div>
        <div>
          <Label>ইমেইল</Label>
          <Input type="email" {...register('email')} />
          {formState.errors.email && <p className="text-xs text-destructive">{formState.errors.email.message}</p>}
        </div>
        <div>
          <Label>ফোন (ঐচ্ছিক)</Label>
          <Input {...register('phone')} placeholder="+8801XXXXXXXXX" />
          {formState.errors.phone && <p className="text-xs text-destructive">{formState.errors.phone.message}</p>}
        </div>
        <div>
          <Label>পাসওয়ার্ড</Label>
          <Input type="password" {...register('password')} />
          {formState.errors.password && <p className="text-xs text-destructive">{formState.errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={reg.isPending}>
          {reg.isPending ? 'অপেক্ষা করুন…' : 'অ্যাকাউন্ট তৈরি করুন'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        ইতোমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-primary underline">লগইন</Link>
      </p>
    </div>
  );
}
