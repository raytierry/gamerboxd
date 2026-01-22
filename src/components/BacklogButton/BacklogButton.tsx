'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react';
import { Plus, Check, ChevronDown, Clock, Gamepad2, Trophy, X, Pause, Loader2 } from 'lucide-react';
import { BacklogStatus } from '@prisma/client';
import { useBacklogStatus, useAddToBacklog, useRemoveFromBacklog, useUpdateBacklogStatus } from '@/hooks/use-backlog';

interface BacklogButtonProps {
  game: {
    id: number;
    slug: string;
    name: string;
    background_image: string | null;
  };
  isAuthenticated: boolean;
}

const STATUS_CONFIG = {
  WANT_TO_PLAY: { label: 'Want to Play', icon: Clock, color: 'text-blue-400' },
  PLAYING: { label: 'Playing', icon: Gamepad2, color: 'text-emerald-400' },
  COMPLETED: { label: 'Completed', icon: Trophy, color: 'text-green-400' },
  DROPPED: { label: 'Dropped', icon: X, color: 'text-red-400' },
  ON_HOLD: { label: 'On Hold', icon: Pause, color: 'text-amber-400' },
} as const;

export default function BacklogButton({ game, isAuthenticated }: BacklogButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dragControls = useDragControls();
  
  const { data: backlogEntry, isLoading } = useBacklogStatus(game.id);
  const addMutation = useAddToBacklog();
  const removeMutation = useRemoveFromBacklog();
  const updateMutation = useUpdateBacklogStatus();

  const isPending = addMutation.isPending || removeMutation.isPending || updateMutation.isPending;

  const handleStatusSelect = async (status: BacklogStatus) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (backlogEntry?.status === status) {
      await removeMutation.mutateAsync(game.id);
    } else if (backlogEntry) {
      await updateMutation.mutateAsync({ gameId: game.id, status });
    } else {
      await addMutation.mutateAsync({
        game: {
          gameId: game.id,
          gameSlug: game.slug,
          gameName: game.name,
          gameImage: game.background_image,
        },
        status,
      });
    }
    setIsOpen(false);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      setIsOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-11 w-44 rounded-full animate-pulse border border-white/10" style={{
        background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
      }} />
    );
  }

  const currentStatus = backlogEntry?.status;
  const config = currentStatus ? STATUS_CONFIG[currentStatus] : null;
  const IconComponent = config?.icon || Plus;
  const buttonText = config?.label || 'Add to Backlog';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-2 h-11 px-5 rounded-full font-medium transition-all duration-200 min-w-[180px] border border-white/10
          ${currentStatus 
            ? config?.color
            : 'bg-white text-black hover:bg-white/90'
          }
        `}
        style={currentStatus ? {
          background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.3) 0%, rgba(25, 45, 45, 0.4) 100%)',
          backdropFilter: 'blur(12px)',
        } : undefined}
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
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <IconComponent className="w-4 h-4" />
            )}
          </motion.span>
        </span>
        <span className="flex-1 text-left text-sm">{buttonText}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/50 sm:bg-transparent" 
              onClick={() => setIsOpen(false)} 
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              drag="y"
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
                  <Gamepad2 className="h-5 w-5 text-emerald-400" />
                  <span className="font-medium text-white">Set status</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-white/40 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-2">
                {(Object.keys(STATUS_CONFIG) as BacklogStatus[]).map((status) => {
                  const statusConfig = STATUS_CONFIG[status];
                  const isSelected = currentStatus === status;
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      disabled={isPending}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-colors
                        ${isSelected 
                          ? `bg-white/10 ${statusConfig.color}` 
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                        }
                      `}
                    >
                      <StatusIcon className={`w-5 h-5 ${isSelected ? '' : 'text-white/40'}`} />
                      <span className="flex-1">{statusConfig.label}</span>
                      {isSelected && <Check className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>

              {currentStatus && (
                <button
                  onClick={() => {
                    removeMutation.mutate(game.id);
                    setIsOpen(false);
                  }}
                  disabled={isPending}
                  className="mt-4 w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                >
                  Remove from Backlog
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="hidden sm:block absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl overflow-hidden z-50 border border-white/10"
              style={{
                background: 'linear-gradient(145deg, rgba(30, 50, 50, 0.95) 0%, rgba(20, 35, 35, 0.98) 100%)',
                backdropFilter: 'blur(24px)',
              }}
            >
              <div className="p-1.5">
                {(Object.keys(STATUS_CONFIG) as BacklogStatus[]).map((status) => {
                  const statusConfig = STATUS_CONFIG[status];
                  const isSelected = currentStatus === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors
                        ${isSelected 
                          ? `bg-white/10 ${statusConfig.color}` 
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }
                      `}
                    >
                      <statusConfig.icon className={`w-4 h-4 ${isSelected ? '' : 'text-white/40'}`} />
                      <span className="flex-1 text-sm">{statusConfig.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
              
              {currentStatus && (
                <div className="border-t border-white/10 p-1.5">
                  <button
                    onClick={() => {
                      removeMutation.mutate(game.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-sm">Remove from Backlog</span>
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
