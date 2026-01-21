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

export async function addToFavorites(game: GameData, rank: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  if (rank < 1 || rank > 10) {
    return { success: false, error: 'Rank must be between 1 and 10' };
  }

  try {
    // Check if this rank is already taken
    const existingRank = await prisma.favoriteGame.findUnique({
      where: {
        userId_rank: {
          userId: session.user.id,
          rank,
        },
      },
    });

    // If rank is taken by another game, swap them
    if (existingRank && existingRank.gameId !== game.gameId) {
      // Check if the new game already has a rank
      const existingGame = await prisma.favoriteGame.findUnique({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: game.gameId,
          },
        },
      });

      if (existingGame) {
        // Swap ranks
        await prisma.$transaction([
          prisma.favoriteGame.update({
            where: { id: existingRank.id },
            data: { rank: existingGame.rank },
          }),
          prisma.favoriteGame.update({
            where: { id: existingGame.id },
            data: { rank },
          }),
        ]);
      } else {
        // Move the existing game to a temp rank, add new game, then find new spot
        const allFavorites = await prisma.favoriteGame.findMany({
          where: { userId: session.user.id },
          orderBy: { rank: 'asc' },
        });

        // Find the next available rank
        const usedRanks = new Set(allFavorites.map((f) => f.rank));
        let newRankForExisting = 10;
        for (let i = 10; i >= 1; i--) {
          if (!usedRanks.has(i) || i === rank) {
            newRankForExisting = i;
            break;
          }
        }

        if (newRankForExisting === rank) {
          // Push existing down
          newRankForExisting = Math.min(rank + 1, 10);
        }

        await prisma.$transaction([
          prisma.favoriteGame.update({
            where: { id: existingRank.id },
            data: { rank: newRankForExisting },
          }),
          prisma.favoriteGame.create({
            data: {
              userId: session.user.id,
              gameId: game.gameId,
              gameSlug: game.gameSlug,
              gameName: game.gameName,
              gameImage: game.gameImage,
              rank,
            },
          }),
        ]);
      }
    } else if (existingRank && existingRank.gameId === game.gameId) {
      // Same game, same rank - no change needed
      return { success: true };
    } else {
      // Check if game already exists with different rank
      const existingGame = await prisma.favoriteGame.findUnique({
        where: {
          userId_gameId: {
            userId: session.user.id,
            gameId: game.gameId,
          },
        },
      });

      if (existingGame) {
        // Update rank
        await prisma.favoriteGame.update({
          where: { id: existingGame.id },
          data: { rank },
        });
      } else {
        // Create new favorite
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
