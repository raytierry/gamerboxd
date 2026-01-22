'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { RAWGGame } from '@/types/game.types';

interface GameCardProps {
  game: RAWGGame;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-card">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-3xl opacity-20">🎮</span>
          </div>
        )}
        
        {game.metacritic && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-bold text-white">
            {game.metacritic}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-medium text-foreground line-clamp-1 group-hover:text-white/80 transition-colors">
          {game.name}
        </p>
        {game.genres?.[0] && (
          <p className="text-sm text-muted-foreground mt-0.5">{game.genres[0].name}</p>
        )}
      </div>
    </Link>
  );
}
