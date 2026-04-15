import { useEffect, useState } from 'react';
import type { AppPreferences } from '../domain/settings/types';

export type ThemePreference = AppPreferences['theme'];
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

const SYSTEM_DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export function resolveThemePreference(theme: ThemePreference): ResolvedTheme {
  if (theme === 'dark' || theme === 'light') {
    return theme;
  }

  if (typeof window !== 'undefined' && window.matchMedia(SYSTEM_DARK_MEDIA_QUERY).matches) {
    return 'dark';
  }

  return 'light';
}

export function applyResolvedTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function applyThemePreference(theme: ThemePreference): void {
  applyResolvedTheme(resolveThemePreference(theme));
}

function subscribeToSystemTheme(onChange: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia(SYSTEM_DARK_MEDIA_QUERY);
  const listener = () => onChange();

  mediaQuery.addEventListener('change', listener);

  return () => {
    mediaQuery.removeEventListener('change', listener);
  };
}

export function useResolvedTheme(theme: ThemePreference): ResolvedTheme {
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveThemePreference(theme));

  useEffect(() => {
    const syncResolvedTheme = () => {
      setResolvedTheme(resolveThemePreference(theme));
    };

    syncResolvedTheme();

    if (theme !== 'system') {
      return;
    }

    return subscribeToSystemTheme(syncResolvedTheme);
  }, [theme]);

  return resolvedTheme;
}
