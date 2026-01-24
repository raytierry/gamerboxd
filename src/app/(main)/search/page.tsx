'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, X, Gamepad2, Star, Loader2 } from 'lucide-react';
import { useSearchGames } from '@/hooks/use-games';
import { useSearch } from '@/contexts/SearchContext';
import { useDebounce } from '@/hooks/use-debounce';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { GAME_COVER_PLACEHOLDER } from '@/lib/image-placeholder';
import type { RAWGGame } from '@/types/game.types';
import { formatRating } from '@/lib/format';

export default function SearchPage() {
  const { query, setQuery } = useSearch();
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldReduce = useReducedMotion();

  const {
    data: searchResults,
    isLoading: loadingSearch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchGames({ query: debouncedQuery });

  const searchGames = searchResults?.pages.flatMap((page) => page.results) || [];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const fadeTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { duration: 0.2 };

  const slideTransition = shouldReduce 
    ? { duration: 0.01 } 
    : { duration: 0.3 };

  return (
    <PageWrapper className="min-h-screen pb-28 lg:pb-10">
      {/* Search Header */}
      <div className="px-6 lg:px-10 pt-6 pb-8 lg:pt-12 lg:pb-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8">
            Search Games
          </h1>

          <div
            className="flex items-center gap-3 h-14 lg:h-16 px-5 lg:px-6 rounded-full nav-glass transition-all"
            style={{
              border: '1px solid var(--nav-border-color)',
              boxShadow: 'var(--nav-shadow)',
            }}
          >
            <Search className="w-5 h-5 text-(--nav-icon) shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by game name..."
              className="flex-1 bg-transparent text-base lg:text-lg text-foreground placeholder:text-muted-foreground/60 outline-none border-none min-w-0"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={fadeTransition}
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full text-(--nav-icon) hover:text-(--nav-icon-hover) hover:bg-(--nav-hover) transition-all"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Results Area */}
      <div className="px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!query ? (
              <motion.div
                key="empty"
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={slideTransition}
                className="text-center py-16 lg:py-20"
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-5 rounded-full flex items-center justify-center border border-border bg-secondary/30">
                  <Gamepad2 className="w-9 h-9 lg:w-11 lg:h-11 text-muted-foreground/40" />
                </div>
                <p className="text-foreground text-base lg:text-lg font-medium mb-2">Find your next favorite game</p>
                <p className="text-muted-foreground text-sm">Search by title to explore thousands of games</p>
              </motion.div>
            ) : loadingSearch && searchGames.length === 0 ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
              >
                <p className="text-sm text-muted-foreground mb-6">Searching for &quot;{query}&quot;...</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 pt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={shouldReduce ? { duration: 0 } : { delay: i * 0.03 }}
                    >
                      <div
                        className="rounded-2xl overflow-hidden"
                        style={{
                          border: '1px solid var(--nav-border-color)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                        }}
                      >
                        <Skeleton className="aspect-2/3 rounded-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : searchGames.length === 0 && debouncedQuery ? (
              <motion.div
                key="no-results"
                initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={slideTransition}
                className="text-center py-16 lg:py-20"
              >
                <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-5 rounded-full flex items-center justify-center border border-border bg-secondary/30">
                  <Search className="w-9 h-9 lg:w-11 lg:h-11 text-muted-foreground/50" />
                </div>
                <p className="text-foreground text-base lg:text-lg font-medium mb-2">No games found</p>
                <p className="text-muted-foreground text-sm">Try a different search term</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={fadeTransition}
              >
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground">
                    {searchResults?.pages[0]?.count?.toLocaleString() || 0} games found
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 pt-4">
                  {searchGames.map((game, i) => (
                    <motion.div
                      key={game.id}
                      initial={shouldReduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={shouldReduce ? { duration: 0 } : { delay: i * 0.02, duration: 0.3 }}
                    >
                      <SearchResultCard game={game} />
                    </motion.div>
                  ))}
                </div>

                {hasNextPage && (
                  <div className="mt-10 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="rounded-2xl px-8"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more'}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}

function SearchResultCard({ game }: { game: RAWGGame }) {
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href={`/games/${game.slug}`} className="block group" onClick={handleClick}>
      <motion.div
        className="relative rounded-2xl overflow-hidden"
        style={{
          border: '1px solid var(--nav-border-color)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
        initial={false}
        whileHover={shouldReduce ? undefined : {
          y: -4,
          boxShadow: '0 6px 20px rgba(0,0,0,0.25), 0 3px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.12)',
          transition: { type: 'spring', stiffness: 400, damping: 20 }
        }}
      >
        {/* Loading overlay */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          >
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </motion.div>
        )}

        <div className="relative aspect-2/3 overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={GAME_COVER_PLACEHOLDER}
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {/* Rating badge - always visible on mobile and desktop */}
          {game.metacritic && (
            <div className="absolute top-2.5 right-2.5 z-20">
              <div
                className="px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow-lg"
                style={{
                  background: game.metacritic >= 75
                    ? 'rgba(34, 197, 94, 0.95)'
                    : game.metacritic >= 50
                      ? 'rgba(234, 179, 8, 0.95)'
                      : 'rgba(239, 68, 68, 0.95)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {game.metacritic}
              </div>
            </div>
          )}

          {/* Desktop hover card with details */}
          <div className="hidden lg:block absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div
              className="p-3 rounded-xl"
              style={{
                background: 'rgba(0, 0, 0, 0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-2">
                {game.name}
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {game.rating && game.rating > 0 && (
                  <div className="flex items-center gap-1 text-xs text-white/90">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{formatRating(game.rating)}</span>
                  </div>
                )}
                {game.released && (
                  <span className="text-xs text-white/60">
                    {new Date(game.released).getFullYear()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile title below card */}
      <div className="lg:hidden mt-2 px-1">
        <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
          {game.name}
        </h3>
        {game.rating && game.rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span>{formatRating(game.rating)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
