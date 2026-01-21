'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchGames, usePopularGames } from '@/hooks/use-games';
import { useDebounce } from '@/hooks/use-debounce';
import SearchBar from '@/components/SearchBar';
import GameGrid from '@/components/GameGrid';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  const {
    data: searchResults,
    isLoading: isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchGames({ query: debouncedQuery });

  const { data: popularGames, isLoading: isLoadingPopular } = usePopularGames();

  const isSearchMode = debouncedQuery.length > 0;
  const games = isSearchMode
    ? searchResults?.pages.flatMap((page) => page.results) || []
    : popularGames?.results || [];

  const isLoading = isSearchMode ? isSearching : isLoadingPopular;
  const showHero = !isSearchMode && games.length === 0 && !isLoading;

  return (
    <main className="min-h-screen">
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover your next{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                adventure
              </span>
            </h1>
            <p className="text-gray-400 text-lg">
              Search through 500,000+ games from all platforms
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for any game..."
              size="large"
              autoFocus
            />
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            {isSearchMode ? (
              <motion.div
                key="search-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Results for "{debouncedQuery}"
                    </h2>
                    {searchResults?.pages[0]?.count && (
                      <p className="text-gray-500 text-sm mt-1">
                        {searchResults.pages[0].count.toLocaleString()} games found
                      </p>
                    )}
                  </div>
                </div>

                <GameGrid games={games} isLoading={isLoading && games.length === 0} />

                {hasNextPage && (
                  <div className="mt-12 text-center">
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white px-8"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load more games'}
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="popular-games"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Popular Right Now</h2>
                    <p className="text-gray-500 text-sm">The highest-rated games</p>
                  </div>
                </div>

                <GameGrid games={games} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
