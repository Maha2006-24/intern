import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext();

const THEMES = [
  { id: "coral", label: "Coral Bloom", shortLabel: "Coral" },
  { id: "ocean", label: "Ocean Mist", shortLabel: "Ocean" },
  { id: "meadow", label: "Meadow Glow", shortLabel: "Meadow" },
];

function getInitialTheme() {
  try {
    const storedTheme = localStorage.getItem("theme");

    return THEMES.some((item) => item.id === storedTheme)
      ? storedTheme
      : THEMES[0].id;
  } catch (error) {
    return THEMES[0].id;
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      // Ignore storage failures and keep the selected theme in memory.
    }
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((currentTheme) => {
      const currentIndex = THEMES.findIndex(
        (item) => item.id === currentTheme
      );

      const nextIndex =
        currentIndex === -1 || currentIndex === THEMES.length - 1
          ? 0
          : currentIndex + 1;

      return THEMES[nextIndex].id;
    });
  }, []);

  const activeTheme = useMemo(
    () => THEMES.find((item) => item.id === theme) || THEMES[0],
    [theme]
  );

  const value = useMemo(
    () => ({
      theme,
      themes: THEMES,
      activeTheme,
      cycleTheme,
      toggleTheme: cycleTheme,
      setTheme,
    }),
    [activeTheme, cycleTheme, theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;
