'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        isSearching: query.length > 0,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}
