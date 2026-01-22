'use client';

import { useRef, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearch } from '@/contexts/SearchContext';

export default function MobileSearchOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const { query, setQuery, isMobileSearchOpen, setMobileSearchOpen } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDismiss = useCallback(() => {
    setMobileSearchOpen(false);
  }, [setMobileSearchOpen]);

  const handleCancel = useCallback(() => {
    setMobileSearchOpen(false);
    setQuery('');
  }, [setMobileSearchOpen, setQuery]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileSearchOpen) {
        handleDismiss();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSearchOpen, handleDismiss]);

  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (value && pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <AnimatePresence>
      {isMobileSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-4 left-4 right-4 z-50 lg:hidden"
          >
            <div
              className="flex items-center gap-3 px-5 py-3 rounded-full border border-white/[0.1]"
              style={{
                background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.8) 0%, rgba(25, 45, 45, 0.95) 100%)',
                backdropFilter: 'blur(24px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <Search className="w-5 h-5 text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query) {
                    handleDismiss();
                  }
                }}
                placeholder="Search games..."
                className="flex-1 bg-transparent text-base text-white placeholder:text-white/40 outline-none border-none min-w-0"
              />
              <button
                onClick={handleCancel}
                className="text-sm text-white/60 hover:text-white transition-colors shrink-0 px-2"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
