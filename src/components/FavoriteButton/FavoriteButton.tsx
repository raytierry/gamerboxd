'use client';

import { useState } from 'react';
import { Heart, Trophy, X, Loader2, ChevronDown } from 'lucide-react';
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

const RANK_BUTTON_STYLES = [
  { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-400/30' },
  { bg: 'bg-slate-400/15', text: 'text-slate-300', border: 'border-slate-400/30' },
  { bg: 'bg-amber-600/15', text: 'text-amber-500', border: 'border-amber-600/30' },
  { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-400/30' },
  { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-400/30' },
  { bg: 'bg-pink-500/15', text: 'text-pink-400', border: 'border-pink-400/30' },
  { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-400/30' },
  { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-400/30' },
  { bg: 'bg-teal-500/15', text: 'text-teal-400', border: 'border-teal-400/30' },
  { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-400/30' },
];

export function FavoriteButton({ gameId, gameSlug, gameName, gameImage }: FavoriteButtonProps) {
  const [showRankPicker, setShowRankPicker] = useState(false);
  const { data: favoriteStatus, isLoading } = useFavoriteStatus(gameId);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const isFavorite = !!favoriteStatus;
  const currentRank = favoriteStatus?.rank;
  const isPending = addToFavorites.isPending || removeFromFavorites.isPending;

  const rankStyle = currentRank ? RANK_BUTTON_STYLES[currentRank - 1] : null;

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
      <div className="h-12 w-40 bg-white/5 rounded-xl animate-pulse" />
    );
  }

  const buttonText = isFavorite ? `#${currentRank} Favorite` : 'Favorite';

  return (
    <div className="relative">
      <button
        onClick={() => setShowRankPicker(!showRankPicker)}
        disabled={isPending}
        className={`
          flex items-center gap-2 h-12 px-5 rounded-xl font-medium transition-all duration-200 border min-w-[160px]
          ${isFavorite && rankStyle
            ? `${rankStyle.bg} ${rankStyle.text} ${rankStyle.border}` 
            : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
          }
        `}
      >
        <span className="relative w-5 h-5 flex items-center justify-center">
          <motion.span
            key={isPending ? 'loading' : 'icon'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            )}
          </motion.span>
        </span>
        <span className="flex-1 text-left">{buttonText}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showRankPicker ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {showRankPicker && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent" 
              onClick={() => setShowRankPicker(false)} 
            />
            
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 p-4 pb-8 bg-[#1a1a1d] border-t border-white/10 rounded-t-2xl z-50 sm:hidden"
            >
              <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-400" />
                  <span className="font-medium text-white">Pick your rank</span>
                </div>
                <button
                  onClick={() => setShowRankPicker(false)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => (
                  <motion.button
                    key={rank}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRankSelect(rank)}
                    disabled={isPending}
                    className={`
                      h-14 rounded-xl font-bold text-lg
                      bg-linear-to-br ${RANK_COLORS[rank - 1]}
                      text-white shadow-lg
                      active:brightness-90 transition-all
                      disabled:opacity-50
                      ${currentRank === rank ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1a1a1d]' : ''}
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
                  className="mt-4 w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                >
                  Remove from favorites
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="hidden sm:block absolute top-full left-0 mt-2 p-3 bg-[#1a1a1d] border border-white/10 rounded-xl shadow-xl z-50"
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <Trophy className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium text-white">Pick your rank</span>
              </div>

              <div className="flex gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => (
                  <motion.button
                    key={rank}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleRankSelect(rank)}
                    disabled={isPending}
                    className={`
                      w-9 h-9 rounded-lg font-bold text-sm
                      bg-linear-to-br ${RANK_COLORS[rank - 1]}
                      text-white shadow-md
                      hover:shadow-lg transition-shadow
                      disabled:opacity-50
                      ${currentRank === rank ? 'ring-2 ring-white ring-offset-1 ring-offset-[#1a1a1d]' : ''}
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
                  className="mt-2 w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Remove from favorites
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
