import { createContext } from 'react';

type Theme = 'light' | 'dark';

export interface ThemeContextType {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
