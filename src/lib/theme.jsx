import { useEffect } from 'react';

/** The site has one look: deep navy with gold. The "dark" class just selects the navy colour map in index.css. */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  return children;
}
