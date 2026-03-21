/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { ThemeName } from "../types/curriculum";

type ThemePreference = ThemeName | "auto";

interface ThemeContextValue {
  currentTheme: ThemeName;
  preference: ThemePreference;
  themes: ThemeName[];
  setPreference: (value: ThemePreference) => void;
  applyModuleTheme: (moduleNumber: number) => void;
}

const THEME_STORAGE_KEY = "mav-theme-preference";
const themeOptions: ThemeName[] = [
  "signal-cobalt",
  "arctic-steel",
  "linear",
  "gamma-dark",
];

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "auto") return stored;
    if (stored && themeOptions.includes(stored as ThemeName)) {
      return stored as ThemeName;
    }
  } catch {
    // ignore storage failures
  }
  return "auto";
}

export function getModuleTheme(moduleNumber: number): ThemeName {
  const darkThemes: ThemeName[] = ["signal-cobalt", "gamma-dark"];
  const lightThemes: ThemeName[] = ["arctic-steel", "linear"];
  const groupIndex = Math.floor((moduleNumber - 1) / 3);
  if (groupIndex % 2 === 0) {
    return darkThemes[Math.floor(groupIndex / 2) % darkThemes.length];
  }
  return lightThemes[Math.floor(groupIndex / 2) % lightThemes.length];
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<ThemePreference>(loadThemePreference);
  const [activeModuleNumber, setActiveModuleNumber] = useState(1);

  const currentTheme =
    preference === "auto" ? getModuleTheme(activeModuleNumber) : preference;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch {
      // ignore storage failures
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      currentTheme,
      preference,
      themes: themeOptions,
      setPreference,
      applyModuleTheme: setActiveModuleNumber,
    }),
    [currentTheme, preference, setPreference]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
