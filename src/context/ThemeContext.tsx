import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { useTranslation } from 'react-i18next';
import { getTheme } from '../theme';
import type { PaletteMode, Direction } from '@mui/material/styles';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
  direction: Direction;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
  direction: 'ltr',
});

export const useColorMode = () => useContext(ThemeContext);

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create ltr cache
const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer], 
});

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Initialize mode from local storage or default to light
  const [mode, setMode] = useState<PaletteMode>(() => {
    const savedMode = localStorage.getItem('themeMode');
    return (savedMode as PaletteMode) || 'light';
  });

  // Derived direction from i18n language
  const direction: Direction = i18n.dir(i18n.language) as Direction || 'ltr';

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  useEffect(() => {
    document.body.dir = direction;
  }, [direction]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      direction,
    }),
    [mode, direction]
  );

  const theme = useMemo(() => getTheme(mode, direction), [mode, direction]);

  return (
    <ThemeContext.Provider value={colorMode}>
      <CacheProvider value={direction === 'rtl' ? cacheRtl : cacheLtr}>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};
