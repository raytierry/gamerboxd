'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, Search, User, Sun, Moon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/providers/ThemeProvider';
import { getActiveTab } from '@/constants';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/search', icon: Search, label: 'Search' },
  { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
];

export default function LeftNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const shouldReduce = useReducedMotion();

  const activeTab = getActiveTab(pathname);
  const isActive = (path: string) => path === activeTab;

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <div className="flex flex-col items-center gap-2 p-3 rounded-full nav-glass nav-border nav-shadow">
        <TooltipProvider>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const href = item.requiresAuth && !session ? '/login' : item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'relative flex items-center justify-center w-12 h-12 rounded-full transition-all',
                      active
                        ? 'text-(--nav-icon-active)'
                        : 'text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover)'
                    )}
                  >
                    {active && (
                      <motion.div
                        layoutId={shouldReduce ? undefined : 'leftNavIndicator'}
                        className="absolute inset-0 rounded-full bg-(--nav-active) shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                        initial={false}
                        transition={
                          shouldReduce
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 500, damping: 35 }
                        }
                      />
                    )}
                    <Icon className="w-5 h-5 relative z-10" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}

          <div className="w-8 h-px bg-(--nav-separator) my-1" />

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleTheme}
                className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover)"
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
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Switch to {theme === 'dark' ? 'light' : 'dark'} mode</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </nav>
  );
}
