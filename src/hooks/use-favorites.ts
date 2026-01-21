import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteStatus,
  getUserFavorites,
} from '@/actions/favorites';

interface GameData {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

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

export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ game, rank }: { game: GameData; rank: number }) =>
      addToFavorites(game, rank),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['favorites', 'status', variables.game.gameId] });
      queryClient.invalidateQueries({ queryKey: ['favorites', 'user'] });
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
    },
  });
}
