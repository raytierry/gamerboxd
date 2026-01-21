/**
 * Types relacionados a jogos
 * Baseados na RAWG API
 */

// Resposta da busca de jogos da RAWG
export interface RAWGGame {
  id: number;
  slug: string;
  name: string;
  released: string | null;
  background_image: string | null;
  rating: number;
  metacritic: number | null;
  playtime: number;
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
  stores: {
    store: {
      id: number;
      name: string;
      slug: string;
    };
  }[];
  short_screenshots: {
    id: number;
    image: string;
  }[];
}

// Resposta paginada da RAWG
export interface RAWGResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Detalhes completos de um jogo (endpoint /games/{slug})
export interface RAWGGameDetails extends RAWGGame {
  description: string;
  description_raw: string;
  website: string;
  reddit_url: string;
  developers: {
    id: number;
    name: string;
    slug: string;
  }[];
  publishers: {
    id: number;
    name: string;
    slug: string;
  }[];
  esrb_rating: {
    id: number;
    name: string;
    slug: string;
  } | null;
}

// Versão simplificada para uso interno (cache no banco)
export interface Game {
  id: number;
  slug: string;
  name: string;
  backgroundImage: string | null;
  metacritic: number | null;
  released: string | null;
}
