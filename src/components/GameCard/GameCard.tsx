'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RAWGGame } from '@/types/game.types';
import { formatRating } from '@/lib/format';

interface GameCardProps {
  game: RAWGGame;
}

function getRatingClass(rating: number): string {
  if (rating >= 75) return 'rating-green';
  if (rating >= 50) return 'rating-yellow';
  return 'rating-red';
}

export default function GameCard({ game }: GameCardProps) {
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href={`/games/${game.slug}`} className="block group" onClick={handleClick}>
      <motion.div
        className="relative rounded-2xl overflow-hidden nav-border card-shadow"
        initial={false}
        whileHover={shouldReduce ? undefined : {
          y: -4,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
      >
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}

        <div className="relative aspect-2/3 overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {game.metacritic && (
            <div className="absolute top-3 right-3 z-20">
              <div
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-lg backdrop-blur-sm',
                  getRatingClass(game.metacritic)
                )}
              >
                {game.metacritic}
              </div>
            </div>
          )}

          <div className="hidden lg:block absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="p-3 rounded-xl bg-black/85 backdrop-blur-md border border-white/10 hero-shadow">
              <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2">
                {game.name}
              </h3>

              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {game.rating && game.rating > 0 && (
                  <div className="flex items-center gap-1 text-sm text-white/90">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{formatRating(game.rating)}</span>
                  </div>
                )}
                {game.released && (
                  <span className="text-xs text-white/60">
                    {new Date(game.released).getFullYear()}
                  </span>
                )}
              </div>

              {game.genres && game.genres.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {game.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="px-2 py-0.5 text-[10px] font-medium text-white/70 rounded-full border border-white/20 bg-white/10"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile title below card */}
      <div className="lg:hidden mt-2 px-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {game.name}
        </h3>
        {game.rating && game.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{formatRating(game.rating)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
