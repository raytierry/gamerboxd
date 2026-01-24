import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useSearchGames,
  usePopularGames,
  useHighlightGames,
  useTrendingGames,
  useNewReleases,
  useUpcomingGames,
  useGame,
} from '@/hooks/use-games';
import type { ReactNode } from 'react';

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('use-games hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockGamesResponse = {
    results: [
      {
        id: 1,
        slug: 'game-1',
        name: 'Game 1',
        background_image: 'https://example.com/game1.jpg',
        released: '2021-01-01',
        metacritic: 85,
        rating: 4.25,
        platforms: [],
        genres: [],
        short_screenshots: [],
        stores: [],
        playtime: 0,
        tags: [],
      },
    ],
    count: 1,
    next: null,
    previous: null,
  };

  const mockGameDetails = {
    id: 1,
    slug: 'game-1',
    name: 'Game 1',
    background_image: 'https://example.com/game1.jpg',
    released: '2021-01-01',
    metacritic: 85,
    rating: 4.25,
    description: 'A great game',
    description_raw: 'A great game',
    website: 'https://example.com',
    platforms: [],
    genres: [],
    developers: [],
    publishers: [],
    esrb_rating: null,
    short_screenshots: [],
    stores: [],
    playtime: 0,
    tags: [],
  };

  describe('useSearchGames', () => {
    it('should fetch games with search query', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => useSearchGames({ query: 'zelda' }), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/games?query=zelda')
      );
      expect(result.current.data?.pages[0].results).toHaveLength(1);
    });

    it('should not fetch if query is empty', () => {
      const { result } = renderHook(() => useSearchGames({ query: '' }), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle pagination', async () => {
      const page1Response = { ...mockGamesResponse, next: 'page2' };
      const page2Response = {
        ...mockGamesResponse,
        results: [
          {
            ...mockGamesResponse.results[0],
            id: 2,
            slug: 'game-2',
            name: 'Game 2',
          },
        ],
        next: null,
      };

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page1Response,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => page2Response,
        } as Response);

      const { result } = renderHook(() => useSearchGames({ query: 'test' }), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.pages).toHaveLength(1);

      await result.current.fetchNextPage();

      await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    it('should pass all search parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      renderHook(
        () =>
          useSearchGames({
            query: 'zelda',
            pageSize: 10,
            ordering: '-rating',
            dates: '2021-01-01,2021-12-31',
            minRating: 80,
          }),
        { wrapper }
      );

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());

      const callUrl = (mockFetch.mock.calls[0][0] as string);
      expect(callUrl).toContain('query=zelda');
      expect(callUrl).toContain('pageSize=10');
      expect(callUrl).toContain('ordering=-rating');
      expect(callUrl).toContain('dates=2021-01-01%2C2021-12-31');
      expect(callUrl).toContain('minRating=80');
    });
  });

  describe('usePopularGames', () => {
    it('should fetch popular games', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => usePopularGames(12), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-rating')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=12')
      );
    });

    it('should use default page size', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => usePopularGames(), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=12')
      );
    });
  });

  describe('useHighlightGames', () => {
    it('should fetch highlight games with high rating', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => useHighlightGames(10), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-aggregated_rating')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('minRating=85')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=10')
      );
    });
  });

  describe('useTrendingGames', () => {
    it('should fetch trending games', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => useTrendingGames(12), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-rating')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('minRating=70')
      );
    });
  });

  describe('useNewReleases', () => {
    it('should fetch new releases with date range', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => useNewReleases(12), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-first_release_date')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('dates=')
      );

      const callUrl = (mockFetch.mock.calls[0][0] as string);
      const urlParams = new URLSearchParams(callUrl.split('?')[1]);
      const dates = urlParams.get('dates');

      expect(dates).toBeTruthy();
      const [startDate, endDate] = dates!.split(',');

      // Check that date range is approximately 3 months
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffMonths = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      expect(diffMonths).toBeGreaterThan(2.5);
      expect(diffMonths).toBeLessThan(3.5);
    });
  });

  describe('useUpcomingGames', () => {
    it('should fetch upcoming games with future date range', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const { result } = renderHook(() => useUpcomingGames(12), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=first_release_date')
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('dates=')
      );

      const callUrl = (mockFetch.mock.calls[0][0] as string);
      const urlParams = new URLSearchParams(callUrl.split('?')[1]);
      const dates = urlParams.get('dates');

      expect(dates).toBeTruthy();
      const [startDate, endDate] = dates!.split(',');

      // Check that start date is today or future
      const start = new Date(startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(start.getTime()).toBeGreaterThanOrEqual(today.getTime() - 86400000); // Allow 1 day margin

      // Check that date range is approximately 3 months
      const end = new Date(endDate);
      const diffMonths = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      expect(diffMonths).toBeGreaterThan(2.5);
      expect(diffMonths).toBeLessThan(3.5);
    });
  });

  describe('useGame', () => {
    it('should fetch game details by slug', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameDetails,
      } as Response);

      const { result } = renderHook(() => useGame('game-1'), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/games/game-1?screenshots=true')
      );
      expect(result.current.data).toEqual(mockGameDetails);
    });

    it('should not fetch if slug is empty', () => {
      const { result } = renderHook(() => useGame(''), { wrapper });

      expect(result.current.fetchStatus).toBe('idle');
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('should handle different slugs', async () => {
      const slugs = ['the-witcher-3', 'cyberpunk-2077', 'red-dead-redemption-2'];

      for (const slug of slugs) {
        jest.clearAllMocks();
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ ...mockGameDetails, slug }),
        } as Response);

        const { result } = renderHook(() => useGame(slug), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining(`/api/games/${slug}?screenshots=true`)
        );
      }
    });
  });

  describe('Error handling', () => {
    it('should handle fetch errors in usePopularGames', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      const { result } = renderHook(() => usePopularGames(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeTruthy();
    });

    it('should handle fetch errors in useGame', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const { result } = renderHook(() => useGame('nonexistent'), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeTruthy();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => usePopularGames(), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Query keys', () => {
    it('should use correct query key for search', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const params = { query: 'zelda', pageSize: 10 };
      const { result } = renderHook(() => useSearchGames(params), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const queryKey = ['games', 'search', params];
      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toBeTruthy();
    });

    it('should use correct query key for game details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameDetails,
      } as Response);

      const slug = 'game-1';
      const { result } = renderHook(() => useGame(slug), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      const queryKey = ['games', 'detail', slug];
      const cachedData = queryClient.getQueryData(queryKey);
      expect(cachedData).toBeTruthy();
    });
  });
});
