'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { Star, ChevronRight, Loader2 } from 'lucide-react';
import type { RAWGGame } from '@/types/game.types';

interface GameCardProps {
  game: RAWGGame;
}

export default function GameCard({ game }: GameCardProps) {
  const releaseYear = game.released ? new Date(game.released).getFullYear() : null;
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href={`/games/${game.slug}`} className="block" onClick={handleClick}>
      <motion.div
        className="group relative rounded-2xl overflow-hidden glass-card"
        initial={false}
        whileHover={shouldReduce ? undefined : { 
          y: -8,
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </motion.div>
        )}

        {/* Shine effect overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={shouldReduce ? undefined : { 
            x: '100%', 
            opacity: 1,
            transition: { duration: 0.6, ease: 'easeInOut' }
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
        />

        <div className="relative aspect-[4/3] overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}
          
          {game.metacritic && (
            <motion.div 
              className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold text-white z-20"
              style={{
                background: game.metacritic >= 75 
                  ? 'rgba(34, 197, 94, 0.9)' 
                  : game.metacritic >= 50 
                    ? 'rgba(234, 179, 8, 0.9)' 
                    : 'rgba(239, 68, 68, 0.9)',
                backdropFilter: 'blur(8px)',
              }}
              whileHover={shouldReduce ? undefined : { scale: 1.1 }}
            >
              {game.metacritic}
            </motion.div>
          )}
        </div>

        <div className="p-4">
          <motion.h3 
            className="font-semibold text-white text-base leading-tight line-clamp-2 mb-2"
            initial={false}
            whileHover={shouldReduce ? undefined : { x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {game.name}
          </motion.h3>

          <div className="flex items-center gap-2 mb-3">
            {game.genres?.[0] && (
              <span className="text-xs text-white/50 bg-white/5 px-2 py-0.5 rounded-full">
                {game.genres[0].name}
              </span>
            )}
            {releaseYear && (
              <span className="text-xs text-white/40">{releaseYear}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {game.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-medium text-white/70">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            
            <motion.div 
              className="flex items-center gap-1 text-xs font-medium text-white/60"
              whileHover={shouldReduce ? undefined : { x: 4, color: 'rgba(255,255,255,1)' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {isLoading ? 'Loading...' : 'View'}
              {!isLoading && <ChevronRight className="w-3.5 h-3.5" />}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
