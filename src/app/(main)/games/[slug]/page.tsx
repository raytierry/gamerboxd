import { Suspense } from 'react';
import { getGameBySlug, getGameScreenshots } from '@/lib/rawg';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import GameActions from '@/components/GameActions';
import { Skeleton } from '@/components/ui/skeleton';

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

  const releaseYear = game.released
    ? new Date(game.released).getFullYear()
    : null;

  return (
    <main className="min-h-screen">
      <div className="relative h-[45vh] min-h-[350px]">
        {game.background_image && (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />

        <div className="absolute top-6 left-6 lg:top-28 lg:left-10">
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/80 hover:text-white border border-white/10 transition-all hover:bg-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.4) 0%, rgba(25, 45, 45, 0.6) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      <div className="relative -mt-24 p-6 lg:p-10">
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {game.genres?.slice(0, 4).map((genre) => (
              <span
                key={genre.id}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80 border border-white/10"
              >
                {genre.name}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {game.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            {game.rating > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>{game.rating.toFixed(1)}</span>
              </div>
            )}
            {releaseYear && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
            )}
            {game.playtime > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{game.playtime}h average</span>
              </div>
            )}
            {game.metacritic && (
              <div 
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-white"
                style={{
                  background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.5) 0%, rgba(25, 45, 45, 0.6) 100%)',
                }}
              >
                {game.metacritic}
              </div>
            )}
          </div>

          <div className="mb-10">
            <GameActions
              game={{
                id: game.id,
                slug: game.slug,
                name: game.name,
                background_image: game.background_image,
              }}
            />
          </div>

          {game.description_raw && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-foreground mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed">
                {game.description_raw}
              </p>
            </section>
          )}

          {screenshots?.results?.length > 0 && (
            <Suspense
              fallback={
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-video rounded-xl" />
                  ))}
                </div>
              }
            >
              <section className="mb-10">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Screenshots
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {screenshots.results
                    .slice(0, 4)
                    .map((screenshot: { id: number; image: string }) => (
                      <div
                        key={screenshot.id}
                        className="relative aspect-video rounded-xl overflow-hidden"
                      >
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

          <section 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl border border-white/10"
            style={{
              background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.1) 0%, rgba(25, 45, 45, 0.15) 100%)',
            }}
          >
            {game.platforms?.length > 0 && (
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Platforms</h3>
                <p className="text-sm text-foreground">
                  {game.platforms.map(({ platform }) => platform.name).join(', ')}
                </p>
              </div>
            )}
            {game.developers?.length > 0 && (
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Developer</h3>
                <p className="text-sm text-foreground">
                  {game.developers.map((d) => d.name).join(', ')}
                </p>
              </div>
            )}
            {game.publishers?.length > 0 && (
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Publisher</h3>
                <p className="text-sm text-foreground">
                  {game.publishers.map((p) => p.name).join(', ')}
                </p>
              </div>
            )}
            {game.released && (
              <div>
                <h3 className="text-sm text-muted-foreground mb-2">Release Date</h3>
                <p className="text-sm text-foreground">
                  {new Date(game.released).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </section>

          <p className="mt-6 text-xs text-white/30">
            Game data provided by{' '}
            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white/70 transition-colors"
            >
              RAWG.io
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
