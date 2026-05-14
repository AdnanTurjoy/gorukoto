import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { apiErrorMessage } from '@/lib/api';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { from?: string } };
  const { toast } = useToast();
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
      navigate(state?.from ?? '/');
    } catch (err) {
      toast({ title: 'লগইন ব্যর্থ', description: apiErrorMessage(err), variant: 'destructive' });
    }
  });

  return (
    <div className="mx-auto max-w-md space-y-6 py-10">
      <h1 className="text-2xl font-bold">লগইন করুন</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} />
          {formState.errors.email && <p className="text-xs text-destructive">{formState.errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
          {formState.errors.password && <p className="text-xs text-destructive">{formState.errors.password.message}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={login.isPending}>
          {login.isPending ? 'অপেক্ষা করুন…' : 'লগইন'}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        নতুন ব্যবহারকারী? <Link to="/register" className="text-primary underline">রেজিস্টার করুন</Link>
      </p>
    </div>
  );
}
