import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteStatus,
  getUserFavorites,
  checkRankConflict,
} from '@/actions/favorites';

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    favoriteGame: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockGameData = {
  gameId: 123,
  gameSlug: 'test-game',
  gameName: 'Test Game',
  gameImage: 'https://example.com/image.jpg',
};

const mockFavoriteEntry = {
  id: 'fav-1',
  userId: 'user-1',
  gameId: 123,
  gameSlug: 'test-game',
  gameName: 'Test Game',
  gameImage: 'https://example.com/image.jpg',
  rank: 1,
  createdAt: new Date(),
};

describe('Favorites Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRankConflict', () => {
    it('should return no conflict when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await checkRankConflict(1);

      expect(result).toEqual({ hasConflict: false });
    });

    it('should return no conflict for invalid rank', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await checkRankConflict(11);

      expect(result).toEqual({ hasConflict: false });
    });

    it('should return no conflict when rank is free', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockResolvedValueOnce(null);

      const result = await checkRankConflict(1);

      expect(result).toEqual({ hasConflict: false });
    });

    it('should return conflict when rank is taken by another game', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await checkRankConflict(1, 999);

      expect(result.hasConflict).toBe(true);
      expect(result.existingGame).toBeDefined();
      expect(result.existingGame?.gameId).toBe(123);
    });

    it('should return no conflict when rank is taken by same game', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await checkRankConflict(1, 123);

      expect(result).toEqual({ hasConflict: false });
    });
  });

  describe('addToFavorites', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should return error for invalid rank', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await addToFavorites(mockGameData, 0);

      expect(result).toEqual({ success: false, error: 'Rank must be between 1 and 10' });
    });

    it('should return error for rank > 10', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await addToFavorites(mockGameData, 11);

      expect(result).toEqual({ success: false, error: 'Rank must be between 1 and 10' });
    });

    it('should return success when same game same rank', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockFavoriteEntry)
        .mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: true });
    });

    it('should return conflict when rank is taken', async () => {
      const conflictingGame = { ...mockFavoriteEntry, gameId: 456, gameName: 'Other Game' };
      
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(conflictingGame)
        .mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rank conflict');
      expect(result.conflict).toBeDefined();
    });

    it('should create new favorite when rank is free', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      (mockPrisma.favoriteGame.create as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: true });
      expect(mockPrisma.favoriteGame.create).toHaveBeenCalled();
    });
  });

  describe('removeFromFavorites', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await removeFromFavorites(123);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should delete favorite', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.delete as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await removeFromFavorites(123);

      expect(result).toEqual({ success: true });
      expect(mockPrisma.favoriteGame.delete).toHaveBeenCalledWith({
        where: {
          userId_gameId: {
            userId: 'user-1',
            gameId: 123,
          },
        },
      });
    });
  });

  describe('getFavoriteStatus', () => {
    it('should return null when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await getFavoriteStatus(123);

      expect(result).toBeNull();
    });

    it('should return favorite entry when exists', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await getFavoriteStatus(123);

      expect(result).toEqual(mockFavoriteEntry);
    });
  });

  describe('getUserFavorites', () => {
    it('should return empty array when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await getUserFavorites();

      expect(result).toEqual([]);
    });

    it('should return user favorites ordered by rank', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findMany as jest.Mock).mockResolvedValueOnce([mockFavoriteEntry]);

      const result = await getUserFavorites();

      expect(result).toEqual([mockFavoriteEntry]);
      expect(mockPrisma.favoriteGame.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { rank: 'asc' },
      });
    });
  });
});
