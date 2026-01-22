'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Play, Star } from 'lucide-react';
import type { RAWGGame } from '@/types/game.types';

interface FeaturedHeroProps {
  games: RAWGGame[];
}

export default function FeaturedHero({ games }: FeaturedHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const shouldReduce = useReducedMotion();

  useEffect(() => {
    if (games.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(games.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [games.length]);

  const currentGame = games[currentIndex];
  const fadeTransition = shouldReduce ? { duration: 0.01 } : { duration: 0.8, ease: 'easeOut' as const };

  return (
    <section className="relative h-[500px] sm:h-[480px] lg:h-[520px] overflow-hidden">
      {games.slice(0, 5).map((game, index) => (
        <motion.div
          key={game.id}
          initial={false}
          animate={{ 
            opacity: index === currentIndex ? 1 : 0,
            scale: index === currentIndex ? 1 : 1.1,
          }}
          transition={{ duration: shouldReduce ? 0.01 : 1.2, ease: 'easeInOut' }}
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

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6 pt-8 lg:p-10 lg:pt-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame?.id}
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={fadeTransition}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              {currentGame?.genres?.slice(0, 2).map((genre) => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 text-xs font-medium text-white/80 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm"
                >
                  {genre.name}
                </span>
              ))}
              {currentGame?.metacritic && (
                <span className="px-3 py-1 text-xs font-bold text-green-400 rounded-full border border-green-400/30 bg-green-400/10 backdrop-blur-sm">
                  {currentGame.metacritic}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {currentGame?.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              {currentGame?.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-white/80">
                    {currentGame.rating.toFixed(1)}
                  </span>
                </div>
              )}
              {currentGame?.released && (
                <span className="text-sm text-white/50">
                  {new Date(currentGame.released).getFullYear()}
                </span>
              )}
            </div>

            <Link
              href={`/games/${currentGame?.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm transition-all hover:bg-white/90 hover:scale-105 active:scale-100"
            >
              <Play className="w-4 h-4 fill-current" />
              View Game
            </Link>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 flex gap-2">
          {games.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? 'w-8 bg-white' 
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
