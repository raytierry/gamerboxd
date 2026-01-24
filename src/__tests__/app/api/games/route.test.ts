/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import type { IGDBGame, IGDBResponse } from '@/types/game.types';

// Mock the modules before importing the route
jest.mock('@/lib/igdb', () => ({
  searchGames: jest.fn(),
}));

jest.mock('@/lib/igdb-adapter', () => ({
  adaptIGDBGame: jest.fn(),
}));

// Now import after mocking
import { GET } from '@/app/api/games/route';
import { searchGames } from '@/lib/igdb';
import { adaptIGDBGame } from '@/lib/igdb-adapter';

const mockSearchGames = searchGames as jest.MockedFunction<typeof searchGames>;
const mockAdaptIGDBGame = adaptIGDBGame as jest.MockedFunction<typeof adaptIGDBGame>;

describe('/api/games route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockIGDBGame: IGDBGame = {
    id: 1,
    slug: 'test-game',
    name: 'Test Game',
    cover: { image_id: 'abc123' },
    first_release_date: 1609459200,
    rating: 85.5,
    aggregated_rating: 90.0,
  };

  const mockAdaptedGame = {
    id: 1,
    slug: 'test-game',
    name: 'Test Game',
    background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/abc123.jpg',
    released: '2021-01-01',
    metacritic: 90,
    rating: 4.275,
    platforms: [],
    genres: [],
    short_screenshots: [],
    stores: [],
    playtime: 0,
    tags: [],
  };

  const mockIGDBResponse: IGDBResponse<IGDBGame> = {
    results: [mockIGDBGame],
    count: 1,
    next: null,
    previous: null,
  };

  it('should fetch and adapt games with default parameters', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: undefined,
      page: 1,
      pageSize: 20,
      ordering: undefined,
      dates: undefined,
      minRating: undefined,
    });
    expect(mockAdaptIGDBGame).toHaveBeenCalledWith(mockIGDBGame);
    expect(data.results).toHaveLength(1);
    expect(data.results[0]).toEqual(mockAdaptedGame);
  });

  it('should handle query parameter', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games?query=zelda');
    const response = await GET(request);

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: 'zelda',
      page: 1,
      pageSize: 20,
      ordering: undefined,
      dates: undefined,
      minRating: undefined,
    });
    expect(response.status).toBe(200);
  });

  it('should handle pagination parameters', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games?page=2&pageSize=10');
    const response = await GET(request);

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: undefined,
      page: 2,
      pageSize: 10,
      ordering: undefined,
      dates: undefined,
      minRating: undefined,
    });
    expect(response.status).toBe(200);
  });

  it('should handle ordering parameter', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games?ordering=-rating');
    const response = await GET(request);

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: undefined,
      page: 1,
      pageSize: 20,
      ordering: '-rating',
      dates: undefined,
      minRating: undefined,
    });
    expect(response.status).toBe(200);
  });

  it('should handle dates parameter', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games?dates=2021-01-01,2021-12-31');
    const response = await GET(request);

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: undefined,
      page: 1,
      pageSize: 20,
      ordering: undefined,
      dates: '2021-01-01,2021-12-31',
      minRating: undefined,
    });
    expect(response.status).toBe(200);
  });

  it('should handle minRating parameter', async () => {
    mockSearchGames.mockResolvedValueOnce(mockIGDBResponse);
    mockAdaptIGDBGame.mockReturnValueOnce(mockAdaptedGame);

    const request = new NextRequest('http://localhost:3000/api/games?minRating=85');
    const response = await GET(request);

    expect(mockSearchGames).toHaveBeenCalledWith({
      query: undefined,
      page: 1,
      pageSize: 20,
      ordering: undefined,
      dates: undefined,
      minRating: 85,
    });
    expect(response.status).toBe(200);
  });

  it('should handle multiple games', async () => {
    const mockGame2: IGDBGame = {
      id: 2,
      slug: 'test-game-2',
      name: 'Test Game 2',
    };

    const mockAdaptedGame2 = {
      ...mockAdaptedGame,
      id: 2,
      slug: 'test-game-2',
      name: 'Test Game 2',
    };

    mockSearchGames.mockResolvedValueOnce({
      results: [mockIGDBGame, mockGame2],
      count: 2,
      next: 'page2',
      previous: null,
    });
    mockAdaptIGDBGame
      .mockReturnValueOnce(mockAdaptedGame)
      .mockReturnValueOnce(mockAdaptedGame2);

    const request = new NextRequest('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();

    expect(data.results).toHaveLength(2);
    expect(data.count).toBe(2);
    expect(data.next).toBe('page2');
  });

  it('should handle errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockSearchGames.mockRejectedValueOnce(new Error('IGDB API error'));

    const request = new NextRequest('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch games');
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching games:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should adapt all games in response', async () => {
    const games: IGDBGame[] = [
      { ...mockIGDBGame, id: 1, slug: 'game-1' },
      { ...mockIGDBGame, id: 2, slug: 'game-2' },
      { ...mockIGDBGame, id: 3, slug: 'game-3' },
    ];

    mockSearchGames.mockResolvedValueOnce({
      results: games,
      count: 3,
      next: null,
      previous: null,
    });

    games.forEach((_, index) => {
      mockAdaptIGDBGame.mockReturnValueOnce({
        ...mockAdaptedGame,
        id: index + 1,
        slug: `game-${index + 1}`,
      });
    });

    const request = new NextRequest('http://localhost:3000/api/games');
    const response = await GET(request);
    const data = await response.json();

    expect(mockAdaptIGDBGame).toHaveBeenCalledTimes(3);
    expect(data.results).toHaveLength(3);
    games.forEach((game, index) => {
      expect(mockAdaptIGDBGame).toHaveBeenNthCalledWith(index + 1, game);
    });
  });
});
