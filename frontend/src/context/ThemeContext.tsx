import React, { createContext, useContext, useState, useCallback } from 'react';
import { colors as darkColors } from '../styles/colors';

type Theme = 'dark'; 

interface ThemeContextData {
  theme: Theme;
  colors: typeof darkColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme] = useState<Theme>('dark');

  const toggleTheme = useCallback(() => {
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: darkColors,
        toggleTheme,
        isDark: true,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};