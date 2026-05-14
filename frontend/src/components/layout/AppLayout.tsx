import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export function AppLayout() {
  const { pathname } = useLocation();
  // Map page wants to render edge-to-edge; the rest gets normal container padding.
  const isImmersive = pathname.startsWith('/map');
  return (
    <div className="min-h-dvh bg-background pb-20 sm:pb-0">
      <Header />
      <main className={isImmersive ? 'h-[calc(100dvh-3.5rem)]' : 'container mx-auto p-4 sm:p-6'}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
