import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ThemeContextType {
  isDark: boolean;
}

// Default values for contacts context
export const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(
    typeof window === 'undefined'
      ? true
      : window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const fn = isDark ? 'add' : 'remove';
    document.documentElement.classList[fn]('dark');

    const bgColor = isDark ? '#3E3D3D' : '#FFFFFF';
    document?.querySelector('meta[name="theme-color"]')?.setAttribute('content', bgColor);
  }, [isDark]);

  useEffect(() => {
    setIsDark(
      window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => setIsDark(event.matches));
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark }}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
