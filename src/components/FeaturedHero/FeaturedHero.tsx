'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import type { RAWGGame } from '@/types/game.types';

interface FeaturedHeroProps {
  games: RAWGGame[];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function FeaturedHero({ games }: FeaturedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const greeting = useMemo(() => getGreeting(), []);

  useEffect(() => {
    if (games.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(games.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [games.length]);

  const currentGame = games[currentIndex];

  return (
    <section className="relative h-[380px] lg:h-[420px] mx-4 lg:mx-6 rounded-2xl lg:rounded-3xl overflow-hidden">
      {games.slice(0, 5).map((game, index) => (
        <motion.div
          key={game.id}
          initial={false}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {game.background_image && (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              priority={index === 0}
              className="object-cover"
            />
          )}
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6 lg:p-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white/50 text-sm font-medium mb-2"
        >
          {greeting}
        </motion.p>

        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
          Discover your next<br />favorite game
        </h1>

        <div className="flex gap-3 flex-wrap">
          <Link
            href={`/games/${currentGame?.slug}`}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10 transition-all hover:bg-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden relative shrink-0">
              {currentGame?.background_image && (
                <Image
                  src={currentGame.background_image}
                  alt={currentGame.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-white/50">Featured</p>
              <p className="text-sm font-medium text-white truncate max-w-[140px]">
                {currentGame?.name}
              </p>
            </div>
          </Link>

          <div
            className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p className="text-xs text-white/50">This week</p>
              <p className="text-sm font-medium text-white">2.4k new games</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 flex gap-1.5">
          {games.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
