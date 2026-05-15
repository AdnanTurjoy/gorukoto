import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';

export default function GoogleCallbackPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error || !token) {
      navigate('/login', { replace: true });
      return;
    }

    api
      .get<User>('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setSession(token, data);
        navigate('/', { replace: true });
      })
      .catch(() => navigate('/login', { replace: true }));
  }, [navigate, setSession]);

  return <LoadingScreen />;
}
