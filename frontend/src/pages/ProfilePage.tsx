import { SEO } from '@/components/common/SEO';
import { useAuthStore } from '@/stores/authStore';
import { useMe } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const { data: me, isLoading } = useMe();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  if (isLoading || !me) return <Skeleton className="h-40 w-full" />;

  return (
    <div className="mx-auto max-w-xl space-y-6 py-6">
      <SEO title="প্রোফাইল" canonical="/profile" noIndex />
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={me.avatarUrl ?? undefined} />
          <AvatarFallback>{me.name.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">{me.name}</h1>
          <p className="text-sm text-muted-foreground">{me.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => navigate('/add')}>হাট যোগ করুন</Button>
        <Button variant="outline" onClick={() => { logout(); navigate('/'); }}>লগআউট</Button>
      </div>
    </div>
  );
}
