'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BacklogStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

interface GameData {
  gameId: number;
  gameSlug: string;
  gameName: string;
  gameImage: string | null;
}

export async function addToBacklog(game: GameData, status: BacklogStatus = 'WANT_TO_PLAY') {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const existing = await prisma.backlogGame.findUnique({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId: game.gameId,
        },
      },
    });

    if (existing) {
      const updated = await prisma.backlogGame.update({
        where: { id: existing.id },
        data: { status },
      });
      revalidatePath('/profile');
      return { success: true, data: updated };
    }

    const created = await prisma.backlogGame.create({
      data: {
        userId: session.user.id,
        gameId: game.gameId,
        gameSlug: game.gameSlug,
        gameName: game.gameName,
        gameImage: game.gameImage,
        status,
      },
    });

    revalidatePath('/profile');
    return { success: true, data: created };
  } catch (error) {
    console.error('Error adding to backlog:', error);
    return { success: false, error: 'Failed to add to backlog' };
  }
}

export async function removeFromBacklog(gameId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    await prisma.backlogGame.delete({
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
    console.error('Error removing from backlog:', error);
    return { success: false, error: 'Failed to remove from backlog' };
  }
}

export async function updateBacklogStatus(gameId: number, status: BacklogStatus) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    const updated = await prisma.backlogGame.update({
      where: {
        userId_gameId: {
          userId: session.user.id,
          gameId,
        },
      },
      data: { status },
    });

    revalidatePath('/profile');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Error updating backlog status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}

export async function getBacklogStatus(gameId: number) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  try {
    const entry = await prisma.backlogGame.findUnique({
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

export async function getUserBacklog() {
  const session = await auth();

  if (!session?.user?.id) {
    return [];
  }

  try {
    const backlog = await prisma.backlogGame.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: 'desc' },
    });

    return backlog;
  } catch {
    return [];
  }
}
