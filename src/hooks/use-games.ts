import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { RAWGGame, RAWGGameDetails, RAWGResponse } from '@/types/game.types';

interface SearchParams {
  query?: string;
  pageSize?: number;
  ordering?: string;
  dates?: string;
  minRating?: number;
}

async function fetchGames(
  params: SearchParams & { page: number }
): Promise<RAWGResponse<RAWGGame>> {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set('query', params.query);
  if (params.page) searchParams.set('page', String(params.page));
  if (params.pageSize) searchParams.set('pageSize', String(params.pageSize));
  if (params.ordering) searchParams.set('ordering', params.ordering);
  if (params.dates) searchParams.set('dates', params.dates);
  if (params.minRating) searchParams.set('minRating', String(params.minRating));

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

export function usePopularGames(pageSize = 12) {
  return useQuery({
    queryKey: ['games', 'popular', pageSize],
    queryFn: () => fetchGames({ page: 1, pageSize, ordering: '-rating' }),
  });
}

export function useHighlightGames(pageSize = 10) {
  return useQuery({
    queryKey: ['games', 'highlight', pageSize],
    queryFn: () => fetchGames({
      page: 1,
      pageSize,
      ordering: '-aggregated_rating',
      minRating: 85,
    }),
  });
}

export function useTrendingGames(pageSize = 12) {
  return useQuery({
    queryKey: ['games', 'trending', pageSize],
    queryFn: () =>
      fetchGames({
        page: 1,
        pageSize,
        ordering: '-rating',
        minRating: 70,
      }),
  });
}

export function useNewReleases(pageSize = 12) {
  const today = new Date();
  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const dateRange = `${threeMonthsAgo.toISOString().split('T')[0]},${today.toISOString().split('T')[0]}`;

  return useQuery({
    queryKey: ['games', 'new-releases', pageSize],
    queryFn: () =>
      fetchGames({
        page: 1,
        pageSize,
        ordering: '-first_release_date',
        dates: dateRange,
      }),
  });
}

export function useUpcomingGames(pageSize = 12) {
  const today = new Date();
  const threeMonthsLater = new Date(today);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
  const dateRange = `${today.toISOString().split('T')[0]},${threeMonthsLater.toISOString().split('T')[0]}`;

  return useQuery({
    queryKey: ['games', 'upcoming', pageSize],
    queryFn: () =>
      fetchGames({
        page: 1,
        pageSize,
        ordering: 'first_release_date',
        dates: dateRange,
      }),
  });
}

export function useGame(slug: string) {
  return useQuery({
    queryKey: ['games', 'detail', slug],
    queryFn: () => fetchGameBySlug(slug),
    enabled: !!slug,
  });
}
