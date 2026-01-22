'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Search, X, Gamepad2, Star, Loader2 } from 'lucide-react';
import { useSearchGames } from '@/hooks/use-games';
import { useSearch } from '@/contexts/SearchContext';
import { useDebounce } from '@/hooks/use-debounce';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { RAWGGame } from '@/types/game.types';

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
      {/* Hero Search Header */}
      <div 
        className="relative px-6 lg:px-10 pt-6 pb-8"
        style={{
          background: 'linear-gradient(180deg, rgba(45, 80, 75, 0.15) 0%, transparent 100%)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl lg:text-3xl font-bold text-white text-center mb-6">
            Search Games
          </h1>
          
          <div 
            className="flex items-center gap-3 px-6 py-4 rounded-full border border-white/10 transition-all focus-within:border-white/20 focus-within:bg-white/[0.08]"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <Search className="w-5 h-5 text-white/40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by game name..."
              className="flex-1 bg-transparent text-lg text-white placeholder:text-white/40 outline-none border-none min-w-0"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  animate={shouldReduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                  exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
                  transition={fadeTransition}
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-full bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
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
        <AnimatePresence mode="wait">
          {!query ? (
            <motion.div
              key="empty"
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={shouldReduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={slideTransition}
              className="text-center py-16"
            >
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border border-white/10"
                style={{
                  background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
                }}
              >
                <Gamepad2 className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg mb-2">Find your next favorite game</p>
              <p className="text-white/30 text-sm">Search by title to explore thousands of games</p>
            </motion.div>
          ) : loadingSearch && searchGames.length === 0 ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <p className="text-sm text-white/50 mb-6">Searching for &quot;{query}&quot;...</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={shouldReduce ? false : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={shouldReduce ? { duration: 0 } : { delay: i * 0.03 }}
                    className="rounded-xl overflow-hidden bg-white/5"
                  >
                    <Skeleton className="aspect-[4/3] rounded-none" />
                    <div className="p-3">
                      <Skeleton className="h-4 w-full mb-1.5" />
                      <Skeleton className="h-3 w-2/3" />
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
              className="text-center py-16"
            >
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center border border-white/10"
                style={{
                  background: 'linear-gradient(145deg, rgba(45, 80, 75, 0.2) 0%, rgba(25, 45, 45, 0.3) 100%)',
                }}
              >
                <Search className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/50 text-lg mb-2">No games found</p>
              <p className="text-white/30 text-sm">Try a different search term</p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-white/50">
                  {searchResults?.pages[0]?.count?.toLocaleString() || 0} games found
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

function SearchResultCard({ game }: { game: RAWGGame }) {
  const releaseYear = game.released ? new Date(game.released).getFullYear() : null;
  const shouldReduce = useReducedMotion();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href={`/games/${game.slug}`} className="block" onClick={handleClick}>
      <motion.div
        className="group relative rounded-xl overflow-hidden glass-card"
        initial={false}
        whileHover={shouldReduce ? undefined : { 
          y: -6,
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

        {/* Shine effect overlay */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={shouldReduce ? undefined : { 
            x: '100%', 
            opacity: 1,
            transition: { duration: 0.5, ease: 'easeInOut' }
          }}
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
          }}
        />

        <div className="relative aspect-[4/3] overflow-hidden">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <span className="text-3xl opacity-20">🎮</span>
            </div>
          )}

          {game.metacritic && (
            <motion.div 
              className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold text-white z-20"
              style={{
                background: game.metacritic >= 75 
                  ? 'rgba(34, 197, 94, 0.9)' 
                  : game.metacritic >= 50 
                    ? 'rgba(234, 179, 8, 0.9)' 
                    : 'rgba(239, 68, 68, 0.9)',
              }}
              whileHover={shouldReduce ? undefined : { scale: 1.1 }}
            >
              {game.metacritic}
            </motion.div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-medium text-white text-sm leading-tight line-clamp-2 mb-1.5">
            {game.name}
          </h3>

          <div className="flex items-center gap-2">
            {game.genres?.[0] && (
              <span className="text-[10px] text-white/50">
                {game.genres[0].name}
              </span>
            )}
            {releaseYear && (
              <>
                <span className="text-white/20">·</span>
                <span className="text-[10px] text-white/40">{releaseYear}</span>
              </>
            )}
            {game.rating > 0 && (
              <>
                <span className="text-white/20">·</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-[10px] text-white/50">
                    {game.rating.toFixed(1)}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
