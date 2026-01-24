import { getGameBySlug, getGameScreenshots } from '@/lib/igdb';
import { adaptIGDBGameDetails } from '@/lib/igdb-adapter';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import GamePageClient from "./GamePageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;

  let game;
  let media;

  try {
    const [rawGame, gameMedia, session] = await Promise.all([
      getGameBySlug(slug),
      getGameScreenshots(slug),
      auth(),
    ]);
    game = adaptIGDBGameDetails(rawGame);
    media = gameMedia;
    const isAuthenticated = !!session?.user;

    return <GamePageClient game={game} media={media} isAuthenticated={isAuthenticated} />;
  } catch {
    notFound();
  }
}
