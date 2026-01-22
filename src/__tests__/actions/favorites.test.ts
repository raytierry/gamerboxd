import {
  addToFavorites,
  removeFromFavorites,
  getFavoriteStatus,
  getUserFavorites,
  checkRankConflict,
  getUsedRanks,
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

const mockNewGameData = {
  gameId: 456,
  gameSlug: 'new-game',
  gameName: 'New Game',
  gameImage: 'https://example.com/new.jpg',
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

const mockSecondFavorite = {
  id: 'fav-2',
  userId: 'user-1',
  gameId: 456,
  gameSlug: 'new-game',
  gameName: 'New Game',
  gameImage: 'https://example.com/new.jpg',
  rank: 2,
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

    it('should return no conflict for invalid rank (< 1)', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await checkRankConflict(0);

      expect(result).toEqual({ hasConflict: false });
    });

    it('should return no conflict for invalid rank (> 10)', async () => {
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
      expect(result.existingGame?.gameName).toBe('Test Game');
      expect(result.existingGame?.rank).toBe(1);
    });

    it('should return no conflict when rank is taken by same game', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await checkRankConflict(1, 123);

      expect(result).toEqual({ hasConflict: false });
    });

    it('should return no conflict on database error', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await checkRankConflict(1);

      expect(result).toEqual({ hasConflict: false });
    });
  });

  describe('getUsedRanks', () => {
    it('should return empty array when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await getUsedRanks();

      expect(result).toEqual([]);
    });

    it('should return used ranks with gameIds', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findMany as jest.Mock).mockResolvedValueOnce([
        { rank: 1, gameId: 123 },
        { rank: 3, gameId: 456 },
        { rank: 5, gameId: 789 },
      ]);

      const result = await getUsedRanks();

      expect(result).toEqual([
        { rank: 1, gameId: 123 },
        { rank: 3, gameId: 456 },
        { rank: 5, gameId: 789 },
      ]);
    });

    it('should return empty array on database error', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await getUsedRanks();

      expect(result).toEqual([]);
    });
  });

  describe('addToFavorites', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should return error for invalid rank (< 1)', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await addToFavorites(mockGameData, 0);

      expect(result).toEqual({ success: false, error: 'Rank must be between 1 and 10' });
    });

    it('should return error for invalid rank (> 10)', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);

      const result = await addToFavorites(mockGameData, 11);

      expect(result).toEqual({ success: false, error: 'Rank must be between 1 and 10' });
    });

    it('should return success when same game same rank (no-op)', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(mockFavoriteEntry)
        .mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: true });
    });

    it('should return conflict info when rank is taken without resolution', async () => {
      const conflictingGame = { ...mockFavoriteEntry, gameId: 456, gameName: 'Other Game' };
      
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(conflictingGame)
        .mockResolvedValueOnce(null);

      const result = await addToFavorites(mockGameData, 1);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Rank conflict');
      expect(result.conflict).toBeDefined();
      expect(result.conflict?.gameId).toBe(456);
      expect(result.conflict?.gameName).toBe('Other Game');
    });

    it('should create new favorite when rank is free', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      (mockPrisma.favoriteGame.create as jest.Mock).mockResolvedValueOnce(mockFavoriteEntry);

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: true });
      expect(mockPrisma.favoriteGame.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          gameId: 123,
          rank: 1,
        }),
      });
    });

    it('should update existing game rank when rank is free', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockFavoriteEntry);
      (mockPrisma.favoriteGame.update as jest.Mock).mockResolvedValueOnce({ ...mockFavoriteEntry, rank: 5 });

      const result = await addToFavorites(mockGameData, 5);

      expect(result).toEqual({ success: true });
      expect(mockPrisma.favoriteGame.update).toHaveBeenCalledWith({
        where: { id: 'fav-1' },
        data: { rank: 5 },
      });
    });

    describe('conflict resolution: replace', () => {
      it('should delete conflicting game and create new when using replace', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999, gameName: 'Conflicting Game' };
        const mockTransaction = jest.fn().mockImplementation(async (callback) => {
          const tx = {
            favoriteGame: {
              delete: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          };
          return callback(tx);
        });

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(null);
        (mockPrisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const result = await addToFavorites(mockGameData, 1, { type: 'replace' });

        expect(result).toEqual({ success: true });
        expect(mockPrisma.$transaction).toHaveBeenCalled();
      });

      it('should delete conflicting game and update existing game rank when using replace', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999, gameName: 'Conflicting Game' };
        const currentEntry = { ...mockFavoriteEntry, id: 'current-id', rank: 5 };
        const mockTransaction = jest.fn().mockImplementation(async (callback) => {
          const tx = {
            favoriteGame: {
              delete: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          };
          return callback(tx);
        });

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(currentEntry);
        (mockPrisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const result = await addToFavorites(mockGameData, 1, { type: 'replace' });

        expect(result).toEqual({ success: true });
        expect(mockPrisma.$transaction).toHaveBeenCalled();
      });
    });

    describe('conflict resolution: swap', () => {
      it('should return error for invalid swap rank (< 1)', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999 };

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(null);

        const result = await addToFavorites(mockGameData, 1, { type: 'swap', newRankForOld: 0 });

        expect(result).toEqual({ success: false, error: 'Invalid rank for swap' });
      });

      it('should return error for invalid swap rank (> 10)', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999 };

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(null);

        const result = await addToFavorites(mockGameData, 1, { type: 'swap', newRankForOld: 11 });

        expect(result).toEqual({ success: false, error: 'Invalid rank for swap' });
      });

      it('should swap ranks when current game already has a rank', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999, rank: 1 };
        const currentEntry = { ...mockFavoriteEntry, id: 'current-id', rank: 3 };
        const mockTransaction = jest.fn().mockImplementation(async (callback) => {
          const tx = {
            favoriteGame: {
              update: jest.fn(),
            },
          };
          return callback(tx);
        });

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(currentEntry);
        (mockPrisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const result = await addToFavorites(mockGameData, 1, { type: 'swap', newRankForOld: 5 });

        expect(result).toEqual({ success: true });
        expect(mockPrisma.$transaction).toHaveBeenCalled();
      });

      it('should move conflicting game and create new when current game is not in favorites', async () => {
        const conflictingGame = { ...mockFavoriteEntry, id: 'conflict-id', gameId: 999, rank: 1 };
        const mockTransaction = jest.fn().mockImplementation(async (callback) => {
          const tx = {
            favoriteGame: {
              update: jest.fn(),
              create: jest.fn(),
            },
          };
          return callback(tx);
        });

        mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
        (mockPrisma.favoriteGame.findUnique as jest.Mock)
          .mockResolvedValueOnce(conflictingGame)
          .mockResolvedValueOnce(null);
        (mockPrisma.$transaction as jest.Mock).mockImplementation(mockTransaction);

        const result = await addToFavorites(mockNewGameData, 1, { type: 'swap', newRankForOld: 3 });

        expect(result).toEqual({ success: true });
        expect(mockPrisma.$transaction).toHaveBeenCalled();
      });
    });

    it('should handle database errors gracefully', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.favoriteGame.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await addToFavorites(mockGameData, 1);

      expect(result).toEqual({ success: false, error: 'Failed to add to favorites' });
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
