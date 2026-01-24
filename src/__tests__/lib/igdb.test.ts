/**
 * @jest-environment node
 */

describe('IGDB API functions', () => {
  let mockFetch: jest.Mock;
  let searchGames: any;
  let getGameBySlug: any;
  let getGameScreenshots: any;
  let getImageUrl: any;

  const mockAuthResponse = {
    access_token: 'mock-access-token',
    expires_in: 3600,
  };

  const mockGamesResponse = [
    {
      id: 1,
      slug: 'game-1',
      name: 'Game 1',
      cover: { image_id: 'abc123' },
      rating: 85.5,
      first_release_date: 1609459200,
      genres: [{ name: 'Action' }],
      platforms: [{ name: 'PlayStation 5' }],
    },
    {
      id: 2,
      slug: 'game-2',
      name: 'Game 2',
      cover: { image_id: 'def456' },
      rating: 90.0,
      first_release_date: 1640995200,
      genres: [{ name: 'RPG' }],
      platforms: [{ name: 'PC' }],
    },
  ];

  beforeEach(() => {
    // Clear module cache to reset token cache
    jest.resetModules();

    // Setup environment
    process.env.IGDB_CLIENT_ID = 'test-client-id';
    process.env.IGDB_CLIENT_SECRET = 'test-client-secret';

    // Setup mock fetch
    mockFetch = jest.fn();
    global.fetch = mockFetch as any;

    // Import fresh module
    const igdb = require('@/lib/igdb');
    searchGames = igdb.searchGames;
    getGameBySlug = igdb.getGameBySlug;
    getGameScreenshots = igdb.getGameScreenshots;
    getImageUrl = igdb.getImageUrl;
  });

  describe('getImageUrl', () => {
    it('should generate correct image URL', () => {
      const imageId = 'abc123';
      const url = getImageUrl(imageId, 'cover_big');

      expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_big/abc123.jpg');
    });

    it('should use default size if not specified', () => {
      const imageId = 'def456';
      const url = getImageUrl(imageId);

      expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_big/def456.jpg');
    });
  });

  describe('searchGames', () => {
    it('should fetch games successfully', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGamesResponse,
        } as Response);

      const result = await searchGames();

      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(result.results).toHaveLength(2);
      expect(result.results[0].name).toBe('Game 1');
    });

    it('should include search query when provided', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGamesResponse,
        } as Response);

      await searchGames({ query: 'zelda' });

      const gamesCall = mockFetch.mock.calls[1];
      expect(gamesCall[1]?.body).toContain('search "zelda"');
    });

    it('should handle pagination parameters', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGamesResponse,
        } as Response);

      await searchGames({ page: 2, pageSize: 10 });

      const gamesCall = mockFetch.mock.calls[1];
      expect(gamesCall[1]?.body).toContain('limit 10');
      expect(gamesCall[1]?.body).toContain('offset 10');
    });

    it('should filter adult content by default', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGamesResponse,
        } as Response);

      await searchGames();

      const gamesCall = mockFetch.mock.calls[1];
      expect(gamesCall[1]?.body).toContain('themes != (42)');
    });

    it('should throw error on auth failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response);

      await expect(searchGames()).rejects.toThrow('IGDB Auth error: 401');
    });

    it('should throw error on API failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        } as Response);

      await expect(searchGames()).rejects.toThrow('IGDB API error: 500');
    });
  });

  describe('getGameBySlug', () => {
    const mockGameDetails = [
      {
        id: 1,
        slug: 'the-witcher-3',
        name: 'The Witcher 3',
        summary: 'An amazing RPG',
        cover: { image_id: 'xyz789' },
        rating: 92.5,
        first_release_date: 1431993600,
        genres: [{ name: 'RPG' }],
        platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }],
        involved_companies: [
          {
            company: { name: 'CD Projekt Red' },
            developer: true,
            publisher: false,
          },
        ],
      },
    ];

    it('should fetch game details by slug', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGameDetails,
        } as Response);

      const result = await getGameBySlug('the-witcher-3');

      expect(result.name).toBe('The Witcher 3');
      expect(result.summary).toBe('An amazing RPG');
    });

    it('should throw error when game not found', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        } as Response);

      await expect(getGameBySlug('nonexistent')).rejects.toThrow('Game not found');
    });

    it('should filter adult content when fetching by slug', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockGameDetails,
        } as Response);

      await getGameBySlug('the-witcher-3');

      const gamesCall = mockFetch.mock.calls[1];
      expect(gamesCall[1]?.body).toContain('themes != (42)');
    });
  });

  describe('getGameScreenshots', () => {
    it('should fetch screenshots for a game', async () => {
      const mockScreenshotsResponse = [
        {
          screenshots: [{ image_id: 'sc1' }, { image_id: 'sc2' }],
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockScreenshotsResponse,
        } as Response);

      const result = await getGameScreenshots('the-witcher-3');

      expect(result.results).toHaveLength(2);
      expect(result.results[0].id).toBe('sc1');
    });

    it('should return empty array when no screenshots', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [{ screenshots: undefined }],
        } as Response);

      const result = await getGameScreenshots('game-no-screenshots');

      expect(result.results).toHaveLength(0);
    });

    it('should throw error on API failure', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          text: async () => 'Server Error',
        } as Response);

      await expect(getGameScreenshots('some-game')).rejects.toThrow('IGDB API error: 500');
    });

    it('should filter adult content when fetching screenshots', async () => {
      const mockScreenshotsResponse = [
        {
          screenshots: [{ image_id: 'sc1' }],
        },
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockAuthResponse,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockScreenshotsResponse,
        } as Response);

      await getGameScreenshots('the-witcher-3');

      const gamesCall = mockFetch.mock.calls[1];
      expect(gamesCall[1]?.body).toContain('themes != (42)');
    });
  });
});
