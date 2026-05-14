import { Link, NavLink, useLocation } from 'react-router-dom';
import { Home, Map, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/', label: 'হোম', icon: Home, end: true },
  { to: '/map', label: 'ম্যাপ', icon: Map },
  { to: '/profile', label: 'প্রোফাইল', icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  const onMap = pathname.startsWith('/map');

  return (
    <>
      <Link
        to="/add"
        aria-label="হাট যোগ করুন"
        className={cn(
          'fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg',
          'transition-transform hover:scale-105 active:scale-95',
          onMap ? 'bottom-24 sm:bottom-6' : 'bottom-24 sm:bottom-6',
        )}
      >
        <Plus className="h-6 w-6" />
      </Link>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 backdrop-blur sm:hidden">
        <ul className="safe-bottom mx-auto grid max-w-md grid-cols-3 gap-1 px-4 py-2">
          {items.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 rounded-md py-2 text-xs',
                    isActive ? 'text-primary' : 'text-muted-foreground',
                  )
                }
              >
                <Icon className="h-5 w-5" />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
