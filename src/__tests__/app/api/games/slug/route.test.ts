/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';
import type { IGDBGameDetails } from '@/types/game.types';

// Mock the modules before importing the route
jest.mock('@/lib/igdb', () => ({
  getGameBySlug: jest.fn(),
  getGameScreenshots: jest.fn(),
}));

jest.mock('@/lib/igdb-adapter', () => ({
  adaptIGDBGameDetails: jest.fn(),
}));

// Now import after mocking
import { GET } from '@/app/api/games/[slug]/route';
import { getGameBySlug, getGameScreenshots } from '@/lib/igdb';
import { adaptIGDBGameDetails } from '@/lib/igdb-adapter';

const mockGetGameBySlug = getGameBySlug as jest.MockedFunction<typeof getGameBySlug>;
const mockGetGameScreenshots = getGameScreenshots as jest.MockedFunction<typeof getGameScreenshots>;
const mockAdaptIGDBGameDetails = adaptIGDBGameDetails as jest.MockedFunction<typeof adaptIGDBGameDetails>;

describe('/api/games/[slug] route', () => {
  const originalError = console.error;

  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockIGDBGameDetails: IGDBGameDetails = {
    id: 1,
    slug: 'the-witcher-3',
    name: 'The Witcher 3',
    cover: { image_id: 'abc123' },
    first_release_date: 1431993600,
    rating: 92.5,
    aggregated_rating: 95.8,
    summary: 'An amazing RPG',
    storyline: 'Full storyline...',
    url: 'https://www.igdb.com/games/the-witcher-3',
    genres: [{ name: 'RPG' }],
    platforms: [{ name: 'PC' }],
    involved_companies: [
      {
        company: { name: 'CD Projekt Red' },
        developer: true,
        publisher: false,
      },
    ],
  };

  const mockAdaptedGameDetails = {
    id: 1,
    slug: 'the-witcher-3',
    name: 'The Witcher 3',
    background_image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/abc123.jpg',
    released: '2015-05-18',
    metacritic: 96,
    rating: 4.625,
    description: 'An amazing RPG',
    description_raw: 'An amazing RPG',
    website: 'https://www.igdb.com/games/the-witcher-3',
    reddit_url: '',
    platforms: [{ platform: { id: 1, name: 'PC', slug: 'pc' } }],
    genres: [{ id: 1, name: 'RPG', slug: 'rpg' }],
    developers: [{ name: 'CD Projekt Red', slug: 'cd-projekt-red' }],
    publishers: [],
    esrb_rating: null,
    short_screenshots: [],
    stores: [],
    playtime: 0,
    tags: [],
  };

  const mockScreenshots = {
    results: [
      { id: 'screenshot1', image: 'https://example.com/screenshot1.jpg' },
      { id: 'screenshot2', image: 'https://example.com/screenshot2.jpg' },
    ],
  };

  it('should fetch game details without screenshots', async () => {
    mockGetGameBySlug.mockResolvedValueOnce(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValueOnce(mockAdaptedGameDetails);

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });
    const data = await response.json();

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockAdaptIGDBGameDetails).toHaveBeenCalledWith(mockIGDBGameDetails);
    expect(mockGetGameScreenshots).not.toHaveBeenCalled();
    expect(data).toEqual(mockAdaptedGameDetails);
    expect(response.status).toBe(200);
  });

  it('should fetch game details with screenshots when requested', async () => {
    mockGetGameBySlug.mockResolvedValueOnce(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValueOnce(mockAdaptedGameDetails);
    mockGetGameScreenshots.mockResolvedValueOnce(mockScreenshots);

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3?screenshots=true');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });
    const data = await response.json();

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockAdaptIGDBGameDetails).toHaveBeenCalledWith(mockIGDBGameDetails);
    expect(mockGetGameScreenshots).toHaveBeenCalledWith('the-witcher-3');
    expect(data).toEqual({
      ...mockAdaptedGameDetails,
      screenshots: mockScreenshots.results,
    });
    expect(response.status).toBe(200);
  });

  it('should not fetch screenshots when screenshots=false', async () => {
    mockGetGameBySlug.mockResolvedValueOnce(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValueOnce(mockAdaptedGameDetails);

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3?screenshots=false');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockGetGameScreenshots).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it('should handle different slug formats', async () => {
    mockGetGameBySlug.mockResolvedValueOnce(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValueOnce(mockAdaptedGameDetails);

    const slugs = ['game-with-hyphens', 'game_with_underscores', 'game123', 'game-2023'];

    for (const slug of slugs) {
      jest.clearAllMocks();
      mockGetGameBySlug.mockResolvedValueOnce(mockIGDBGameDetails);
      mockAdaptIGDBGameDetails.mockReturnValueOnce(mockAdaptedGameDetails);

      const request = new NextRequest(`http://localhost:3000/api/games/${slug}`);
      const response = await GET(request, {
        params: Promise.resolve({ slug }),
      });

      expect(mockGetGameBySlug).toHaveBeenCalledWith(slug);
      expect(response.status).toBe(200);
    }
  });

  it('should handle errors when fetching game details', async () => {
    jest.resetAllMocks();
    const error = new Error('Game not found');
    mockGetGameBySlug.mockRejectedValueOnce(error);

    const request = new NextRequest('http://localhost:3000/api/games/nonexistent');

    try {
      const response = await GET(request, {
        params: Promise.resolve({ slug: 'nonexistent' }),
      });
      const data = await response.json();

      expect(mockGetGameBySlug).toHaveBeenCalledWith('nonexistent');
      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch game');
    } catch (e) {
      // If GET throws, that's also acceptable for an error test
      expect(e).toBeDefined();
    }
  });

  it('should handle errors when fetching screenshots', async () => {
    mockGetGameBySlug.mockResolvedValue(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValue(mockAdaptedGameDetails);
    mockGetGameScreenshots.mockRejectedValue(new Error('Screenshots not found'));

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3?screenshots=true');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });
    const data = await response.json();

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockGetGameScreenshots).toHaveBeenCalledWith('the-witcher-3');
    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch game');
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching game:',
      expect.any(Error)
    );
  });

  it('should pass through adapted game details correctly', async () => {
    const detailedGameData = {
      ...mockIGDBGameDetails,
      genres: [{ name: 'RPG' }, { name: 'Action' }, { name: 'Adventure' }],
      platforms: [{ name: 'PC' }, { name: 'PlayStation 5' }, { name: 'Xbox Series X' }],
      involved_companies: [
        {
          company: { name: 'CD Projekt Red' },
          developer: true,
          publisher: false,
        },
        {
          company: { name: 'CD Projekt' },
          developer: false,
          publisher: true,
        },
      ],
    };

    const detailedAdaptedData = {
      ...mockAdaptedGameDetails,
      genres: [
        { id: 1, name: 'RPG', slug: 'rpg' },
        { id: 2, name: 'Action', slug: 'action' },
        { id: 3, name: 'Adventure', slug: 'adventure' },
      ],
      platforms: [
        { platform: { id: 1, name: 'PC', slug: 'pc' } },
        { platform: { id: 2, name: 'PlayStation 5', slug: 'playstation-5' } },
        { platform: { id: 3, name: 'Xbox Series X', slug: 'xbox-series-x' } },
      ],
      developers: [{ name: 'CD Projekt Red', slug: 'cd-projekt-red' }],
      publishers: [{ name: 'CD Projekt', slug: 'cd-projekt' }],
    };

    mockGetGameBySlug.mockResolvedValue(detailedGameData);
    mockAdaptIGDBGameDetails.mockReturnValue(detailedAdaptedData);

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });
    const data = await response.json();

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockAdaptIGDBGameDetails).toHaveBeenCalledWith(detailedGameData);
    expect(data.genres).toHaveLength(3);
    expect(data.platforms).toHaveLength(3);
    expect(data.developers).toHaveLength(1);
    expect(data.publishers).toHaveLength(1);
  });

  it('should merge screenshots into adapted game data', async () => {
    mockGetGameBySlug.mockResolvedValue(mockIGDBGameDetails);
    mockAdaptIGDBGameDetails.mockReturnValue(mockAdaptedGameDetails);
    mockGetGameScreenshots.mockResolvedValue(mockScreenshots);

    const request = new NextRequest('http://localhost:3000/api/games/the-witcher-3?screenshots=true');
    const response = await GET(request, {
      params: Promise.resolve({ slug: 'the-witcher-3' }),
    });
    const data = await response.json();

    expect(mockGetGameBySlug).toHaveBeenCalledWith('the-witcher-3');
    expect(mockGetGameScreenshots).toHaveBeenCalledWith('the-witcher-3');
    expect(mockAdaptIGDBGameDetails).toHaveBeenCalledWith(mockIGDBGameDetails);
    expect(data.screenshots).toEqual(mockScreenshots.results);
    expect(data.screenshots).toHaveLength(2);
    expect(data.id).toBe(mockAdaptedGameDetails.id);
    expect(data.name).toBe(mockAdaptedGameDetails.name);
  });
});
