'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.classList.toggle('dark', stored === 'dark');
      document.documentElement.classList.toggle('light', stored === 'light');

      // Set initial body background color
      if (stored === 'light') {
        document.body.style.backgroundColor = '#f8f8f8';
      } else {
        document.body.style.backgroundColor = '#09090b';
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);

    // Update body background color dynamically
    if (newTheme === 'light') {
      document.body.style.backgroundColor = '#f8f8f8';
    } else {
      document.body.style.backgroundColor = '#09090b';
    }
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return default values for SSR
    if (typeof window === 'undefined') {
      return { theme: 'dark' as Theme, toggleTheme: () => {} };
    }
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
