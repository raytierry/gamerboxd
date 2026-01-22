'use client';

import { useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import {
  usePopularGames,
  useTrendingGames,
  useNewReleases,
  useSearchGames,
} from '@/hooks/use-games';
import { useSearch } from '@/contexts/SearchContext';
import { useDebounce } from '@/hooks/use-debounce';
import FeaturedHero from '@/components/FeaturedHero';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RAWGGame } from '@/types/game.types';

export default function HomePage() {
  const { data: session } = useSession();
  const { query, isSearching } = useSearch();
  const debouncedQuery = useDebounce(query, 300);

  const { data: popularGames, isLoading: loadingPopular } = usePopularGames(20);
  const { data: trendingGames, isLoading: loadingTrending } = useTrendingGames(20);
  const { data: newReleases, isLoading: loadingNew } = useNewReleases(20);

  const {
    data: searchResults,
    isLoading: loadingSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchGames({ query: debouncedQuery });

  const heroGames = popularGames?.results?.slice(0, 5) || [];
  const searchGames = searchResults?.pages.flatMap((page) => page.results) || [];

  return (
    <main className="min-h-screen pb-20">

      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="px-6 lg:px-10"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Search Results
                </h1>
                {searchResults?.pages[0]?.count !== undefined && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchResults.pages[0].count.toLocaleString()} games found
                  </p>
                )}
              </div>
            </div>

            {loadingSearch && searchGames.length === 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Skeleton className="aspect-[3/4] rounded-xl" />
                    <Skeleton className="h-4 w-3/4 mt-3" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                  </motion.div>
                ))}
              </div>
            ) : searchGames.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-muted-foreground">No games found for &quot;{debouncedQuery}&quot;</p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3">
                  {searchGames.map((game, i) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.3 }}
                    >
                      <SearchResultCard game={game} />
                    </motion.div>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="mt-12 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="rounded-full px-8 bg-white/5 border-white/10 hover:bg-white/10"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="home-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
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
                  <Button asChild size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90">
                    <Link href="/register">Get Started</Link>
                  </Button>
                </section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function SearchResultCard({ game }: { game: RAWGGame }) {
  return (
    <Link href={`/games/${game.slug}`} className="block group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
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
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[calc(50vw-2rem)] sm:w-[calc(33vw-2rem)] md:w-[calc(25vw-2rem)] lg:w-[calc(16.66vw-3rem)] xl:w-[calc(14.28vw-3rem)] 2xl:w-[calc(12.5vw-3rem)] max-w-[180px]">
                <Skeleton className="aspect-[3/4] rounded-xl" />
                <Skeleton className="h-4 w-3/4 mt-3" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </div>
            ))
          : games.map((game) => (
              <CarouselCard key={game.id} game={game} />
            ))}
      </div>
    </section>
  );
}

function CarouselCard({ game }: { game: RAWGGame }) {
  return (
    <Link
      href={`/games/${game.slug}`}
      className="shrink-0 w-[calc(50vw-2rem)] sm:w-[calc(33vw-2rem)] md:w-[calc(25vw-2rem)] lg:w-[calc(16.66vw-3rem)] xl:w-[calc(14.28vw-3rem)] 2xl:w-[calc(12.5vw-3rem)] max-w-[180px] group"
    >
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-card">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 16vw, 14vw"
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
