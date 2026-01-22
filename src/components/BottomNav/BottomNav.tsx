'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, User, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearch } from '@/contexts/SearchContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/profile', icon: User, label: 'Profile', requiresAuth: true },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { query, setQuery } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (value && pathname !== '/') {
      router.push('/');
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <div 
        className="flex items-center p-1.5 rounded-full border border-white/[0.1] overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.5) 0%, rgba(25, 45, 45, 0.7) 100%)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
        }}
      >
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              key="search"
              initial={{ width: 200, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 200, opacity: 0 }}
              transition={{ 
                width: { type: 'spring', stiffness: 300, damping: 25 },
                opacity: { duration: 0.15 }
              }}
              className="flex items-center gap-2 px-4 py-2"
            >
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search games..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none border-none min-w-0"
              />
              <button
                onClick={handleSearchClose}
                className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center w-[200px]"
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
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center py-3 px-3 rounded-full text-white/60 hover:text-white transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
