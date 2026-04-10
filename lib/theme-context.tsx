'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { Theme } from '@/lib/types';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEMES: { name: Theme; label: string }[] = [
  { name: 'midnight', label: 'Midnight' },
  { name: 'aurora', label: 'Aurora' },
  { name: 'cosmos', label: 'Cosmos' },
  { name: 'ember', label: 'Ember' },
  { name: 'ocean', label: 'Ocean' },
  { name: 'matrix', label: 'Matrix' },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('midnight');

  useEffect(() => {
    const saved = localStorage.getItem('sat-theme') as Theme | null;
    if (saved && THEMES.some((t) => t.name === saved)) {
      setThemeState(saved);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('sat-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme-${theme} min-h-screen`} suppressHydrationWarning>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
