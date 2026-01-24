/**
 * Types relacionados a jogos
 * Baseados na IGDB API
 */

// Resposta da busca de jogos da IGDB
export interface IGDBGame {
  id: number;
  slug: string;
  name: string;
  first_release_date?: number; // Unix timestamp
  cover?: {
    image_id: string;
  };
  artworks?: {
    image_id: string;
  }[];
  rating?: number;
  aggregated_rating?: number;
  screenshots?: {
    image_id: string;
  }[];
  platforms?: {
    name: string;
  }[];
  genres?: {
    name: string;
  }[];
  summary?: string;
}

// Resposta paginada da IGDB
export interface IGDBResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Detalhes completos de um jogo
export interface IGDBGameDetails extends IGDBGame {
  storyline?: string;
  url?: string;
  involved_companies?: {
    company: {
      name: string;
    };
    developer: boolean;
    publisher: boolean;
  }[];
  age_ratings?: {
    rating: number;
    category: number;
  }[];
}

// Versão simplificada para uso interno (cache no banco)
export interface Game {
  id: number;
  slug: string;
  name: string;
  backgroundImage: string | null;
  rating: number | null;
  released: string | null;
}

// Tipo para jogos adaptados (formato legado com campos IGDB)
export interface AdaptedGame extends Omit<IGDBGame, 'platforms' | 'genres'> {
  background_image: string | null;
  released: string | null;
  metacritic: number | null;
  playtime: number;
  description_raw?: string;
  platforms: {
    platform: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  genres: {
    id: number;
    name: string;
    slug: string;
  }[];
  tags?: {
    id: number;
    name: string;
    slug: string;
  }[];
  short_screenshots: {
    id: string | number;
    image: string;
  }[];
  stores: unknown[];
}

export interface AdaptedGameDetails extends AdaptedGame {
  description: string;
  description_raw: string;
  website: string;
  reddit_url: string;
  developers: {
    id?: number;
    name: string;
    slug?: string;
  }[];
  publishers: {
    id?: number;
    name: string;
    slug?: string;
  }[];
  esrb_rating: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

// Tipos legados para compatibilidade (serão removidos gradualmente)
export type RAWGGame = AdaptedGame;
export type RAWGResponse<T> = IGDBResponse<T>;
export type RAWGGameDetails = AdaptedGameDetails;
