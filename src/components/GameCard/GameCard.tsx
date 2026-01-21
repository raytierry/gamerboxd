'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import type { RAWGGame } from '@/types/game.types';

interface GameCardProps {
  game: RAWGGame;
}

export default function GameCard({ game }: GameCardProps) {
  const releaseYear = game.released ? new Date(game.released).getFullYear() : null;

  return (
    <Link href={`/games/${game.slug}`} className="block">
      <motion.div
        className="group"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-[#1a1a1d]">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <span className="text-4xl">🎮</span>
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {game.metacritic && (
            <div
              className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold ${
                game.metacritic >= 75
                  ? 'bg-green-500 text-white'
                  : game.metacritic >= 50
                  ? 'bg-yellow-500 text-black'
                  : 'bg-red-500 text-white'
              }`}
            >
              {game.metacritic}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white text-sm font-medium line-clamp-2">{game.name}</p>
            {releaseYear && (
              <p className="text-gray-400 text-xs mt-1">{releaseYear}</p>
            )}
          </div>
        </div>

        <div className="mt-2 group-hover:opacity-0 transition-opacity duration-300">
          <p className="text-white text-sm font-medium line-clamp-1">{game.name}</p>
          {releaseYear && (
            <p className="text-gray-500 text-xs">{releaseYear}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
