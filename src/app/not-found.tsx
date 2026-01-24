'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Home, Search, Gamepad2 } from 'lucide-react';

export default function NotFound() {
  const shouldReduce = useReducedMotion();

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <motion.div
        initial={shouldReduce ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-lg"
      >
        {/* Icon Container */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-12 mx-auto w-32 h-32"
        >
          {/* Glow Effect */}
          <div
            className="absolute inset-0 rounded-full bg-linear-to-br from-purple-500/20 to-pink-500/20 blur-3xl"
            style={{ transform: 'scale(1.5)' }}
          />

          {/* Icon Card */}
          <div
            className="relative w-full h-full rounded-3xl flex items-center justify-center"
            style={{
              border: '1px solid var(--nav-border-color)',
              background:
                'linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)',
              backdropFilter: 'blur(16px)',
              boxShadow:
                '0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)',
            }}
          >
            <Gamepad2 className="w-16 h-16 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Error Text */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="text-7xl font-bold text-foreground mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-3">
            Page not found
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or the game data
            is temporarily unavailable.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={shouldReduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/">
            <motion.div
              whileHover={shouldReduce ? undefined : { scale: 1.02 }}
              whileTap={shouldReduce ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all"
              style={{
                background: 'var(--button-primary)',
                color: 'var(--button-primary-text)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              }}
            >
              <Home className="w-5 h-5" />
              Go Home
            </motion.div>
          </Link>
          <Link href="/search">
            <motion.div
              whileHover={shouldReduce ? undefined : { scale: 1.02 }}
              whileTap={shouldReduce ? undefined : { scale: 0.98 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-medium transition-all"
              style={{
                border: '1px solid var(--nav-border-color)',
                background:
                  'linear-gradient(180deg, var(--glass-button-from) 0%, var(--glass-button-to) 100%)',
                backdropFilter: 'blur(12px)',
                color: 'var(--button-secondary-text)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Search className="w-5 h-5" />
              Search Games
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
