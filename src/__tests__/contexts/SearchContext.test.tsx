import { render, screen, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { SearchProvider, useSearch } from '@/contexts/SearchContext';

describe('SearchContext', () => {
  describe('SearchProvider', () => {
    it('should render children', () => {
      render(
        <SearchProvider>
          <div data-testid="child">Child content</div>
        </SearchProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should provide default values', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: SearchProvider,
      });

      expect(result.current.query).toBe('');
      expect(result.current.isSearching).toBe(false);
    });
  });

  describe('useSearch', () => {
    it('should throw error when used outside provider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useSearch());
      }).toThrow('useSearch must be used within a SearchProvider');

      consoleError.mockRestore();
    });

    it('should update query', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: SearchProvider,
      });

      act(() => {
        result.current.setQuery('zelda');
      });

      expect(result.current.query).toBe('zelda');
      expect(result.current.isSearching).toBe(true);
    });

    it('should set isSearching to false when query is empty', () => {
      const { result } = renderHook(() => useSearch(), {
        wrapper: SearchProvider,
      });

      act(() => {
        result.current.setQuery('test');
      });

      expect(result.current.isSearching).toBe(true);

      act(() => {
        result.current.setQuery('');
      });

      expect(result.current.isSearching).toBe(false);
    });

    it('should share state between components', () => {
      const TestComponent = () => {
        const { query, setQuery } = useSearch();
        return (
          <div>
            <span data-testid="query">{query}</span>
            <button onClick={() => setQuery('shared')}>Update</button>
          </div>
        );
      };

      const ReaderComponent = () => {
        const { query } = useSearch();
        return <span data-testid="reader-query">{query}</span>;
      };

      render(
        <SearchProvider>
          <TestComponent />
          <ReaderComponent />
        </SearchProvider>
      );

      expect(screen.getByTestId('query')).toHaveTextContent('');
      expect(screen.getByTestId('reader-query')).toHaveTextContent('');

      act(() => {
        screen.getByRole('button').click();
      });

      expect(screen.getByTestId('query')).toHaveTextContent('shared');
      expect(screen.getByTestId('reader-query')).toHaveTextContent('shared');
    });
  });
});
