import type { IGDBGame, IGDBGameDetails, IGDBResponse } from '@/types/game.types';
import { createIGDBQuery, COMMON_GAME_FIELDS, DETAILED_GAME_FIELDS } from './igdb-query-builder';

const BASE_URL = 'https://api.igdb.com/v4';
const AUTH_URL = 'https://id.twitch.tv/oauth2/token';
const CLIENT_ID = process.env.IGDB_CLIENT_ID;
const CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;

interface SearchGamesParams {
  query?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  dates?: string;
  minRating?: number;
}

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken(): Promise<string> {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  const response = await fetch(
    `${AUTH_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );

  if (!response.ok) {
    throw new Error(`IGDB Auth error: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;

  if (!accessToken) {
    throw new Error('Failed to obtain access token');
  }

  return accessToken;
}

async function igdbRequest<T>(endpoint: string, body: string): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${BASE_URL}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID!,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`IGDB API error (${response.status}):`, errorText);
    console.error('Request body:', body);
    throw new Error(`IGDB API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

export function getImageUrl(
  imageId: string,
  size: 'cover_small' | 'screenshot_med' | 'cover_big' | 'cover_big_2x' | 'screenshot_big' | 'screenshot_huge' | '1080p' = 'cover_big'
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

export async function searchGames({
  query,
  page = 1,
  pageSize = 20,
  ordering = '-rating',
  dates,
  minRating,
}: SearchGamesParams = {}): Promise<IGDBResponse<IGDBGame>> {
  const offset = (page - 1) * pageSize;

  const builder = createIGDBQuery()
    .fields([...COMMON_GAME_FIELDS])
    .limit(pageSize)
    .offset(offset)
    .excludeAdultContent();

  if (query) {
    builder.search(query);
  }

  if (dates) {
    const [startDate, endDate] = dates.split(',');
    const startTimestamp = new Date(startDate).getTime() / 1000;
    const endTimestamp = new Date(endDate).getTime() / 1000;
    builder.whereDateRange('first_release_date', startTimestamp, endTimestamp);
  }

  if (minRating) {
    builder.whereMinRating('rating', minRating);
  }

  if (!query) {
    builder.whereNotNull('rating');
  }

  if (ordering) {
    const sortField = ordering.startsWith('-') ? ordering.slice(1) : ordering;
    const sortDirection = ordering.startsWith('-') ? 'desc' : 'asc';
    builder.sort(sortField, sortDirection);
  }

  const bodyQuery = builder.build();

  try {
    const games = await igdbRequest<IGDBGame[]>('games', bodyQuery);

    return {
      count: games.length === pageSize ? (page + 1) * pageSize : offset + games.length,
      next: games.length === pageSize ? `page=${page + 1}` : null,
      previous: page > 1 ? `page=${page - 1}` : null,
      results: games,
    };
  } catch (error) {
    console.error('Error in searchGames:', error);
    console.error('Query was:', bodyQuery);
    throw error;
  }
}

export async function getGameBySlug(slug: string): Promise<IGDBGameDetails> {
  const query = createIGDBQuery()
    .fields([...DETAILED_GAME_FIELDS])
    .whereEquals('slug', slug)
    .excludeAdultContent()
    .build();

  const games = await igdbRequest<IGDBGameDetails[]>('games', query);

  if (!games || games.length === 0) {
    throw new Error('Game not found');
  }

  return games[0];
}

export async function getGameScreenshots(slug: string) {
  const query = createIGDBQuery()
    .fields(['screenshots.image_id', 'artworks.image_id'])
    .whereEquals('slug', slug)
    .excludeAdultContent()
    .build();

  const games = await igdbRequest<{
    screenshots?: { image_id: string }[];
    artworks?: { image_id: string }[];
  }[]>('games', query);

  if (!games || games.length === 0) {
    throw new Error('Game not found');
  }

  return {
    artworks: games[0].artworks?.map((a) => ({
      id: a.image_id,
      image: getImageUrl(a.image_id, 'screenshot_huge'),
    })) || [],
    results: games[0].screenshots?.map((s) => ({
      id: s.image_id,
      image: getImageUrl(s.image_id, 'screenshot_big'),
    })) || [],
  };
}

export async function getPopularGames(pageSize: number = 20): Promise<IGDBResponse<IGDBGame>> {
  return searchGames({ pageSize, ordering: '-rating' });
}

export async function getHighlightGames(pageSize: number = 20): Promise<IGDBResponse<IGDBGame>> {
  return searchGames({ pageSize, ordering: '-aggregated_rating', minRating: 85 });
}

export async function getTrendingGames(pageSize: number = 20): Promise<IGDBResponse<IGDBGame>> {
  return searchGames({ pageSize, ordering: '-rating', minRating: 70 });
}

export async function getNewReleases(pageSize: number = 20): Promise<IGDBResponse<IGDBGame>> {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const now = new Date();

  return searchGames({
    pageSize,
    ordering: '-first_release_date',
    dates: `${threeMonthsAgo.toISOString().split('T')[0]},${now.toISOString().split('T')[0]}`,
  });
}

export async function getUpcomingGames(pageSize: number = 20): Promise<IGDBResponse<IGDBGame>> {
  const now = new Date();
  const threeMonthsLater = new Date();
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  return searchGames({
    pageSize,
    ordering: 'first_release_date',
    dates: `${now.toISOString().split('T')[0]},${threeMonthsLater.toISOString().split('T')[0]}`,
  });
}
