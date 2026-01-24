import {
  formatReleaseDate,
  parseReleaseDate,
  getGameCoverUrl,
  getDevelopers,
  getPublishers,
  adaptIGDBGame,
  adaptIGDBGameDetails,
} from '@/lib/igdb-adapter';
import type { IGDBGame, IGDBGameDetails } from '@/types/game.types';

describe('IGDB Adapter', () => {
  describe('formatReleaseDate', () => {
    it('should convert Unix timestamp to ISO date string', () => {
      const timestamp = 1609459200; // 2021-01-01 00:00:00 UTC
      const result = formatReleaseDate(timestamp);
      expect(result).toBe('2021-01-01');
    });

    it('should return null for undefined timestamp', () => {
      const result = formatReleaseDate(undefined);
      expect(result).toBeNull();
    });
  });

  describe('parseReleaseDate', () => {
    it('should convert ISO date string to Unix timestamp', () => {
      const dateString = '2021-01-01';
      const result = parseReleaseDate(dateString);
      expect(result).toBe(1609459200);
    });

    it('should return undefined for undefined date', () => {
      const result = parseReleaseDate(undefined);
      expect(result).toBeUndefined();
    });
  });

  describe('getGameCoverUrl', () => {
    const mockGame: IGDBGame = {
      id: 1,
      slug: 'test-game',
      name: 'Test Game',
      cover: { image_id: 'abc123' },
    };

    it('should generate correct cover URL with default size', () => {
      const url = getGameCoverUrl(mockGame);
      expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_big_2x/abc123.jpg');
    });

    it('should generate correct cover URL with small size', () => {
      const url = getGameCoverUrl(mockGame, 'small');
      expect(url).toBe('https://images.igdb.com/igdb/image/upload/t_cover_small/abc123.jpg');
    });

    it('should return null if no cover', () => {
      const gameWithoutCover: IGDBGame = {
        id: 1,
        slug: 'no-cover',
        name: 'No Cover Game',
      };
      const url = getGameCoverUrl(gameWithoutCover);
      expect(url).toBeNull();
    });
  });

  describe('getDevelopers', () => {
    const mockGame: IGDBGameDetails = {
      id: 1,
      slug: 'test-game',
      name: 'Test Game',
      involved_companies: [
        {
          company: { name: 'CD Projekt Red' },
          developer: true,
          publisher: false,
        },
        {
          company: { name: 'Nintendo' },
          developer: true,
          publisher: false,
        },
        {
          company: { name: 'EA' },
          developer: false,
          publisher: true,
        },
      ],
    };

    it('should extract developers from involved_companies', () => {
      const developers = getDevelopers(mockGame);
      expect(developers).toHaveLength(2);
      expect(developers[0].name).toBe('CD Projekt Red');
      expect(developers[1].name).toBe('Nintendo');
    });

    it('should return empty array if no involved_companies', () => {
      const gameWithoutCompanies: IGDBGameDetails = {
        id: 1,
        slug: 'test',
        name: 'Test',
      };
      const developers = getDevelopers(gameWithoutCompanies);
      expect(developers).toHaveLength(0);
    });
  });

  describe('getPublishers', () => {
    const mockGame: IGDBGameDetails = {
      id: 1,
      slug: 'test-game',
      name: 'Test Game',
      involved_companies: [
        {
          company: { name: 'CD Projekt' },
          developer: false,
          publisher: true,
        },
        {
          company: { name: 'Bandai Namco' },
          developer: false,
          publisher: true,
        },
        {
          company: { name: 'Valve' },
          developer: true,
          publisher: false,
        },
      ],
    };

    it('should extract publishers from involved_companies', () => {
      const publishers = getPublishers(mockGame);
      expect(publishers).toHaveLength(2);
      expect(publishers[0].name).toBe('CD Projekt');
      expect(publishers[1].name).toBe('Bandai Namco');
    });

    it('should return empty array if no involved_companies', () => {
      const gameWithoutCompanies: IGDBGameDetails = {
        id: 1,
        slug: 'test',
        name: 'Test',
      };
      const publishers = getPublishers(gameWithoutCompanies);
      expect(publishers).toHaveLength(0);
    });
  });

  describe('adaptIGDBGame', () => {
    const mockGame: IGDBGame = {
      id: 1,
      slug: 'the-witcher-3',
      name: 'The Witcher 3',
      cover: { image_id: 'abc123' },
      first_release_date: 1431993600,
      rating: 92.5,
      aggregated_rating: 95.8,
      genres: [{ name: 'RPG' }, { name: 'Action' }],
      platforms: [{ name: 'PC' }, { name: 'PlayStation 4' }],
      screenshots: [{ image_id: 'sc1' }, { image_id: 'sc2' }],
    };

    it('should adapt IGDB game to legacy format', () => {
      const adapted = adaptIGDBGame(mockGame);

      expect(adapted.background_image).toBe(
        'https://images.igdb.com/igdb/image/upload/t_cover_big_2x/abc123.jpg'
      );
      // Check date format (YYYY-MM-DD) rather than exact date due to timezone differences
      expect(adapted.released).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(adapted.released).toContain('2015-05'); // Check year and month
      expect(adapted.metacritic).toBe(96);
      expect(adapted.platforms).toHaveLength(2);
      expect(adapted.platforms[0].platform.name).toBe('PC');
      expect(adapted.genres).toHaveLength(2);
      expect(adapted.genres[0].name).toBe('RPG');
      expect(adapted.short_screenshots).toHaveLength(2);
      expect(adapted.stores).toHaveLength(0);
      expect(adapted.playtime).toBe(0);
    });

    it('should handle game without cover', () => {
      const gameWithoutCover: IGDBGame = {
        ...mockGame,
        cover: undefined,
      };
      const adapted = adaptIGDBGame(gameWithoutCover);
      expect(adapted.background_image).toBeNull();
    });

    it('should handle game without release date', () => {
      const gameWithoutDate: IGDBGame = {
        ...mockGame,
        first_release_date: undefined,
      };
      const adapted = adaptIGDBGame(gameWithoutDate);
      expect(adapted.released).toBeNull();
    });
  });

  describe('adaptIGDBGameDetails', () => {
    const mockGameDetails: IGDBGameDetails = {
      id: 1,
      slug: 'the-witcher-3',
      name: 'The Witcher 3',
      cover: { image_id: 'abc123' },
      first_release_date: 1431993600,
      rating: 92.5,
      aggregated_rating: 95.8,
      summary: 'A story-driven open world RPG',
      storyline: 'Full storyline details...',
      url: 'https://www.igdb.com/games/the-witcher-3',
      genres: [{ name: 'RPG' }],
      platforms: [{ name: 'PC' }],
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
      age_ratings: [
        {
          rating: 11,
          category: 1,
        },
      ],
    };

    it('should adapt IGDB game details to legacy format', () => {
      const adapted = adaptIGDBGameDetails(mockGameDetails);

      expect(adapted.description).toBe('A story-driven open world RPG');
      expect(adapted.description_raw).toBe('A story-driven open world RPG');
      expect(adapted.website).toBe('https://www.igdb.com/games/the-witcher-3');
      expect(adapted.developers).toHaveLength(1);
      expect(adapted.developers[0].name).toBe('CD Projekt Red');
      expect(adapted.publishers).toHaveLength(1);
      expect(adapted.publishers[0].name).toBe('CD Projekt');
      expect(adapted.esrb_rating).not.toBeNull();
      expect(adapted.esrb_rating?.name).toBe('M');
    });

    it('should handle game without summary', () => {
      const gameWithoutSummary: IGDBGameDetails = {
        ...mockGameDetails,
        summary: undefined,
      };
      const adapted = adaptIGDBGameDetails(gameWithoutSummary);
      expect(adapted.description).toBe('');
      expect(adapted.description_raw).toBe('');
    });

    it('should handle game without age ratings', () => {
      const gameWithoutRatings: IGDBGameDetails = {
        ...mockGameDetails,
        age_ratings: undefined,
      };
      const adapted = adaptIGDBGameDetails(gameWithoutRatings);
      expect(adapted.esrb_rating).toBeNull();
    });
  });
});
