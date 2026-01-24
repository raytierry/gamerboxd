import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupRawgData() {
  console.log('Cleaning up old RAWG data...');

  // Delete all backlog entries with RAWG images
  const deletedBacklog = await prisma.backlog_games.deleteMany({
    where: {
      gameImage: {
        contains: 'rawg.io',
      },
    },
  });

  console.log(`Deleted ${deletedBacklog.count} backlog entries with RAWG images`);

  // Delete all favorite entries with RAWG images
  const deletedFavorites = await prisma.favorite_games.deleteMany({
    where: {
      gameImage: {
        contains: 'rawg.io',
      },
    },
  });

  console.log(`Deleted ${deletedFavorites.count} favorite entries with RAWG images`);

  console.log('Cleanup complete!');
}

cleanupRawgData()
  .catch((error) => {
    console.error('Error cleaning up data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
