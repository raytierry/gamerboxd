'use client';

import type { RAWGGame } from '@/types/game.types';
import GameCard from '@/components/GameCard';
import GameGridSkeleton from './GameGridSkeleton';

interface GameGridProps {
  games: RAWGGame[];
  isLoading?: boolean;
}

export default function GameGrid({ games, isLoading }: GameGridProps) {
  if (isLoading) {
    return <GameGridSkeleton />;
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No games found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
