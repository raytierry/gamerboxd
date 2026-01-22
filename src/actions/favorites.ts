'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface GameData {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

export interface ConflictingGame {
  id: string;
  gameId: number;
  gameName: string;
  gameImage: string | null;
  rank: number;
}

export type ConflictResolution =
  | { type: 'replace' }
  | { type: 'swap'; newRankForOld: number };

export async function checkRankConflict(rank: number, currentGameId?: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return { hasConflict: false };
  }

  if (rank < 1 || rank > 10) {
    return { hasConflict: false };
  }

  try {
    const existingAtRank = await prisma.favoriteGame.findUnique({
      where: {
        userId_rank: {
          userId: session.user.id,
          rank,
        },
      },
    });

    if (!existingAtRank || existingAtRank.gameId === currentGameId) {
      return { hasConflict: false };
    }

    return {
      hasConflict: true,
      existingGame: {
        id: existingAtRank.id,
        gameId: existingAtRank.gameId,
        gameName: existingAtRank.gameName,
        gameImage: existingAtRank.gameImage,
        rank: existingAtRank.rank,
      } as ConflictingGame,
    };
  } catch {
    return { hasConflict: false };
  }
}

export async function getUsedRanks() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const favorites = await prisma.favoriteGame.findMany({
      where: { userId: session.user.id },
      select: { rank: true, gameId: true },
    });

    return favorites.map((f) => ({ rank: f.rank, gameId: f.gameId }));
  } catch {
    return [];
  }
}

export async function addToFavorites(
  game: GameData,
  rank: number,
  conflictResolution?: ConflictResolution
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  if (rank < 1 || rank > 10) {
    return { success: false, error: 'Rank must be between 1 and 10' };
  }

  try {
    const existingAtRank = await prisma.favoriteGame.findUnique({
      where: {
        userId_rank: {
          userId: session.user.id,
          rank,
        },
      },
    });

    const currentGameEntry = await prisma.favoriteGame.findUnique({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId: game.gameId,
        },
      },
    });

    if (existingAtRank && existingAtRank.gameId === game.gameId) {
      return { success: true };
    }

    if (existingAtRank && existingAtRank.gameId !== game.gameId) {
      if (!conflictResolution) {
        return {
          success: false,
          error: 'Rank conflict',
          conflict: {
            id: existingAtRank.id,
            gameId: existingAtRank.gameId,
            gameName: existingAtRank.gameName,
            gameImage: existingAtRank.gameImage,
            rank: existingAtRank.rank,
          } as ConflictingGame,
        };
      }

      if (conflictResolution.type === 'replace') {
        await prisma.$transaction(async (tx) => {
          await tx.favoriteGame.delete({
            where: { id: existingAtRank.id },
          });

          if (currentGameEntry) {
            await tx.favoriteGame.update({
              where: { id: currentGameEntry.id },
              data: { rank },
            });
          } else {
            await tx.favoriteGame.create({
              data: {
                userId: session.user.id,
                gameId: game.gameId,
                gameSlug: game.gameSlug,
                gameName: game.gameName,
                gameImage: game.gameImage,
                rank,
              },
            });
          }
        });
      } else if (conflictResolution.type === 'swap') {
        const newRankForOld = conflictResolution.newRankForOld;

        if (newRankForOld < 1 || newRankForOld > 10) {
          return { success: false, error: 'Invalid rank for swap' };
        }

        await prisma.$transaction(async (tx) => {
          if (currentGameEntry) {
            const tempRank = -1;

            await tx.favoriteGame.update({
              where: { id: existingAtRank.id },
              data: { rank: tempRank },
            });

            await tx.favoriteGame.update({
              where: { id: currentGameEntry.id },
              data: { rank },
            });

            await tx.favoriteGame.update({
              where: { id: existingAtRank.id },
              data: { rank: newRankForOld },
            });
          } else {
            await tx.favoriteGame.update({
              where: { id: existingAtRank.id },
              data: { rank: newRankForOld },
            });

            await tx.favoriteGame.create({
              data: {
                userId: session.user.id,
                gameId: game.gameId,
                gameSlug: game.gameSlug,
                gameName: game.gameName,
                gameImage: game.gameImage,
                rank,
              },
            });
          }
        });
      }
    } else {
      if (currentGameEntry) {
        await prisma.favoriteGame.update({
          where: { id: currentGameEntry.id },
          data: { rank },
        });
      } else {
        await prisma.favoriteGame.create({
          data: {
            userId: session.user.id,
            gameId: game.gameId,
            gameSlug: game.gameSlug,
            gameName: game.gameName,
            gameImage: game.gameImage,
            rank,
          },
        });
      }
    }

    revalidatePath('/profile');
    revalidatePath('/profile/favorites');
    return { success: true };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { success: false, error: 'Failed to add to favorites' };
  }
}

export async function removeFromFavorites(gameId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    await prisma.favoriteGame.delete({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
    });

    revalidatePath('/profile');
    revalidatePath('/profile/favorites');
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false, error: 'Failed to remove from favorites' };
  }
}

export async function getFavoriteStatus(gameId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const entry = await prisma.favoriteGame.findUnique({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
    });

    return entry;
  } catch {
    return null;
  }
}

export async function getUserFavorites() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const favorites = await prisma.favoriteGame.findMany({
      where: { userId: session.user.id },
      orderBy: { rank: 'asc' },
    });

    return favorites;
  } catch {
    return [];
  }
}
