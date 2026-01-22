'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { usePopularGames, useTrendingGames, useNewReleases } from '@/hooks/use-games';
import FeaturedHero from '@/components/FeaturedHero';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RAWGGame } from '@/types/game.types';

export default function HomePage() {
  const { data: session } = useSession();

  const { data: popularGames, isLoading: loadingPopular } = usePopularGames(20);
  const { data: trendingGames, isLoading: loadingTrending } = useTrendingGames(20);
  const { data: newReleases, isLoading: loadingNew } = useNewReleases(20);

  const heroGames = popularGames?.results?.slice(0, 5) || [];

  return (
    <PageWrapper className="min-h-screen pb-28 lg:pb-10">
        {loadingPopular ? (
          <div className="mx-4 lg:mx-6">
            <Skeleton className="h-[380px] lg:h-[420px] rounded-2xl lg:rounded-3xl" />
          </div>
        ) : (
          heroGames.length > 0 && <FeaturedHero games={heroGames} />
        )}

        <div className="mt-10 space-y-10">
          <CarouselSection
            title="Popular"
            games={popularGames?.results?.slice(5) || []}
            isLoading={loadingPopular}
          />

          <CarouselSection
            title="Trending"
            games={trendingGames?.results || []}
            isLoading={loadingTrending}
          />

          <CarouselSection
            title="New Releases"
            games={newReleases?.results || []}
            isLoading={loadingNew}
          />

          {!session && (
            <section className="text-center py-16 px-6">
              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Track your gaming journey
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your backlog, rank your favorites, and discover new games.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-white text-black hover:bg-white/90"
              >
                <Link href="/register">Get Started</Link>
              </Button>
            </section>
          )}
        </div>
    </PageWrapper>
  );
}

function CarouselSection({
  title,
  games,
  isLoading,
}: {
  title: string;
  games: RAWGGame[];
  isLoading: boolean;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section>
      <div className="flex items-center justify-between px-6 lg:px-10 mb-5">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronLeft className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar px-6 lg:px-10"
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[280px] sm:w-[320px] lg:w-[400px] xl:w-[450px]">
                <Skeleton className="aspect-video rounded-xl" />
                <Skeleton className="h-4 w-3/4 mt-3" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </div>
            ))
          : games.map((game) => <CarouselCard key={game.id} game={game} />)}
      </div>
    </section>
  );
}

function CarouselCard({ game }: { game: RAWGGame }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="shrink-0 w-[280px] sm:w-[320px] lg:w-[400px] xl:w-[450px] group"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-card">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="450px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-3xl opacity-20">🎮</span>
          </div>
        )}

        {game.metacritic && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs font-bold text-white">
            {game.metacritic}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="font-medium text-foreground line-clamp-1 group-hover:text-white/80 transition-colors">
          {game.name}
        </p>
        {game.genres?.[0] && (
          <p className="text-sm text-muted-foreground mt-0.5">{game.genres[0].name}</p>
        )}
      </div>
    </Link>
  );
}
