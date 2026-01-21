import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { RAWGGame, RAWGGameDetails, RAWGResponse } from '@/types/game.types';

interface SearchParams {
  query?: string;
  pageSize?: number;
  ordering?: string;
}

async function fetchGames(params: SearchParams & { page: number }): Promise<RAWGResponse<RAWGGame>> {
  const searchParams = new URLSearchParams();
  
  if (params.query) searchParams.set('query', params.query);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.ordering) searchParams.set('ordering', params.ordering);

  const response = await fetch(`/api/games?${searchParams}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch games');
  }
  
  return response.json();
}

async function fetchGameBySlug(slug: string): Promise<RAWGGameDetails> {
  const response = await fetch(`/api/games/${slug}?screenshots=true`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch game');
  }
  
  return response.json();
}

export function useSearchGames(params: SearchParams) {
  return useInfiniteQuery({
    queryKey: ['games', 'search', params],
    queryFn: ({ pageParam = 1 }) => fetchGames({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      if (!lastPage.next) return undefined;
      return lastPageParam + 1;
    },
    enabled: !!params.query,
  });
}

export function usePopularGames(pageSize = 20) {
  return useQuery({
    queryKey: ['games', 'popular', pageSize],
    queryFn: () => fetchGames({ page: 1, pageSize, ordering: '-rating' }),
  });
}

export function useGame(slug: string) {
  return useQuery({
    queryKey: ['games', 'detail', slug],
    queryFn: () => fetchGameBySlug(slug),
    enabled: !!slug,
  });
}
