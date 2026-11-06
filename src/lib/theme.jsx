import { useEffect } from 'react';

/** The site has one look: deep navy with architectural light blue and off-white. The "dark" class selects the navy palette in index.css. */
export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  return children;
}
