'use client';

import { motion } from 'motion/react';
import type { RAWGGame } from '@/types/game.types';
import GameCard from '@/components/GameCard';
import GameGridSkeleton from './GameGridSkeleton';

interface GameGridProps {
  games: RAWGGame[];
  isLoading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export default function GameGrid({ games, isLoading }: GameGridProps) {
  if (isLoading) {
    return <GameGridSkeleton />;
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No games found</p>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {games.map((game) => (
        <motion.div key={game.id} variants={item}>
          <GameCard game={game} />
        </motion.div>
      ))}
    </motion.div>
  );
}
