import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BacklogStatus } from '@prisma/client';
import { 
  addToBacklog, 
  removeFromBacklog, 
  updateBacklogStatus, 
  getBacklogStatus,
  getUserBacklog 
} from '@/actions/backlog';

interface GameData {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

export function useBacklogStatus(gameId: number) {
  return useQuery({
    queryKey: ['backlog', 'status', gameId],
    queryFn: () => getBacklogStatus(gameId),
  });
}

export function useUserBacklog() {
  return useQuery({
    queryKey: ['backlog', 'user'],
    queryFn: () => getUserBacklog(),
  });
}

export function useAddToBacklog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ game, status }: { game: GameData; status?: BacklogStatus }) =>
      addToBacklog(game, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['backlog', 'status', variables.game.gameId] });
      queryClient.invalidateQueries({ queryKey: ['backlog', 'user'] });
    },
  });
}

export function useRemoveFromBacklog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameId: number) => removeFromBacklog(gameId),
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({ queryKey: ['backlog', 'status', gameId] });
      queryClient.invalidateQueries({ queryKey: ['backlog', 'user'] });
    },
  });
}

export function useUpdateBacklogStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ gameId, status }: { gameId: number; status: BacklogStatus }) =>
      updateBacklogStatus(gameId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['backlog', 'status', variables.gameId] });
      queryClient.invalidateQueries({ queryKey: ['backlog', 'user'] });
    },
  });
}
