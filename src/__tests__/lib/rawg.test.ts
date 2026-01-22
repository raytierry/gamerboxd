import { searchGames, getGameBySlug, getGameScreenshots } from '@/lib/rawg';

global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('RAWG API functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RAWG_API_KEY = 'test-api-key';
  });

  describe('searchGames', () => {
    const mockGamesResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          slug: 'game-1',
          name: 'Game 1',
          background_image: 'https://example.com/game1.jpg',
          tags: [{ id: 1, name: 'Action', slug: 'action' }],
        },
        {
          id: 2,
          slug: 'game-2',
          name: 'Game 2',
          background_image: 'https://example.com/game2.jpg',
          tags: [{ id: 2, name: 'RPG', slug: 'rpg' }],
        },
      ],
    };

    it('should fetch games with default parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      const result = await searchGames();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games'),
        expect.any(Object)
      );
      expect(result.results).toHaveLength(2);
    });

    it('should include search query when provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      await searchGames({ query: 'zelda' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('search=zelda'),
        expect.any(Object)
      );
    });

    it('should filter out adult content', async () => {
      const responseWithAdultContent = {
        ...mockGamesResponse,
        results: [
          ...mockGamesResponse.results,
          {
            id: 3,
            slug: 'adult-game',
            name: 'Adult Game',
            background_image: null,
            tags: [{ id: 99, name: 'NSFW', slug: 'nsfw' }],
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseWithAdultContent,
      } as Response);

      const result = await searchGames();

      expect(result.results).toHaveLength(2);
      expect(result.results.find((g) => g.slug === 'adult-game')).toBeUndefined();
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(searchGames()).rejects.toThrow('RAWG API error: 500');
    });

    it('should handle pagination parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      await searchGames({ page: 2, pageSize: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('page_size=10'),
        expect.any(Object)
      );
    });

    it('should handle ordering parameter', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGamesResponse,
      } as Response);

      await searchGames({ ordering: '-released' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('ordering=-released'),
        expect.any(Object)
      );
    });
  });

  describe('getGameBySlug', () => {
    const mockGameDetails = {
      id: 1,
      slug: 'the-witcher-3',
      name: 'The Witcher 3',
      description: 'An amazing RPG',
      background_image: 'https://example.com/witcher3.jpg',
    };

    it('should fetch game details by slug', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockGameDetails,
      } as Response);

      const result = await getGameBySlug('the-witcher-3');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/the-witcher-3'),
        expect.any(Object)
      );
      expect(result.name).toBe('The Witcher 3');
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(getGameBySlug('nonexistent')).rejects.toThrow('RAWG API error: 404');
    });
  });

  describe('getGameScreenshots', () => {
    const mockScreenshots = {
      results: [
        { id: 1, image: 'https://example.com/screenshot1.jpg' },
        { id: 2, image: 'https://example.com/screenshot2.jpg' },
      ],
    };

    it('should fetch screenshots for a game', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockScreenshots,
      } as Response);

      const result = await getGameScreenshots('the-witcher-3');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.rawg.io/api/games/the-witcher-3/screenshots'),
        expect.any(Object)
      );
      expect(result.results).toHaveLength(2);
    });

    it('should throw error on API failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(getGameScreenshots('some-game')).rejects.toThrow('RAWG API error: 500');
    });
  });
});
