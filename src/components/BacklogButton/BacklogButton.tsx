'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
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
  WANT_TO_PLAY: { label: 'Want to Play', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  PLAYING: { label: 'Playing', icon: Gamepad2, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  COMPLETED: { label: 'Completed', icon: Trophy, color: 'text-green-400', bg: 'bg-green-500/10' },
  DROPPED: { label: 'Dropped', icon: X, color: 'text-red-400', bg: 'bg-red-500/10' },
  ON_HOLD: { label: 'On Hold', icon: Pause, color: 'text-purple-400', bg: 'bg-purple-500/10' },
} as const;

export default function BacklogButton({ game, isAuthenticated }: BacklogButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
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

  if (isLoading) {
    return (
      <div className="h-12 w-40 bg-white/5 rounded-xl animate-pulse" />
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
          flex items-center gap-2 h-12 px-5 rounded-xl font-medium transition-all duration-200 min-w-[180px]
          ${currentStatus 
            ? `${config?.bg} ${config?.color} border border-current/20` 
            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
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
              <IconComponent className="w-5 h-5" />
            )}
          </motion.span>
        </span>
        <span className="flex-1 text-left">{buttonText}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-0 mt-2 w-56 bg-[#1a1a1d] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
            >
              <div className="p-1">
                {(Object.keys(STATUS_CONFIG) as BacklogStatus[]).map((status) => {
                  const statusConfig = STATUS_CONFIG[status];
                  const isSelected = currentStatus === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusSelect(status)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                        ${isSelected 
                          ? `${statusConfig.bg} ${statusConfig.color}` 
                          : 'text-gray-300 hover:bg-white/5'
                        }
                      `}
                    >
                      <statusConfig.icon className={`w-4 h-4 ${isSelected ? '' : 'text-gray-500'}`} />
                      <span className="flex-1 text-sm">{statusConfig.label}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
              
              {currentStatus && (
                <div className="border-t border-white/5 p-1">
                  <button
                    onClick={() => {
                      removeMutation.mutate(game.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors"
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
