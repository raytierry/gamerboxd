import { Suspense } from 'react';
import { getGameBySlug, getGameScreenshots } from '@/lib/rawg';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Star, Monitor } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params;

  let game;
  let screenshots;

  try {
    [game, screenshots] = await Promise.all([
      getGameBySlug(slug),
      getGameScreenshots(slug),
    ]);
  } catch {
    notFound();
  }

  const releaseDate = game.released
    ? new Date(game.released).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBA';

  return (
    <main className="min-h-screen bg-[#0d0d0f]">
      <div className="relative h-[50vh] min-h-[400px]">
        {game.background_image && (
          <>
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/60 to-transparent" />
          </>
        )}

        <div className="absolute top-4 left-4">
          <Link
            href="/games"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end gap-4">
              {game.metacritic && (
                <div
                  className={`px-4 py-2 rounded-lg text-2xl font-bold ${
                    game.metacritic >= 75
                      ? 'bg-green-500 text-white'
                      : game.metacritic >= 50
                      ? 'bg-yellow-500 text-black'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {game.metacritic}
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {game.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  {releaseDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {releaseDate}
                    </span>
                  )}
                  {game.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      {game.rating.toFixed(1)}
                    </span>
                  )}
                  {game.playtime > 0 && (
                    <span className="flex items-center gap-1">
                      <Monitor className="h-4 w-4" />
                      {game.playtime}h average
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {game.description_raw && (
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {game.description_raw}
                </p>
              </section>
            )}

            {screenshots?.results?.length > 0 && (
              <Suspense fallback={<div className="h-48 bg-[#1a1a1d] animate-pulse rounded-lg" />}>
                <section>
                  <h2 className="text-xl font-semibold text-white mb-4">Screenshots</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {screenshots.results.slice(0, 4).map((screenshot: { id: number; image: string }) => (
                      <div key={screenshot.id} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={screenshot.image}
                          alt="Screenshot"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </Suspense>
            )}
          </div>

          <div className="space-y-6">
            {game.genres?.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-[#1a1a1d] text-gray-300 text-sm rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {game.platforms?.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map(({ platform }) => (
                    <span
                      key={platform.id}
                      className="px-3 py-1 bg-[#1a1a1d] text-gray-300 text-sm rounded-full"
                    >
                      {platform.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {game.developers?.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Developers</h3>
                <p className="text-white">
                  {game.developers.map((d) => d.name).join(', ')}
                </p>
              </section>
            )}

            {game.publishers?.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Publishers</h3>
                <p className="text-white">
                  {game.publishers.map((p) => p.name).join(', ')}
                </p>
              </section>
            )}

            {game.website && (
              <section>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Website</h3>
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 break-all"
                >
                  {game.website}
                </a>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
