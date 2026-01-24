'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User, Sun, Moon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import { getActiveTab } from '@/constants';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
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
      <div className="flex items-center gap-1 p-1.5 rounded-full nav-glass nav-border nav-shadow">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const href = item.requiresAuth && !session ? '/login' : item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'relative flex items-center justify-center py-3 px-5 rounded-full transition-all',
                active
                  ? 'text-(--nav-icon-active)'
                  : 'text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover)'
              )}
            >
              {active && (
                <motion.div
                  layoutId={shouldReduce ? undefined : 'bottomNavIndicator'}
                  className="absolute inset-0 rounded-full bg-(--nav-active) shadow-[0_0_20px_rgba(255,255,255,0.15)]"
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

        <div className="w-px h-8 bg-(--nav-separator)" />

        <button
          onClick={toggleTheme}
          className="relative flex items-center justify-center py-3 px-4 rounded-full transition-all text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover)"
        >
          {theme === 'dark' ? (
            <motion.div
              key="sun"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Sun className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Moon className="w-5 h-5" />
            </motion.div>
          )}
        </button>
      </div>
    </nav>
  );
}
