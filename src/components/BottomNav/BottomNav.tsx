'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
];

function getActiveTab(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/games/')) {
    return '/';
  }
  if (pathname.startsWith('/search')) {
    return '/search';
  }
  if (pathname.startsWith('/profile')) {
    return '/profile';
  }
  return '/';
}

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const shouldReduce = useReducedMotion();
  
  const activeTab = getActiveTab(pathname);
  const prevActiveTabRef = useRef(activeTab);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  
  useEffect(() => {
    const tabChanged = prevActiveTabRef.current !== activeTab;
    setShouldAnimate(tabChanged);
    prevActiveTabRef.current = activeTab;
  }, [activeTab]);

  const isActive = (path: string) => path === activeTab;

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 lg:hidden">
      <div
        className="flex items-center p-1.5 rounded-full border border-white/[0.1] glass-nav"
        style={{
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item.href);
          const href = item.requiresAuth && !session ? '/login' : item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'relative flex items-center justify-center py-3 px-5 rounded-full',
                active ? 'text-black' : 'text-white/60 hover:text-white'
              )}
            >
              {active && (
                <motion.div
                  layoutId={shouldReduce ? undefined : 'bottomNavIndicator'}
                  className="absolute inset-0 bg-white rounded-full"
                  initial={false}
                  transition={shouldReduce || !shouldAnimate
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 500, damping: 35 }
                  }
                />
              )}
              <Icon className="w-5 h-5 relative z-10" />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
