'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, AlertTriangle, Trophy, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useDragControls, useReducedMotion, PanInfo } from 'motion/react';
import type { ConflictingGame, ConflictResolution } from '@/hooks/use-favorites';

interface FavoriteConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (resolution: ConflictResolution) => void;
  conflictingGame: ConflictingGame;
  newGameName: string;
  targetRank: number;
  usedRanks: number[];
  currentGameRank?: number;
  isPending?: boolean;
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

export function FavoriteConflictModal({
  isOpen,
  onClose,
  onResolve,
  conflictingGame,
  newGameName,
  targetRank,
  usedRanks,
  currentGameRank,
  isPending,
}: FavoriteConflictModalProps) {
  const [showReassignPicker, setShowReassignPicker] = useState(false);
  const dragControls = useDragControls();
  const shouldReduce = useReducedMotion();

  const springTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { type: 'spring', damping: 25, stiffness: 300 };

  const fadeTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { duration: 0.2 };

  const slideTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { duration: 0.15 };

  const handleReplace = () => {
    onResolve({ type: 'replace' });
  };

  const handleReassign = (newRank: number) => {
    onResolve({ type: 'swap', newRankForOld: newRank });
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const getAvailableRanks = () => {
    return Array.from({ length: 10 }, (_, i) => i + 1).filter((rank) => {
      if (rank === targetRank) return false;
      if (rank === currentGameRank) return true;
      if (usedRanks.includes(rank)) return false;
      return true;
    });
  };

  const availableRanks = getAvailableRanks();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
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
            className="fixed inset-x-0 bottom-0 z-50 sm:hidden rounded-t-3xl border-t border-white/10 overflow-hidden touch-none"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 50, 50, 0.98) 0%, rgba(20, 35, 35, 0.99) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="p-4 pb-8">
              <div 
                className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-4 cursor-grab active:cursor-grabbing"
                onPointerDown={(e) => dragControls.start(e)}
              />

              <AnimatePresence mode="wait">
                {!showReassignPicker ? (
                  <motion.div
                    key="main"
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    transition={slideTransition}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-medium">Rank Conflict</span>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        {conflictingGame.gameImage && (
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={conflictingGame.gameImage}
                              alt={conflictingGame.gameName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/50">Currently at #{targetRank}</p>
                          <p className="font-medium text-white truncate">
                            {conflictingGame.gameName}
                          </p>
                        </div>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br ${RANK_COLORS[targetRank - 1]}`}
                        >
                          {targetRank}
                        </div>
                      </div>
                    </div>

                    <p className="text-white/60 text-sm mb-4 text-center">
                      <span className="text-white font-medium">{newGameName}</span> wants to be #{targetRank}
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={handleReplace}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Replace (remove {conflictingGame.gameName.length > 15 ? conflictingGame.gameName.slice(0, 15) + '...' : conflictingGame.gameName})
                      </button>

                      {availableRanks.length > 0 && (
                        <button
                          onClick={() => setShowReassignPicker(true)}
                          disabled={isPending}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Move to another rank
                        </button>
                      )}

                      <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-3 text-white/50 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reassign"
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    transition={slideTransition}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowReassignPicker(false)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2 text-white/40 hover:text-white transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="font-medium text-white">
                        New rank for {conflictingGame.gameName.length > 20 ? conflictingGame.gameName.slice(0, 20) + '...' : conflictingGame.gameName}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => {
                        const isAvailable = availableRanks.includes(rank);
                        const isTarget = rank === targetRank;
                        return (
                          <motion.button
                            key={rank}
                            whileTap={shouldReduce || !isAvailable ? undefined : { scale: 0.95 }}
                            onClick={() => isAvailable && handleReassign(rank)}
                            disabled={!isAvailable || isPending}
                            className={`
                              h-14 rounded-xl font-bold text-lg
                              transition-all
                              ${isAvailable
                                ? `bg-gradient-to-br ${RANK_COLORS[rank - 1]} text-white shadow-lg active:brightness-90`
                                : 'bg-white/5 text-white/20 cursor-not-allowed'
                              }
                              ${isTarget ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50' : ''}
                            `}
                          >
                            {rank}
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="text-white/40 text-xs text-center mt-4">
                      Highlighted ranks are available
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={fadeTransition}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md hidden sm:block rounded-2xl border border-white/10 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(30, 50, 50, 0.98) 0%, rgba(20, 35, 35, 0.99) 100%)',
              backdropFilter: 'blur(24px)',
            }}
          >
            <div className="p-6">
              <AnimatePresence mode="wait">
                {!showReassignPicker ? (
                  <motion.div
                    key="main"
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    transition={slideTransition}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold text-lg">Rank Conflict</span>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-4">
                        {conflictingGame.gameImage && (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                            <Image
                              src={conflictingGame.gameImage}
                              alt={conflictingGame.gameName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white/50">Currently at #{targetRank}</p>
                          <p className="font-medium text-white truncate">
                            {conflictingGame.gameName}
                          </p>
                        </div>
                        <div
                          className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br ${RANK_COLORS[targetRank - 1]}`}
                        >
                          {targetRank}
                        </div>
                      </div>
                    </div>

                    <p className="text-white/60 text-sm mb-6 text-center">
                      <span className="text-white font-medium">{newGameName}</span> wants to be your #{targetRank} favorite
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={handleReplace}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        Replace (remove from favorites)
                      </button>

                      {availableRanks.length > 0 && (
                        <button
                          onClick={() => setShowReassignPicker(true)}
                          disabled={isPending}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Move to another rank
                        </button>
                      )}

                      <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-2.5 text-white/50 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="reassign"
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
                    transition={slideTransition}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => setShowReassignPicker(false)}
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Back
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-white/40 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="font-medium text-white">
                        Pick a new rank for {conflictingGame.gameName}
                      </span>
                    </div>

                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((rank) => {
                        const isAvailable = availableRanks.includes(rank);
                        const isTarget = rank === targetRank;
                        return (
                          <motion.button
                            key={rank}
                            whileHover={shouldReduce || !isAvailable ? undefined : { scale: 1.1, y: -2 }}
                            whileTap={shouldReduce || !isAvailable ? undefined : { scale: 0.95 }}
                            onClick={() => isAvailable && handleReassign(rank)}
                            disabled={!isAvailable || isPending}
                            className={`
                              w-10 h-10 rounded-lg font-bold text-sm
                              transition-all
                              ${isAvailable
                                ? `bg-gradient-to-br ${RANK_COLORS[rank - 1]} text-white shadow-md hover:shadow-lg`
                                : 'bg-white/5 text-white/20 cursor-not-allowed'
                              }
                              ${isTarget ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black/50' : ''}
                            `}
                          >
                            {rank}
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="text-white/40 text-xs text-center mt-4">
                      Colored ranks are available. #{targetRank} is reserved for your new favorite.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
