import { useColorScheme } from 'react-native';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface AppTheme {
  mode: ResolvedTheme;
  background: string;
  card: string;
  cardAlt: string;
  text: string;
  mutedText: string;
  border: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

const lightTheme: AppTheme = {
  mode: 'light',
  background: '#f6f8fb',
  card: '#ffffff',
  cardAlt: '#eef2ff',
  text: '#0f172a',
  mutedText: '#64748b',
  border: '#e2e8f0',
  primary: '#4f46e5',
  success: '#16a34a',
  warning: '#d97706',
  danger: '#dc2626',
};

const darkTheme: AppTheme = {
  mode: 'dark',
  background: '#020617',
  card: '#0f172a',
  cardAlt: '#1e293b',
  text: '#e2e8f0',
  mutedText: '#94a3b8',
  border: '#334155',
  primary: '#818cf8',
  success: '#4ade80',
  warning: '#f59e0b',
  danger: '#f87171',
};

export const resolveThemePreference = (
  preference: ThemePreference,
  system: ResolvedTheme
): ResolvedTheme => (preference === 'system' ? system : preference);

export const getTheme = (resolvedTheme: ResolvedTheme): AppTheme =>
  resolvedTheme === 'dark' ? darkTheme : lightTheme;

export const useSystemTheme = (): ResolvedTheme => {
  const systemTheme = useColorScheme();
  return systemTheme === 'dark' ? 'dark' : 'light';
};

