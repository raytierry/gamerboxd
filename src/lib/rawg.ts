import type { RAWGGame, RAWGGameDetails, RAWGResponse } from '@/types/game.types';

const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = process.env.RAWG_API_KEY;

interface SearchGamesParams {
  query?: string;
  page?: number;
  pageSize?: number;
  ordering?: string;
  dates?: string;
  metacritic?: string;
}

const BLOCKED_TAGS = [
  'sexual-content',
  'nsfw',
  'hentai',
  'adult',
  'erotic',
  'nudity',
];

function filterAdultContent(games: RAWGGame[]): RAWGGame[] {
  return games.filter((game) => {
    if (!game.tags) return true;
    const gameTags = game.tags.map((tag) => tag.slug.toLowerCase());
    return !BLOCKED_TAGS.some((blocked) => gameTags.includes(blocked));
  });
}

export async function searchGames({
  query,
  page = 1,
  pageSize = 20,
  ordering,
  dates,
  metacritic,
}: SearchGamesParams = {}): Promise<RAWGResponse<RAWGGame>> {
  const params = new URLSearchParams({
    key: API_KEY!,
    page: String(page),
    page_size: String(pageSize),
  });

  if (query) params.append('search', query);
  if (ordering) params.append('ordering', ordering);
  if (dates) params.append('dates', dates);
  if (metacritic) params.append('metacritic', metacritic);

  const response = await fetch(`${BASE_URL}/games?${params}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }

  const data: RAWGResponse<RAWGGame> = await response.json();
  
  return {
    ...data,
    results: filterAdultContent(data.results),
  };
}

export async function getGameBySlug(slug: string): Promise<RAWGGameDetails> {
  const params = new URLSearchParams({ key: API_KEY! });

  const response = await fetch(`${BASE_URL}/games/${slug}?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }

  return response.json();
}

export async function getGameScreenshots(slug: string) {
  const params = new URLSearchParams({ key: API_KEY! });

  const response = await fetch(`${BASE_URL}/games/${slug}/screenshots?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status}`);
  }

  return response.json();
}
