'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';
import type { RAWGGame } from '@/types/game.types';

interface GameCardProps {
  game: RAWGGame;
}

export default function GameCard({ game }: GameCardProps) {
  const releaseYear = game.released ? new Date(game.released).getFullYear() : null;

  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <motion.div
        className="relative"
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary shadow-lg shadow-black/20">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
              <span className="text-5xl opacity-30">🎮</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent" />
          </div>

          <div className="absolute inset-0 rounded-xl ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all duration-300" />

          {game.metacritic && (
            <div
              className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md ${
                game.metacritic >= 75
                  ? 'bg-emerald-500/90 text-white'
                  : game.metacritic >= 50
                  ? 'bg-amber-500/90 text-black'
                  : 'bg-red-500/90 text-white'
              }`}
            >
              {game.metacritic}
            </div>
          )}

          {game.rating > 0 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-white">{game.rating.toFixed(1)}</span>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <p className="text-white font-semibold text-sm line-clamp-2 drop-shadow-lg">{game.name}</p>
            {releaseYear && (
              <p className="text-gray-300 text-xs mt-1">{releaseYear}</p>
            )}
          </div>
        </div>

        <div className="mt-3 px-1 group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-foreground font-medium text-sm line-clamp-1">{game.name}</p>
          {releaseYear && (
            <p className="text-muted-foreground text-xs mt-0.5">{releaseYear}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
