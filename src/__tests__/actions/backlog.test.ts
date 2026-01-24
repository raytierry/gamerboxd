import {
  addToBacklog,
  removeFromBacklog,
  updateBacklogStatus,
  getBacklogStatus,
  getUserBacklog,
} from '@/actions/backlog';

jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

jest.mock('@/lib/prisma', () => ({
  prisma: {
    backlog_games: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Suppress console.error in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const mockAuth = auth as jest.MockedFunction<typeof auth>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

const mockGameData = {
  gameId: 123,
  gameSlug: 'test-game',
  gameName: 'Test Game',
  gameImage: 'https://example.com/image.jpg',
};

const mockBacklogEntry = {
  id: 'entry-1',
  userId: 'user-1',
  gameId: 123,
  gameSlug: 'test-game',
  gameName: 'Test Game',
  gameImage: 'https://example.com/image.jpg',
  status: 'WANT_TO_PLAY' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Backlog Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToBacklog', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await addToBacklog(mockGameData);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should create new backlog entry when not exists', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findUnique as jest.Mock).mockResolvedValueOnce(null as never);
      (mockPrisma.backlog_games.create as jest.Mock).mockResolvedValueOnce(mockBacklogEntry);

      const result = await addToBacklog(mockGameData);

      expect(result.success).toBe(true);
      expect(mockPrisma.backlog_games.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          gameId: 123,
          gameSlug: 'test-game',
        }),
      });
    });

    it('should update existing entry when exists', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findUnique as jest.Mock).mockResolvedValueOnce(mockBacklogEntry);
      (mockPrisma.backlog_games.update as jest.Mock).mockResolvedValueOnce({
        ...mockBacklogEntry,
        status: 'PLAYING',
      });

      const result = await addToBacklog(mockGameData, 'PLAYING');

      expect(result.success).toBe(true);
      expect(mockPrisma.backlog_games.update).toHaveBeenCalledWith({
        where: { id: 'entry-1' },
        data: { status: 'PLAYING' },
      });
    });

    it('should handle database errors', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await addToBacklog(mockGameData);

      expect(result).toEqual({ success: false, error: 'Failed to add to backlog' });
    });
  });

  describe('removeFromBacklog', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await removeFromBacklog(123);

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should delete backlog entry', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.delete as jest.Mock).mockResolvedValueOnce(mockBacklogEntry);

      const result = await removeFromBacklog(123);

      expect(result).toEqual({ success: true });
      expect(mockPrisma.backlog_games.delete).toHaveBeenCalledWith({
        where: {
          userId_gameId: {
            userId: 'user-1',
            gameId: 123,
          },
        },
      });
    });

    it('should handle database errors', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.delete as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await removeFromBacklog(123);

      expect(result).toEqual({ success: false, error: 'Failed to remove from backlog' });
    });
  });

  describe('updateBacklogStatus', () => {
    it('should return error when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await updateBacklogStatus(123, 'PLAYING');

      expect(result).toEqual({ success: false, error: 'Not authenticated' });
    });

    it('should update status', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.update as jest.Mock).mockResolvedValueOnce({
        ...mockBacklogEntry,
        status: 'COMPLETED',
      });

      const result = await updateBacklogStatus(123, 'COMPLETED');

      expect(result.success).toBe(true);
      expect(mockPrisma.backlog_games.update).toHaveBeenCalledWith({
        where: {
          userId_gameId: {
            userId: 'user-1',
            gameId: 123,
          },
        },
        data: { status: 'COMPLETED' },
      });
    });
  });

  describe('getBacklogStatus', () => {
    it('should return null when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await getBacklogStatus(123);

      expect(result).toBeNull();
    });

    it('should return backlog entry when exists', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findUnique as jest.Mock).mockResolvedValueOnce(mockBacklogEntry);

      const result = await getBacklogStatus(123);

      expect(result).toEqual(mockBacklogEntry);
    });

    it('should return null on error', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findUnique as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await getBacklogStatus(123);

      expect(result).toBeNull();
    });
  });

  describe('getUserBacklog', () => {
    it('should return empty array when not authenticated', async () => {
      mockAuth.mockResolvedValueOnce(null as never);

      const result = await getUserBacklog();

      expect(result).toEqual([]);
    });

    it('should return user backlog', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findMany as jest.Mock).mockResolvedValueOnce([mockBacklogEntry]);

      const result = await getUserBacklog();

      expect(result).toEqual([mockBacklogEntry]);
      expect(mockPrisma.backlog_games.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { updatedAt: 'desc' },
      });
    });

    it('should return empty array on error', async () => {
      mockAuth.mockResolvedValueOnce({ user: { id: 'user-1' } } as never);
      (mockPrisma.backlog_games.findMany as jest.Mock).mockRejectedValueOnce(new Error('DB Error'));

      const result = await getUserBacklog();

      expect(result).toEqual([]);
    });
  });
});
