/**
 * ThemeContext.tsx
 * Target: training-app/src/contexts/ThemeContext.tsx
 *
 * Theme provider with cycling logic across 30 modules.
 * Supports 4 named themes + auto-cycling mode.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ThemeName } from '../types/curriculum';

// ─── Theme Cycling ────────────────────────────────────────────────

const darkThemes: ThemeName[] = ['signal-cobalt', 'gamma-dark'];
const lightThemes: ThemeName[] = ['arctic-steel', 'linear'];

/**
 * Determines the automatic theme for a given module number.
 * Alternates between dark and light in groups of 3 modules:
 *   Modules 01-03: Signal Cobalt (dark)
 *   Modules 04-06: Arctic Steel (light)
 *   Modules 07-09: Gamma Dark (dark)
 *   Modules 10-12: Linear (light)
 *   ...pattern repeats
 */
export function getModuleTheme(moduleNumber: number): ThemeName {
  const groupIndex = Math.floor((moduleNumber - 1) / 3);
  if (groupIndex % 2 === 0) {
    return darkThemes[Math.floor(groupIndex / 2) % darkThemes.length];
  }
  return lightThemes[Math.floor(groupIndex / 2) % lightThemes.length];
}

// ─── Context ──────────────────────────────────────────────────────

interface ThemeContextValue {
  /** The currently active theme name */
  currentTheme: ThemeName;
  /** User's preference: a specific theme or 'auto' for cycling */
  preference: ThemeName | 'auto';
  /** Update the user's theme preference */
  setPreference: (pref: ThemeName | 'auto') => void;
  /** Tell the theme system which module is active (for auto-cycling) */
  applyModuleTheme: (moduleNumber: number) => void;
  /** Whether the current theme is a dark theme */
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_STORAGE_KEY = 'mav-theme-preference';

function loadThemePreference(): ThemeName | 'auto' {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && ['signal-cobalt', 'arctic-steel', 'linear', 'gamma-dark', 'auto'].includes(stored)) {
      return stored as ThemeName | 'auto';
    }
  } catch {
    // localStorage unavailable
  }
  return 'auto';
}

// ─── Provider ─────────────────────────────────────────────────────

export function ThemeProvider({
  children,
  initialModuleNumber = 1,
}: {
  children: ReactNode;
  initialModuleNumber?: number;
}) {
  const [preference, setPreferenceState] = useState<ThemeName | 'auto'>(loadThemePreference);
  const [currentModuleNumber, setCurrentModuleNumber] = useState(initialModuleNumber);

  // Resolve the actual theme: user override or auto-cycled
  const currentTheme: ThemeName =
    preference === 'auto' ? getModuleTheme(currentModuleNumber) : preference;

  const isDark = currentTheme === 'signal-cobalt' || currentTheme === 'gamma-dark';

  const setPreference = useCallback((pref: ThemeName | 'auto') => {
    setPreferenceState(pref);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const applyModuleTheme = useCallback((moduleNumber: number) => {
    setCurrentModuleNumber(moduleNumber);
  }, []);

  // Apply data-theme attribute to <html> for CSS token resolution
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider
      value={{ currentTheme, preference, setPreference, applyModuleTheme, isDark }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
