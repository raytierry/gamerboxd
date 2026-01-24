'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, AlertTriangle, Trophy, ArrowRight, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, useDragControls, useReducedMotion, PanInfo } from 'motion/react';
import type { ConflictingGame, ConflictResolution } from '@/hooks/use-favorites';
import { RANK_GRADIENT_CLASSES } from '@/constants';

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
    : { type: 'spring' as const, damping: 25, stiffness: 300 };

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
            className="fixed inset-x-0 bottom-0 z-50 sm:hidden rounded-t-3xl overflow-hidden touch-none glass-modal nav-border modal-shadow-bottom"
          >
            <div className="p-6 pb-8">
              <div
                className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-6 cursor-grab active:cursor-grabbing"
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="font-semibold text-lg text-foreground">Rank Conflict</span>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mb-6 p-5 rounded-2xl glass-card nav-border">
                      <div className="flex items-center gap-4">
                        {conflictingGame.gameImage && (
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-border/50">
                            <Image
                              src={conflictingGame.gameImage}
                              alt={conflictingGame.gameName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground/80 mb-1">Currently at #{targetRank}</p>
                          <p className="font-semibold text-foreground truncate">
                            {conflictingGame.gameName}
                          </p>
                        </div>
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white bg-linear-to-br ${RANK_GRADIENT_CLASSES[targetRank - 1]} shadow-lg`}
                        >
                          {targetRank}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-6 text-center">
                      <span className="text-foreground font-semibold">{newGameName}</span> wants to be #{targetRank}
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={handleReplace}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Replace (remove {conflictingGame.gameName.length > 15 ? conflictingGame.gameName.slice(0, 15) + '...' : conflictingGame.gameName})
                      </button>

                      {availableRanks.length > 0 && (
                        <button
                          onClick={() => setShowReassignPicker(true)}
                          disabled={isPending}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-foreground transition-all disabled:opacity-50 nav-glass nav-border nav-shadow"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Move to another rank
                        </button>
                      )}

                      <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-3.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
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
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setShowReassignPicker(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span className="font-medium">Back</span>
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                        <Trophy className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="font-semibold text-foreground">
                        New rank for {conflictingGame.gameName.length > 20 ? conflictingGame.gameName.slice(0, 20) + '...' : conflictingGame.gameName}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-3 mb-4">
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
                              h-16 rounded-xl font-bold text-lg
                              transition-all
                              ${isAvailable
                                ? `bg-linear-to-br ${RANK_GRADIENT_CLASSES[rank - 1]} text-white shadow-lg active:brightness-90`
                                : 'text-muted-foreground/30 cursor-not-allowed'
                              }
                              ${isTarget ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background' : ''}
                            `}
                            style={!isAvailable ? {
                              background: 'linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)',
                              border: '1px solid var(--nav-border-color)',
                            } : undefined}
                          >
                            {rank}
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="text-muted-foreground/70 text-xs text-center">
                      Select an available rank for {conflictingGame.gameName.length > 25 ? conflictingGame.gameName.slice(0, 25) + '...' : conflictingGame.gameName}
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg hidden sm:block rounded-3xl overflow-hidden glass-modal nav-border modal-shadow"
          >
            <div className="p-8">
              <AnimatePresence mode="wait">
                {!showReassignPicker ? (
                  <motion.div
                    key="main"
                    initial={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    animate={shouldReduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                    exit={shouldReduce ? { opacity: 0 } : { opacity: 0, x: -20 }}
                    transition={slideTransition}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <span className="font-semibold text-xl text-foreground">Rank Conflict</span>
                      </div>
                      <button
                        onClick={onClose}
                        className="p-2.5 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary/50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mb-6 p-5 rounded-2xl glass-card nav-border">
                      <div className="flex items-center gap-4">
                        {conflictingGame.gameImage && (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-border/50">
                            <Image
                              src={conflictingGame.gameImage}
                              alt={conflictingGame.gameName}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground/80 mb-1">Currently at #{targetRank}</p>
                          <p className="font-semibold text-base text-foreground truncate">
                            {conflictingGame.gameName}
                          </p>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white bg-linear-to-br ${RANK_GRADIENT_CLASSES[targetRank - 1]} shadow-lg`}
                        >
                          {targetRank}
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm mb-7 text-center">
                      <span className="text-foreground font-semibold">{newGameName}</span> wants to be your #{targetRank} favorite
                    </p>

                    <div className="space-y-3">
                      <button
                        onClick={handleReplace}
                        disabled={isPending}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all disabled:opacity-50"
                        style={{
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#fca5a5',
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Replace (remove from favorites)
                      </button>

                      {availableRanks.length > 0 && (
                        <button
                          onClick={() => setShowReassignPicker(true)}
                          disabled={isPending}
                          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium text-foreground transition-all disabled:opacity-50 nav-glass nav-border nav-shadow"
                        >
                          <ArrowRight className="w-4 h-4" />
                          Move to another rank
                        </button>
                      )}

                      <button
                        onClick={onClose}
                        disabled={isPending}
                        className="w-full py-3 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
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
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={() => setShowReassignPicker(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span className="font-medium">Back</span>
                      </button>
                      <button
                        onClick={onClose}
                        className="p-2.5 -mr-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-secondary/50"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20">
                        <Trophy className="h-5 w-5 text-amber-400" />
                      </div>
                      <span className="font-semibold text-lg text-foreground">
                        Pick a new rank for {conflictingGame.gameName}
                      </span>
                    </div>

                    <div className="flex gap-2.5 justify-center mb-4">
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
                              w-11 h-11 rounded-xl font-bold text-base
                              transition-all
                              ${isAvailable
                                ? `bg-linear-to-br ${RANK_GRADIENT_CLASSES[rank - 1]} text-white shadow-md hover:shadow-xl`
                                : 'text-muted-foreground/30 cursor-not-allowed'
                              }
                              ${isTarget ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background' : ''}
                            `}
                            style={!isAvailable ? {
                              background: 'linear-gradient(180deg, var(--glass-card-from) 0%, var(--glass-card-to) 100%)',
                              border: '1px solid var(--nav-border-color)',
                            } : undefined}
                          >
                            {rank}
                          </motion.button>
                        );
                      })}
                    </div>

                    <p className="text-muted-foreground/70 text-xs text-center">
                      #{targetRank} is reserved for your new favorite. Select an available rank.
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
