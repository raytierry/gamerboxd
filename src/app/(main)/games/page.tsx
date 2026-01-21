'use client';

import { useState } from 'react';
import { useSearchGames, usePopularGames } from '@/hooks/use-games';
import { useDebounce } from '@/hooks/use-debounce';
import SearchBar from '@/components/SearchBar';
import GameGrid from '@/components/GameGrid';
import { Button } from '@/components/ui/button';

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

  return (
    <main className="min-h-screen bg-[#0d0d0f]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {isSearchMode ? 'Search Results' : 'Popular Games'}
          </h1>
          <p className="text-gray-400">
            {isSearchMode
              ? `Showing results for "${debouncedQuery}"`
              : 'Discover the most popular games'}
          </p>
        </div>

        <div className="mb-8 max-w-xl">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search for games..."
          />
        </div>

        <GameGrid games={games} isLoading={isLoading && games.length === 0} />

        {isSearchMode && hasNextPage && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="bg-transparent border-[#2a2a2d] text-white hover:bg-[#1a1a1d]"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
