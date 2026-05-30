import { type ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from './themeContext';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
}

interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly defaultTheme?: Theme;
  readonly storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'saga-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (globalThis.window === undefined) return defaultTheme;
    const storedTheme = localStorage.getItem(storageKey);
    // Honour an explicit user choice; otherwise always start in `defaultTheme`
    // (dark) regardless of OS-level `prefers-color-scheme`.
    if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;

    // Apply theme: only set attribute for light mode
    // Dark mode is the default (no attribute needed)
    if (theme === 'light') {
      root.dataset.theme = 'light';
    } else {
      root.removeAttribute('data-theme');
    }

    // Save to localStorage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeValue = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
  }, []);

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme: setThemeValue,
    }),
    [theme, toggleTheme, setThemeValue],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
