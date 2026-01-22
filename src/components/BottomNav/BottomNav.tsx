'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, User, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setMobileSearchOpen } = useSearch();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/' || pathname.startsWith('/games/');
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 lg:hidden">
      <div 
        className="flex items-center p-1.5 rounded-full border border-white/[0.1] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.5) 0%, rgba(25, 45, 45, 0.7) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <div className="flex items-center w-[200px]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const href = item.requiresAuth && !session ? '/login' : item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  'relative flex items-center justify-center py-3 rounded-full transition-all duration-300',
                  active ? 'text-black flex-[2]' : 'text-white/60 hover:text-white flex-1'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bottomNavBg"
                    className="absolute inset-0 bg-white/90 rounded-full"
                    transition={{
                      type: 'spring',
                      stiffness: 350,
                      damping: 30,
                    }}
                  />
                )}
                <div className="flex items-center gap-2 relative z-10">
                  <Icon className="w-5 h-5 shrink-0" />
                  <span 
                    className={cn(
                      'text-sm font-medium overflow-hidden whitespace-nowrap transition-all duration-300 ease-out',
                      active ? 'w-auto max-w-[60px] opacity-100' : 'w-0 max-w-0 opacity-0'
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            onClick={() => setMobileSearchOpen(true)}
            className="flex items-center justify-center py-3 px-3 rounded-full text-white/60 hover:text-white transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
