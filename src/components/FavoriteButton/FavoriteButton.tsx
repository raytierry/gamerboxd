'use client';

import { useState } from 'react';
import { Heart, Trophy, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavoriteStatus, useAddToFavorites, useRemoveFromFavorites } from '@/hooks/use-favorites';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteButtonProps {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

const RANK_COLORS = [
  'from-amber-400 to-yellow-500',
  'from-slate-300 to-slate-400',
  'from-amber-600 to-amber-700',
  'from-indigo-400 to-indigo-500',
  'from-purple-400 to-purple-500',
  'from-pink-400 to-pink-500',
  'from-rose-400 to-rose-500',
  'from-orange-400 to-orange-500',
  'from-teal-400 to-teal-500',
  'from-cyan-400 to-cyan-500',
];

export function FavoriteButton({ gameId, gameSlug, gameName, gameImage }: FavoriteButtonProps) {
  const [showRankPicker, setShowRankPicker] = useState(false);
  const { data: favoriteStatus, isLoading } = useFavoriteStatus(gameId);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const isFavorite = !!favoriteStatus;
  const currentRank = favoriteStatus?.rank;
  const isPending = addToFavorites.isPending || removeFromFavorites.isPending;

  const handleRankSelect = async (rank: number) => {
    await addToFavorites.mutateAsync({
      game: { gameId, gameSlug, gameName, gameImage },
      rank,
    });
    setShowRankPicker(false);
  };

  const handleRemove = async () => {
    await removeFromFavorites.mutateAsync(gameId);
    setShowRankPicker(false);
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant={isFavorite ? 'default' : 'outline'}
        onClick={() => setShowRankPicker(!showRankPicker)}
        disabled={isPending}
        className={`gap-2 ${isFavorite ? 'bg-pink-600 hover:bg-pink-700 border-pink-600' : ''}`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        )}
        {isFavorite ? `#${currentRank} Favorite` : 'Add to Favorites'}
      </Button>

      <AnimatePresence>
        {showRankPicker && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 p-4 bg-card border border-border rounded-xl shadow-xl z-50 min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-foreground">Pick your rank</span>
              </div>
              <button
                onClick={() => setShowRankPicker(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => (
                <motion.button
                  key={rank}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleRankSelect(rank)}
                  disabled={isPending}
                  className={`
                    relative h-10 w-10 rounded-lg font-bold text-sm
                    bg-linear-to-br ${RANK_COLORS[rank - 1]}
                    text-white shadow-md
                    hover:shadow-lg transition-shadow
                    disabled:opacity-50
                    ${currentRank === rank ? 'ring-2 ring-white ring-offset-2 ring-offset-card' : ''}
                  `}
                >
                  {rank}
                </motion.button>
              ))}
            </div>

            {isFavorite && (
              <button
                onClick={handleRemove}
                disabled={isPending}
                className="mt-3 w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Remove from favorites
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
