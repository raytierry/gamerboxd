'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Play, Star } from 'lucide-react';
import type { RAWGGame } from '@/types/game.types';
import { formatRating } from '@/lib/format';

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

  // Helper to get the best image for hero banner
  // Priority: artwork (best quality, 16:9) > screenshot (landscape) > cover (fallback)
  const getHeroImage = (game: RAWGGame) => {
    // Check if game has artworks (via short_screenshots with artwork data)
    const screenshots = game.short_screenshots;

    // Artworks are typically the first in the array and have higher quality
    // They're specifically designed for promotional use
    if (screenshots && screenshots.length > 0 && screenshots[0].image) {
      return screenshots[0].image;
    }

    // Fall back to background_image (cover)
    return game.background_image;
  };

  return (
    <section className="relative h-full w-full overflow-hidden">
      {games.slice(0, 5).map((game, index) => {
        const heroImage = getHeroImage(game);
        return (
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
            {heroImage && (
              <Image
                src={heroImage}
                alt={game.name}
                fill
                priority={index === 0}
                loading={index === 0 ? undefined : "lazy"}
                className="object-cover"
                sizes="100vw"
              />
            )}
          </motion.div>
        );
      })}

      {/* Gradient overlays - lighter vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

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
                  className="px-3 py-1 text-xs font-medium text-white/80 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  {genre.name}
                </span>
              ))}
              {currentGame?.metacritic && (
                <span
                  className="px-3 py-1 text-xs font-bold text-green-400 rounded-full border border-green-400/30 bg-green-400/10 backdrop-blur-sm"
                  style={{
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(34, 197, 94, 0.15)'
                  }}
                >
                  {currentGame.metacritic}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
              {currentGame?.name}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              {currentGame?.rating && currentGame.rating > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-white/80">
                    {formatRating(currentGame.rating)}
                  </span>
                </div>
              )}
              {currentGame?.released && (
                <span className="text-sm text-white/50">
                  {new Date(currentGame.released).getFullYear()}
                </span>
              )}
            </div>

            {currentGame?.description_raw && (
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6 line-clamp-3 max-w-2xl">
                {currentGame.description_raw}
              </p>
            )}

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
