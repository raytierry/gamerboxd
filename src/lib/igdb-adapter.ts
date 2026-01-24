/**
 * Adaptador para transformar dados da IGDB no formato esperado pelos componentes
 * Isso permite manter compatibilidade com o código existente enquanto migramos
 */

import type { IGDBGame, IGDBGameDetails } from '@/types/game.types';
import { getImageUrl } from './igdb';

/**
 * Converte Unix timestamp para ISO date string
 */
export function formatReleaseDate(timestamp?: number): string | null {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).toISOString().split('T')[0];
}

/**
 * Converte ISO date string para Unix timestamp
 */
export function parseReleaseDate(dateString?: string): number | undefined {
  if (!dateString) return undefined;
  return Math.floor(new Date(dateString).getTime() / 1000);
}

/**
 * Obtém URL da imagem de capa
 */
export function getGameCoverUrl(game: IGDBGame | IGDBGameDetails, size: 'small' | 'medium' | 'big' = 'big'): string | null {
  if (!game.cover?.image_id) return null;

  const sizeMap = {
    small: 'cover_small',
    medium: 'cover_big',
    big: 'cover_big',
  } as const;

  return getImageUrl(game.cover.image_id, sizeMap[size]);
}

/**
 * Obtém array de URLs de screenshots
 */
export function getGameScreenshotUrls(game: IGDBGame | IGDBGameDetails): string[] {
  if (!game.screenshots) return [];
  return game.screenshots.map(s => getImageUrl(s.image_id, 'screenshot_huge'));
}

/**
 * Extrai desenvolvedores do campo involved_companies
 */
export function getDevelopers(game: IGDBGameDetails): { id?: number; name: string; slug?: string }[] {
  if (!game.involved_companies) return [];

  return game.involved_companies
    .filter(ic => ic.developer)
    .map((ic, index) => ({
      id: index,
      name: ic.company.name,
      slug: ic.company.name.toLowerCase().replace(/\s+/g, '-'),
    }));
}

/**
 * Extrai publishers do campo involved_companies
 */
export function getPublishers(game: IGDBGameDetails): { id?: number; name: string; slug?: string }[] {
  if (!game.involved_companies) return [];

  return game.involved_companies
    .filter(ic => ic.publisher)
    .map((ic, index) => ({
      id: index,
      name: ic.company.name,
      slug: ic.company.name.toLowerCase().replace(/\s+/g, '-'),
    }));
}

/**
 * Adapta um jogo da IGDB para o formato legado (compatibilidade)
 */
export function adaptIGDBGame(game: IGDBGame) {
  return {
    ...game,
    // Adiciona campos compatíveis com RAWG
    background_image: getGameCoverUrl(game),
    released: formatReleaseDate(game.first_release_date),
    metacritic: game.aggregated_rating ? Math.round(game.aggregated_rating) : null,
    playtime: 0, // IGDB não tem esse campo
    description_raw: game.summary,

    // Adapta estrutura de platforms
    platforms: game.platforms?.map(p => ({
      platform: {
        id: 0,
        name: p.name,
        slug: p.name.toLowerCase().replace(/\s+/g, '-'),
      }
    })) || [],

    // Adapta estrutura de genres
    genres: game.genres?.map((g, index) => ({
      id: index,
      name: g.name,
      slug: g.name.toLowerCase().replace(/\s+/g, '-'),
    })) || [],

    // Adiciona short_screenshots (priority: artworks first, then screenshots)
    short_screenshots: [
      // Artworks first (high quality, 16:9 promotional images)
      ...(game.artworks?.map((a, index) => ({
        id: `artwork-${index}`,
        image: getImageUrl(a.image_id, 'screenshot_huge'),
      })) || []),
      // Then screenshots
      ...(game.screenshots?.map((s, index) => ({
        id: `screenshot-${index}`,
        image: getImageUrl(s.image_id, 'screenshot_med'),
      })) || []),
    ],

    // Stores não existem na IGDB
    stores: [],
  };
}

/**
 * Adapta detalhes de um jogo da IGDB para o formato legado
 */
export function adaptIGDBGameDetails(game: IGDBGameDetails) {
  const baseGame = adaptIGDBGame(game);

  return {
    ...baseGame,
    // Adiciona campos de detalhes
    description: game.summary || '',
    description_raw: game.summary || '',
    website: game.url || '',
    reddit_url: '',

    // Adapta desenvolvedores
    developers: getDevelopers(game),

    // Adapta publishers
    publishers: getPublishers(game),

    // ESRB rating - IGDB usa age_ratings com estrutura diferente
    esrb_rating: game.age_ratings && game.age_ratings.length > 0
      ? {
          id: game.age_ratings[0].rating,
          name: getRatingName(game.age_ratings[0].rating),
          slug: getRatingName(game.age_ratings[0].rating).toLowerCase().replace(/\s+/g, '-'),
        }
      : null,
  };
}

/**
 * Converte código de rating da IGDB para nome legível
 * Baseado em: https://api-docs.igdb.com/#age-rating
 */
function getRatingName(rating: number): string {
  const ratingMap: Record<number, string> = {
    1: 'Three',
    2: 'Seven',
    3: 'Twelve',
    4: 'Sixteen',
    5: 'Eighteen',
    6: 'RP',
    7: 'EC',
    8: 'E',
    9: 'E10',
    10: 'T',
    11: 'M',
    12: 'AO',
  };

  return ratingMap[rating] || 'Not Rated';
}
