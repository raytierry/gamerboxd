'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  isSearching: boolean;
  isMobileSearchOpen: boolean;
  setMobileSearchOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [isMobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        isSearching: query.length > 0,
        isMobileSearchOpen,
        setMobileSearchOpen,
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
