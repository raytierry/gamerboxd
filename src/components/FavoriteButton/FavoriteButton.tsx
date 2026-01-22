'use client';

import { useState } from 'react';
import { Heart, Trophy, X, Loader2, ChevronDown } from 'lucide-react';
import {
  useFavoriteStatus,
  useAddToFavorites,
  useRemoveFromFavorites,
  useUsedRanks,
  type ConflictingGame,
  type ConflictResolution,
} from '@/hooks/use-favorites';
import { motion, AnimatePresence, useDragControls, useReducedMotion, PanInfo } from 'motion/react';
import { FavoriteConflictModal } from '@/components/FavoriteConflictModal';

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
  const [conflictState, setConflictState] = useState<{
    isOpen: boolean;
    conflictingGame: ConflictingGame | null;
    targetRank: number;
  }>({
    isOpen: false,
    conflictingGame: null,
    targetRank: 0,
  });

  const dragControls = useDragControls();
  const shouldReduce = useReducedMotion();

  const { data: favoriteStatus, isLoading } = useFavoriteStatus(gameId);
  const { data: usedRanksData = [] } = useUsedRanks();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  const isFavorite = !!favoriteStatus;
  const currentRank = favoriteStatus?.rank;
  const isPending = addToFavorites.isPending || removeFromFavorites.isPending;

  const usedRanks = usedRanksData
    .filter((r) => r.gameId !== gameId)
    .map((r) => r.rank);

  const springTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { type: 'spring' as const, damping: 25, stiffness: 300 };

  const fadeTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { duration: 0.15 };

  const handleRankSelect = async (rank: number) => {
    const result = await addToFavorites.mutateAsync({
      game: { gameId, gameSlug, gameName, gameImage },
      rank,
    });

    if (!result.success && result.conflict) {
      setConflictState({
        isOpen: true,
        conflictingGame: result.conflict,
        targetRank: rank,
      });
    } else {
      setShowRankPicker(false);
    }
  };

  const handleConflictResolve = async (resolution: ConflictResolution) => {
    const result = await addToFavorites.mutateAsync({
      game: { gameId, gameSlug, gameName, gameImage },
      rank: conflictState.targetRank,
      conflictResolution: resolution,
    });

    if (result.success) {
      setConflictState({ isOpen: false, conflictingGame: null, targetRank: 0 });
      setShowRankPicker(false);
    }
  };

  const handleConflictClose = () => {
    setConflictState({ isOpen: false, conflictingGame: null, targetRank: 0 });
  };

  const handleRemove = async () => {
    await removeFromFavorites.mutateAsync(gameId);
    setShowRankPicker(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      setShowRankPicker(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-11 w-40 rounded-full animate-pulse border border-white/10" style={{
        background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
      }} />
    );
  }

  const buttonText = isFavorite ? `#${currentRank} Favorite` : 'Favorite';

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowRankPicker(!showRankPicker)}
          disabled={isPending}
          className="flex items-center gap-2 h-11 px-5 rounded-full font-medium transition-all duration-200 border border-white/10 min-w-[150px] text-white/80 hover:text-white hover:bg-white/10"
          style={{
            background: isFavorite 
              ? 'linear-gradient(145deg, rgba(239, 68, 68, 0.2) 0%, rgba(185, 28, 28, 0.3) 100%)'
              : 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <span className="relative w-4 h-4 flex items-center justify-center">
            <motion.span
              key={isPending ? 'loading' : 'icon'}
              initial={shouldReduce ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduce ? undefined : { opacity: 0, scale: 0.8 }}
              transition={fadeTransition}
              className="absolute inset-0 flex items-center justify-center"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-400 text-red-400' : ''}`} />
              )}
            </motion.span>
          </span>
          <span className="flex-1 text-left text-sm">{buttonText}</span>
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
                initial={shouldReduce ? { opacity: 0 } : { y: '100%' }}
                animate={shouldReduce ? { opacity: 1 } : { y: 0 }}
                exit={shouldReduce ? { opacity: 0 } : { y: '100%' }}
                transition={springTransition}
                drag={shouldReduce ? false : 'y'}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.5 }}
                onDragEnd={handleDragEnd}
                className="fixed inset-x-0 bottom-0 p-4 pb-8 rounded-t-3xl z-50 sm:hidden border-t border-white/10 touch-none"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 50, 50, 0.98) 0%, rgba(20, 35, 35, 0.99) 100%)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div 
                  className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing"
                  onPointerDown={(e) => dragControls.start(e)}
                />
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    <span className="font-medium text-white">Pick your rank</span>
                  </div>
                  <button
                    onClick={() => setShowRankPicker(false)}
                    className="p-2 text-white/40 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => {
                    const isUsed = usedRanks.includes(rank);
                    const isCurrent = currentRank === rank;
                    return (
                      <motion.button
                        key={rank}
                        whileTap={shouldReduce ? undefined : { scale: 0.95 }}
                        onClick={() => handleRankSelect(rank)}
                        disabled={isPending}
                        className={`
                          h-14 rounded-xl font-bold text-lg
                          bg-gradient-to-br ${RANK_COLORS[rank - 1]}
                          text-white shadow-lg
                          active:brightness-90 transition-all
                          disabled:opacity-50
                          ${isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-black/50' : ''}
                          ${isUsed && !isCurrent ? 'opacity-70' : ''}
                        `}
                      >
                        {rank}
                      </motion.button>
                    );
                  })}
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
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
                transition={fadeTransition}
                className="hidden sm:block absolute top-full left-0 mt-2 p-3 rounded-2xl shadow-xl z-50 border border-white/10"
                style={{
                  background: 'linear-gradient(145deg, rgba(30, 50, 50, 0.95) 0%, rgba(20, 35, 35, 0.98) 100%)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  <span className="text-sm font-medium text-white">Pick your rank</span>
                </div>

                <div className="flex gap-1.5">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => {
                    const isUsed = usedRanks.includes(rank);
                    const isCurrent = currentRank === rank;
                    return (
                      <motion.button
                        key={rank}
                        whileHover={shouldReduce ? undefined : { scale: 1.1, y: -2 }}
                        whileTap={shouldReduce ? undefined : { scale: 0.95 }}
                        onClick={() => handleRankSelect(rank)}
                        disabled={isPending}
                        className={`
                          w-9 h-9 rounded-lg font-bold text-sm
                          bg-gradient-to-br ${RANK_COLORS[rank - 1]}
                          text-white shadow-md
                          hover:shadow-lg transition-shadow
                          disabled:opacity-50
                          ${isCurrent ? 'ring-2 ring-white ring-offset-1 ring-offset-black/50' : ''}
                          ${isUsed && !isCurrent ? 'opacity-70' : ''}
                        `}
                      >
                        {rank}
                      </motion.button>
                    );
                  })}
                </div>

                {isFavorite && (
                  <button
                    onClick={handleRemove}
                    disabled={isPending}
                    className="mt-2 w-full py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    Remove from favorites
                  </button>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {conflictState.conflictingGame && (
        <FavoriteConflictModal
          isOpen={conflictState.isOpen}
          onClose={handleConflictClose}
          onResolve={handleConflictResolve}
          conflictingGame={conflictState.conflictingGame}
          newGameName={gameName}
          targetRank={conflictState.targetRank}
          usedRanks={usedRanks}
          currentGameRank={currentRank}
          isPending={isPending}
        />
      )}
    </>
  );
}
