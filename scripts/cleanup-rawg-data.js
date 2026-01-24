require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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

  console.log('Cleanup complete! You can now add games again using IGDB data.');
}

cleanupRawgData()
  .catch((error) => {
    console.error('Error cleaning up data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
