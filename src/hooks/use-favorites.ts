import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteStatus,
  getUserFavorites,
  checkRankConflict,
  getUsedRanks,
  type ConflictResolution,
  type ConflictingGame,
} from '@/actions/favorites';

interface GameData {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

export type { ConflictingGame, ConflictResolution };

export function useFavoriteStatus(gameId: number) {
  return useQuery({
    queryKey: ['favorites', 'status', gameId],
    queryFn: () => getFavoriteStatus(gameId),
  });
}

export function useUserFavorites() {
  return useQuery({
    queryKey: ['favorites', 'user'],
    queryFn: () => getUserFavorites(),
  });
}

export function useUsedRanks() {
  return useQuery({
    queryKey: ['favorites', 'usedRanks'],
    queryFn: () => getUsedRanks(),
  });
}

export function useCheckRankConflict() {
  return useMutation({
    mutationFn: ({ rank, currentGameId }: { rank: number; currentGameId?: number }) =>
      checkRankConflict(rank, currentGameId),
  });
}

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      game,
      rank,
      conflictResolution,
    }: {
      game: GameData;
      rank: number;
      conflictResolution?: ConflictResolution;
    }) => addToFavorites(game, rank, conflictResolution),
    onSuccess: (result, variables) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['favorites', 'status', variables.game.gameId] });
        queryClient.invalidateQueries({ queryKey: ['favorites', 'user'] });
        queryClient.invalidateQueries({ queryKey: ['favorites', 'usedRanks'] });
      }
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: number) => removeFromFavorites(gameId),
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'status', gameId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'user'] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'usedRanks'] });
    },
  });
}
